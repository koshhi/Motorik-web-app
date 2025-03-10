import React from 'react';
import Modal from './Modal'; // Import the Modal component
import Button from '../Button/Button';
import CardToogle from '../Toogle/CardToogle';
import { getEventTypeSvgIcon } from '../../utilities';
import { theme } from '../../theme';
import styled from 'styled-components';
import Typography from '../Typography';
import { useTranslation } from 'react-i18next';

const EventTypeModal = ({ eventType, setEventType, onClose }) => {
  const { t } = useTranslation('createEvent');
  const categories = ['Meetup', 'Competition', 'Race', 'Adventure', 'Trip', 'Gathering', 'Course', 'Ride', 'Exhibition'];

  return (
    <Modal onClose={onClose} title={t('createEventTypeModal.title')}>
      <ModalContent>
        <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
          {/* Selecciona el tipo de evento que mejor describa tu actividad. */}
          {t('createEventTypeModal.description')}
        </Typography>
        <EventTypeList>
          {categories.map((category) => (
            <CardToogle
              key={category}
              category={category}
              isActive={eventType === category}
              onClick={() => setEventType(category)}
              icon={getEventTypeSvgIcon(category, eventType === category ? theme.colors.brandMain : theme.colors.defaultSubtle)}
            />
          ))}
        </EventTypeList>
      </ModalContent>
      <FormActions>
        <Button size="medium" onClick={onClose}>
          {t('createEventTypeModal.save')}
        </Button>
      </FormActions>
    </Modal>
  );
};

export default EventTypeModal;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  width: 100%;
`;


const EventTypeList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: ${({ theme }) => theme.sizing.xs};
  grid-row-gap: ${({ theme }) => theme.sizing.xs};
  width: 100%;
`;

const FormActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  text-align: center;
`;


