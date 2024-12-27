// components/EventSummary/Attendees.js

import React from 'react';
import styled from 'styled-components';
import Typography from '../Typography';
import AttendeeItem from './AttendeeItem';
import { theme } from '../../theme';

const Attendees = ({ attendees, attendeesCount, organizer }) => {

  return (
    <AttendeesContainer>
      <Heading>
        <Typography $variant="title-4-semibold" as='p'>Asistentes </Typography>
        <AttendeeCounter>
          <Typography as="p" $variant="body-2-semibold" color={theme.colors.brandMain}>
            {attendeesCount}
          </Typography>
        </AttendeeCounter>
      </Heading>
      <AttendeesList>
        <Organizer>
          <OrganizerImages>
            <OrganizerAvatar
              src={organizer.userAvatar}
              alt="Organizador"
            />
            <OrganizerVehicle
              src={organizer.userAvatar}
              alt="Vehiculo Organizador"
            />
          </OrganizerImages>
          <OrganizerInfo>
            <Typography
              $variant="body-3-semibold"
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '100%',
                textAlign: 'center'
              }}>
              {organizer.name} {organizer.lastName}
            </Typography>
            <Typography
              $variant="caption-medium"
              color={theme.colors.defaultWeak}
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '100%',
                textAlign: 'center'
              }}>
              Organizer's Bike
            </Typography>
          </OrganizerInfo>
          <OrganizerBadge>
            <OrganizerBadgeIcon src="/icons/organizer-helmet.svg" alt="Organizer badge" />
            <Typography $variant="caption-medium" color={theme.colors.brandMain}>
              Organizador
            </Typography>
          </OrganizerBadge>
        </Organizer>
        {attendees.map((attendee) => (
          <AttendeeItem key={attendee._id} attendee={attendee} />
        ))}
      </AttendeesList>
    </AttendeesContainer>
  );
};

export default Attendees;

// Styled Components
const AttendeesContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  border-radius: ${({ theme }) => theme.radius.sm};
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xs};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const AttendeeCounter = styled.span`
  padding: ${({ theme }) => theme.sizing.xxs} ${({ theme }) => theme.sizing.xs};;
  background-color: ${({ theme }) => theme.fill.brandAlphaMain16};
  border-radius: ${({ theme }) => theme.radius.xxl};
  min-width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AttendeesList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.sizing.xs};
  padding: ${({ theme }) => theme.sizing.sm};
  list-style: none;
  align-items: flex-start
`;

const Organizer = styled.li`
  width: 120px;
  display: flex;
  padding: ${({ theme }) => theme.sizing.xs} 0px 0px 0px;
  flex-direction: column;
  justify-content: flex-start;    
  align-items: center;
  align-self: flex-start;
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  overflow: hidden;
`;

const OrganizerImages = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px ${({ theme }) => theme.sizing.xs};
`;

const OrganizerInfo = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.sizing.xs};
  display: flex;
  flex-direction: column;
`;

const OrganizerBadge = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.xxs};
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xxs};
  align-self: stretch;
  background: ${({ theme }) => theme.fill.brandAlphaMain16};

  .OrganizerBadgeIcon {
    height: ${({ theme }) => theme.sizing.sm};
  }
`;

const OrganizerBadgeIcon = styled.img`
  height: ${({ theme }) => theme.sizing.sm};
`;

const OrganizerAvatar = styled.img`
  width: ${({ theme }) => theme.sizing.xl};
  height: ${({ theme }) => theme.sizing.xl};
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.border.defaultMain};
  // box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.16);
  z-index: 2;
`;

const OrganizerVehicle = styled.img`
  width: ${({ theme }) => theme.sizing.xl};
  height: ${({ theme }) => theme.sizing.xl};
  border-radius: ${({ theme }) => theme.radius.xl};
  z-index: 1;
  margin-left: -${({ theme }) => theme.sizing.xxs};
`;