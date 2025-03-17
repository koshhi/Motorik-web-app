// components/EventContent/EventDetailContent.js

import React from 'react';
import styled from 'styled-components';
import Typography from '../Typography';
import OrganizerBlock from './OrganizerBlock';
import PropTypes from 'prop-types';

const EventDetailContent = ({ image, description, organizer }) => {

  return (
    <EventContentContainer>
      {/* {image ? (
        <EventImage src={image} alt="Imagen del evento" />
      ) : (
        <PlaceholderImage>
          <img src="/icons/default-event-icon.svg" alt="Icono por defecto" />
        </PlaceholderImage>
      )} */}

      <EventImage src={image} alt="Imagen del evento" />
      <EventDescription>
        <Typography $variant="title-4-semibold" as='p'>Detalles</Typography>
        <Typography $variant="body-1-regular">{description}</Typography>
      </EventDescription>
      <OrganizerBlock organizer={organizer} />
    </EventContentContainer>
  );
};

EventDetailContent.propTypes = {
  image: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  organizer: PropTypes.object.isRequired,
};

export default EventDetailContent;

// Styled Components
const EventContentContainer = styled.div`
  grid-area: 1 / 1 / 2 / 8;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xl};
`;

const EventImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.sm};
  aspect-ratio: 4/3;
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 300px; /* Ajusta según tus necesidades */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  border-radius: ${({ theme }) => theme.radius.sm};

  img {
    width: 100px;
    height: 100px;
  }
`;

const EventDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
  // padding: 0px 16px;
`;

