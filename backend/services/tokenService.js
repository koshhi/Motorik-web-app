const jwt = require('jsonwebtoken')

// Generar el token JWT de autenticación
// const generateAuthToken = (user) => {
//   const payload = {
//     userId: user._id,
//     email: user.email,
//     isVerified: user.isVerified
//   }
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
// }

// const generateAuthToken = (user) => {
//   console.log('Creating LoginToken for user ID:', user._id)

//   return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: '7d'
//   })
// }

// Generar token JWT de Magic Link con expiración corta (15 minutos)
const generateAuthToken = (user) => {
  console.log('Creating LoginToken for user ID:', user._id)
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m' // Expira en 15 minutos
  })
}

// Generar el token JWT de verificación
const generateVerificationToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email
  }

  console.log('Creating verificationToken for user ID:', user._id)

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
}

module.exports = {
  generateAuthToken,
  generateVerificationToken
}
