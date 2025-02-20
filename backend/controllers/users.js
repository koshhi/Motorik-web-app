const dotenv = require('dotenv')
const express = require('express')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const User = require('../models/User')
const usersRouter = express.Router()
const tokenService = require('../services/tokenService')
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { sendLoginEmail } = require('../services/emailService')

// Cargar variables de entorno
dotenv.config()

// Configurar Cloudinary para usar la variable de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configurar Multer para manejo de archivos
const storage = multer.diskStorage({})
const upload = multer({ storage })

usersRouter.post('/check-or-register', async (req, res) => {
  const { email, returnTo } = req.body
  console.log('POST /check-or-register: email:', email, 'returnTo:', returnTo)
  try {
    let user = await User.findOne({ email })

    // Si el usuario ya está registrado, generar el Magic Link
    if (user) {
      const loginToken = tokenService.generateMagicLinkToken(user, returnTo)
      const loginLink = `${process.env.FRONTEND_URL}/login-with-token?token=${encodeURIComponent(loginToken)}`
      console.log('Login link generado para usuario existente:', loginLink)

      await sendLoginEmail(email, 'Inicia sesión en Motorik', `
        <div style="background: #FAFAFA; padding: 80px 8px;height: 100vh; display: block;">
          <div style="background: #FFFFFF; padding: 24px; max-width: 400px; border-radius: 16px; border: 1px solid #DCDCDC; margin: 0 auto;"> 
            <p style="margin-bottom: 16px; font-family: sans-serif !important; color: #10110f; text-align: left; font-size: 24px; font-style: normal; font-weight: 700; line-height: 140%; margin: 0px; padding-bottom: 8px; ">
              Inicia sesión en Motorik
            </p>
            <p style="color: #464646; text-align: left; font-size: 16px; font-style: normal; font-family: sans-serif !important; font-weight: 500 !important; line-height: 150%; margin: 0px; padding-bottom: 16px; ">
              Haz clic en el enlace para iniciar sesión:
            </p>
            <a href="${loginLink}" style="background-color: #10110f; border: none; border-radius: 8px; color: white; padding: 16px 16px; text-decoration: none; font-family: sans-serif !important;font-size: 18px; font-weight: 600; cursor: pointer; display: inline-block;display: block;text-align: center;">
              Iniciar sesión
            </a>
            <p style="color: #656565; text-align: left; font-size: 16px; font-style: normal; font-family: sans-serif !important; font-weight: 500 !important; line-height: 150%; margin: 0px; padding: 16px 0px 24px 0px;">
              Si no intentaste iniciar sesión, puedes ignorar este correo electrónico de forma segura.
            </p>
            <div style="display: block; height: 1px; background: #DCDCDC; margin-bottom: 24px;"></div>
            <img src="http://cdn.mcauto-images-production.sendgrid.net/50b2706544b24184/c892ff76-363a-48c0-a509-50390f7a1aab/256x32.png" alt="Motorik Logo" style="height: 16px;">
            <p style="color: #656565; text-align: left; font-family: sans-serif !important; font-size: 14px; font-style: normal; font-weight: 500; line-height: 140%; margin: 0px; padding-top: 16px; ">
              La plataforma de referencia para encontrar planes del motor.
            </p>
            <p style="color: #656565; text-align: left; font-family: sans-serif !important; font-size: 14px; font-style: normal; font-weight: 500; line-height: 140%; margin: 0px; padding-top: 16px; ">
              ¿Tienes problemas con Motorik? 
              <a href="mailto:motorik.events@gmail.com" 
                style="color: #10110f; text-align: left; font-family: sans-serif !important; font-size: 14px; font-style: normal; font-weight: 500; line-height: 140%; margin: 0px; text-decoration: underline;">Contáctanos
              </a
            </p>
            </div>
        </div>
      `)

      return res.status(200).json({ success: true, message: 'Login email sent.' })
    } else {
      // Si el usuario no está registrado, crearlo
      user = new User({
        email,
        isVerified: true
      })

      await user.save()
      const loginToken = tokenService.generateMagicLinkToken(user, returnTo)
      const loginLink = `${process.env.FRONTEND_URL}/login-with-token?token=${encodeURIComponent(loginToken)}`

      console.log('Signin link generado para nuevo usuario:', loginLink)

      await sendLoginEmail(email, 'Bienvenido a Motorik', `
        <div style="background: #FAFAFA; padding: 80px 8px; height: 100vh; display: block;">
          <div style="background: #FFFFFF; padding: 24px; max-width: 400px;border-radius: 16px; border: 1px solid #DCDCDC; margin: 0 auto;"> 
            <p style="margin-bottom: 16px; font-family: sans-serif !important; color: #10110f; text-align: left; font-size: 24px; font-style: normal; font-weight: 700; line-height: 140%; margin: 0px; padding-bottom: 8px; ">
              Únete a Motorik
            </p>
            <p style="color: #464646; text-align: left; font-size: 16px; font-style: normal; font-family: sans-serif !important; font-weight: 500 !important; line-height: 150%; margin: 0px; padding-bottom: 16px; ">
              Haz clic en el enlace para crear tu cuenta e iniciar sesión:
            </p>
            <a href="${loginLink}" style="background-color: #10110f; border: none; border-radius: 8px; color: white; padding: 16px 16px; text-decoration: none; font-family: sans-serif !important;font-size: 18px; font-weight: 600; cursor: pointer; display: inline-block;display: block;text-align: center;">
              Crear cuenta
            </a>
            <p style="color: #656565; text-align: left; font-size: 16px; font-style: normal; font-family: sans-serif !important; font-weight: 500 !important; line-height: 150%; margin: 0px; 16px 0px 24px 0px">
              Si no intentaste iniciar sesión, puedes ignorar este correo electrónico de forma segura.
            </p>
            <div style="display: block; height: 1px; background: #DCDCDC; margin-bottom: 24px;"></div>
            <img src="http://cdn.mcauto-images-production.sendgrid.net/50b2706544b24184/c892ff76-363a-48c0-a509-50390f7a1aab/256x32.png" alt="Motorik Logo" style="height: 16px;">
            <p style="color: #656565; text-align: left; font-family: sans-serif !important; font-size: 14px; font-style: normal; font-weight: 500; line-height: 140%; margin: 0px; padding-top: 16px; ">
              La plataforma de referencia para encontrar planes del motor.
            </p>
            <p style="color: #656565; text-align: left; font-family: sans-serif !important; font-size: 14px; font-style: normal; font-weight: 500; line-height: 140%; margin: 0px; padding-top: 16px; ">
              ¿Tienes problemas con Motorik? 
              <a href="mailto:motorik.events@gmail.com" 
                style="color: #10110f; text-align: left; font-family: sans-serif !important; font-size: 14px; font-style: normal; font-weight: 500; line-height: 140%; margin: 0px; padding-top: 16px; text-decoration: underline;">Contáctanos
              </a
            </p>
            </div>
        </div>
      `)

      return res.status(200).json({ success: true, message: 'Verification email sent.' })
    }
  } catch (error) {
    console.error('Error processing email:', error)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'TokenExpiredError' })
    }
    return res.status(500).json({ success: false, message: 'Error processing request.' })
  }
})

