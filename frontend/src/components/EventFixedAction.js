import React from 'react';
import styled from 'styled-components';
import Button from './Button/Button';
import PropTypes from 'prop-types';
import Typography from './Typography';
import PriceDisplay from './PriceDisplay';
import { theme } from '../theme';

const EventFixedAction = ({ eventName, eventDate, availableSeats, tickets }) => {

  return (
    <EventFixedBar>
      <div className='Container'>
        <EventHeading>
          <Typography $variant="title-1-bold" as='h2'>{eventName}</Typography>
          <Typography $variant="body-1-semibold" as='p' color={theme.colors.defaultWeak}>{eventDate}</Typography>
        </EventHeading>
        <EventSeats>
          <PriceDisplay tickets={tickets} /> {/* Usar el componente PriceDisplay */}
          <Typography $variant="body-1-semibold" as='p' color={theme.colors.defaultStrong}>
            {availableSeats} plaza{availableSeats !== 1 ? 's' : ''} disponible{availableSeats !== 1 ? 's' : ''}
          </Typography>
        </EventSeats>
        <EventActions>
          <Button>Compartir</Button>
          <Button>Seguir</Button>
          <Button>Inscríbete</Button>
        </EventActions>
      </div>
    </EventFixedBar>
  );
};

EventFixedAction.propTypes = {
  eventName: PropTypes.string.isRequired,
  eventDate: PropTypes.string.isRequired,
  availableSeats: PropTypes.number.isRequired,
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired, // 'free' o 'paid'
      price: PropTypes.number, // Solo relevante si es de pago
      availableSeats: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default EventFixedAction;

//Estilos del componente

const EventFixedBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: fixed;
  bottom: 0px;
  background-color: ${({ theme }) => theme.fill.defaultMain};
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  box-shadow: 0px -2px 8px 0px rgba(26, 26, 26, 0.08);
  z-index: 100;


  .Container {
    width: 100%;
    max-width: 1400px;
    display: flex;
    padding: 24px 24px;
    align-items: center;
    gap: 40px;
  }
`;

const EventHeading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1 0 0;
`;

const EventSeats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  .AvailableSeats {
    color: var(--text-icon-default-strong, #464646);
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Semibold */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */
  }

  .Seats {
    color: var(--text-icon-default-main, #292929);
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Titles/Desktop/Title 4/Semibold */
    font-family: "Mona Sans";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 28px */
  }
`;

const EventActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;


