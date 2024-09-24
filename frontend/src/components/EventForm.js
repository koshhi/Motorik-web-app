import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
// import axios from 'axios';
import styled from 'styled-components';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { useAuth } from '../context/AuthContext';
import InputText from './Input/InputText';
import Switch from './Switch.js';
import InputTextArea from './Input/InputTextArea';
import { getEventTypeIcon } from '../utils'
import EventTypeModal from './Modal/EventTypeModal';
import EventTerrainModal from './Modal/EventTerrainModal';
import EventCapacityModal from './Modal/EventCapacityModal';
import EventExperienceModal from './Modal/EventExperienceModal';
import EventTicketModal from './Modal/EventTicketModal';
import InputImage from './Input/InputImage';

// Define las bibliotecas fuera del componente para evitar recrear el array
const libraries = ['places'];

const EventForm = forwardRef((props, ref) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    version: 'weekly',
  });

  const { user } = useAuth();
  const autocompleteRef = React.useRef(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('Meetup');
  const [terrain, setTerrain] = useState('offroad');
  const [experience, setExperience] = useState('none');
  const [ticketType, setTicketType] = useState('free');
  const [ticketPrice, setTicketPrice] = useState(0);
  const [capacity, setCapacity] = useState(10);
  const [shortLocation, setShortLocation] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    startDay: '',
    startTime: '',
    endDay: '',
    endTime: '',
    location: '',
    file: '',
    description: ''
  });

  // Estado para fechas y horas
  const [startDay, setStartDay] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDay, setEndDay] = useState(() => new Date().toISOString().split('T')[0]);
  // const [endDay, setEndDay] = useState(startDay);

  const roundTimeToNearestHalfHour = () => {
    const now = new Date();
    const minutes = now.getMinutes();

    // Si los minutos son mayores a 0 pero menores a 30, redondea a las 30.
    // Si son mayores o iguales a 30, redondea a la siguiente hora en punto.
    if (minutes > 0 && minutes <= 30) {
      now.setMinutes(30);
    } else {
      now.setHours(now.getHours() + 1); // Incrementa la hora
      now.setMinutes(0);
    }

    now.setSeconds(0); // Poner segundos a 0
    return now.toTimeString().slice(0, 5); // Devuelve la hora en formato HH:MM
  };

  const [startTime, setStartTime] = useState(roundTimeToNearestHalfHour);

  const adjustEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':');
    const endTime = new Date();
    endTime.setHours(parseInt(hours) + 1); // Incrementar 1 hora
    endTime.setMinutes(parseInt(minutes));
    return endTime.toTimeString().slice(0, 5); // Formato HH:MM
  };

  const [endTime, setEndTime] = useState(() => adjustEndTime(roundTimeToNearestHalfHour()));

  // Estados adicionales
  const [isEndDayChanged, setIsEndDayChanged] = useState(false);
  const [isEndTimeChanged, setIsEndTimeChanged] = useState(false);

  // useEffect para endDay
  useEffect(() => {
    if (!isEndDayChanged) {
      if (endDay !== startDay) {
        setEndDay(startDay);
      }
    } else if (new Date(endDay) < new Date(startDay)) {
      setEndDay(startDay);
      setIsEndDayChanged(false);
    }
  }, [startDay, endDay, isEndDayChanged]);

  // useEffect para endTime
  useEffect(() => {
    if (!isEndTimeChanged) {
      setEndTime(adjustEndTime(startTime));
    } else {
      const startDateTime = new Date(`${startDay}T${startTime}`);
      const endDateTime = new Date(`${endDay}T${endTime}`);

      if (endDateTime <= startDateTime) {
        setEndTime(adjustEndTime(startTime));
        setIsEndTimeChanged(false);
      }
    }
  }, [startTime, startDay, endDay]);

  const validateDates = () => {
    const startDateTime = new Date(`${startDay}T${startTime}`);
    const endDateTime = new Date(`${endDay}T${endTime}`);

    const newErrors = {};

    if (startDateTime >= endDateTime) {
      newErrors.startDay = 'La fecha y hora de inicio no pueden ser posteriores o iguales a la de fin.';
      newErrors.endDay = 'La fecha y hora de fin deben ser posteriores a las de inicio.';
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));

    return Object.keys(newErrors).length === 0;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setLocation(place.formatted_address);

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

      // Verifica si las coordenadas son válidas y asegúrate de que se envíen correctamente
      if (lat && lng) {
        setCoordinates({ lat, lng });
        console.log("Coordinates set:", { lat, lng });
      } else {
        setError('Las coordenadas de la ubicación no se han obtenido correctamente.');
      }
    } else {
      setError('No se pudieron obtener las coordenadas. Intenta de nuevo.');
    }
  };
  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      setLoading(true);
      if (!validateDates()) return null;
      const newErrors = {};

      // Validaciones de campos
      if (!title.trim()) newErrors.title = 'El título es obligatorio';
      if (!startDay) newErrors.startDay = 'La fecha de inicio es obligatoria';
      if (!startTime) newErrors.startTime = 'La hora de inicio es obligatoria';
      if (!endDay) newErrors.endDay = 'La fecha de fin es obligatoria';
      if (!endTime) newErrors.endTime = 'La hora de fin es obligatoria';
      if (!location.trim()) newErrors.location = 'La localización es obligatoria';
      if (!description.trim()) newErrors.description = 'La descripción es obligatoria';
      if (!file) newErrors.file = 'La imagen es obligatoria';
      if (!validateDates()) return null;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // Validar coordenadas
      if (!coordinates.lat || !coordinates.lng) {
        setError('Las coordenadas de la ubicación no son válidas.');
        return null;
      }

      const formData = new FormData();
      formData.append('locationCoordinates', JSON.stringify({
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat]  // Orden correcto: lng, lat
      }));
      formData.append('title', title);
      // formData.append('startDate', startDate);
      // formData.append('endDate', endDate);
      formData.append('startDate', `${startDay}T${startTime}`);
      formData.append('endDate', `${endDay}T${endTime}`);
      formData.append('location', location);
      formData.append('shortLocation', shortLocation);
      formData.append('description', description);
      formData.append('eventType', eventType);
      formData.append('terrain', terrain);
      formData.append('experience', experience);
      // formData.append('ticket', JSON.stringify({ type: ticketType, price: ticketType === 'paid' ? ticketPrice : 0 }));
      // Cambiar la manera en que se pasa el ticket
      formData.append('ticketType', ticketType);
      formData.append('ticketPrice', ticketType === 'paid' ? ticketPrice : 0);
      formData.append('capacity', capacity);

      if (file) formData.append('image', file); // Añadir imagen si existe

      return formData
    }
  }));
  //   const place = autocompleteRef.current.getPlace();
  //   if (place && place.geometry) {
  //     const formattedAddress = place.formatted_address;
  //     setLocation(formattedAddress);

  //     const addressComponents = place.address_components;
  //     let locality = '';
  //     let administrativeArea = '';
  //     let country = '';

  //     addressComponents.forEach(component => {
  //       if (component.types.includes('locality')) {
  //         locality = component.long_name;
  //       }
  //       if (component.types.includes('administrative_area_level_2')) {
  //         administrativeArea = component.long_name;
  //       }
  //       if (component.types.includes('country')) {
  //         country = component.long_name;
  //       }
  //     });

  //     let shortLocation = locality && administrativeArea && locality !== administrativeArea
  //       ? `${locality}, ${administrativeArea}, ${country}`
  //       : `${administrativeArea}, ${country}`;

  //     setShortLocation(shortLocation);

  //     setCoordinates({
  //       lat: place.geometry.location.lat(),
  //       lng: place.geometry.location.lng(),
  //     });
  //   }
  // };

  // const onPlaceChanged = () => {
  //   const place = autocompleteRef.current.getPlace();
  //   if (place && place.geometry) {
  //     const lat = place.geometry.location.lat();
  //     const lng = place.geometry.location.lng();

  //     // Asegúrate de que las coordenadas sean válidas
  //     if (lat && lng) {
  //       setLocation(place.formatted_address);
  //       setCoordinates({ lat, lng });
  //       setShortLocation(`${place.address_components[0].short_name}, ${place.address_components[1].short_name}`);
  //     } else {
  //       setError('Coordenadas inválidas. Por favor selecciona una ubicación válida.');
  //     }
  //   } else {
  //     setError('No se pudieron obtener las coordenadas. Intenta de nuevo.');
  //   }
  // };

  const handleOpenModal = (modalId) => {
    setActiveModal(modalId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <FormContainer>
      <Header>
        <Container>
          <div className='HeaderWrapper'>
            <div className='TitleInputBlock'>
              <InputText className='EventTitle'
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                placeholder="Introduce el título del evento..."
                $variant={errors.title ? 'error' : ''}
                required
              />
              {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
            </div>
            {user && (
              <div className='EventOrganizer'>
                <img className="UserAvatar" src={user.userAvatar} alt="User Avatar" />
                <div className='UserData'>
                  <p className='label'>Organizado por</p>
                  <p className='username'>{user.name} {user.lastName}</p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Header>
      <FormWrapper>
        <div className='Grid'>
          <div className='Details'>
            <Image>
              <div className="ImageContainer">
                {file ? (
                  <div className='EventImageWrapper'>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Event"
                      className="EventImage"
                    />
                    <div className="ImageInputBlock">
                      <input
                        type="file"
                        id="file"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          setFile(selectedFile);
                          if (errors.file) setErrors({ ...errors, file: '' });
                        }}
                        className="inputFile"
                      />
                      <label
                        htmlFor="file"
                        className={errors.file ? 'inputFileLabel error' : 'inputFileLabel'}
                      >
                        <div className='labelContent'>
                          <img src="/icons/upload-file.svg" alt="Subir fichero" />
                          <p>Sube una imagen</p>
                        </div>
                        {errors.file && <ErrorMessage>{errors.file}</ErrorMessage>}
                      </label>                    </div>
                  </div>

                ) : (
                  <div className="EventEmptyImageWrapper">
                    <img
                      src={getEventTypeIcon(eventType)}
                      alt="empty state icon"
                      className="empty-state-icon"
                    />
                    <div className="ImageInputBlock">
                      <input
                        type="file"
                        id="file"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          setFile(selectedFile);
                          if (errors.file) setErrors({ ...errors, file: '' });
                        }}
                        className="inputFile"
                      />
                      <label
                        htmlFor="file"
                        className={errors.file ? 'inputFileLabel error' : 'inputFileLabel'}
                      >
                        <div className='labelContent'>
                          <img src="/icons/upload-file.svg" alt="Subir fichero" />
                          <p>Sube una imagen</p>
                        </div>
                        {errors.file && <ErrorMessage className='error'>{errors.file}</ErrorMessage>}
                      </label>

                    </div>
                  </div>
                )}
              </div>
            </Image>
            <Description>
              <label>Detalles</label>
              <div className='DescriptionInputBlock'>
                <InputTextArea
                  size="large"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  placeholder="Añade detalles a tu evento para que otros usuario puedan saber que de tratará tu evento..."
                  $variant={errors.description ? 'error' : ''}
                  required
                />
                {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
              </div>
            </Description>
          </div>
          <div className="Settings">
            <div className="Date">
              <div className='Heading'><img src="/icons/date.svg" alt="Fecha" />Fecha</div>
              <div className='DateInputTexts'>
                <div className='Row'>
                  <label>Inicio</label>
                  <div className='DateInputBlock'>
                    <div className='ComboBlock'>
                      <InputText size="medium" type="date" value={startDay}
                        onChange={(e) => {
                          setStartDay(e.target.value);
                          if (errors.startDay) setErrors({ ...errors, startDay: '' });
                        }}
                        $variant={errors.startDay ? 'error' : ''}
                        placeholder="Start Day"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <InputText size="medium" type="time" value={startTime}
                        onChange={(e) => {
                          setStartTime(e.target.value);
                          if (errors.startTime) setErrors({ ...errors, startTime: '' });
                        }}
                        $variant={errors.startTime ? 'error' : ''}
                        placeholder="Start Time"
                        required
                      />
                    </div>
                    {errors.startTime && <ErrorMessage>{errors.startTime}</ErrorMessage>}
                    {errors.startDay && <ErrorMessage>{errors.startDay}</ErrorMessage>}
                  </div>
                </div>
                <div className='Row'>
                  <label>Fin</label>
                  <div className='DateInputBlock'>
                    <div className='ComboBlock'>
                      <InputText
                        size="medium"
                        type="date"
                        value={endDay}
                        onChange={(e) => {
                          const newEndDay = e.target.value;
                          setEndDay(newEndDay);
                          setIsEndDayChanged(true);

                          const startDateTime = new Date(`${startDay}T${startTime}`);
                          const endDateTime = new Date(`${newEndDay}T${endTime}`);

                          if (new Date(newEndDay) < new Date(startDay)) {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              endDay: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
                            }));
                          } else if (endDateTime <= startDateTime) {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              endDay: 'La fecha y hora de fin deben ser posteriores a la fecha y hora de inicio.',
                            }));
                          } else {
                            setErrors((prevErrors) => ({ ...prevErrors, endDay: '' }));
                          }
                        }}
                        $variant={errors.endDay ? 'error' : ''}
                        placeholder="End Day"
                        min={startDay}
                        required
                      />
                      <InputText
                        size="medium"
                        type="time"
                        value={endTime}
                        onChange={(e) => {
                          const newEndTime = e.target.value;
                          setEndTime(newEndTime);
                          setIsEndTimeChanged(true);

                          const startDateTime = new Date(`${startDay}T${startTime}`);
                          const endDateTime = new Date(`${endDay}T${newEndTime}`);

                          if (endDateTime <= startDateTime) {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              endTime: 'La fecha y hora de fin deben ser posteriores a la fecha y hora de inicio.',
                            }));
                          } else {
                            setErrors((prevErrors) => ({ ...prevErrors, endTime: '' }));
                          }
                        }}
                        $variant={errors.endTime ? 'error' : ''}
                        placeholder="End Time"
                        required
                      />
                    </div>
                    {errors.endDay && <ErrorMessage>{errors.endDay}</ErrorMessage>}
                    {errors.endTime && <ErrorMessage>{errors.endTime}</ErrorMessage>}
                  </div>
                </div>
              </div>
            </div>
            <div className="Location">
              <div className='Heading'><img src="/icons/location.svg" alt="Fecha" />Localización</div>
              <div className='SearchLocation'>
                <div className='LocationInputBlock'>
                  <img src="/icons/search.svg" alt="search by location" />
                  <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={onPlaceChanged}
                  >
                    <InputText
                      size="large"
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        if (errors.location) setErrors({ ...errors, location: '' });
                      }}
                      placeholder="Introduce localización del evento"
                      $variant={errors.location ? 'error' : ''}
                      required
                    />
                  </Autocomplete>
                  {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
                </div>
              </div>
            </div>
            <Options>
              <div className='Heading'><img src="/icons/options.svg" alt="Fecha" />Opciones del evento</div>
              <div className='OptionsContainer'>
                <Option onClick={() => handleOpenModal('eventType')} >
                  <div className='Title'>
                    <img src="/icons/event-type.svg" alt="Tipo de evento" /> Tipo de evento
                  </div>

                  <button className="OptionSelected">
                    {eventType} <img src="/icons/edit.svg" alt="Editar" />
                  </button>
                </Option>

                {/* Botón para abrir el modal de terreno */}
                <Option onClick={() => handleOpenModal('terrain')} >
                  <div className='Title'>
                    <img src="/icons/terrain.svg" alt="Terreno" /> Terreno
                  </div>

                  <button className="OptionSelected">
                    {terrain} <img src="/icons/edit.svg" alt="Editar" />
                  </button>
                </Option>

                {/* Botón para abrir el modal de experiencia */}
                <Option onClick={() => handleOpenModal('experience')}>
                  <div className='Title'>
                    <img src="/icons/experience.svg" alt="Experiencia" /> Experiencia
                  </div>

                  <button className="OptionSelected">
                    {experience} <img src="/icons/edit.svg" alt="Editar" />
                  </button>
                </Option>

                {/* Botón para abrir el modal de capacidad */}
                <Option onClick={() => handleOpenModal('capacity')}>
                  <div className='Title'>
                    <img src="/icons/capacity.svg" alt="Capacidad" /> Capacidad
                  </div>

                  <button className="OptionSelected">
                    {capacity} <img src="/icons/edit.svg" alt="Editar" />
                  </button>
                </Option>

                {/* Botón para abrir el modal de ticket */}
                <Option onClick={() => handleOpenModal('ticket')}>
                  <div className='Title'>
                    <img src="/icons/ticket.svg" alt="Ticket" /> Ticket
                  </div>

                  <button className="OptionSelected">
                    {ticketPrice === 0 ? 'Gratis' : `${ticketPrice}`}<img src="/icons/edit.svg" alt="Editar" />
                  </button>
                </Option>

                {/* Botón para setear aprovación requerida */}
                <Option style={{ borderBottom: 0 }}>
                  <div className='Title'>
                    <img src="/icons/approval-required.svg" alt="Aprovación requerida" /> Aprovación requerida
                  </div>
                  <Switch
                    value={approvalRequired}
                    onChange={setApprovalRequired}
                  />
                </Option>

                {/* Renderizar los modales condicionalmente en función de activeModal */}
                {activeModal === 'eventType' && (
                  <EventTypeModal
                    eventType={eventType}
                    setEventType={setEventType}
                    onClose={handleCloseModal}
                  />
                )}

                {activeModal === 'terrain' && (
                  <EventTerrainModal
                    terrain={terrain}
                    setTerrain={setTerrain}
                    onClose={handleCloseModal}
                  />
                )}

                {activeModal === 'experience' && (
                  <EventExperienceModal
                    experience={experience}
                    setExperience={setExperience}
                    onClose={handleCloseModal}
                  />
                )}

                {activeModal === 'capacity' && (
                  <EventCapacityModal
                    capacity={capacity}
                    setCapacity={setCapacity}
                    onClose={handleCloseModal}
                  />
                )}

                {activeModal === 'ticket' && (
                  <EventTicketModal
                    ticketType={ticketType}
                    setTicketType={setTicketType}
                    setTicketPrice={setTicketPrice}
                    onClose={handleCloseModal}
                  />
                )}
              </div>
            </Options>
          </div>
        </div>
      </FormWrapper >
      {error && <p>{error}</p>}
    </FormContainer >
  );
});

