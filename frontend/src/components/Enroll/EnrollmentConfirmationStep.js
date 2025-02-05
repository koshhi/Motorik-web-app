// frontend/src/components/enroll/EnrollmentConfirmationStep.js
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import styled from 'styled-components';
import Typography from '../Typography';
import Button from '../Button/Button';

const EnrollmentConfirmationStep = ({ enrollmentData, onComplete, onCancel }) => {
  const { ticket, vehicle } = enrollmentData;
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
        <Button onClick={onComplete}>Finalizar</Button>
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
