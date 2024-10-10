import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { getEventTypeIcon } from '../utils'
import Button from './Button/Button';

const EventCardRow = ({ event }) => {
  const { user } = useAuth();

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }

  // Verifica si el usuario es el owner del evento
  const isOwner = user && event.owner.id === user.id;

  return (
    <Link to={`/events/${event.id}/${generateSlug(event.title)}`}>
      <Event>
        <Left>
          <div className='eventTags'>
            <div className='eventCategory'>
              <p>{event.eventType}</p>
            </div>
            <div className='eventCategory'>
              <p>{event.terrain}</p>
            </div>
          </div>

          {event.image ? (
            <img src={event.image} alt={event.title} className='event_card-image' />
          ) : (
            <div className='placeholderImage'>
              <img src={getEventTypeIcon(event.eventType)} alt="empty state icon" className='placeholderImage-icon' />
            </div>
          )}
        </Left>
        <Right>
          <div className='mainInfo'>
            <h3>{event.title}</h3>
            <div className="mainInfoDate">
              <div className="mainInfoDateMonth">
                <p>{event.monthDate}</p>
              </div>
              <div className="mainInfoDateDay">
                <p>{event.dayDate}</p>
              </div>
            </div>
          </div>
          <div className='secondaryInfo'>
            <div><ReactSVG src="/icons/calendar.svg" />{event.longDate}</div>
            <div><ReactSVG src="/icons/map-location.svg" />{event.shortLocation}</div>
            <div><ReactSVG src="/icons/attendees.svg" />{event.attendeesCount} asistentes</div>
          </div>
          <div className='tertiaryInfo'>
            {isOwner ? (
              <Button size="small" $variant="outline">Gestionar Evento<img src="/icons/arrow-right.svg" alt="arrow" /></Button>
            ) : (
              <Button size="small" $variant="outline">Ver evento<img src="/icons/arrow-right.svg" alt="arrow" /></Button>
            )}
          </div>
        </Right>
      </Event>
    </Link>
  );
};

export default EventCardRow;

//Estilos del componente

const Event = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  overflow: hidden;
  color: black;
  text-decoration: none;
  width: 100%;
  transition: all 0.5s ease-out allow-discrete;

  &:hover {
    border: 1px solid ${({ theme }) => theme.border.defaultStrong};
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08), 0px 4px 12px 0px rgba(0, 0, 0, 0.12);
  }

  
  }
`;

const Left = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  max-width: 330px;
  width: 100%;
  display: flex;

  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, 
      rgba(0, 0, 0, 0.500) 0%, 
      rgba(0, 0, 0, 0.495) 2%, 
      rgba(0, 0, 0, 0.48) 4%, 
      rgba(0, 0, 0, 0.46) 6%, 
      rgba(0, 0, 0, 0.425) 8%, 
      rgba(0, 0, 0, 0.385) 10%, 
      rgba(0, 0, 0, 0.335) 12%, 
      rgba(0, 0, 0, 0.28) 14%, 
      rgba(0, 0, 0, 0.22) 16%, 
      rgba(0, 0, 0, 0.165) 18%, 
      rgba(0, 0, 0, 0.115) 20%, 
      rgba(0, 0, 0, 0.075) 22%, 
      rgba(0, 0, 0, 0.04) 24%, 
      rgba(0, 0, 0, 0.02) 26%, 
      rgba(0, 0, 0, 0.00) 28%, 
      rgba(0, 0, 0, 0.00) 100%, 
      rgba(0, 0, 0, 0.005) 100%);
    background-blend-mode: overlay;
    }

    .event_card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      aspect-ratio: 4 / 3;
    }

    .placeholderImage {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${({ theme }) => theme.fill.defaultStrong};
    }

    .placeholderImage-icon {
      width: 50px; /* Ajusta el tamaño del ícono */
      height: 50px;
    }

    .eventTags {
      left: ${({ theme }) => theme.sizing.sm};
      top: ${({ theme }) => theme.sizing.sm};
      position: absolute;
      display:flex;
      flex-direction: center;
      align-items: center;
      gap: ${({ theme }) => theme.sizing.xs};
    }

    .eventCategory {
      padding: 8px;
      border-radius: ${({ theme }) => theme.sizing.sm};
      background-color: ${({ theme }) => theme.fill.defaultMain};
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);

      p {
        color: var(--text-icon-default-main, #292929);
        font-size: 10px;
        font-style: normal;
        font-weight: 600;
        line-height: 100%;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        margin: 0px;
      }
    }
  }
`;

const Right = styled.div`
  display: flex;
  flex-grow: 1;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-self: stretch;
  gap: ${({ theme }) => theme.sizing.sm};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  z-index: 1;

  .mainInfo {
    display: flex;
    flex-direction: row;
    padding: 0px var(--Spacing-none, 0px) 0px 0px;
    align-items: center;
    align-self: stretch;
    gap: 16px;

    h3 {
      flex-grow: 1;
      align-self: flex-start;
      margin: 0px;
    }

    .mainInfoDate {
      display: flex;
      flex-shrink: 0;
      width: 48px;
      flex-direction: column;
      align-items: stretch;
      border-radius: 8px;
      background: var(--bg-default-subtle, #FAFAFA);
      overflow: hidden;
    }

    .mainInfoDateMonth {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 24px;
      background-color: #EFEFEF;

      p {
        color: var(--text-icon-default-main, #292929);
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        font-family: "Mona Sans";
        font-size: 10px;
        font-style: normal;
        font-weight: 600;
        line-height: 100%;
        margin: 0px;
        text-transform: uppercase;
      } 
    }

    .mainInfoDateDay {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 28px;

      p {
        color: var(--text-icon-default-main, #292929);
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        font-family: "Mona Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 100%;
        margin: 0px;
      }
    }
  }

  .secondaryInfo {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.sizing.xs};

    div {
      display: flex;
      flex-direction: row;
      gap: ${({ theme }) => theme.sizing.xs};
      align-items: center;
      margin: unset;
      color: ${({ theme }) => theme.colors.defaultStrong};;
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: 100%;
    }
  }

  .tertiaryInfo {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    flex-grow: 1;
    justify-content: flex-end;
  }
`;





