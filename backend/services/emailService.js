// emailService.js
require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendVerificationEmail(to, subject, htmlContent) {
  const msg = { to, from: 'motorik.events@gmail.com', subject, html: htmlContent }
  try {
    await sgMail.send(msg)
    console.log(`Verification email sent to ${to}`)
  } catch (error) {
    console.error(`Error sending verification email: ${error}`)
    throw new Error('Error sending verification email.')
  }
}

// async function sendLoginEmail(to, subject, htmlContent) {
//   const msg = { to, from: 'motorik.events@gmail.com', subject, html: htmlContent }
//   try {
//     await sgMail.send(msg)
//     console.log(`Login email sent to ${to}`)
//   } catch (error) {
//     console.error(`Error sending login email: ${error}`)
//     throw new Error('Error sending login email.')
//   }
// }

async function sendLoginEmail(to, subject, htmlContent) {
  const msg = { to, from: 'motorik.events@gmail.com', subject, html: htmlContent }
  try {
    await sgMail.send(msg)
    console.log(`Login email sent to ${to}`)
  } catch (error) {
    console.error(`Error sending login email: ${error}`)
    throw new Error('Error sending login email.')
  }
}

module.exports = { sendVerificationEmail, sendLoginEmail }
