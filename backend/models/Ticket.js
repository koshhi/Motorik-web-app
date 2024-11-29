// models/Ticket.js

const mongoose = require('mongoose')
const { Schema } = mongoose

const ticketSchema = new Schema({
  type: {
    type: String,
    enum: ['free', 'paid'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: function () { return this.type === 'paid' },
    default: 0
  },
  capacity: {
    type: Number,
    required: true,
    min: 1 // La capacidad debe ser al menos 1
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  approvalRequired: {
    type: Boolean,
    default: false
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  }
})

// Inicializar `availableSeats` igual a `capacity` al crear un ticket
ticketSchema.pre('save', function (next) {
  if (this.isNew) {
    this.availableSeats = this.capacity
  }
  next()
})

module.exports = mongoose.model('Ticket', ticketSchema)
