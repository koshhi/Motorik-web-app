// ManageEventAttendees.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useEventContext } from '../../context/EventContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from '../Button/Button';
import Tag from '../Tag';
import Typography from '../Typography';
import { theme } from '../../theme';



const ManageEventAttendees = () => {
  const { eventDetails, setEventDetails } = useEventContext();
  const { capacity, attendees } = eventDetails || { capacity: 0, attendees: [] };


  // console.log({ eventoRecibido: eventDetails })

  let percentage = 0;

  if (capacity) {
    // Evento con capacidad limitada
    percentage = (attendees.length / capacity) * 100;
  } else {
    // Evento sin capacidad limitada
    percentage = 100; // La barra estará siempre llena
  }

  // Función para aprobar una inscripción
  const handleApprove = async (attendeeId) => {
    try {
      const response = await axiosClient.post(`/api/events/${eventDetails.id}/attendees/${attendeeId}/approve`);
      if (response.data.success) {
        toast.success(response.data.message);
        // Actualizar el estado localmente
        const updatedAttendees = attendees.map((attendee) =>
          attendee._id === attendeeId ? { ...attendee, status: 'attending' } : attendee
        );
        setEventDetails({ ...eventDetails, attendees: updatedAttendees });
      }
    } catch (error) {
      console.error('Error al aprobar la inscripción:', error);
      toast.error('Error al aprobar la inscripción.');
    }
  };

  // Función para rechazar una inscripción
  const handleReject = async (attendeeId) => {
    try {
      const response = await axiosClient.post(`/api/events/${eventDetails.id}/attendees/${attendeeId}/reject`);
      if (response.data.success) {
        toast.success(response.data.message);
        // Actualizar el estado localmente
        const updatedAttendees = attendees.map((attendee) =>
          attendee._id === attendeeId ? { ...attendee, status: 'not attending' } : attendee
        );
        setEventDetails({ ...eventDetails, attendees: updatedAttendees });
      }
    } catch (error) {
      console.error('Error al rechazar la inscripción:', error);
      toast.error('Error al rechazar la inscripción.');
    }
  };

  return (
    <AttendeesSection>
      <Container>
        <AttendeesSummaryWrapper>
          <Heading>Resumen</Heading>
          <AttendeesMetrics>
            <div className='MetricsHeader'>
              <p className='EnrollMetric'>{attendees.length} <span>asistentes</span></p>
              <p className='AvailableSeats'><span>max </span>{capacity}</p>
            </div>
            <div className='AttendeesGraph'>
              {capacity ? (
                <>
                  <BarBackground>
                    <BarFill style={{ width: `${percentage}%` }} />
                  </BarBackground>
                  <p>{Math.round(percentage)}% ocupado</p>
                </>
              ) : (
                <>
                  <BarBackground>
                    {attendees.length > 0 ? (
                      attendees.map((attendee, index) => (
                        <BarSegment
                          key={attendee.userId._id || index}
                          style={{ width: `${100 / attendees.length}%` }}
                        />
                      ))
                    ) : (
                      <EmptyBar />
                    )}
                  </BarBackground>
                  <p>{attendees.length} asistentes</p>
                </>
              )}
            </div>
          </AttendeesMetrics>
        </AttendeesSummaryWrapper>
        <AttendeesListwrapper>
          <Heading>Lista de asistentes</Heading>
          {attendees && attendees.length > 0 ? (
            <AttendeesTable>
              <AttendeesListHeader>
                <div className='NameHeader'>Nombre</div>
                <div className='VehicleHeader'>Vehículo</div>
                <div className='TicketHeader'>Entrada</div>
                <div className='StatusHeader'>Estado</div>
                <div className='ActionsHeader'></div>
              </AttendeesListHeader>
              <AttendeesList>
                {attendees.map((attendee, index) => (
                  <AttendeeItem key={attendee._id || index}>
                    <div className='Name'>
                      <img src={attendee.userId.userAvatar} alt={`${attendee.userId.name} avatar`} />
                      <div className='AttendeeInfo'>
                        <Typography as="p" $variant="body-2-medium">
                          {attendee.userId.name} {attendee.userId.lastName}
                        </Typography>
                        <Typography as="p" $variant="body-2-regular">
                          {attendee.userId.email}
                        </Typography>
                      </div>
                    </div>
                    <div className='Vehicle'>
                      <Typography as="p" $variant="body-2-regular">
                        {attendee.vehicleId.brand} {attendee.vehicleId.model}
                      </Typography>
                    </div>
                    <div className='Ticket'>
                      <div>
                        <Typography as="p" $variant="body-2-regular">
                          {attendee.ticketId.type === 'free' ? 'Gratis' : `De pago - ${attendee.ticketId.price}€`}
                        </Typography>
                        <Typography as="p" $variant="body-3-regular">
                          {attendee.ticketId.approvalRequired && 'Requiere aprobación'}
                        </Typography>
                      </div>
                    </div>
                    <div className='Status'>
                      <Tag>{attendee.status}</Tag>
                    </div>
                    <div className='Actions'>
                      {attendee.status === 'confirmation pending' && (
                        <>
                          <Button size="small" $variant="outline" onClick={() => handleApprove(attendee._id)}>Aprobar</Button>
                          <Button size="small" $variant="defaultDanger" onClick={() => handleReject(attendee._id)}>Rechazar</Button>
                        </>
                      )}
                    </div>
                  </AttendeeItem>
                ))}
              </AttendeesList>
            </AttendeesTable>
          ) : (
            <AttendeesTableEmpty>
              <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>No hay inscritos.</Typography>
            </AttendeesTableEmpty>
          )}
        </AttendeesListwrapper>

      </Container>
    </AttendeesSection>
  );
};

