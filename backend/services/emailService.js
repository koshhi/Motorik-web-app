// emailService.js
require('dotenv').config()
const sgMail = require('@sendgrid/mail')

// Establecer la clave API de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function sendVerificationEmail(to, subject, htmlContent) {
  const msg = {
    to,
    from: 'motorik.events@gmail.com', // Verifica que el email esté autorizado en SendGrid
    subject,
    html: htmlContent
  }

  try {
    await sgMail.send(msg)
    console.log(`Correo enviado a ${to}`)
  } catch (error) {
    console.error(`Error al enviar correo a ${to}:`, error)
    throw new Error('Error al enviar el correo de verificación.')
  }
}

module.exports = { sendVerificationEmail }
