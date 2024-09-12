import React, { useState, forwardRef, useImperativeHandle } from 'react';
// import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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

// Define las bibliotecas fuera del componente para evitar recrear el array
const libraries = ['places'];

const EventForm = forwardRef((props, ref) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
    version: 'weekly',
  });

  const { user } = useAuth();
  // const navigate = useNavigate();
  const autocompleteRef = React.useRef(null);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [file, setFile] = useState(null); // Para manejar la imagen
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
    startDate: '',
    endDate: '',
    location: '',
    file: '',
    description: ''
  });

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
      const newErrors = {};

      // Validaciones de campos
      if (!title.trim()) newErrors.title = 'El título es obligatorio';
      if (!startDate) newErrors.startDate = 'La fecha de inicio es obligatoria';
      if (!endDate) newErrors.endDate = 'La fecha de fin es obligatoria';
      if (!location.trim()) newErrors.location = 'La localización es obligatoria';
      if (!description.trim()) newErrors.description = 'La descripción es obligatoria';
      if (!file) newErrors.file = 'La imagen es obligatoria';

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
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
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

  // const onPlaceChanged = () => {
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
                variant={errors.title ? 'error' : ''}
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
                        for="file"
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
                        for="file"
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


              {/* <div className="ImageInputBlock">
                <input
                  type="file"
                  id="file"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    setFile(selectedFile);
                    if (errors.file) setErrors({ ...errors, file: '' });
                  }}
                  className={errors.file ? 'error' : ''}
                />
                <label for="file"><img src="/icons/upload-file.svg" alt="Subir fichero" />Sube una imagen</label>
                {errors.file && <ErrorMessage>{errors.file}</ErrorMessage>}
              </div> */}


              {/* <div className="image-preview-container" >
                {image ? (
                  <img src={image} alt="Event" className="event-image-preview" />
                ) : (
                  <div className="empty-state">
                    <img src={getEventTypeIcon(eventType)} alt="empty state icon" className="empty-state-icon" />
                  </div>
                )}
              </div> */}
              {/* <div className='ImageInputBlock'>
                <InputText
                  size="medium"
                  type="text"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    if (errors.image) setErrors({ ...errors, image: '' });
                  }}
                  placeholder="Image URL"
                  variant={errors.image ? 'error' : ''}
                  required
                />
                {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
              </div> */}
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
                  variant={errors.description ? 'error' : ''}
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
                    <InputText
                      size="medium"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (errors.startDate) setErrors({ ...errors, startDate: '' });
                      }}
                      placeholder="Start Date"
                      variant={errors.startDate ? 'error' : ''}
                      required
                    />
                    {errors.startDate && <ErrorMessage>{errors.startDate}</ErrorMessage>}
                  </div>
                </div>
                <div className='Row'>
                  <label>Fin</label>
                  <div className='DateInputBlock'>
                    <InputText
                      size="medium"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (errors.endDate) setErrors({ ...errors, endDate: '' });
                      }}
                      placeholder="End Date"
                      variant={errors.endDate ? 'error' : ''}
                      required
                    />
                    {errors.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
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
                      variant={errors.location ? 'error' : ''}
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