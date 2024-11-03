const express = require('express')
const Event = require('../models/Event')
const Vehicle = require('../models/Vehicle')
const User = require('../models/User')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const { format, startOfToday, endOfToday, startOfTomorrow, endOfTomorrow, endOfWeek, endOfMonth } = require('date-fns')
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

const parseBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value
  } else if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true
    } else if (value.toLowerCase() === 'false') {
      return false
    }
  }
  return null
}

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

    // Obtener eventos a los que el usuario asistirá
    const attendeeEvents = await Event.find({
      'attendees.userId': userId,
      startDate: { $gte: today }
    }).sort({ startDate: 1 })
      .populate('owner', 'name lastName userAvatar description')
      .populate('attendees.userId', 'name lastName userAvatar')
      .populate('attendees.vehicleId', 'brand model nickname image')

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

// Inscribir a un usuario en un evento
eventsRouter.post('/enroll/:id', auth, async (req, res) => {
  const eventId = req.params.id
  const { vehicleId } = req.body

  // Validar que vehicleId está presente
  if (!vehicleId) {
    return res.status(400).json({ success: false, message: 'vehicleId es requerido.' })
  }

  const userId = req.user.id // Obtener el userId del usuario autenticado

  // Iniciar una sesión para la transacción
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Validar que el usuario exista
    const user = await User.findById(userId).session(session)
    if (!user) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' })
    }

    // Validar que el vehículo exista y pertenezca al usuario
    const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: userId }).session(session)
    if (!vehicle) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Vehículo no encontrado o no te pertenece.' })
    }

    // Buscar el evento por ID
    const event = await Event.findById(eventId).session(session)
    if (!event) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Evento no encontrado.' })
    }

    // Verificar si el usuario es el propietario del evento
    if (event.owner.toString() === userId) {
      await session.abortTransaction()
      session.endSession()
      return res.status(403).json({ success: false, message: 'No puedes inscribirte en tu propio evento.' })
    }

    // Verificar si el usuario ya está inscrito
    const isAlreadyEnrolled = event.attendees.some(attendee => attendee.userId.toString() === userId)
    if (isAlreadyEnrolled) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ success: false, message: 'Ya estás inscrito en este evento.' })
    }

    // Verificar si hay entradas disponibles
    if (event.availableSeats <= 0) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ success: false, message: 'No hay entradas disponibles para este evento.' })
    }

    // Inscribir al usuario en el evento
    event.attendees.push({ userId, vehicleId })
    event.attendeesCount += 1
    event.availableSeats -= 1

    await event.save({ session })

    // Confirmar la transacción
    await session.commitTransaction()
    session.endSession()

    // Población de datos para la respuesta
    const populatedEvent = await Event.findById(eventId)
      .populate('attendees.userId', 'name lastName userAvatar')
      .populate('attendees.vehicleId', 'brand model image')
      .populate('owner', 'name lastName userAvatar')
      .exec()

    res.status(200).json({ success: true, message: 'Inscripción exitosa.', event: populatedEvent })
  } catch (error) {
    console.error('Error en la inscripción:', error)
    // Abortando la transacción en caso de error
    await session.abortTransaction()
    session.endSession()
    res.status(500).json({ success: false, message: 'Error interno del servidor.' })
  }
})

