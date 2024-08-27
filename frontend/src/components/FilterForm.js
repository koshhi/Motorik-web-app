import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import Input from './Input/Input'
// Definición de las bibliotecas para Google Maps
const libraries = ['places'];

const FilterForm = ({ filters, setFilters }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const categories = [
    'Quedada',
    'Competición',
    'Carrera',
    'Aventura',
    'Viaje',
    'Concentración',
    'Curso',
    'Rodada',
    'Exhibición',
  ];

  const [address, setAddress] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [showLocationFields, setShowLocationFields] = useState(false);

  const autocompleteRef = React.useRef(null);

  // Obtener la ubicación inicial del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setFilters((prevFilters) => ({
            ...prevFilters,
            location: { lat, lng },
          }));
          fetchAddressFromCoordinates(lat, lng);
        },
        (error) => console.error(error)
      );
    }
  }, []);

  const fetchAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setAddress(address);

        const municipalityComponent = data.results[0].address_components.find(
          (component) => component.types.includes('locality')
        );
        if (municipalityComponent) {
          setMunicipality(municipalityComponent.long_name);
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setAddress(place.formatted_address);

      const municipalityComponent = place.address_components.find((component) =>
        component.types.includes('locality')
      );
      if (municipalityComponent) {
        setMunicipality(municipalityComponent.long_name);
      }

      setFilters((prevFilters) => ({
        ...prevFilters,
        location: { lat, lng },
      }));
    }
  };

  const handleRadiusChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      radius: e.target.value,
    }));
  };

  const handleCategoryToggle = (category) => {
    setFilters((prevFilters) => {
      const currentTypologies = prevFilters.typology || [];

      if (currentTypologies.includes(category)) {
        return {
          ...prevFilters,
          typology: currentTypologies.filter((t) => t !== category),
        };
      }

      return {
        ...prevFilters,
        typology: [...currentTypologies, category],
      };
    });
  };

  const handleTimeFilterChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      timeFilter: e.target.value,
    }));
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Filter>
      <FormContainer>
        <MainFilters>
          <h2>Planes cerca de</h2>
          <div className='filtersContainer'>
            <Location
              type="button"
              onClick={() => setShowLocationFields(!showLocationFields)}
            >
              {municipality ? municipality : 'Obteniendo tu ubicación...'}
            </Location>

            {showLocationFields && (
              <LocationDropdown>
                <label>¿Dónde?</label>
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={handlePlaceSelect}
                >
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Escribe una dirección"
                  />
                </Autocomplete>

                <label>Radio (km):</label>
                <Input
                  type="number"
                  value={filters.radius}
                  onChange={handleRadiusChange}
                />
              </LocationDropdown>
            )}

            <TimeFrame value={filters.timeFilter} onChange={handleTimeFilterChange}>
              {/* <option value="">Selecciona</option> */}
              <option value="today">Hoy</option>
              <option value="tomorrow">Mañana</option>
              <option value="this_week">Esta semana</option>
              <option value="this_month">Este mes</option>
              <option value="flexible">Fecha flexible</option>
            </TimeFrame>
          </div>
        </MainFilters>
        <SecondaryFilters>
          {categories.map((category) => (
            <div key={category}>
              <input
                type="checkbox"
                id={category}
                checked={filters.typology && filters.typology.includes(category)}
                onChange={() => handleCategoryToggle(category)}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
        </SecondaryFilters>
      </FormContainer>
    </Filter>
  );
};

export default FilterForm;


//Estilos del componente

const Filter = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  width: 100%;
  max-width: 1248px;
  gap: ${({ theme }) => theme.sizing.md};
`;

const MainFilters = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};

  h2 {
    margin: unset;
    color: ${({ theme }) => theme.colors.defaultMain};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    font-family: "Mona Sans";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 100%;
  }

  .filtersContainer {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${({ theme }) => theme.sizing.xxs};
    gap: ${({ theme }) => theme.sizing.xs};
    border-radius: ${({ theme }) => theme.sizing.sm};
    background-color: ${({ theme }) => theme.fill.defaultMain};
    box-shadow: 0px 7px 4px -4px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.16);}
`;

const SecondaryFilters = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};

  div {
  gap: 0.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${({ theme }) => theme.sizing.xs};

    input {
      margin: 0px;
    }
  }
`;

const Location = styled.button`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  color: ${({ theme }) => theme.colors.defaultMain};
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans", sans-serif;
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 12px;
  height: 44px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.fill.defaultWeak};
  }
`;

const LocationDropdown = styled.div`
  position: absolute;
  top: 64px;
  left: 0;
  width: 440px;
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08), 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
  z-index: 1;
`;


const TimeFrame = styled.select`
  background-color: #${({ theme }) => theme.fill.defaultMain};
  color: #464646;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans", sans-serif;
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 12px;
  height: 44px;
  cursor: pointer;

  &:hover {
    background-color: #efefef;
  }
`;


