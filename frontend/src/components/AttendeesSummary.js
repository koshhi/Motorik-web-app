// components/AttendeesSummary.js
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../theme';
import { statusColors } from '../utils/statusColors';
import Typography from '../components/Typography';

const AttendeesSummary = ({ capacity, attendees }) => {

  // Calculamos los asistentes por estado
  const attendeesByStatus = attendees.reduce((acc, attendee) => {
    const status = attendee.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Total de asistentes
  const totalAttendees = attendees.length;

  // Capacidad efectiva para evitar división por cero
  const effectiveCapacity = capacity || totalAttendees || 1;

  // Calculamos el porcentaje para cada estado
  const statusPercentages = Object.keys(attendeesByStatus).reduce((acc, status) => {
    acc[status] = (attendeesByStatus[status] / effectiveCapacity) * 100;
    return acc;
  }, {});

  return (
    <SummaryWrapper>
      <Typography $variant='title-3-semibold' as='h2'>Resumen</Typography>

      <AttendanceMetrics>
        <AttendanceData>
          <AttendanceDataBlock>
            <Typography $variant='title-3-semibold' as='p'>
              {attendees.length}
            </Typography>
            <Typography $variant='body-1-semibold' color={theme.colors.defaultStrong}>
              asistentes
            </Typography>
          </AttendanceDataBlock>
          <AttendanceDataBlock>
            <Typography $variant='body-1-semibold'>
              max
            </Typography>
            <Typography $variant='title-3-semibold' as='p' color={theme.colors.defaultStrong}>
              {/* {capacity} */}
              {capacity || '∞'}
            </Typography>
          </AttendanceDataBlock>
        </AttendanceData>

        <AttendanceChart>
          <BarChartContainer>
            <BarChart>
              {Object.keys(statusPercentages).map((status) => (
                <BarSegment
                  key={status}
                  style={{
                    width: `${statusPercentages[status]}%`,
                    backgroundColor: statusColors[status],
                  }}
                  title={`${attendeesByStatus[status]} ${status}`}
                />
              ))}
            </BarChart>
            <Typography $variant='body-3-medium' as='p' color={theme.colors.defaultStrong}>
              {Math.round((totalAttendees / effectiveCapacity) * 100)}% ocupado
            </Typography>
          </BarChartContainer>
          <AttendanceStatusList>
            {Object.keys(attendeesByStatus).map((status) => (
              <StatusItem key={status}>
                <StatusIndicator style={{ backgroundColor: statusColors[status] }} />
                <Typography $variant='body-2-regular' color={statusColors[status]}>
                  {attendeesByStatus[status]} {getStatusLabel(status)}
                </Typography>
              </StatusItem>
            ))}
          </AttendanceStatusList>
        </AttendanceChart>
      </AttendanceMetrics>
    </SummaryWrapper>
  );
};

// Función para obtener etiquetas legibles para cada estado
const getStatusLabel = (status) => {
  switch (status) {
    case 'attending':
      return 'Asistirán';
    case 'confirmation pending':
      return 'Pendientes';
    case 'not attending':
      return 'No asistirán';
    default:
      return status;
  }
};

AttendeesSummary.propTypes = {
  attendees: PropTypes.array.isRequired,
  capacity: PropTypes.number.isRequired,
};

export default AttendeesSummary;


// Estilizado
const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
  justify-content: flex-start;
  width: 100%;
  padding-top: ${({ theme }) => theme.sizing.xl};
  padding-bottom: ${({ theme }) => theme.sizing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};
`;

const AttendanceMetrics = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap:  ${({ theme }) => theme.sizing.xs};
  width: 100%;
`;

const AttendanceData = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.sizing.md};
`;

const AttendanceDataBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const AttendanceChart = styled.div`
  width: 100%;
`;

const BarChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const BarChart = styled.div`
  width: 100%;
  display: flex;
  background-color: ${({ theme }) => theme.fill.defaultWeak};
  height: ${({ theme }) => theme.sizing.xs};
  border-radius: ${({ theme }) => theme.sizing.xs};
  overflow: hidden;
`;


const BarSegment = styled.div`
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.border.defaultWeak};

  &:last-child {
    border-right: none;
  }
  // background-color: ${({ theme }) => theme.fill.brandMain};
  // display: inline-block;
`;

const AttendanceStatusList = styled.div`
  width: 100%;
  margin-top: ${({ theme }) => theme.sizing.sm};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const StatusIndicator = styled.div`
  width: ${({ theme }) => theme.sizing.xs};
  height: ${({ theme }) => theme.sizing.xs};
  border-radius: 8px;
`;