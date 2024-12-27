// components/EventHeader/EventDetailHeader.js

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button/Button';
import Typography from '../Typography';
import OrganizerInfo from './OrganizerInfo';
import Tag from '../Tag';

const EventHeader = ({
  title,
  availableSeats,
  eventType,
  terrain,
  isOwner,
  manageLink,
  isEnrolled,
  handleEnroll,
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
              {isEnrolled && <Tag $variant="brand">Inscrito</Tag>}
              <Tag $variant="transparent">{availableSeats} plazas</Tag>
              <Tag $variant="transparent">{eventType}</Tag>
              <Tag $variant="transparent">{terrain}</Tag>
            </TagsWrapper>
          </HeaderLeft>
          <HeaderRight>
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
                <Button size="small" $variant="outline" aria-label="Ver detalles de inscripción">
                  Ver mi inscripción
                  <img src="/icons/arrow-right.svg" alt="arrow-icon" />
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
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const TagsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.sizing.xs};
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xs};
`;