usersRouter.get('/login-with-token', async (req, res) => {
  const { token } = req.query
  // const { token, returnTo } = req.query
  console.log('GET /login-with-token: token recibido:', token)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      // console.log('User not found with ID:', decoded.id)
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    const profileFilled = user.profileFilled
    const authToken = tokenService.generateAccessToken(user)
    const refreshToken = tokenService.generateRefreshToken(user)

    try {
      user.refreshToken = refreshToken
      await user.save()
      // console.log('User updated with new refreshToken.')
    } catch (saveError) {
      console.error('Error saving user with new refreshToken:', saveError)
      return res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
    console.log('User updated with new refreshToken.')

    // Set the refresh token as an HTTP-only cookie
    try {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      })
      console.log('Refresh token cookie set.')
    } catch (cookieError) {
      console.error('Error setting refresh token cookie:', cookieError)
      return res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }

    console.log('Refresh token cookie set.')

    return res.json({
      success: true,
      authToken,
      user,
      profileFilled,
      returnTo: decoded.returnTo || '/'
    })
  } catch (error) {
    console.error('Error in /login-with-token:', error)
    return res.status(400).json({ success: false, message: 'Invalid or expired token.' })
  }
})

usersRouter.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh Token is required.' })
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.id)

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token.' })
    }

    // Generate a new access token
    const authToken = tokenService.generateAccessToken(user)

    // Optionally, implement refresh token rotation here

    return res.json({
      success: true,
      authToken
    })
  } catch (error) {
    // return res.status(403).json({ success: false, message: 'Invalid or expired refresh token.' })
    console.error('Error in /login-with-token:', error)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'TokenExpiredError' })
    }
    return res.status(400).json({ success: false, message: 'Invalid token.' })
  }
})

