// models/Policy.js
const { Schema, model } = require('mongoose')

const policySchema = new Schema({
  name: { type: String, required: true },
  cancellationDeadline: { type: Number, default: 0 }, // en horas antes del evento
  refundPercentage: { type: Number, default: 0 }, // porcentaje de reembolso
  additionalTerms: { type: String }
}, { timestamps: true })

module.exports = model('Policy', policySchema)