export default EventForm;



//ddddddddd

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Image = styled.div`
  width: 100%;

  .ImageContainer {
    display: flex;
    justify-content: center;
    align-items: stretch;
    background-color: ${({ theme }) => theme.fill.defaultWeak};
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: ${({ theme }) => theme.radius.sm};

    .EventImageWrapper,
    .EventEmptyImageWrapper {
      position: relative;

      .ImageInputBlock {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;

        .inputFile {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden !important;
          position: absolute;
          z-index: -1;
        }
        .inputFileLabel {
          cursor: pointer;
          color: ${({ theme }) => theme.colors.defaultStrong};
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;
          font-family: "Mona Sans";
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 150%; /* 24px */
          border-radius: ${({ theme }) => theme.radius.sm};
          border: 1px solid transparent;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-direction: column;

          // &:hover {
          //   border-color: ${({ theme }) => theme.border.defaultWeak};
          // }

          .labelContent {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 40px;
            margin-bottom: 40px;
          }
          
          .error {
            position: absolute;
            bottom: 12px;
          }
        }

        .inputFileLabel.error {
          border: 1px solid ${({ theme }) => theme.colors.errorMain};
        
          &:hover {
            outline: 1px solid ${({ theme }) => theme.colors.errorMain};
          }
        }
      }
    }

    .EventEmptyImageWrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .empty-state-icon {
        width: 50px;
        height: 50px;
      }
    }

    .EventImageWrapper {
      transition: all 0.3s;
      &:hover {
        opacity: 80%;
      }
      .EventImage {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: ${({ theme }) => theme.radius.sm};
      }

      .ImageInputBlock{
        .inputFileLabel {
          &:hover {
            border: 1px solid transparent;
          }
          .labelContent {
            background-color: ${({ theme }) => theme.fill.defaultMain};
          }
        }
      }
    }
  }
`;

