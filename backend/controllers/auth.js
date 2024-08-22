const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authRouter = express.Router()

// Ruta para login
authRouter.post('/', async (req, res) => {
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

    res.json({
      success: true,
      name: user.name,
      username: user.username,
      token
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
})

module.exports = authRouter
