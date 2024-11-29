import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import InputText from "./Input/InputText";
import EventTypeTab from './Tab/EventTypeTab';
import { getEventTypeSvgIcon } from '../utilities';
import { theme } from '../theme';
import Button from './Button/Button';
import Select from './Select/Select';
import InputRange from './Input/InputRange';
import InputLocation from './Input/InputLocation';
import { getMunicipality } from '../utils/GetMunicipality';
import { Autocomplete } from '@react-google-maps/api';

// const libraries = ['places'];

const FilterForm = ({ filters, setFilters, municipality, setMunicipality }) => {
  const minRadius = 10;
  const maxRadius = 1000;

  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  //   libraries,
  // });

  const [address, setAddress] = useState(filters.location?.address || '');
  const [showLocationFields, setShowLocationFields] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempAddress, setTempAddress] = useState(filters.location?.address || '');
  const [tempRadius, setTempRadius] = useState(filters.radius || maxRadius);
  const autocompleteRef = React.useRef(null);
  const inputRef = useRef(null);
  const locationRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleLocationFields = () => {
    if (!showLocationFields) {
      setTempAddress(address || '');
      console.log(address);
      setTempRadius(filters.radius);
    }
    setShowLocationFields(!showLocationFields);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verifica si el clic es dentro del dropdown o en los botones
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        locationRef.current &&
        !locationRef.current.contains(event.target) &&
        !event.target.closest('#applyButton') &&
        !event.target.closest('#cancelButton')
      ) {
        setShowLocationFields(false);
      }
    };

    if (showLocationFields) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showLocationFields]);

  // Sincronizar 'address' y 'tempAddress' cuando 'filters.location' cambia
  useEffect(() => {
    if (filters.location?.address) {
      setAddress(filters.location.address);
      setTempAddress(filters.location.address);
    }
  }, [filters.location]);

  const handlePlaceSelect = () => {
    console.log('handlePlaceSelect called');
    const place = autocompleteRef.current.getPlace();
    console.log('Selected place:', place);

    if (place.geometry) {
      const selectedAddress = place.formatted_address || '';
      setTempAddress(selectedAddress);
      setAddress(selectedAddress);
      console.log('Temp Address updated to:', selectedAddress);

      // Extraer el municipio usando la función auxiliar
      const userMunicipality = getMunicipality(place.address_components || []);
      console.log('User municipality:', userMunicipality);

      // No actualizamos los filtros aquí; esperar a que el usuario haga clic en "Aplicar"
    } else {
      console.log('No geometry found for the selected place.');
    }
  };

  const updateTypologyFilter = (currentTypology, value) => {
    return currentTypology.includes(value)
      ? currentTypology.filter(item => item !== value)
      : [...currentTypology, value];
  };

  function handleFilterChange(type, value) {
    if (type === 'radius') {
      // Asegurarse de que el valor es un número
      const numericValue = Number(value);
      if (isNaN(numericValue)) return;

      // Limitar el valor entre minRadius y maxRadius
      const radius = Math.min(Math.max(numericValue, minRadius), maxRadius);
      setFilters((prevFilters) => ({
        ...prevFilters,
        [type]: radius,
      }));
    } else if (type === 'typology') {
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

  const handleApply = (e) => {
    e.preventDefault();

    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const userLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: tempAddress,
        };

        const userMunicipality = getMunicipality(place.address_components || []);
        console.log('User municipality:', userMunicipality);

        const validatedRadius = Math.min(Math.max(tempRadius, minRadius), maxRadius);

        setFilters((prevFilters) => ({
          ...prevFilters,
          location: userLocation,
          radius: validatedRadius,
        }));

        setMunicipality(userMunicipality);
        localStorage.setItem('location', JSON.stringify(userLocation));
        localStorage.setItem('municipality', userMunicipality);
        setAddress(tempAddress);
      } else {
        // Si no se selecciona una nueva dirección, solo actualizamos el radio
        const validatedRadius = Math.min(Math.max(tempRadius, minRadius), maxRadius);
        setFilters((prevFilters) => ({
          ...prevFilters,
          radius: validatedRadius,
        }));
        console.log('Solo se actualizó el radio.');
      }
    } else {
      // Si no se usa Autocomplete, simplemente actualizar el radio
      const validatedRadius = Math.min(Math.max(tempRadius, minRadius), maxRadius);
      setFilters((prevFilters) => ({
        ...prevFilters,
        radius: validatedRadius,
      }));
      console.log('Autocomplete no está cargado; solo se actualizó el radio.');
    }

    setShowLocationFields(false);
  };


  const handleCancel = (e) => {
    e.preventDefault();

    // Resetear los estados temporales a los valores actuales de los filtros
    setTempAddress(address);
    setTempRadius(filters.radius);
    setShowLocationFields(false);
  };

  return (
    <Filter>
      <FormContainer>
        <MainFilters>
          <h2>Planes cerca de</h2>
          <div className='filtersContainer'>
            <Location
              type="button"
              onClick={toggleLocationFields}
              ref={locationRef}
            >
              <img src="/icons/location.svg" alt="location icon" />{municipality ? municipality : 'Obteniendo tu ubicación...'}
            </Location>
            {showLocationFields && (
              <LocationDropdown ref={dropdownRef}>
                <div className='LocationAddressBlock'>
                  <label htmlFor="locationInput">¿Dónde?</label>
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                      console.log('Autocomplete loaded:', autocomplete);
                    }}
                    onPlaceChanged={handlePlaceSelect}
                  >
                    <InputLocation
                      ref={inputRef}
                      type="text"
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      placeholder="Escribe una dirección"
                      id="locationInput"
                      size="large"
                      variant="default"
                    />
                  </Autocomplete>
                </div>
                <div className='LocationRadiusBlock'>
                  <label htmlFor="radiusRange">Radio de búsqueda (km):</label>
                  <InputRange
                    min={minRadius}
                    max={maxRadius}
                    step={10}
                    value={tempRadius}
                    onChange={(e) => setTempRadius(Number(e.target.value))}
                    label="Selecciona el radio:"
                  />
                </div>
                <div className='LocationDropdownButtons'>
                  <Button type="button" id="applyButton" onClick={handleApply}>
                    Aplicar
                  </Button>
                  <Button type="button" id="cancelButton" $variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>

              </LocationDropdown>
            )}
            <div className='TimeFrameWrapper'>
              <TimeFrame value={filters.timeFilter || 'flexible'} onChange={(e) => handleFilterChange('timeFilter', e.target.value)}>
                <option value="flexible">Fecha flexible</option>
                <option value="today">Hoy</option>
                <option value="tomorrow">Mañana</option>
                <option value="this_week">Esta semana</option>
                <option value="this_month">Este mes</option>
              </TimeFrame>
            </div>
          </div>
        </MainFilters>
        <SecondaryFilters>
          <div className='TabsFilters'>
            {['Meetup', 'Competition', 'Race', 'Adventure', 'Trip', 'Gathering', 'Course', 'Ride', 'Exhibition'].map((category) => (
              <EventTypeTab
                key={category}
                category={category}
                isActive={filters.typology.includes(category)}
                onClick={() => handleFilterChange('typology', category)}
                icon={getEventTypeSvgIcon(category, filters.typology.includes(category) ? theme.colors.brandMain : theme.colors.defaultSubtle)}
              />
            ))}
          </div>
          <div className='MoreFilters'>
            <Button $variant='outline' type="button" onClick={() => setShowModal(true)}>Otros Filtros<img src="/icons/filter.svg" alt='Filtros' /></Button>

            {showModal && (
              <ModalWrapper>
                <Modal>
                  <div className='Heading'>
                    <h3>Otros Filtros</h3>
                    <Button $variant='ghost' type="button" onClick={() => setShowModal(false)}><img src='/icons/close.svg' alt='Close' /></Button>
                  </div>
                  <div className='ModalContent'>
                    <div>
                      <label>Terreno:</label>
                      <Select value={filters.terrain || ''} onChange={(e) => handleFilterChange('terrain', e.target.value)}>
                        <option value="">Todos</option>
                        <option value="offroad">Offroad</option>
                        <option value="road">Carretera</option>
                        <option value="mixed">Mixto</option>
                      </Select>
                    </div>

                    <div>
                      <label>Experiencia:</label>
                      <Select value={filters.experience || ''} onChange={(e) => handleFilterChange('experience', e.target.value)}>
                        <option value="">Todos</option>
                        <option value="none">Ninguno</option>
                        <option value="beginner">Principiante</option>
                        <option value="intermediate">Intermedio</option>
                        <option value="advanced">Avanzado</option>
                      </Select>
                    </div>

                    <div>
                      <label>Ticket:</label>
                      <Select value={filters.ticketType || ''} onChange={(e) => handleFilterChange('ticketType', e.target.value)}>
                        <option value="">Todos</option>
                        <option value="free">Gratis</option>
                        <option value="paid">De pago</option>
                      </Select>
                    </div>
                  </div>
                </Modal>
                <div className='modalOverlay' />
              </ModalWrapper>
            )}
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
  max-width: 1400px;
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
    box-shadow: 0px 7px 4px -4px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.16);
  }

  .TimeFrameWrapper {
    position: relative;

    &::before {
      content: url(${process.env.REACT_APP_CLIENT_URL}/icons/calendar.svg);
      position: absolute;
      left: 12px; 
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      z-index: 1;
    }
  }
