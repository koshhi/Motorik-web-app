// frontend/src/components/enroll/AdditionalInfoStep.js
import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import styled from 'styled-components';
import Typography from '../Typography';
import Button from '../Button/Button';

const AdditionalInfoStep = ({ onInfoCollected, onCancel }) => {
  const handleNext = () => {
    // Por ahora se envía información dummy
    onInfoCollected({ extra: 'Información adicional dummy' });
  };

  return (
    <Modal title="Información Adicional" onClose={onCancel} maxWidth="500px">
      <Container>
        <Typography $variant="body-1-regular">
          Aquí se recopilará información adicional necesaria para la inscripción.
        </Typography>
        <Button onClick={handleNext}>Continuar</Button>
        <Button onClick={onCancel} $variant="outline">
          Cancelar
        </Button>
      </Container>
    </Modal>
  );
};

AdditionalInfoStep.propTypes = {
  onInfoCollected: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AdditionalInfoStep;

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
