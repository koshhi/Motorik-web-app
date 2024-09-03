import React, { useState, useRef, useEffect } from 'react';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import styled from 'styled-components';
import Input from "../components/Input/Input"
import EventTypeTab from './Tab/EventTypeTab';
import { getEventTypeSvgIcon } from '../utils';
import { theme } from '../theme';

const libraries = ['places'];


const FilterForm = ({ filters, setFilters, municipality, setMunicipality }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [address, setAddress] = useState('');
  const [showLocationFields, setShowLocationFields] = useState(false);
  const autocompleteRef = React.useRef(null);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const userLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setFilters(prevFilters => ({
        ...prevFilters,
        location: userLocation
      }));

      // Obtener el nombre del municipio y guardarlo
      const userMunicipality = place.address_components?.[0]?.long_name || 'Unknown';
      setMunicipality(userMunicipality);
      localStorage.setItem('location', JSON.stringify(userLocation));
      localStorage.setItem('municipality', userMunicipality);
    }
  };

  const updateTypologyFilter = (currentTypology, value) => {
    return currentTypology.includes(value)
      ? currentTypology.filter(item => item !== value)
      : [...currentTypology, value];
  };

  function handleFilterChange(type, value) {
    if (type === 'typology') {
      const updatedTypology = updateTypologyFilter(filters.typology, value);
      setFilters(prevFilters => ({
        ...prevFilters,
        typology: updatedTypology
      }));
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [type]: value
      }));
    }
  }


  if (loadError) {
    return <div>Error al cargar Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

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
                  onChange={(e) => handleFilterChange('radius', e.target.value)}
                />
              </LocationDropdown>
            )}
            <TimeFrame value={filters.timeFilter || 'flexible'} onChange={(e) => handleFilterChange('timeFilter', e.target.value)}>
              <option value="flexible">Fecha flexible</option>
              <option value="today">Hoy</option>
              <option value="tomorrow">Mañana</option>
              <option value="this_week">Esta semana</option>
              <option value="this_month">Este mes</option>
            </TimeFrame>
          </div>
        </MainFilters>
        <SecondaryFilters>
          {['Meetup', 'Competition', 'Race', 'Adventure', 'Trip', 'Gathering', 'Course', 'Ride', 'Exhibition'].map((category) => (
            <EventTypeTab
              key={category}
              category={category}
              isActive={filters.typology.includes(category)}
              onClick={() => handleFilterChange('typology', category)}
              icon={getEventTypeSvgIcon(category, filters.typology.includes(category) ? theme.colors.brandMain : theme.colors.defaultSubtle)}
            />
          ))}

          <div>
            <label>Terreno:</label>
            <select value={filters.terrain || ''} onChange={(e) => handleFilterChange('terrain', e.target.value)}>
              <option value="">Todos</option>
              <option value="offroad">Offroad</option>
              <option value="road">Carretera</option>
              <option value="mixed">Mixto</option>
            </select>
          </div>

          <div>
            <label>Experiencia:</label>
            <select value={filters.experience || ''} onChange={(e) => handleFilterChange('experience', e.target.value)}>
              <option value="">Todos</option>
              <option value="none">Ninguno</option>
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>

          <div>
            <label>Ticket:</label>
            <select value={filters.ticketType || ''} onChange={(e) => handleFilterChange('ticketType', e.target.value)}>
              <option value="">Todos</option>
              <option value="free">Gratis</option>
              <option value="paid">De pago</option>
            </select>
          </div>
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
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  padding-bottom: 0px;
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

  // div {
  // gap: 0.5rem;
  //   display: flex;
  //   flex-direction: row;
  //   align-items: center;
  //   justify-content: flex-start;
  //   gap: ${({ theme }) => theme.sizing.xs};

  //   input {
  //     margin: 0px;
  //   }
  // }
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


