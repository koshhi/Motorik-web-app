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

// Generar Token de Acceso
const generateAccessToken = (user) => {
  console.log('Creating AccessToken for user ID:', user._id)
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m' // Expira en 15 minutos
  })
}

// Generar Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d' // Expira en 7 días
  })
}

// Generar Token para Magic Link
const generateMagicLinkToken = (user) => {
  console.log('Creating MagicLinkToken for user ID:', user._id)
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
  generateAccessToken,
  generateRefreshToken,
  generateMagicLinkToken,
  generateVerificationToken
}
