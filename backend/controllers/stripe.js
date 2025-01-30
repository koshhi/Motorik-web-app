// routes/stripe.js
const express = require('express')
const router = express.Router()
const Stripe = require('stripe')
const User = require('../models/User')
const dotenv = require('dotenv')
const auth = require('../middleware/auth')

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

/**
 * POST /stripe/create-or-connect-account
 * Crear una cuenta conectada, o devolver datos para incrustar onboarding.
 */
// router.post('/create-or-connect-account', async (req, res) => {
//   try {
//     const { userId } = req.body
//     const user = await User.findById(userId)

//     if (!user) {
//       return res.status(404).json({ error: 'Usuario no encontrado' })
//     }

//     // Si el usuario ya tiene cuenta conectada, la devolvemos
//     if (user.stripeConnectedAccountId) {
//       // Podrías chequear la cuenta para ver si requiere más steps
//       // Ej: fetch capabilities / requirements from Stripe
//       const account = await stripe.accounts.retrieve(user.stripeConnectedAccountId)

//       return res.json({
//         connectedAccountId: account.id,
//         chargesEnabled: account.charges_enabled
//         // Podrías regresar algo para decir "No hace falta onboarding" etc.
//       })
//     }

//     // Si el usuario NO tiene cuenta, creamos la cuenta Connect
//     const account = await stripe.accounts.create({
//       type: 'express', // o 'standard' si quieres un flow distinto
//       country: 'US', // ajusta según tu caso
//       email: user.email,
//       capabilities: {
//         transfers: { requested: true }
//       },
//       business_type: 'individual'
//       // ...
//     })

//     // Guardamos en el user la nueva cuenta
//     user.stripeConnectedAccountId = account.id
//     await user.save()

//     // Ejemplo: Si usas OnboardingElement, podrías crear un "account link" o
//     // "onboarding session" con la nueva API de Stripe:
//     // (El pseudo-código varía según la librería que uses)
//     const onboardingSession = await stripe.accountLinks.create({
//       account: account.id,
//       refresh_url: 'localhost:5001/stripe/onboarding/refresh',
//       return_url: 'localhost:5001/stripe/onboarding/return',
//       type: 'account_onboarding'
//     })

//     return res.json({
//       connectedAccountId: account.id,
//       chargesEnabled: account.charges_enabled,
//       onboardingUrl: onboardingSession.url
//       // En embedded onboarding real, la respuesta es distinta (generalmente config p/iframe)
//     })
//   } catch (error) {
//     console.error('Error creando/conectando cuenta:', error)
//     return res.status(500).json({ error: 'Error creando/conectando cuenta' })
//   }
// })

// ---------

/**
 * POST /stripe/create-or-connect-account
 * Crea una cuenta de Stripe (si no existe) y genera la URL de onboarding.
 */
router.post('/create-or-connect-account', auth, async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Si el usuario YA tiene cuenta conectada, la devolvemos
    if (user.stripeConnectedAccountId) {
      const account = await stripe.accounts.retrieve(user.stripeConnectedAccountId)
      return res.json({
        connectedAccountId: account.id,
        chargesEnabled: account.charges_enabled
      })
    }

    // Crear cuenta de Stripe para el usuario si no tiene cuenta conectada
    const account = await stripe.accounts.create({
      type: 'standard',
      country: 'ES',
      email: user.email
    })

    user.stripeConnectedAccountId = account.id
    await user.save()

    // const onboardingSession = await stripe.accountLinks.create({
    //   account: account.id,
    //   // refresh_url: `${process.env.FRONTEND_URL}/create-stripe-account`,
    //   // return_url: `${process.env.FRONTEND_URL}/user/${userId}/settings?onboarding=success`,
    //   refresh_url: `${process.env.FRONTEND_URL}/user/${userId}/settings?onboarding=cancelled`,
    //   return_url: `${process.env.FRONTEND_URL}/stripe-connection-success`,
    //   type: 'account_onboarding'
    // })

    // Generamos un Link de Onboarding con refresh y return
    const onboardingSession = await stripe.accountLinks.create({
      account: account.id,
      // En caso de “cancelar” o “volver atrás”, Stripe podría usar la refresh_url
      refresh_url: `${process.env.FRONTEND_URL}/user/${userId}/settings?onboarding=cancelled`,
      // En caso de terminar “con éxito” (o creer que sí), redirige a return_url
      return_url: `${process.env.FRONTEND_URL}/stripe-connection-success`,
      type: 'account_onboarding'
    })

    return res.json({
      connectedAccountId: account.id,
      chargesEnabled: account.charges_enabled,
      onboardingUrl: onboardingSession.url
    })
  } catch (error) {
    console.error('Error creando/conectando cuenta:', error)
    return res.status(500).json({ error: 'Error creando/conectando cuenta' })
  }
})

/**
 * GET /stripe/refresh-account-status?userId=xxx
 * Verifica si la cuenta (stripeConnectedAccountId) está en charges_enabled = true.
 */
router.get('/refresh-account-status', auth, async (req, res) => {
  try {
    const { userId } = req.query
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (!user.stripeConnectedAccountId) {
      // No hay cuenta de Stripe asociada
      return res.json({
        hasStripeAccount: false,
        chargesEnabled: false
      })
    }

    // Consultar a Stripe
    const account = await stripe.accounts.retrieve(user.stripeConnectedAccountId)
    // Actualizar local si cambió
    user.chargesEnabled = account.charges_enabled
    await user.save()

    return res.json({
      hasStripeAccount: !!user.stripeConnectedAccountId,
      chargesEnabled: user.chargesEnabled
    })
  } catch (error) {
    console.error('Error refrescando estado de cuenta:', error)
    return res.status(500).json({ error: 'Error refrescando estado de cuenta' })
  }
})

