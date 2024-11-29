// components/EventSummary/EventSummary.js

import React from 'react';
import styled from 'styled-components';
import DateAndLocation from './DateAndLocation';
import Attendees from './Attendees';

const EventSummary = ({
  date,
  location,
  shortLocation,
  mapCoordinates,
  attendees,
  attendeesCount,
  organizer,
}) => {
  return (
    <SummaryContainer>
      <DateAndLocation
        date={date}
        location={location}
        shortLocation={shortLocation}
        mapCoordinates={mapCoordinates}
      />
      <Attendees
        attendees={attendees}
        attendeesCount={attendeesCount}
        organizer={organizer}
      />
    </SummaryContainer>
  );
};

export default EventSummary;

// Styled Components
const SummaryContainer = styled.div`
  grid-area: 1 / 8 / 2 / 13;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;
