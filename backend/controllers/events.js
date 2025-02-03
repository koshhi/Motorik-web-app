const express = require('express')
const Event = require('../models/Event')
const Vehicle = require('../models/Vehicle')
const User = require('../models/User')
const Ticket = require('../models/Ticket')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const { validateTickets, parseBoolean, validatePaidEvent } = require('../utils/validators')
const { sendEnrollmentConfirmationEmail } = require('../services/emailService')

const {
  format,
  startOfToday,
  endOfToday,
  startOfTomorrow,
  endOfTomorrow,
  endOfWeek,
  endOfMonth
} = require('date-fns')
const eventsRouter = express.Router()
const cloudinary = require('cloudinary').v2
const multer = require('multer')

// Cargar variables de entorno
dotenv.config()

// Configurar Cloudinary para usar la variable de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configurar Multer para manejo de archivos
const storage = multer.diskStorage({})
const upload = multer({ storage })

// Obtener los eventos de un usuario autenticado (futuros y pasados)
eventsRouter.get('/my-events', auth, async (req, res) => {
  try {
    const userId = req.user.id
    const today = new Date()

    // Obtener eventos futuros organizados por el usuario
    const futureEvents = await Event.find({
      owner: userId,
      startDate: { $gte: today }
    }).sort({ startDate: 1 })
      .populate('owner', 'name lastName userAvatar description')
      .populate('tickets')

    // Obtener eventos a los que el usuario asistirá
    const attendeeEvents = await Event.find({
      'attendees.userId': userId,
      startDate: { $gte: today }
    }).sort({ startDate: 1 })
      .populate('owner', 'name lastName userAvatar description')
      .populate('attendees.userId', 'name lastName userAvatar')
      .populate('attendees.vehicleId', 'brand model nickname image')
      .populate('attendees.ticketId')

    res.status(200).json({ success: true, futureEvents, attendeeEvents })
  } catch (error) {
    console.error('Error al obtener los eventos del usuario:', error)
    res.status(500).json({ success: false, message: 'Error al obtener los eventos' })
  }
})

// Obtener los eventos que organiza y a los que asiste un usuario por su ID
eventsRouter.get('/:userId/events', async (req, res) => {
  try {
    const userId = req.params.userId

    // Validar que el ID proporcionado sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario no válido'
      })
    }

    // Convertir el userId a un ObjectId de Mongoose
    const objectId = new mongoose.Types.ObjectId(userId)

    // Obtener los eventos organizados por el usuario
    const futureEvents = await Event.find({
      owner: objectId,
      startDate: { $gte: new Date() }
    }).populate('owner')
      .populate('tickets')
      .exec()

    // Obtener los eventos a los que asistirá el usuario
    const attendeeEvents = await Event.find({
      'attendees.userId': objectId,
      startDate: { $gte: new Date() }
    }).populate('attendees.userId')

    res.status(200).json({
      success: true,
      futureEvents,
      attendeeEvents
    })
  } catch (error) {
    console.error('Error al obtener los eventos:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener los eventos del usuario'
    })
  }
})

// Aprobar una inscripción
eventsRouter.post('/:eventId/attendees/:attendeeId/approve', auth, async (req, res) => {
  const { eventId, attendeeId } = req.params

  try {
    const event = await Event.findById(eventId)
      .populate('attendees.userId', 'name lastName userAvatar email')
      .populate('attendees.vehicleId', 'brand model nickname image')
      .populate('attendees.ticketId')

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado.' })
    }

    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No autorizado.' })
    }

    const attendee = event.attendees.id(attendeeId)
    if (!attendee) {
      return res.status(404).json({ success: false, message: 'Asistente no encontrado.' })
    }

    // El estado antes era "confirmation pending"
    const oldStatus = attendee.status
    attendee.status = 'attending'

    await event.save()

    // Enviar segundo correo de confirmación solo si el estado anterior era "confirmation pending"
    if (oldStatus === 'confirmation pending') {
      // Obtener datos del usuario y del ticket
      const userEnrolled = attendee.userId
      const ticket = attendee.ticketId
      const vehicle = attendee.vehicleId

      // Importa la función de email
      // Estado ahora es 'attending'
      await sendEnrollmentConfirmationEmail(
        userEnrolled.email,
        event,
        ticket,
        vehicle,
        'attending'
      )
    }

    res.status(200).json({ success: true, message: 'Inscripción aprobada.', attendee })
  } catch (error) {
    console.error('Error al aprobar la inscripción:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor.' })
  }
})

