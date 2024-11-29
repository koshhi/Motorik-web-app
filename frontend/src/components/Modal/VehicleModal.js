// components/Modal/VehicleModal.js

import React from 'react';
import styled from 'styled-components';
import Modal from '../Modal/Modal';
import Typography from '../Typography';
import Button from '../Button/Button';
import VehicleItem from './VehicleItem';
import { theme } from '../../theme';

const VehicleModal = ({
  vehicles,
  selectedVehicleId,
  handleVehicleSelect,
  onClose,
  onContinue,
}) => {
  return (
    <Modal title="Selecciona tu vehículo" onClose={onClose}>
      <ModalContent>
        <ModalHeading>
          <Typography $variant="title-5-semibold">Indica qué moto usarás</Typography>
          <Typography $variant="body-1-regular" color={theme.colors.defaultStrong}>
            Al inscribir tu moto en el evento haces más fácil que otras personas se inscriban en el evento.          </Typography>
        </ModalHeading>
        <VehicleList>
          {vehicles.map((vehicle) => (
            <VehicleItem
              key={vehicle._id}
              vehicle={vehicle}
              selected={selectedVehicleId === vehicle._id}
              onSelect={() => handleVehicleSelect(vehicle._id)}
            />
          ))}
        </VehicleList>
        <ModalActions>
          <Button
            onClick={onContinue}
            disabled={!selectedVehicleId}
            size="medium"
            style={{ justifyContent: "center", width: "100%" }}
          >
            Continuar
          </Button>
        </ModalActions>
      </ModalContent>
    </Modal>
  );
};

export default VehicleModal;

// Styled Components
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const VehicleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const ModalActions = styled.div`
  display: flex;
  flex-direction: row;
  padding: ${({ theme }) => theme.sizing.sm};
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
`;