/**
 * POST /stripe/webhook
 * Webhook para eventos de Stripe. Especialmente account.updated,
 * donde podemos enterarnos si se habilitan los cobros (charges_enabled).
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event

  try {
    const signature = req.headers['stripe-signature']
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message)
    return res.sendStatus(400)
  }

  // Manejar evento
  switch (event.type) {
    case 'account.updated': {
      const account = event.data.object
      try {
        // Buscar el user con este accountId
        const user = await User.findOne({ stripeConnectedAccountId: account.id })
        if (user) {
          user.chargesEnabled = account.charges_enabled
          await user.save()
          console.log(`Usuario ${user._id} actualizado. chargesEnabled = ${user.chargesEnabled}`)
        }
      } catch (error) {
        console.error('Error actualizando usuario en webhook:', error)
      }
      break
    }
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return res.sendStatus(200)
})

/**
 * POST /stripe/disconnect-account
 * Desvincular la cuenta de Stripe localmente (eliminando stripeConnectedAccountId).
 */
router.post('/disconnect-account', auth, async (req, res) => {
  try {
    const user = req.user

    if (!user.stripeConnectedAccountId) {
      return res.status(400).json({
        success: false,
        message: 'No hay ninguna cuenta de Stripe conectada'
      })
    }

    // Quita la referencia local
    user.stripeConnectedAccountId = null
    user.chargesEnabled = false
    await user.save()

    // Devuelve el usuario actualizado
    return res.json({
      success: true,
      message: 'Cuenta de Stripe desvinculada.',
      user // <--- user actualizado
    })
  } catch (error) {
    console.error('Error desconectando cuenta de Stripe:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al desconectar cuenta de Stripe.'
    })
  }
})

// backend/controllers/stripe.js
router.post('/create-account-link', auth, async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
    }
    if (!user.stripeConnectedAccountId) {
      return res.status(400).json({ success: false, message: 'No hay cuenta de Stripe conectada' })
    }

    // Pedimos la info actual de la cuenta a Stripe
    const account = await stripe.accounts.retrieve(user.stripeConnectedAccountId)

    // Si la cuenta no está habilitada, creamos un Link de Onboarding
    // que devuelva al user a Stripe para completar la verificación:
    // (equivalente a type: 'account_onboarding')
    if (!account.charges_enabled) {
      // Generar un nuevo enlace de "account_onboarding"
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.FRONTEND_URL}/user/${userId}/settings?onboarding=cancelled`,
        return_url: `${process.env.FRONTEND_URL}/stripe-connection-success`,
        type: 'account_onboarding'
      })

      return res.json({
        success: true,
        url: accountLink.url, // ← nuevo link para continuar la verificación
        message: 'Nuevo onboarding link generado'
      })
    } else {
      // Si la cuenta YA tiene charges_enabled, quizá quieres devolver un login link,
      // o simplemente avisar "Ya está todo verificado".
      // Un caso de ejemplo: creamos link de login a Dashboard de Stripe:
      //
      const loginLink = await stripe.accounts.createLoginLink(account.id)
      return res.json({
        success: true,
        url: loginLink.url,
        message: 'La cuenta ya tiene pagos habilitados (charges_enabled).'
      })
      //
      // O devuelves un error si no quieres crear links:
      // return res.json({
      //   success: false,
      //   message: 'La cuenta ya tiene pagos habilitados (charges_enabled).'
      // })
    }
  } catch (error) {
    console.error('Error creando account link:', error)
    return res.status(500).json({ success: false, message: 'Error creando enlace de cuenta' })
  }
})

// router.post('/account', async (req, res) => {
//   try {
//     // Crea cuenta vacía
//     const account = await stripe.accounts.create({})
//     return res.json({ account: account.id })
//   } catch (error) {
//     console.error('Error al crear account Stripe:', error)
//     res.status(500).json({ error: error.message })
//   }
// })

// router.post('/account_session', async (req, res) => {
//   try {
//     const { account } = req.body
//     const accountSession = await stripe.accountSessions.create({
//       account,
//       components: {
//         account_onboarding: { enabled: true }
//       }
//     })
//     return res.json({ client_secret: accountSession.client_secret })
//   } catch (error) {
//     console.error('Error al crear account session:', error)
//     res.status(500).json({ error: error.message })
//   }
// })

// POST /stripe/create-login-link
// Recibe el ID de cuenta conectada y retorna un loginLink.url
// router.post('/create-login-link', auth, async (req, res) => {
//   try {
//     const { connectedAccountId } = req.body
//     if (!connectedAccountId) {
//       return res.status(400).json({
//         success: false,
//         message: 'No se recibió accountId'
//       })
//     }

//     // Validate user's stripe account
//     const user = req.user
//     if (!user.stripeConnectedAccountId || user.stripeConnectedAccountId !== connectedAccountId) {
//       return res.status(403).json({
//         success: false,
//         message: 'No autorizado para acceder a esta cuenta'
//       })
//     }

//     // Get account status first
//     const account = await stripe.accounts.retrieve(connectedAccountId)
//     if (!account.charges_enabled) {
//       return res.status(400).json({
//         success: false,
//         message: 'La cuenta aún no está completamente configurada'
//       })
//     }

//     // Generate Stripe login link
//     const loginLink = await stripe.accounts.createLoginLink(connectedAccountId)

//     return res.json({
//       success: true,
//       url: loginLink.url
//     })
//   } catch (error) {
//     console.error('Error creando login link de Stripe:', error)
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'Error creando login link de Stripe'
//     })
//   }
// })

module.exports = router
