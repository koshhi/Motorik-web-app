// components/EventSummary/AttendeeItem.js

import React from 'react';
import styled from 'styled-components';
import Typography from '../Typography';

const AttendeeItem = ({ attendee }) => {
  return (
    <Attendee>
      <Images>
        <img src={attendee.userId?.userAvatar || '/default-avatar.png'} alt={`${attendee.userId?.name} ${attendee.userId?.lastName}`} className="AttendeeImg" />
        <img src={attendee.vehicleId?.image || '/default-vehicle.png'} alt={`${attendee.vehicleId?.brand} ${attendee.vehicleId?.model}`} className="VehicleImg" />
      </Images>
      <Info>
        <Typography $variant="body-1-semibold" className="AttendeeName">
          {attendee.userId?.name || 'Nombre'} {attendee.userId?.lastName || 'Apellido'}
        </Typography>
        <Typography $variant="body-2-medium" className="AttendeeVehicle">
          {attendee.vehicleId?.brand || 'Marca'} {attendee.vehicleId?.model || 'Modelo'}
        </Typography>
      </Info>
    </Attendee>
  );
};

export default AttendeeItem;

// Styled Components
const Attendee = styled.li`
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  background-color: ${({ theme }) => theme.fill.defaultMain};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  border-radius: ${({ theme }) => theme.radius.xs};
`;

const Images = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;

  .AttendeeImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.border.defaultMain};
    box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.16);
    z-index: 2;
  }

  .VehicleImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    z-index: 1;
    margin-left: -8px;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .AttendeeName {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.defaultStrong};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .AttendeeVehicle {
    font-size: 12px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
