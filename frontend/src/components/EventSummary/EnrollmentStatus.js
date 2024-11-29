// components/EventSummary/EnrollmentStatus.js

import React from 'react';
import styled from 'styled-components';
import Typography from '../Typography';
import Button from '../Button/Button';
import { theme } from '../../theme';

const EnrollmentStatus = ({ enrollmentStatus, handleCancelEnrollment }) => {

  // console.log('EnrollmentStatus en EnrollmentStatus:', enrollmentStatus);

  return (
    <StatusContainer>
      <Container>
        <StatusBlock>
          <StatusInfo>
            {enrollmentStatus === 'confirmation pending' && (
              <>
                <StatusIcon src="/icons/ticket-check-solid-negative.svg" alt="ticket-check-solid icon" />
                <Typography $variant="title-5-semibold" color={theme.colors.inverseMain}>Pendiente de aprobación</Typography>
                <Typography $variant="body-1-regular" color={theme.colors.inverseStrong}>Tu inscripción está pendiente de aprobación.</Typography>
              </>
            )}
            {enrollmentStatus === 'attending' && (
              <>
                <StatusIcon src="/icons/ticket-check-solid-negative.svg" alt="ticket-check-solid icon" />
                <Typography $variant="title-5-semibold" color={theme.colors.inverseMain}>Estás inscrito</Typography>
                <Typography $variant="body-1-regular" color={theme.colors.inverseStrong}>¡Tu inscripción ha sido aprobada!</Typography>
              </>
            )}
            {enrollmentStatus === 'not attending' && (
              <>
                <StatusIcon src="/icons/ticket-check-solid-negative.svg" alt="ticket-check-solid icon" />
                <Typography $variant="title-5-semibold" color={theme.colors.inverseMain}>Inscripción cancelada.</Typography>
              </>
            )}
          </StatusInfo>
          <AttendeeCancel>
            <Typography $variant="body-1-regular" color={theme.colors.inverseStrong}>¿No puedes asistir?</Typography>
            <Button $variant="ghostDangerInverse" onClick={handleCancelEnrollment}>
              Cancelar inscripción <img src="/icons/arrow-right-solid-error.svg" alt="arrow icon" />
            </Button>
          </AttendeeCancel>
        </StatusBlock>
      </Container>
    </StatusContainer>
  );
};

export default EnrollmentStatus;

const StatusContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultMain};
`;

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: ${({ theme }) => theme.sizing.lg} ${({ theme }) => theme.sizing.md} 0px ${({ theme }) => theme.sizing.md};
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const StatusBlock = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.sizing.sm};
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.sizing.xs};
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.sizing.xs};
  border-radius: ${({ theme }) => theme.radius.xs};
  background-color: ${({ theme }) => theme.fill.inverseMain};
`;

const StatusIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const StatusInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const AttendeeCancel = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`;