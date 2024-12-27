// components/EventSummary/AttendeeItem.js

import React from 'react';
import styled from 'styled-components';
import Typography from '../Typography';
import { theme } from '../../theme';

const AttendeeItem = ({ attendee }) => {
  return (
    <Attendee>
      <AttendeeImages>
        <AttendeeAvatar
          src={attendee.userId?.userAvatar}
          alt="Avatar asistente"
        />
        {attendee.vehicleId && (
          <AttendeeVehicle
            src={attendee.vehicleId?.image}
            alt={`${attendee.vehicleId?.brand} ${attendee.vehicleId?.model}`}
          />
        )}
      </AttendeeImages>
      <AttendeeInfo>
        <Typography
          $variant="body-3-semibold"
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '100%',
            textAlign: 'center'
          }}>
          {attendee.userId?.name || 'Nombre'} {attendee.userId?.lastName || 'Apellido'}
        </Typography>
        {attendee.vehicleId && (
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
            {attendee.vehicleId.brand || 'Marca'} {attendee.vehicleId.model || 'Modelo'}
          </Typography>
        )}
      </AttendeeInfo>
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
  padding: ${({ theme }) => theme.sizing.xs}  0 0 0;
  background-color: ${({ theme }) => theme.fill.defaultMain};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  border-radius: ${({ theme }) => theme.radius.xs};
`;

const AttendeeImages = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const AttendeeAvatar = styled.img`
  width: ${({ theme }) => theme.sizing.xl};
  height: ${({ theme }) => theme.sizing.xl};
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.border.defaultMain};
  // box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.16);
  z-index: 2;
`;

const AttendeeVehicle = styled.img`
  width: ${({ theme }) => theme.sizing.xl};
  height: ${({ theme }) => theme.sizing.xl};
  border-radius: ${({ theme }) => theme.radius.xl};
  z-index: 1;
  margin-left: -8px;
`;

const AttendeeInfo = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.sizing.xs};
  display: flex;
  flex-direction: column;
`;
