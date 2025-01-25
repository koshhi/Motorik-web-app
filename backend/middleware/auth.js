const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    // Obtener el token de la cabecera Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '')
    console.log('Token recibido:', token)
    // Si no hay token, retornamos un error
    if (!token) {
      console.error('Token no proporcionado.')

      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    // Verificar y decodificar el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Token decodificado:', decoded)

    // Buscar al usuario en la base de datos por su ID
    const user = await User.findById(decoded.id)

    // Si el usuario no es encontrado, retornamos un error
    if (!user) {
      console.error('Usuario no encontrado para el ID:', decoded.id)

      return res.status(401).json({ success: false, message: 'Invalid token - User not found' })
    }

    // Verificamos si está marcado como borrado
    if (user.isDeleted) {
      console.error('Cuenta desactivada para el usuario:', user.id)

      return res.status(401).json({ success: false, message: 'Tu cuenta ha sido eliminada o desactivada.' })
    }

    // Adjuntar el usuario completo a req.user
    req.user = user

    // Continuar con el siguiente middleware o controlador
    next()
  } catch (error) {
    // Si hay un error en el proceso (token inválido, expirado, etc.)
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

module.exports = auth
