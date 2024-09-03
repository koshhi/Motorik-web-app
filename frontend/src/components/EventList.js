import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import EventCard from './EventCard';
import FilterForm from './FilterForm';

// const EventList = () => {
//   const [events, setEvents] = useState([]);
//   const [filters, setFilters] = useState({
//     typology: '',
//     timeFilter: '',
//     location: { lat: 40.4168, lng: -3.7038 }, // Madrid, España
//     radius: 300, //km
//     terrain: '',
//     experience: '',
//     ticketType: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   // Obtener la localización del usuario al cargar el componente
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setFilters(prevFilters => ({
//             ...prevFilters,
//             location: {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude
//             }
//           }))
//         },
//         (error) => {
//           console.error('Error obteniendo la ubicación del usuario', error)
//         }
//       )
//     }
//   }, [])

//   const fetchEvents = async () => {
//     setIsLoading(true)
//     try {
//       let url = `${process.env.REACT_APP_API_URL}/api/events`

//       const params = []

//       if (filters.typology.length > 0) {
//         params.push(`eventTypes=${filters.typology.join(',')}`)
//       }

//       if (filters.timeFilter) {
//         params.push(`timeFilter=${filters.timeFilter}`)
//       }

//       if (filters.location.lat && filters.location.lng) {
//         params.push(`lat=${filters.location.lat}`)
//         params.push(`lng=${filters.location.lng}`)
//         params.push(`radius=${filters.radius || 50}`); // Si no se selecciona un radio, se usa el valor por defecto de 50km
//       }

//       if (filters.terrain) {
//         params.push(`terrain=${filters.terrain}`)
//       }

//       if (filters.experience) {
//         params.push(`experience=${filters.experience}`)
//       }

//       if (filters.ticketType) {
//         params.push(`ticketType=${filters.ticketType}`)
//       }

//       if (params.length > 0) {
//         url += '?' + params.join('&')
//       }

//       const response = await axios.get(url)
//       setEvents(response.data.events)
//     } catch (error) {
//       console.error('Error fetching events:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchEvents()
//   }, [filters])

//   return (
//     <>
//       <FilterForm filters={filters} setFilters={setFilters} />
//       <EventsGrid>
//         {isLoading ? (
//           <div className="loading">Loading events...</div>
//         ) : events.length === 0 ? (
//           <div className="empty_state">No hay eventos con estos parámetros de búsqueda.</div>
//         ) : (
//           events.map((event) => (
//             <EventCard key={event._id} event={event} />
//           ))
//         )}
//       </EventsGrid>
//     </>
//   );
// };


// const EventList = () => {
//   const [events, setEvents] = useState([]);
//   const [filters, setFilters] = useState({
//     typology: '',
//     timeFilter: '',
//     location: { lat: 40.4168, lng: -3.7038 }, // Madrid, España
//     radius: 300, // Radio de búsqueda por defecto de 300 km
//     terrain: '',
//     experience: '',
//     ticketType: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchEvents = async (newFilters) => {
//     setIsLoading(true);
//     try {
//       let url = `${process.env.REACT_APP_API_URL}/api/events`;

//       const params = [];

//       if (newFilters.typology.length > 0) {
//         params.push(`eventTypes=${newFilters.typology.join(',')}`);
//       }

//       if (newFilters.timeFilter) {
//         params.push(`timeFilter=${newFilters.timeFilter}`);
//       }

//       if (newFilters.location.lat && newFilters.location.lng) {
//         params.push(`lat=${newFilters.location.lat}`);
//         params.push(`lng=${newFilters.location.lng}`);
//         params.push(`radius=${newFilters.radius || 300}`);
//       }

//       if (newFilters.terrain) {
//         params.push(`terrain=${newFilters.terrain}`);
//       }

//       if (newFilters.experience) {
//         params.push(`experience=${newFilters.experience}`);
//       }

//       if (newFilters.ticketType) {
//         params.push(`ticketType=${newFilters.ticketType}`);
//       }

//       if (params.length > 0) {
//         url += '?' + params.join('&');
//       }

//       const response = await axios.get(url);
//       setEvents(response.data.events);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Primera llamada a fetchEvents con ubicación de Madrid
//   useEffect(() => {
//     fetchEvents(filters);
//   }, []);

//   // Solicitar ubicación del usuario y realizar una nueva búsqueda
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const newFilters = {
//             ...filters,
//             location: {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude
//             },
//             radius: 300 // Radio de búsqueda predeterminado
//           };
//           setFilters(newFilters);
//           fetchEvents(newFilters);
//         },
//         (error) => {
//           console.error('Error obteniendo la ubicación del usuario', error);
//         }
//       );
//     }
//   }, []);

//   // Actualizar eventos al cambiar los filtros
//   useEffect(() => {
//     fetchEvents(filters);
//   }, [filters]);

//   return (
//     <>
//       <FilterForm filters={filters} setFilters={setFilters} />
//       <EventsGrid>
//         {isLoading ? (
//           <div className="loading">Loading events...</div>
//         ) : events.length === 0 ? (
//           <div className="empty_state">No hay eventos con estos parámetros de búsqueda.</div>
//         ) : (
//           events.map((event) => (
//             <EventCard key={event._id} event={event} />
//           ))
//         )}
//       </EventsGrid>
//     </>
//   );
// };

// export default EventList;









//Estilos del componente

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    typology: '',
    timeFilter: 'flexible',
    location: JSON.parse(localStorage.getItem('location')) || { lat: 40.4168, lng: -3.7038 }, // Valores por defecto para Madrid
    radius: 300,
    terrain: '',
    experience: '',
    ticketType: ''
  });

  const [municipality, setMunicipality] = useState(localStorage.getItem('municipality') || 'Madrid');
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async (currentFilters) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`, {
        params: {
          lat: currentFilters.location.lat,
          lng: currentFilters.location.lng,
          radius: currentFilters.radius,
          eventTypes: currentFilters.typology,
          timeFilter: currentFilters.timeFilter,
          terrain: currentFilters.terrain,
          experience: currentFilters.experience,
          ticketType: currentFilters.ticketType,
        }
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Primera llamada a fetchEvents con ubicación de Madrid o la guardada en localStorage
  useEffect(() => {
    fetchEvents(filters);
  }, []);

  // Solicitar ubicación del usuario y realizar una nueva búsqueda
  useEffect(() => {
    if (!localStorage.getItem('location')) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          localStorage.setItem('location', JSON.stringify(userLocation));

          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.lat},${userLocation.lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            const address = response.data.results[0];
            const userMunicipality = address.address_components.find(
              component => component.types.includes('locality')
            )?.long_name || 'Unknown';
            localStorage.setItem('municipality', userMunicipality);

            setFilters(prevFilters => ({
              ...prevFilters,
              location: userLocation,
            }));
            setMunicipality(userMunicipality);
          } catch (error) {
            console.error('Error obteniendo el municipio:', error);
          }
        },
        (error) => {
          console.error('Error obteniendo la ubicación del usuario', error);
        }
      );
    }
  }, []);

  // Actualizar eventos al cambiar los filtros
  useEffect(() => {
    fetchEvents(filters);
  }, [filters]);

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
            <EventCard key={event._id} event={event} />
          ))
        )}
      </EventsGrid>
    </>
  );
};


export default EventList;



//   const [municipality, setMunicipality] = useState(localStorage.getItem('municipality') || 'Obteniendo tu ubicación...');
//   const [isLoading, setIsLoading] = useState(false);

//   // useEffect para obtener ubicación y municipio
//   useEffect(() => {
//     const storedLocation = localStorage.getItem('location');
//     const storedMunicipality = localStorage.getItem('municipality');

//     if (storedLocation && storedMunicipality) {
//       const parsedLocation = JSON.parse(storedLocation);
//       setFilters(prevFilters => ({
//         ...prevFilters,
//         location: parsedLocation,
//       }));
//       setMunicipality(storedMunicipality);
//     } else {
//       // Obtener la ubicación si no está en localStorage
//       navigator.geolocation.getCurrentPosition(
//         async ({ coords }) => {
//           const { latitude, longitude } = coords;
//           try {
//             const response = await axios.get(
//               `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
//             );
//             const address = response.data.results[0];
//             const municipality = address.address_components.find(
//               component => component.types.includes('locality')
//             )?.long_name || 'Madrid';

//             const newLocation = { lat: latitude, lng: longitude };
//             localStorage.setItem('location', JSON.stringify(newLocation));
//             localStorage.setItem('municipality', municipality);

//             setFilters(prevFilters => ({
//               ...prevFilters,
//               location: newLocation,
//             }));
//             setMunicipality(municipality);
//           } catch (error) {
//             console.error('Error obteniendo el municipio:', error);
//           }
//         },
//         error => {
//           console.error('Error obteniendo la ubicación:', error);
//           // Establecer municipio y ubicación por defecto en caso de error
//           setMunicipality('Madrid');
//           const defaultLocation = { lat: 40.4168, lng: -3.7038 };
//           localStorage.setItem('municipality', 'Madrid');
//           localStorage.setItem('location', JSON.stringify(defaultLocation));
//           setFilters(prevFilters => ({
//             ...prevFilters,
//             location: defaultLocation,
//           }));
//         }
//       );
//     }
//   }, []);


//   // useEffect para buscar eventos
//   useEffect(() => {
//     const fetchEvents = async () => {
//       setIsLoading(true);
//       try {
//         const { location, radius, typology, timeFilter, terrain, experience, ticketType } = filters;
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`, {
//           params: {
//             lat: location.lat,
//             lng: location.lng,
//             radius,
//             eventTypes: typology,
//             timeFilter,
//             terrain,
//             experience,
//             ticketType
//           }
//         });
//         setEvents(response.data.events);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [filters]);

//   return (
//     <div>
//       <FilterForm filters={filters} setFilters={setFilters} municipality={municipality} />
//       {isLoading ? (
//         <p>Cargando eventos...</p>
//       ) : (
//         <EventsGrid>
//           {events.map(event => (
//             <EventCard key={event._id} event={event} />
//           ))}
//         </EventsGrid>
//       )}
//     </div>
//   );
// };

//  export default EventList;


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