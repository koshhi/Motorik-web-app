import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { getEmptyStateIcon } from '../../utils'
import Input from '../Input/Input';
import Select from '../Select/Select';


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
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null }); // Guardar las coordenadas
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('Quedada');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [shortLocation, setShortLocation] = useState('');
  const autocompleteRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      setLoading(true);

      if (!coordinates.lat || !coordinates.lng) {
        setError('No se encontraron coordenadas para la ubicación. Por favor selecciona una ubicación válida.');
        setLoading(false);
        return;
      }

      try {
        const authToken = localStorage.getItem('authToken');
        console.log({ token: authToken })
        if (!authToken) {
          return navigate('/login', { state: { message: 'You need to login to create an event.' } });
        }

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, {
          title,
          startDate,
          endDate,
          location,
          shortLocation,
          locationCoordinates: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat], // Enviar las coordenadas obtenidas
          },
          image,
          description,
          eventType,
        }, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          navigate('/'); // Redirigir al home después de crear el evento
        } else {
          setError('Failed to create event. Please try again.');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while creating the event.');
      } finally {
        setLoading(false);
      }
    },
  }));

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const formattedAddress = place.formatted_address;
      setLocation(formattedAddress);

      // Proceso para extraer shortLocation
      const addressComponents = place.address_components;
      let locality = '';  // Localidad o municipio
      let administrativeArea = '';  // Provincia o ciudad principal
      let country = '';

      // Iterar sobre los componentes de la dirección
      addressComponents.forEach(component => {
        if (component.types.includes('locality')) {
          locality = component.long_name;  // Localidad o municipio
        }
        if (component.types.includes('administrative_area_level_2')) {
          administrativeArea = component.long_name;  // Provincia o ciudad
        }
        if (component.types.includes('country')) {
          country = component.long_name;  // País
        }
      });

      // Lógica para asignar shortLocation
      // Si localidad y provincia son diferentes, incluir ambas; si son iguales, incluir solo una.
      let shortLocation = locality && administrativeArea && locality !== administrativeArea
        ? `${locality}, ${administrativeArea}, ${country}`
        : `${administrativeArea}, ${country}`;

      // Guardar shortLocation en el estado
      console.log(shortLocation)
      setShortLocation(shortLocation);

      // Guardar las coordenadas
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
            <img src={getEmptyStateIcon(eventType)} alt="empty state icon" className="empty-state-icon" />
          </div>
        )}
      </div>
      <Input size="medium" type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />
      <label>Descripción:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <label>Tipo de evento:</label>
      <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="Quedada">Quedada</option>
        <option value="Competición">Competición</option>
        <option value="Carrera">Carrera</option>
        <option value="Aventura">Aventura</option>
        <option value="Viaje">Viaje</option>
        <option value="Concentración">Concentración</option>
        <option value="Curso">Curso</option>
        <option value="Rodada">Rodada</option>
        <option value="Exhibición">Exhibición</option>
      </Select>
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
    align-items: center;
    background-color: ${({ theme }) => theme.fill.defaultWeak};
    width: 100%;
    height: 200px; /* Ajusta el tamaño según lo necesites */
    border-radius: 10px;
  }

  .event-image-preview {
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
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