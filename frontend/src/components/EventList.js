import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import EventCard from './EventCard';
import FilterForm from './FilterForm';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    typology: '',
    timeFilter: '',
    location: { lat: null, lng: null },
    radius: 50 //Radio por defecto en Km
  });
  const [isLoading, setIsLoading] = useState(false);

  // Obtener la localización del usuario al cargar el componente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters(prevFilters => ({
            ...prevFilters,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }))
        },
        (error) => {
          console.error('Error obteniendo la ubicación del usuario', error)
        }
      )
    }
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/events`

      const params = []
      if (filters.typology.length > 0) {
        params.push(`eventTypes=${filters.typology.join(',')}`)
      }
      if (filters.timeFilter) {
        params.push(`timeFilter=${filters.timeFilter}`)
      }
      if (filters.location.lat && filters.location.lng) {
        params.push(`lat=${filters.location.lat}`)
        params.push(`lng=${filters.location.lng}`)
        params.push(`radius=${filters.radius || 50}`); // Si no se selecciona un radio, se usa el valor por defecto de 10km
      }

      if (params.length > 0) {
        url += '?' + params.join('&')
      }

      const response = await axios.get(url)
      setEvents(response.data.events)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [filters])

  return (
    <>
      <FilterForm filters={filters} setFilters={setFilters} />
      <EventsGrid>
        {isLoading ? (
          <div className="loading">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="empty_state">No hay eventos con estos parámetros de búsqueda.</div>
        ) : (
          events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        )}
      </EventsGrid>
    </>
  );
};

export default EventList;


//Estilos del componente

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 24px;
  grid-auto-flow: row;
  padding: 24px;
  max-width: 1248px;
  margin-left: auto;
  margin-right: auto;

  .loading {}
  .empty_state {}
`;