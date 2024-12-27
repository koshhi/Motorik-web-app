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
/**
 * Enviar un correo de confirmación de inscripción al usuario.
 * @param {string} to - Email del usuario
 * @param {object} event - Objeto evento con campos: title, startDate, location, eventType, etc.
 * @param {object} ticket - Objeto ticket con campos: name, price
 * @param {object} vehicle - Objeto vehicle con campos: brand, model, nickname, image
 * @param {string} status - 'attending' o 'confirmation pending'
 */
async function sendEnrollmentConfirmationEmail(to, event, ticket, vehicle, status) {
  const eventTitle = event.title
  const eventDate = new Date(event.startDate).toLocaleString()
  const eventLocation = event.location
  const eventType = event.eventType
  const ticketName = ticket.name
  const ticketPrice = ticket.price ? `${ticket.price}€` : 'Gratis'

  // Para mayor privacidad, no exponer IDs, solo datos básicos.
  // Obtener el usuario a partir del event.attendees es opcional, ya que tenemos 'to' y no necesitamos IDs internos.
  const userAttendee = event.attendees.find(att => att.userId && att.userId.email === to)

  const userName = userAttendee && userAttendee.userId.name ? userAttendee.userId.name : 'Usuario'

  const subject = status === 'attending'
    ? `¡Tu inscripción ha sido confirmada para ${eventTitle}!`
    : `Tu inscripción en ${eventTitle} está pendiente de confirmación`

  let heading = ''
  let message = ''

  if (status === 'attending') {
    heading = '¡Inscripción Confirmada!'
    message = 'Tu inscripción ha sido aprobada por el organizador.'
  } else {
    heading = 'Inscripción Pendiente de Confirmación'
    message = 'Tu inscripción requiere aprobación del organizador. Te notificaremos cuando se confirme.'
  }

  const eventLink = `${process.env.REACT_APP_CLIENT_URL}/events/${event.id}` // Ajustar si no se quiere exponer id y si se usa slug en el futuro

  let htmlContent = `
    <h1>${heading}</h1>
    <p>Hola ${userName},</p>
    <p>${message}</p>
    <h2>Detalles del Evento:</h2>
    <ul>
      <li><strong>Título:</strong> ${eventTitle}</li>
      <li><strong>Fecha:</strong> ${eventDate}</li>
      <li><strong>Ubicación:</strong> ${eventLocation}</li>
      <li><strong>Tipo de Evento:</strong> ${eventType}</li>
    </ul>
    <h2>Tu Ticket:</h2>
    <ul>
      <li><strong>Tipo de Ticket:</strong> ${ticketName}</li>
      <li><strong>Precio:</strong> ${ticketPrice}</li>
    </ul>
  `

  // Mostrar datos del vehículo solo si existe y sin exponer IDs.
  if (vehicle && vehicle.brand && vehicle.model) {
    htmlContent += `
      <h2>Vehículo Seleccionado:</h2>
      <ul>
        <li><strong>Marca:</strong> ${vehicle.brand}</li>
        <li><strong>Modelo:</strong> ${vehicle.model}</li>
        ${vehicle.nickname ? `<li><strong>Nickname:</strong> ${vehicle.nickname}</li>` : ''}
      </ul>
    `
  }

  htmlContent += `
    <p>Puedes ver más detalles del evento aquí: <a href="${eventLink}">Ver Evento</a></p>
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
    console.log(`Enrollment confirmation email (status: ${status}) sent to ${to}`)
  } catch (error) {
    console.error(`Error sending enrollment confirmation email: ${error}`)
    throw new Error('Error sending enrollment confirmation email.')
  }
}

module.exports = { sendVerificationEmail, sendLoginEmail, sendEnrollmentConfirmationEmail }
