import React from 'react';
import styled from 'styled-components';
import Typography from '../Typography';

const ManageEventCommunications = () => {
  return (
    <EventCommunicationsContainer>
      <Container>
        <Typography $variant="title-4-semibold">Comunicaciones</Typography>
      </Container>
    </EventCommunicationsContainer>
  );
};

export default ManageEventCommunications;

const EventCommunicationsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultMain};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  padding-bottom: 0px;
  width: 100%;
  max-width: 1400px;
  gap: ${({ theme }) => theme.sizing.md};
`;