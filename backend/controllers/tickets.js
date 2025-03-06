// controllers/tickets.js

const express = require('express')
const Ticket = require('../models/Ticket')
const Event = require('../models/Event')
const auth = require('../middleware/auth')
const { validateTickets } = require('../utils/validators')
const mongoose = require('mongoose')

const ticketsRouter = express.Router()

// Función auxiliar para recalcular la capacidad total del evento
const recalculateEventCapacity = async (eventId, session) => {
  const tickets = await Ticket.find({ eventId }).session(session)
  const totalCapacity = tickets.reduce((sum, ticket) => sum + ticket.capacity, 0)
  await Event.findByIdAndUpdate(eventId, { capacity: totalCapacity }, { session })
}

// Obtener la lista de tickets de un evento
ticketsRouter.get('/event/:eventId', async (req, res) => {
  const { eventId } = req.params

  try {
    const tickets = await Ticket.find({ eventId })
    res.status(200).json({ success: true, tickets })
  } catch (error) {
    console.error('Error al obtener los tickets:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
})

// Crear un nuevo ticket para un evento
ticketsRouter.post('/event/:eventId', auth, async (req, res) => {
  const { eventId } = req.params
  const { type, price, approvalRequired, capacity, name } = req.body

  // Iniciar una sesión de Mongoose para la transacción
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const event = await Event.findById(eventId).session(session)

    console.log('Datos del nuevo ticket:', {
      type,
      price: type === 'paid' ? Number(price) : 0,
      approvalRequired: approvalRequired || false,
      capacity: Number(capacity),
      availableSeats: Number(capacity),
      name,
      eventId: event._id
    })

    if (!event) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Evento no encontrado' })
    }

    // Verificar si el usuario es el propietario del evento
    if (event.owner.toString() !== req.user.id) {
      await session.abortTransaction()
      session.endSession()
      return res.status(403).json({ success: false, message: 'No autorizado para añadir tickets a este evento' })
    }

    // Validar el ticket individualmente
    validateTickets([{ type, price, approvalRequired, capacity, name }])

    // Crear el ticket con availableSeats igual a capacity
    const newTicket = new Ticket({
      type,
      price: type === 'paid' ? Number(price) : 0,
      approvalRequired: approvalRequired || false,
      capacity: Number(capacity),
      availableSeats: Number(capacity), // Establecer availableSeats
      name,
      eventId: event._id
    })

    await newTicket.save({ session })

    // Agregar el ticket al evento
    event.tickets.push(newTicket._id)

    // **Guardar el evento después de actualizar el arreglo `tickets`**
    await event.save({ session }) // <--- Añade esta línea

    // Recalcular la capacidad total del evento
    await recalculateEventCapacity(eventId, session)

    // Confirmar la transacción
    await session.commitTransaction()
    session.endSession()

    res.status(201).json({ success: true, ticket: newTicket })
  } catch (error) {
    // Abortando la transacción en caso de error
    await session.abortTransaction()
    session.endSession()
    console.error('Error al crear el ticket:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
})

// Actualizar un ticket existente
ticketsRouter.put('/:ticketId', auth, async (req, res) => {
  const { ticketId } = req.params
  const { type, price, approvalRequired, capacity, name } = req.body

  // Iniciar una sesión de Mongoose para la transacción
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const ticket = await Ticket.findById(ticketId).session(session)

    if (!ticket) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' })
    }

    // Verificar si el usuario es el propietario del evento asociado al ticket
    const event = await Event.findById(ticket.eventId).session(session)
    if (!event) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Evento asociado al ticket no encontrado' })
    }

    if (event.owner.toString() !== req.user.id) {
      await session.abortTransaction()
      session.endSession()
      return res.status(403).json({ success: false, message: 'No autorizado para actualizar este ticket' })
    }

    // Preparar los datos para la validación
    const updatedTicketData = {
      type: type || ticket.type,
      price: type === 'paid' ? Number(price) : 0,
      approvalRequired: approvalRequired !== undefined ? approvalRequired : ticket.approvalRequired,
      capacity: capacity !== undefined ? Number(capacity) : ticket.capacity,
      name: name || ticket.name
    }

    // Validar el ticket actualizado
    validateTickets([updatedTicketData])

    // Contar el número de asistentes con este ticket que están asistiendo o pendientes de confirmación
    const numberOfAttendees = await Event.countDocuments({
      _id: event._id,
      attendees: {
        $elemMatch: {
          ticketId: ticketId,
          status: { $in: ['confirmation pending', 'attending'] }
        }
      }
    }).session(session)

    // Verificar si la nueva capacidad es al menos igual al número de asistentes
    if (updatedTicketData.capacity < numberOfAttendees) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ success: false, message: `La capacidad no puede ser menor que el número de asistentes actuales (${numberOfAttendees}).` })
    }

    // Actualizar los campos del ticket
    ticket.type = updatedTicketData.type
    ticket.price = updatedTicketData.price
    ticket.approvalRequired = updatedTicketData.approvalRequired
    ticket.capacity = updatedTicketData.capacity
    ticket.name = updatedTicketData.name
    ticket.availableSeats = updatedTicketData.capacity - numberOfAttendees

    await ticket.save({ session })

    // Después de actualizar y guardar el ticket:
    const tickets = await Ticket.find({ eventId: event._id }).session(session)
    const overallAvailable = tickets.reduce((sum, t) => sum + t.availableSeats, 0)
    event.availableSeats = overallAvailable
    await event.save({ session })

    // Confirmar la transacción
    await session.commitTransaction()
    session.endSession()

    res.status(200).json({ success: true, ticket })
  } catch (error) {
    // Abortando la transacción en caso de error
    await session.abortTransaction()
    session.endSession()
    console.error('Error al actualizar el ticket:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
})

