import React, { useState } from 'react';
import Button from "../../components/Button/Button";
import AddVehicleModal from '../../components/Modal/AddVehicleModal';
import styled from "styled-components";

const GarageTab = ({ vehicles }) => {
  const [showModal, setShowModal] = useState(false);
  const [userVehicles, setUserVehicles] = useState(vehicles);

  const handleVehicleCreated = (newVehicle) => {
    setUserVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
  };

  return (
    <Garage>
      <Container>
        <Header>
          <h3>Tu garaje</h3>
          <Button variant='outline' onClick={() => setShowModal(true)}>
            <img src='/icons/add.svg' alt='Añadir' />Añadir moto
          </Button>
        </Header>
        {userVehicles.length > 0 ? (
          <VehicleGrid>
            {userVehicles.map(vehicle => (
              <VehicleCard key={vehicle._id}>
                <img className='Image' src={vehicle.image} alt={vehicle.brand} />
                {vehicle.nickname.length > 0 ? (
                  <div className='VehicleData'>
                    <p className='Brand'>{vehicle.brand}<span className='Model'> {vehicle.model}</span></p>
                    <p className='Subtitle'>{vehicle.nickname}</p>
                    <p className='Year'>{vehicle.year}</p>
                  </div>
                ) : (
                  <div className='VehicleData'>
                    <p className='Brand'>{vehicle.brand}</p>
                    <p className='Subtitle'>{vehicle.model}</p>
                    <p className='Year'>{vehicle.year}</p>
                  </div>
                )}
              </VehicleCard>
            ))}
          </VehicleGrid>
        ) : (
          <p>No tienes vehículos en tu garaje.</p>
        )}
      </Container>
      <AddVehicleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onVehicleCreated={handleVehicleCreated}
      />
    </Garage>
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