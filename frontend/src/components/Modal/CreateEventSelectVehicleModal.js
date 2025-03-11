// frontend/src/components/Modal/CreateEventSelectVehicleModal.js
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import styled from 'styled-components';
import Button from '../Button/Button';
import Typography from '../Typography';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../api/axiosClient';

const SelectVehicleModal = ({ onSelectVehicle, selectedVehicle, onClose }) => {
  const { t } = useTranslation('createEvent');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        // Se asume que existe un endpoint para obtener los vehículos del usuario actual
        const response = await axiosClient.get('/api/vehicles/user/me');
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <Modal onClose={onClose} title={t('selectVehicleModal.title')}>
      <ModalContent>
        {loading ? (
          <Typography as="p" $variant="body-2-medium">
            {t('selectVehicleModal.loading')}
          </Typography>
        ) : vehicles.length > 0 ? (
          <VehicleList>
            {vehicles.map((vehicle) => (
              <VehicleItem key={vehicle.id} onClick={() => onSelectVehicle(vehicle)}>
                <Typography as="p" $variant="body-2-medium">
                  {vehicle.nickname || `${vehicle.brand} ${vehicle.model}`}
                </Typography>
                {selectedVehicle && selectedVehicle.id === vehicle.id && (
                  <SelectedMark>✓</SelectedMark>
                )}
              </VehicleItem>
            ))}
          </VehicleList>
        ) : (
          <Typography as="p" $variant="body-2-medium">
            {t('selectVehicleModal.noVehicles')}
          </Typography>
        )}
      </ModalContent>
      <FormActions>
        <Button size="medium" onClick={onClose}>
          {t('selectVehicleModal.close')}
        </Button>
      </FormActions>
    </Modal>
  );
};

export default SelectVehicleModal;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const VehicleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const VehicleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
`;

const SelectedMark = styled.span`
  color: ${({ theme }) => theme.colors.brandMain};
  font-size: 20px;
`;

const FormActions = styled.div`
  padding: ${({ theme }) => theme.sizing.sm};
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  text-align: center;
`;
