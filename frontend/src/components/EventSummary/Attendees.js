// components/EventSummary/Attendees.js

import React from 'react';
import styled from 'styled-components';
import Typography from '../Typography';
import AttendeeItem from './AttendeeItem';

const Attendees = ({ attendees, attendeesCount, organizer }) => {

  return (
    <AttendeesContainer>
      <Heading>
        <Typography $variant="title-4-semibold" as='p'>Asistentes </Typography>
        <AttendeeCounter>{attendeesCount}</AttendeeCounter>
      </Heading>
      <AttendeesList>
        <li className='Attendee'>
          <div className='Images'>
            <img
              className="AttendeeImg"
              src={organizer.userAvatar}
              alt="Organizador"
            />
            <img
              className='VehicleImg'
              src={organizer.userAvatar}
              alt="Vehiculo Organizador" />
          </div>
          <div className='Info'>
            <p className='AttendeeName'>
              {organizer.name} {organizer.lastName}
            </p>
            <p className='AttendeeVehicle'>
              Organizer's Bike
            </p>
          </div>
          <div className='OrganizerBadge'>
            <img src="/icons/organizer-helmet.svg" alt="Organizer badge" />
            Organizador
          </div>
        </li>
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
  // gap: 16px;
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  border-radius: ${({ theme }) => theme.radius.sm};
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${({ theme }) => theme.sizing.sm};
`;

const AttendeeCounter = styled.span`
  color: ${({ theme }) => theme.colors.brandMain};
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.fill.brandAlphaMain16};
  border-radius: 48px;
  font-size: 14px;
  font-weight: 600;
`;

const AttendeesList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: ${({ theme }) => theme.sizing.sm};
  list-style: none;
`;
