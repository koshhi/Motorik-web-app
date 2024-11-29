// components/EventSummary/DateAndLocation.js

import React from 'react';
import styled from 'styled-components';
import EventMap from '../EventMap';
import Typography from '../Typography';

const DateAndLocation = ({ date, location, shortLocation, mapCoordinates }) => {
  return (
    <Container>
      <DateRow>
        <DateContainer>
          <MonthDate>
            <p>{date.monthDate}</p>
          </MonthDate>
          <DayDate>
            <p>{date.dayDate}</p>
          </DayDate>
        </DateContainer>
        <LongDate>
          {date.partialDateStart}, {date.partialDateEnd}
        </LongDate>
      </DateRow>
      <LocationRow>
        <LocationContainer>
          <img src="/icons/map-location.svg" alt="map-location-icon" />
        </LocationContainer>
        <LocationAddress>
          <p className="Location">{location}</p>
          <p className="ShortLocation">{shortLocation}</p>
        </LocationAddress>
      </LocationRow>
      <EventMap
        lat={mapCoordinates.lat}
        lng={mapCoordinates.lng}
        maxHeight="200px"
        mobileHeight="120px"
        borderRadius="0px"
      />
    </Container>
  );
};

export default DateAndLocation;

// Styled Components
const Container = styled.div`
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  overflow: hidden;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 48px;
  border-radius: ${({ theme }) => theme.radius.xs};
  background: ${({ theme }) => theme.fill.defaultSubtle};
  overflow: hidden;
`;

const MonthDate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  background-color: #EFEFEF;

  p {
    color: #292929;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    margin: 0;
  }
`;

const DayDate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;

  p {
    color: #292929;
    font-size: 16px;
    font-weight: 700;
    margin: 0;
  }
`;

const LongDate = styled.p`
  color: ${({ theme }) => theme.colors.defaultStrong};
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const LocationRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const LocationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 52px;
  background: ${({ theme }) => theme.fill.defaultSubtle};
  border-radius: ${({ theme }) => theme.radius.xs};

  img {
    height: 24px;
  }
`;

const LocationAddress = styled.div`
  .ShortLocation {
    color: #656565;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
  }

  .Location {
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
`;
