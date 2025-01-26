const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    // Obtener el token de la cabecera Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '')
    // console.log('Token recibido:', token)

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    // Verificar y decodificar el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // console.log('Token decodificado:', decoded)

    // Buscar al usuario en la base de datos por su ID
    const user = await User.findById(decoded.id)

    // Si el usuario no es encontrado, retornamos un error
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
      // console.error('Usuario no encontrado para el ID:', decoded.id)
      // return res.status(401).json({ success: false, message: 'Invalid token - User not found' })
    }

    // Verificamos si está marcado como borrado
    if (user.isDeleted) {
      return res.status(401).json({
        success: false,
        message: 'Account is deleted'
      })
      // console.error('Cuenta desactivada para el usuario:', user.id)
      // return res.status(401).json({ success: false, message: 'Tu cuenta ha sido eliminada o desactivada.' })
    }

    // Adjuntar el usuario completo a req.user
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      })
    }
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    })
  }
}

module.exports = auth
