// components/Modal/ConfirmationModal.js

import React from 'react';
import styled from 'styled-components';
import Modal from '../Modal/Modal';
import Typography from '../Typography';
import Button from '../Button/Button';
import { theme } from '../../theme';
import { toast } from 'react-toastify';

const ConfirmationModal = ({
  enrollmentStatus,
  userEmail,
  timeLeft,
  eventLink,
  onClose,
  selectedVehicle,
}) => {
  return (
    <Modal title="Inscripción realizada" onClose={onClose}>
      <ModalContent>
        {enrollmentStatus === 'confirmation pending' ? (
          <>
            <Typography $variant="title-5-semibold" as="h2">Tu inscripción se ha realizado.</Typography>
            <Typography $variant="body-1-regular" as="p" color={theme.colors.defaultStrong}>
              en breve el organizador te hará saber si aprueba o no tu inscripción.</Typography>
          </>
        ) : (
          <>
            <Typography $variant="title-5-semibold" as="h2">Tu inscripción se ha realizado.</Typography>
            <Typography $variant="body-1-regular" as="p" color={theme.colors.defaultStrong}>
              Se ha enviado un correo electrónico de confirmación a <Typography $variant="body-1-medium" color={theme.colors.defaultMain}>{userEmail}</Typography>
            </Typography>
          </>
        )}
        <Counter>
          <img src="/icons/time-solid.svg" alt="time icon" />
          <Typography $variant="body-2-medium" style={{ flexGrow: '1' }}>
            El evento empieza en:
          </Typography>
          <Typography $variant="body-1-semibold" color={theme.colors.brandMain}>
            {timeLeft}
          </Typography>
        </Counter>
        {/* <URLSection>
          <Typography $variant="body-2-medium">
            URL del evento: <a href={eventLink}>{eventLink}</a>
          </Typography>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(eventLink);
              toast.success('URL copiada al portapapeles.');
            }}
            size="medium"
            style={{ justifyContent: "center", width: "100%" }}
          >
            Compartir evento
          </Button>
        </URLSection> */}
        {selectedVehicle && (
          <VehicleCard>
            <img src={selectedVehicle.image} alt={`${selectedVehicle.brand} ${selectedVehicle.model}`} />
            <VehicleInfo>
              <Typography $variant="body-2-medium">
                {selectedVehicle.name} {selectedVehicle.nickname && `- ${selectedVehicle.nickname}`}
              </Typography>
              <Typography $variant="body-2-regular">{selectedVehicle.model}</Typography>
            </VehicleInfo>
          </VehicleCard>
        )}
        <ModalActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(eventLink);
              toast.success('URL copiada al portapapeles.');
            }}
            size="medium"
            style={{ justifyContent: "center", width: "100%" }}
          >
            Compartir evento
          </Button>
          <Button $variant="outline" size="medium" style={{ justifyContent: "center", width: "100%" }}>
            Ver mi inscripción
          </Button>
        </ModalActions>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;

// Styled Components
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm};
  gap: ${({ theme }) => theme.sizing.sm};
  width: 100%;
`;

const Counter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: var(--Spacing-xs, 8px);
  background: var(--bg-default-subtle, #FAFAFA);
  padding: var(--Spacing-sm, 16px);
`;

const URLSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  a {
    color: ${({ theme }) => theme.colors.brandMain};
    text-decoration: underline;
  }
`;

const VehicleCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  padding: 16px;
  border-radius: 8px;
`;

const VehicleInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
`;
