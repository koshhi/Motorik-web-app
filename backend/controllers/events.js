const express = require('express')
const Event = require('../models/Event')
const User = require('../models/User')
const auth = require('../middleware/auth')
const { format, startOfToday, endOfToday, startOfTomorrow, endOfTomorrow, endOfWeek, endOfMonth } = require('date-fns')
const eventsRouter = express.Router()

// Crear un evento (autenticado)
// eventsRouter.post('/', auth, async (req, res) => {
//   const { title, startDate, endDate, location, locationCoordinates, image, description, eventType } = req.body

//   if (!locationCoordinates || !locationCoordinates.coordinates || locationCoordinates.coordinates.length !== 2) {
//     return res.status(400).json({ success: false, message: 'Invalid location coordinates.' })
//   }

//   try {
//     const newEvent = new Event({
//       title,
//       startDate,
//       endDate,
//       location,
//       locationCoordinates, // Asegúrate de que las coordenadas están en el formato correcto
//       image,
//       description,
//       eventType,
//       attendees: [req.user.username],
//       owner: req.user._id
//     })

//     const savedEvent = await newEvent.save()

//     // Asociar el evento con el usuario
//     const user = await User.findById(req.user.id)
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' })
//     }

//     // Añadir el ID del evento al usuario
//     user.events.push(savedEvent._id)

//     // Guardar los cambios en el usuario
//     await user.save()

//     res.status(201).json({ success: true, event: savedEvent })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ success: false, message: 'Internal Server Error' })
//   }
// })

// Crear un evento (autenticado)
eventsRouter.post('/', auth, async (req, res) => {
  const { title, startDate, endDate, location, locationCoordinates, image, description, eventType, shortLocation } = req.body

  if (!locationCoordinates || !locationCoordinates.coordinates || locationCoordinates.coordinates.length !== 2) {
    return res.status(400).json({ success: false, message: 'Invalid location coordinates.' })
  }

  try {
    // Crear un nuevo evento
    const newEvent = new Event({
      title,
      startDate,
      endDate,
      location,
      shortLocation,
      locationCoordinates, // Asegúrate de que las coordenadas están en el formato correcto
      image,
      description,
      eventType,
      attendees: [req.user.username], // Añadimos al creador como primer asistente
      owner: req.user._id // Asignamos el ID del usuario autenticado como el propietario del evento
    })

    console.log({ newEvent })

    const savedEvent = await newEvent.save()

    // Asociar el evento con el usuario autenticado
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.organizedEvents.push(savedEvent._id)
    user.enrolledEvents.push(savedEvent._id)

    await user.save()// Guardar los cambios en el usuario

    res.status(201).json({ success: true, event: savedEvent })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Obtener todos los eventos (con filtros y ordenados por proximidad de fecha)
eventsRouter.get('/', async (req, res) => {
  const eventTypes = req.query.eventTypes ? req.query.eventTypes.split(',') : [] // Recibe las tipologías como un array
  const timeFilter = req.query.timeFilter || null
  const lat = parseFloat(req.query.lat)
  const lng = parseFloat(req.query.lng)
  const radius = parseFloat(req.query.radius) || 50 // Radio por defecto en kilómetros

  try {
    const query = {}

    // Filtrar por categorías (tipologías)
    if (eventTypes.length > 0) {
      query.eventType = { $in: eventTypes }
    }

    // Obtener hoy
    const today = startOfToday(new Date())

    // Asegurarse de no mostrar eventos anteriores a hoy
    query.startDate = { $gte: today }

    // Filtrar por tiempo
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

    // Filtrar por proximidad geográfica (si se proporcionan coordenadas)
    if (!isNaN(lat) && !isNaN(lng)) {
      query.locationCoordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius * 1000 // Convertir el radio de kilómetros a metros
        }
      }
    }

    // Ejecutar la consulta
    const events = await Event.find(query).sort({ startDate: 1 })

    res.status(200).json({ success: true, events })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Obtener un evento por su ID
eventsRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // Formatear las fechas antes de devolver la respuesta
    // const formattedStartDate = format(new Date(event.startDate), 'MMMM do, yyyy H:mm a')
    // const formattedEndDate = format(new Date(event.endDate), 'MMMM do, yyyy H:mm a')
    console.log({ event })
    res.status(200).json({
      success: true,
      // event: {
      //   ...event._doc, // Incluimos todos los campos del evento
      //   startDate: formattedStartDate,
      //   endDate: formattedEndDate
      // }
      event: event
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

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

module.exports = eventsRouter
