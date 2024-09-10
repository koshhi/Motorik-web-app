import React from 'react';
import Button from '../Button/Button';
import CardToogle from '../Toogle/CardToogle';
import { getEventTypeSvgIcon } from '../../utils';
import { theme } from '../../theme';
import styled from 'styled-components';

const EventTypeModal = ({ eventType, setEventType, onClose }) => {

  const categories = ['Meetup', 'Competition', 'Race', 'Adventure', 'Trip', 'Gathering', 'Course', 'Ride', 'Exhibition'];

  return (
    <ModalOverlay>
      <ModalContent>
        <div className='Heading'>
          <h4>Escoge el tipo de evento</h4>
          <p>Selecciona el tipo de evento que mejor describa tu actividad.</p>
        </div>
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
        <Button size="medium" onClick={onClose}>Guadar tipo de evento</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: rgba(26, 26, 26, 0.90);
  backdrop-filter: blur(12px);
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  padding: var(--Spacing-md, 24px);
  flex-direction: column;
  align-items: flex-start;
  gap: var(--Spacing-lg, 32px);
  border-radius: ${({ theme }) => theme.radius.sm};
  max-width: 488px;

  .Heading {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h4 {
      color: ${({ theme }) => theme.colors.defaultMain};
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;
      /* Titles/Mobile/Title 5/Semibold */
      font-family: "Mona Sans";
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 150%;
    }

    p {
      color: ${({ theme }) => theme.colors.defaultWeak};
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;

      /* Body/Body 1/Medium */
      font-family: "Mona Sans";
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 150%; /* 24px */
    }
  }
`;


const EventTypeList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  width: 100%;
`;

export default EventTypeModal;
