// components/Modal/EnrollWithVehicleModal.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InfoModal from './InfoModal';
import SelectVehicleModal from './SelectVehicleModal';
import AddVehicleModal from './AddVehicleModal';
import ConfirmSelectedVehicleModal from './ConfirmSelectedVehicleModal';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';


const EnrollWithVehicleModal = ({ isOpen, onClose, onEnroll, eventId }) => {
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      // Cargar vehículos del usuario al abrir el modal
      const fetchVehicles = async () => {
        setIsLoading(true);
        try {
          const response = await axiosClient.get(`/api/vehicles/user/${user.id}`);
          if (response.data.success) {
            setVehicles(response.data.vehicles);
          } else {
            toast.error(response.data.message || 'Error al cargar los vehículos.');
          }
        } catch (error) {
          console.error('Error fetching vehicles:', error);
          toast.error('Error al cargar los vehículos.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchVehicles();
    } else {
      // Resetear el estado al cerrar el modal
      setStep(1);
      setSelectedVehicle(null);
    }
  }, [isOpen, user.id]);

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    handleNext();
  };

  const handleAddVehicle = async (newVehicle) => {
    setVehicles((prev) => [...prev, newVehicle]);
    setSelectedVehicle(newVehicle);
    handleNext();
  };

  const handleConfirm = () => {
    onEnroll(selectedVehicle);
    onClose();
  };

  return (
    <>
      {isOpen && step === 1 && (
        <InfoModal
          title="Inscripción con Vehículo"
          description="Este evento requiere que inscribas un vehículo. Puedes seleccionar uno existente o añadir uno nuevo."
          onNext={handleNext}
          onClose={onClose}
        />
      )}

      {isOpen && step === 2 && (
        <SelectVehicleModal
          isOpen={isOpen}
          onClose={onClose}
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={handleVehicleSelect}
          onAddVehicle={() => setStep(3)}
        />
      )}

      {isOpen && step === 3 && (
        <AddVehicleModal
          isOpen={isOpen}
          onClose={() => setStep(2)}
          onVehicleAdded={handleAddVehicle}
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
  onEnroll: PropTypes.func.isRequired, // Función para manejar la inscripción con el vehículo seleccionado
  eventId: PropTypes.string.isRequired,
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
