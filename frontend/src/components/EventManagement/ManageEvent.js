import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EventCard from '../EventCard'
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import EventMap from '../EventMap';

const ManageEvent = () => {
  const { eventDetails } = useOutletContext();
  const navigate = useNavigate();
  const {
    id,
    title,
    description,
    location,
    locationCoordinates,
    image,
    shortLocation,
    startDate,
    endDate,
    eventType,
    terrain,
    experience,
    tickets,
    capacity,
    approvalRequired,
  } = eventDetails;
  const handleEditEvent = () => {
    navigate(`/events/manage/${eventDetails.id}/edit`);
  };

  // Verificar si las coordenadas existen y son válidas
  const hasValidCoordinates =
    locationCoordinates &&
    Array.isArray(locationCoordinates.coordinates) &&
    locationCoordinates.coordinates.length === 2 &&
    typeof locationCoordinates.coordinates[0] === 'number' &&
    typeof locationCoordinates.coordinates[1] === 'number';

  // Extraer lat y lng correctamente
  const [lng, lat] = hasValidCoordinates ? locationCoordinates.coordinates : [undefined, undefined];


  const clientUrl = process.env.CLIENT_URL;

  return (
    <ManageEventContainer>
      <Container>
        <EventSummaryContainer>
          <EventCardWrapper>
            <EventCard maxWidth="320px" event={eventDetails} clickable={false} />
            <div>
              <p>{`${clientUrl}/events/${id}/${title}`}</p>
            </div>
            <Button $variant="outline" as={Link} to={`/events/${id}/${title}`}>Ver página del evento<img src="/icons/arrow-right-up.svg" alt="new window icon" /></Button>
          </EventCardWrapper>
          <EventDetailsWrapper>
            <EventDetailRow>
              <DateContainer>
                <div className="MonthDate">
                  <p>{eventDetails.monthDate}</p>
                </div>
                <div className="DayDate">
                  <p>{eventDetails.dayDate}</p>
                </div>
              </DateContainer>
              <DataWrapper>
                <p className='Title'>{eventDetails.partialDateStart}</p>
                <p className='Subtitle'>{eventDetails.partialDateEnd}</p>
              </DataWrapper>
            </EventDetailRow>
            <EventDetailRow>
              <RowContainer>
                <img src="/icons/map-location.svg" alt="map-location-icon" />
              </RowContainer>
              <DataWrapper>
                <p className='Title'>{eventDetails.location}</p>
                <p className='Subtitle' style={{ marginBottom: '16px' }}>{eventDetails.shortLocation}</p>
                <EventMap lat={lat} lng={lng} maxHeight="200px" mobileHeight="120px" borderRadius='16px' />
              </DataWrapper>
            </EventDetailRow>
            <EventDetailRow>
              <RowContainer>
                <img src="/icons/ticket-solid.svg" alt="ticket-icon" />
              </RowContainer>
              <DataWrapper>
                <p className='Title'>{eventDetails.tickets[0].price}</p>
                <p className='Title'>{eventDetails.tickets[0].type}</p>
                {approvalRequired && <p className='Subtitle'>Aprobación requerida</p>}
              </DataWrapper>
            </EventDetailRow>
            <EventDetailRow>
              <RowContainer>
                <img src="/icons/attendees.svg" alt="ticket-icon" />
              </RowContainer>
              <DataWrapper>
                <p className='Title'>{eventDetails.capacity} personas</p>
              </DataWrapper>
            </EventDetailRow>
            <EventDetailRow>
              <Button $variant="outline" onClick={handleEditEvent}>Editar Evento</Button>
              <Button $variant="outline">Editar Tickets</Button>
            </EventDetailRow>
          </EventDetailsWrapper>
        </EventSummaryContainer>
      </Container>
    </ManageEventContainer>
  );
};

export default ManageEvent;

const ManageEventContainer = styled.div`
  // padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  max-width: 1400px;
  width: 100%;
`;

const EventSummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 32px;
  grid-row-gap: 0px;
`;


const EventCardWrapper = styled.div`
  display: flex;
  padding: var(--Spacing-lg, 32px);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-radius: 16px;
  border: 1px solid var(--border-default-subtle, #EFEFEF);
  background: var(--bg-default-subtle, #FAFAFA);
`;

const EventDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid var(--border-default-subtle, #EFEFEF);
  background: var(--bg-default-main, #FFF);
`;

const DateContainer = styled.div`
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
`;

const RowContainer = styled.div`
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
`;

const DataWrapper = styled.div`
  width: 100%;
`;

const EventDetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
  width: 100%;

  // .LocationContainer,
  // .CapacityContainer,
  // .TicketsContainer {
  //   display: flex;
  //   flex-shrink: 0;
  //   width: 48px;
  //   height: 52px;
  //   flex-direction: column;
  //   align-items: center;
  //   justify-content: center;
  //   background: ${({ theme }) => theme.fill.defaultSubtle};
  //   border-radius: ${({ theme }) => theme.radius.xs};

  //   img {
  //     height: 24px;
  //   }
  // }

  .Title {
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

  .Subtitle {
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
`;  
