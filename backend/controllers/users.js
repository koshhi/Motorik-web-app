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
  const { email } = req.body

  try {
    let user = await User.findOne({ email })

    // Si el usuario ya está registrado, generar el Magic Link
    if (user) {
      // const loginToken = tokenService.generateAuthToken(user)
      const loginToken = tokenService.generateMagicLinkToken(user)

      // const loginLink = `http://localhost:5001/login-with-token?token=${loginToken}`
      const loginLink = `http://localhost:5001/login-with-token?token=${encodeURIComponent(loginToken)}`

      await sendLoginEmail(email, 'Log in to Motorik', `
        <h1>Bienvenido de nuevo a Motorik</h1>
        <p>Haz clic en el enlace para iniciar sesión:</p>
        <a href="${loginLink}">Iniciar sesión</a>
      `)

      return res.status(200).json({ success: true, message: 'Login email sent.' })
    } else {
      // Si el usuario no está registrado, crearlo
      user = new User({
        email,
        isVerified: true
      })

      await user.save()

      const loginToken = tokenService.generateMagicLinkToken(user)
      // const loginToken = tokenService.generateAuthToken(user)
      const loginLink = `http://localhost:5001/login-with-token?token=${loginToken}`

      await sendLoginEmail(email, 'Bienvenido a Motorik', `
        <h1>Únete a Motorik</h1>
        <p>Haz clic en el enlace para crear tu cuenta e iniciar sesión:</p>
        <a href="${loginLink}">Crear cuenta</a>
      `)

      return res.status(200).json({ success: true, message: 'Verification email sent.' })
    }
  } catch (error) {
    console.error('Error processing email:', error)
    return res.status(500).json({ success: false, message: 'Error processing request.' })
  }
})

usersRouter.get('/login-with-token', async (req, res) => {
  const { token } = req.query

  try {
    // Verify and decode the token
    // console.log('Token received:', token)
    // console.log('JWT_SECRET:', process.env.JWT_SECRET)

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // console.log('Decoded token:', decoded)

    const user = await User.findById(decoded.id)

    if (!user) {
      // console.log('User not found with ID:', decoded.id)
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    // console.log('User found:', user)

    const profileFilled = user.profileFilled

    // Generate new tokens
    const authToken = tokenService.generateAccessToken(user)
    // console.log('Generated authToken:', authToken)

    const refreshToken = tokenService.generateRefreshToken(user)
    // console.log('Generated refreshToken:', refreshToken)

    // Store the refresh token in the database
    // user.refreshToken = refreshToken
    // await user.save()
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
      profileFilled
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
    return res.status(403).json({ success: false, message: 'Invalid or expired refresh token.' })
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
    // console.log('User ID from token:', req.user.id)

    const user = await User.findById(req.user.id).populate('vehicles')

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, user })
  } catch (error) {
    console.error('Error retrieving profile:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Endpoint para actualizar el perfil del usuario
usersRouter.put('/profile', auth, upload.single('userAvatar'), async (req, res) => {
  try {
    console.log(req.body)

    const { name, lastName, description, address, locality, country, phonePrefix, phoneNumber, socialMediaLinks, profileFilled } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
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

module.exports = usersRouter