// Eliminar un ticket existente
ticketsRouter.delete('/:ticketId', auth, async (req, res) => {
  const { ticketId } = req.params

  // Validar el formato del ticketId
  if (!mongoose.isValidObjectId(ticketId)) {
    return res.status(400).json({ success: false, message: 'ID de ticket inválido.' })
  }

  // Iniciar una sesión de Mongoose para la transacción
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const ticket = await Ticket.findById(ticketId).session(session)

    if (!ticket) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Ticket no encontrado' })
    }

    // Verificar si el usuario es el propietario del evento asociado al ticket
    const event = await Event.findById(ticket.eventId).session(session)
    if (!event) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({ success: false, message: 'Evento asociado al ticket no encontrado' })
    }

    if (event.owner.toString() !== req.user.id) {
      await session.abortTransaction()
      session.endSession()
      return res.status(403).json({ success: false, message: 'No autorizado para eliminar este ticket' })
    }

    // Verificar si hay asistentes con este ticket
    // Asegúrate de que event._id es un ObjectId válido
    if (!mongoose.isValidObjectId(event._id)) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ success: false, message: 'ID de evento inválido.' })
    }

    const countAttendees = await Event.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(event._id) } },
      { $unwind: '$attendees' },
      { $match: { 'attendees.ticketId': new mongoose.Types.ObjectId(ticketId) } },
      { $count: 'count' }
    ]).session(session)

    const numberOfAttendees = countAttendees.length > 0 ? countAttendees[0].count : 0

    if (numberOfAttendees > 0) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({ success: false, message: 'No puedes eliminar un ticket que tiene asistentes inscritos.' })
    }

    // Eliminar el ticket
    await ticket.deleteOne({ session })

    // Después de eliminar el ticket:
    const tickets = await Ticket.find({ eventId: event._id }).session(session)
    const totalCapacity = tickets.reduce((sum, t) => sum + t.capacity, 0)
    const overallAvailable = tickets.reduce((sum, t) => sum + t.availableSeats, 0)
    event.capacity = totalCapacity
    event.availableSeats = overallAvailable
    await event.save({ session })

    // Confirmar la transacción
    await session.commitTransaction()
    session.endSession()

    res.status(200).json({ success: true, message: 'Ticket eliminado exitosamente' })
  } catch (error) {
    // Abortando la transacción en caso de error
    await session.abortTransaction()
    session.endSession()
    console.error('Error al eliminar el ticket:', error)
    res.status(500).json({ success: false, message: 'Error interno del servidor' })
  }
})

module.exports = ticketsRouter
