const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const usersRouter = require('./controllers/users')
const eventsRouter = require('./controllers/events')
const vehiclesRouter = require('./controllers/vehicle') // Importar el controlador de vehículos

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/users', usersRouter)
app.use('/api/login', usersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/vehicles', vehiclesRouter)

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error))

const PORT = process.env.PORT || 5002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
