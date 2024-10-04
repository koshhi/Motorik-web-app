const dotenv = require('dotenv')
const express = require('express')
// const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const User = require('../models/User')
const usersRouter = express.Router()
// const { sendVerificationEmail } = require('../services/emailService')
// const { generateVerificationToken } = require('../services/tokenService')
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
      const loginToken = tokenService.generateAuthToken(user)
      const loginLink = `http://localhost:5001/login-with-token?token=${loginToken}`
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

      const loginToken = tokenService.generateAuthToken(user)
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
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    const profileFilled = user.profileFilled
    // console.log({ profileFilled })

    // Generar nuevo token JWT para la sesión
    const authToken = tokenService.generateAuthToken(user)

    return res.json({ success: true, token: authToken, user, profileFilled })
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid or expired token.' })
  }
})

// usersRouter.get('/verify-email', async (req, res) => {
//   const { token } = req.query

//   if (!token) {
//     return res.status(400).json({ success: false, message: 'Token inválido o inexistente.' })
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     const user = await User.findById(decoded.userId)

//     if (!user) {
//       return res.status(404).json({ success: false, message: 'Usuario no encontrado.' })
//     }

//     // Verificar el email
//     user.emailVerified = true
//     await user.save()

//     console.log('Email verificado')

//     const authToken = tokenService.generateAuthToken(user)
//     // res.cookie('authToken', authToken, { httpOnly: true })
//     res.json({ success: true, token: authToken, user })

//     res.redirect('http://localhost:5001') // Redirigir al home con el token en las cookies

//     // return res.status(200).json({ success: true, message: 'Correo verificado exitosamente.' })
//   } catch (error) {
//     console.error(error)
//     return res.status(400).json({ success: false, message: 'Token inválido o expirado.' })
//   }
// })

// // New Login de usuario
// usersRouter.post('/login', async (req, res) => {
//   const { email, password } = req.body

//   try {
//     // Buscar al usuario por email
//     const user = await User.findOne({ email })

//     if (!user) {
//       return res.status(400).json({ success: false, message: 'Credenciales inválidas.' })
//     }

//     // Verificar la contraseña
//     const isMatch = await bcrypt.compare(password, user.passwordHash)

//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: 'Credenciales inválidas.' })
//     }

//     // Verificar si el usuario ha confirmado su correo electrónico
//     if (!user.isVerified) {
//       return res.status(401).json({ success: false, message: 'Por favor, verifica tu correo antes de iniciar sesión.' })
//     }

//     // Generar el token JWT de autenticación
//     const authToken = tokenService.generateAuthToken(user)

//     // Guardar el token en una cookie HTTP-only
//     res.cookie('authToken', authToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production', // Solo en producción
//       sameSite: 'strict',
//       maxAge: 7 * 24 * 60 * 60 * 1000 // 1 semana
//     })

//     return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso.' })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ success: false, message: 'Error al iniciar sesión.' })
//   }
// })

// // Old Login de usuario
// // usersRouter.post('/login', async (req, res) => {
// //   const { email, password } = req.body
// //   try {
// //     const user = await User.findOne({ email })
// //     const passwordCorrect = user === null
// //       ? false
// //       : await bcrypt.compare(password, user.passwordHash)

// //     if (!(user && passwordCorrect)) {
// //       return res.status(401).json({
// //         error: 'invalid user or password'
// //       })
// //     }

// //     const userForToken = {
// //       id: user._id,
// //       email: user.email
// //     }

// //     const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '7d' })

// //     // Incluir más datos en la respuesta de autenticación
// //     res.json({
// //       success: true,
// //       name: user.name,
// //       lastName: user.lastName,
// //       email: user.email,
// //       userAvatar: user.userAvatar,
// //       description: user.description,
// //       vehicles: user.vehicles,
// //       id: user._id,
// //       token
// //     })
// //   } catch (error) {
// //     console.log({ error })
// //     res.status(500).json({ success: false, error: 'Internal Server Error' })
// //   }
// // })

// // Signup de usuario
// usersRouter.post('/signup', async (req, res) => {
//   const { email, password, name, lastName, userAvatar, description } = req.body
//   try {
//     const existingUser = await User.findOne({ email })
//     if (existingUser) {
//       return res.status(409).json({ success: false, exists: true })
//     }
//     const hashedPassword = await bcrypt.hash(password, 10)
//     const newUser = new User({
//       email,
//       passwordHash: hashedPassword,
//       name,
//       lastName,
//       userAvatar,
//       description
//     })
//     await newUser.save()

//     // Generamos un token JWT tras el signup
//     const token = jwt.sign({ id: newUser._id, email: newUser.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     )
//     // Enviar el token en la respuesta
//     res.status(201).json({ success: true, token })
//   } catch (error) {
//     console.log({ error })
//     res.status(500).json({ success: false, error: 'Internal Server Error' })
//   }
// })

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

    const { name, lastName, description, address, locality, country, phonePrefix, phoneNumber, socialMediaLinks } = req.body

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
