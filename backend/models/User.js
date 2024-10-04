const { Schema, model } = require('mongoose')
// const Event = require('../models/Event')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
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
    type: String
    // required: false
  },
  address: { type: String, required: false },
  locality: { type: String, required: false },
  country: { type: String, required: false },
  phonePrefix: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  socialMediaLinks: [
    {
      url: { type: String },
      platform: {
        type: String,
        enum: ['Instagram', 'TikTok', 'YouTube', 'X', 'Link'],
        default: 'Link'
      }
    }
  ],
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

userSchema.pre('save', function (next) {
  this.socialMediaLinks.forEach(link => {
    if (link.url.includes('instagram.com')) {
      link.platform = 'Instagram'
    } else if (link.url.includes('tiktok.com')) {
      link.platform = 'TikTok'
    } else if (link.url.includes('youtube.com')) {
      link.platform = 'YouTube'
    } else if (link.url.includes('twitter.com') || link.url.includes('x.com')) {
      link.platform = 'X'
    } else {
      link.platform = 'Link'
    }
  })
  next()
})

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
