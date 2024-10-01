const { Schema, model } = require('mongoose')
// const Event = require('../models/Event')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  // passwordHash: {
  //   type: String,
  //   required: function () {
  //     return !this.googleId // Solo requerido si no es usuario de Google
  //   }
  // },
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
  profileFilled: {
    type: Boolean,
    default: false
  },
  vehicles: [{
    type: Schema.Types.ObjectId,
    ref: 'Vehicle' // Referencia al modelo Vehicle
  }],
  googleId: { type: String, sparse: true },
  facebookId: { type: String, sparse: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: String
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
