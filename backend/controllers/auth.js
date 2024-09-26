const express = require('express')
const passport = require('passport')
const authRouter = express.Router()

// Ruta para iniciar la autenticación con Google
authRouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

// Callback de Google después de la autenticación
authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirigir a la página principal después del éxito
    res.redirect('/')
  }
)

// Facebook OAuth
authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))
authRouter.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/')
})

module.exports = authRouter
