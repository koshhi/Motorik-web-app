// components/EventDetail/EventDetail.js

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import useEvent from '../hooks/useEvent';
import useEnroll from '../hooks/useEnroll';
import MainNavbar from '../components/Navbar/MainNavbar';
import EventHeader from '../components/EventHeader/EventDetailHeader';
import EventDetailContent from '../components/EventContent/EventDetailContent';
import EventSummary from '../components/EventSummary/EventSummary';
import EventFixedAction from '../components/EventFixedAction';
import TicketModal from '../components/Modal/TicketModal';
import ConfirmationModal from '../components/Modal/ConfirmationModal';
import EnrollWithVehicleModal from '../components/Modal/EnrollWithVehicleModal.js';
import EnrollmentStatus from '../components/EventSummary/EnrollmentStatus';
import { toast } from 'react-toastify';

const EventDetail = () => {
  const { id } = useParams();
  const { user, loading: loadingAuth } = useAuth();
  const { event, isOwner, loadingEvent, error, setEvent } = useEvent(id, user);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userEnrollment, setUserEnrollment] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Estados para modales
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showEnrollWithVehicleModal, setShowEnrollWithVehicleModal] = useState(false);

  // Estados para confirmación
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  const { enroll, loadingEnroll, errorEnroll } = useEnroll(id, user, (updatedEvent) => {
    console.log('Evento actualizado después de inscripción:', updatedEvent);
    setEvent(updatedEvent);
    console.log('Asistentes del evento actualizado:', updatedEvent.attendees);
  
    // Cambiar la comparación para asegurar que ambos IDs sean cadenas
    const enrolled = updatedEvent.attendees.find(att => {
      const attendeeId = att.userId._id || att.userId.id;
      const currentUserId = user._id || user.id;
      console.log('Comparando:', attendeeId, currentUserId);
      return attendeeId.toString() === currentUserId.toString();
    });
  
    console.log('Inscripción encontrada:', enrolled);
  
    if (enrolled) {
      console.log('Usuario inscrito correctamente:', enrolled);
      setEnrollmentStatus(enrolled.status);
      setUserEmail(user.email);
  
      const vehicle = enrolled.vehicleId;
      if (vehicle && vehicle._id) {
        setSelectedVehicle(vehicle);
      } else {
        console.warn('Vehículo seleccionado no encontrado en los datos del evento.');
        setSelectedVehicle(null);
      }
  
      // Mostrar el modal de confirmación **solo aquí**
      setShowConfirmationModal(true);
    } else {
      console.warn('No se encontró la inscripción del usuario en el evento actualizado.');
    }
  });
  

  // Dentro del useEffect donde se actualiza userEnrollment
  useEffect(() => {
    console.log('Evento en estado actual:', event); 
    console.log('Usuario:', user); 
    if (event && user) {
      const enrolled = event.attendees.find(attendee => {
        const attendeeId = attendee.userId._id || attendee.userId.id;
        const currentUserId = user._id || user.id;
        console.log('Comparando en useEffect:', attendeeId, currentUserId);
        return attendeeId.toString() === currentUserId.toString();
      });

      if (enrolled) {
        setIsEnrolled(true);
        setUserEnrollment(enrolled);
        setEnrollmentStatus(enrolled.status); 
        
        const vehicle = enrolled.vehicleId;
        if (vehicle && vehicle._id) {
          setSelectedVehicle(vehicle);
        } else {
          console.warn('Vehículo seleccionado no encontrado en los datos del evento.');
          setSelectedVehicle(null); 
        }

      } else {
        setIsEnrolled(false);
        setUserEnrollment(null);
        setEnrollmentStatus(null); 
        console.warn('No se encontró la inscripción del usuario en el evento actualizado.');
      }
    }

    console.log('Evento actualizado:', event);

  }, [event, user, isOwner]);
  

  const intervalIdRef = useRef(null);

  // Implementar el contador de tiempo
  useEffect(() => {
    if (event && event.startDate) {
      const formatTimeLeft = (days, hours, minutes, seconds) => {
        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0) parts.push(`${seconds}s`);
        return parts.join(' ');
      };

      const updateTimeLeft = () => {
        const now = new Date();
        const eventDate = new Date(event.startDate);
        const diff = eventDate - now;

        if (diff <= 0) {
          setTimeLeft('El evento ha comenzado');
          if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
          }
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(formatTimeLeft(days, hours, minutes, seconds));
      };

      // Llamar inmediatamente para no esperar 1 segundo
      updateTimeLeft();

      // Establecer el intervalo y guardarlo en el ref
      intervalIdRef.current = setInterval(updateTimeLeft, 1000);

      // Limpiar el intervalo al desmontar o actualizar el evento
      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
      };
    }
  }, [event]);

  // Manejar inscripción
  const handleEnroll = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para inscribirte.');
      return;
    }

    const tickets = event.tickets;

    // Si hay un único ticket gratis sin aprobación => inscripción directa
    if (tickets.length === 1 && tickets[0].type === 'free' && !tickets[0].approvalRequired) {
      const singleTicket = tickets[0];
      console.log('Single ticket:', singleTicket);

      if (event.needsVehicle) {
        // Abrimos el modal de inscripción con vehículos
        setSelectedTicketId(singleTicket._id);
        setShowEnrollWithVehicleModal(true);
      } else {
        // No necesita vehículo
        setSelectedTicketId(singleTicket._id);
        enroll(null, singleTicket._id);
      }

    } else {
      // Caso donde hay más de un ticket, o ticket pago/aprobación:
      setShowTicketModal(true);
    }
  };
  
  // Manejar selección de ticket
  const handleTicketSelect = (ticketId) => {
    console.log("Seleccionando Ticket ID:", ticketId);
    const selectedTicket = event.tickets.find(t => t._id === ticketId);
    if (!selectedTicket) {
      toast.error('Ticket seleccionado no encontrado.');
      return;
    }
    if (selectedTicket.availableSeats <= 0) { // Asegúrate de que availableSeats existe en los tickets
      toast.error('No hay asientos disponibles para este ticket.');
      return;
    }
    setSelectedTicketId(ticketId);
    console.log("Estado selectedTicketId actualizado a:", ticketId);
  };

  // Cancelar inscripción
  const handleCancelEnrollment = async () => {
    try {
      const response = await axiosClient.post(`/api/events/${event.id}/attendees/cancel`);
      console.log('Respuesta de cancelación:', response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        // Actualizar el estado localmente
        setIsEnrolled(false);
        setUserEnrollment(null);
        setEnrollmentStatus(null);
        // Actualizar el evento
        setEvent(response.data.event);
      }
    } catch (error) {
      console.error('Error al cancelar la inscripción:', error);
      toast.error('Error al cancelar la inscripción.');
    }
  };

  // Manejar inscripción completa desde EnrollWithVehicleModal
  const handleEnrollmentComplete = (vehicle, ticketId) => { // Modificado para recibir ticketId
    console.log('handleEnrollmentComplete called with vehicle:', vehicle);
    console.log('handleEnrollmentComplete called with ticketId:', ticketId);
    const selectedTicket = event.tickets.find(t => t._id === ticketId);
    console.log('Selected ticket:', selectedTicket);
    if (selectedTicket && vehicle && vehicle._id) {
      enroll(vehicle._id, selectedTicket._id);
      setShowEnrollWithVehicleModal(false);
      setSelectedTicketId(null);
    } else {
      console.log('Inscription data incomplete');
      toast.error('Datos de inscripción incompletos.');
    }
  };

  if (loadingAuth || loadingEvent) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar el evento: {error}</p>;
  if (!event) return <p>Evento no encontrado</p>;

  // Verificar si las coordenadas existen y son válidas
  const hasValidCoordinates =
    event.locationCoordinates &&
    Array.isArray(event.locationCoordinates.coordinates) &&
    event.locationCoordinates.coordinates.length === 2 &&
    typeof event.locationCoordinates.coordinates[0] === 'number' &&
    typeof event.locationCoordinates.coordinates[1] === 'number';

  // Extraer lat y lng correctamente
  const [lng, lat] = hasValidCoordinates ? event.locationCoordinates.coordinates : [undefined, undefined];

  // Construir enlace del evento
  const eventLink = `${process.env.REACT_APP_CLIENT_URL}/events/${event.id}/${event.slug}`

  return (
    <>
      <MainNavbar />
      <EventHeader
        title={event.title}
        availableSeats={event.availableSeats}
        eventType={event.eventType}
        terrain={event.terrain}
        manageLink={`/events/manage/${event.id}`}
        isEnrolled={isEnrolled}
        handleEnroll={handleEnroll}
        eventId={event.id}
        organizer={event.owner}
        isOwner={isOwner}
      />
      <EventBody>
        <GridContainer>
          <EventDetailContent
            image={event.image}
            description={event.description}
            organizer={event.owner}
            tickets={event.tickets}
          />
          <EventSummaryContainer>
            {enrollmentStatus && (
              <EnrollmentStatus 
                handleCancelEnrollment={handleCancelEnrollment}
                enrollmentStatus={userEnrollment?.status} 
              />
            )}
            <EventSummary
              date={{
                monthDate: event.monthDate,
                dayDate: event.dayDate,
                partialDateStart: event.partialDateStart,
                partialDateEnd: event.partialDateEnd,
              }}
              location={event.location}
              shortLocation={event.shortLocation}
              mapCoordinates={{ lat, lng }}
              attendees={event.attendees}
              attendeesCount={event.attendeesCount}
              organizer={event.owner}
            />
          </EventSummaryContainer>
        </GridContainer>
      </EventBody>

      {showTicketModal && (
        <TicketModal
          tickets={event.tickets}
          selectedTicketId={selectedTicketId}
          handleTicketSelect={handleTicketSelect}
          onClose={() => setShowTicketModal(false)}
          onContinue={() => {
            console.log("Tickets en TicketModal:", event.tickets);
            console.log("selectedTicketId en TicketModal:", selectedTicketId);
            setShowTicketModal(false);

            // Verificar si necesita vehículo
            if (event.needsVehicle) {
              setShowEnrollWithVehicleModal(true);
            } else {
              // No necesita vehículo
              enroll(null, selectedTicketId);
              setSelectedTicketId(null);
              setShowTicketModal(false);
            }
          }}
          eventImage={event.image}
          organizerImage={event.owner.userAvatar}
        />
      )}

      {showEnrollWithVehicleModal && (
        <EnrollWithVehicleModal
          isOpen={showEnrollWithVehicleModal}
          onClose={() => setShowEnrollWithVehicleModal(false)}
          onEnroll={handleEnrollmentComplete}
          eventId={event.id}
          selectedTicketId={selectedTicketId} 
        />
      )}
      
      {showConfirmationModal && (
        <ConfirmationModal
          enrollmentStatus={enrollmentStatus}
          userEmail={userEmail}
          timeLeft={timeLeft}
          eventLink={eventLink}
          onClose={() => setShowConfirmationModal(false)}
          selectedVehicle={selectedVehicle}
          eventId={event.id}
        />
      )}


      <EventFixedAction
        eventName={event.title}
        eventDate={event.longDate}
        availableSeats={event.availableSeats}
        tickets={event.tickets}
      />
    </>
  );
};

