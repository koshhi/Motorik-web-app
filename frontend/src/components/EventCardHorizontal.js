import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { getEventTypeIcon } from '../utilities'
import Button from './Button/Button';
import PriceDisplay from './PriceDisplay';
import Typography from './Typography';
import { theme } from '../theme';
import Tag from './Tag';

const EventCardHorizontal = ({ event }) => {
  const navigate = useNavigate();

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  }

  const handleManageEventClick = (e) => {
    e.preventDefault();
    navigate(`/events/manage/${event.id}`);
  };

  return (
    <>
      <EventRow>
        <DateColumn>
          <Typography $variant="title-5-semibold" color={theme.colors.defaultMain} as="p">
            {event.dayDate} {event.monthDate}
          </Typography>
          <Typography $variant="body-2-medium" color={theme.colors.defaultWeak} as="p">
            {event.weekdayStart}
          </Typography>
        </DateColumn>
        <EventColumn>
          <Timeline>
            <div className='Circle'></div>
            <div className='Line'></div>
          </Timeline>

          <EventCardWrapper>
            <Link to={`/events/${event.id}/${generateSlug(event.title)}`}>
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
                    <EventImage src={event.image} alt={event.title} />
                  ) : (
                    <EventImagePlaceholder>
                      <EventImagePlaceholderIcon src={getEventTypeIcon(event.eventType)} alt="empty state icon" className='placeholderImage-icon' />
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
                      <Typography $variant='body-2-medium' color={theme.colors.defaultStrong}>{event.longDate}</Typography>
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
                    {/* <PriceDisplay tickets={event.tickets} showOptions={true} /> */}
                    <Button size="small" $variant="outline" onClick={handleManageEventClick}>Gestionar Evento<img src="/icons/arrow-right.svg" alt="arrow" /></Button>
                  </TertiaryInfo>
                </EventContent>
              </Event>
            </Link>
          </EventCardWrapper>
        </EventColumn>
        <EmptyColum />
      </EventRow>
    </>
  );
};

export default EventCardHorizontal;

//Estilos del componente

const EventRow = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 32px;
  grid-row-gap: 0px;
`;

const EmptyColum = styled.div`
  grid-area: 1 / 11 / 2 / 13;
`;

const DateColumn = styled.div`
  grid-area: 1 / 1 / 2 / 3;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const EventColumn = styled.div`
  grid-area: 1 / 3 / 2 / 11; 
  position: relative;
  display: flex;
  flex-direction: row;
`;

const EventCardWrapper = styled.div`  
  padding-bottom: ${({ theme }) => theme.sizing.lg};
  padding-left: ${({ theme }) => theme.sizing.sm};
  width: 100%;  
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  position: relative;
  padding-top: 10px;

  &::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 20px;
    background-image: radial-gradient(ellipse, ${({ theme }) => theme.border.defaultWeak} 2px, ${({ theme }) => theme.border.defaultWeak} 2px, transparent 2px);
    background-size: 16px 16px;
    background-position: -2px 8px;
    background-repeat: repeat-y;
  }

  .Circle {
    width: 12px;
    height: 12px;
    border-radius: 16px;
    border: solid 2px ${({ theme }) => theme.border.defaultWeak};
    background-color: ${({ theme }) => theme.fill.defaultMain};
    z-index: +1;
  }
`;

const Event = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  background-color: ${({ theme }) => theme.fill.defaultMain};
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

const EventMedia = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  max-width: 330px;
  width: 100%;
  display: flex;

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
  align-items: center;
  // justify-content: space-between;
  justify-content: flex-end;
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

const EventContent = styled.div`
  display: flex;
  flex-grow: 1;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-self: stretch;
  gap: ${({ theme }) => theme.sizing.sm};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  z-index: 1;

  .tertiaryInfo {
    // display: flex;
    // flex-direction: row;
    // align-items: center;
    // justify-content: space-between;

    .ManageEvent {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;
      font-family: "Mona Sans";
      font-style: normal;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      line-height: 150%;
      padding: 8px 8px;
      font-size: 16px;
      background-color: transparent;
      border: 1px solid #dcdcdc;
      color: #10110f;
    }
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



