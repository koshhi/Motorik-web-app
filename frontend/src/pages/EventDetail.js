import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
  const { id } = useParams(); // Obtener el ID del evento desde la URL
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${id}`);
        if (response.data.success) {
          setEvent(response.data.event);
        } else {
          setError('Event not found');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching the event.');
      }
    };

    fetchEvent();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <img src={event.image} alt={event.title} />
      <p className="event_detail-eventType">Tipo: {event.eventType}</p>
      <p>{event.description}</p>
      <p>Location: {event.location}</p>
      <p>
        From {event.startDate} to {event.endDate}
      </p>
      <p>Attendees: {event.attendeesCount}</p>
      <ul>
        {event.attendees.map((attendee, index) => (
          <li key={index}>{attendee}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventDetail;
