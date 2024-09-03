import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { getEventTypeIcon } from '../utils';
import MainNavbar from '../components/Navbar/MainNavbar';
import Button from '../components/Button/Button';
import EventFixedAction from '../components/EventFixedAction'

const EventDetail = () => {
  const { id } = useParams(); // Obtener el ID del evento desde la URL
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${id}`);
        if (response.data.success) {
          setEvent(response.data.event);
        } else {
          setError('Event not found');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching the event.');
      }
    };

    fetchEvent();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <MainNavbar />
      <EventHeader>
        <div className='EventHeaderContainer'>
          <Button variant="ghost">Atrás</Button>
          <div className='EventHeaderMain'>
            <div className='InnerHeaderLeft'>
              <h1>{event.title}</h1>
              <span>Nuevo</span>
              <span>4 plazas disponibles</span>
            </div>
            <div className='InnerHeaderRight'>
              <Button size="small" variant="outline" alt="Compartir evento"><img className="Icon" src="/icons/share.svg" /></Button>
              <Button>Inscríbete<img className="Icon" src="/icons/arrow-right-solid.svg" /></Button>
            </div>
          </div>
          <div className='EventOrganizer'>
            <img className="UserAvatar" src={event.owner.userAvatar} alt="Event organizer" />
            <div className='UserData'>
              <p className='label'>Organizado por</p>
              <p className='username'>{event.owner.name} {event.owner.lastName}</p>
            </div>
          </div>
        </div>

      </EventHeader>
      <EventBody>
        <div className='GridContainer'>
          <EventContent>
            {event.image ? (
              <img src={event.image} alt={event.title} className="event-image" />
            ) : (
              <div className="placeholder-image">
                <img src={getEventTypeIcon(event.eventType)} alt="empty state icon" className="empty-state-icon" />
              </div>
            )}
            <EventDescription>
              <h2>Detalles</h2>
              <p>{event.description}</p>
            </EventDescription>
            <div className='OrganizerBlock'>
              <h2>Sobre el organizador</h2>
              <EventOrganizerCard>
                <div className='EventOrganizerHeader'>
                  <div className='EventOrganizer'>
                    <img className="OrganizerAvatar" src={event.owner.userAvatar} alt="Event organizer" />
                    <div className='OrganizerData'>
                      <p className='username'>{event.owner.name} {event.owner.lastName}</p>
                      <p className='followers'>22 Seguidores</p>
                    </div>
                  </div>
                  <div className='OrganizerActions'>
                    <Button size="small" variant="ghost">Contactar</Button>
                    <Button size="small" variant="outline">Seguir</Button>
                  </div>
                </div>
                <p className='OrganizerDescription'>
                  {event.owner.description}
                </p>
              </EventOrganizerCard>
            </div>
          </EventContent>
          <EventSummary>
            <DateAndLocation>
              <div className='DateRow'>
                <div className="DateContainer">
                  <div className="MonthDate">
                    <p>{event.monthDate}</p>
                  </div>
                  <div className="DayDate">
                    <p>{event.dayDate}</p>
                  </div>
                </div>
                <p className='LongDate'>{event.longDate}</p>
              </div>
              <div className='LocationRow'>
                <div className='LocationContainer'>
                  <img src="/icons/map-location.svg" alt="map-location-icon" />
                </div>
                <div className='LocationAddress'>
                  <p className='Location'>{event.location}</p>
                  <p className='ShortLocation'>{event.shortLocation}</p>
                </div>
              </div>
            </DateAndLocation>
            <p>Tipo: {event.eventType}</p>
            <p>Terreno: {event.terrain}</p>
            <p>Capacity: {event.capacity}</p>
            <p>Experience: {event.experience}</p>
            <p>
              From {event.startDate} to {event.endDate}
            </p>
            <p>Attendees: {event.attendeesCount}</p>
            <ul>
              {event.attendees.map((attendee, index) => (
                <li key={index}>{attendee}</li>
              ))}
            </ul>
          </EventSummary>
        </div>
      </EventBody>
      <EventFixedAction
        eventName={event.title}
        eventDate={event.longDate}
        availableSeats="4"
        price={event.ticket.price}
      />
    </>
  );
};

export default EventDetail;


const EventHeader = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultSubtle};

  .EventHeaderContainer {
    width: 100%;
    max-width: 1248px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
    padding-bottom: ${({ theme }) => theme.sizing.md};
    gap: ${({ theme }) => theme.sizing.xs};

    .EventHeaderMain {
      display: flex;
      align-items: center;
      gap: var(--Spacing-md, 24px);
      align-self: stretch;

      .InnerHeaderLeft {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: ${({ theme }) => theme.sizing.sm};

        h1 {
          margin: 0px;
        }
      }

      .InnerHeaderRight {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: ${({ theme }) => theme.sizing.xs};
      }
    }

    .EventOrganizer {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: ${({ theme }) => theme.sizing.xs};

      .UserAvatar {
        border-radius: ${({ theme }) => theme.sizing.xs};
        height: 40px;
        width: 40px;
      }

      .UserData{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: ${({ theme }) => theme.sizing.xxs};;

        .label {
          color: ${({ theme }) => theme.colors.defaultWeak};
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;
          margin: 0px;
          // font-family: "Mona Sans";
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
          line-height: 100%%;
        }
          
        .username {
          color: ${({ theme }) => theme.colors.defaultMain};
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;
          margin: 0px;
          // font-family: "Mona Sans";
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 100%;
        }
      }
    }
  }
`;

const EventBody = styled.section`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.sizing.lg};
  padding-bottom: 24rem;

  .GridContainer {
    width: 100%;
    max-width: 1248px;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: ${({ theme }) => theme.sizing.lg};
    grid-row-gap: 0px;
    padding: 0px ${({ theme }) => theme.sizing.md};

  }
`;

const EventContent = styled.div`
  grid-area: 1 / 1 / 2 / 8;
  width: 100%;
  aspect-ratio: 4/3;
  height: auto;

  .event-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radius.sm};
  }

  .placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.fill.defaultStrong};
    border-radius: ${({ theme }) => theme.radius.sm};
  }

  .OrganizerBlock {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    
    h2 {
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
  }
`;

const EventDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding-top: 16px;
  padding-bottom: 40px;
  align-self: stretch;
`;

const EventOrganizerCard = styled.div`
  padding: ${({ theme }) => theme.sizing.md};
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.sizing.md};

  .EventOrganizerHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .EventOrganizer {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: ${({ theme }) => theme.sizing.sm};

      .OrganizerAvatar {
        border-radius: ${({ theme }) => theme.sizing.xs};
        height: 56px;
        width: 56px;
      }

      .OrganizerData{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: ${({ theme }) => theme.sizing.xxs};;

        .followers {
          color: ${({ theme }) => theme.colors.defaultWeak};
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;
          margin: 0px;
          // font-family: "Mona Sans";
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
          line-height: 100%%;
        }
          
        .username {
          color: ${({ theme }) => theme.colors.defaultMain};
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;
          margin: 0px;
          // font-family: "Mona Sans";
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 100%;
        }
      }
    }
    
    .OrganizerActions {
      display: flex;
      flex-direction: row;
      flex-direction: row;
      align-items: flex-start;
      gap: ${({ theme }) => theme.sizing.xs};;
    }
  }

  .OrganizerDescription {
    margin: 0px;
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Regular */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 24px */
  }
