// hooks/useEvent.js
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const useEvent = (eventId, user) => {
  const [event, setEvent] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoadingEvent(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/api/events/${eventId}`);
        if (response.data.success) {
          setEvent(response.data.event);
          console.log('Evento obtenido:', response.data.event);

          // Verificar si el usuario es el propietario del evento
          if (user && response.data.event.owner.id === user.id) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        } else {
          setError(response.data.message || 'No se pudo obtener el evento.');
        }
      } catch (err) {
        console.error('Error al obtener el evento:', err);
        setError('Error al obtener el evento.');
      } finally {
        setLoadingEvent(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, user]);

  return { event, isOwner, loadingEvent, error, setEvent };
};

export default useEvent;
