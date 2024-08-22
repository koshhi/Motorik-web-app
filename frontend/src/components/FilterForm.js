import React, { useState, useEffect } from 'react'
import { Autocomplete, useLoadScript } from '@react-google-maps/api'

const libraries = ['places']

const FilterForm = ({ filters, setFilters }) => {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Clave de API de Google
    libraries
  });

  const categories = [
    'Quedadas',
    'Competición',
    'Carrera',
    'Aventura',
    'Viaje',
    'Concentraciones',
    'Cursos',
    'Rodadas'
  ]

  const [address, setAddress] = useState('')
  const [municipality, setMunicipality] = useState('') // Guardar el nombre del municipio
  const [showLocationFields, setShowLocationFields] = useState(false) // Controlar la visibilidad del menú desplegable

  const autocompleteRef = React.useRef(null)

  // Obtener la ubicación inicial del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setFilters(prevFilters => ({
            ...prevFilters,
            location: { lat, lng }
          }))
          fetchAddressFromCoordinates(lat, lng)
        },
        (error) => console.error(error)
      )
    }
  }, [])

  // Obtener la dirección y el municipio a partir de las coordenadas
  // Obtener la dirección y el municipio a partir de las coordenadas
  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`)
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address
        setAddress(address)

        // Encontrar el municipio en los componentes de la dirección
        const municipalityComponent = data.results[0].address_components.find(component =>
          component.types.includes('locality')
        )
        if (municipalityComponent) {
          setMunicipality(municipalityComponent.long_name) // Guardar el nombre del municipio
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error)
    }
  }

  // Manejar la selección de una nueva dirección desde el autocompletado
  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace()
    if (place && place.geometry) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()

      setAddress(place.formatted_address)

      // Extraer el nombre del municipio de la nueva dirección seleccionada
      const municipalityComponent = place.address_components.find(component =>
        component.types.includes('locality')
      )
      if (municipalityComponent) {
        setMunicipality(municipalityComponent.long_name)
      }

      setFilters(prevFilters => ({
        ...prevFilters,
        location: { lat, lng }
      }))
    }
  }

  const handleRadiusChange = (e) => {
    setFilters(prevFilters => ({ ...prevFilters, radius: e.target.value }))
  }

  // Manejar el cambio de selección en las categorías
  const handleCategoryToggle = (category) => {
    setFilters(prevFilters => {
      const currentTypologies = prevFilters.typology || []

      // Si la categoría ya está seleccionada, la eliminamos
      if (currentTypologies.includes(category)) {
        return {
          ...prevFilters,
          typology: currentTypologies.filter((t) => t !== category)
        }
      }

      // Si no está seleccionada, la añadimos
      return {
        ...prevFilters,
        typology: [...currentTypologies, category]
      }
    })
  }

  const handleTimeFilterChange = (e) => {
    setFilters(prevFilters => ({ ...prevFilters, timeFilter: e.target.value }))
  }

  if (!isLoaded) return <div>Loading...</div>


  // const handleLocationChange = (e, type) => {
  //   setFilters(prevFilters => ({
  //     ...prevFilters,
  //     location: {
  //       ...prevFilters.location,
  //       [type]: parseFloat(e.target.value)
  //     }
  //   }))
  // }

  // return (
  //   <section className='eventList_filterContainer'>
  //     <form className='event-list_filter-form'>
  //       <div>
  //         <p>Planes cerca de:</p>

  //         {/* Cambiar la ubicación manualmente */}
  //         <div className='location_filter-container'>
  //           <label>Latitud:</label>
  //           <input
  //             type="number"
  //             value={filters.location.lat || ''}
  //             onChange={(e) => handleLocationChange(e, 'lat')}
  //           />
  //           <label>Longitud:</label>
  //           <input
  //             type="number"
  //             value={filters.location.lng || ''}
  //             onChange={(e) => handleLocationChange(e, 'lng')}
  //           />
  //         </div>

  //         {/* Cambiar el radio de búsqueda */}
  //         <div className='radius_filter-container'>
  //           <label>Radio (km):</label>
  //           <input
  //             type="number"
  //             value={filters.radius}
  //             onChange={handleRadiusChange}
  //           />
  //         </div>
  //       </div>
  //       {/* Filtro por categorías */}
  //       <div className='eventType_filter-container'>
  //         <label>Filtrar por categorías:</label>
  //         <div className="eventType_filter">
  //           {categories.map((category) => (
  //             <div key={category} className="category">
  //               <input
  //                 type="checkbox"
  //                 id={category}
  //                 checked={filters.typology && filters.typology.includes(category)}
  //                 onChange={() => handleCategoryToggle(category)}
  //               />
  //               <label htmlFor={category}>{category}</label>
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       {/* Filtro por tiempo */}
  //       <div className='eventDate_filter-container'>
  //         <label>Filtrar por tiempo:</label>
  //         <select value={filters.timeFilter} onChange={handleTimeFilterChange}>
  //           <option value="">Selecciona</option>
  //           <option value="today">Hoy</option>
  //           <option value="tomorrow">Mañana</option>
  //           <option value="this_week">Esta semana</option>
  //           <option value="this_month">Este mes</option>
  //           <option value="flexible">Fecha flexible</option>
  //         </select>
  //       </div>

  //     </form>
  //   </section>

  // )

  return (
    <section className='eventList_filterContainer'>
      <form className='event-list_filter-form'>
        <div className='locationDatefilter-container'>
          <p>Planes cerca de:</p>
          <div className='locationDatefilter' style={{ position: 'relative' }}>
            <button
              type="button"
              className="userLocation"
              onClick={() => setShowLocationFields(!showLocationFields)}
            >
              {municipality ? municipality : 'Obteniendo ubicación...'}
            </button>

            {showLocationFields && (
              <div className='location_dropdown'>
                <label>¿Dónde?</label>
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={handlePlaceSelect}
                  className='location_dropdownWrapper'
                >
                  <input
                    className='location_inputField'
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Escribe una dirección"
                  />
                </Autocomplete>

                <label>Radio (km):</label>
                <input
                  className='location_inputField'
                  type="number"
                  value={filters.radius}
                  onChange={handleRadiusChange}
                />
              </div>
            )}

            {/* Filtro por tiempo */}
            <select
              className="userLocation"
              value={filters.timeFilter}
              onChange={handleTimeFilterChange}>
              <option value="">Selecciona</option>
              <option value="today">Hoy</option>
              <option value="tomorrow">Mañana</option>
              <option value="this_week">Esta semana</option>
              <option value="this_month">Este mes</option>
              <option value="flexible">Fecha flexible</option>
            </select>
          </div>
        </div>


        {/* Filtro por categorías */}
        <div className='eventType_filter-container'>
          <div className="eventType_filter">
            {categories.map((category) => (
              <div key={category} className="category">
                <input
                  type="checkbox"
                  id={category}
                  checked={filters.typology && filters.typology.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
                <label htmlFor={category}>{category}</label>
              </div>
            ))}
          </div>
        </div>
      </form>
    </section>
  )
}

export default FilterForm