const Description = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .DescriptionInputBlock {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  textarea {
    min-height: 120px;
  }

  label {
    display: inline-flex;
    gap: 8px;
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Semibold */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px ${({ theme }) => theme.sizing.md};
  max-width: 1400px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 8px;
  background: var(--bg-default-subtle, #FAFAFA);
  padding-top: 68px;

  .HeaderWrapper {
    padding: 32px 0px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: ${({ theme }) => theme.sizing.xs};

    .TitleInputBlock {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      width: 100%;
    }
  }

  .EventTitle {
    width: 100%;
    padding: 0px;
    border-radius: ${({ theme }) => theme.radius.xs};
    border: 1px solid transparent;
    background: none;
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Titles/Mobile/Title 1/Bold */
    font-family: "Mona Sans";
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 39.2px */

    &::placeholder {
      color: ${({ theme }) => theme.colors.defaultSubtle};
    }
  }

  .EventOrganizer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${({ theme }) => theme.sizing.xs};

    .UserAvatar {
      border-radius: ${({ theme }) => theme.sizing.xs};
      height: 40px;
      width: 40px;
    }

    .UserData{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: ${({ theme }) => theme.sizing.xxs};;

      .label {
        color: ${({ theme }) => theme.colors.defaultWeak};
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        margin: 0px;
        // font-family: "Mona Sans";
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: 100%%;
      }
        
      .username {
        color: ${({ theme }) => theme.colors.defaultMain};
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        margin: 0px;
        // font-family: "Mona Sans";
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 100%;
      }
    }
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .Grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 32px;
    grid-row-gap: 0px;
    max-width: 1400px;
    width: 100%;
    padding: ${({ theme }) => theme.sizing.md};


    .Details {
      grid-area: 1 / 1 / 2 / 8;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 32px;

    }

    .Settings {
      grid-area: 1 / 8 / 2 / 13;
      border-radius: 16px;
      border: 1px solid var(--border-default-weak, #DCDCDC);
      height: fit-content;

      .Date,
      .Location {
        display: flex;
        padding: 24px;
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        border-top: 1px solid var(--border-default-weak, #DCDCDC);

        .Heading {
          display: inline-flex;
          gap: 8px;
          color: ${({ theme }) => theme.colors.defaultStrong};
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;

          /* Body/Body 1/Semibold */
          font-family: "Mona Sans";
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          line-height: 150%; /* 24px */
        }
      }
      
      .Date {
        border-top: none;

        .DateInputTexts {
          display: flex;
          padding: 16px;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 16px;
          align-self: stretch;
          border-radius: 8px;
          border: 1px solid var(--border-default-weak, #DCDCDC);
          background: var(--bg-default-subtle, #FAFAFA);

          .Row {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 16px;
            width: 100%;
      
            .DateInputBlock {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;

              .ComboBlock {
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 100%;

                input {
                  height: 40px;

                  &:first-child {
                    border-top-right-radius: 0px;
                    border-bottom-right-radius: 0px;
                    border-right: 0px;
                    width: 100%;
                  }
                  &:last-child {
                    border-top-left-radius: 0px;
                    border-bottom-left-radius: 0px;
                    width: 100px;
                  }
                }
                

              }
            }

            label {
              width: 64px;
            }
          }
        }
      }

      .Location {
        padding-top: 0px;
        border-top: none;

        .SearchLocation {

          .LocationInputBlock {
            position: relative;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          

            img {
              position: absolute;
              left: 16px;
              top: 16px;
            }

            div {
              width: 100%;
            }
          
            input {
              padding-left: 44px;
              background: var(--bg-default-subtle, #FAFAFA);

              &:hover {
                background: #efefef;
              }
            }
          }


      }
    }
  }
`;

const Options = styled.div`
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  border-top: 1px solid var(--border-default-weak, #DCDCDC);

  .Heading {
    display: inline-flex;
    gap: 8px;
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Semibold */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */
  }

  .OptionsContainer {
    border-radius: 8px;
    border: 1px solid var(--border-default-weak, #DCDCDC);
    background: var(--bg-default-subtle, #FAFAFA);
    overflow: hidden;
  }
`;


const Option = styled.div`
  display: flex;
  padding: 16px;
  align-items: flex-start;
  gap: 8px;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-default-weak, #DCDCDC);
  cursor: pointer;
  transition: all 0.3s;


  &:hover {
    background-color: #EFEFEF;
  }

  .Title,
  .OptionSelected {
    display: inline-flex;
    gap: 8px;
  }

  .Title {
    color: var(--text-icon-default-strong, #464646);
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Semibold */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */
  }
  .OptionSelected {
    color: var(--text-icon-default-subtle, #989898);
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Semibold */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */
    border: 0;
    background-color: unset;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.errorMain};
  font-variant-numeric: lining-nums tabular-nums;
  /* Body 2/Medium */
  font-family: "Satoshi Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;         
`;