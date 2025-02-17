// models/Event.js

const { Schema, model } = require('mongoose')
const { format } = require('date-fns')
const { es } = require('date-fns/locale')
// const slugify = require('slugify')

const attendeeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: false
    // required: true
  },
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  status: {
    type: String,
    enum: ['confirmation pending', 'attending', 'not attending'],
    default: 'confirmation pending'
  }
}, { timestamps: true })

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
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
  tickets: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  capacity: {
    type: Number,
    required: true,
    min: [1, 'La capacidad debe ser al menos 1']
  },
  availableSeats: {
    type: Number,
    required: true,
    default: 0
  },
  attendeesCount: {
    type: Number,
    default: 0
  },
  attendees: [attendeeSchema],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  needsVehicle: {
    type: Boolean,
    default: true
  },
  policy: {
    type: Schema.Types.ObjectId,
    ref: 'Policy'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Pre-save hook para generar el slug automáticamente
eventSchema.pre('save', async function (next) {
  if (this.isModified('title') || !this.slug) {
    const generateSlug = (title) => {
      return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }

    let newSlug = generateSlug(this.title)
    // Verificar si el slug ya existe
    let existingEvent = await model('Event').findOne({ slug: newSlug })
    let slugSuffix = 1
    while (existingEvent) {
      newSlug = `${generateSlug(this.title)}-${slugSuffix}`
      slugSuffix++
      // Re-check if the newSlug exists
      existingEvent = await model('Event').findOne({ slug: newSlug })
    }
    this.slug = newSlug
  }
  next()
})

// Virtual field: dayDate
eventSchema.virtual('dayDate').get(function () {
  return format(this.startDate, 'd', { locale: es })
})

// Virtual field: monthDate
eventSchema.virtual('monthDate').get(function () {
  const month = format(this.startDate, 'MMM', { locale: es })
  return capitalizeFirstLetter(month)
})

// Virtual field: longDate
eventSchema.virtual('longDate').get(function () {
  const formattedStartDate = format(this.startDate, 'd MMM yyyy H:mm', { locale: es })
  let formattedEndDate = format(this.endDate, 'd MMM yyyy H:mm', { locale: es })

  // Si el evento empieza y termina el mismo día
  if (this.startDate.getDate() === this.endDate.getDate()) {
    formattedEndDate = format(this.endDate, 'H:mm', { locale: es })
  }

  return `${formattedStartDate} - ${formattedEndDate}`
})

// Función para capitalizar la primera letra de un string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Virtual field: partialDateStart
eventSchema.virtual('partialDateStart').get(function () {
  const formattedDate = format(this.startDate, 'EEEE d MMM yyyy', { locale: es })
  return capitalizeFirstLetter(formattedDate)
})

// Virtual field: partialDateEnd
eventSchema.virtual('partialDateEnd').get(function () {
  let formattedEndDate

  // Si el evento termina el mismo día
  if (this.startDate.getDate() === this.endDate.getDate()) {
    formattedEndDate = format(this.endDate, 'H:mm', { locale: es })
  } else if (this.startDate.getFullYear() === this.endDate.getFullYear()) {
    // Si el evento dura más de un día, pero dentro del mismo año
    formattedEndDate = format(this.endDate, 'd MMM H:mm', { locale: es })
  } else {
    // Si el evento dura más de un año
    formattedEndDate = format(this.endDate, 'd MMM yyyy H:mm', { locale: es })
  }

  return `${format(this.startDate, 'H:mm', { locale: es })} - ${formattedEndDate}`
})

// Virtual field: weekdayStart
eventSchema.virtual('weekdayStart').get(function () {
  const weekday = format(this.startDate, 'EEEE', { locale: es })
  return capitalizeFirstLetter(weekday)
})

// Crear un índice geoespacial en las coordenadas
eventSchema.index({ locationCoordinates: '2dsphere' })

// Establecer opciones toJSON y toObject
eventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v
    ret.id = ret._id.toString()
  }
})
eventSchema.set('toObject', { virtuals: true })

module.exports = model('Event', eventSchema)
