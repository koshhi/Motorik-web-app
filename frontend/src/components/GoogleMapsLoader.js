// src/components/GoogleMapsLoader.js

import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAP_LIBRARIES = ['places', 'marker']; // Añadimos 'marker' aquí

const GoogleMapsLoader = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Asegúrate de tener esta variable en tu archivo .env
    libraries: GOOGLE_MAP_LIBRARIES,
    version: 'weekly',
  });

  if (loadError) {
    return <div>Error al cargar Google Maps. Por favor, intenta nuevamente.</div>;
  }

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return children;
};

export default GoogleMapsLoader;
