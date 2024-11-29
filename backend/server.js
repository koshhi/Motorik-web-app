const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const usersRouter = require('./controllers/users')
const eventsRouter = require('./controllers/events')
const vehiclesRouter = require('./controllers/vehicle')
const ticketsRouter = require('./controllers/tickets')
const authRouter = require('./controllers/auth')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
require('./config/passport')

dotenv.config()

console.log('JWT_SECRET:', process.env.JWT_SECRET)

const app = express()
// app.use(cors())
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
)
app.use(cookieParser())
app.use(express.json())

// Configurar express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
)

app.use(passport.initialize())
app.use(passport.session())

// Rutas
app.use('/api/users', usersRouter)
app.use('/api/login', usersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/vehicles', vehiclesRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/auth', authRouter)

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error))

const PORT = process.env.PORT || 5002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