export default EventDetail;

// Styled Components
const EventBody = styled.section`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ theme }) => theme.sizing.lg};
  padding-bottom: 24rem;
`;

const GridContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: ${({ theme }) => theme.sizing.lg};
  padding: 0 ${({ theme }) => theme.sizing.md};
`;

const EventSummaryContainer = styled.div`
  grid-area: 1 / 8 / 2 / 13;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;




// // components/EventDetail.js

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import axiosClient from '../api/axiosClient';
// import styled from 'styled-components';
// import useEvent from '../hooks/useEvent';
// import useEnroll from '../hooks/useEnroll';
// import { getEventTypeIcon } from '../utilities';
// import MainNavbar from '../components/Navbar/MainNavbar';
// import Button from '../components/Button/Button';
// import EventFixedAction from '../components/EventFixedAction';
// import Modal from '../components/Modal/Modal';
// import EventMap from '../components/EventMap';
// import { toast } from 'react-toastify';
// import Typography from '../components/Typography';
// import { theme } from '../theme';
// import EnrollmentDetails from './EnrollmentDetails';

// const EventDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user, loading: loadingAuth } = useAuth();
//   const { event, isOwner, loadingEvent, error, setEvent } = useEvent(id, user);
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [userEnrollment, setUserEnrollment] = useState(null);
//   const [selectedTicketId, setSelectedTicketId] = useState(null);
//   const [selectedVehicleId, setSelectedVehicleId] = useState(null);

//   // Nuevos estados para el modal de confirmación
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
//   const [enrollmentStatus, setEnrollmentStatus] = useState(null);
//   const [userEmail, setUserEmail] = useState('');
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [timeLeft, setTimeLeft] = useState('');

//   const { enroll, loadingEnroll, errorEnroll } = useEnroll(id, user, (updatedEvent) => {
//     setEvent(updatedEvent);

//     // Encontrar la inscripción del usuario en el evento actualizado
//     const enrolled = updatedEvent.attendees.find(att => att.userId._id === user.id);
//     if (enrolled) {
//       setEnrollmentStatus(enrolled.status);
//       setUserEmail(user.email); // Asegúrate de que el objeto `user` tiene el campo `email`

//       // Encontrar el vehículo seleccionado
//       const vehicle = user.vehicles.find(v => v._id === enrolled.vehicleId);
//       setSelectedVehicle(vehicle);

//       // Mostrar el modal de confirmación
//       setShowConfirmationModal(true);
//     }
//   });

//   const [showTicketModal, setShowTicketModal] = useState(false);
//   const [showVehicleModal, setShowVehicleModal] = useState(false);

//   useEffect(() => {
//     if (event && user) {
//       const enrolled = event.attendees.find(attendee => attendee.userId._id === user.id);
//       if (enrolled) {
//         setIsEnrolled(true);
//         setUserEnrollment(enrolled);
//       } else {
//         setIsEnrolled(false);
//         setUserEnrollment(null);
//       }
//     }
//     console.log('Tickets del evento:', event?.tickets);
//   }, [event, user]);

