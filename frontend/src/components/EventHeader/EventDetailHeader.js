// components/EventHeader/EventDetailHeader.js

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button/Button';
import Typography from '../Typography';
import OrganizerInfo from './OrganizerInfo';

const EventHeader = ({
  title,
  availableSeats,
  eventType,
  terrain,
  isOwner,
  manageLink,
  isEnrolled,
  enrollmentStatus,
  handleCancelEnrollment,
  handleEnroll,
  userEnrollment,
  eventId,
  organizer
}) => {
  return (
    <HeaderContainer>
      <Container>
        <div>
          <Button onClick={() => window.history.back()} $variant="ghost" style={{ paddingLeft: '2px' }}>
            <img src="/icons/chevron-left.svg" alt="back-icon" /> Atrás
          </Button>
        </div>
        <HeaderMain>
          <HeaderLeft>
            <Typography $variant="title-1-bold" as="h1">{title}</Typography>
            <TagsWrapper>
              {isEnrolled && <Tag>Inscrito</Tag>}
              <Tag>{availableSeats} plazas</Tag>
              <Tag>{eventType}</Tag>
              <Tag>{terrain}</Tag>
            </TagsWrapper>
          </HeaderLeft>
          <HeaderRight>
            {/* <Button $variant="outline" aria-label="Compartir evento" style={{ padding: '10px' }}>
              <img src="/icons/share.svg" alt="share-icon" />
            </Button>
            {isOwner ? (
              <Link to={manageLink}>
                <Button $variant="outline" aria-label="Gestionar evento">
                  Gestionar evento
                </Button>
              </Link>
            ) : isEnrolled ? (
              <EnrollmentStatus
                enrollmentStatus={enrollmentStatus}
                handleCancelEnrollment={handleCancelEnrollment}
                eventId={eventId}
              />
            ) : (
              <Button
                onClick={handleEnroll}
                size="small"
                aria-label="Inscríbete en el evento"
                disabled={false} // Puedes manejar el estado de deshabilitado según sea necesario
              >
                Inscríbete
              </Button>
            )} */}
            <Button $variant="outline" aria-label="Compartir evento" style={{ padding: '10px' }}>
              <img src="/icons/share.svg" alt="share-icon" />
            </Button>
            {isOwner ? (
              // Si el usuario es el propietario, mostrar "Gestionar evento"
              <Link to={manageLink}>
                <Button $variant="outline" aria-label="Gestionar evento">
                  Gestionar evento
                </Button>
              </Link>
            ) : isEnrolled ? (
              // Si el usuario está inscrito, mostrar "Ver mi inscripción"
              <Link to={`/events/${eventId}/enrollment-details`}>
                <Button size="small" aria-label="Ver detalles de inscripción">
                  Ver mi inscripción
                </Button>
              </Link>
            ) : (
              // Si el usuario no está inscrito, mostrar "Inscríbete"
              <Button
                onClick={handleEnroll}
                size="small"
                $variant="primary"
                aria-label="Inscríbete en el evento"
                disabled={false}
              >
                Inscríbete
              </Button>
            )}
          </HeaderRight>
        </HeaderMain>
        <OrganizerInfo organizer={organizer} />
      </Container>
    </HeaderContainer >
  );
};

export default EventHeader;

// Styled Components
const HeaderContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  border-bottom: 1px solid ${({ theme }) => theme.border.defaultSubtle};
`;

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const HeaderMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const TagsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.sizing.xs};
  align-items: center;
`;

const Tag = styled.span`
  padding: ${({ theme }) => theme.sizing.xxs} ${({ theme }) => theme.sizing.xs};
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  border-radius: 24px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xs};
`;

// Component for Enrollment Status
const EnrollmentStatus = ({ enrollmentStatus, handleCancelEnrollment, eventId }) => {
  return (
    <StatusContainer>
      <StatusInfo>
        <p>Estado de tu inscripción: {enrollmentStatus}</p>
        {enrollmentStatus === 'confirmation pending' && (
          <p>Tu inscripción está pendiente de aprobación.</p>
        )}
        {enrollmentStatus === 'attending' && <p>¡Tu inscripción ha sido aprobada!</p>}
        {enrollmentStatus === 'not attending' && (
          <p>Tu inscripción ha sido rechazada o cancelada.</p>
        )}
      </StatusInfo>
      {enrollmentStatus !== 'not attending' && (
        <Button onClick={handleCancelEnrollment}>Cancelar Inscripción</Button>
      )}
      <Link to={`/events/${eventId}/enrollment-details`}>
        <Button size="small" $variant="primary" aria-label="Ver detalles de inscripción">
          Ver mi inscripción
        </Button>
      </Link>
    </StatusContainer>
  );
};

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const StatusInfo = styled.div`
  p {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.defaultStrong};
  }
`;
