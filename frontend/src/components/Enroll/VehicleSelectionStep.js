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
      <Modal title="Selecciona tu Vehículo" onClose={onCancel} maxWidth="800px" isOpen={true}>
        <Container>
          {loading ? (
            <p>Cargando vehículos...</p>
          ) : vehicles.length === 0 ? (
            <EmptyState>
              <Typography $variant="body-1-regular">
                No tienes vehículos registrados.
              </Typography>
              <Button onClick={() => setShowAddModal(true)}>Añadir Vehículo</Button>
            </EmptyState>
          ) : (
            <>
              <Grid>
                {vehicles.map((vehicle) => (
                  <Card
                    key={vehicle._id}
                    selected={selectedVehicleId === vehicle._id}
                    onClick={() => handleCardClick(vehicle._id)}
                  >
                    <VehicleImage src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} />
                    <VehicleInfo>
                      <Typography $variant="body-1-semibold">
                        {vehicle.brand} {vehicle.model}
                      </Typography>
                      {vehicle.nickname && (
                        <Typography $variant="body-2-regular">
                          {vehicle.nickname}
                        </Typography>
                      )}
                      <Typography $variant="body-2-regular">
                        Año: {vehicle.year}
                      </Typography>
                    </VehicleInfo>
                  </Card>
                ))}
              </Grid>
              <Actions>
                <Button onClick={() => setShowAddModal(true)}>Añadir Vehículo</Button>
                <Button onClick={handleContinue} disabled={!selectedVehicleId}>
                  Continuar
                </Button>
                <Button onClick={onCancel} $variant="outline">
                  Cancelar
                </Button>
              </Actions>
            </>
          )}
        </Container>
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
  padding: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
`;

const Card = styled.div`
  border: 2px solid ${({ selected, theme }) => (selected ? theme.colors.brandMain : theme.border.defaultSubtle)};
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  width: calc(33.33% - 16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: border 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brandMain};
  }
`;

const VehicleImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
`;

const VehicleInfo = styled.div`
  margin-top: 8px;
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;
