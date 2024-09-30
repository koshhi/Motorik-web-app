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
    const authToken = tokenService.generateAuthToken(req.user)

    // Redirigir al frontend con el token JWT en la URL
    res.redirect(`http://localhost:5001/login-with-token?token=${authToken}`)
  }
)

// Facebook OAuth
authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))
authRouter.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/')
})

module.exports = authRouter
