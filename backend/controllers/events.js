const express = require('express')
const Event = require('../models/Event')
const User = require('../models/User')
const dotenv = require('dotenv')
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

eventsRouter.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const {
      title, startDate, endDate, location, shortLocation, locationCoordinates,
      description, eventType, terrain, experience, ticketType, ticketPrice, capacity
    } = req.body

    // Deserializar el campo locationCoordinates si es una cadena
    let parsedLocationCoordinates
    try {
      parsedLocationCoordinates = JSON.parse(locationCoordinates)
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Error en las coordenadas de ubicación.' })
    }

    console.log('Received data:', req.body)

    // Validar campos obligatorios
    if (!title || !startDate || !endDate || !location || !locationCoordinates || !description || !eventType || !terrain || !experience || !ticketType || !capacity) {
      return res.status(400).json({ success: false, message: 'All fields are required.' })
    }

    const coordinates = parsedLocationCoordinates.coordinates
    console.log(coordinates)
    // Verifica que las coordenadas estén en el formato correcto [lng, lat]
    if (!coordinates || coordinates.length !== 2 || isNaN(coordinates[0]) || isNaN(coordinates[1])) {
      return res.status(400).json({ success: false, message: 'Coordenadas de ubicación inválidas.' })
    }

    // Invertir las coordenadas para cumplir con el estándar GeoJSON
    const geoCoordinates = [coordinates[1], coordinates[0]] // [lat, lng] -> [lng, lat]

    // Subir imagen a Cloudinary
    let imageUrl = ''
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      imageUrl = result.secure_url
    }

    console.log(imageUrl)

    // Crear el evento
    const newEvent = new Event({
      title,
      startDate,
      endDate,
      location,
      shortLocation,
      locationCoordinates: {
        type: 'Point',
        coordinates: geoCoordinates
      },
      image: imageUrl,
      description,
      eventType,
      terrain,
      experience,
      ticket: { type: ticketType, price: ticketPrice },
      capacity,
      owner: req.user._id
    })

    console.log({ newEvento: newEvent })

    // // Verifica que las coordenadas sean válidas antes de guardar
    // if (locationCoordinates.lng == null || locationCoordinates.lat == null) {
    //   return res.status(400).json({ success: false, message: 'Coordenadas de ubicación inválidas.' })
    // }

    const savedEvent = await newEvent.save()
    return res.status(201).json({ success: true, event: savedEvent })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Post de un evento
// eventsRouter.post('/', auth, async (req, res) => {
//   try {
//     const {
//       title, startDate, endDate, location, shortLocation, locationCoordinates,
//       image, description, eventType, terrain, experience, ticket, capacity
//     } = req.body

//     // Validate required fields
//     if (!title || !startDate || !endDate || !location || !locationCoordinates || !description || !eventType || !terrain || !experience || !ticket || !capacity) {
//       return res.status(400).json({ success: false, message: 'All fields are required.' })
//     }

//     // Create the new event
//     const newEvent = new Event({
//       title,
//       startDate,
//       endDate,
//       location,
//       shortLocation,
//       locationCoordinates,
//       image,
//       description,
//       eventType,
//       terrain,
//       experience,
//       ticket,
//       capacity,
//       owner: req.user._id
//     })

//     // Save the event to the database
//     const savedEvent = await newEvent.save()
//     return res.status(201).json({ success: true, event: savedEvent })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ success: false, message: 'Internal Server Error' })
//   }
// })

// Actualizar un evento
eventsRouter.put('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { title, startDate, endDate, location, locationCoordinates, image, description, eventType, shortLocation, terrain, experience, ticket, capacity } = req.body

  try {
    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // Verificar si el usuario autenticado es el propietario del evento
    if (event.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' })
    }

    // Actualizar los campos
    event.title = title
    event.startDate = startDate
    event.endDate = endDate
    event.location = location
    event.shortLocation = shortLocation
    event.locationCoordinates = locationCoordinates
    event.image = image
    event.description = description
    event.eventType = eventType
    event.terrain = terrain
    event.experience = experience
    event.ticket = ticket
    event.capacity = capacity

    const updatedEvent = await event.save()

    res.status(200).json({ success: true, event: updatedEvent })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
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

    const query = {}

    // Filtro de ubicación geoespacial
    if (lat && lng) {
      query.locationCoordinates = {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius / 6378.1] // Convertir el radio a radianes
        }
      }
    }

    // Filtro de tipos de eventos (eventTypes)
    if (eventTypes) {
      query.eventType = { $in: Array.isArray(eventTypes) ? eventTypes : [eventTypes] }
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
      query['ticket.type'] = ticketType
    }

    // Filtrar eventos por tiempo
    const today = startOfToday()

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

    // Si se proporcionan latitud y longitud, ordenar por proximidad
    // if (lat && lng) {
    //   events.sort((a, b) => {
    //     const distanceA = calculateDistance(a.locationCoordinates.coordinates, [lng, lat])
    //     const distanceB = calculateDistance(b.locationCoordinates.coordinates, [lng, lat])
    //     return distanceA - distanceB
    //   })
    // }

    res.json({ events })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching events' })
  }
})

// Función auxiliar para calcular la distancia entre dos puntos geográficos (Haversine formula)
function calculateDistance(coords1, coords2) {
  const [lng1, lat1] = coords1
  const [lng2, lat2] = coords2
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distancia en km
  return distance
}

// Inscribir a un usuario en un evento
eventsRouter.post('/enroll/:id', auth, async (req, res) => {
  const { id } = req.params
  const { userId, vehicleId } = req.body

  try {
    // Buscar el evento por ID
    const event = await Event.findById(id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    // Verificar si el usuario es el propietario del evento
    if (event.owner.toString() === req.user._id) {
      return res.status(403).json({ success: false, message: 'You cannot enroll in your own event' })
    }

    // Verificar si el usuario ya está inscrito
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this event' })
    }

    // Inscribir al usuario en el evento
    event.attendees.push({ userId, vehicleId })
    event.attendeesCount += 1

    await event.save()

    res.status(200).json({ success: true, message: 'Enrolled successfully', event })
  } catch (error) {
    console.error(error)
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
      .populate('attendees.userId', 'name lastName userAvatar')
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

// Obtener los eventos de un usario autenticado y separado por eventos pasado y futuros
eventsRouter.get('/user/myevents', auth, async (req, res) => {
  try {
    const userId = req.user._id
    const today = new Date()

    // Obtener eventos futuros y pasados del usuario
    const futureEvents = await Event.find({
      owner: userId,
      startDate: { $gte: today }
    }).sort({ startDate: 1 })
      .populate('owner', 'name lastName userAvatar description')

    const pastEvents = await Event.find({
      owner: userId,
      startDate: { $lt: today }
    }).sort({ startDate: -1 })
      .populate('owner', 'name lastName userAvatar description')

    // Obtener eventos donde el usuario es un attendee
    const attendeeEvents = await Event.find({
      attendees: userId
    }).sort({ startDate: 1 }).populate('owner', 'name lastName userAvatar description')

    res.status(200).json({ success: true, futureEvents, pastEvents, attendeeEvents })
  } catch (error) {
    console.error(error)
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

module.exports = eventsRouter