// Rechazar una inscripción
eventsRouter.post('/:eventId/attendees/:attendeeId/reject', auth, async (req, res) => {
  const { eventId, attendeeId } = req.params

  try {
    const event = await Event.findById(eventId)

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado.' })
    }

    // Verificar si el usuario es el organizador
    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No autorizado.' })
    }

    const attendee = event.attendees.id(attendeeId)
    if (!attendee) {
      return res.status(404).json({ success: false, message: 'Asistente no encontrado.' })
    }

    // Actualizar el estado a 'not attending' y liberar el cupo
    attendee.status = 'not attending'
    event.attendeesCount -= 1
    event.availableSeats += 1

    await event.save()

    res.status(200).json({ success: true, message: 'Inscripción rechazada.', attendee })
  } catch (error) {
    console.error('Error al rechazar la inscripción:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor.' })
  }
})

// Cancelar inscripción de un usuario
eventsRouter.post('/:eventId/attendees/cancel', auth, async (req, res) => {
  const { eventId } = req.params
  const userId = req.user.id

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const event = await Event.findById(eventId).populate('tickets').session(session)

    if (!event) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Evento no encontrado.' })
    }

    const attendee = event.attendees.find(
      (att) => att.userId.toString() === userId && att.status !== 'not attending'
    )

    if (!attendee) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'No estás inscrito en este evento.' })
    }

    // Actualizar el estado a 'not attending'
    attendee.status = 'not attending'
    // Recuperar el ticket y restaurar asientos
    const ticket = event.tickets.find(t => t._id.toString() === attendee.ticketId.toString())
    if (ticket) {
      ticket.availableSeats += 1
      await ticket.save({ session })
    }
    event.attendeesCount -= 1
    // event.availableSeats += 1

    await event.save({ session })

    // Remover el eventId de user.enrolledEvents
    const user = await User.findById(userId).session(session)
    if (user) {
      user.enrolledEvents = user.enrolledEvents.filter(eId => eId.toString() !== eventId)
      await user.save({ session })
    }

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({ success: true, message: 'Inscripción cancelada.', attendee, event })
  } catch (error) {
    console.error('Error al cancelar la inscripción:', error)
    await session.abortTransaction()
    session.endSession()
    res.status(500).json({ success: false, message: 'Error interno del servidor.' })
  }
})

// Inscribir a un usuario en un evento
eventsRouter.post('/enroll/:id', auth, async (req, res) => {
  const eventId = req.params.id
  const { vehicleId, ticketId } = req.body
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const user = await User.findById(req.user.id).session(session)
    if (!user) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' })
    }

    const event = await Event.findById(eventId).populate('tickets').session(session)
    if (!event) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Evento no encontrado.' })
    }

    const needsVehicle = !!event.needsVehicle

    if (needsVehicle && !vehicleId) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ success: false, message: 'vehicleId es requerido porque el evento requiere vehículo.' })
    }

    if (event.owner.toString() === req.user.id) {
      await session.abortTransaction()
      session.endSession()
      return res.status(403).json({ success: false, message: 'No puedes inscribirte en tu propio evento.' })
    }

    const isAlreadyEnrolled = event.attendees.some(attendee => attendee.userId.toString() === req.user.id)
    if (isAlreadyEnrolled) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ success: false, message: 'Ya estás inscrito en este evento.' })
    }

    const ticket = event.tickets.find(t => t._id.toString() === ticketId)
    if (!ticket) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Ticket no encontrado en este evento.' })
    }

    if (ticket.availableSeats <= 0) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ success: false, message: 'No hay asientos disponibles.' })
    }

    // Verificar que el vehículo pertenece al usuario
    if (needsVehicle) {
      const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: user._id }).session(session)
      if (!vehicle) {
        await session.abortTransaction()
        session.endSession()
        return res.status(400).json({ success: false, message: 'Vehículo no encontrado o no te pertenece.' })
      }
    }

    let status = 'attending'
    if (ticket.approvalRequired) {
      status = 'confirmation pending'
    }

    event.attendees.push({ userId: req.user.id, vehicleId: vehicleId || undefined, ticketId, status })
    ticket.availableSeats -= 1
    await ticket.save({ session })
    await event.save({ session })
    console.log('Evento después de save:', event)

    // Poblar el evento actualizado con la sesión
    const updatedEvent = await Event.findById(eventId)
      .populate('attendees.userId', 'name lastName userAvatar email')
      .populate('attendees.vehicleId', 'brand model image nickname year')
      .populate('attendees.ticketId')
      .populate('owner', 'name lastName userAvatar')
      .populate('tickets')
      .session(session) // Asegurar que la sesión se utiliza aquí
      .exec()

    console.log('Evento actualizado con populate:', updatedEvent)

    const availableSeats = updatedEvent.tickets.reduce((sum, ticket) => sum + ticket.availableSeats, 0)

    const eventObject = updatedEvent.toObject()
    eventObject.availableSeats = availableSeats

    await session.commitTransaction()
    session.endSession()

    // Enviar correo de confirmación
    try {
      await sendEnrollmentConfirmationEmail(
        user.email,
        event,
        ticket,
        vehicleId ? await Vehicle.findById(vehicleId) : null,
        status
      )
    } catch (emailError) {
      console.error('Error enviando correo:', emailError)
    }

    res.status(200).json({ success: true, message: 'Inscripción exitosa.', event: eventObject })
  } catch (error) {
    console.error('Error en la inscripción:', error)
    await session.abortTransaction()
    session.endSession()
    res.status(500).json({ success: false, message: 'Error interno' })
  }
})

