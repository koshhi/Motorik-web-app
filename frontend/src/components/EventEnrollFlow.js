// frontend/src/components/EventEnrollFlow.js
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import TicketSelectionStep from './Enroll/TicketSelectionStep';
import VehicleSelectionStep from './Enroll/VehicleSelectionStep';
import PaymentStep from './Enroll/PaymentStep';
import EnrollmentConfirmationStep from './Enroll/EnrollmentConfirmationStep';

const initialState = {
  step: 1,
  selectedTicket: null,
  selectedVehicle: null
};

function enrollReducer(state, action) {
  switch (action.type) {
    case 'SET_TICKET':
      return { ...state, selectedTicket: action.payload };
    case 'SET_VEHICLE':
      return { ...state, selectedVehicle: action.payload };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

/**
 * Se espera que el callback onEnrollComplete reciba el evento actualizado.
 * La función enrollUser se pasará desde el padre (EventDetail) y debe retornar el evento actualizado.
 */
const EventEnrollFlow = ({ event, onEnrollComplete, onCancel, enrollUser }) => {
  const [state, dispatch] = useReducer(enrollReducer, initialState);
  const { step, selectedTicket, selectedVehicle } = state;

  // Paso 1: Selección de Ticket
  if (step === 1) {
    return (
      <TicketSelectionStep
        tickets={event.tickets}
        onTicketSelected={(ticket) => {
          // Guardamos el ticket seleccionado en el estado
          dispatch({ type: 'SET_TICKET', payload: ticket });
          // Si el evento requiere vehículo, pasamos al paso 2
          if (event.needsVehicle) {
            dispatch({ type: 'SET_STEP', payload: 2 });
          } else if (ticket.type === 'paid') {
            // Para tickets de pago sin vehículo requerido, ir al paso de pago
            dispatch({ type: 'SET_STEP', payload: 3 });
          } else {
            // Para tickets gratuitos sin vehículo requerido, ejecutamos la inscripción directamente
            enrollUser(ticket, null)
              .then((updatedEvent) => {
                onEnrollComplete(updatedEvent);
                dispatch({ type: 'SET_STEP', payload: 4 });
              })
              .catch((err) => {
                console.error('Error en inscripción gratuita:', err);
              });
          }
        }}
        onCancel={onCancel}
      />
    );
  }

  // Paso 2: Selección de Vehículo (para eventos que requieren vehículo)
  if (step === 2) {
    return (
      <VehicleSelectionStep
        onVehicleSelected={(vehicle) => {
          // Al seleccionar el vehículo, se guarda en el estado
          dispatch({ type: 'SET_VEHICLE', payload: vehicle });
          // Ahora, para tickets gratuitos (ya que para pagos se iría al paso 3) se ejecuta la inscripción
          if (selectedTicket && selectedTicket.type !== 'paid') {
            enrollUser(selectedTicket, vehicle)
              .then((updatedEvent) => {
                onEnrollComplete(updatedEvent);
                dispatch({ type: 'SET_STEP', payload: 4 });
              })
              .catch((err) => {
                console.error('Error en inscripción gratuita con vehículo:', err);
              });
          } else {
            // Si el ticket es de pago, pasamos al paso de pago
            dispatch({ type: 'SET_STEP', payload: 3 });
          }
        }}
        onCancel={onCancel}
        eventRequiresVehicle={event.needsVehicle}
      />
    );
  }

  // Paso 3: Pago (para tickets de pago)
  if (step === 3 && selectedTicket && selectedTicket.type === 'paid') {
    return (
      <PaymentStep
        eventId={event.id}
        ticket={selectedTicket}
        onPaymentSuccess={(paymentIntent) => {
          // Una vez confirmado el pago, se ejecuta la inscripción
          enrollUser(selectedTicket, selectedVehicle)
            .then((updatedEvent) => {
              onEnrollComplete(updatedEvent); // Se actualiza el estado global del evento
              dispatch({ type: 'RESET' });
            })
            .catch((err) => {
              console.error('Error en inscripción de pago:', err);
            });
          // Se pasa al paso de confirmación
          dispatch({ type: 'SET_STEP', payload: 4 });
        }}
        onCancel={onCancel}
      />
    );
  }

  // Paso 4: Confirmación de Inscripción
  if (step === 4) {
    return (
      <EnrollmentConfirmationStep
        enrollmentData={{
          ticket: selectedTicket,
          vehicle: selectedVehicle,
        }}
        onComplete={() => {
          onEnrollComplete(); // Llamada opcional si se desea
          dispatch({ type: 'RESET' });
        }}
        onCancel={onCancel}
      />
    );
  }

  return null;
};

EventEnrollFlow.propTypes = {
  event: PropTypes.object.isRequired,
  onEnrollComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  // enrollUser es la función que ejecuta la inscripción y devuelve el evento actualizado
  enrollUser: PropTypes.func.isRequired,
};

export default EventEnrollFlow;
