// src/hooks/useUserEvents.js

import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const useUserEvents = (userId) => {
  const [futureEvents, setFutureEvents] = useState([]);
  const [attendeeEvents, setAttendeeEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosClient.get(`/api/events/${userId}/events`);
        if (response.data.success) {
          setFutureEvents(response.data.futureEvents);
          setAttendeeEvents(response.data.attendeeEvents);
        } else {
          setErrorEvents('Error al obtener los eventos del usuario.');
        }
      } catch (err) {
        console.error('Error al obtener los eventos:', err);
        setErrorEvents('Error al obtener los eventos. Por favor, intenta de nuevo.');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [userId]);

  return { futureEvents, attendeeEvents, loadingEvents, errorEvents };
};

export default useUserEvents;
