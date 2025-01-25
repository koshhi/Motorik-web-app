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

    const onboardingSession = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/create-stripe-account`,
      return_url: `${process.env.FRONTEND_URL}/user/${userId}/settings?onboarding=success`,
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
 * Revisa si la cuenta conectada está habilitada (charges_enabled).
 */
router.get('/refresh-account-status', auth, async (req, res) => {
  try {
    const { userId } = req.query
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (!user.stripeConnectedAccountId) {
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
 * Webhook para recibir eventos como 'account.updated'
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

  // Handle event
  switch (event.type) {
    case 'account.updated': {
      const account = event.data.object
      try {
        // Buscar usuario con este accountId
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
    // Manejar otros eventos si lo necesitas (p.ej. payout.created, payment_intent.succeeded, etc.)
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 to acknowledge receipt of the event
  res.sendStatus(200)
})

router.post('/account', async (req, res) => {
  try {
    // Crea cuenta vacía
    const account = await stripe.accounts.create({})
    return res.json({ account: account.id })
  } catch (error) {
    console.error('Error al crear account Stripe:', error)
    res.status(500).json({ error: error.message })
  }
})

router.post('/account_session', async (req, res) => {
  try {
    const { account } = req.body
    const accountSession = await stripe.accountSessions.create({
      account,
      components: {
        account_onboarding: { enabled: true }
      }
    })
    return res.json({ client_secret: accountSession.client_secret })
  } catch (error) {
    console.error('Error al crear account session:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
