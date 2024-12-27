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
            <h3>{isOwnGarage ? 'Tu Garaje' : 'Garaje'}</h3>
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


                // <VehicleCard key={vehicle._id}>
                //   <img className='Image' src={vehicle.image} alt={vehicle.brand} />
                //   <div className='VehicleData'>
                //     <p className='Brand'>
                //       {vehicle.brand}
                //       <span className='Model'> {vehicle.model}</span>
                //     </p>
                //     {vehicle.nickname && <p className='Subtitle'>Apodo: {vehicle.nickname}</p>}
                //     <p className='Year'>Año: {vehicle.year}</p>
                //   </div>
                //   {isOwnGarage && (
                //     <>
                //       <Button
                //         className='EditButton'
                //         $variant="defaultInverse"
                //         onClick={() => openEditModal(vehicle)}
                //       >
                //         <img src='/icons/edit-solid.svg' alt='Editar' />
                //       </Button>
                //       <Button
                //         className='DeleteButton'
                //         $variant="outlineDanger"
                //         onClick={() => handleDeleteVehicle(vehicle._id)}
                //       >
                //         Eliminar
                //       </Button>
                //     </>
                //   )}
                // </VehicleCard>
              ))}
              {/* {isOwnGarage && (
                <VehicleCard style={{ justifyContent: "center" }} onClick={openAddGarageModal}>
                  <div className='EmptyVehicleTrigger'>
                    <img src='/icons/add-solid.svg' alt='Añadir' /> Añadir vehículo
                  </div>
                </VehicleCard>
              )} */}

              {isOwnGarage && (
                <AddVehicleCard onClick={openAddGarageModal} />
              )}
            </VehicleGrid>
          ) : (
            <Typography>No tienes vehículos en tu garaje.</Typography>
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

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const VehicleGrid = styled.ul`
  // display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  // grid-template-rows: 1fr 1fr 1fr 1fr;
  // gap: 1rem;
  // grid-auto-flow: row;
  display: grid;
  // grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Mejor responsividad */
  gap: 1rem;
  padding: 0;
  list-style: none;
`;

// const VehicleCard = styled.li`
//   border-radius: var(--Spacing-sm, 16px);
//   border: 1px solid var(--border-default-subtle, #EFEFEF);
//   background: var(--bg-default-main, #FFF);
//   box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
//   display: flex;
//   padding: var(--Spacing-sm, 16px);
//   flex-direction: column;
//   align-items: center;
//   gap: var(--Spacing-sm, 16px);
//   align-self: stretch;
//   position: relative;

//   .EditButton {
//     position: absolute;
//     top: 24px;
//     right: 24px;
//   }

//   .Image {
//     width: 100%;
//     aspect-ratio: 1 / 1;
//     border-radius: 8px;
//     object-fit: cover;
//   }

//   .VehicleData {
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     width: 100%;

//     .Brand {
//       color: var(--text-icon-default-main, #292929);
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on;

//       /* Body/Body 2/Semibold */
//       font-family: "Mona Sans";
//       font-size: 14px;
//       font-style: normal;
//       font-weight: 600;
//       line-height: 140%; /* 19.6px */
//     }

//     .Model {
//       color: var(--text-icon-default-weak, #656565);
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on;

//       /* Body/Body 3/Medium */
//       font-family: "Mona Sans";
//       font-size: 13px;
//       font-style: normal;
//       font-weight: 500;
//       line-height: 150%; /* 19.5px */
//     }

//     .Subtitle {
//       color: var(--text-icon-default-main, #292929);
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on;

//       /* Body/Body 1/Semibold */
//       font-family: "Mona Sans";
//       font-size: 16px;
//       font-style: normal;
//       font-weight: 600;
//       line-height: 150%; /* 24px */
//     }
//     .Year {
//       color: var(--text-icon-default-weak, #656565);
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on;

//       /* Body/Body 3/Medium */
//       font-family: "Mona Sans";
//       font-size: 13px;
//       font-style: normal;
//       font-weight: 500;
//       line-height: 150%; /* 19.5px */
//     }
//   }

//   .EmptyVehicleTrigger {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-direction: column;
//     gap: ${({ theme }) => theme.sizing.xs};
//   }
// `;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  padding-bottom: 0px;
  width: 100%;
  max-width: 1400px;
  gap: ${({ theme }) => theme.sizing.md};
`;