//   // Implementar el contador de tiempo
//   useEffect(() => {
//     if (event && event.startDate) {
//       const updateTimeLeft = () => {
//         const now = new Date();
//         const eventDate = new Date(event.startDate);
//         const diff = eventDate - now;

//         if (diff <= 0) {
//           setTimeLeft('El evento ha comenzado');
//           return;
//         }

//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//         const minutes = Math.floor((diff / (1000 * 60)) % 60);
//         setTimeLeft(`${days}d ${hours}h ${minutes}m`);
//       };

//       updateTimeLeft();
//       const interval = setInterval(updateTimeLeft, 60000); // Actualizar cada minuto

//       return () => clearInterval(interval);
//     }
//   }, [event]);

//   // Añadir logs para depuración
//   console.log('ID del evento:', id);
//   console.log('Evento:', event);
//   console.log('Error:', error);

//   const handleEnroll = () => {
//     if (!user || !user.vehicles || user.vehicles.length === 0) {
//       toast.error('No tienes vehículos registrados.');
//       return;
//     }

//     if (event.tickets.length === 1) {
//       const ticket = event.tickets[0];
//       if (ticket.availableSeats <= 0) {
//         toast.error('No hay asientos disponibles para este ticket.');
//         return;
//       }

//       if (ticket.type === 'free') {
//         // Seleccionar automáticamente el ticket gratuito
//         setSelectedTicketId(ticket._id);

//         if (user.vehicles.length === 1) {
//           // Si solo hay un vehículo, inscribirse directamente
//           setSelectedVehicleId(user.vehicles[0]._id);
//           handleConfirmEnrollment();
//         } else {
//           // Si hay múltiples vehículos, mostrar el modal de selección de vehículos
//           setShowVehicleModal(true);
//         }
//       } else {
//         // Si el único ticket es de pago, mostrar el modal de selección de tickets
//         setShowTicketModal(true);
//       }
//     } else {
//       // Si hay múltiples tickets, mostrar el modal de selección de tickets
//       setShowTicketModal(true);
//     }
//   };

//   // Función para manejar la selección de ticket
//   const handleTicketSelect = (ticketId) => {
//     const selectedTicket = event.tickets.find(t => t._id === ticketId);
//     if (!selectedTicket) {
//       toast.error('Ticket seleccionado no encontrado.');
//       return;
//     }
//     if (selectedTicket.availableSeats <= 0) {
//       toast.error('No hay asientos disponibles para este ticket.');
//       return;
//     }
//     setSelectedTicketId(ticketId);
//   };

//   // Función para manejar la selección de vehículo
//   const handleVehicleSelect = (vehicleId) => {
//     setSelectedVehicleId(vehicleId);
//   };

//   const handleConfirmEnrollment = () => {
//     if (selectedVehicleId && selectedTicketId) {
//       enroll(selectedVehicleId, selectedTicketId);
//       setShowVehicleModal(false);
//       // Opcional: Resetear las selecciones
//       setSelectedTicketId(null);
//       setSelectedVehicleId(null);
//     } else {
//       toast.error('Por favor, selecciona una entrada y un vehículo antes de continuar.');
//     }
//   };

//   const handleCancelEnrollment = async () => {
//     try {
//       const response = await axiosClient.post(`/api/events/${event.id}/attendees/cancel`);
//       console.log('Respuesta de cancelación:', response.data);
//       if (response.data.success) {
//         toast.success(response.data.message);
//         // Actualizar el estado localmente
//         setIsEnrolled(false);
//         setUserEnrollment(null);
//         // Actualizar el evento
//         setEvent(response.data.event);
//       }
//     } catch (error) {
//       console.error('Error al cancelar la inscripción:', error);
//       toast.error('Error al cancelar la inscripción.');
//     }
//   };

//   if (loadingAuth || loadingEvent) return <p>Cargando...</p>;
//   if (error) return <p>Error al cargar el evento: {error}</p>;
//   if (!event) return <p>Evento no encontrado</p>;

//   // Verificar si las coordenadas existen y son válidas
//   const hasValidCoordinates =
//     event.locationCoordinates &&
//     Array.isArray(event.locationCoordinates.coordinates) &&
//     event.locationCoordinates.coordinates.length === 2 &&
//     typeof event.locationCoordinates.coordinates[0] === 'number' &&
//     typeof event.locationCoordinates.coordinates[1] === 'number';

//   // Extraer lat y lng correctamente
//   const [lng, lat] = hasValidCoordinates ? event.locationCoordinates.coordinates : [undefined, undefined];


//   return (
//     <>
//       <MainNavbar />
//       <EventHeader>
//         <div className='EventHeaderContainer'>
//           <Button $variant="ghost" onClick={() => navigate(-1)}>
//             <img src="/icons/chevron-left.svg" alt="back-icon" />Atrás
//           </Button>
//           <div className='EventHeaderMain'>
//             <div className='InnerHeaderLeft'>
//               <h1 className='EventTitle'>{event.title}</h1>
//               <div className='HeaderTagWrapper'>
//                 <p className='HeaderTag'>{event.availableSeats} plazas</p>
//                 <p className='HeaderTag'>{event.eventType}</p>
//                 <p className='HeaderTag'>{event.terrain}</p>
//               </div>
//               <p></p>
//             </div>
//             <div className='InnerHeaderRight'>
//               <Button $variant="ghost" aria-label="Compartir evento">
//                 <img className="Icon" src="/icons/share.svg" alt="share-icon" />
//               </Button>
//               {isOwner ? (
//                 <Link to={`/events/manage/${event.id}`}>
//                   <Button size="small" $variant="outline" aria-label="Gestionar evento">
//                     Gestionar evento
//                   </Button>
//                 </Link>
//               ) : (
//                 isEnrolled ? (
//                   <div>
//                     <p>Estado de tu inscripción: {userEnrollment.status}</p>
//                     {userEnrollment.status === 'confirmation pending' && (
//                       <p>Tu inscripción está pendiente de aprobación.</p>
//                     )}
//                     {userEnrollment.status === 'attending' && (
//                       <p>¡Tu inscripción ha sido aprobada!</p>
//                     )}
//                     {userEnrollment.status === 'not attending' && (
//                       <p>Tu inscripción ha sido rechazada o cancelada.</p>
//                     )}
//                     {/* Botón para cancelar inscripción */}
//                     {userEnrollment.status !== 'not attending' && (
//                       <Button onClick={handleCancelEnrollment}>Cancelar Inscripción</Button>
//                     )}

//                     <Link to={`/events/${event.id}/enrollment-details`}>
//                       <Button size="small" $variant="primary" aria-label="Ver detalles de inscripción">
//                         Ver mi inscripción
//                       </Button>
//                     </Link>
//                   </div>

//                 ) : (
//                   <Button
//                     onClick={handleEnroll}
//                     size="small"
//                     aria-label="Inscríbete en el evento"
//                     disabled={
//                       loadingEnroll ||
//                       (selectedTicketId && event.tickets.find(t => t._id === selectedTicketId)?.availableSeats <= 0)
//                     }
//                   >
//                     {loadingEnroll ? 'Inscribiendo...' : 'Inscríbete'}
//                   </Button>
//                 )
//               )}
//             </div>
//           </div>
//           <Link className='EventOrganizer' to={`/user/${event.owner.id}`}>
//             <img className="UserAvatar" src={event.owner.userAvatar} alt="Event organizer" />
//             <div className='UserData'>
//               <p className='label'>Organizado por</p>
//               <p className='username'>{event.owner.name} {event.owner.lastName}</p>
//             </div>
//           </Link>
//         </div>

