import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AxiosClient from '../api/axiosClient';
import styled from 'styled-components';
import useEvent from '../hooks/useEvent';
import useEnroll from '../hooks/useEnroll';
import { getEventTypeIcon } from '../utilities';
import MainNavbar from '../components/Navbar/MainNavbar';
import Button from '../components/Button/Button';
import EventFixedAction from '../components/EventFixedAction'
import Modal from '../components/Modal/Modal';
import EventMap from '../components/EventMap';
import { toast } from 'react-toastify';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, loading: loadingAuth } = useAuth();
  const { event, isOwner, loadingEvent, error, setEvent } = useEvent(id, user);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userEnrollment, setUserEnrollment] = useState(null);


  const { enroll, loadingEnroll, errorEnroll } = useEnroll(id, user, (updatedEvent) => {
    setEvent(updatedEvent);
    // La notificación de éxito ya está manejada en el hook useEnroll
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (event && user) {
      const enrolled = event.attendees.find(attendee => attendee.userId._id === user.id);
      if (enrolled) {
        setIsEnrolled(true);
        setUserEnrollment(enrolled);
      } else {
        setIsEnrolled(false);
        setUserEnrollment(null);
      }
    }
  }, [event, user]);

  const handleEnroll = () => {
    if (!user || !user.vehicles || user.vehicles.length === 0) {
      toast.error('No tienes vehículos registrados.');
      return;
    }

    if (user.vehicles.length === 1) {
      // Si solo tiene un vehículo, lo inscribimos directamente
      enroll(user.vehicles[0]._id); // Asegúrate de usar el campo correcto (por lo general, _id)
    } else {
      // Si tiene más de un vehículo, abrimos el modal
      setShowModal(true);
    }
  };

  const handleVehicleSelect = (vehicleId) => {
    enroll(vehicleId);
    setShowModal(false);
  };

  if (loadingAuth || loadingEvent) return <p>Cargando...</p>;
  if (error || !event) return <p>Evento no encontrado</p>;

  // Verificar si las coordenadas existen y son válidas
  const hasValidCoordinates =
    event.locationCoordinates &&
    Array.isArray(event.locationCoordinates.coordinates) &&
    event.locationCoordinates.coordinates.length === 2 &&
    typeof event.locationCoordinates.coordinates[0] === 'number' &&
    typeof event.locationCoordinates.coordinates[1] === 'number';

  // Extraer lat y lng correctamente
  const [lng, lat] = hasValidCoordinates ? event.locationCoordinates.coordinates : [undefined, undefined];


  return (
    <>
      <MainNavbar />
      <EventHeader>
        <div className='EventHeaderContainer'>
          <Button $variant="ghost" onClick={() => navigate(-1)}><img src="/icons/chevron-left.svg" alt="back-icon" />Atrás</Button>
          <div className='EventHeaderMain'>
            <div className='InnerHeaderLeft'>
              <h1 className='EventTitle'>{event.title}</h1>
              <div className='HeaderTagWrapper'>
                <p className='HeaderTag'>{event.availableSeats} plazas</p>
                <p className='HeaderTag'>{event.eventType}</p>
                <p className='HeaderTag'>{event.terrain}</p>
              </div>
              <p></p>
            </div>
            <div className='InnerHeaderRight'>
              <Button size="small" $variant="outline" alt="Compartir evento"><img className="Icon" src="/icons/share.svg" alt="share-icon" /></Button>
              {isOwner ? (
                <Link to={`/events/manage/${event.id}`}>
                  <Button size="small" $variant="outline" aria-label="Gestionar evento">
                    Gestionar evento
                  </Button>
                </Link>
              ) : (
                isEnrolled ? (
                  <Link to={`/events/${event.id}/enrollment-details`}>
                    <Button size="small" $variant="primary" aria-label="Ver detalles de inscripción">
                      Ver mi inscripción
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    size="small"
                    aria-label="Inscríbete en el evento"
                    disabled={event.availableSeats <= 0 || loadingEnroll}
                  >
                    {loadingEnroll ? 'Inscribiendo...' : 'Inscríbete'}
                  </Button>
                )
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
            {/* <EventTags>
              <h3>Etiquetas</h3>
              <p className='Tag'>Tipo: {event.eventType}</p>
              <p className='Tag'>Terreno: {event.terrain}</p>
              <p className='Tag'>Experience: {event.experience}</p>
            </EventTags> */}
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
              <EventMap lat={lat} lng={lng} maxHeight="200px" mobileHeight="120px" borderRadius="0px" />

            </DateAndLocation>
            <Attendees>
              <div className='AttendeeCancel'>
                <p>¿No puedes asistir? </p>
                <Button $variant="ghost" >Cancelar incripción <img src="/icons/arrow-right.svg" alt="new window icon" /></Button>
              </div>
              <p className='Heading'>Asistentes <span className='AttendeeCounter'>{event.attendeesCount}</span></p>
              <ul className='AttendeesList'>
                <li className='Attendee'>
                  <div className='Images'>
                    <img
                      className="AttendeeImg"
                      src={event.owner.userAvatar}
                      alt="Organizador"
                    />
                    <img
                      className='VehicleImg'
                      src={event.owner.userAvatar}
                      alt="Vehiculo Organizador" />
                  </div>
                  <div className='Info'>
                    <p className='AttendeeName'>
                      {event.owner.name} {event.owner.lastName}
                    </p>
                    <p className='AttendeeVehicle'>
                      Organizer's Bike
                    </p>
                  </div>
                  <div className='OrganizerBadge'>
                    <img src="/icons/organizer-helmet.svg" alt="Organizer badge" />
                    Organizador
                  </div>
                </li>

                {event.attendees.map((attendee) => (
                  <li key={attendee._id || `${attendee.userId?.id}-${attendee.vehicleId?.id}`} className='Attendee'>
                    <div className='Images'>
                      <img
                        className="AttendeeImg"
                        src={attendee.userId?.userAvatar || '/default-avatar.png'}
                        alt={`${attendee.userId?.name || 'Asistente'} ${attendee.userId?.lastName || ''}`}
                      />
                      <img
                        className='VehicleImg'
                        src={attendee.vehicleId?.image || '/default-vehicle.png'}
                        alt={`${attendee.vehicleId?.brand || 'Vehículo'} ${attendee.vehicleId?.model || ''}`}
                      />
                    </div>
                    <div className='Info'>
                      <p className='AttendeeName'>
                        {attendee.userId?.name || 'Nombre'} {attendee.userId?.lastName || 'Apellido'}
                      </p>
                      <p className='AttendeeVehicle'>
                        {attendee.vehicleId?.brand || 'Marca'} {attendee.vehicleId?.model || 'Modelo'}
                      </p>
                    </div>
                  </li>
                ))}

              </ul>
            </Attendees>
          </EventSummary>
        </div>
        {/* {showModal && (
          <div className='modalWrapper'>
            <Modal onClose={() => setShowModal(false)}>
              <div className='Heading'>
                <h3>Indica que moto usaras:</h3>
                <p>Al inscribir tu moto en el evento haces mas fácil que otras personas se inscriban en el evento.</p>
              </div>
              <ul className='VehicleList'>
                {user.vehicles.map((vehicle) => (
                  <li key={vehicle.id} className='Vehicle' onClick={() => enroll(vehicle.id)}>
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
        )} */}
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <ModalHeading>
              <h3>Indica qué moto usarás:</h3>
              <p>Al inscribir tu moto en el evento haces más fácil que otras personas se inscriban en el evento.</p>
            </ModalHeading>
            <VehicleList>
              {user.vehicles.map((vehicle) => (
                <li key={vehicle._id} className='Vehicle' onClick={() => handleVehicleSelect(vehicle._id)}>
                  <div className='VehicleContent'>
                    <img src={vehicle.image} className='VehicleImage' alt={`${vehicle.brand} ${vehicle.model}`} />
                    <div className='VehicleData'>
                      <p className='Brand'>{vehicle.brand}</p>
                      <div className='Name'>
                        <p className='Subtitle'>{vehicle.model}</p>
                        {vehicle.nickname && <p className='Subtitle'> - {vehicle.nickname}</p>}
                      </div>
                    </div>
                  </div>
                  <p className='Label'>Seleccionar</p>
                </li>
              ))}
            </VehicleList>
            {errorEnroll && <ErrorMessage>{errorEnroll}</ErrorMessage>}
          </Modal>
        )}
      </EventBody>
      <EventFixedAction
        eventName={event.title}
        eventDate={event.longDate}
        availableSeats={event.availableSeats}
        price={event.ticket?.price || 0} // Asegúrate de que `ticket` existe
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

        .EventTitle {
          margin: 0px;
          color: var(--text-icon-default-main, #292929);
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;

          /* Titles/Mobile/Title 1/Bold */
          font-family: "Mona Sans";
          font-size: 28px;
          font-style: normal;
          font-weight: 700;
          line-height: 140%; /* 39.2px */
        }
        .HeaderTagWrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: ${({ theme }) => theme.sizing.xs};

          .HeaderTag {
            display: flex;
            min-height: 24px;
            padding: ${({ theme }) => theme.sizing.xxs} ${({ theme }) => theme.sizing.xs};
            justify-content: center;
            align-items: center;
            border-radius: var(--Spacing-md, 24px);
            background: var(--bg-default-main, #FFF);
            border: 1px solid var(--border-default-weak, #DCDCDC);

            // box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
            color: var(--text-icon-default-main, #292929);
            font-family: "Mona Sans";
            font-size: 10px;
            font-style: normal;
            font-weight: 600;
            line-height: 100%; /* 10px */
            letter-spacing: 1.2px;
            text-transform: uppercase;
          }
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

  // .modalWrapper {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   width: 100vw;
  //   height: 100vh;
  //   z-index: 1000;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   justify-content: center;

  //   .modalOverlay {
  //     width: 100%;
  //     height: 100%;
  //     background: rgba(26, 26, 26, 0.90);
  //     backdrop-filter: blur(12px);
  //     position: absolute;
  //   }
  // }
`;

// const Modal = styled.div`
//   display: flex;
//   padding: var(--Spacing-md, 24px);
//   flex-direction: column;
//   align-items: flex-start;
//   gap: var(--Spacing-md, 24px);
//   background-color: ${({ theme }) => theme.fill.defaultMain};
//   border-radius: 8px;
//   z-index: 1001;

//   .Heading {
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     gap: ${({ theme }) => theme.sizing.xs};

//     h3 {
//       color: ${({ theme }) => theme.colors.defaultStrong};
//       text-align: center;
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on, 'ss04' on;

//       /* Titles/Desktop/Title 5/Semibold */
//       font-family: "Mona Sans";
//       font-size: 18px;
//       font-style: normal;
//       font-weight: 600;
//       line-height: 140%; /* 25.2px */
//     }

//     p {
//       color: ${({ theme }) => theme.colors.defaultWeak}; 
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on;

//       /* Body/Body 1/Regular */
//       font-family: "Mona Sans";
//       font-size: 16px;
//       font-style: normal;
//       font-weight: 400;
//       line-height: 150%; /* 24px */
//     }
//   }

//   .VehicleList {
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     gap: 8px;
//     align-self: stretch;

//     .Vehicle {
//       cursor: pointer;
//       border-radius: var(--Spacing-xs, 8px);
//       border: 1px solid ${({ theme }) => theme.border.defaultWeak}; 
//       background-color: ${({ theme }) => theme.fill.defaultMain}; 
//       width: 100%;
//       display: flex;
//       flex-direction: row;
//       align-items: center;
//       justify-content: space-between;
//       padding-right: 16px;

//       &:hover {
//         border: 1px solid ${({ theme }) => theme.border.brandMain}; 
//         box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.border.brandMain}; 
//       }

//       .Label {
//         color: ${({ theme }) => theme.colors.brandMain}; 
//         font-variant-numeric: lining-nums tabular-nums;
//         font-feature-settings: 'ss01' on;

//         /* Body/Body 2/Semibold */
//         font-family: "Mona Sans";
//         font-size: 14px;
//         font-style: normal;
//         font-weight: 600;
//         line-height: 140%; /* 19.6px */
//       }

//       .VehicleContent {
//         display: flex;
//         padding: var(--Spacing-xs, 8px) var(--Spacing-sm, 16px) var(--Spacing-xs, 8px) var(--Spacing-xs, 8px);
//         align-items: center;
//         gap: 16px;
//         align-self: stretch;

//         .VehicleData {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;

//           .Brand {
//             color: var(--text-icon-default-main, #292929);
//             font-variant-numeric: lining-nums tabular-nums;
//             font-feature-settings: 'ss01' on;

//             /* Body/Body 2/Medium */
//             font-family: "Mona Sans";
//             font-size: 14px;
//             font-style: normal;
//             font-weight: 500;
//             line-height: 140%; /* 19.6px */
//           }

//           .Name {
//             display: inline-flex;
//             gap: ${({ theme }) => theme.sizing.xxs}; 

//             .Subtitle {
//               color: var(--text-icon-default-main, #292929);
//               font-variant-numeric: lining-nums tabular-nums;
//               font-feature-settings: 'ss01' on;

//               /* Body/Body 1/Semibold */
//               font-family: "Mona Sans";
//               font-size: 16px;
//               font-style: normal;
//               font-weight: 600;
//               line-height: 150%; /* 24px */
//             }
//           }
//         }

//         .VehicleImage {
//           width: 80px;
//           height: 80px;
//           border-radius: var(--Spacing-xxs, 4px);
//         }
//       }
//     }
//   }
// `;

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

// const EventTags = styled.div`
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   gap: 8px;

//   .Tag {
//     display: flex;
//     padding: var(--Spacing-xxs, 4px) var(--Spacing-xs, 8px);
//     border-radius: var(--Spacing-xs, 8px);
//     border: 1px solid var(--border-default-weak, #DCDCDC);
//     justify-content: center;
//     align-items: center;
//     gap: var(--Spacing-none, 0px);
//     color: var(--text-icon-default-strong, #464646);
//     font-variant-numeric: lining-nums tabular-nums;
//     font-feature-settings: 'ss01' on;

//     /* Caption/Medium */
//     font-family: "Mona Sans";
//     font-size: 12px;
//     font-style: normal;
//     font-weight: 500;
//     line-height: 150%; /* 18px */
//   }
// `;

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
  overflow: hidden;

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
    align-items: flex-start;
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
  border-radius: 16px;
  border: 1px solid var(--border-default-subtle, #EFEFEF);
  background: var(--bg-default-main, #FFF);
  overflow: hidden;

  .AttendeesList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px;
  }

  .OrganizerBadge {
    display: flex;
    padding: 4px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    background: ${({ theme }) => theme.fill.brandAlphaMain16};
    color: ${({ theme }) => theme.colors.brandMain};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    /* Caption/Medium */
    font-family: "Mona Sans";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 18px */

  }

  .Heading {
    color: var(--text-icon-default-main, #292929);
    padding: 16px 16px 0px 16px;
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
      color: ${({ theme }) => theme.colors.brandMain};
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
      background-color: ${({ theme }) => theme.fill.brandAlphaMain16};
    }
  }

  .AttendeeCancel {
    padding: 8px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.fill.defaultSubtle};
    border-bottom: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  }

  .Attendee {
    width: 120px;
    display: flex;
    padding: 16px 0px 0px 0px;
    flex-direction: column;
    justify-content: flex-start;    
    align-items: center;
    align-self: flex-start;
    border-radius: ${({ theme }) => theme.radius.xs};
    border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
    background-color: ${({ theme }) => theme.fill.defaultMain};
    overflow: hidden;

    .Info {
      width: 100%;
      padding: 8px 8px;
    }

    .Images {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0px 8px;
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

const ModalHeading = styled.div`
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
`;

const VehicleList = styled.ul`
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
`;