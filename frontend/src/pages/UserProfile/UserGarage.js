import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useVehicles } from '../../context/VehicleContext';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import styled from "styled-components";
import Button from "../../components/Button/Button";
import AddVehicleToGarageModal from '../../components/Modal/AddVehicleToGarageModal';
import Typography from '../../components/Typography';
import VehicleCard from '../../components/Card/VehicleCard';
import AddVehicleCard from '../../components/Card/AddVehicleCard';

const GarageTab = () => {
  const { user, refreshUserData } = useAuth();
  const { userId } = useParams();
  const [showGarageModal, setShowGarageModal] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [profileUser, setProfileUser] = useState(null);

  const { vehicles, fetchVehicles, addVehicle, updateVehicle, deleteVehicle, loading } = useVehicles();

  const fetchProfile = useCallback(async () => {
    try {
      const profileResponse = await axiosClient.get(`/api/users/${userId}`);
      if (profileResponse.data.success) {
        setProfileUser(profileResponse.data.user);
      } else {
        toast.error(profileResponse.data.message || 'Error al obtener el perfil.');
      }
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      toast.error('Error al obtener el perfil.');
    }
  }, [userId]);

  useEffect(() => {
    fetchVehicles(userId);
    fetchProfile();
  }, [fetchVehicles, fetchProfile, userId]);

  const isOwnGarage = user && user.id === userId;

  const openEditModal = (vehicle) => {
    setVehicleToEdit(vehicle);
    setShowGarageModal(true);
  };

  const openAddGarageModal = () => {
    setVehicleToEdit(null);
    setShowGarageModal(true);
  };

  const handleCloseGarageModal = () => {
    setShowGarageModal(false);
    setVehicleToEdit(null);
  };

  const handleGarageVehicleAddedOrUpdated = async (newVehicle, existingVehicleId = null) => {
    console.log('handleGarageVehicleAddedOrUpdated called', { newVehicle, existingVehicleId });
    if (existingVehicleId) {
      toast.success('Vehículo actualizado.');
    } else {
      toast.success('Vehículo añadido al garaje.');
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    console.log('handleDeleteVehicle called', vehicleId);
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este vehículo?');
    if (!confirmDelete) return;

    const success = await deleteVehicle(vehicleId);
    if (success) {
      toast.success('Vehículo eliminado.');
    }
  };

  return (
    <>
      <Garage>
        <Container>
          <Header>
            <Typography $variant="title-4-semibold" as="h3">
              {isOwnGarage ? 'Tu Garaje' : 'Garaje'}
            </Typography>
            {isOwnGarage && (
              <Button $variant='outline' onClick={openAddGarageModal}>
                <img src='/icons/add.svg' alt='Añadir' /> Añadir vehículo
              </Button>
            )}
          </Header>
          {vehicles.length > 0 ? (
            <VehicleGrid>
              {vehicles.map(vehicle => (

                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  isOwnGarage={isOwnGarage}
                  openEditModal={openEditModal}
                  handleDeleteVehicle={handleDeleteVehicle}
                />
              ))}
              {isOwnGarage && (
                <AddVehicleCard onClick={openAddGarageModal} />
              )}
            </VehicleGrid>
          ) : (
            <VehicleGrid>
              <AddVehicleCard onClick={openAddGarageModal} />
            </VehicleGrid>
          )}
        </Container>
        {isOwnGarage && (
          <>
            {/* Modal para Añadir o Editar Vehículos al Garaje */}
            <AddVehicleToGarageModal
              isOpen={showGarageModal}
              onClose={handleCloseGarageModal}
              onVehicleAdded={handleGarageVehicleAddedOrUpdated}
              vehicle={vehicleToEdit}
            />
          </>
        )}
      </Garage>
    </>
  );
};

export default GarageTab;

const Garage = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  padding-bottom: 0px;
  width: 100%;
  max-width: 1400px;
  gap: ${({ theme }) => theme.sizing.md};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const VehicleGrid = styled.ul`
  grid-template-columns: 1fr 1fr 1fr 1fr;
  display: grid;
  gap: 1rem;
  padding: 0;
  list-style: none;
`;