eventsRouter.get('/:id/enrollment', auth, async (req, res) => {
  const eventId = req.params.id
  const userId = req.user.id

  try {
    const event = await Event.findById(eventId)
      .populate('attendees.userId', 'name lastName userAvatar')
      .populate('attendees.vehicleId', 'brand model image')
      .populate('attendees.ticketId')
      .populate('owner', 'name lastName userAvatar')
      .exec()

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado.' })
    }

    const enrollment = event.attendees.find(attendee => attendee.userId._id.toString() === userId)

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'No tienes una inscripción en este evento.' })
    }

    res.status(200).json({ success: true, enrollment, event })
  } catch (error) {
    console.error('Error al obtener los detalles de inscripción:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor.' })
  }
})

// Publicar un evento
eventsRouter.post('/:id/publish', auth, async (req, res) => {
  const { id } = req.params

  try {
    const event = await Event.findById(id)

    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado.' })
    }

    // Verificar si el usuario es el organizador
    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No autorizado.' })
    }

    // Publicar el evento
    event.published = true

    await event.save()

    // Poblar los campos necesarios antes de devolver el evento
    const populatedEvent = await Event.findById(id)
      .populate('owner', 'name lastName userAvatar description')
      .populate('attendees.userId', 'name lastName userAvatar email')
      .populate('attendees.vehicleId', 'brand model nickname image')
      .populate('attendees.ticketId')
      .populate('tickets') // Asegúrate de que el modelo de Ticket esté correctamente configurado
      .exec()

    res.status(200).json({ success: true, message: 'Evento publicado exitosamente.', event: populatedEvent })
  } catch (error) {
    console.error('Error al publicar el evento:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor.' })
  }
})

// Eliminar un evento por id
eventsRouter.delete('/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // Verificar si el usuario autenticado es el propietario del evento
    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' })
    }

    // Eliminar el evento
    await event.deleteOne()

    // Eliminar la referencia del evento del usuario
    const user = await User.findById(req.user.id)
    if (user) {
      user.organizedEvents = user.organizedEvents.filter(e => e.toString() !== id)
      user.enrolledEvents = user.enrolledEvents.filter(e => e.toString() !== id)
      await user.save()
    }

    res.status(200).json({ success: true, message: 'Event deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Actualizar un evento
eventsRouter.put('/:id', auth, upload.single('image'), async (req, res) => {
  const { id } = req.params
  const {
    title,
    startDate,
    endDate,
    location,
    shortLocation,
    locationCoordinates,
    description,
    eventType,
    terrain,
    experience,
    needsVehicle
  } = req.body

  try {
    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' })
    }

    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No autorizado' })
    }

    let imageUrl = event.image
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'events',
          resource_type: 'image'
        })
        imageUrl = result.secure_url
      } catch (error) {
        console.error('Error subiendo imagen:', error)
        return res.status(500).json({ success: false, message: 'Error subiendo imagen' })
      }
    }

    let parsedLocationCoordinates
    if (typeof locationCoordinates === 'string') {
      try {
        parsedLocationCoordinates = JSON.parse(locationCoordinates)
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Formato inválido para locationCoordinates.' })
      }
    } else {
      parsedLocationCoordinates = locationCoordinates
    }

    if (
      !parsedLocationCoordinates ||
      parsedLocationCoordinates.type !== 'Point' ||
      !Array.isArray(parsedLocationCoordinates.coordinates) ||
      parsedLocationCoordinates.coordinates.length !== 2 ||
      typeof parsedLocationCoordinates.coordinates[0] !== 'number' ||
      typeof parsedLocationCoordinates.coordinates[1] !== 'number'
    ) {
      return res.status(400).json({ success: false, message: 'Formato inválido para locationCoordinates.' })
    }

    // Parsear needsVehicle a boolean
    const parsedNeedsVehicle = needsVehicle === 'true'

    event.title = title
    event.startDate = new Date(startDate)
    event.endDate = new Date(endDate)
    event.location = location
    event.shortLocation = shortLocation
    event.locationCoordinates = parsedLocationCoordinates
    event.description = description
    event.eventType = eventType
    event.terrain = terrain
    event.experience = experience
    event.needsVehicle = parsedNeedsVehicle
    event.image = imageUrl

    let parsedTickets
    try {
      parsedTickets = typeof req.body.tickets === 'string'
        ? JSON.parse(req.body.tickets)
        : req.body.tickets

      // Validar la estructura de los tickets
      validateTickets(parsedTickets)

      // VALIDACIÓN: si se incluye al menos un ticket de pago, el usuario debe tener cuenta Stripe activa
      validatePaidEvent(req.user, parsedTickets)
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message })
    }

    const updatedEvent = await event.save()
    res.status(200).json({ success: true, event: updatedEvent })
  } catch (error) {
    console.error('Error actualizando evento:', error)
    res.status(500).json({ success: false, message: 'Error interno' })
  }
})

