const jwt = require('jsonwebtoken')

// Generar el token JWT de autenticación
const generateAuthToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    isVerified: user.isVerified
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Generar el token JWT de verificación
const generateVerificationToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
}

module.exports = {
  generateAuthToken,
  generateVerificationToken
}
