const { Schema, model } = require('mongoose')
const Event = require('../models/Event')
const uniqueValidator = require('mongoose-unique-validator')

// const userSchema = new Schema({
//   username: {
//     type: String,
//     required: [true, 'Username is required'],
//     unique: true
//   },
//   passwordHash: String,
//   events: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Event',
//     default: function () {
//       return Event.find({ owner: this })
//     }
//   }]
// })

// const userSchema = new Schema({

//   username: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   passwordHash: {
//     type: String,
//     required: true
//   },
//   name: {
//     type: String,
//     required: false
//   },
//   lastName: {
//     type: String,
//     required: false
//   },
//   userAvatar: {
//     type: String, // URL de la imagen de perfil
//     required: false
//   },
//   description: {
//     type: String,
//     required: false
//   },
//   enrolledEvents: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Event' // Referencia al modelo Event
//   }],
//   organizedEvents: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Event' // Referencia al modelo Event
//   }],
//   vehicles: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Vehicle' // Referencia al modelo Vehicle
//   }],
//   events: [{ // Mantén este campo si aún lo estás usando en alguna parte del código
//     type: Schema.Types.ObjectId,
//     ref: 'Event'
//   }]
// }, { timestamps: true })

const userSchema = new Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  userAvatar: {
    type: String, // URL de la imagen de perfil
    required: false
  },
  description: {
    type: String,
    required: false
  },
  vehicles: [{
    type: Schema.Types.ObjectId,
    ref: 'Vehicle' // Referencia al modelo Vehicle
  }]
}, { timestamps: true })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    // Eliminamos la passwordhash
    delete returnedObject.passwordHash
  }
})

userSchema.plugin(uniqueValidator)

module.exports = model('User', userSchema)
