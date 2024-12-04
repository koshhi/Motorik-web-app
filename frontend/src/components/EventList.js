// EventList.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import axiosClient from '../api/axiosClient';
import EventCard from './EventCard';
import FilterForm from './FilterForm';
import { getMunicipality } from '../utils/GetMunicipality';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    typology: [],
    timeFilter: 'flexible',
    location: JSON.parse(localStorage.getItem('location')) || { lat: 40.4378, lng: -3.8443, address: 'Madrid' }, // Valores por defecto para Madrid
    radius: 1000,
    terrain: '',
    experience: '',
    ticketType: ''
  });

  const [municipality, setMunicipality] = useState(localStorage.getItem('municipality') || 'Madrid');
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async (currentFilters) => {
    console.log('Fetching events with filters:', currentFilters);
    setIsLoading(true);
    try {
      const response = await axiosClient.get('/api/events', {
        params: {
          lat: currentFilters.location.lat,
          lng: currentFilters.location.lng,
          radius: currentFilters.radius,
          eventTypes: currentFilters.typology,
          timeFilter: currentFilters.timeFilter,
          terrain: currentFilters.terrain,
          experience: currentFilters.experience,
          ticketType: currentFilters.ticketType,
        },
      });
      console.log('Events fetched:', response.data.events);
      setEvents(response.data.events);
    } catch (error) {
      console.error(
        'Error fetching events:',
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Llamar a fetchEvents al montar el componente
  useEffect(() => {
    console.log('Component mounted, fetching initial events.');
    fetchEvents(filters);
  }, []);

  // Actualizar eventos al cambiar los filtros
  useEffect(() => {
    console.log('Filters updated:', filters);
    fetchEvents(filters);
  }, [filters]);

  useEffect(() => {
    if (!localStorage.getItem('location')) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ location: userLocation }, (results, status) => {
              if (status === 'OK') {
                if (results[0]) {
                  const addressData = results[0];
                  const userAddress = addressData.formatted_address || 'Dirección desconocida';
                  const userMunicipality = getMunicipality(addressData.address_components || []);
                  console.log('User municipality from geocoding:', userMunicipality);

                  const completeUserLocation = {
                    ...userLocation,
                    address: userAddress,
                  };

                  localStorage.setItem('location', JSON.stringify(completeUserLocation));
                  localStorage.setItem('municipality', userMunicipality);

                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    location: completeUserLocation,
                  }));
                  setMunicipality(userMunicipality);
                } else {
                  console.error('No se encontraron resultados para la geocodificación.');
                }
              } else {
                console.error('Geocoder failed debido a: ' + status);
              }
            });
          },
          (error) => {
            console.error('Error obteniendo la ubicación del usuario', error);
          }
        );
      } else {
        console.error('Geolocalización no es soportada por este navegador.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <FilterForm
        filters={filters}
        setFilters={setFilters}
        municipality={municipality}
        setMunicipality={setMunicipality}
      />
      <EventsGrid>
        {isLoading ? (
          <div className="loading">Cargando eventos...</div>
        ) : events.length === 0 ? (
          <div className="empty_state">No hay eventos con estos parámetros de búsqueda.</div>
        ) : (
          events.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </EventsGrid>
    </>
  );
};

export default EventList;



const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.sizing.md};
  grid-auto-flow: row;
  padding: ${({ theme }) => theme.sizing.md};
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;

  .loading {}
  .empty_state {}
`;