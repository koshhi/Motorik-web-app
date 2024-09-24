import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { getEventTypeIcon } from '../utils';
import MainNavbar from '../components/Navbar/MainNavbar';
import Button from '../components/Button/Button';
import EventFixedAction from '../components/EventFixedAction'
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const { user, loading } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);


  useEffect(() => {
    // Verificamos que el perfil del usuario haya cargado
    if (!loading) {
      const fetchEventDetails = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${id}`);
          setEvent(response.data.event);

          // console.log({ owner: response.data.event.owner });
          // console.log({ viewer: user });

          // Asegurarse de que tanto el evento como el usuario estén definidos
          if (user && response.data.event.owner && response.data.event.owner.id === user.id) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        } catch (error) {
          console.error('Error fetching event details:', error);
        }
      };

      fetchEventDetails();
    }
  }, [id, user, loading]);

  // const handleEnroll = async () => {
  //   try {
  //     const token = localStorage.getItem('authToken');
  //     console.log(token)
  //     if (!token) {
  //       alert('Debes estar autenticado para inscribirte en un evento');
  //       return;
  //     }

  //     // Verificamos si el user está definido
  //     if (!user || !user.id) {
  //       alert('No se ha cargado el perfil del usuario correctamente.');
  //       return;
  //     }

  //     // Verificamos si el usuario tiene vehículos
  //     if (!user.vehicles || user.vehicles.length === 0) {
  //       alert('No tienes vehículos registrados.');
  //       return;
  //     }

  //     // Obtener el userId y vehicleId del usuario (puedes ajustar según cómo lo obtienes)
  //     const userId = user.id;
  //     const vehicleId = user.vehicles[0]._id; // Suponiendo que el primer vehículo es el que usaremos


  //     await axios.post(
  //       `${process.env.REACT_APP_API_URL}/api/events/enroll/${id}`,
  //       { userId, vehicleId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // Después de una inscripción exitosa, obtener los detalles actualizados del evento
  //     const updatedEventResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${id}`);
  //     setEvent(updatedEventResponse.data.event);

  //     alert('Inscripción exitosa');
  //   } catch (error) {
  //     console.error('Error enrolling in event:', error);
  //     alert('Hubo un error al inscribirse en el evento');
  //   }
  // }

  const handleEnroll = () => {
    if (!user || !user.vehicles || user.vehicles.length === 0) {
      alert('No tienes vehículos registrados.');
      return;
    }

    if (user.vehicles.length === 1) {
      // Si solo tiene un vehículo, lo inscribimos directamente
      enroll(user.vehicles[0]._id);
    } else {
      // Si tiene más de un vehículo, abrimos el modal
      setShowModal(true);
    }
  };

  const enroll = async (vehicleId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Debes estar autenticado para inscribirte en un evento');
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/events/enroll/${id}`,
        { userId: user.id, vehicleId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar el evento con los asistentes después de la inscripción
      const updatedEventResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${id}`);
      setEvent(updatedEventResponse.data.event);

      alert('Inscripción exitosa');
    } catch (error) {
      console.error('Error enrolling in event:', error);
      alert('Hubo un error al inscribirse en el evento');
    } finally {
      setShowModal(false);
    }
  };




  if (loading) return <p>Cargando...</p>;
  if (!event) return <p>Evento no encontrado</p>;



  return (
    <>
      <MainNavbar />
      <EventHeader>
        <div className='EventHeaderContainer'>
          <Button $variant="ghost">Atrás</Button>
          <div className='EventHeaderMain'>
            <div className='InnerHeaderLeft'>
              <h1>{event.title}</h1>
              <span>Nuevo</span>
              <span>4 plazas disponibles</span>
            </div>
            <div className='InnerHeaderRight'>
              <Button size="small" $variant="outline" alt="Compartir evento"><img className="Icon" src="/icons/share.svg" alt="share-icon" /></Button>
              {isOwner ? (
                <Button size="small" $variant="outline" alt="Gestionar evento">Gestionar evento</Button>
              ) : (
                <Button onClick={handleEnroll} size="small" $variant="outline" alt="Inscríbete en el evento">Inscríbete</Button>
              )}
            </div>
          </div>
          <Link className='EventOrganizer' to={`/user/${event.owner.id}`}>
            <img className="UserAvatar" src={event.owner.userAvatar} alt="Event organizer" />
            <div className='UserData'>
              <p className='label'>Organizado por</p>
              <p className='username'>{event.owner.name} {event.owner.lastName}</p>
            </div>
          </Link>
        </div>

      </EventHeader>
      <EventBody>
        <div className='GridContainer'>
          <EventContent>
            {event.image ? (
              <img src={event.image} alt={event.title} className="event-image" />
            ) : (
              <div className="placeholder-image">
                <img src={getEventTypeIcon(event.eventType)} alt="empty state icon" className="empty-state-icon" />
              </div>
            )}
            <EventDescription>
              <h2>Detalles</h2>
              <p>{event.description}</p>
            </EventDescription>
            <div className='OrganizerBlock'>
              <h2>Sobre el organizador</h2>
              <EventOrganizerCard>
                <div className='EventOrganizerHeader'>
                  <div className='EventOrganizer'>
                    <img className="OrganizerAvatar" src={event.owner.userAvatar} alt="Event organizer" />
                    <div className='OrganizerData'>
                      <p className='username'>{event.owner.name} {event.owner.lastName}</p>
                      <p className='followers'>22 Seguidores</p>
                    </div>
                  </div>
                  <div className='OrganizerActions'>
                    <Button size="small" $variant="ghost">Contactar</Button>
                    <Button size="small" $variant="outline">Seguir</Button>
                  </div>
                </div>
                <p className='OrganizerDescription'>
                  {event.owner.description}
                </p>
              </EventOrganizerCard>
            </div>
          </EventContent>
          <EventSummary>
            <DateAndLocation>
              <div className='DateRow'>
                <div className="DateContainer">
                  <div className="MonthDate">
                    <p>{event.monthDate}</p>
                  </div>
                  <div className="DayDate">
                    <p>{event.dayDate}</p>
                  </div>
                </div>
                <p className='LongDate'>{event.partialDateStart}</p>
                <p className='LongDate'>{event.partialDateEnd}</p>

              </div>
              <div className='LocationRow'>
                <div className='LocationContainer'>
                  <img src="/icons/map-location.svg" alt="map-location-icon" />
                </div>
                <div className='LocationAddress'>
                  <p className='Location'>{event.location}</p>
                  <p className='ShortLocation'>{event.shortLocation}</p>
                </div>
              </div>
            </DateAndLocation>
            <Attendees>
              <p className='Heading'>Asistentes <span className='AttendeeCounter'>{event.attendeesCount}</span></p>
              <ul className='AttendeesList'>
                {event.attendees.map((attendee, index) => (
                  <li key={index} className='Attendee'>
                    <div className='Images'>
                      <img className='AttendeeImg' src={attendee.userId.userAvatar} alt="attendee avatar" />
                      <img className='VehicleImg' src={attendee.vehicleId.image} alt="attendee avatar" />
                    </div>
                    <div className='Info'>
                      <p className='AttendeeName'>
                        {attendee.userId.name} {attendee.userId.lastName}
                      </p>
                      <p className='AttendeeVehicle'>
                        {attendee.vehicleId.brand} {attendee.vehicleId.model}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Attendees>
            <p>Tipo: {event.eventType}</p>
            <p>Terreno: {event.terrain}</p>
            <p>Capacity: {event.capacity}</p>
            <p>Experience: {event.experience}</p>
            <p>From {event.startDate} to {event.endDate}</p>
          </EventSummary>
        </div>
        {showModal && (
          <div className='modalWrapper'>
            <Modal onClose={() => setShowModal(false)}>
              <div className='Heading'>
                <h3>Indica que moto usaras:</h3>
                <p>Al inscribir tu moto en el evento haces mas fácil que otras personas se inscriban en el evento.</p>
              </div>
              <ul className='VehicleList'>
                {user.vehicles.map((vehicle) => (
                  <li key={vehicle._id} className='Vehicle' onClick={() => enroll(vehicle._id)}>
                    <div className='VehicleContent'>
                      <img src={vehicle.image} className='VehicleImage' alt={vehicle.brand + vehicle.model} />
                      <div className='VehicleData'>
                        <p className='Brand'>{vehicle.brand} </p>
                        <div className='Name'>
                          <p className='Subtitle'>{vehicle.model}</p>
                          {vehicle.nickname.length > 0 && (
                            <p className='Subtitle'> - {vehicle.nickname}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className='Label'>Seleccionar</p>
                  </li>
                ))}
              </ul>
            </Modal>
            <div className='modalOverlay'></div>
          </div>
        )}
      </EventBody>
      <EventFixedAction
        eventName={event.title}
        eventDate={event.longDate}
        availableSeats="4"
        price={event.ticket.price}
      />
    </>
  );
};

export default EventDetail;


const EventHeader = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultSubtle};

  .EventHeaderContainer {
    width: 100%;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
    padding-bottom: ${({ theme }) => theme.sizing.md};
    gap: ${({ theme }) => theme.sizing.xs};

    .EventHeaderMain {
      display: flex;
      align-items: center;
      gap: var(--Spacing-md, 24px);
      align-self: stretch;

      .InnerHeaderLeft {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: ${({ theme }) => theme.sizing.sm};

        h1 {
          margin: 0px;
        }
      }

      .InnerHeaderRight {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: ${({ theme }) => theme.sizing.xs};
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
  }
`;

const EventBody = styled.section`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.sizing.lg};
  padding-bottom: 24rem;

  .GridContainer {
    width: 100%;
    max-width: 1400px;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: ${({ theme }) => theme.sizing.lg};
    grid-row-gap: 0px;
    padding: 0px ${({ theme }) => theme.sizing.md};

  }

  .modalWrapper {
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
  }
`;

const Modal = styled.div`
  display: flex;
  padding: var(--Spacing-md, 24px);
  flex-direction: column;
  align-items: flex-start;
  gap: var(--Spacing-md, 24px);
  background-color: ${({ theme }) => theme.fill.defaultMain};
  border-radius: 8px;
  z-index: 1001;

  .Heading {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.sizing.xs};

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

    p {
      color: ${({ theme }) => theme.colors.defaultWeak}; 
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;

      /* Body/Body 1/Regular */
      font-family: "Mona Sans";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; /* 24px */
    }
  }

  .VehicleList {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;

    .Vehicle {
      cursor: pointer;
      border-radius: var(--Spacing-xs, 8px);
      border: 1px solid ${({ theme }) => theme.border.defaultWeak}; 
      background-color: ${({ theme }) => theme.fill.defaultMain}; 
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-right: 16px;

      &:hover {
        border: 1px solid ${({ theme }) => theme.border.brandMain}; 
        box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.border.brandMain}; 
      }

      .Label {
        color: ${({ theme }) => theme.colors.brandMain}; 
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;

        /* Body/Body 2/Semibold */
        font-family: "Mona Sans";
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 19.6px */
      }

      .VehicleContent {
        display: flex;
        padding: var(--Spacing-xs, 8px) var(--Spacing-sm, 16px) var(--Spacing-xs, 8px) var(--Spacing-xs, 8px);
        align-items: center;
        gap: 16px;
        align-self: stretch;

        .VehicleData {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .Brand {
            color: var(--text-icon-default-main, #292929);
            font-variant-numeric: lining-nums tabular-nums;
            font-feature-settings: 'ss01' on;

            /* Body/Body 2/Medium */
            font-family: "Mona Sans";
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 140%; /* 19.6px */
          }

          .Name {
            display: inline-flex;
            gap: ${({ theme }) => theme.sizing.xxs}; 

            .Subtitle {
              color: var(--text-icon-default-main, #292929);
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
        }

        .VehicleImage {
          width: 80px;
          height: 80px;
          border-radius: var(--Spacing-xxs, 4px);
        }
      }
    }
  }
`;

const EventContent = styled.div`
  grid-area: 1 / 1 / 2 / 8;
  width: 100%;
  aspect-ratio: 4/3;
  height: auto;

  .event-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radius.sm};
  }

  .placeholder-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.fill.defaultStrong};
    border-radius: ${({ theme }) => theme.radius.sm};
  }

  .OrganizerBlock {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    
    h2 {
      color: var(--text-icon-default-main, #292929);
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;

      /* Titles/Desktop/Title 4/Semibold */
      font-family: "Mona Sans";
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 28px */
    }
  }
`;

const EventDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding-top: 16px;
  padding-bottom: 40px;
  align-self: stretch;
`;

const EventOrganizerCard = styled.div`
  padding: ${({ theme }) => theme.sizing.md};
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.sizing.md};

  .EventOrganizerHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .EventOrganizer {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: ${({ theme }) => theme.sizing.sm};

      .OrganizerAvatar {
        border-radius: ${({ theme }) => theme.sizing.xs};
        height: 56px;
        width: 56px;
      }

      .OrganizerData{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: ${({ theme }) => theme.sizing.xxs};;

        .followers {
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
    
    .OrganizerActions {
      display: flex;
      flex-direction: row;
      flex-direction: row;
      align-items: flex-start;
      gap: ${({ theme }) => theme.sizing.xs};;
    }
  }

  .OrganizerDescription {
    margin: 0px;
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Regular */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 24px */
  }
`;

const EventSummary = styled.div`
  grid-area: 1 / 8 / 2 / 13;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 40px;
`;

const DateAndLocation = styled.div`
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background-color: ${({ theme }) => theme.fill.defaultMain};

  .DateRow {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    gap: ${({ theme }) => theme.sizing.sm};
    padding: ${({ theme }) => theme.sizing.sm};

    .DateContainer {
      display: flex;
      flex-shrink: 0;
      width: 48px;
      flex-direction: column;
      align-items: stretch;
      border-radius: ${({ theme }) => theme.radius.xs};
      background: ${({ theme }) => theme.fill.defaultSubtle};

      overflow: hidden;

      .MonthDate {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 24px;
        background-color: #EFEFEF;

        p {
          color: var(--text-icon-default-main, #292929);
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;
          font-family: "Mona Sans";
          font-size: 10px;
          font-style: normal;
          font-weight: 600;
          line-height: 100%;
          margin: 0px;
          text-transform: uppercase;
        } 
      }

      .DayDate {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 28px;

        p {
          color: var(--text-icon-default-main, #292929);
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;
          font-family: "Mona Sans";
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: 100%;
          margin: 0px;
        }
      }
    }

    .LongDate {
      color: ${({ theme }) => theme.colors.defaultStrong};
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on, 'ss04' on;

      /* Titles/Desktop/Title 5/Semibold */
      font-family: "Mona Sans";
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 25.2px */
      margin: 0px;
    }
  }

  .LocationRow {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    gap: ${({ theme }) => theme.sizing.sm};
    padding: ${({ theme }) => theme.sizing.sm};

    .LocationContainer {
      display: flex;
      flex-shrink: 0;
      width: 48px;
      height: 52px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: ${({ theme }) => theme.fill.defaultSubtle};
      border-radius: ${({ theme }) => theme.radius.xs};

      img {
        height: 24px;
      }
    }

    .LocationAddress {

      .ShortLocation {
        color: var(--text-icon-default-weak, #656565);
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;

        /* Body/Body 2/Medium */
        font-family: "Mona Sans";
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 140%; /* 19.6px */
        margin: 0px;
      }

      .Location {
        color: ${({ theme }) => theme.colors.defaultStrong};
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on, 'ss04' on;

        /* Titles/Desktop/Title 5/Semibold */
        font-family: "Mona Sans";
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 25.2px */
        margin: 0px;
      }
    }
  }
`;

const Attendees = styled.div`
  display: flex;
  flex-direction: column;
  align-item: flex-start;
  gap: 16px;

  .AttendeesList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .Heading {
    color: var(--text-icon-default-main, #292929);
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Titles/Desktop/Title 4/Semibold */
    font-family: "Mona Sans";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 28px */
    gap: 8px;
    display: inline-flex;
    align-items: center;

    .AttendeeCounter {
      color: var(--text-icon-brand-main, #F65703);
      text-align: center;
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;

      /* Body/Body 2/Semibold */
      font-family: "Mona Sans";
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 100%;
      padding: 4px 8px;
      min-width: 24px;
      height: 24px;
      border-radius: 48px;
      background: var(--bg-brand-alpha-main-16, rgba(246, 87, 3, 0.16));
    }
  }


  .Attendee {
    width: 146px;
    display: flex;
    padding: 16px 8px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: ${({ theme }) => theme.radius.xs};
    border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
    background-color: ${({ theme }) => theme.fill.defaultMain};

    .Info {
      width: 100%;
    }

    .Images {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .AttendeeImg {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radius.xl};
    border: 1px solid ${({ theme }) => theme.border.defaultMain};
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.16);
    z-index: 2;
  }

  .VehicleImg {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radius.xl};
    z-index: 1;
    margin-left: -8px;
  }
  
  .AttendeeName {
    color: ${({ theme }) => theme.colors.defaultStrong};
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    text-overflow: ellipsis;

    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;


    /* Body/Body 3/Semibold */
    font-family: "Mona Sans";
    font-size: 13px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 19.5px */
  }

  .AttendeeVehicle {
    overflow: hidden;
    color: var(--textIcon-default-medium, rgba(0, 0, 0, 0.50));
    text-align: center;
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    text-overflow: ellipsis;

    /* Caption/Medium */
    font-family: "Mona Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 18px */
  }
`;