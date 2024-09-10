const { Schema, model } = require('mongoose')
const { format } = require('date-fns')

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
  shortLocation: {
    type: String
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
    type: String
    // required: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['Meetup', 'Competition', 'Race', 'Adventure', 'Trip', 'Gathering', 'Course', 'Ride', 'Exhibition'],
    required: true
  },
  terrain: {
    type: String,
    enum: ['offroad', 'road', 'mixed'],
    required: true
  },
  experience: {
    type: String,
    enum: ['none', 'beginner', 'intermediate', 'advanced'],
    required: true
  },
  ticket: {
    type: { type: String, enum: ['free', 'paid'], required: true },
    price: { type: Number, required: function () { return this.type === 'paid' } }
  },
  capacity: {
    type: Number,
    required: true
  },
  attendeesCount: {
    type: Number,
    default: 0
  },
  attendees: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    }
  }],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual field: longDate
eventSchema.virtual('longDate').get(function () {
  const formattedStartDate = format(this.startDate, 'd MMM yyyy H:mm')
  let formattedEndDate = format(this.endDate, 'd MMM yyyy H:mm')

  // Check if the day is the same, reformat the end date
  if (this.startDate.getDate() === this.endDate.getDate()) {
    formattedEndDate = format(this.endDate, 'H:mm')
  }

  return `${formattedStartDate} - ${formattedEndDate}`
})

// Virtual field: dayDate
eventSchema.virtual('dayDate').get(function () {
  // Get the day of the startDate
  return this.startDate.getDate() // This returns the day as a number
})

// Virtual field: monthDate
eventSchema.virtual('monthDate').get(function () {
  // Get the abbreviated month of the startDate
  return format(this.startDate, 'MMM') // This returns the month as an abbreviation (e.g., 'Jan', 'Feb')
})

// Crear un índice geoespacial en las coordenadas
eventSchema.index({ locationCoordinates: '2dsphere' })

module.exports = model('Event', eventSchema)