//       </EventHeader>
//       <EventBody>
//         <div className='GridContainer'>
//           <EventContent>
//             {event.image ? (
//               <img src={event.image} alt={event.title} className="event-image" />
//             ) : (
//               <div className="placeholder-image">
//                 <img src={getEventTypeIcon(event.eventType)} alt="empty state icon" className="empty-state-icon" />
//               </div>
//             )}
//             <EventDescription>
//               <h2>Detalles</h2>
//               <p>{event.description}</p>
//             </EventDescription>
//             <div className='OrganizerBlock'>
//               <h2>Sobre el organizador</h2>
//               <EventOrganizerCard>
//                 <div className='EventOrganizerHeader'>
//                   <div className='EventOrganizer'>
//                     <img className="OrganizerAvatar" src={event.owner.userAvatar} alt="Event organizer" />
//                     <div className='OrganizerData'>
//                       <p className='username'>{event.owner.name} {event.owner.lastName}</p>
//                       <p className='followers'>22 Seguidores</p>
//                     </div>
//                   </div>
//                   <div className='OrganizerActions'>
//                     <Button size="small" $variant="ghost">Contactar</Button>
//                     <Button size="small" $variant="outline">Seguir</Button>
//                   </div>
//                 </div>
//                 <p className='OrganizerDescription'>
//                   {event.owner.description}
//                 </p>
//               </EventOrganizerCard>
//             </div>
//             <div>

//               {event.tickets.map(ticket => (
//                 <div key={ticket._id} className='TicketItem'>
//                   <Typography variant="body-1-semibold" color={theme.colors.defaultStrong} as="p">
//                     {ticket.name}
//                   </Typography>
//                   <Typography variant="body-2-medium" color={theme.colors.defaultWeak} as="p">
//                     Tipo: {ticket.type === 'free' ? 'Gratis' : 'De pago'}
//                   </Typography>
//                   {ticket.type === 'paid' && (
//                     <Typography variant="body-2-medium" color={theme.colors.defaultWeak} as="p">
//                       Precio: {ticket.price}€
//                     </Typography>
//                   )}
//                   <Typography variant="body-2-medium" color={theme.colors.defaultWeak} as="p">
//                     Capacidad: {ticket.capacity}
//                   </Typography>
//                   <Typography variant="body-2-medium" color={theme.colors.defaultWeak} as="p">
//                     Disponibles: {ticket.availableSeats}
//                   </Typography>
//                   {ticket.availableSeats <= 0 && (
//                     <Typography variant="body-2-medium" color="red" as="p">
//                       Sin asientos disponibles
//                     </Typography>
//                   )}
//                 </div>
//               ))}

//             </div>

//             {/* <EventTags>
//               <h3>Etiquetas</h3>
//               <p className='Tag'>Tipo: {event.eventType}</p>
//               <p className='Tag'>Terreno: {event.terrain}</p>
//               <p className='Tag'>Experience: {event.experience}</p>
//             </EventTags> */}
//           </EventContent>
//           <EventSummary>
//             <DateAndLocation>
//               <div className='DateRow'>
//                 <div className="DateContainer">
//                   <div className="MonthDate">
//                     <p>{event.monthDate}</p>
//                   </div>
//                   <div className="DayDate">
//                     <p>{event.dayDate}</p>
//                   </div>
//                 </div>
//                 <p className='LongDate'>{event.partialDateStart}, {event.partialDateEnd}</p>
//               </div>
//               <div className='LocationRow'>
//                 <div className='LocationContainer'>
//                   <img src="/icons/map-location.svg" alt="map-location-icon" />
//                 </div>
//                 <div className='LocationAddress'>
//                   <p className='Location'>{event.location}</p>
//                   <p className='ShortLocation'>{event.shortLocation}</p>
//                 </div>
//               </div>
//               <EventMap lat={lat} lng={lng} maxHeight="200px" mobileHeight="120px" borderRadius="0px" />

//             </DateAndLocation>
//             <Attendees>
//               <div className='AttendeeCancel'>
//                 <p>¿No puedes asistir? </p>
//                 <Button $variant="ghost" onClick={handleCancelEnrollment}>
//                   Cancelar inscripción <img src="/icons/arrow-right.svg" alt="new window icon" />
//                 </Button>
//               </div>
//               <p className='Heading'>Asistentes <span className='AttendeeCounter'>{event.attendeesCount}</span></p>
//               <ul className='AttendeesList'>
//                 <li className='Attendee'>
//                   <div className='Images'>
//                     <img
//                       className="AttendeeImg"
//                       src={event.owner.userAvatar}
//                       alt="Organizador"
//                     />
//                     <img
//                       className='VehicleImg'
//                       src={event.owner.userAvatar}
//                       alt="Vehiculo Organizador" />
//                   </div>
//                   <div className='Info'>
//                     <p className='AttendeeName'>
//                       {event.owner.name} {event.owner.lastName}
//                     </p>
//                     <p className='AttendeeVehicle'>
//                       Organizer's Bike
//                     </p>
//                   </div>
//                   <div className='OrganizerBadge'>
//                     <img src="/icons/organizer-helmet.svg" alt="Organizer badge" />
//                     Organizador
//                   </div>
//                 </li>

//                 {event.attendees.map((attendee) => (
//                   <li key={attendee._id || `${attendee.userId?.id}-${attendee.vehicleId?.id}`} className='Attendee'>
//                     <div className='Images'>
//                       <img
//                         className="AttendeeImg"
//                         src={attendee.userId?.userAvatar || '/default-avatar.png'}
//                         alt={`${attendee.userId?.name || 'Asistente'} ${attendee.userId?.lastName || ''}`}
//                       />
//                       <img
//                         className='VehicleImg'
//                         src={attendee.vehicleId?.image || '/default-vehicle.png'}
//                         alt={`${attendee.vehicleId?.brand || 'Vehículo'} ${attendee.vehicleId?.model || ''}`}
//                       />
//                     </div>
//                     <div className='Info'>
//                       <p className='AttendeeName'>
//                         {attendee.userId?.name || 'Nombre'} {attendee.userId?.lastName || 'Apellido'}
//                       </p>
//                       <p className='AttendeeVehicle'>
//                         {attendee.vehicleId?.brand || 'Marca'} {attendee.vehicleId?.model || 'Modelo'}
//                       </p>
//                     </div>
//                   </li>
//                 ))}

//               </ul>
//             </Attendees>
//           </EventSummary>
//         </div>

