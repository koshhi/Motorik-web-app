import React from 'react';
import styled from 'styled-components';
import Typography from '../../components/Typography';
import { useEventContext } from '../../context/EventContext';

const MyEventsAttendees = () => {
  const { myEvents } = useEventContext();
  // Supongamos que los asistentes se extraen de los eventos organizados
  const organizedEvents = myEvents.organized;

  // Extraer todos los asistentes de los eventos organizados (filtrando duplicados)
  const attendees = organizedEvents.upcoming
    .concat(organizedEvents.past)
    .reduce((acc, event) => {
      if (event.attendees) {
        event.attendees.forEach(att => {
          if (!acc.some(a => a._id === att.userId._id)) {
            acc.push(att.userId);
          }
        });
      }
      return acc;
    }, []);

  return (
    <MyEventsPeopleSection>
      <Container>
        <SectionTitle>
          <Typography as="h1" $variant="title-3-semibold">Mi Gente</Typography>
        </SectionTitle>
        {attendees.length > 0 ? (
          <AttendeesList>
            {attendees.map(att => (
              <AttendeeCard key={att._id}>
                <img src={att.userAvatar || '/default-avatar.png'} alt={`${att.name} ${att.lastName}`} />
                <Typography as="p">{att.name} {att.lastName}</Typography>
              </AttendeeCard>
            ))}
          </AttendeesList>
        ) : (
          <p>No se encontraron asistentes.</p>
        )}
      </Container>
    </MyEventsPeopleSection>
  );
};

export default MyEventsAttendees;
const MyEventsPeopleSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultMain};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  width: 100%;
  max-width: 1400px;
  gap: ${({ theme }) => theme.sizing.md};
`;

const SectionTitle = styled.div`
  margin-bottom: 16px;
`;

const AttendeesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const AttendeeCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  p {
    margin-top: 8px;
    text-align: center;
  }
`;
