// frontend/src/components/Enroll/EnrollmentConfirmationStep.js
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import styled from 'styled-components';
import Typography from '../Typography';

const EnrollmentConfirmationStep = ({ enrollmentData, onComplete, onCancel }) => {
  const { ticket, vehicle } = enrollmentData;

  // Mostrar mensaje personalizado según el tipo de inscripción
  const confirmationMessage = ticket.approvalRequired
    ? 'Tu inscripción se ha realizado correctamente. En breve el organizador te confirmará tu asistencia.'
    : '¡Inscripción exitosa! Tu inscripción se ha completado correctamente.';

  // Una vez que se muestre esta pantalla, esperamos 3 segundos y automáticamente 
  // llamamos onComplete para dar por finalizado el flujo.
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Modal title="Inscripción Confirmada" onClose={onCancel} maxWidth="500px">
      <Container>
        <Typography $variant="title-5-semibold">¡Inscripción Exitosa!</Typography>
        <Typography $variant="body-1-regular">
          Te has inscrito con la entrada: <strong>{ticket.name}</strong>
        </Typography>
        {vehicle && (
          <Typography $variant="body-1-regular">
            Vehículo: {vehicle.brand} {vehicle.model} {vehicle.nickname ? `(${vehicle.nickname})` : ''}
          </Typography>
        )}
        <Typography $variant="body-2-regular">
          {confirmationMessage}
        </Typography>
      </Container>
    </Modal>
  );
};

EnrollmentConfirmationStep.propTypes = {
  enrollmentData: PropTypes.shape({
    ticket: PropTypes.object.isRequired,
    vehicle: PropTypes.object,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EnrollmentConfirmationStep;

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
