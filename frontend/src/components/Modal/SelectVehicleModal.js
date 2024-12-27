// components/Modal/SelectVehicleModal.js

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Modal from './Modal';
import Button from '../Button/Button';
import Typography from '../Typography';
import VehicleItem from './VehicleItem';
import { useVehicles } from '../../context/VehicleContext';
import Select from '../Select/Select';


// const SelectVehicleModal = ({
//   isOpen,
//   onClose,
//   vehicles,
//   selectedVehicle,
//   onSelectVehicle,
//   onAddVehicle,
// }) => {
//   return (
//     <Modal title="Selecciona tu vehículo" onClose={onClose} isOpen={isOpen} maxWidth="500px">
//       <Typography $variant="title-5-semibold" $align="center">
//         Selecciona tu vehículo
//       </Typography>
//       <VehicleList>
//         {vehicles.map((vehicle) => (
//           <VehicleItem
//             key={vehicle._id}
//             vehicle={vehicle}
//             selected={selectedVehicle?._id === vehicle._id}
//             onSelect={() => onSelectVehicle(vehicle._id)}
//           />
//         ))}
//       </VehicleList>
//       <ActionsContainer>
//         <Button onClick={onAddVehicle} $fullWidth $contentAlign="center">
//           <img src="/icons/add.svg" alt="Añadir" style={{ marginRight: '8px' }} /> Añadir Vehículo
//         </Button>
//         <Button $variant="outline" onClick={onClose} $fullWidth $contentAlign="center">Cancelar</Button>
//       </ActionsContainer>
//     </Modal>
//   );
// };

// SelectVehicleModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   vehicles: PropTypes.array.isRequired,
//   selectedVehicle: PropTypes.object,
//   onSelectVehicle: PropTypes.func.isRequired,
//   onAddVehicle: PropTypes.func.isRequired,
// };

// export default SelectVehicleModal;

const SelectVehicleModal = ({ isOpen, onClose, selectedVehicleId, onSelectVehicle, onAddVehicle }) => {
  const { vehicles, loading } = useVehicles();

  if (!isOpen) return null;

  return (
    <Modal title="Selecciona tu Vehículo" onClose={onClose} isOpen={isOpen} maxWidth="600px">
      <Typography $variant="body-1-regular">
        Por favor, selecciona un vehículo existente o añade uno nuevo para inscribirte en el evento.
      </Typography>
      <Select
        value={selectedVehicleId || ''}
        onChange={(e) => onSelectVehicle(e.target.value)}
        disabled={loading}
      >
        <option value="">Selecciona un vehículo</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle._id} value={vehicle._id}>
            {vehicle.brand} {vehicle.model} {vehicle.nickname ? `(${vehicle.nickname})` : ''}
          </option>
        ))}
      </Select>
      <Button onClick={onAddVehicle} $variant="primary" style={{ marginTop: '16px' }}>
        Añadir Vehículo
      </Button>
      <Button onClick={onClose} $variant="outline" style={{ marginTop: '8px' }}>
        Cancelar
      </Button>
    </Modal>
  );
};

SelectVehicleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedVehicleId: PropTypes.string,
  onSelectVehicle: PropTypes.func.isRequired,
  onAddVehicle: PropTypes.func.isRequired,
};

export default SelectVehicleModal;

// Estilos
const VehicleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
  max-height: 300px;
  overflow-y: auto;
  gap: 10px;
  display: flex;
  flex-direction: column;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  width: 100%;
`;
