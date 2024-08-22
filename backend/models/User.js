const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true
  },
  passwordHash: String,
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }]
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
