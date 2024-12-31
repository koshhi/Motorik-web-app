// components/Modal/EnrollWithVehicleModal.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useVehicles } from '../../context/VehicleContext';
import InfoModal from './InfoModal';
import SelectVehicleModal from './SelectVehicleModal';
import AddVehicleModal from './AddVehicleModal';
import ConfirmSelectedVehicleModal from './ConfirmSelectedVehicleModal';

const EnrollWithVehicleModal = ({ isOpen, onClose, onEnroll, eventId, selectedTicketId }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const { vehicles, fetchVehicles, loading } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      console.log('Fetching vehicles from context for user:', user.id);
      fetchVehicles(user.id);
    } else {
      // Resetear el estado al cerrar el modal
      setStep(1);
      setSelectedVehicleId(null);
    }
  }, [isOpen, fetchVehicles, user]);

  const handleVehicleSelect = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
  };

  const handleAddVehicle = async () => {
    setStep(3);
  };

  const handleConfirm = () => {
    if (selectedVehicleId && selectedTicketId) {
      const vehicle = vehicles.find(v => v._id === selectedVehicleId);
      if (vehicle) {
        onEnroll(vehicle, selectedTicketId);
        onClose();
      } else {
        toast.error('Vehículo seleccionado no encontrado.');
      }
    } else {
      toast.error('Datos de inscripción incompletos.');
    }
  };

  const selectedVehicle = vehicles.find(v => v._id === selectedVehicleId) || null;

  const handleContinue = () => {
    if (selectedVehicleId) {
      setStep(4);
    } else {
      toast.error('Por favor, selecciona un vehículo o añade uno nuevo.');
    }
  };

  return (
    <>
      {isOpen && step === 1 && (
        <InfoModal
          isOpen={true}
          onContinue={() => setStep(2)}
          onClose={onClose}
        />
      )}

      {isOpen && step === 2 && (
        <SelectVehicleModal
          isOpen={isOpen}
          onClose={onClose}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={handleVehicleSelect}
          onAddVehicle={handleAddVehicle}
          onContinue={handleContinue}
        />
      )}

      {isOpen && step === 3 && (
        <AddVehicleModal
          isOpen={isOpen}
          onClose={() => setStep(2)}
          onVehicleSaved={(newVehicle) => {
            setSelectedVehicleId(newVehicle._id);
            setStep(4);
          }}
        />
      )}

      {isOpen && step === 4 && selectedVehicle && (
        <ConfirmSelectedVehicleModal
          isOpen={isOpen}
          onClose={onClose}
          vehicle={selectedVehicle}
          onContinue={handleConfirm}
          onChooseAnother={() => setStep(2)}
        />
      )}
    </>
  );
};

EnrollWithVehicleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEnroll: PropTypes.func.isRequired,
  eventId: PropTypes.string.isRequired,
  selectedTicketId: PropTypes.string,
};

export default EnrollWithVehicleModal;


// const VehicleList = styled.ul`
//       list-style: none;
//       padding: 0;
//       margin: 0 0 20px 0;
//       max-height: 300px;
//       overflow-y: auto;
//       gap: 10px;
//       display: flex;
//       flex-direction: column;
//       `;

// const InfoContainer = styled.div`
//   // padding: ${({ theme }) => theme.sizing.sm};
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       gap: ${({ theme }) => theme.sizing.sm};
//       `;

// const InfoImageContainer = styled.div`
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       min-width: 60px;
//       height: 60px;
//   // padding: ${({ theme }) => theme.sizing.sm};
//       border-radius: ${({ theme }) => theme.radius.xl};
//       background-color: ${({ theme }) => theme.fill.brandAlphaMain16};
//       margin-bottom: ${({ theme }) => theme.sizing.xs};
//       `;

// const ActionsContainer = styled.div`
//       display: flex;
//       justify-content: flex-start;
//       gap: ${({ theme }) => theme.sizing.sm};
//       padding: ${({ theme }) => theme.sizing.sm};
//       border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
//       width: 100%;
//       `;

// const InfoBlock = styled.div`
//       display: flex;
//       flex-direction: column;
//       gap: ${({ theme }) => theme.sizing.xs};
//       padding: ${({ theme }) => theme.sizing.sm};
//       align-items: center;
//       `;  
