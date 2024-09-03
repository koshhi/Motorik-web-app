const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const User = require('../models/User')
const usersRouter = express.Router()

// exports.updateUserProfile = async (req, res) => {
//   const { name, lastName, userAvatar, description, enrolledEvents, organizedEvents, vehicles } = req.body

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       {
//         name,
//         lastName,
//         userAvatar,
//         description,
//         enrolledEvents,
//         organizedEvents,
//         vehicles
//       },
//       { new: true } // Retorna el documento actualizado
//     )

//     res.json({ success: true, user: updatedUser })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ success: false, message: 'Error updating profile.' })
//   }
// }

// Login de usuario
// usersRouter.post('/', async (req, res) => {
//   const { username, password } = req.body
//   try {
//     const user = await User.findOne({ username })
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
//       username: user.username
//     }

//     const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '7d' })

//     // Incluir más datos en la respuesta de autenticación
//     res.json({
//       success: true,
//       name: user.name,
//       lastName: user.lastName,
//       username: user.username,
//       userAvatar: user.userAvatar,
//       description: user.description,
//       enrolledEvents: user.enrolledEvents,
//       organizedEvents: user.organizedEvents,
//       vehicles: user.vehicles,
//       token
//     })
//   } catch (error) {
//     console.log({ error })
//     res.status(500).json({ success: false, error: 'Internal Server Error' })
//   }
// })
// Login de usuario
usersRouter.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid user or password'
      })
    }

    const userForToken = {
      id: user._id,
      username: user.username
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, { expiresIn: '7d' })

    // Incluir más datos en la respuesta de autenticación
    res.json({
      success: true,
      name: user.name,
      lastName: user.lastName,
      username: user.username,
      userAvatar: user.userAvatar,
      description: user.description,
      vehicles: user.vehicles,
      id: user._id,
      token
    })
  } catch (error) {
    console.log({ error })
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
})

// Signup de usuario
// usersRouter.post('/', async (req, res) => {
//   const { username, password, name, lastName, userAvatar, description } = req.body
//   try {
//     const existingUser = await User.findOne({ username })
//     if (existingUser) {
//       return res.status(409).json({ success: false, exists: true })
//     }
//     const hashedPassword = await bcrypt.hash(password, 10)
//     const newUser = new User({
//       username,
//       passwordHash: hashedPassword,
//       name,
//       lastName,
//       userAvatar,
//       description
//     })
//     await newUser.save()

//     // Generamos un token JWT tras el signup
//     const token = jwt.sign({ id: newUser._id, username: newUser.username },
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
usersRouter.post('/signup', async (req, res) => {
  const { username, password, name, lastName, userAvatar, description } = req.body
  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(409).json({ success: false, exists: true })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      username,
      passwordHash: hashedPassword,
      name,
      lastName,
      userAvatar,
      description
    })
    await newUser.save()

    // Generamos un token JWT tras el signup
    const token = jwt.sign({ id: newUser._id, username: newUser.username },
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

// Obtener todos los usuarios con sus eventos
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
