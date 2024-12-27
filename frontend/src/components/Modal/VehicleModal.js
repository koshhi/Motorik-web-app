// import React, { useState } from 'react';
// import styled from 'styled-components';
// import Modal from '../Modal/Modal';
// import Typography from '../Typography';
// import Button from '../Button/Button';
// import VehicleItem from './VehicleItem';
// import AddVehicleModal from '../Modal/AddVehicleModal'; // Importarlo

// import { theme } from '../../theme';


// const VehicleModal = ({
//   vehicles,
//   selectedVehicleId,
//   handleVehicleSelect,
//   onClose,
//   onContinue,
//   refreshUserData
// }) => {
//   const noVehicles = !vehicles || vehicles.length === 0;

//   const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

//   const handleVehicleCreatedOrUpdated = (newVehicle) => {
//     // Refrescar datos de usuario para que aparezca el nuevo vehículo
//     refreshUserData();
//     setShowAddVehicleModal(false);
//   };

//   const handleVehicleDeleted = (deletedVehicleId) => {
//     refreshUserData();
//     setShowAddVehicleModal(false);
//   };

//   return (
//     <Modal
//       title={noVehicles ? "Inscríbe tu vehículo" : "Selecciona tu vehículo"}
//       onClose={onClose}
//     >
//       <ModalContent>
//         {noVehicles ? (
//           <EmptyVehicleState onAddVehicle={() => setShowAddVehicleModal(true)} />
//         ) : (
//           <ExistingVehicleState
//             vehicles={vehicles}
//             selectedVehicleId={selectedVehicleId}
//             handleVehicleSelect={handleVehicleSelect}
//             onContinue={onContinue}
//           />
//         )}
//       </ModalContent>
//       {showAddVehicleModal && (
//         <AddVehicleModal
//           isOpen={showAddVehicleModal}
//           onClose={() => setShowAddVehicleModal(false)}
//           onVehicleSaved={handleVehicleCreatedOrUpdated}
//           onVehicleDeleted={handleVehicleDeleted}
//         />
//       )}
//     </Modal>
//   );
// };

// export default VehicleModal;

// components/Modal/VehicleModal.js

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Modal from '../Modal/Modal';
import Typography from '../Typography';
import Button from '../Button/Button';
import VehicleItem from './VehicleItem';
import AddVehicleModal from '../Modal/AddVehicleModal';
import PropTypes from 'prop-types';
import useVehicleHandlers from '../../hooks/useVehicleHandlers';
// import ConfirmationAfterVehicleCreationModal from './ConfirmationAfterVehicleCreationModal'; // Nuevo componente

import { theme } from '../../theme';


const VehicleModal = ({
  vehicles,
  selectedVehicleId,
  handleVehicleSelect,
  onClose,
  onContinue,
}) => {
  const noVehicles = !vehicles || vehicles.length === 0;

  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showPostCreationConfirmation, setShowPostCreationConfirmation] = useState(false);

  const previousVehiclesLengthRef = useRef(vehicles.length);

  const { handleVehicleCreatedOrUpdated, handleVehicleDeleted, loading } = useVehicleHandlers();


  useEffect(() => {
    // Detectar cambios en la cantidad de vehículos
    if (previousVehiclesLengthRef.current === 0 && vehicles.length === 1) {
      setShowPostCreationConfirmation(true);
    }
    previousVehiclesLengthRef.current = vehicles.length;
  }, [vehicles]);

  const handleContinueWithVehicle = () => {
    // Seleccionar automáticamente el único vehículo disponible
    const vehicle = vehicles.find(v => v._id);
    if (vehicle) {
      handleVehicleSelect(vehicle._id);
      onContinue();
      setShowPostCreationConfirmation(false);
      onClose();
    }
  };

  const handleCreateAnotherVehicle = () => {
    setShowPostCreationConfirmation(false);
    setShowAddVehicleModal(true);
  };

  const handleClosePostCreationConfirmation = () => {
    setShowPostCreationConfirmation(false);
    onClose();
  };

  return (
    <Modal
      title={noVehicles ? "Inscríbe tu vehículo" : "Selecciona tu vehículo"}
      onClose={onClose}
    >
      <ModalContent>
        {noVehicles ? (
          <EmptyVehicleState onAddVehicle={() => setShowAddVehicleModal(true)} />
        ) : (
          <ExistingVehicleState
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            handleVehicleSelect={handleVehicleSelect}
            onContinue={onContinue}
          />
        )}
      </ModalContent>
      {showAddVehicleModal && (
        <AddVehicleModal
          isOpen={showAddVehicleModal}
          onClose={() => setShowAddVehicleModal(false)}
          onVehicleSaved={handleVehicleCreatedOrUpdated}
          onVehicleDeleted={handleVehicleDeleted}
        />
      )}
      {showPostCreationConfirmation && (
        <ConfirmationAfterVehicleCreationModal
          vehicle={vehicles[0]} // Asumiendo que solo hay uno
          onCreateAnother={handleCreateAnotherVehicle}
          onContinue={handleContinueWithVehicle}
          onClose={handleClosePostCreationConfirmation}
        />
      )}
    </Modal>
  );
};

