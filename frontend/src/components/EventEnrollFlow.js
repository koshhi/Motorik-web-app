// frontend/src/components/EventEnrollFlow.js
import React, { useReducer } from 'react';
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

const EventEnrollFlow = ({ event, onEnrollComplete, onCancel }) => {
  const [state, dispatch] = useReducer(enrollReducer, initialState);
  const { step, selectedTicket, selectedVehicle } = state;

  // Paso 1: Selección de Ticket
  if (step === 1) {
    return (
      <TicketSelectionStep
        tickets={event.tickets}
        onTicketSelected={(ticket) => {
          dispatch({ type: 'SET_TICKET', payload: ticket });
          if (event.needsVehicle) {
            dispatch({ type: 'SET_STEP', payload: 2 });
          } else if (ticket.type === 'paid') {
            dispatch({ type: 'SET_STEP', payload: 3 });
          } else {
            dispatch({ type: 'SET_STEP', payload: 4 });
          }
        }}
        onCancel={onCancel}
      />
    );
  }

  // Paso 2: Selección de Vehículo (si el evento requiere vehículo)
  if (step === 2) {
    return (
      <VehicleSelectionStep
        onVehicleSelected={(vehicle) => {
          dispatch({ type: 'SET_VEHICLE', payload: vehicle });
          if (selectedTicket.type === 'paid') {
            dispatch({ type: 'SET_STEP', payload: 3 });
          } else {
            dispatch({ type: 'SET_STEP', payload: 4 });
          }
        }}
        onCancel={onCancel}
        eventRequiresVehicle={event.needsVehicle}
      />
    );
  }

  // Paso 3: Pasarela de Pago (para tickets de pago)
  if (step === 3 && selectedTicket.type === 'paid') {
    return (
      <PaymentStep
        eventId={event.id}
        ticket={selectedTicket}
        onPaymentSuccess={() => {
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
          onEnrollComplete();
          dispatch({ type: 'RESET' });
        }}
        onCancel={onCancel}
      />
    );
  }

  return null;
};

export default EventEnrollFlow;
