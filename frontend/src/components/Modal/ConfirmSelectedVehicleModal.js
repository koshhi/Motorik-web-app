// components/Modal/ConfirmSelectedVehicleModal.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Modal from './Modal';
import Button from '../Button/Button';
import Typography from '../Typography';

const ConfirmSelectedVehicleModal = ({ isOpen, onClose, vehicle, onContinue, onChooseAnother }) => {
  if (!isOpen) return null;

  return (
    <Modal title="Confirmar Vehículo" onClose={onClose} maxWidth="500px">
      <VehicleDetails>
        <img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} />
        <div>
          <Typography $variant="body-1-semibold">
            {vehicle.brand} {vehicle.model} {vehicle.nickname && `(${vehicle.nickname})`}
          </Typography>
          <Typography $variant="body-2-medium">Año: {vehicle.year}</Typography>
        </div>
      </VehicleDetails>
      <ButtonsContainer>
        <Button $variant="outline" onClick={onChooseAnother}>
          Elegir Otro Vehículo
        </Button>
        <Button $variant="primary" onClick={onContinue}>
          Confirmar
        </Button>
      </ButtonsContainer>
    </Modal>

  );
};

ConfirmSelectedVehicleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  vehicle: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    image: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  onContinue: PropTypes.func.isRequired,
  onChooseAnother: PropTypes.func.isRequired,
};

export default ConfirmSelectedVehicleModal;

const VehicleDetails = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  
  img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;
