// frontend/src/context/EventContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const EventContext = createContext();

// El provider acepta un prop 'initialEventDetails'
export const EventProvider = ({ children, initialEventDetails = {} }) => {

  // export const EventProvider = ({ children, initialEventDetails = null }) => {
  // Estado para detalles de un evento individual
  const [eventDetails, setEventDetails] = useState(initialEventDetails);
  // Estado para mis eventos (organizados e inscritos)
  const [myEvents, setMyEvents] = useState({
    organized: { upcoming: [], past: [] },
    enrolled: { upcoming: [], past: [] },
  });

  // Estado para el loading
  const [loading, setLoading] = useState(true);

  // Función para actualizar los eventos con los datos de la API
  const fetchMyEvents = async () => {
    try {
      const response = await axiosClient.get('/api/events/my-events');
      if (response.data && response.data.success) {
        // Actualizamos el estado con las propiedades "organized" y "enrolled"
        setMyEvents({
          organized: response.data.organized,
          enrolled: response.data.enrolled,
        });
      } else {
        console.error('Error al obtener los eventos:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching my events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar los eventos cuando se monta el provider
  useEffect(() => {
    fetchMyEvents();
  }, []);


  const updateEventDetails = (updatedEvent) => {
    setEventDetails(updatedEvent);
  };

  // const updateMyEvents = (data) => {
  //   setMyEvents(data);
  // };

  return (
    <EventContext.Provider value={{ eventDetails, updateEventDetails, myEvents, loading, fetchMyEvents }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