usersRouter.post('/logout', async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  try {
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      const user = await User.findById(decoded.id)

      if (user) {
        user.refreshToken = ''
        await user.save()
      }
    }

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    })

    return res.json({ success: true, message: 'Logged out successfully.' })
  } catch (error) {
    console.error('Error logging out:', error)
    return res.status(400).json({ success: false, message: 'Error logging out.' })
  }
})

// Profile del usurio logueado
usersRouter.get('/profile', auth, async (req, res) => {
  try {
    console.log('User ID from token:', req.user.id)

    const user = await User.findById(req.user.id).populate('vehicles')

    if (!user) {
      console.log('Usuario no encontrado:', req.user.id)
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    console.log('Datos del usuario devueltos en /profile:', {
      profileFilled: user.profileFilled,
      id: user._id,
      email: user.email
    })

    res.status(200).json({ success: true, user })
  } catch (error) {
    console.error('Error retrieving profile:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Endpoint para actualizar el perfil del usuario
usersRouter.put('/profile', auth, upload.single('userAvatar'), async (req, res) => {
  try {
    console.log('Datos recibidos para actualizar:', req.body)

    const { name, lastName, description, address, locality, country, phonePrefix, phoneNumber, socialMediaLinks, profileFilled } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      console.log('Usuario no encontrado para ID:', req.user.id)
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
    }

    // Asegúrate de que el campo 'address' esté en el request body
    if (!address) {
      return res.status(400).json({ success: false, message: 'La dirección es obligatoria.' })
    }

    // Actualización de campos de texto
    user.name = name || user.name
    user.lastName = lastName || user.lastName
    user.description = description || user.description
    user.address = address || user.address
    user.locality = locality || user.locality
    user.country = country || user.country
    user.phonePrefix = phonePrefix || user.phonePrefix
    user.phoneNumber = phoneNumber || user.phoneNumber
    user.profileFilled = profileFilled || user.profileFilled
    // user.profileFilled = profileFilled === 'true'

    // Manejar el campo de redes sociales
    if (socialMediaLinks) {
      user.socialMediaLinks = JSON.parse(socialMediaLinks) // Asumiendo que llega como string en un formulario
    }

    // Manejar la imagen si se ha subido un archivo
    if (req.file) {
      // Subir la imagen a Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user_avatars'
      })
      user.userAvatar = result.secure_url // Guardar la URL segura de Cloudinary en el campo userAvatar
    }

    // Guardar los cambios en la base de datos
    await user.save()
    console.log('Usuario actualizado y devuelto:', user)

    res.status(200).json({ success: true, user })
  } catch (error) {
    console.error('Error actualizando el perfil:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Obtener todos los usuarios con sus vehiculos
usersRouter.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .populate('vehicles')
    res.status(200).json({ success: true, users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Obtener un usuario por su ID
usersRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
      .populate('vehicles')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.status(200).json({ success: true, user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

usersRouter.get('/:id/settings', auth, async (req, res) => {
  try {
    // Verificar si el ID del usuario autenticado coincide con el :id de la URL
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta configuración.'
      })
    }

    // Podrías retornar más datos de configuración si lo deseas
    // const userSettings = { ... } o si prefieres
    // const user = await User.findById(req.params.id).select('email ...')
    // return res.json({ success: true, user })
    return res.json({
      success: true,
      message: 'Puedes ver y editar tu configuración aquí.'
    })
  } catch (error) {
    console.error('Error en /:id/settings:', error)
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor.'
    })
  }
})

usersRouter.delete('/delete', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Marcamos como eliminado:
    user.isDeleted = true
    user.refreshToken = '' // Limpia refresh token
    await user.save()

    // Opcional: desloguear (borrar cookie)
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    })

    return res.json({ success: true, message: 'Cuenta eliminada.' })
  } catch (error) {
    console.error('Error deleting account:', error)
    return res.status(500).json({ success: false, message: 'Error deleting account' })
  }
})

module.exports = usersRouter
