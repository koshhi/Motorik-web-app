// frontend/src/pages/EventDetail.js

import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axiosClient from '../api/axiosClient';
import useEvent from '../hooks/useEvent';
import { useAuth } from '../context/AuthContext';
import MainNavbar from '../components/Navbar/MainNavbar';
import EventHeader from '../components/EventHeader/EventDetailHeader';
import EventDetailContent from '../components/EventContent/EventDetailContent';
import EventSummary from '../components/EventSummary/EventSummary';
import EventFixedAction from '../components/EventFixedAction';
import EventEnrollFlow from '../components/EventEnrollFlow';
import EnrollmentStatus from '../components/EventSummary/EnrollmentStatus';


const EventDetail = () => {
  const { id } = useParams();
  const { user, loading: loadingAuth } = useAuth();
  const { event, isOwner, loadingEvent, error, setEvent } = useEvent(id, user);
  const navigate = useNavigate();
  const location = useLocation();

  const [showEnrollFlow, setShowEnrollFlow] = useState(false);

  // Función para inscribir al usuario; se espera que el endpoint devuelva el evento actualizado
  const enrollUser = async (ticket, vehicle) => {
    try {
      const response = await axiosClient.post(`/api/events/enroll/${event.id}`, {
        ticketId: ticket._id,
        vehicleId: vehicle ? vehicle._id : null,
      });
      if (response.data.success) {
        // Actualizamos el evento en el estado global (y por lo tanto en el contexto)
        setEvent(response.data.event);
        return response.data.event;
      } else {
        throw new Error(response.data.message || 'Error en la inscripción.');
      }
    } catch (err) {
      console.error('Error en enrollUser:', err);
      throw err;
    }
  };

  // Determinar si el usuario ya está inscrito
  const isEnrolled =
    user &&
    event &&
    event.attendees &&
    event.attendees.some((att) =>
      (att.userId._id || att.userId.id).toString() === user.id.toString()
    );

  if (loadingAuth || loadingEvent) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar el evento: {error}</p>;
  if (!event) return <p>Evento no encontrado</p>;

  // Extraer coordenadas (si es necesario)
  const hasValidCoordinates =
    event.locationCoordinates &&
    Array.isArray(event.locationCoordinates.coordinates) &&
    event.locationCoordinates.coordinates.length === 2 &&
    typeof event.locationCoordinates.coordinates[0] === 'number' &&
    typeof event.locationCoordinates.coordinates[1] === 'number';
  const [lng, lat] = hasValidCoordinates ? event.locationCoordinates.coordinates : [undefined, undefined];

  const handleEnrollClick = () => {
    if (!user) {
      // Si no hay usuario autenticado, redirigimos a signin.
      // Se pasa la URL actual (o la de detalle del evento) como "returnTo"
      const returnTo = location.pathname; // o `/events/${event.id}/${event.slug}`
      navigate('/signin', { state: { returnTo } });
    } else {
      // Si está autenticado, se muestra el flujo de inscripción
      setShowEnrollFlow(true);
    }
  };


  // Construir la URL del evento
  const eventLink = `${process.env.REACT_APP_CLIENT_URL}/events/${event.id}/${event.slug}`;

  // const eventLink = `${process.env.REACT_APP_CLIENT_URL}/events/${event.id}/${event.slug}`;

  return (
    <>
      <MainNavbar />
      <EventHeader
        title={event.title}
        availableSeats={event.availableSeats}
        eventType={event.eventType}
        terrain={event.terrain}
        manageLink={`/events/manage/${event.id}`}
        isEnrolled={isEnrolled}
        handleEnroll={handleEnrollClick}
        eventId={event.id}
        organizer={event.owner}
        isOwner={isOwner}
        copyUrl={eventLink}
      />
      <EventBody>
        <GridContainer>
          <EventDetailContent
            image={event.image}
            description={event.description}
            organizer={event.owner}
            tickets={event.tickets}
          />
          <EventSummaryContainer>
            {isEnrolled && (
              <EnrollmentStatus
                enrollmentStatus={
                  event.attendees.find(
                    (att) => (att.userId._id || att.userId.id).toString() === user.id.toString()
                  )?.status
                }
                handleCancelEnrollment={() => {
                  /* Aquí se podría implementar la función para cancelar inscripción */
                }}
              />
            )}
            <EventSummary
              date={{
                monthDate: event.monthDate,
                dayDate: event.dayDate,
                partialDateStart: event.partialDateStart,
                partialDateEnd: event.partialDateEnd,
              }}
              location={event.location}
              shortLocation={event.shortLocation}
              mapCoordinates={{
                lat:
                  event.locationCoordinates && event.locationCoordinates.coordinates
                    ? event.locationCoordinates.coordinates[1]
                    : undefined,
                lng:
                  event.locationCoordinates && event.locationCoordinates.coordinates
                    ? event.locationCoordinates.coordinates[0]
                    : undefined,
              }}
              attendees={event.attendees}
              attendeesCount={event.attendeesCount}
              organizer={event.owner}
            />
          </EventSummaryContainer>
        </GridContainer>
      </EventBody>
      <EventFixedAction
        eventName={event.title}
        eventDate={event.longDate}
        availableSeats={event.availableSeats}
        tickets={event.tickets}
        isEnrolled={isEnrolled}
        isOwner={isOwner}
        handleEnroll={handleEnrollClick}
      />
      {showEnrollFlow && (
        <EventEnrollFlow
          event={event}
          enrollUser={enrollUser}
          onEnrollComplete={(updatedEvent) => setShowEnrollFlow(false)}
          onCancel={() => setShowEnrollFlow(false)}
        />
      )}
    </>
  );
};

export default EventDetail;

// Styled Components
const EventBody = styled.section`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.sizing.lg};
  padding-bottom: 24rem;
`;

const GridContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: ${({ theme }) => theme.sizing.lg};
  padding: 0 ${({ theme }) => theme.sizing.md};
`;

const EventSummaryContainer = styled.div`
  grid-area: 1 / 8 / 2 / 13;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
