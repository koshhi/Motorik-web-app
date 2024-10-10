const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vehicleSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number },
  nickname: { type: String },
  image: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventEnrolledCount: { type: Number, default: 0 }
}, {
  timestamps: true
})

// Establecer opciones toJSON y toObject
vehicleSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v
    ret.id = ret._id.toString()
  }
})
vehicleSchema.set('toObject', { virtuals: true })

module.exports = mongoose.model('Vehicle', vehicleSchema)
