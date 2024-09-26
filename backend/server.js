const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const usersRouter = require('./controllers/users')
const eventsRouter = require('./controllers/events')
const vehiclesRouter = require('./controllers/vehicle')
const authRouter = require('./controllers/auth')
const passport = require('passport')
const session = require('express-session')
require('./config/passport')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Configurar express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}))

// Rutas
app.use('/api/users', usersRouter)
app.use('/api/login', usersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/vehicles', vehiclesRouter)
app.use('/auth', authRouter)
app.use(passport.initialize())
app.use(passport.session())

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error))

const PORT = process.env.PORT || 5002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
