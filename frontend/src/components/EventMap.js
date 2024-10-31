// src/components/EventMap.js

import React, { useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// Definir el Styled Component usando props transitorios ($)
const MapContainer = styled.div`
  width: 100%;
  height: ${(props) => props.$maxHeight}; /* Altura configurable */
  border-radius: ${(props) => props.$borderRadius || '8px'};
  overflow: hidden;

  @media (max-width: 768px) {
    height: ${(props) => props.$mobileHeight}; /* Altura para pantallas pequeñas */
  }
`;

const EventMap = ({ lat, lng, maxHeight = '300px', mobileHeight = '200px', borderRadius = '8px' }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);

  // Memorizar el objeto 'center' para evitar re-renderizados innecesarios
  const center = useMemo(() => ({ lat, lng }), [lat, lng]);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API no está disponible.');
      return;
    }

    if (mapRef.current) {
      // El mapa ya está inicializado
      return;
    }

    // Crear el mapa con un Map ID
    mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
      center: center,
      zoom: 16, // Ajusta el nivel de zoom según tus necesidades
      disableDefaultUI: true, // Deshabilita todos los controles predeterminados
      zoomControl: true, // Habilita los botones de zoom
      scrollwheel: false, // Deshabilita el zoom con la rueda del ratón
      draggable: true, // Permite el arrastre del mapa
      disableDoubleClickZoom: true, // Deshabilita el zoom con doble clic
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapId: 'f29e19ef0914499b', // Reemplaza con tu Map ID
    });

    // Crear el AdvancedMarkerElement
    const svgIconUrl = '/icons/map-pin-motorik.svg'; // Ruta a tu SVG en la carpeta 'public/icons'

    // Verificar que AdvancedMarkerElement está disponible
    if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
      // Obtener el contenido del SVG
      fetch(svgIconUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then((svgText) => {
          const markerDiv = document.createElement('div');
          markerDiv.innerHTML = svgText;

          // Seleccionar el elemento SVG dentro del div
          const svgElement = markerDiv.querySelector('svg');

          if (svgElement) {
            // Aplicar estilos directamente al SVG
            svgElement.style.width = '100%';
            svgElement.style.height = '100%';
            svgElement.style.display = 'block'; // Asegura que no haya espacio en blanco
          }

          // Ajustar el tamaño y estilo del div contenedor
          markerDiv.style.width = '28px';
          markerDiv.style.height = '28px';
          markerDiv.style.display = 'flex';
          markerDiv.style.alignItems = 'center';
          markerDiv.style.justifyContent = 'center';
          markerDiv.style.cursor = 'pointer'; // Cambiar el cursor al pasar sobre el marker

          // Crear el AdvancedMarkerElement
          markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: center,
            content: markerDiv,
          });

          // No añadir eventos de clic
        })
        .catch((error) => {
          console.error('Error fetching SVG:', error);
        });
    } else {
      console.error('AdvancedMarkerElement is not available.');
    }

    // Limpiar el marker al desmontar el componente
    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [center]);

  return (
    <MapContainer $maxHeight={maxHeight} $mobileHeight={mobileHeight} $borderRadius={borderRadius}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </MapContainer>
  );
};

// Definir tipos de props
EventMap.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  maxHeight: PropTypes.string, // Prop para altura máxima
  mobileHeight: PropTypes.string, // Prop para altura en pantallas pequeñas
};

export default EventMap;
