import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { getEventTypeIcon } from '../utilities'
import Tag from './Tag';
import PriceDisplay from './PriceDisplay';
import PropTypes from 'prop-types';
import Typography from './Typography';
import { theme } from '../theme';

const EventCard = ({ event, maxWidth, clickable = true }) => {

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }
  const cardContent = (
    <Event>
      <EventMedia>
        <TagsWrapper>
          <Tag>
            {event.eventType}
          </Tag>
          <Tag>
            {event.terrain}
          </Tag>
        </TagsWrapper>

        {event.image ? (
          <EventImage src={event.image} alt={event.title} className='event_card-image' />
        ) : (
          <EventImagePlaceholder>
            <EventImagePlaceholderIcon src={getEventTypeIcon(event.eventType)} alt="empty state icon" />
          </EventImagePlaceholder>
        )}
      </EventMedia>
      <EventContent>
        <MainInfo>
          <Typography $variant="title-4-bold" style={{ flexGrow: '1', alignSelf: 'flex-start', margin: '0px' }}>{event.title}</Typography>
          <CalendarDate>
            <CalendarMonth>
              <Typography $variant="overline-semibold" color={theme.colors.defaultStrong} style={{ textTransform: 'uppercase' }}>
                {event.monthDate}
              </Typography>
            </CalendarMonth>
            <CalendarDay>
              <Typography $variant="body-1-semibold" color={theme.colors.defaultMain}>{event.dayDate}</Typography>
            </CalendarDay>
          </CalendarDate>
        </MainInfo>
        <SecondaryInfo>
          <SecondaryBlock>
            <ReactSVG src="/icons/calendar.svg" />
            <Typography $variant='body-2-medium' color={theme.colors.defaultStrong}>{event.partialDateStart} {event.partialDateEnd}</Typography>
          </SecondaryBlock>
          <SecondaryBlock>
            <ReactSVG src="/icons/map-location.svg" />
            <Typography $variant='body-2-medium' color={theme.colors.defaultStrong}>{event.shortLocation}</Typography>
          </SecondaryBlock>
          <SecondaryBlock>
            <ReactSVG src="/icons/attendees.svg" />
            <Typography $variant='body-2-medium' color={theme.colors.defaultStrong}>{event.attendeesCount} asistentes</Typography>
          </SecondaryBlock>
        </SecondaryInfo>
        <TertiaryInfo>
          <EventOrganizer>
            <OrganizeAvatar src={event.owner.userAvatar} alt="Event organizer" />
            <OrganizerData>
              <Typography $variant="caption-medium" color={theme.colors.defaultWeak}>Organizado por</Typography>
              <Typography $variant="body-2-semibold" color={theme.colors.defaultMain}>{event.owner.name} {event.owner.lastName}</Typography>
            </OrganizerData>
          </EventOrganizer>
          <PriceDisplay tickets={event.tickets} showOptions={false} />
        </TertiaryInfo>
      </EventContent>
    </Event>
  );

  return clickable ? (
    <Link style={{ maxWidth: maxWidth || '100%' }} to={`/events/${event.id}/${generateSlug(event.title)}`}>
      {cardContent}
    </Link>
  ) : (
    <div style={{ maxWidth: maxWidth || '100%' }}>
      {cardContent}
    </div>

  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    eventType: PropTypes.string.isRequired,
    terrain: PropTypes.string.isRequired,
    image: PropTypes.string,
    monthDate: PropTypes.string.isRequired,
    dayDate: PropTypes.string.isRequired,
    partialDateStart: PropTypes.string.isRequired,
    partialDateEnd: PropTypes.string.isRequired,
    shortLocation: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    attendeesCount: PropTypes.number.isRequired,
    owner: PropTypes.shape({
      userAvatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired,
    tickets: PropTypes.array.isRequired,
  }).isRequired,
  maxWidth: PropTypes.string,
  clickable: PropTypes.bool,
};

export default EventCard;

//Estilos del componente

const EventMedia = styled.div`
  position: relative;
  aspect-ratio: 4/3;

  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, 
      rgba(0, 0, 0, 0.500) 0%, 
      rgba(0, 0, 0, 0.495) 2%, 
      rgba(0, 0, 0, 0.48) 4%, 
      rgba(0, 0, 0, 0.46) 6%, 
      rgba(0, 0, 0, 0.425) 8%, 
      rgba(0, 0, 0, 0.385) 10%, 
      rgba(0, 0, 0, 0.335) 12%, 
      rgba(0, 0, 0, 0.28) 14%, 
      rgba(0, 0, 0, 0.22) 16%, 
      rgba(0, 0, 0, 0.165) 18%, 
      rgba(0, 0, 0, 0.115) 20%, 
      rgba(0, 0, 0, 0.075) 22%, 
      rgba(0, 0, 0, 0.04) 24%, 
      rgba(0, 0, 0, 0.02) 26%, 
      rgba(0, 0, 0, 0.00) 28%, 
      rgba(0, 0, 0, 0.00) 100%, 
      rgba(0, 0, 0, 0.005) 100%);
    background-blend-mode: overlay;
    }
  }
`;

const EventContent = styled.div`
  display: flex;
  flex-grow: 1;
  padding: var(--Spacing-md, 16px);
  flex-direction: column;
  align-self: stretch;
  gap: var(--Spacing-sm, 16px);
  border-radius: ${({ theme }) => theme.sizing.sm};
  background: var(--bg-default-main, #FFF);
  box-shadow: 0px -8px 12px 0px rgba(0, 0, 0, 0.16);    
  margin-top: -24px;
  z-index: 1;
`;

const Event = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  background: var(--bg-default-main, #FFF);
  overflow: hidden;
  color: black;
  text-decoration: none;
  width: 100%;
  transition: all 0.5s ease-out allow-discrete;

  &:hover {
    border: 1px solid ${({ theme }) => theme.border.defaultStrong};
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08), 0px 4px 12px 0px rgba(0, 0, 0, 0.12);
  }
`;

const TagsWrapper = styled.div`
  left: ${({ theme }) => theme.sizing.sm};
  top: ${({ theme }) => theme.sizing.sm};
  position: absolute;
  display:flex;
  flex-direction: center;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 4 / 3;
`;

const EventImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultStrong};
`;

const EventImagePlaceholderIcon = styled.img`
  width: ${({ theme }) => theme.sizing.xxl};
  height: ${({ theme }) => theme.sizing.xxl};
`;

const MainInfo = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px var(--Spacing-none, 0px) 0px 0px;
  align-items: center;
  align-self: stretch;
  gap: 16px;
`;

const SecondaryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
  flex-grow: 1;
`;

const SecondaryBlock = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.sizing.xs};
  align-items: center;
  margin: unset;
  color: ${({ theme }) => theme.colors.defaultStrong};;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
`;

const TertiaryInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

const CalendarDate = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 48px;
  flex-direction: column;
  align-items: stretch;
  border-radius: 8px;
  background: var(--bg-default-subtle, #FAFAFA);
  overflow: hidden;
`;

const CalendarMonth = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  background-color: #EFEFEF;
`;

const CalendarDay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
`;

const EventOrganizer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const OrganizeAvatar = styled.img`
  border-radius: ${({ theme }) => theme.sizing.xs};
  height: ${({ theme }) => theme.sizing.xl};
  width: ${({ theme }) => theme.sizing.xl};
`;

const OrganizerData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

