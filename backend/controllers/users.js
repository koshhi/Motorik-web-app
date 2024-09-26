const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const User = require('../models/User')
const usersRouter = express.Router()
// const { sendVerificationEmail } = require('../services/emailService')
// const { generateVerificationToken } = require('../services/tokenService')
const tokenService = require('../services/tokenService')
const { sendVerificationEmail } = require('../services/emailService')

usersRouter.post('/register', async (req, res) => {
  const { email, password, name } = req.body

  try {
    // Generar hash de la contraseña
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Crear nuevo usuario
    const newUser = new User({
      email,
      name,
      passwordHash
    })

    // Guardar el nuevo usuario en la base de datos
    await newUser.save()

    // Generar token de verificación
    const verificationToken = tokenService.generateVerificationToken(newUser._id)

    // Crear contenido del correo de verificación
    const verificationLink = `http://localhost:5002/api/users/verify-email?token=${verificationToken}`
    const emailContent = `
      <h1>Verifica tu correo electrónico</h1>
      <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
      <a href="${verificationLink}">Verificar correo</a>
    `

    // Enviar el correo de verificación
    await sendVerificationEmail(newUser.email, 'Verificación de correo', emailContent)

    res.status(201).json({ success: true, message: 'Usuario registrado. Por favor, verifica tu correo.' })
  } catch (error) {
    console.error('Error al registrar el usuario:', error)
    res.status(500).json({ success: false, message: 'Error al registrar el usuario.' })
  }
})

usersRouter.get('/verify-email', async (req, res) => {
  const { token } = req.query

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token inválido o inexistente.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' })
    }

    // Verificar el email
    user.emailVerified = true
    await user.save()

    return res.status(200).json({ success: true, message: 'Correo verificado exitosamente.' })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ success: false, message: 'Token inválido o expirado.' })
  }
})

// New Login de usuario
usersRouter.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Buscar al usuario por email
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ success: false, message: 'Credenciales inválidas.' })
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Credenciales inválidas.' })
    }

    // Verificar si el usuario ha confirmado su correo electrónico
    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Por favor, verifica tu correo antes de iniciar sesión.' })
    }

    // Generar el token JWT de autenticación
    const authToken = tokenService.generateAuthToken(user)

    // Guardar el token en una cookie HTTP-only
    res.cookie('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 semana
    })

    return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: 'Error al iniciar sesión.' })
  }
})

// Old Login de usuario
// usersRouter.post('/login', async (req, res) => {
//   const { email, password } = req.body
//   try {
//     const user = await User.findOne({ email })
//     const passwordCorrect = user === null
//       ? false
//       : await bcrypt.compare(password, user.passwordHash)

//     if (!(user && passwordCorrect)) {
//       return res.status(401).json({
//         error: 'invalid user or password'
//       })
//     }

//     const userForToken = {
//       id: user._id,
//       email: user.email
//     }

//     const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '7d' })

//     // Incluir más datos en la respuesta de autenticación
//     res.json({
//       success: true,
//       name: user.name,
//       lastName: user.lastName,
//       email: user.email,
//       userAvatar: user.userAvatar,
//       description: user.description,
//       vehicles: user.vehicles,
//       id: user._id,
//       token
//     })
//   } catch (error) {
//     console.log({ error })
//     res.status(500).json({ success: false, error: 'Internal Server Error' })
//   }
// })

// Signup de usuario
usersRouter.post('/signup', async (req, res) => {
  const { email, password, name, lastName, userAvatar, description } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ success: false, exists: true })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      email,
      passwordHash: hashedPassword,
      name,
      lastName,
      userAvatar,
      description
    })
    await newUser.save()

    // Generamos un token JWT tras el signup
    const token = jwt.sign({ id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    // Enviar el token en la respuesta
    res.status(201).json({ success: true, token })
  } catch (error) {
    console.log({ error })
    res.status(500).json({ success: false, error: 'Internal Server Error' })
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

// Profile del usurio logueado
// Esta ruta debe ir antes del get usuario por su ID
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

// Actualizar el perfil del usuario autenticado
usersRouter.put('/profile', auth, async (req, res) => {
  const { name, lastName, userAvatar, description, vehicles } = req.body

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        lastName,
        userAvatar,
        description,
        vehicles
      },
      { new: true } // Retorna el documento actualizado
    )

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Error updating profile.' })
  }
})

module.exports = usersRouter
