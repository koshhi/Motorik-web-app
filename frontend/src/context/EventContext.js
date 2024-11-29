// context/EventContext.js

import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const EventContext = createContext();

// Proveedor del contexto
export const EventProvider = ({ children, initialEventDetails }) => {
  const [eventDetails, setEventDetails] = useState(initialEventDetails || null);

  return (
    <EventContext.Provider value={{ eventDetails, setEventDetails }}>
      {children}
    </EventContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext debe ser usado dentro de un EventProvider');
  }
  return context;
};
export default EventContext;