export default ManageEventAttendees;

// Contenedor de la barra
const BarContainer = styled.div`
  width: 100%;
  // max-width: 600px;
  margin: 20px 0;
`;

const BarSegment = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.fill.brandMain};
  display: inline-block;
`;

const EmptyBar = styled.div`
  width: 100%;
  height: 100%;
`;
// Fondo de la barra
const BarBackground = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.fill.defaultWeak};
  height: 8px;
  border-radius: 8px;
  overflow: hidden;
`;

// Relleno de la barra (porcentaje de ocupación)
const BarFill = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.fill.brandMain};
  transition: width 0.3s ease-in-out;
`;

const AttendeesSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  max-width: 1400px;
  width: 100%;
`;

const Heading = styled.h2`
  color: var(--text-icon-default-main, #292929);
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;

  /* Titles/Desktop/Title 3/Semibold */
  font-family: "Mona Sans";
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
`;

const AttendeesSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--Spacing-sm, 16px);
  justify-content: flex-start;
  width: 100%;
  padding-bottom: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};
`;

const AttendeesMetrics = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;

  .MetricsHeader {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--Spacing-md, 24px);

    .EnrollMetric,
    .AvailableSeats {
      color: var(--text-icon-default-main, #292929);
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;
      font-family: "Mona Sans";
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%;
      display: inline-flex;
      align-items: center;
      gap: 8px;

      span {
        color: var(--text-icon-default-main, #292929);
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        font-family: "Mona Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%; 
      }
    }
  }

  .AttendeesGraph {
    width: 100%;

    .AttendeesConfirmed {}
    .AttendeesPending {}
    .AttendeesInvited {}
  }
`;

const AttendeesListwrapper = styled.div`
  padding: 40px 0px;
  width: 100%;
`;

const AttendeesTable = styled.div``;

const AttendeesTableEmpty = styled.div`
  padding: 8px 0px;
`;


const AttendeesList = styled.ul`
`;

const AttendeesListHeader = styled.div`
display: grid;
grid-template-columns: repeat(13, 1fr);
grid-template-rows: 1fr;
// grid-column-gap: 8px;
border-left: 1px solid ${({ theme }) => theme.border.defaultWeak};
border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
border-right: 1px solid ${({ theme }) => theme.border.defaultWeak};
border-radius: ${({ theme }) => theme.radius.xs} ${({ theme }) => theme.radius.xs} 0px 0px;

  .VehicleHeader,
  .StatusHeader,
  .NameHeader,
  .ActionsHeader,
  .TicketHeader {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-direction: row;
    padding: 8px 16px;
  }

  .VehicleHeader,
  .StatusHeader,
  .TicketHeader {
    grid-column: span 2;
  }

  .ActionstHeader {
    grid-column: span 3;
  }

  .NameHeader {
    grid-column: span 4;
  }
`;

const AttendeeItem = styled.li`
  display: grid;
  grid-template-columns: repeat(13, 1fr);
  width: 100%;
  // grid-template-rows: 1fr;
  // grid-column-gap: 8px;
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  // border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  // border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};

  .Vehicle,
  .Status,
  .Name,
  .Ticket {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-direction: row;
    padding: 16px;
    // border-right: 1px solid ${({ theme }) => theme.border.defaultWeak};
  }

  
  .Vehicle,
  .Status,
  .Ticket {
    grid-column: span 2;
  }
  
  .Actions {
    grid-column: span 3;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    padding-right: 16px;
  }

  .Name {
    grid-column: span 4;

    img {
      width: 40px;
      height: 40px;
      border-radius: ${({ theme }) => theme.radius.xs};
    }
  }
`;