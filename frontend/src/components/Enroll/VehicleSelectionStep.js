// frontend/src/components/enroll/VehicleSelectionStep.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import styled from 'styled-components';
import Typography from '../Typography';
import Button from '../Button/Button';
import { useVehicles } from '../../context/VehicleContext';
import { useAuth } from '../../context/AuthContext';
import AddVehicleModal from '../Modal/AddVehicleModal';
import InfoModal from '../Modal/InfoModal';
import { theme } from '../../theme';

const VehicleSelectionStep = ({ onVehicleSelected, onCancel, eventRequiresVehicle }) => {
  const { vehicles, fetchVehicles, loading } = useVehicles();
  const { user } = useAuth();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Si el evento requiere vehículo, mostramos el InfoModal al iniciar
  useEffect(() => {
    if (eventRequiresVehicle) {
      setShowInfoModal(true);
    }
  }, [eventRequiresVehicle]);

  // Llamamos a fetchVehicles al montar (si user existe)
  useEffect(() => {
    if (user && fetchVehicles) {
      fetchVehicles(user.id);
    }
  }, [user, fetchVehicles]);

  const handleCardClick = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
  };

  const handleContinue = () => {
    const vehicle = vehicles.find((v) => v._id === selectedVehicleId);
    if (vehicle) onVehicleSelected(vehicle);
  };

  return (
    <>
      {showInfoModal && (
        <InfoModal
          isOpen={showInfoModal}
          onContinue={() => setShowInfoModal(false)}
          onClose={onCancel}
        />
      )}
      <Modal title="Selecciona tu Vehículo" onClose={onCancel} maxWidth="500px" isOpen={true}>
        {loading ? (
          <>
            <Container>
              <Typography $variant="body-1-regular">
                Cargando vehículos...
              </Typography>
            </Container>
          </>
        ) : vehicles.length === 0 ? (
          <>
            <Container>
              <EmptyState>
                <EmptyStateHeader>
                  <Typography $variant="title-5-semibold">
                    Tu garaje está vacío.
                  </Typography>
                  <Typography $variant="body-1-medium" $align="center" color={theme.colors.defaultWeak}>
                    Añade un vehículo para continuar con la inscripción.
                  </Typography>
                </EmptyStateHeader>
                <Button
                  onClick={() => setShowAddModal(true)}>
                  <img src="/icons/add.svg" alt="Añadir" />
                  Añadir vehículo
                </Button>
              </EmptyState>
            </Container>
            <VehicleActions>
              <Button onClick={onCancel} $variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleContinue} disabled={!selectedVehicleId}>
                Continuar
                <img src="/icons/arrow-right-solid.svg" alt="Continue icon" />
              </Button>
            </VehicleActions>
          </>
        ) : (
          <>
            <Container>
              <VehiclesList>
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle._id}
                    selected={selectedVehicleId === vehicle._id}
                    onClick={() => handleCardClick(vehicle._id)}
                  >
                    <VehicleImage src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} />
                    <VehicleInfo>
                      {/* <Typography $variant="body-1-semibold">
                        {vehicle.brand} {vehicle.model}
                      </Typography>
                      {vehicle.nickname && (
                        <Typography $variant="body-2-regular">
                          {vehicle.nickname}
                        </Typography>
                      )}
                      <Typography $variant="body-2-regular">
                        Año: {vehicle.year}
                      </Typography> */}
                      {vehicle.nickname ? (
                        <>
                          <Typography $variant="body-1-medium" color={theme.colors.defaultMain}>
                            {vehicle?.brand}
                            <Typography as="span" color={theme.colors.defaultStrong} style={{ marginLeft: '4px' }}>
                              {vehicle?.model}
                            </Typography>
                          </Typography>
                          <Typography $variant="title-5-semibold" color={theme.colors.defaultMain}>{vehicle.nickname}</Typography>
                          <Typography $variant="body-3-medium" color={theme.colors.defaultStrong}>{vehicle.year}</Typography>
                        </>
                      ) : (
                        <>
                          <Typography $variant="body-1-medium" color={theme.colors.defaultMain}>
                            {vehicle?.brand}
                          </Typography>
                          <Typography $variant="title-5-semibold" color={theme.colors.defaultMain}>{vehicle.model}</Typography>
                          <Typography $variant="body-3-medium" color={theme.colors.defaultStrong}>{vehicle.year}</Typography>
                        </>
                      )}
                    </VehicleInfo>
                  </VehicleCard>
                ))}
                <VehicleAdd
                  onClick={() => setShowAddModal(true)}>
                  <img src="/icons/add.svg" alt="Añadir" />
                  <Typography $variant="title-5-medium" color={theme.colors.defaultWeak}>
                    Añadir vehículo
                  </Typography>
                </VehicleAdd>
              </VehiclesList>
            </Container>
            <VehicleActions>
              <Button onClick={onCancel} $variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleContinue} disabled={!selectedVehicleId}>
                Continuar
                <img src="/icons/arrow-right-solid.svg" alt="Continue icon" />
              </Button>
            </VehicleActions>
          </>
        )}

      </Modal>
      {showAddModal && (
        <AddVehicleModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onVehicleSaved={(newVehicle) => {
            setSelectedVehicleId(newVehicle._id);
            setShowAddModal(false);
          }}
        />
      )}
    </>
  );
};

VehicleSelectionStep.propTypes = {
  onVehicleSelected: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  eventRequiresVehicle: PropTypes.bool,
};

export default VehicleSelectionStep;

const Container = styled.div`
  padding: ${({ theme }) => theme.sizing.sm};
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
  gap: ${({ theme }) => theme.sizing.sm};
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 2px dashed ${({ theme }) => theme.border.defaultWeak};
  background: ${({ theme }) => theme.fill.defaultMain};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const EmptyStateHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xxs};
  width: 100%;
`;

const VehiclesList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-items: flex-start;
`;

const VehicleCard = styled.ul`
  border: 2px solid ${({ selected, theme }) => (selected ? theme.colors.brandMain : theme.border.defaultSubtle)};
  border-radius: ${({ theme }) => theme.radius.xs};
  padding: ${({ theme }) => theme.radius.xs};
  gap: ${({ theme }) => theme.sizing.sm};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  transition: border 0.3s ease;
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brandMain};
  }
`;

const VehicleInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const VehicleActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  padding: ${({ theme }) => theme.sizing.sm};
  width: 100%;
`;

const VehicleImage = styled.img`
  height: 80px;
  width: auto;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  object-fit: cover;
`;

const VehicleAdd = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;  
  gap: ${({ theme }) => theme.sizing.xs};
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 2px dashed ${({ theme }) => theme.border.defaultWeak};
  background: ${({ theme }) => theme.fill.defaultMain};
  padding: ${({ theme }) => theme.sizing.sm};
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.fill.defaultSubtle};
  }
`;