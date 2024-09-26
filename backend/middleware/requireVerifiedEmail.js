const requireVerifiedEmail = (req, res, next) => {
  if (!req.user.emailVerified) {
    return res.status(403).json({ success: false, message: 'Debes verificar tu correo electrónico.' })
  }
  next()
}

module.exports = requireVerifiedEmail
