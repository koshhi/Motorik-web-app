import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { getEmptyStateIcon } from '../utils'

const EventCard = ({ event }) => {

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }

  return (
    <Link to={`/events/${event._id}/${generateSlug(event.title)}`}>
      <Event>
        <div className='eventTopContent'>
          <div className='eventCategory'>
            <p>{event.eventType}</p>
          </div>
          {event.image ? (
            <img src={event.image} alt={event.title} className='event_card-image' />
          ) : (
            <div className='placeholderImage'>
              <img src={getEmptyStateIcon(event.eventType)} alt="empty state icon" className='placeholderImage-icon' />
            </div>
          )}
        </div>
        <div className='eventBottomContent'>
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
        </div>
      </Event>
    </Link>
  );
};

export default EventCard;

//Estilos del componente

const Event = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  background: var(--bg-default-main, #FFF);
  overflow: hidden;
  color: black;
  text-decoration: none;
  width: 100%;
  transition: all 0.5s ease-out allow-discrete;

  &:hover {
    border: 1px solid ${({ theme }) => theme.border.defaultStrong};
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08), 0px 4px 12px 0px rgba(0, 0, 0, 0.12);
  }

  .eventTopContent {
    position: relative;
    aspect-ratio: 4/3;

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

    .eventCategory {
      left: ${({ theme }) => theme.sizing.sm};
      top: ${({ theme }) => theme.sizing.sm};
      position: absolute;
      padding: 8px;
      border-radius: ${({ theme }) => theme.sizing.sm};
      background: var(--bg-default-main, #FFF);
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

  .eventBottomContent {
    display: flex;
    flex-grow: 1;
    padding: var(--Spacing-md, 16px);
    flex-direction: column;
    align-self: stretch;
    gap: var(--Spacing-sm, 16px);
    border-radius: 24px 24px 0px 0px;
    background: var(--bg-default-main, #FFF);
    box-shadow: 0px -8px 12px 0px rgba(0, 0, 0, 0.16);    margin-top: -24px;
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
  }
`;