//         {/* Modal de selección de tickets */}
//         {showTicketModal && (
//           <Modal title="Inscríbete" onClose={() => setShowTicketModal(false)}>
//             <ModalHeading>
//               <Typography variant="title-5-semibold">Selecciona una entrada.</Typography>
//               <Typography variant="body-1-regular">Por favor, elige una entrada para inscribirte en el evento.</Typography>
//             </ModalHeading>
//             <TicketList>
//               {event.tickets
//                 .sort((a, b) => b.availableSeats - a.availableSeats) // Ordenar tickets por disponibilidad descendente
//                 .map(ticket => (
//                   <TicketItem
//                     key={ticket._id}
//                     className={`Ticket ${selectedTicketId === ticket._id ? 'selected' : ''}`}
//                     onClick={() => handleTicketSelect(ticket._id)} // Solo seleccionar el ticket
//                     disabled={ticket.availableSeats <= 0}
//                     style={{
//                       opacity: ticket.availableSeats <= 0 ? 0.5 : 1,
//                       cursor: ticket.availableSeats <= 0 ? 'not-allowed' : 'pointer'
//                     }}
//                   >
//                     <div className="TicketContent">
//                       <Typography variant="title-5-medium">{ticket.name}</Typography>
//                       <Typography variant="body-1-medium" color={theme.colors.defaultWeak}>
//                         {ticket.type === 'free' ? 'Gratis' : `${ticket.price}€`}
//                       </Typography>
//                       {ticket.approvalRequired && <Typography>(Requiere aprobación)</Typography>}
//                       {ticket.availableSeats <= 0 && <Typography color="red">Sin asientos disponibles</Typography>}
//                     </div>
//                     {selectedTicketId === ticket._id && <span className="SelectedIndicator">✔️</span>}
//                   </TicketItem>
//                 ))}
//             </TicketList>

//             <Button
//               onClick={() => {
//                 if (selectedTicketId) {
//                   setShowTicketModal(false);
//                   if (user.vehicles.length === 1) {
//                     setSelectedVehicleId(user.vehicles[0]._id);
//                     handleConfirmEnrollment();
//                   } else {
//                     setShowVehicleModal(true); // Abrir el modal de selección de vehículo
//                   }
//                 } else {
//                   toast.error('Por favor, selecciona una entrada antes de continuar.');
//                 }
//               }}
//               disabled={!selectedTicketId}
//               $variant="primary"
//               size="medium"
//             >
//               Continuar
//             </Button>
//           </Modal>
//         )}

//         {/* Modal de selección de vehículo */}
//         {showVehicleModal && (
//           <Modal title="Selecciona tu vehículo" onClose={() => setShowVehicleModal(false)}>
//             <ModalHeading>
//               <h3>Indica qué moto usarás:</h3>
//               <p>Al inscribir tu moto en el evento haces más fácil que otras personas se inscriban en el evento.</p>
//             </ModalHeading>
//             <VehicleList>
//               {user.vehicles.map((vehicle) => (
//                 <VehicleItem
//                   key={vehicle._id}
//                   className={`Vehicle ${selectedVehicleId === vehicle._id ? 'selected' : ''}`}
//                   onClick={() => handleVehicleSelect(vehicle._id)}
//                   disabled={vehicle.availableSeats <= 0}
//                   style={{
//                     opacity: vehicle.availableSeats <= 0 ? 0.5 : 1,
//                     cursor: vehicle.availableSeats <= 0 ? 'not-allowed' : 'pointer'
//                   }}
//                 >
//                   <div className="VehicleContent">
//                     <img src={vehicle.image} className="VehicleImage" alt={`${vehicle.brand} ${vehicle.model}`} />
//                     <div className="VehicleData">
//                       <p className="Brand">{vehicle.brand}</p>
//                       <div className="Name">
//                         <p className="Subtitle">{vehicle.model}</p>
//                         {vehicle.nickname && <p className="Subtitle"> - {vehicle.nickname}</p>}
//                       </div>
//                     </div>
//                   </div>
//                   {selectedVehicleId === vehicle._id && <span className="SelectedIndicator">✔️</span>}
//                 </VehicleItem>
//               ))}
//             </VehicleList>
//             <Button
//               onClick={handleConfirmEnrollment}
//               disabled={!selectedVehicleId}
//               $variant="primary"
//               size="medium"
//             >
//               Continuar
//             </Button>

//             {errorEnroll && <ErrorMessage>{errorEnroll}</ErrorMessage>}
//           </Modal>
//         )}

//         {/* Modal de Confirmación de Inscripción */}
//         {showConfirmationModal && (
//           <Modal title="Inscripción realizada" onClose={() => setShowConfirmationModal(false)}>
//             <ModalHeading>
//               <Typography variant="title-5-semibold">Selecciona una entrada.</Typography>
//               <Typography variant="body-1-regular">Por favor, elige una entrada para inscribirte en el evento.</Typography>
//             </ModalHeading>
//             <EnrollmentDetails>
//               {enrollmentStatus === 'confirmation pending' ? (
//                 <>
//                   <Typography variant="title-6-semibold">
//                     Tu inscripción se ha realizado, en breve el organizador te hará saber si aprueba o no tu inscripción.
//                   </Typography>
//                   <Typography variant="body-1-regular">
//                     En breve el organizador te hará saber si aprueba o no tu inscripción.
//                   </Typography>
//                 </>

//               ) : (
//                 <>
//                   <Typography variant="body-1-regular">
//                     Tu inscripción se ha realizado.
//                   </Typography>
//                   <Typography variant="body-2-regular">
//                     Se ha enviado un correo electrónico de confirmación a {userEmail}
//                   </Typography>
//                 </>
//               )}


//             </EnrollmentDetails>
//             {/* Contador */}
//             <EventCounter>
//               <Typography variant="body-2-medium" style={{ marginTop: '16px' }}>
//                 El evento empieza en: {timeLeft}
//               </Typography>
//             </EventCounter>


//             {/* URL del Evento */}
//             <URLSection>
//               <Typography variant="body-2-medium">
//                 URL del evento: <Link to={`/events/${event.id}/${event.slug}`}>{`https://tudominio.com/events/${event.id}/${event.slug}`}</Link>
//               </Typography>
//               <Button onClick={() => {
//                 navigator.clipboard.writeText(`https://tudominio.com/events/${event.id}/${event.slug}`);
//                 toast.success('URL copiada al portapapeles.');
//               }}>
//                 Copiar URL
//               </Button>
//             </URLSection>

//             {/* Bloque de Vehículo */}
//             {selectedVehicle && (
//               <VehicleCard>
//                 <img src={selectedVehicle.image} alt={`${selectedVehicle.brand} ${selectedVehicle.model}`} />
//                 <VehicleInfo>
//                   <Typography variant="body-2-medium">{selectedVehicle.name} {selectedVehicle.nickname && `- ${selectedVehicle.nickname}`}</Typography>
//                   <Typography variant="body-2-regular">{selectedVehicle.model}</Typography>
//                 </VehicleInfo>
//               </VehicleCard>
//             )}
//           </Modal>
//         )}

//       </EventBody>
//       <EventFixedAction
//         eventName={event.title}
//         eventDate={event.longDate}
//         availableSeats={event.availableSeats}
//         price={event.tickets.length > 0 ? event.tickets[0].price : 0} // Asegúrate de que haya al menos un ticket
//       />
//     </>
//   );
// };

// export default EventDetail;



// const EventHeader = styled.section`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   background-color: ${({ theme }) => theme.fill.defaultSubtle};