`;

const EventSummary = styled.div`
  grid-area: 1 / 8 / 2 / 13;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
`;

const DateAndLocation = styled.div`
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background-color: ${({ theme }) => theme.fill.defaultMain};

  .DateRow {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    gap: ${({ theme }) => theme.sizing.sm};
    padding: ${({ theme }) => theme.sizing.sm};

    .DateContainer {
      display: flex;
      flex-shrink: 0;
      width: 48px;
      flex-direction: column;
      align-items: stretch;
      border-radius: ${({ theme }) => theme.radius.xs};
      background: ${({ theme }) => theme.fill.defaultSubtle};

      overflow: hidden;

      .MonthDate {
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

      .DayDate {
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

    .LongDate {
      color: ${({ theme }) => theme.colors.defaultStrong};
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on, 'ss04' on;

      /* Titles/Desktop/Title 5/Semibold */
      font-family: "Mona Sans";
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 25.2px */
      margin: 0px;
    }
  }

  .LocationRow {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    gap: ${({ theme }) => theme.sizing.sm};
    padding: ${({ theme }) => theme.sizing.sm};

    .LocationContainer {
      display: flex;
      flex-shrink: 0;
      width: 48px;
      height: 52px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: ${({ theme }) => theme.fill.defaultSubtle};
      border-radius: ${({ theme }) => theme.radius.xs};

      img {
        height: 24px;
      }
    }

    .LocationAddress {

      .ShortLocation {
        color: var(--text-icon-default-weak, #656565);
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;

        /* Body/Body 2/Medium */
        font-family: "Mona Sans";
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 140%; /* 19.6px */
        margin: 0px;
      }

      .Location {
        color: ${({ theme }) => theme.colors.defaultStrong};
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on, 'ss04' on;

        /* Titles/Desktop/Title 5/Semibold */
        font-family: "Mona Sans";
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 25.2px */
        margin: 0px;
      }
    }
  }
`;