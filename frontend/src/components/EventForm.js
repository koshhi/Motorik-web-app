import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import Input from './Input/Input';
import Select from './Select/Select';
import { getEventTypeIcon } from '../utils'


// Define las bibliotecas fuera del componente para evitar recrear el array
const libraries = ['places'];

const EventForm = forwardRef((props, ref) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Clave de API de Google
    libraries, // Incluye la biblioteca de Places
    version: 'weekly', // Versión de la API de Google Maps (puedes cambiarla a una versión fija)
  });

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('Meetup');
  const [terrain, setTerrain] = useState('offroad');
  const [experience, setExperience] = useState('none');
  const [ticketType, setTicketType] = useState('free');
  const [ticketPrice, setTicketPrice] = useState(0);
  const [capacity, setCapacity] = useState(10);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [shortLocation, setShortLocation] = useState('');
  const autocompleteRef = React.useRef(null);


  // useImperativeHandle(ref, () => ({
  //   submitForm: async () => {
  //     setLoading(true);

  //     if (!coordinates.lat || !coordinates.lng) {
  //       setError('No se encontraron coordenadas para la ubicación. Por favor selecciona una ubicación válida.');
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const authToken = localStorage.getItem('authToken');
  //       if (!authToken) {
  //         return navigate('/login', { state: { message: 'You need to login to create an event.' } });
  //       }

  //       const formData = {
  //         title,
  //         startDate,
  //         endDate,
  //         location,
  //         shortLocation,
  //         locationCoordinates: {
  //           type: 'Point',
  //           coordinates: [coordinates.lng, coordinates.lat],
  //         },
  //         image,
  //         description,
  //         eventType,
  //         terrain,
  //         experience,
  //         ticket: {
  //           type: ticketType,
  //           price: ticketType === 'paid' ? ticketPrice : 0,
  //         },
  //         capacity,
  //       };

  //       const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, formData, {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       })

  //       if (response.data.success) {
  //         navigate('/') // Redirigir al home después de crear el evento
  //       } else {
  //         setError('Failed to create event. Please try again.')
  //       }
  //     } catch (error) {
  //       console.error('Error creating event:', error)
  //       setError('An error occurred while creating the event.')
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  // }));

  // useImperativeHandle(ref, () => ({
  //   submitForm: async () => {
  //     const ticket = {
  //       type: ticketType,
  //       price: ticketType === 'paid' ? ticketPrice : 0,
  //     };

  //     const formData = {
  //       title,
  //       startDate,
  //       endDate,
  //       location,
  //       locationCoordinates: {
  //         type: 'Point',
  //         coordinates: [coordinates.lng, coordinates.lat]
  //       },
  //       image,
  //       description,
  //       eventType,
  //       terrain,
  //       experience,
  //       ticket,
  //       capacity,
  //     };

  //     console.log({ formData }); // Asegúrate de que todos los datos estén correctamente configurados

  //     setLoading(true);
  //     try {
  //       const response = await axios.post('/api/events', formData);
  //       if (response.status === 201) {
  //         // Redirigir o manejar la respuesta de éxito
  //       }
  //     } catch (error) {
  //       console.error('Error creating event:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // }));


  // const onPlaceChanged = () => {
  //   const place = autocompleteRef.current.getPlace();
  //   if (place && place.geometry) {
  //     const formattedAddress = place.formatted_address;
  //     setLocation(formattedAddress);

  //     // Proceso para extraer shortLocation
  //     const addressComponents = place.address_components;
  //     let locality = '';  // Localidad o municipio
  //     let administrativeArea = '';  // Provincia o ciudad principal
  //     let country = '';

  //     // Iterar sobre los componentes de la dirección
  //     addressComponents.forEach(component => {
  //       if (component.types.includes('locality')) {
  //         locality = component.long_name;  // Localidad o municipio
  //       }
  //       if (component.types.includes('administrative_area_level_2')) {
  //         administrativeArea = component.long_name;  // Provincia o ciudad
  //       }
  //       if (component.types.includes('country')) {
  //         country = component.long_name;  // País
  //       }
  //     });

  //     // Lógica para asignar shortLocation
  //     // Si localidad y provincia son diferentes, incluir ambas; si son iguales, incluir solo una.
  //     let shortLocation = locality && administrativeArea && locality !== administrativeArea
  //       ? `${locality}, ${administrativeArea}, ${country}`
  //       : `${administrativeArea}, ${country}`;

  //     // Guardar shortLocation en el estado
  //     console.log(shortLocation)
  //     setShortLocation(shortLocation);

  //     // Guardar las coordenadas
  //     setCoordinates({
  //       lat: place.geometry.location.lat(),
  //       lng: place.geometry.location.lng(),
  //     });
  //   }
  // };




  // if (!isLoaded) return <div>Loading...</div>;

  // return (
  //   <FormContainer>
  //     <label>Título del evento</label>
  //     <Input size="medium" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del evento..." required />
  //     <label>Fechas de inicio y fin:</label>
  //     <Input size="medium" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" required />
  //     <Input size="medium" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" required />
  //     <label>Localización:</label>
  //     <Autocomplete
  //       onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
  //       onPlaceChanged={onPlaceChanged}
  //     >
  //       <Input
  //         size="medium"
  //         type="text"
  //         value={location}
  //         onChange={(e) => setLocation(e.target.value)}
  //         placeholder="Location"
  //         required
  //       />
  //     </Autocomplete>
  //     <label>Imagen del evento:</label>
  //     <div className="image-preview-container">
  //       {image ? (
  //         <img src={image} alt="Event" className="event-image-preview" />
  //       ) : (
  //         <div className="empty-state">
  //           <img src={getEventTypeIcon(eventType)} alt="empty state icon" className="empty-state-icon" />
  //         </div>
  //       )}
  //     </div>
  //     <Input size="medium" type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />
  //     <label>Descripción:</label>
  //     <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
  //     <label>Tipo de evento:</label>
  //     <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
  //       <option value="Meetup">Quedada</option>
  //       <option value="Competition">Competición</option>
  //       <option value="Race">Carrera</option>
  //       <option value="Adventure">Aventura</option>
  //       <option value="Trip">Viaje</option>
  //       <option value="Gathering">Concentración</option>
  //       <option value="Course">Curso</option>
  //       <option value="Ride">Rodada</option>
  //       <option value="Exhibition">Exhibición</option>
  //     </Select>
  //     <label>Tipo de Terreno:</label>
  //     <Select value={terrain} onChange={(e) => setTerrain(e.target.value)}>
  //       <option value="offroad">Offroad</option>
  //       <option value="road">Carretera</option>
  //       <option value="mixed">Mixto</option>
  //     </Select>
  //     <label>Nivel de Experiencia:</label>
  //     <Select value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="none">
  //       <option value="none">Ninguno</option>
  //       <option value="beginner">Principiante</option>
  //       <option value="intermediate">Intermedio</option>
  //       <option value="advanced">Avanzado</option>
  //     </Select>

  //     <label>Ticket:</label>
  //     <Select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
  //       <option value="free">Gratis</option>
  //       <option value="paid">De pago</option>
  //     </Select>
  //     {ticketType === 'paid' && (
  //       <>
  //         <label>Precio del Ticket:</label>
  //         <Input size="medium" type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} placeholder="Precio del ticket" required={ticketType === 'paid'} />
  //       </>
  //     )}

  //     <label>Capacidad:</label>
  //     <Input size="medium" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Capacidad" required />

  //     {error && <p>{error}</p>}
  //   </FormContainer>
  // );
  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      setLoading(true);

      if (!coordinates.lat || !coordinates.lng) {
        setError('No se encontraron coordenadas para la ubicación. Por favor selecciona una ubicación válida.');
        setLoading(false);
        return;
      }

      const formData = {
        title,
        startDate,
        endDate,
        location,
        shortLocation,
        locationCoordinates: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat],
        },
        image,
        description,
        eventType,
        terrain,
        experience,
        ticket: {
          type: ticketType,
          price: ticketType === 'paid' ? ticketPrice : 0,
        },
        capacity,
      };

      console.log({ formData }); // Debugging: Verifica el contenido de formData

      try {
        const authToken = localStorage.getItem('authToken');
        console.log(authToken)

        if (!authToken) {
          return navigate('/login', { state: { message: 'You need to login to create an event.' } });
        }
        return formData; // Retorna el formData para que sea manejado en el componente padre
      } catch (error) {
        console.error('Error creating event:', error);
        setError('An error occurred while creating the event.');
        setLoading(false);
      }
    },
  }));

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const formattedAddress = place.formatted_address;
      setLocation(formattedAddress);

      const addressComponents = place.address_components;
      let locality = '';
      let administrativeArea = '';
      let country = '';

      addressComponents.forEach(component => {
        if (component.types.includes('locality')) {
          locality = component.long_name;
        }
        if (component.types.includes('administrative_area_level_2')) {
          administrativeArea = component.long_name;
        }
        if (component.types.includes('country')) {
          country = component.long_name;
        }
      });

      let shortLocation = locality && administrativeArea && locality !== administrativeArea
        ? `${locality}, ${administrativeArea}, ${country}`
        : `${administrativeArea}, ${country}`;

      setShortLocation(shortLocation);

      setCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <FormContainer>
      <label>Título del evento</label>
      <Input size="medium" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del evento..." required />
      <label>Fechas de inicio y fin:</label>
      <Input size="medium" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" required />
      <Input size="medium" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" required />
      <label>Localización:</label>
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={onPlaceChanged}
      >
        <Input
          size="medium"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
      </Autocomplete>
      <label>Imagen del evento:</label>
      <div className="image-preview-container">
        {image ? (
          <img src={image} alt="Event" className="event-image-preview" />
        ) : (
          <div className="empty-state">
            <img src={getEventTypeIcon(eventType)} alt="empty state icon" className="empty-state-icon" />
          </div>
        )}
      </div>
      <Input size="medium" type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />
      <label>Descripción:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <label>Tipo de evento:</label>
      <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="Meetup">Quedada</option>
        <option value="Competition">Competición</option>
        <option value="Race">Carrera</option>
        <option value="Adventure">Aventura</option>
        <option value="Trip">Viaje</option>
        <option value="Gathering">Concentración</option>
        <option value="Course">Curso</option>
        <option value="Ride">Rodada</option>
        <option value="Exhibition">Exhibición</option>
      </Select>
      <label>Tipo de terreno:</label>
      <Select value={terrain} onChange={(e) => setTerrain(e.target.value)}>
        <option value="road">Carretera</option>
        <option value="offroad">Offroad</option>
        <option value="mixed">Mixto</option>
      </Select>
      <label>Nivel de experiencia:</label>
      <Select value={experience} onChange={(e) => setExperience(e.target.value)}>
        <option value="none">Ninguno</option>
        <option value="beginner">Principiante</option>
        <option value="intermediate">Intermedio</option>
        <option value="advanced">Avanzado</option>
      </Select>
      <label>Ticket:</label>
      <Select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
        <option value="free">Gratis</option>
        <option value="paid">De pago</option>
      </Select>
      {ticketType === 'paid' && (
        <Input
          size="medium"
          type="number"
          value={ticketPrice}
          onChange={(e) => setTicketPrice(e.target.value)}
          placeholder="Precio del ticket"
          required
        />
      )}
      <label>Capacidad:</label>
      <Input size="medium" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Número máximo de personas" required />
      {error && <p>{error}</p>}
    </FormContainer>
  );
});

export default EventForm;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  max-width: 400px;
  padding: 24px;

  .autocomplete-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  .image-preview-container {
    display: flex;
    justify-content: center;
    align-items: stretch;
    background-color: ${({ theme }) => theme.fill.defaultWeak};
    width: 100%;
    height: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 10px;
  }

  .event-image-preview {
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
    object-fit: cover;
  }

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .empty-state-icon {
    width: 50px;
    height: 50px;
  }
`;