// Obtener un evento por su ID
eventsRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    // Buscar el evento por ID y popular los campos especificados del owner
    const event = await Event.findById(id)
      .populate('owner', 'name lastName userAvatar description socialMediaLinks')
      .populate('attendees.userId', 'name lastName userAvatar email')
      .populate('attendees.vehicleId', 'brand model nickname image')
      .populate({
        path: 'attendees.ticketId',
        select: 'name type price availableSeats'
      })
      .populate('tickets')
      .exec()

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // Calcular availableSeats como la suma de availableSeats de todos los tickets
    const availableSeats = event.tickets.reduce((sum, ticket) => sum + ticket.availableSeats, 0)

    const eventObject = event.toObject()
    eventObject.availableSeats = availableSeats

    res.status(200).json({
      success: true,
      event: eventObject
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Crear un evento
eventsRouter.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    // Extraer campos del cuerpo de la solicitud
    const {
      title,
      startDate,
      endDate,
      location,
      shortLocation,
      locationCoordinates,
      description,
      eventType,
      terrain,
      experience,
      tickets,
      needsVehicle
    } = req.body

    // Validar la existencia de los campos obligatorios
    if (
      !title ||
      !startDate ||
      !endDate ||
      !location ||
      !locationCoordinates ||
      !description ||
      !eventType ||
      !experience ||
      !terrain
    ) {
      return res.status(400).json({ success: false, message: 'All fields are required.' })
    }

    // Parsear 'locationCoordinates' desde JSON si es una cadena
    let parsedLocationCoordinates
    if (typeof locationCoordinates === 'string') {
      try {
        parsedLocationCoordinates = JSON.parse(locationCoordinates)
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid format for locationCoordinates.' })
      }
    } else {
      parsedLocationCoordinates = locationCoordinates
    }

    // Validar que 'locationCoordinates' tenga la estructura correcta
    if (
      !parsedLocationCoordinates ||
      parsedLocationCoordinates.type !== 'Point' ||
      !Array.isArray(parsedLocationCoordinates.coordinates) ||
      parsedLocationCoordinates.coordinates.length !== 2 ||
      typeof parsedLocationCoordinates.coordinates[0] !== 'number' ||
      typeof parsedLocationCoordinates.coordinates[1] !== 'number'
    ) {
      return res.status(400).json({ success: false, message: 'Invalid locationCoordinates format.' })
    }

    let parsedTickets
    try {
      parsedTickets = typeof req.body.tickets === 'string'
        ? JSON.parse(req.body.tickets)
        : req.body.tickets

      // Validar la estructura de cada ticket
      validateTickets(parsedTickets)

      // VALIDACIÓN: si hay al menos un ticket de pago, el usuario debe tener una cuenta Stripe válida
      validatePaidEvent(req.user, parsedTickets)
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message })
    }

    // Calcular la capacidad total del evento como la suma de las capacidades de los tickets
    const capacity = parsedTickets.reduce((acc, ticket) => acc + ticket.capacity, 0)

    // Manejar la carga de la imagen si se proporciona
    let imageUrl = ''
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'events', // Puedes organizar las imágenes en carpetas específicas
          resource_type: 'image'
        })
        imageUrl = result.secure_url
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error)
        return res.status(500).json({ success: false, message: 'Failed to upload image.' })
      }
    }

    // Parsear needsVehicle a boolean
    const parsedNeedsVehicle = needsVehicle === 'true'

    // Crear una nueva instancia del modelo Event
    const newEvent = new Event({
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      shortLocation,
      locationCoordinates: parsedLocationCoordinates,
      image: imageUrl,
      description,
      eventType,
      terrain,
      experience,
      owner: req.user.id,
      published: false,
      capacity,
      needsVehicle: parsedNeedsVehicle
    })

    // Guardar el evento en la base de datos
    const savedEvent = await newEvent.save()

    // Crear los tickets asociados
    const ticketsToSave = parsedTickets.map(ticketData => ({
      ...ticketData,
      eventId: savedEvent._id,
      availableSeats: ticketData.capacity
    }))

    const insertedTickets = await Ticket.insertMany(ticketsToSave)

    // Actualizar el evento con los IDs de los tickets creados
    savedEvent.tickets = insertedTickets.map(ticket => ticket._id)
    await savedEvent.save()

    // Obtener el evento con los tickets poblados
    const eventWithTickets = await Event.findById(savedEvent._id)
      .populate('tickets')
      .exec()

    // Responder con el evento creado incluyendo los tickets
    return res.status(201).json({ success: true, event: eventWithTickets })
  } catch (error) {
    console.error('Error creating event:', error)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Obtener todos los eventos (con filtros y ordenados por proximidad de fecha)
eventsRouter.get('/', async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius,
      eventTypes,
      timeFilter,
      terrain,
      experience,
      ticketType
    } = req.query

    // console.log('Received parameters:', { lat, lng, radius, eventTypes, timeFilter, terrain, experience, ticketType })

    const query = {}

    // Parsear lat, lng y radius a números
    const latNum = parseFloat(lat)
    const lngNum = parseFloat(lng)
    const radiusNum = parseFloat(radius) || 1000

    // Filtro de ubicación geoespacial
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      query.locationCoordinates = {
        $geoWithin: {
          $centerSphere: [[lngNum, latNum], radiusNum / 6378.1]
        }
      }
    }

    // Filtro de tipos de eventos (eventTypes)
    if (eventTypes) {
      const eventTypesArray = [].concat(eventTypes)
      query.eventType = { $in: eventTypesArray }
    }

    // Filtro de terreno
    if (terrain) {
      query.terrain = terrain
    }

    // Filtro de experiencia
    if (experience) {
      query.experience = experience
    }

    // Filtro de tipo de ticket
    if (ticketType) {
      query.tickets = { $elemMatch: { type: ticketType } }
    }

    // Filtrar eventos por tiempo
    const today = startOfToday()

    // // Filtro de ubicación geoespacial
    // if (lat && lng) {
    //   query.locationCoordinates = {
    //     $geoWithin: {
    //       $centerSphere: [[lng, lat], radius / 6378.1] // Convertir el radio a radianes
    //     }
    //   }
    // }

    // // Filtro de tipos de eventos (eventTypes)
    // if (eventTypes) {
    //   query.eventType = { $in: Array.isArray(eventTypes) ? eventTypes : [eventTypes] }
    // }

    // // Filtro de terreno
    // if (terrain) {
    //   query.terrain = terrain
    // }

    // // Filtro de experiencia
    // if (experience) {
    //   query.experience = experience
    // }

    // // Filtro de tipo de ticket
    // if (ticketType) {
    //   query['ticket.type'] = ticketType
    // }

    // // Filtrar eventos por tiempo
    // const today = startOfToday()

    query.startDate = { $gte: today }

    if (timeFilter) {
      switch (timeFilter) {
        case 'today':
          query.startDate = { $gte: startOfToday(), $lte: endOfToday() }
          break
        case 'tomorrow':
          query.startDate = { $gte: startOfTomorrow(), $lte: endOfTomorrow() }
          break
        case 'this_week':
          query.startDate = { $gte: today, $lte: endOfWeek(today) }
          break
        case 'this_month':
          query.startDate = { $gte: today, $lte: endOfMonth(today) }
          break
        case 'flexible':
          // No aplicar ningún filtro de tiempo específico adicional
          break
        default:
          break
      }
    }

    query.published = true

    // Obtener los eventos que coinciden con los filtros
    const events = await Event.find(query)
      .populate('owner', 'name lastName userAvatar description')
      .populate('tickets')
      .sort({ startDate: 1 })
      .exec()

    res.json({ events })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching events' })
  }
})

module.exports = eventsRouter
