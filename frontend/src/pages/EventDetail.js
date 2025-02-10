// frontend/src/pages/EventDetail.js

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axiosClient from '../api/axiosClient';
import useEvent from '../hooks/useEvent';
import { useAuth } from '../context/AuthContext';
import MainNavbar from '../components/Navbar/MainNavbar';
import EventHeader from '../components/EventHeader/EventDetailHeader';
import EventDetailContent from '../components/EventContent/EventDetailContent';
import EventSummary from '../components/EventSummary/EventSummary';
import EventFixedAction from '../components/EventFixedAction';
import EventEnrollFlow from '../components/EventEnrollFlow';
import EnrollmentStatus from '../components/EventSummary/EnrollmentStatus';


const EventDetail = () => {
  const { id } = useParams();
  const { user, loading: loadingAuth } = useAuth();
  const { event, isOwner, loadingEvent, error, setEvent } = useEvent(id, user);
  const [showEnrollFlow, setShowEnrollFlow] = useState(false);

  // Función para inscribir al usuario; se espera que el endpoint devuelva el evento actualizado
  const enrollUser = async (ticket, vehicle) => {
    try {
      const response = await axiosClient.post(`/api/events/enroll/${event.id}`, {
        ticketId: ticket._id,
        vehicleId: vehicle ? vehicle._id : null,
      });
      if (response.data.success) {
        // Actualizamos el evento en el estado global (y por lo tanto en el contexto)
        setEvent(response.data.event);
        return response.data.event;
      } else {
        throw new Error(response.data.message || 'Error en la inscripción.');
      }
    } catch (err) {
      console.error('Error en enrollUser:', err);
      throw err;
    }
  };

  // Determinar si el usuario ya está inscrito
  const isEnrolled =
    event &&
    event.attendees &&
    event.attendees.some((att) => (att.userId._id || att.userId.id).toString() === user.id.toString());



  if (loadingAuth || loadingEvent) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar el evento: {error}</p>;
  if (!event) return <p>Evento no encontrado</p>;

  // Extraer coordenadas (si es necesario)
  const hasValidCoordinates =
    event.locationCoordinates &&
    Array.isArray(event.locationCoordinates.coordinates) &&
    event.locationCoordinates.coordinates.length === 2 &&
    typeof event.locationCoordinates.coordinates[0] === 'number' &&
    typeof event.locationCoordinates.coordinates[1] === 'number';
  const [lng, lat] = hasValidCoordinates ? event.locationCoordinates.coordinates : [undefined, undefined];

  // const eventLink = `${process.env.REACT_APP_CLIENT_URL}/events/${event.id}/${event.slug}`;

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
        handleEnroll={() => setShowEnrollFlow(true)}
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
            {isEnrolled && (
              <EnrollmentStatus
                enrollmentStatus={
                  event.attendees.find(
                    (att) => (att.userId._id || att.userId.id).toString() === user.id.toString()
                  )?.status
                }
                handleCancelEnrollment={() => {
                  /* Aquí se podría implementar la función para cancelar inscripción */
                }}
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
              mapCoordinates={{
                lat:
                  event.locationCoordinates && event.locationCoordinates.coordinates
                    ? event.locationCoordinates.coordinates[1]
                    : undefined,
                lng:
                  event.locationCoordinates && event.locationCoordinates.coordinates
                    ? event.locationCoordinates.coordinates[0]
                    : undefined,
              }}
              attendees={event.attendees}
              attendeesCount={event.attendeesCount}
              organizer={event.owner}
            />
          </EventSummaryContainer>
        </GridContainer>
      </EventBody>
      <EventFixedAction
        eventName={event.title}
        eventDate={event.longDate}
        availableSeats={event.availableSeats}
        tickets={event.tickets}
        isEnrolled={isEnrolled}
        isOwner={isOwner}
        handleEnroll={() => setShowEnrollFlow(true)}
      />
      {showEnrollFlow && (
        <EventEnrollFlow
          event={event}
          enrollUser={enrollUser}
          onEnrollComplete={(updatedEvent) => setShowEnrollFlow(false)}
          onCancel={() => setShowEnrollFlow(false)}
        />
      )}
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


// // components/EventDetail/EventDetail.js

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import styled from 'styled-components';
// import { useAuth } from '../context/AuthContext';
// import axiosClient from '../api/axiosClient';
// import useEvent from '../hooks/useEvent';
// import useEnroll from '../hooks/useEnroll';
// import MainNavbar from '../components/Navbar/MainNavbar';
// import EventHeader from '../components/EventHeader/EventDetailHeader';
// import EventDetailContent from '../components/EventContent/EventDetailContent';
// import EventSummary from '../components/EventSummary/EventSummary';
// import EventFixedAction from '../components/EventFixedAction';
// import EnrollTicketModal from '../components/Modal/EnrollTicketModal';
// import EnrollConfirmationModal from '../components/Modal/EnrollConfirmationModal.js';
// import EnrollWithVehicleModal from '../components/Modal/EnrollWithVehicleModal.js';
// import EnrollmentStatus from '../components/EventSummary/EnrollmentStatus';
// import PaymentModal from '../components/Modal/PaymentModal';
// import { toast } from 'react-toastify';

// const EventDetail = () => {
//   const { id } = useParams();
//   const { user, loading: loadingAuth } = useAuth();
//   const { event, isOwner, loadingEvent, error, setEvent } = useEvent(id, user);
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [userEnrollment, setUserEnrollment] = useState(null);
//   const [selectedTicketId, setSelectedTicketId] = useState(null);

//   // Estados para modales
//   const [showTicketModal, setShowTicketModal] = useState(false);
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
//   const [showEnrollWithVehicleModal, setShowEnrollWithVehicleModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentClientSecret, setPaymentClientSecret] = useState(null);


//   // Estados para confirmación
//   const [enrollmentStatus, setEnrollmentStatus] = useState(null);
//   const [userEmail, setUserEmail] = useState('');
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [timeLeft, setTimeLeft] = useState('');

//   const { enroll, loadingEnroll, errorEnroll } = useEnroll(id, user, (updatedEvent) => {
//     // console.log('Evento actualizado después de inscripción:', updatedEvent);
//     setEvent(updatedEvent);
//     // console.log('Asistentes del evento actualizado:', updatedEvent.attendees);

//     // Cambiar la comparación para asegurar que ambos IDs sean cadenas
//     const enrolled = updatedEvent.attendees.find(att => {
//       const attendeeId = att.userId._id || att.userId.id;
//       const currentUserId = user._id || user.id;
//       // console.log('Comparando:', attendeeId, currentUserId);
//       return attendeeId.toString() === currentUserId.toString();
//     });

//     // console.log('Inscripción encontrada:', enrolled);

//     if (enrolled) {
//       console.log('Usuario inscrito correctamente:', enrolled);
//       setEnrollmentStatus(enrolled.status);
//       setUserEmail(user.email);

//       const vehicle = enrolled.vehicleId;
//       if (vehicle && vehicle._id) {
//         setSelectedVehicle(vehicle);
//       } else {
//         console.warn('Vehículo seleccionado no encontrado en los datos del evento.');
//         setSelectedVehicle(null);
//       }

//       // Mostrar el modal de confirmación **solo aquí**
//       setShowConfirmationModal(true);
//     } else {
//       console.warn('No se encontró la inscripción del usuario en el evento actualizado.');
//     }
//   });


//   // Dentro del useEffect donde se actualiza userEnrollment
//   useEffect(() => {
//     // console.log('Evento en estado actual:', event);
//     // console.log('Usuario:', user);
//     if (event && user) {
//       const enrolled = event.attendees.find(attendee => {
//         const attendeeId = attendee.userId._id || attendee.userId.id;
//         const currentUserId = user._id || user.id;
//         console.log('Comparando en useEffect:', attendeeId, currentUserId);
//         return attendeeId.toString() === currentUserId.toString();
//       });

//       if (enrolled) {
//         setIsEnrolled(true);
//         setUserEnrollment(enrolled);
//         setEnrollmentStatus(enrolled.status);

//         const vehicle = enrolled.vehicleId;
//         if (vehicle && vehicle._id) {
//           setSelectedVehicle(vehicle);
//         } else {
//           console.warn('Vehículo seleccionado no encontrado en los datos del evento.');
//           setSelectedVehicle(null);
//         }

//       } else {
//         setIsEnrolled(false);
//         setUserEnrollment(null);
//         setEnrollmentStatus(null);
//         console.warn('No se encontró la inscripción del usuario en el evento actualizado.');
//       }
//     }

//     // console.log('Evento actualizado:', event);

//   }, [event, user, isOwner]);


//   const intervalIdRef = useRef(null);

//   // Implementar el contador de tiempo
//   useEffect(() => {
//     if (event && event.startDate) {
//       const formatTimeLeft = (days, hours, minutes, seconds) => {
//         const parts = [];
//         if (days > 0) parts.push(`${days}d`);
//         if (hours > 0) parts.push(`${hours}h`);
//         if (minutes > 0) parts.push(`${minutes}m`);
//         if (seconds > 0) parts.push(`${seconds}s`);
//         return parts.join(' ');
//       };

//       const updateTimeLeft = () => {
//         const now = new Date();
//         const eventDate = new Date(event.startDate);
//         const diff = eventDate - now;

//         if (diff <= 0) {
//           setTimeLeft('El evento ha comenzado');
//           if (intervalIdRef.current) {
//             clearInterval(intervalIdRef.current);
//             intervalIdRef.current = null;
//           }
//           return;
//         }

//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//         const minutes = Math.floor((diff / (1000 * 60)) % 60);
//         const seconds = Math.floor((diff / 1000) % 60);
//         setTimeLeft(formatTimeLeft(days, hours, minutes, seconds));
//       };

//       // Llamar inmediatamente para no esperar 1 segundo
//       updateTimeLeft();

//       // Establecer el intervalo y guardarlo en el ref
//       intervalIdRef.current = setInterval(updateTimeLeft, 1000);

//       // Limpiar el intervalo al desmontar o actualizar el evento
//       return () => {
//         if (intervalIdRef.current) {
//           clearInterval(intervalIdRef.current);
//           intervalIdRef.current = null;
//         }
//       };
//     }
//   }, [event]);

//   // Nueva función para crear PaymentIntent para tickets de pago
//   const createPaymentIntent = async (ticketId) => {
//     try {
//       const response = await axiosClient.post('/stripe/create-payment-intent', { eventId: event.id, ticketId });
//       if (response.data.success) {
//         setPaymentClientSecret(response.data.clientSecret);
//         setShowPaymentModal(true);
//       } else {
//         toast.error(response.data.message || 'Error al crear el pago.');
//       }
//     } catch (error) {
//       console.error("Error al crear PaymentIntent:", error);
//       toast.error("Error al crear el pago.");
//     }
//   };


//   // Manejar inscripción
//   const handleEnroll = () => {
//     if (!user) {
//       toast.error('Debes iniciar sesión para inscribirte.');
//       return;
//     }

//     const tickets = event.tickets;

//     // Si hay un único ticket gratis sin aprobación => inscripción directa
//     if (tickets.length === 1 && tickets[0].type === 'free' && !tickets[0].approvalRequired) {
//       const singleTicket = tickets[0];
//       // console.log('Single ticket:', singleTicket);

//       if (event.needsVehicle) {
//         // Abrimos el modal de inscripción con vehículos
//         setSelectedTicketId(singleTicket._id);
//         setShowEnrollWithVehicleModal(true);
//       } else {
//         // No necesita vehículo
//         setSelectedTicketId(singleTicket._id);
//         enroll(null, singleTicket._id);
//       }

//     } else {
//       // Caso donde hay más de un ticket, o ticket pago/aprobación:
//       setShowTicketModal(true);
//     }
//   };

//   // Manejar selección de ticket
//   const handleTicketSelect = (ticketId) => {
//     console.log("Seleccionando Ticket ID:", ticketId);
//     const selectedTicket = event.tickets.find(t => t._id === ticketId);
//     if (!selectedTicket) {
//       toast.error('Ticket seleccionado no encontrado.');
//       return;
//     }
//     if (selectedTicket.availableSeats <= 0) { // Asegúrate de que availableSeats existe en los tickets
//       toast.error('No hay asientos disponibles para este ticket.');
//       return;
//     }
//     setSelectedTicketId(ticketId);
//     console.log("Estado selectedTicketId actualizado a:", ticketId);
//   };

//   // Cancelar inscripción
//   const handleCancelEnrollment = async () => {
//     try {
//       const response = await axiosClient.post(`/api/events/${event.id}/attendees/cancel`);
//       console.log('Respuesta de cancelación:', response.data);
//       if (response.data.success) {
//         toast.success(response.data.message);
//         // Actualizar el estado localmente
//         setIsEnrolled(false);
//         setUserEnrollment(null);
//         setEnrollmentStatus(null);
//         // Actualizar el evento
//         setEvent(response.data.event);
//       }
//     } catch (error) {
//       console.error('Error al cancelar la inscripción:', error);
//       toast.error('Error al cancelar la inscripción.');
//     }
//   };

//   // Manejar inscripción completa desde EnrollWithVehicleModal
//   const handleEnrollmentComplete = (vehicle, ticketId) => { // Modificado para recibir ticketId
//     console.log('handleEnrollmentComplete called with vehicle:', vehicle);
//     console.log('handleEnrollmentComplete called with ticketId:', ticketId);
//     const selectedTicket = event.tickets.find(t => t._id === ticketId);
//     console.log('Selected ticket:', selectedTicket);
//     if (selectedTicket && vehicle && vehicle._id) {
//       enroll(vehicle._id, selectedTicket._id);
//       setShowEnrollWithVehicleModal(false);
//       setSelectedTicketId(null);
//     } else {
//       console.log('Inscription data incomplete');
//       toast.error('Datos de inscripción incompletos.');
//     }
//   };

//   // En el modal de selección de ticket, en el callback onContinue:
//   const handleTicketModalContinue = () => {
//     setShowTicketModal(false);
//     const selectedTicket = event.tickets.find(t => t._id === selectedTicketId);
//     if (selectedTicket.type === 'paid') {
//       if (event.needsVehicle) {
//         // Si el evento requiere vehículo, pasar al modal de selección de vehículo
//         setShowEnrollWithVehicleModal(true);
//       } else {
//         // Si no requiere vehículo, crear el PaymentIntent directamente
//         createPaymentIntent(selectedTicketId);
//       }
//     } else {
//       // Para tickets gratis
//       if (event.needsVehicle) {
//         setShowEnrollWithVehicleModal(true);
//       } else {
//         enroll(null, selectedTicketId);
//       }
//     }
//   };

//   // Renderizado condicional del PaymentModal para el flujo de pago
//   const handlePaymentSuccess = (paymentIntent) => {
//     // Una vez confirmado el pago, llamar a enroll (para tickets de pago sin vehículo, o para los que ya pasaron por el modal de vehículo)
//     const vehicleId = event.needsVehicle ? selectedVehicle?._id : null;
//     enroll(vehicleId, selectedTicketId);
//     setShowPaymentModal(false);
//     setSelectedTicketId(null);
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

//   // Construir enlace del evento
//   const eventLink = `${process.env.REACT_APP_CLIENT_URL}/events/${event.id}/${event.slug}`

//   return (
//     <>
//       <MainNavbar />
//       <EventHeader
//         title={event.title}
//         availableSeats={event.availableSeats}
//         eventType={event.eventType}
//         terrain={event.terrain}
//         manageLink={`/events/manage/${event.id}`}
//         isEnrolled={isEnrolled}
//         handleEnroll={handleEnroll}
//         eventId={event.id}
//         organizer={event.owner}
//         isOwner={isOwner}
//       />
//       <EventBody>
//         <GridContainer>
//           <EventDetailContent
//             image={event.image}
//             description={event.description}
//             organizer={event.owner}
//             tickets={event.tickets}
//           />
//           <EventSummaryContainer>
//             {enrollmentStatus && (
//               <EnrollmentStatus
//                 handleCancelEnrollment={handleCancelEnrollment}
//                 enrollmentStatus={userEnrollment?.status}
//               />
//             )}
//             <EventSummary
//               date={{
//                 monthDate: event.monthDate,
//                 dayDate: event.dayDate,
//                 partialDateStart: event.partialDateStart,
//                 partialDateEnd: event.partialDateEnd,
//               }}
//               location={event.location}
//               shortLocation={event.shortLocation}
//               mapCoordinates={{ lat, lng }}
//               attendees={event.attendees}
//               attendeesCount={event.attendeesCount}
//               organizer={event.owner}
//             />
//           </EventSummaryContainer>
//         </GridContainer>
//       </EventBody>

//       {showTicketModal && (
//         <EnrollTicketModal
//           tickets={event.tickets}
//           selectedTicketId={selectedTicketId}
//           handleTicketSelect={handleTicketSelect}
//           onClose={() => setShowTicketModal(false)}
//           onContinue={() => {
//             console.log("Tickets en TicketModal:", event.tickets);
//             console.log("selectedTicketId en TicketModal:", selectedTicketId);
//             setShowTicketModal(false);

//             // Verificar si necesita vehículo
//             if (event.needsVehicle) {
//               setShowEnrollWithVehicleModal(true);
//             } else {
//               // No necesita vehículo
//               enroll(null, selectedTicketId);
//               setSelectedTicketId(null);
//               setShowTicketModal(false);
//             }
//           }}
//           eventImage={event.image}
//           organizerImage={event.owner.userAvatar}
//         />
//       )}

//       {showEnrollWithVehicleModal && (
//         <EnrollWithVehicleModal
//           isOpen={showEnrollWithVehicleModal}
//           onClose={() => setShowEnrollWithVehicleModal(false)}
//           onEnroll={handleEnrollmentComplete}
//           eventId={event.id}
//           selectedTicketId={selectedTicketId}
//         />
//       )}

//       {showPaymentModal && paymentClientSecret && (
//         <PaymentModal
//           clientSecret={paymentClientSecret}
//           onPaymentSuccess={handlePaymentSuccess}
//           onClose={() => setShowPaymentModal(false)}
//         />
//       )}

//       {showConfirmationModal && (
//         <EnrollConfirmationModal
//           enrollmentStatus={enrollmentStatus}
//           userEmail={userEmail}
//           timeLeft={timeLeft}
//           eventLink={eventLink}
//           onClose={() => setShowConfirmationModal(false)}
//           selectedVehicle={selectedVehicle}
//           eventId={event.id}
//         />
//       )}


//       <EventFixedAction
//         eventName={event.title}
//         eventDate={event.longDate}
//         availableSeats={event.availableSeats}
//         tickets={event.tickets}
//       />
//     </>
//   );
// };

// export default EventDetail;

// // Styled Components
// const EventBody = styled.section`
//   background-color: ${({ theme }) => theme.fill.defaultMain};
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding-top: ${({ theme }) => theme.sizing.lg};
//   padding-bottom: 24rem;
// `;

// const GridContainer = styled.div`
//   width: 100%;
//   max-width: 1400px;
//   display: grid;
//   grid-template-columns: repeat(12, 1fr);
//   grid-gap: ${({ theme }) => theme.sizing.lg};
//   padding: 0 ${({ theme }) => theme.sizing.md};
// `;

// const EventSummaryContainer = styled.div`
//   grid-area: 1 / 8 / 2 / 13;
//   display: flex;
//   flex-direction: column;
//   gap: 24px;
// `;