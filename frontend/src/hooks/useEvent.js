// hooks/useEvent.js
import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const useEvent = (eventId, user) => {
  const [event, setEvent] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener el evento
  const fetchEvent = async () => {
    setLoadingEvent(true);
    setError(null);
    try {
      const response = await axiosClient.get(`/api/events/${eventId}`);
      if (response.data.success) {
        setEvent(response.data.event);
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

  // Cargar evento al montar
  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId, user]);

  // // Agregar polling cada 5 segundos para actualizar el evento
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (eventId) {
  //       fetchEvent();
  //     }
  //   }, 5000); // cada 5 segundos (ajusta según necesites)
  //   return () => clearInterval(interval);
  // }, [eventId]);

  return { event, isOwner, loadingEvent, error, setEvent };
};

export default useEvent;
