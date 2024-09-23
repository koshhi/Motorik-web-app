const express = require('express')
const Vehicle = require('../models/Vehicle')
const User = require('../models/User')
const auth = require('../middleware/auth')
const vehiclesRouter = express.Router()
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const dotenv = require('dotenv')

// Cargar variables de entorno
dotenv.config()

// Configurar Cloudinary para usar las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configurar Multer para manejo de archivos
const storage = multer.diskStorage({})
const upload = multer({ storage })

// Crear un vehículo
// vehiclesRouter.post('/', auth, async (req, res) => {
//   const { brand, model, nickname } = req.body

//   try {
//     const newVehicle = new Vehicle({
//       brand,
//       model,
//       nickname,
//       owner: req.user.id
//     })

//     const savedVehicle = await newVehicle.save()

//     // Asociar el vehículo al usuario autenticado
//     const user = await User.findById(req.user.id)
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' })
//     }

//     user.vehicles.push(savedVehicle._id)
//     await user.save()

//     res.status(201).json({ success: true, vehicle: savedVehicle })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ success: false, message: 'Internal Server Error' })
//   }
// })

// Crear un vehículo con subida de imagen
vehiclesRouter.post('/', auth, upload.single('image'), async (req, res) => {
  const { brand, model, nickname, year } = req.body

  try {
    // Subir imagen a Cloudinary
    let imageUrl = ''
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      imageUrl = result.secure_url
    }

    const newVehicle = new Vehicle({
      brand,
      model,
      nickname,
      image: imageUrl,
      owner: req.user.id,
      year
    })

    const savedVehicle = await newVehicle.save()

    // Asociar el vehículo al usuario autenticado
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.vehicles.push(savedVehicle._id)
    await user.save()

    res.status(201).json({ success: true, vehicle: savedVehicle })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Actualizar un vehículo con subida de imagen
vehiclesRouter.put('/:id', auth, upload.single('image'), async (req, res) => {
  const { id } = req.params
  const { brand, model, nickname, year } = req.body

  try {
    const vehicle = await Vehicle.findById(id)
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' })
    }

    // Verificar si el usuario autenticado es el propietario del vehículo
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this vehicle' })
    }

    // Subir nueva imagen a Cloudinary si se proporciona
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      vehicle.image = result.secure_url
    }

    // Actualizar los campos
    vehicle.brand = brand
    vehicle.model = model
    vehicle.nickname = nickname
    vehicle.year = year

    const updatedVehicle = await vehicle.save()

    res.status(200).json({ success: true, vehicle: updatedVehicle })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// // Obtener todos los vehículos de un usuario
// vehiclesRouter.get('/user', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate('vehicles')
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' })
//     }

//     res.status(200).json({ success: true, vehicles: user.vehicles })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ success: false, message: 'Internal Server Error' })
//   }
// })

// Obtener todos los vehículos de un usuario por su ID
vehiclesRouter.get('/user/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('vehicles')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, vehicles: user.vehicles })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// Obtener un Vehículo por su ID
vehiclesRouter.get('/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    const vehicle = await Vehicle.findById(id)
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' })
    }

    // Verificar si el usuario autenticado es el propietario del vehículo
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this vehicle' })
    }

    res.status(200).json({ success: true, vehicle })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

// // Actualizar un vehículo
// vehiclesRouter.put('/:id', auth, async (req, res) => {
//   const { id } = req.params
//   const { brand, model, nickname, image } = req.body

//   try {
//     const vehicle = await Vehicle.findById(id)
//     if (!vehicle) {
//       return res.status(404).json({ success: false, message: 'Vehicle not found' })
//     }

//     // Verificar si el usuario autenticado es el propietario del vehículo
//     if (vehicle.owner.toString() !== req.user.id) {
//       return res.status(403).json({ success: false, message: 'Not authorized to update this vehicle' })
//     }

//     vehicle.brand = brand
//     vehicle.model = model
//     vehicle.nickname = nickname
//     vehicle.image = image

//     const updatedVehicle = await vehicle.save()

//     res.status(200).json({ success: true, vehicle: updatedVehicle })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ success: false, message: 'Internal Server Error' })
//   }
// })

// Eliminar un vehículo
// vehiclesRouter.delete('/:id', auth, async (req, res) => {
//   const { id } = req.params

//   try {
//     const vehicle = await Vehicle.findById(id)
//     if (!vehicle) {
//       return res.status(404).json({ success: false, message: 'Vehicle not found' })
//     }

//     // Verificar si el usuario autenticado es el propietario del vehículo
//     if (vehicle.owner.toString() !== req.user.id) {
//       return res.status(403).json({ success: false, message: 'Not authorized to delete this vehicle' })
//     }

//     // Usar deleteOne para eliminar el vehículo
//     await vehicle.deleteOne()

//     // Eliminar la referencia del vehículo del usuario
//     const user = await User.findById(req.user.id)
//     if (user) {
//       user.vehicles = user.vehicles.filter(v => v.toString() !== id)
//       await user.save()
//     }

//     res.status(200).json({ success: true, message: 'Vehicle deleted successfully' })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ success: false, message: 'Internal Server Error' })
//   }
// })

vehiclesRouter.delete('/:id', auth, async (req, res) => {
  const { id } = req.params

  try {
    const vehicle = await Vehicle.findById(id)
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' })
    }

    // Verificar si el usuario autenticado es el propietario del vehículo
    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this vehicle' })
    }

    // Usar deleteOne para eliminar el vehículo
    await vehicle.deleteOne()

    // Eliminar la referencia del vehículo del usuario
    const user = await User.findById(req.user.id)
    if (user) {
      user.vehicles = user.vehicles.filter(v => v.toString() !== id)
      await user.save()
    }

    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
})

module.exports = vehiclesRouter
