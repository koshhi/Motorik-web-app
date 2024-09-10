import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import MainNavbar from '../components/Navbar/MainNavbar';
import EventCardHorizontal from '../components/EventCardHorizontal';

const MyEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/user/myevents`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Ensure response data structure is correct
        if (response.data && response.data.futureEvents && response.data.pastEvents) {
          setUpcomingEvents(response.data.futureEvents);
          setPastEvents(response.data.pastEvents);
        }
      } catch (error) {
        console.error('Error fetching my events:', error);
      }
    };

    fetchMyEvents();
  }, [authToken]);

  return (
    <>
      <MainNavbar />
      <MyEventsHeader>
        <Container>
          <div className='Heading'>
            <h1>Mis eventos</h1>
          </div>
          <div className='Tabs'>Tabs</div>
        </Container>
      </MyEventsHeader>
      <MyEventsList>
        <Container>
          <MyFutureEvents>
            <h2 className='SectionTitle'>Upcoming Events</h2>
            <div className='List'>
              {upcomingEvents && upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventCardHorizontal key={event._id || event.id} event={event} />
                ))
              ) : (
                <p>No upcoming events</p>
              )}
            </div>


          </MyFutureEvents>
        </Container>
        <Container>
          <MyPastEvents>
            <h2>Past Events</h2>
            {pastEvents && pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <EventCardHorizontal key={event._id || event.id} event={event} />
              ))
            ) : (
              <p>No past events</p>
            )}
          </MyPastEvents>
        </Container>
      </MyEventsList>
    </>
  );
};

export default MyEvents;

const MyEventsHeader = styled.section`
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  align-items: center;
  display:flex;
  flex-direction: column;

  .Heading h1 {
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Titles/Desktop/Title 2/Semibold */
    font-family: "Mona Sans";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 39.2px */
  }  

  .Tabs {
  }
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


const MyEventsList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;
const MyFutureEvents = styled.div`

  .SectionTitle {
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Titles/Desktop/Title 3/Semibold */
    font-family: "Mona Sans";
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 33.6px */

    padding-bottom: 24px;
  }
  .List {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

`;
const MyPastEvents = styled.div``;