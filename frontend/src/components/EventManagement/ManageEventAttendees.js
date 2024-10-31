import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ManageEventAttendees = () => {
  const { eventDetails } = useOutletContext();
  const { capacity, attendees } = eventDetails;

  console.log({ eventoRecibido: eventDetails })

  let percentage = 0;

  if (capacity) {
    // Evento con capacidad limitada
    percentage = (attendees.length / capacity) * 100;
  } else {
    // Evento sin capacidad limitada
    percentage = 100; // La barra estará siempre llena
  }

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
              {/* <div className='AttendeesConfirmed'></div>
              <div className='AttendeesPending'></div>
              <div className='AttendeesInvited'></div> */}
            </div>
          </AttendeesMetrics>
        </AttendeesSummaryWrapper>
        <AttendeesListwrapper>
          <Heading>Lista de asistentes</Heading>
          <AttendeesListHeader>
            <div className='NameHeader'>Nombre</div>
            <div className='EmailHeader'>Email</div>
            <div className='VehicleHeader'>Vehiculo</div>
            <div className='StatusHeader'>Estado</div>
          </AttendeesListHeader>
          <AttendeesList>
            {attendees && attendees.length > 0 ? (
              attendees.map((attendee, index) => (
                <AttendeeItem key={attendee.userId._id || index}>
                  <div className='Name'>
                    <img src={attendee.userId.userAvatar} alt={`${attendee.userId.name} avatar`} /><p>{attendee.userId.name} {attendee.userId.lastName}</p>
                  </div>
                  <div className='Email'>
                    <p>{attendee.userId.email}</p>
                  </div>
                  <div className='Vehicle'>
                    <p>{attendee.vehicleId.brand} {attendee.vehicleId.model}</p>
                  </div>
                  <div className='Status'>
                    <p>status</p>
                  </div>
                </AttendeeItem>
              ))
            ) : (
              <p>No hay asistentes registrados.</p>
            )}
          </AttendeesList>
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

const AttendeesList = styled.ul`
`;

const AttendeesListHeader = styled.div`
display: grid;
grid-template-columns: repeat(4, 1fr);
grid-template-rows: 1fr;
grid-column-gap: 8px;
border-left: 1px solid ${({ theme }) => theme.border.defaultWeak};
border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
border-right: 1px solid ${({ theme }) => theme.border.defaultWeak};
border-radius: ${({ theme }) => theme.radius.xs} ${({ theme }) => theme.radius.xs} 0px 0px;



  .EmailHeader,
  .VehicleHeader,
  .StatusHeader,
  .NameHeader {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-direction: row;
    padding: 8px 16px;
  }
`;

const AttendeeItem = styled.li`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 8px;
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  // border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  // border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};

  .Email,
  .Vehicle,
  .Status,
  .Name {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-direction: row;
    padding: 16px;
    // border-right: 1px solid ${({ theme }) => theme.border.defaultWeak};
  }

  .Name {
    img {
      width: 40px;
      height: 40px;
      border-radius: ${({ theme }) => theme.radius.xs};
    }
  }
`;