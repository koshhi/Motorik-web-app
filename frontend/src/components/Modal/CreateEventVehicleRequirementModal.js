// frontend/src/components/Modal/CreateEventVehicleRequirementModal.js
import React from 'react';
import Modal from './Modal';
import styled from 'styled-components';
import Button from '../Button/Button';
import Typography from '../Typography';
import CardToogle from '../Toogle/CardToogle';
import { useTranslation } from 'react-i18next';

const VehicleRequirementModal = ({
  needsVehicle,
  setNeedsVehicle,
  organizerVehicle,
  onOpenSelectVehicle,
  onClose
}) => {
  const { t } = useTranslation('createEvent');
  const options = [
    { label: t('vehicleModal.optionRequired'), value: true },
    { label: t('vehicleModal.optionNotRequired'), value: false }
  ];

  return (
    <Modal onClose={onClose} title={t('vehicleModal.title')}>
      <ModalContent>
        <Typography as="p" $variant="body-1-medium">
          {t('vehicleModal.description')}
        </Typography>
        <OptionsContainer>
          {options.map((option) => (
            <CardToogle
              key={option.value}
              category={option.label}
              isActive={needsVehicle === option.value}
              onClick={() => setNeedsVehicle(option.value)}
            />
          ))}
        </OptionsContainer>
        {needsVehicle && (
          <SelectVehicleSection>
            <Typography as="p" $variant="body-2-medium">
              {organizerVehicle
                ? t('vehicleModal.selectedVehicle', { vehicle: organizerVehicle.nickname || organizerVehicle.model })
                : t('vehicleModal.noVehicleSelected')}
            </Typography>
            <Button size="medium" onClick={onOpenSelectVehicle}>
              {organizerVehicle ? t('vehicleModal.changeVehicle') : t('vehicleModal.selectVehicle')}
            </Button>
          </SelectVehicleSection>
        )}
      </ModalContent>
      <FormActions>
        <Button size="medium" onClick={onClose}>
          {t('vehicleModal.save')}
        </Button>
      </FormActions>
    </Modal>
  );
};

export default VehicleRequirementModal;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  padding: ${({ theme }) => theme.sizing.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.md};
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.sizing.md};
`;

const SelectVehicleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const FormActions = styled.div`
  padding: ${({ theme }) => theme.sizing.sm};
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  text-align: center;
`;
