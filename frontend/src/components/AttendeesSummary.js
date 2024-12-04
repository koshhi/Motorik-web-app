// components/AttendeesSummary.js
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { theme } from '../theme';
import Typography from '../components/Typography';

const AttendeesSummary = ({ capacity, attendees }) => {
  const percentage = capacity ? (attendees.length / capacity) * 100 : 100;

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
              asistente
            </Typography>
          </AttendanceDataBlock>
          <AttendanceDataBlock>
            <Typography $variant='body-1-semibold'>
              max
            </Typography>
            <Typography $variant='title-3-semibold' as='p' color={theme.colors.defaultStrong}>
              {capacity}
            </Typography>

          </AttendanceDataBlock>
        </AttendanceData>

        <AttendanceChart>
          {capacity ? (
            <BarChartContainer>
              <BarChart>
                <BarFill style={{ width: `${percentage}%` }} />
              </BarChart>
              <Typography $variant='body-3-medium' as='p' color={theme.colors.defaultStrong}>
                {Math.round(percentage)}% ocupado
              </Typography>
            </BarChartContainer>
          ) : (
            <BarChartContainer>
              <BarChart>
                {attendees.map((attendee, index) => (
                  <BarSegment
                    key={attendee._id || index}
                    style={{ width: `${100 / attendees.length}%` }}
                  />
                ))}
              </BarChart>
              <Typography $variant='body-3-medium' as='p' color={theme.colors.defaultStrong}>
                {attendees.length} asistentes
              </Typography>
            </BarChartContainer>
          )}
        </AttendanceChart>
      </AttendanceMetrics>
    </SummaryWrapper>
  );
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
  background-color: ${({ theme }) => theme.fill.defaultWeak};
  height: ${({ theme }) => theme.sizing.xs};
  border-radius: ${({ theme }) => theme.sizing.xs};
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.fill.brandMain};
  transition: width 0.3s ease-in-out;
`;

const BarSegment = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.fill.brandMain};
  display: inline-block;
`;
