// components/EventManagement/ManageEventAttendees.js

import React from 'react';
import { useEventContext } from '../../context/EventContext';
import { useEventActions } from '../../hooks/useEventActions';
import AttendeesSummary from '../../components/AttendeesSummary';
import AttendeesList from '../AttendeesList';
import styled from 'styled-components';
import { theme } from '../../theme';

const ManageEventAttendees = () => {
  const { eventDetails, setEventDetails } = useEventContext();
  const { capacity, attendees } = eventDetails || { capacity: 0, attendees: [] };

  const { handleApprove, handleReject } = useEventActions(eventDetails.id);

  return (
    <AttendeesSection>
      <Container>
        <AttendeesSummary attendees={attendees} capacity={capacity} />
        <AttendeesList attendees={attendees} onApprove={handleApprove} onReject={handleReject} />
      </Container>
    </AttendeesSection>
  );
};

export default ManageEventAttendees;

const AttendeesSection = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px ${({ theme }) => theme.sizing.md};
  max-width: 1400px;
  width: 100%;
`;