//   .EventHeaderContainer {
//     width: 100%;
//     max-width: 1400px;
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
//     padding-bottom: ${({ theme }) => theme.sizing.md};
//     gap: ${({ theme }) => theme.sizing.xs};

//     .EventHeaderMain {
//       display: flex;
//       align-items: center;
//       gap: var(--Spacing-md, 24px);
//       align-self: stretch;

//       .InnerHeaderLeft {
//         flex-grow: 1;
//         display: flex;
//         flex-direction: row;
//         align-items: center;
//         justify-content: flex-start;
//         flex-wrap: wrap;
//         gap: ${({ theme }) => theme.sizing.sm};

//         .EventTitle {
//           margin: 0px;
//           color: var(--text-icon-default-main, #292929);
//           font-variant-numeric: lining-nums tabular-nums;
//           font-feature-settings: 'ss01' on;

//           /* Titles/Mobile/Title 1/Bold */
//           font-family: "Mona Sans";
//           font-size: 28px;
//           font-style: normal;
//           font-weight: 700;
//           line-height: 140%; /* 39.2px */
//         }
//         .HeaderTagWrapper {
//           display: flex;
//           flex-direction: row;
//           align-items: center;
//           gap: ${({ theme }) => theme.sizing.xs};

//           .HeaderTag {
//             display: flex;
//             min-height: 24px;
//             padding: ${({ theme }) => theme.sizing.xxs} ${({ theme }) => theme.sizing.xs};
//             justify-content: center;
//             align-items: center;
//             border-radius: var(--Spacing-md, 24px);
//             background: var(--bg-default-main, #FFF);
//             border: 1px solid var(--border-default-weak, #DCDCDC);

//             // box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
//             color: var(--text-icon-default-main, #292929);
//             font-family: "Mona Sans";
//             font-size: 10px;
//             font-style: normal;
//             font-weight: 600;
//             line-height: 100%; /* 10px */
//             letter-spacing: 1.2px;
//             text-transform: uppercase;
//           }
//         }
//       }

//       .InnerHeaderRight {
//         display: flex;
//         justify-content: flex-end;
//         align-items: center;
//         gap: ${({ theme }) => theme.sizing.xs};
//       }
//     }

//     .EventOrganizer {
//       display: flex;
//       align-items: center;
//       justify-content: flex-start;
//       gap: ${({ theme }) => theme.sizing.xs};

//       .UserAvatar {
//         border-radius: ${({ theme }) => theme.sizing.xs};
//         height: 40px;
//         width: 40px;
//       }

//       .UserData{
//         display: flex;
//         flex-direction: column;
//         align-items: flex-start;
//         gap: ${({ theme }) => theme.sizing.xxs};;

//         .label {
//           color: ${({ theme }) => theme.colors.defaultWeak};
//           font-variant-numeric: lining-nums tabular-nums;
//           font-feature-settings: 'ss01' on;
//           margin: 0px;
//           // font-family: "Mona Sans";
//           font-size: 12px;
//           font-style: normal;
//           font-weight: 500;
//           line-height: 100%%;
//         }
          
//         .username {
//           color: ${({ theme }) => theme.colors.defaultMain};
//           font-variant-numeric: lining-nums tabular-nums;
//           font-feature-settings: 'ss01' on;
//           margin: 0px;
//           // font-family: "Mona Sans";
//           font-size: 14px;
//           font-style: normal;
//           font-weight: 600;
//           line-height: 100%;
//         }
//       }
//     }
//   }
// `;

// const EventBody = styled.section`
//   background-color: ${({ theme }) => theme.fill.defaultMain};
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding-top: ${({ theme }) => theme.sizing.lg};
//   padding-bottom: 24rem;

//   .GridContainer {
//     width: 100%;
//     max-width: 1400px;
//     display: grid;
//     grid-template-columns: repeat(12, 1fr);
//     grid-template-rows: 1fr;
//     grid-column-gap: ${({ theme }) => theme.sizing.lg};
//     grid-row-gap: 0px;
//     padding: 0px ${({ theme }) => theme.sizing.md};

//   }

//   // .modalWrapper {
//   //   position: fixed;
//   //   top: 0;
//   //   left: 0;
//   //   width: 100vw;
//   //   height: 100vh;
//   //   z-index: 1000;
//   //   display: flex;
//   //   flex-direction: column;
//   //   align-items: center;
//   //   justify-content: center;

//   //   .modalOverlay {
//   //     width: 100%;
//   //     height: 100%;
//   //     background: rgba(26, 26, 26, 0.90);
//   //     backdrop-filter: blur(12px);
//   //     position: absolute;
//   //   }
//   // }
// `;

// const VehicleItem = styled.li`

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
    

// `;

// const EventContent = styled.div`
//   grid-area: 1 / 1 / 2 / 8;
//   width: 100%;
//   aspect-ratio: 4/3;
//   height: auto;

//   .event-image {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     border-radius: ${({ theme }) => theme.radius.sm};
//   }

//   .placeholder-image {
//     width: 100%;
//     height: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background-color: ${({ theme }) => theme.fill.defaultStrong};
//     border-radius: ${({ theme }) => theme.radius.sm};
//   }

//   .OrganizerBlock {
//     display: flex;
//     flex-direction: column;
//     align-items: stretch;
//     gap: 16px;
    
//     h2 {
//       color: var(--text-icon-default-main, #292929);
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on;

//       /* Titles/Desktop/Title 4/Semibold */
//       font-family: "Mona Sans";
//       font-size: 20px;
//       font-style: normal;
//       font-weight: 600;
//       line-height: 140%; /* 28px */
//     }
//   }
// `;

// const EventDescription = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   gap: 16px;
//   padding-top: 16px;
//   padding-bottom: 40px;
//   align-self: stretch;
// `;

// const EventOrganizerCard = styled.div`
//   padding: ${({ theme }) => theme.sizing.md};
//   border-radius: ${({ theme }) => theme.sizing.sm};
//   border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
//   background-color: ${({ theme }) => theme.fill.defaultMain};
//   display: flex;
//   flex-direction: column;
//   align-items: stretch;
//   justify-content: flex-start;
//   gap: ${({ theme }) => theme.sizing.md};

//   .EventOrganizerHeader {
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;

//     .EventOrganizer {
//       display: flex;
//       align-items: center;
//       justify-content: flex-start;
//       gap: ${({ theme }) => theme.sizing.sm};

//       .OrganizerAvatar {
//         border-radius: ${({ theme }) => theme.sizing.xs};
//         height: 56px;
//         width: 56px;
//       }

//       .OrganizerData{
//         display: flex;
//         flex-direction: column;
//         align-items: flex-start;
//         gap: ${({ theme }) => theme.sizing.xxs};;

//         .followers {
//           color: ${({ theme }) => theme.colors.defaultWeak};
//           font-variant-numeric: lining-nums tabular-nums;
//           font-feature-settings: 'ss01' on;
//           margin: 0px;
//           // font-family: "Mona Sans";
//           font-size: 12px;
//           font-style: normal;
//           font-weight: 500;
//           line-height: 100%%;
//         }
          
