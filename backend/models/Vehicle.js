const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vehicleSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  nickname: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventEnrolledCount: { type: Number, default: 0 }
}, {
  timestamps: true
})

module.exports = mongoose.model('Vehicle', vehicleSchema)
