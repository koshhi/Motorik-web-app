// components/Modal/InfoModal.js

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from './Modal';
import Button from '../Button/Button';
import Typography from '../Typography';

const InfoModal = ({ isOpen, onClose, onContinue }) => {
  return (
    <Modal title="Inscríbe tu vehículo" onClose={onClose} isOpen={isOpen} maxWidth="350px">
      <InfoContainer>
        <InfoBlock>
          <InfoImageContainer>
            <img src="/icons/vehicle.svg" alt="info-icon" />
          </InfoImageContainer>
          <Typography $variant="title-5-semibold" $align="center">
            Este evento requiere un vehículo para inscribirte.
          </Typography>
          <Typography $variant="body-1-regular" $align="center">
            Para participar en este evento, debes inscribir un vehículo. Puedes seleccionar uno existente o añadir uno nuevo.
          </Typography>
        </InfoBlock>
        <ActionsContainer>
          <Button onClick={onContinue} $fullWidth $contentAlign="center">Continuar</Button>
          <Button $variant="outline" onClick={onClose} $fullWidth $contentAlign="center">Cerrar</Button>
        </ActionsContainer>
      </InfoContainer>
    </Modal>
  );
};

InfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default InfoModal;

// Estilos
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const InfoImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background-color: ${({ theme }) => theme.fill.brandAlphaMain16};
  margin-bottom: ${({ theme }) => theme.sizing.xs};
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  width: 100%;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
  padding: ${({ theme }) => theme.sizing.sm};
  align-items: center;
`;