VehicleModal.propTypes = {
  vehicles: PropTypes.array.isRequired,
  selectedVehicleId: PropTypes.string,
  handleVehicleSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};

const EmptyVehicleState = ({ onAddVehicle }) => (
  <ModalEmptyVehicles>
    <EmptyMessage>
      <EmptyImage>
        <VehicleIcon src="/icons/vehicle.svg" alt="add-icon" />
      </EmptyImage>
      <EmptyData>
        <Typography as="p" $variant="title-5-semibold">
          Añade un vehículo para completar la inscripción.
        </Typography>
        <Typography as="p" $variant="body-1-regular" color={theme.colors.defaultStrong}>
          Para asistir al evento tienes que inscribirte con un vehículo.
        </Typography>
      </EmptyData>
    </EmptyMessage>

    <Button
      onClick={onAddVehicle}
      $variant="primary"
      size="medium"
    >
      Añadir Vehículo
    </Button>
  </ModalEmptyVehicles>
);

EmptyVehicleState.propTypes = {
  onAddVehicle: PropTypes.func.isRequired,
};

const ExistingVehicleState = ({ vehicles, selectedVehicleId, handleVehicleSelect, onContinue }) => (
  <>
    <ModalHeading>
      <Typography $variant="title-5-semibold">Indica qué moto usarás</Typography>
      <Typography $variant="body-1-regular" color={theme.colors.defaultStrong}>
        Selecciona la moto para inscribirte al evento.
      </Typography>
      <Typography $variant="body-1-regular" color={theme.colors.defaultStrong}>
        Al inscribir tu moto en el evento haces más fácil que otras personas se inscriban en el evento.
      </Typography>
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
        $variant="primary"
        size="medium"
        style={{ justifyContent: 'center', width: '100%' }}
      >
        Continuar
      </Button>
    </ModalActions>
  </>
);

ExistingVehicleState.propTypes = {
  vehicles: PropTypes.array.isRequired,
  selectedVehicleId: PropTypes.string,
  handleVehicleSelect: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};

const ConfirmationAfterVehicleCreationModal = ({ vehicle, onCreateAnother, onContinue, onClose }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <Header>
          <Typography $variant="title-5-semibold">Vehículo Creado</Typography>
        </Header>
        <VehicleDetails>
          <img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} />
          <div>
            <Typography $variant="body-1-semibold">{vehicle.brand} {vehicle.model}</Typography>
            {vehicle.nickname && <Typography $variant="body-2-medium">Apodo: {vehicle.nickname}</Typography>}
            <Typography $variant="body-2-medium">Año: {vehicle.year}</Typography>
          </div>
        </VehicleDetails>
        <Typography $variant="body-1-regular">
          Has creado un nuevo vehículo. ¿Quieres inscribirte con este vehículo o añadir otro?
        </Typography>
        <ButtonsContainer>
          <Button onClick={onCreateAnother} $variant="outline" disabled={!vehicle}>
            Añadir Otro Vehículo
          </Button>
          <Button onClick={onContinue} $variant="primary" disabled={!vehicle}>
            Inscribirme con Este Vehículo
          </Button>
        </ButtonsContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

ConfirmationAfterVehicleCreationModal.propTypes = {
  vehicle: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    image: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
  }).isRequired,
  onCreateAnother: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};




export default VehicleModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(26, 26, 26, 0.90);
  backdrop-filter: blur(12px);
  z-index: 1002;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

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


const ConfirmationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.md};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.sizing.sm};
  justify-content: flex-end;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ModalHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const ModalEmptyVehicles = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.md};
  padding: ${({ theme }) => theme.sizing.sm};  
  align-items: center;
  padding-top: ${({ theme }) => theme.sizing.lg};
  padding-bottom: ${({ theme }) => theme.sizing.lg};
`;

const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
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

const EmptyImage = styled.div`
  padding: ${({ theme }) => theme.sizing.sm};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultWeak};
  border-radius: ${({ theme }) => theme.radius.sm};
  width: ${({ theme }) => theme.sizing.xxl};
  height: ${({ theme }) => theme.sizing.xxl};
`;

const EmptyData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const VehicleIcon = styled.img``;
