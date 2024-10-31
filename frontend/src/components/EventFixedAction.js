import React from 'react';
import styled from 'styled-components';
import Button from './Button/Button';

const EventFixedAction = ({ eventName, eventDate, availableSeats, price }) => {

  return (
    <EventFixedBar>
      <div className='Container'>
        <EventHeading>
          <h2>{eventName}</h2>
          <p>{eventDate}</p>
        </EventHeading>
        <EventSeats>
          <p className='AvailableSeats'>{availableSeats} plazas disponibles</p>
          <p className='Seats'>Desde {price} €</p>
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

  h3 {
    color: ${({ theme }) => theme.colors.defaultMain};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Titles/Mobile/Title 1/Bold */
    font-family: "Mona Sans";
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 39.2px */
  }

  p {
    color: ${({ theme }) => theme.colors.defaultWeak};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Semibold */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */
  } 
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


