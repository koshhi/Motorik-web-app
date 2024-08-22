const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const usersRouter = express.Router()

// Ruta para crear una cuenta
usersRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body
  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(409).json({ success: false, exists: true })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, passwordHash: hashedPassword, name })
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
    const users = await User.find().populate('events') // Usar populate para cargar los eventos asociados
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
    const user = await User.findById(id).populate('events')
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
