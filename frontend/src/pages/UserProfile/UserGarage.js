import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import styled from "styled-components";
import Button from "../../components/Button/Button";
import AddVehicleModal from '../../components/Modal/AddVehicleModal';

const GarageTab = ({ vehicles }) => {
  const { user, refreshUserData } = useAuth();
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [userVehicles, setUserVehicles] = useState([]);

  useEffect(() => {
    // Función para obtener los vehículos de un usuario
    const fetchVehicles = async () => {
      try {
        const response = await axiosClient.get(`/api/vehicles/user/${userId}`);
        const data = response.data;

        if (data.success) {
          setUserVehicles(data.vehicles);
        } else {
          console.error('Error al obtener los vehículos:', data.message);
        }
      } catch (error) {
        console.error('Error al obtener los vehículos:', error);
      }
    };

    const fetchProfile = async () => {
      try {
        const profileResponse = await axiosClient.get(`/api/users/${userId}`);
        if (profileResponse.data.success) {
          setProfileUser(profileResponse.data.user);
        }
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
      }
    };

    fetchVehicles();
    fetchProfile();
  }, [userId]);

  const isOwnGarage = user && user.id === userId;

  const handleVehicleCreatedOrUpdated = (newVehicle) => {
    if (vehicleToEdit) {
      setUserVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle._id === newVehicle._id ? newVehicle : vehicle
        )
      );
    } else {
      setUserVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
    }
    refreshUserData();
    handleCloseModal(); // Cerrar el modal y resetear vehicleToEdit
  };

  const handleVehicleDeleted = (deletedVehicleId) => {
    setUserVehicles((prevVehicles) =>
      prevVehicles.filter((vehicle) => vehicle._id !== deletedVehicleId)
    );
    refreshUserData();
    handleCloseModal(); // Cerrar el modal y resetear vehicleToEdit
  };

  const openEditModal = (vehicle) => {
    setVehicleToEdit(vehicle);
    setShowModal(true);
  };

  const openAddModal = () => {
    setVehicleToEdit(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setVehicleToEdit(null);
  };

  return (
    <>
      <Garage>
        <Container>
          <Header>
            <h3>{isOwnGarage ? 'Tu Garaje' : 'Garaje'}</h3>
            {isOwnGarage && (
              <Button $variant='outline' onClick={openAddModal}>
                <img src='/icons/add.svg' alt='Añadir' />Añadir moto
              </Button>
            )}
          </Header>
          {userVehicles.length > 0 ? (
            <VehicleGrid>
              {userVehicles.map(vehicle => (
                <VehicleCard key={vehicle._id}>
                  <img className='Image' src={vehicle.image} alt={vehicle.brand} />
                  <div className='VehicleData'>
                    <p className='Brand'>{vehicle.brand}<span className='Model'> {vehicle.model}</span></p>
                    <p className='Subtitle'>{vehicle.nickname}</p>
                    <p className='Year'>{vehicle.year}</p>
                  </div>
                  {isOwnGarage && (
                    <Button className='EditButton' $variant="defaultInverse" onClick={() => openEditModal(vehicle)}>
                      <img src='/icons/edit-solid.svg' alt='Editar' />
                    </Button>
                  )}
                </VehicleCard>
              ))}
              {isOwnGarage && (
                <VehicleCard style={{ justifyContent: "center" }} onClick={openAddModal}>
                  <div className='EmptyVehicleTrigger'>
                    <img src='/icons/add-solid.svg' alt='Añadir' />Añadir moto
                  </div>
                </VehicleCard>
              )}
            </VehicleGrid>
          ) : (
            <p>No tienes vehículos en tu garaje.</p>
          )}
        </Container>
        {isOwnGarage && (
          <AddVehicleModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onVehicleSaved={handleVehicleCreatedOrUpdated}
            onVehicleDeleted={handleVehicleDeleted}
            vehicle={vehicleToEdit}
          />
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  grid-auto-flow: row;
`;

const VehicleCard = styled.li`
  border-radius: var(--Spacing-sm, 16px);
  border: 1px solid var(--border-default-subtle, #EFEFEF);
  background: var(--bg-default-main, #FFF);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  display: flex;
  padding: var(--Spacing-sm, 16px);
  flex-direction: column;
  align-items: center;
  gap: var(--Spacing-sm, 16px);
  align-self: stretch;
  position: relative;

  .EditButton {
    position: absolute;
    top: 24px;
    right: 24px;
  }

  .Image {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 8px;
    object-fit: cover;
  }

  .VehicleData {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

    .Brand {
      color: var(--text-icon-default-main, #292929);
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;

      /* Body/Body 2/Semibold */
      font-family: "Mona Sans";
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 19.6px */
    }

    .Model {
      color: var(--text-icon-default-weak, #656565);
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;

      /* Body/Body 3/Medium */
      font-family: "Mona Sans";
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: 150%; /* 19.5px */
    }

    .Subtitle {
      color: var(--text-icon-default-main, #292929);
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;

      /* Body/Body 1/Semibold */
      font-family: "Mona Sans";
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 150%; /* 24px */
    }
    .Year {
      color: var(--text-icon-default-weak, #656565);
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;

      /* Body/Body 3/Medium */
      font-family: "Mona Sans";
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: 150%; /* 19.5px */
    }
  }

  .EmptyVehicleTrigger {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: ${({ theme }) => theme.sizing.xs};
  }
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