//         .username {
//           color: ${({ theme }) => theme.colors.defaultMain};
//           font-variant-numeric: lining-nums tabular-nums;
//           font-feature-settings: 'ss01' on;
//           margin: 0px;
//           // font-family: "Mona Sans";
//           font-size: 14px;
//           font-style: normal;
//           font-weight: 600;
//           line-height: 100%;
//         }
//       }
//     }
    
//     .OrganizerActions {
//       display: flex;
//       flex-direction: row;
//       flex-direction: row;
//       align-items: flex-start;
//       gap: ${({ theme }) => theme.sizing.xs};;
//     }
//   }

//   .OrganizerDescription {
//     margin: 0px;
//     color: ${({ theme }) => theme.colors.defaultStrong};
//     font-variant-numeric: lining-nums tabular-nums;
//     font-feature-settings: 'ss01' on;

//     /* Body/Body 1/Regular */
//     font-family: "Mona Sans";
//     font-size: 16px;
//     font-style: normal;
//     font-weight: 400;
//     line-height: 150%; /* 24px */
//   }
// `;

// const EventSummary = styled.div`
//   grid-area: 1 / 8 / 2 / 13;
//   display: flex;
//   flex-direction: column;
//   align-items: stretch;
//   gap: 40px;
// `;

// const DateAndLocation = styled.div`
//   border-radius: ${({ theme }) => theme.sizing.sm};
//   border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
//   background-color: ${({ theme }) => theme.fill.defaultMain};
//   overflow: hidden;

//   .DateRow {
//     display: flex;
//     align-items: center;
//     justify-content: flex-start;
//     flex-direction: row;
//     gap: ${({ theme }) => theme.sizing.sm};
//     padding: ${({ theme }) => theme.sizing.sm};

//     .DateContainer {
//       display: flex;
//       flex-shrink: 0;
//       width: 48px;
//       flex-direction: column;
//       align-items: stretch;
//       border-radius: ${({ theme }) => theme.radius.xs};
//       background: ${({ theme }) => theme.fill.defaultSubtle};

//       overflow: hidden;

//       .MonthDate {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         height: 24px;
//         background-color: #EFEFEF;

//         p {
//           color: var(--text-icon-default-main, #292929);
//           font-variant-numeric: lining-nums tabular-nums;
//           font-feature-settings: 'ss01' on;
//           font-family: "Mona Sans";
//           font-size: 10px;
//           font-style: normal;
//           font-weight: 600;
//           line-height: 100%;
//           margin: 0px;
//           text-transform: uppercase;
//         } 
//       }

//       .DayDate {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         height: 28px;

//         p {
//           color: var(--text-icon-default-main, #292929);
//           font-variant-numeric: lining-nums tabular-nums;
//           font-feature-settings: 'ss01' on;
//           font-family: "Mona Sans";
//           font-size: 16px;
//           font-style: normal;
//           font-weight: 700;
//           line-height: 100%;
//           margin: 0px;
//         }
//       }
//     }

//     .LongDate {
//       color: ${({ theme }) => theme.colors.defaultStrong};
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on, 'ss04' on;

//       /* Titles/Desktop/Title 5/Semibold */
//       font-family: "Mona Sans";
//       font-size: 18px;
//       font-style: normal;
//       font-weight: 600;
//       line-height: 140%; /* 25.2px */
//       margin: 0px;
//     }
//   }

//   .LocationRow {
//     display: flex;
//     align-items: flex-start;
//     justify-content: flex-start;
//     flex-direction: row;
//     gap: ${({ theme }) => theme.sizing.sm};
//     padding: ${({ theme }) => theme.sizing.sm};

//     .LocationContainer {
//       display: flex;
//       flex-shrink: 0;
//       width: 48px;
//       height: 52px;
//       flex-direction: column;
//       align-items: center;
//       justify-content: center;
//       background: ${({ theme }) => theme.fill.defaultSubtle};
//       border-radius: ${({ theme }) => theme.radius.xs};

//       img {
//         height: 24px;
//       }
//     }

//     .LocationAddress {

//       .ShortLocation {
//         color: var(--text-icon-default-weak, #656565);
//         font-variant-numeric: lining-nums tabular-nums;
//         font-feature-settings: 'ss01' on;

//         /* Body/Body 2/Medium */
//         font-family: "Mona Sans";
//         font-size: 14px;
//         font-style: normal;
//         font-weight: 500;
//         line-height: 140%; /* 19.6px */
//         margin: 0px;
//       }

//       .Location {
//         color: ${({ theme }) => theme.colors.defaultStrong};
//         font-variant-numeric: lining-nums tabular-nums;
//         font-feature-settings: 'ss01' on, 'ss04' on;

//         /* Titles/Desktop/Title 5/Semibold */
//         font-family: "Mona Sans";
//         font-size: 18px;
//         font-style: normal;
//         font-weight: 600;
//         line-height: 140%; /* 25.2px */
//         margin: 0px;
//       }
//     }
//   }
// `;

// const Attendees = styled.div`
//   display: flex;
//   flex-direction: column;
//   border-radius: 16px;
//   border: 1px solid var(--border-default-subtle, #EFEFEF);
//   background: var(--bg-default-main, #FFF);
//   overflow: hidden;

//   .AttendeesList {
//     display: flex;
//     flex-direction: row;
//     flex-wrap: wrap;
//     gap: 8px;
//     padding: 16px;
//   }

//   .OrganizerBadge {
//     display: flex;
//     padding: 4px;
//     justify-content: center;
//     align-items: center;
//     gap: 4px;
//     align-self: stretch;
//     background: ${({ theme }) => theme.fill.brandAlphaMain16};
//     color: ${({ theme }) => theme.colors.brandMain};
//     font-variant-numeric: lining-nums tabular-nums;
//     font-feature-settings: 'ss01' on;
//     /* Caption/Medium */
//     font-family: "Mona Sans";
//     font-size: 12px;
//     font-style: normal;
//     font-weight: 500;
//     line-height: 150%; /* 18px */

//   }

//   .Heading {
//     color: var(--text-icon-default-main, #292929);
//     padding: 16px 16px 0px 16px;
//     font-variant-numeric: lining-nums tabular-nums;
//     font-feature-settings: 'ss01' on;

//     /* Titles/Desktop/Title 4/Semibold */
//     font-family: "Mona Sans";
//     font-size: 20px;
//     font-style: normal;
//     font-weight: 600;
//     line-height: 140%; /* 28px */
//     gap: 8px;
//     display: inline-flex;
//     align-items: center;

//     .AttendeeCounter {
//       color: ${({ theme }) => theme.colors.brandMain};
//       text-align: center;
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on;

//       /* Body/Body 2/Semibold */
//       font-family: "Mona Sans";
//       font-size: 14px;
//       font-style: normal;
//       font-weight: 600;
//       line-height: 100%;
//       padding: 4px 8px;
//       min-width: 24px;
//       height: 24px;
//       border-radius: 48px;
//       background-color: ${({ theme }) => theme.fill.brandAlphaMain16};
//     }
//   }

//   .AttendeeCancel {
//     padding: 8px 16px;
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//     justify-content: space-between;
//     background-color: ${({ theme }) => theme.fill.defaultSubtle};
//     border-bottom: 1px solid ${({ theme }) => theme.border.defaultSubtle};
//   }