`;

const SecondaryFilters = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.sizing.sm};

  .TabsFilters {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.sizing.sm};
  }
`;

const Location = styled.button`
  // background-color: ${({ theme }) => theme.fill.defauMain};
  color: ${({ theme }) => theme.colors.defaultWeak};
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans", sans-serif;
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 0px 32px 0px 12px;
  height: 44px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;


  -webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
  background: url(${process.env.REACT_APP_CLIENT_URL}/icons/chevron-down.svg) no-repeat center / contain;
	background-size: 24px;
	background-position: calc(100% - 4px);

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
  z-index: 999;

  .LocationDropdownButtons{
    display: flex;
    flex-direction: row;
    gap: ${({ theme }) => theme.sizing.xs};
    justify-content: flex-start;
  }

  .LocationAddressBlock,
  .LocationRadiusBlock {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;


const TimeFrame = styled.select`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  color: ${({ theme }) => theme.colors.defaultWeak};
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans", sans-serif;
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 0px 32px 0px 38px;
  height: 44px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;

  -webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
  background: url(${process.env.REACT_APP_CLIENT_URL}/icons/chevron-down.svg) no-repeat center / contain;
	background-size: 24px;
	background-position: calc(100% - 4px);

  &:hover {
    background-color: #efefef;
  }
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .modalOverlay {
    width: 100%;
    height: 100%;
    background: rgba(26, 26, 26, 0.90);
    backdrop-filter: blur(12px);
    position: absolute;
  }
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.fill.defaultMain};
  border-radius: 8px;
  z-index: 1001;

  .Heading {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 8px 8px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.border.defaultSubtle};

    h3 {
      color: ${({ theme }) => theme.colors.defaultStrong};
      text-align: center;
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on, 'ss04' on;

      /* Titles/Desktop/Title 5/Semibold */
      font-family: "Mona Sans";
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 25.2px */
    }
  }

  .ModalContent {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      label {
        min-width: 120px;
      }
    }
  }
`;