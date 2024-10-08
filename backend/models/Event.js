const { Schema, model } = require('mongoose')
const { format } = require('date-fns')
const { es } = require('date-fns/locale')

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
// eventSchema.virtual('longDate').get(function () {
//   const formattedStartDate = format(this.startDate, 'd MMM yyyy H:mm')
//   let formattedEndDate = format(this.endDate, 'd MMM yyyy H:mm')

//   // Check if the day is the same, reformat the end date
//   if (this.startDate.getDate() === this.endDate.getDate()) {
//     formattedEndDate = format(this.endDate, 'H:mm')
//   }

//   return `${formattedStartDate} - ${formattedEndDate}`
// })

// eventSchema.virtual('longDate').get(function () {
//   const formattedStartDate = format(this.startDate, 'd MMM yyyy H:mm')
//   let formattedEndDate = format(this.endDate, 'd MMM H:mm') // Removemos el año aquí por defecto

//   // Si el evento dura más de un año, se vuelve a añadir el año en la fecha final
//   if (this.startDate.getFullYear() !== this.endDate.getFullYear()) {
//     formattedEndDate = format(this.endDate, 'd MMM yyyy H:mm')
//   }

//   return `${formattedStartDate} - ${formattedEndDate}`
// })

// Virtual field: dayDate
eventSchema.virtual('dayDate').get(function () {
  return format(this.startDate, 'd', { locale: es })
})

// Virtual field: monthDate
eventSchema.virtual('monthDate').get(function () {
  const month = format(this.startDate, 'MMM', { locale: es })
  return capitalizeFirstLetter(month)
})
// // Virtual field: partialDateStart
// eventSchema.virtual('partialDateStart').get(function () {
//   return format(this.startDate, 'EEEE d MMM yyyy') // Ejemplo: "Jueves 16 Sep 2024"
// })
// // Virtual field: partialDateEnd
// eventSchema.virtual('partialDateEnd').get(function () {
//   let formattedEndDate

//   // Si el evento termina el mismo día
//   if (this.startDate.getDate() === this.endDate.getDate()) {
//     formattedEndDate = format(this.endDate, 'H:mm')
//   } else if (this.startDate.getFullYear() === this.endDate.getFullYear()) {
//     // Si el evento dura más de un día
//     formattedEndDate = format(this.endDate, 'd MMM H:mm')
//   } else {
//     formattedEndDate = format(this.endDate, 'd MMM yyyy H:mm')
//     // Si el evento dura más de un año
//   }

//   return `${format(this.startDate, 'H:mm')} - ${formattedEndDate}`
// })

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

module.exports = model('Event', eventSchema)
