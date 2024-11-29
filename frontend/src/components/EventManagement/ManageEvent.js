import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import EventCard from '../EventCard'
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import EventMap from '../EventMap';
import Banner from '../Banner';
import Typography from '../../components/Typography';
import { theme } from '../../theme';
import { useEventContext } from '../../context/EventContext';


const ManageEvent = () => {
  const { eventDetails, setEventDetails } = useEventContext();
  const navigate = useNavigate();
  const {
    id,
    title,
    location,
    locationCoordinates,
    image,
    shortLocation,
    eventType,
    tickets,
    attendees,
    attendeesCount,
    monthDate,
    dayDate,
    partialDateStart,
    partialDateEnd,
    published,
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

  const handlePublish = async () => {
    try {
      const response = await axiosClient.post(`/api/events/${id}/publish`);
      if (response.data.success) {
        toast.success(response.data.message);
        // Actualizar el estado localmente
        setEventDetails(response.data.event);
      }
    } catch (error) {
      console.error('Error al publicar el evento:', error);
      toast.error('Error al publicar el evento.');
    }
  };

  // Manejar el caso donde tickets o attendees puedan ser undefined
  const ticketsArray = Array.isArray(tickets) ? tickets : [];
  const attendeesArray = Array.isArray(attendees) ? attendees : [];

  // Calcular el número de inscritos por ticket
  const attendeesPerTicket = {};

  // Inicializar el conteo por ticket
  ticketsArray.forEach(ticket => {
    attendeesPerTicket[ticket._id] = {
      name: ticket.name,
      count: 0,
    };
  });

  // Contar asistentes por ticket
  attendeesArray.forEach(attendee => {
    const ticketId = attendee.ticketId.toString();
    if (attendeesPerTicket[ticketId]) {
      attendeesPerTicket[ticketId].count += 1;
    }
  });

  return (
    <ManageEventContainer>
      {!published && (
        <BannerWrapper>
          <Banner>
            <BannerPublishContent>
              <div className='BannerData'>
                <Typography $variant="body-1-semibold" as="h3">
                  Su evento no está listado
                </Typography>
                <Typography $variant="body-2-medium" color={theme.colors.defaultWeak} as="p">
                  Sólo las personas con la URL de la página del evento pueden encontrar el evento.
                </Typography>
              </div>
              <Button onClick={handlePublish}>Publicar Evento</Button>
            </BannerPublishContent>
          </Banner>
        </BannerWrapper>
      )}
      <Container>
        <EventSummaryContainer>
          <EventCardWrapper>
            <EventCard maxWidth="320px" event={eventDetails} clickable={false} />
            <Button $variant="outline" as={Link} to={`/events/${id}/${title}`}>
              Ver página del evento
              <img src="/icons/arrow-right-up.svg" alt="new window icon" />
            </Button>
          </EventCardWrapper>
          <EventDetailsWrapper>
            <EventDetailRow>
              <DateContainer>
                <div className="MonthDate">
                  <p>{monthDate}</p>
                </div>
                <div className="DayDate">
                  <p>{dayDate}</p>
                </div>
              </DateContainer>
              <DataWrapper>
                <Typography $variant="title-5-semibold" color={theme.colors.defaultStrong} as="p">
                  {partialDateStart}
                </Typography>
                <Typography $variant="body-2-medium" color={theme.colors.defaultWeak} as="p" style={{ marginBottom: theme.sizing.sm }}>
                  {partialDateEnd}
                </Typography>
              </DataWrapper>
            </EventDetailRow>
            <EventDetailRow>
              <RowContainer>
                <img src="/icons/map-location.svg" alt="map-location-icon" />
              </RowContainer>
              <DataWrapper>
                <Typography $variant="title-5-semibold" color={theme.colors.defaultStrong} as="p">
                  {location}
                </Typography>
                <Typography $variant="body-2-medium" color={theme.colors.defaultWeak} as="p" style={{ marginBottom: theme.sizing.sm }}>
                  {shortLocation}
                </Typography>
                <EventMap lat={lat} lng={lng} maxHeight="200px" mobileHeight="120px" borderRadius="16px" />
              </DataWrapper>
            </EventDetailRow>
            <EventDetailRow>
              <RowContainer>
                <img src="/icons/ticket-solid.svg" alt="ticket-icon" />
              </RowContainer>
              <DataWrapper>
                <TicketsList>
                  <Typography $variant="title-5-semibold" color={theme.colors.defaultStrong} as="p">
                    {ticketsArray.length} tickets a la venta
                  </Typography>
                  {ticketsArray.map(ticket => (
                    <TicketsItem key={ticket._id}>
                      <Typography $variant="body-2-medium" color={theme.colors.defaultStrong} as="p">
                        {ticket.name}
                      </Typography>
                      <Typography $variant="body-3-medium" color={theme.colors.defaultWeak} as="p">
                        {ticket.type === 'paid' ? `${ticket.price}€` : 'Gratis'}
                      </Typography>
                      <Typography $variant="body-3-medium" color={theme.colors.defaultWeak} as="p">
                        {ticket.availableSeats} de {ticket.capacity} disponibles
                      </Typography>
                    </TicketsItem>
                  ))}
                </TicketsList>
              </DataWrapper>
            </EventDetailRow>
            <EventDetailRow>
              <RowContainer>
                <img src="/icons/attendees.svg" alt="attendees-icon" />
              </RowContainer>
              <DataWrapper>
                <Typography $variant="title-5-semibold" color={theme.colors.defaultStrong} as="p">
                  {attendeesCount || 0} inscritos.
                </Typography>
                <div className='AttendeesList'>
                  {Object.values(attendeesPerTicket).map(ticketInfo => (
                    <AttendeesPerTicket key={ticketInfo.name} >
                      <Typography $variant="body-2-medium" color={theme.colors.defaultStrong} as="p">
                        {ticketInfo.name}
                      </Typography>
                      <Typography $variant="body-3-medium" color={theme.colors.defaultWeak} as="p">
                        Inscritos: {ticketInfo.count}
                      </Typography>
                    </AttendeesPerTicket>
                  ))}
                </div>
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

const AttendeesPerTicket = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

const TicketsList = styled.div`

`;

const TicketsItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

const ManageEventContainer = styled.div`
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
  grid-column-gap: ${({ theme }) => theme.sizing.lg};
  grid-row-gap: 0px;
`;


const EventCardWrapper = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.lg};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background: ${({ theme }) => theme.fill.defaultSubtle};
`;

const EventDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid var(--border-default-subtle, #EFEFEF);
  background: var(--bg-default-main, #FFF);
`;

const DateContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  width: ${({ theme }) => theme.sizing.xxl};
  flex-direction: column;
  align-items: stretch;
  border-radius: ${({ theme }) => theme.radius.xs};
  background: ${({ theme }) => theme.fill.defaultSubtle};
  overflow: hidden;

  .MonthDate {
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${({ theme }) => theme.sizing.md};
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
      font-size: ${({ theme }) => theme.sizing.sm};
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
  width: ${({ theme }) => theme.sizing.xxl};
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
  display: flex;
  flex-direction: column;
  padding-top: ${({ theme }) => theme.sizing.xxxs};;

  .InnerDataWrapper {
    display: flex;
    flex-direction: row;
    gap: ${({ theme }) => theme.sizing.xs};
    align-items: center;
  }
`;

const EventDetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
  width: 100%;
`;


const BannerWrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  padding: ${({ theme }) => theme.sizing.md} ${({ theme }) => theme.sizing.md};
  align-items: center;
`;

const BannerPublishContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.sizing.sm};
  width: 100%;

  .BannerData {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.sizing.xxs};
`;