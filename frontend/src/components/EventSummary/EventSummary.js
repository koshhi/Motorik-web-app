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
    <>
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
    </>
  );
};

export default EventSummary;
