// src/components/Modal/AddVehicleToGarageModal.js

import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import AddVehicleForm from '../Forms/AddVehicleForm';
import { useVehicles } from '../../context/VehicleContext';

const AddVehicleToGarageModal = ({ isOpen, onClose, onVehicleAdded, vehicle }) => {
  const { addVehicle, updateVehicle } = useVehicles();

  if (!isOpen) return null;

  const handleSubmit = async (vehicleData) => {
    if (vehicle) {
      // Actualizar vehículo existente
      const updatedVehicle = await updateVehicle(vehicle._id, vehicleData);
      if (updatedVehicle) {
        onVehicleAdded(updatedVehicle, vehicle._id);
      }
    } else {
      // Añadir nuevo vehículo
      const createdVehicle = await addVehicle(vehicleData);
      if (createdVehicle) {
        onVehicleAdded(createdVehicle);
      }
    }
    onClose();
  };

  return (
    <Modal
      title={vehicle ? 'Editar Vehículo' : 'Añadir un Vehículo a tu Garaje'}
      onClose={onClose}
      isOpen={isOpen}
      maxWidth="480px"
    >
      <AddVehicleForm
        onSubmit={handleSubmit}
        vehicle={vehicle}
        onClose={onClose}
      />
    </Modal>
  );
};

AddVehicleToGarageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onVehicleAdded: PropTypes.func.isRequired,
  vehicle: PropTypes.object,
};

export default AddVehicleToGarageModal;
