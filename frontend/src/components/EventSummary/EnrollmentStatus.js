// components/EventSummary/EnrollmentStatus.js

import React from 'react';
import styled from 'styled-components';
import Typography from '../Typography';
import Button from '../Button/Button';
import { theme } from '../../theme';

const EnrollmentStatus = ({ enrollmentStatus, handleCancelEnrollment }) => {

  // console.log('EnrollmentStatus en EnrollmentStatus:', enrollmentStatus);

  return (
    <StatusBlock>
      <StatusInfo>
        {enrollmentStatus === 'confirmation pending' && (
          <>
            <StatusVisual>
              <StatusIcon src="/icons/ticket-approval-required-solid.svg" alt="ticket-approval-required icon" />
            </StatusVisual>
            <StatusContent>
              <Typography $variant="title-5-semibold" color={theme.colors.inverseMain}>
                Pendiente de aprobación
              </Typography>
              <Typography $variant="body-1-regular" color={theme.colors.inverseStrong}>
                El organizador responderá en breve.
              </Typography>
            </StatusContent>
          </>
        )}
        {enrollmentStatus === 'attending' && (
          <>
            <StatusVisual>
              <StatusIcon src="/icons/ticket-check-solid-negative.svg" alt="ticket-check icon" />
            </StatusVisual>
            <StatusContent>
              <Typography $variant="title-5-semibold" color={theme.colors.inverseMain}>
                Estás inscrito
              </Typography>
              <Typography $variant="body-1-regular" color={theme.colors.inverseStrong}>
                ¡Tu inscripción ha sido aprobada!
              </Typography>
            </StatusContent>
          </>
        )}
        {enrollmentStatus === 'not attending' && (
          <>
            <StatusVisual>
              <StatusIcon src="/icons/ticket-cancel-solid.svg" alt="ticket-cancel icon" />
            </StatusVisual>
            <StatusContent>
              <Typography $variant="title-5-semibold" color={theme.colors.inverseMain}>
                Inscripción cancelada.
              </Typography>
            </StatusContent>
          </>
        )}
      </StatusInfo>
      <AttendeeCancel>
        <Typography $variant="body-1-regular" color={theme.colors.inverseStrong}>¿No puedes asistir?</Typography>
        <Button $variant="ghostDangerInverse" onClick={handleCancelEnrollment}>
          Cancelar inscripción
        </Button>
      </AttendeeCancel>
    </StatusBlock>
  );
};

export default EnrollmentStatus;

const StatusBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.fill.inverseMain};
  overflow: hidden;
`;

const StatusVisual = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: ${({ theme }) => theme.fill.inverseWeak};
  border-radius: ${({ theme }) => theme.radius.sm};
`;

const StatusIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const StatusInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: ${({ theme }) => theme.sizing.sm};
`;

const StatusContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AttendeeCancel = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: ${({ theme }) => theme.sizing.sm};
  background-color: ${({ theme }) => theme.fill.inverseWeak};
`;