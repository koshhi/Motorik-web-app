// utils/validators.js

const parseBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value
  } else if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true
    } else if (value.toLowerCase() === 'false') {
      return false
    }
  }
  return null
}

const validateTickets = (tickets) => {
  if (!Array.isArray(tickets) || tickets.length === 0) {
    throw new Error('Debe proporcionar una lista de tickets.')
  }

  tickets.forEach((ticket, index) => {
    if (!ticket.name || typeof ticket.name !== 'string' || ticket.name.trim() === '') {
      throw new Error(`El ticket en el índice ${index} debe tener un 'name' válido.`)
    }

    if (!ticket.type || !['free', 'paid'].includes(ticket.type)) {
      throw new Error(`El ticket en el índice ${index} debe tener un 'type' válido (free o paid).`)
    }

    if (ticket.type === 'paid') {
      if (ticket.price === undefined || typeof ticket.price !== 'number' || ticket.price <= 0) {
        throw new Error(`El ticket en el índice ${index} debe tener un 'price' mayor a 0 para tickets de pago.`)
      }
    }

    if (ticket.capacity === undefined || typeof ticket.capacity !== 'number' || ticket.capacity < 1) {
      throw new Error(`El ticket en el índice ${index} debe tener una 'capacity' de al menos 1.`)
    }
  })
}

// Nueva función para validar que el usuario pueda crear o editar un evento con tickets de pago.
const validatePaidEvent = (user, tickets) => {
  const hasPaidTicket = tickets.some(ticket => ticket.type === 'paid')
  if (hasPaidTicket) {
    if (!user.stripeConnectedAccountId || !user.chargesEnabled) {
      throw new Error('No puedes crear o editar un evento con tickets de pago sin tener una cuenta de Stripe validada y con cobros activados.')
    }
  }
}

module.exports = {
  validateTickets,
  parseBoolean,
  validatePaidEvent
}