eventsRouter.get('/:id/enrollment', auth, async (req, res) => {
  const eventId = req.params.id
  const userId = req.user.id

  try {
    const event = await Event.findById(eventId)
      .populate('attendees.userId', 'name lastName userAvatar')
      .populate('attendees.vehicleId', 'brand model image')
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

// Obtener la lista de tickets de un evento
eventsRouter.get('/:id/tickets', auth, async (req, res) => {
  const { id } = req.params

  try {
    const event = await Event.findById(id).select('tickets')

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    res.status(200).json({ success: true, tickets: event.tickets })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Crear un nuevo ticket para un evento
eventsRouter.post('/:id/tickets', auth, async (req, res) => {
  const { id } = req.params
  const { type, price } = req.body

  try {
    const event = await Event.findById(id)

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // Verificar si el usuario autenticado es el propietario del evento
    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to add tickets to this event' })
    }

    // Validar los datos del ticket
    if (!type || !['free', 'paid'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid ticket type' })
    }

    if (type === 'paid' && (price === undefined || isNaN(price))) {
      return res.status(400).json({ success: false, message: 'Price is required for paid tickets' })
    }

    // Crear y agregar el nuevo ticket
    const newTicket = { type, price: type === 'paid' ? Number(price) : 0 }
    event.tickets.push(newTicket)

    // Si el nuevo ticket es de tipo 'paid', establecer 'approvalRequired' a false
    if (newTicket.type === 'paid' && event.approvalRequired) {
      event.approvalRequired = false
    }

    // Guardar el evento actualizado
    await event.save()

    res.status(201).json({ success: true, tickets: event.tickets })
  } catch (error) {
    console.error('Error adding ticket:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Actualizar un ticket existente
eventsRouter.put('/:id/tickets/:ticketId', auth, async (req, res) => {
  const { id, ticketId } = req.params
  const { type, price } = req.body

  try {
    const event = await Event.findById(id)

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // Verificar si el usuario autenticado es el propietario del evento
    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update tickets for this event' })
    }

    // Encontrar el ticket por su ID
    const ticket = event.tickets.id(ticketId)
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' })
    }

    // Validar los datos del ticket
    if (!type || !['free', 'paid'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid ticket type' })
    }

    if (type === 'paid' && (price === undefined || isNaN(price))) {
      return res.status(400).json({ success: false, message: 'Price is required for paid tickets' })
    }

    // Actualizar los campos del ticket
    ticket.type = type
    ticket.price = type === 'paid' ? Number(price) : 0

    // Verificar si el evento tiene algún ticket de tipo 'paid'
    const isEventPaid = event.tickets.some((t) => t.type === 'paid')

    // Si el evento es de pago y 'approvalRequired' es true, establecerlo en false
    if (isEventPaid && event.approvalRequired) {
      event.approvalRequired = false
    }

    // Guardar el evento actualizado
    await event.save()

    res.status(200).json({ success: true, ticket })
  } catch (error) {
    console.error('Error updating ticket:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Eliminar un ticket existente
eventsRouter.delete('/:id/tickets/:ticketId', auth, async (req, res) => {
  const { id, ticketId } = req.params

  try {
    const event = await Event.findById(id)

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // Verificar si el usuario autenticado es el propietario del evento
    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete tickets from this event' })
    }

    // Encontrar el ticket por su ID y eliminarlo
    const ticket = event.tickets.id(ticketId)
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' })
    }

    ticket.remove()

    // Después de eliminar el ticket, verificar si el evento aún es de pago
    const isEventPaid = event.tickets.some((t) => t.type === 'paid')

    // Si ya no hay tickets de pago y 'approvalRequired' es false, podríamos permitir al organizador habilitarlo nuevamente
    if (!isEventPaid) {
      // Opcional: Dejar 'approvalRequired' como está o notificar al organizador
      // Por ahora, no hacemos cambios automáticos
    }

    // Guardar el evento actualizado
    await event.save()

    res.status(200).json({ success: true, message: 'Ticket deleted successfully' })
  } catch (error) {
    console.error('Error deleting ticket:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
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
// Ruta PUT para actualizar un evento
eventsRouter.put('/:id', auth, upload.single('image'), async (req, res) => {
  const { id } = req.params
  const {
    title,
    startDate,
    endDate,
    location,
    locationCoordinates,
    description,
    eventType,
    shortLocation,
    terrain,
    experience,
    tickets,
    capacity,
    approvalRequired
  } = req.body

  try {
    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // Verificar si el usuario autenticado es el propietario del evento
    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' })
    }

    // Parsear 'approvalRequired' a booleano
    const parsedApprovalRequired = parseBoolean(approvalRequired)
    if (parsedApprovalRequired === null) {
      return res.status(400).json({ success: false, message: 'ApprovalRequired must be a boolean value.' })
    }

    // Procesar y actualizar la imagen si se proporciona una nueva
    let imageUrl = event.image // Mantener la imagen actual por defecto
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
    // Asignar la URL de la imagen al evento
    event.image = imageUrl

    // Parsear 'locationCoordinates' desde JSON si es una cadena
    let parsedLocationCoordinates = locationCoordinates
    if (typeof locationCoordinates === 'string') {
      try {
        parsedLocationCoordinates = JSON.parse(locationCoordinates)
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid format for locationCoordinates.' })
      }
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

    // Parsear 'tickets' desde JSON si es una cadena
    let parsedTickets = tickets
    if (typeof tickets === 'string') {
      try {
        parsedTickets = JSON.parse(tickets)
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid format for tickets.' })
      }
    }

    // Validar que 'tickets' sea un arreglo
    if (!Array.isArray(parsedTickets)) {
      return res.status(400).json({ success: false, message: 'Tickets must be an array.' })
    }

    // Validar cada ticket individualmente
    for (const [index, ticket] of parsedTickets.entries()) {
      if (!ticket.type) {
        return res.status(400).json({ success: false, message: `Ticket at index ${index} is missing the 'type' field.` })
      }
      if (ticket.type === 'paid') {
        if (ticket.price === undefined || ticket.price === null || isNaN(ticket.price)) {
          return res.status(400).json({ success: false, message: `Paid ticket at index ${index} must have a valid 'price'.` })
        }
      }
    }

    // Determinar si el evento es de pago
    const isEventPaid = parsedTickets.some((ticket) => ticket.type === 'paid')

    // Validar que 'approvalRequired' sea 'false' si el evento es de pago
    if (isEventPaid && parsedApprovalRequired) {
      return res.status(400).json({
        success: false,
        message: 'Los eventos de pago no pueden requerir aprobación.'
      })
    }

    // Actualizar los campos del evento
    event.title = title
    event.startDate = new Date(startDate)
    event.endDate = new Date(endDate)
    event.location = location
    event.shortLocation = shortLocation
    event.locationCoordinates = parsedLocationCoordinates
    event.image = imageUrl
    event.description = description
    event.eventType = eventType
    event.terrain = terrain
    event.experience = experience
    event.tickets = parsedTickets
    event.capacity = capacity
    event.approvalRequired = parsedApprovalRequired

    // Guardar los cambios
    const updatedEvent = await event.save()

    res.status(200).json({ success: true, event: updatedEvent })
  } catch (error) {
    console.error('Error actualizando el evento:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Obtener un evento por su ID
eventsRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    // Buscar el evento por ID y popular los campos especificados del owner
    const event = await Event.findById(id)
      .populate('owner', 'name lastName userAvatar description')
      .populate('attendees.userId', 'name lastName userAvatar email')
      .populate('attendees.vehicleId', 'brand model nickname image')

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    res.status(200).json({
      success: true,
      event: event
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
      capacity,
      approvalRequired
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
      !terrain ||
      !experience ||
      !tickets ||
      !capacity ||
      approvalRequired === undefined
    ) {
      return res.status(400).json({ success: false, message: 'All fields are required.' })
    }

    // Parsear 'approvalRequired' a booleano
    const parsedApprovalRequired = parseBoolean(approvalRequired)
    if (parsedApprovalRequired === null) {
      return res.status(400).json({ success: false, message: 'ApprovalRequired must be a boolean value.' })
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

    // Parsear 'tickets' desde JSON si es una cadena
    let parsedTickets
    if (typeof tickets === 'string') {
      try {
        parsedTickets = JSON.parse(tickets)
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid format for tickets.' })
      }
    } else {
      parsedTickets = tickets
    }

    // Validar que 'tickets' sea un arreglo no vacío
    if (!Array.isArray(parsedTickets) || parsedTickets.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one ticket is required.' })
    }

    // Validar cada ticket individualmente
    for (const [index, ticket] of parsedTickets.entries()) {
      if (!ticket.type) {
        return res.status(400).json({ success: false, message: `Ticket at index ${index} is missing the 'type' field.` })
      }
      if (ticket.type === 'paid') {
        if (ticket.price === undefined || ticket.price === null || isNaN(ticket.price)) {
          return res.status(400).json({ success: false, message: `Paid ticket at index ${index} must have a valid 'price'.` })
        }
      }
    }

    // Determinar si el evento es de pago
    const isEventPaid = parsedTickets.some((ticket) => ticket.type === 'paid')

    // Validar que 'approvalRequired' sea 'false' si el evento es de pago
    if (isEventPaid && parsedApprovalRequired) {
      return res.status(400).json({
        success: false,
        message: 'Los eventos de pago no pueden requerir aprobación.'
      })
    }

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
      tickets: parsedTickets,
      capacity,
      approvalRequired: parsedApprovalRequired,
      owner: req.user.id
    })

    // Guardar el evento en la base de datos
    const savedEvent = await newEvent.save()

    // Responder con el evento creado
    return res.status(201).json({ success: true, event: savedEvent })
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

    console.log('Received parameters:', { lat, lng, radius, eventTypes, timeFilter, terrain, experience, ticketType })

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

    // Obtener los eventos que coinciden con los filtros
    const events = await Event.find(query)
      .populate('owner', 'name lastName userAvatar description')
      .sort({ startDate: 1 })

    res.json({ events })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching events' })
  }
})

module.exports = eventsRouter

// Función auxiliar para calcular la distancia entre dos puntos geográficos (Haversine formula)
// function calculateDistance(coords1, coords2) {
//   const [lng1, lat1] = coords1
//   const [lng2, lat2] = coords2
//   const R = 6371 // Radio de la Tierra en km
//   const dLat = (lat2 - lat1) * (Math.PI / 180)
//   const dLng = (lng2 - lng1) * (Math.PI / 180)
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//     Math.sin(dLng / 2) * Math.sin(dLng / 2)
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
//   const distance = R * c // Distancia en km
//   return distance
// }
