import React, { useState, forwardRef, useImperativeHandle } from 'react';
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
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Clave de API de Google
    libraries, // Incluye la biblioteca de Places
    version: 'weekly', // Versión de la API de Google Maps (puedes cambiarla a una versión fija)
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const autocompleteRef = React.useRef(null);
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
  const [shortLocation, setShortLocation] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);




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
            <InputText className='EventTitle' value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Introduce el título del evento..." required />
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
              <div className="image-preview-container" >
                {image ? (
                  <img src={image} alt="Event" className="event-image-preview" />
                ) : (
                  <div className="empty-state">
                    <img src={getEventTypeIcon(eventType)} alt="empty state icon" className="empty-state-icon" />
                  </div>
                )}
              </div>
              <InputText size="medium" type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" required />
            </Image>
            <Description>
              <label>Detalles</label>
              <InputTextArea size="large" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Añade detalles a tu evento para que otros usuario puedan saber que de tratará tu evento..." required />
            </Description>
          </div>
          <div className="Settings">
            <div className="Date">
              <div className='Heading'><img src="/icons/date.svg" alt="Fecha" />Fecha</div>
              <div className='DateInputTexts'>
                <div className='Row'>
                  <label>Inicio</label>
                  <InputText size="medium" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" required />
                </div>
                <div className='Row'>
                  <label>Fin</label>
                  <InputText size="medium" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" required />
                </div>
              </div>
            </div>
            <div className="Location">
              <div className='Heading'><img src="/icons/location.svg" alt="Fecha" />Localización</div>
              <div className='SearchLocation'>
                <img src="/icons/search.svg" alt="search by location" />
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={onPlaceChanged}
                >
                  <InputText
                    size="large"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Introduce localización del evento"
                    required
                  />
                </Autocomplete>
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

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Image = styled.div`
  width: 100%;

  .image-preview-container {
    display: flex;
    justify-content: center;
    align-items: stretch;
    background-color: ${({ theme }) => theme.fill.defaultWeak};
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: ${({ theme }) => theme.radius.sm};
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

const Description = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
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

    Input {

    }
  }

  .EventTitle {
    width: 100%;
    padding: 0px;
    border-radius: 0px;
    border: none;
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
          position: relative;

          img {
            position: absolute;
            left: 16px;
            top: 16px;
          }
          
          input {
            padding-left: 44px;
            background: var(--bg-default-subtle, #FAFAFA);
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