//   .Attendee {
//     width: 120px;
//     display: flex;
//     padding: 16px 0px 0px 0px;
//     flex-direction: column;
//     justify-content: flex-start;    
//     align-items: center;
//     align-self: flex-start;
//     border-radius: ${({ theme }) => theme.radius.xs};
//     border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
//     background-color: ${({ theme }) => theme.fill.defaultMain};
//     overflow: hidden;

//     .Info {
//       width: 100%;
//       padding: 8px 8px;
//     }

//     .Images {
//       display: flex;
//       flex-direction: row;
//       align-items: center;
//       padding: 0px 8px;
//     }
//   }

//   .AttendeeImg {
//     width: 40px;
//     height: 40px;
//     border-radius: ${({ theme }) => theme.radius.xl};
//     border: 1px solid ${({ theme }) => theme.border.defaultMain};
//     box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.16);
//     z-index: 2;
//   }

//   .VehicleImg {
//     width: 40px;
//     height: 40px;
//     border-radius: ${({ theme }) => theme.radius.xl};
//     z-index: 1;
//     margin-left: -8px;
//   }
  
//   .AttendeeName {
//     color: ${({ theme }) => theme.colors.defaultStrong};
//     text-align: center;
//     font-variant-numeric: lining-nums tabular-nums;
//     font-feature-settings: 'ss01' on;
//     text-overflow: ellipsis;

//     width: 100%;
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;


//     /* Body/Body 3/Semibold */
//     font-family: "Mona Sans";
//     font-size: 13px;
//     font-style: normal;
//     font-weight: 600;
//     line-height: 150%; /* 19.5px */
//   }

//   .AttendeeVehicle {
//     overflow: hidden;
//     color: var(--textIcon-default-medium, rgba(0, 0, 0, 0.50));
//     text-align: center;
//     font-variant-numeric: lining-nums tabular-nums;
//     font-feature-settings: 'ss01' on;
//     text-overflow: ellipsis;

//     /* Caption/Medium */
//     font-family: "Mona Sans";
//     font-size: 12px;
//     font-style: normal;
//     font-weight: 500;
//     line-height: 150%; /* 18px */
//   }
// `;

// const ErrorMessage = styled.div`
//   color: ${({ theme }) => theme.colors.errorMain};
//   font-variant-numeric: lining-nums tabular-nums;
//   /* Body 2/Medium */
//   font-family: "Satoshi Variable";
//   font-size: 14px;
//   font-style: normal;
//   font-weight: 500;
//   line-height: 20px;         
// `;

// const ModalHeading = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   gap: ${({ theme }) => theme.sizing.xs};
//   padding: 16px;


//   h3 {
//     color: ${({ theme }) => theme.colors.defaultStrong};
//     text-align: center;
//     font-variant-numeric: lining-nums tabular-nums;
//     font-feature-settings: 'ss01' on, 'ss04' on;

//     /* Titles/Desktop/Title 5/Semibold */
//     font-family: "Mona Sans";
//     font-size: 18px;
//     font-style: normal;
//     font-weight: 600;
//     line-height: 140%; /* 25.2px */
//   }

//   p {
//     color: ${({ theme }) => theme.colors.defaultWeak}; 
//     font-variant-numeric: lining-nums tabular-nums;
//     font-feature-settings: 'ss01' on;

//     /* Body/Body 1/Regular */
//     font-family: "Mona Sans";
//     font-size: 16px;
//     font-style: normal;
//     font-weight: 400;
//     line-height: 150%; /* 24px */
//   }
// `;

// const VehicleList = styled.ul`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   gap: 8px;
//   align-self: stretch;
//   padding: 16px;

//   .Vehicle {
//     cursor: pointer;
//     border-radius: var(--Spacing-xs, 8px);
//     border: 1px solid ${({ theme }) => theme.border.defaultWeak}; 
//     background-color: ${({ theme }) => theme.fill.defaultMain}; 
//     width: 100%;
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//     justify-content: space-between;
//     padding-right: 16px;

//     &:hover {
//       border: 1px solid ${({ theme }) => theme.border.brandMain}; 
//       box-shadow: 0px 0px 0px 1px ${({ theme }) => theme.border.brandMain}; 
//     }

//     .Label {
//       color: ${({ theme }) => theme.colors.brandMain}; 
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on;

//       /* Body/Body 2/Semibold */
//       font-family: "Mona Sans";
//       font-size: 14px;
//       font-style: normal;
//       font-weight: 600;
//       line-height: 140%; /* 19.6px */
//     }

//     .VehicleContent {
//       display: flex;
//       padding: var(--Spacing-xs, 8px) var(--Spacing-sm, 16px) var(--Spacing-xs, 8px) var(--Spacing-xs, 8px);
//       align-items: center;
//       gap: 16px;
//       align-self: stretch;

//       .VehicleData {
//         display: flex;
//         flex-direction: column;
//         align-items: flex-start;

//         .Brand {
//           color: var(--text-icon-default-main, #292929);
//           font-variant-numeric: lining-nums tabular-nums;
//           font-feature-settings: 'ss01' on;

//           /* Body/Body 2/Medium */
//           font-family: "Mona Sans";
//           font-size: 14px;
//           font-style: normal;
//           font-weight: 500;
//           line-height: 140%; /* 19.6px */
//         }

//         .Name {
//           display: inline-flex;
//           gap: ${({ theme }) => theme.sizing.xxs}; 

//           .Subtitle {
//             color: var(--text-icon-default-main, #292929);
//             font-variant-numeric: lining-nums tabular-nums;
//             font-feature-settings: 'ss01' on;

//             /* Body/Body 1/Semibold */
//             font-family: "Mona Sans";
//             font-size: 16px;
//             font-style: normal;
//             font-weight: 600;
//             line-height: 150%; /* 24px */
//           }
//         }
//       }

//       .VehicleImage {
//         width: 80px;
//         height: 80px;
//         border-radius: var(--Spacing-xxs, 4px);
//       }
//     }
//   }
// `;

// const TicketList = styled.ul`
//   padding: 16px;
//   display: flex;
//   flex-direction: column;
//   gap: 16px;
//   width: 100%;
// `;

// const TicketItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 12px;
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   background-color: #fff;
//   transition: background-color 0.2s ease-in-out;
  
//   &.selected {
//     border-color: ${theme.colors.primary};
//     background-color: #e6f7ff;
//   }

//   &:hover {
//     background-color: #f9f9f9;
//   }

//   .TicketContent {
//     display: flex;
//     flex-direction: column;
//     gap: 4px;
//   }

//   .SelectedIndicator {
//     font-size: 20px;
//     color: ${theme.colors.primary};
//   }

//   .Label {
//     color: ${theme.colors.primary};
//     cursor: pointer;
//   }
// `;

// const EventCounter = styled.div`
//   display: flex;
//   flex-direction: row;
//   gap: 16px;
// `;

// const URLSection = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
// `;

// const VehicleCard = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 16px;
//   border: 1px solid ${({ theme }) => theme.border.defaultWeak};
//   padding: 16px;
//   border-radius: 8px;
// `;

// const VehicleInfo = styled.div`
//   display: flex;
//   flex-direction: column;
// `;
