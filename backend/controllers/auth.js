const express = require('express')
const passport = require('passport')
const authRouter = express.Router()
const tokenService = require('../services/tokenService')

// Ruta para iniciar la autenticación con Google
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    // Generar el token JWT después de la autenticación exitosa
    const authToken = tokenService.generateAccessToken(req.user)

    const profileFilled = req.user.profileFilled

    // Redirigir al frontend con el token JWT en la URL
    res.redirect(`http://localhost:5001/login-with-token?token=${authToken}&profileFilled=${profileFilled}`)
  }
)

// Facebook OAuth
authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))
authRouter.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  async (req, res) => {
    const authToken = tokenService.generateAccessToken(req.user)
    const profileFilled = req.user.profileFilled

    // Redirigir al frontend con el token y profileFilled
    res.redirect(`http://localhost:5001/login-with-token?token=${authToken}&profileFilled=${profileFilled}`)
  }
)

module.exports = authRouter
