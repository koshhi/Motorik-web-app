const { Schema, model } = require('mongoose')

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  locationCoordinates: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON Type
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['Quedadas', 'Competición', 'Carrera', 'Aventura', 'Viaje', 'Concentraciones', 'Cursos', 'Rodadas'],
    required: true
  },
  attendeesCount: {
    type: Number,
    default: 1
  },
  attendees: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
})

// Crear un índice geoespacial en las coordenadas
eventSchema.index({ locationCoordinates: '2dsphere' })

module.exports = model('Event', eventSchema)
