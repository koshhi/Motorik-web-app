import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Autocomplete, useLoadScript } from '@react-google-maps/api'

// Define las bibliotecas fuera del componente para evitar recrear el array
const libraries = ['places']

const CreateEvent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Clave de API de Google
    libraries, // Incluye la biblioteca de Places
    version: 'weekly' // Versión de la API de Google Maps (puedes cambiarla a una versión fija)
  })

  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [location, setLocation] = useState('')
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null }) // Guardar las coordenadas
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [eventType, setEventType] = useState('Quedadas')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!coordinates.lat || !coordinates.lng) {
      setError('No se encontraron coordenadas para la ubicación. Por favor selecciona una ubicación válida.');
      setLoading(false);
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken')
      if (!authToken) {
        return navigate('/login', { state: { message: 'You need to login to create an event.' } })
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, {
        title,
        startDate,
        endDate,
        location,
        locationCoordinates: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat] // Enviar las coordenadas obtenidas
        },
        image,
        description,
        eventType,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.data.success) {
        navigate('/') // Redirigir al home después de crear el evento
      } else {
        setError('Failed to create event. Please try again.')
      }
    } catch (error) {
      console.error(error)
      setError('An error occurred while creating the event.')
    } finally {
      setLoading(false)
    }
  }

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace()
    if (place && place.geometry) {
      setLocation(place.formatted_address)
      setCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      })
    }
  }

  const autocompleteRef = React.useRef(null)

  if (!isLoaded) return <div>Loading...</div>

  return (
    <form className="create_event_form-container" onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" required />
      <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" required />

      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          className="autocomplete-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
      </Autocomplete>

      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="Quedadas">Quedadas</option>
        <option value="Competición">Competición</option>
        <option value="Carrera">Carrera</option>
        <option value="Aventura">Aventura</option>
        <option value="Viaje">Viaje</option>
        <option value="Concentraciones">Concentraciones</option>
        <option value="Cursos">Cursos</option>
        <option value="Rodadas">Rodadas</option>
      </select>
      <button type="submit" disabled={loading}>Create Event</button>
      {error && <p>{error}</p>}
    </form>
  )
}

export default CreateEvent
