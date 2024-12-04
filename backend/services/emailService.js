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

/**
 * Enviar un correo de confirmación de inscripción al usuario.
 */
async function sendEnrollmentConfirmationEmail(to, event, ticket, vehicle, status) {
  const subject = status === 'attending'
    ? `Inscripción Confirmada para ${event.title}`
    : `Inscripción Pendiente para ${event.title}`

  let htmlContent = `
    <h1>${status === 'attending' ? '¡Inscripción Confirmada!' : 'Inscripción Pendiente de Confirmación'}</h1>
    <p>Hola ${event.attendees.find(att => att.userId.email === to)?.userId.name || 'Usuario'},</p>
    <p>Te has inscrito en el evento <strong>${event.title}</strong>.</p>
    <h2>Detalles del Evento:</h2>
    <ul>
      <li><strong>Fecha:</strong> ${new Date(event.startDate).toLocaleString()}</li>
      <li><strong>Ubicación:</strong> ${event.location}</li>
      <li><strong>Tipo de Evento:</strong> ${event.eventType}</li>
      <li><strong>Terreno:</strong> ${event.terrain}</li>
    </ul>
    <h2>Tu Ticket:</h2>
    <ul>
      <li><strong>Tipo:</strong> ${ticket.name}</li>
      <li><strong>Precio:</strong> ${ticket.price ? `$${ticket.price}` : 'Gratis'}</li>
    </ul>
    <h2>Vehículo Seleccionado:</h2>
    <ul>
      <li><strong>Marca:</strong> ${vehicle.brand}</li>
      <li><strong>Modelo:</strong> ${vehicle.model}</li>
      ${vehicle.nickname ? `<li><strong>Nickname:</strong> ${vehicle.nickname}</li>` : ''}
    </ul>
    <p>Estado de tu inscripción: <strong>${status === 'attending' ? 'Confirmada' : 'Pendiente de Confirmación'}</strong></p>
    <p>¡Esperamos verte en el evento!</p>
    <p>Saludos,<br/>Equipo de Motorik</p>
  `

  const msg = {
    to,
    from: 'motorik.events@gmail.com',
    subject,
    html: htmlContent
  }

  try {
    await sgMail.send(msg)
    console.log(`Enrollment confirmation email sent to ${to}`)
  } catch (error) {
    console.error(`Error sending enrollment confirmation email: ${error}`)
    throw new Error('Error sending enrollment confirmation email.')
  }
}

module.exports = { sendVerificationEmail, sendLoginEmail, sendEnrollmentConfirmationEmail }
