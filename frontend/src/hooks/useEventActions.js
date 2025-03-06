// hooks/useEventActions.js
import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';
import { useEventContext } from '../context/EventContext';

export const useEventActions = (eventId) => {
  // Usamos updateEventDetails que es la función definida en el contexto
  const { eventDetails, updateEventDetails } = useEventContext();

  // Función para actualizar el registro de asistentes en el contexto
  const updateAttendees = (attendeeId, status) => {
    console.log('[updateAttendees] Actualizando attendee:', attendeeId, 'con estado:', status);
    const updatedAttendees = eventDetails.attendees.map((attendee) =>
      attendee._id === attendeeId ? { ...attendee, status } : attendee
    );
    updateEventDetails({ ...eventDetails, attendees: updatedAttendees });
    console.log('[updateAttendees] Nuevo eventDetails:', { ...eventDetails, attendees: updatedAttendees });
  };

  const handleApprove = async (attendeeId) => {
    try {
      console.log('[handleApprove] Iniciando aprobación para attendee:', attendeeId);
      const response = await axiosClient.post(`/api/events/${eventId}/attendees/${attendeeId}/approve`);
      console.log('[handleApprove] Respuesta del servidor:', response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        if (response.data.event) {
          console.log('[handleApprove] Actualizando eventDetails con data del servidor.');
          updateEventDetails(response.data.event);
        } else {
          updateAttendees(attendeeId, 'attending');
        }
      }
    } catch (error) {
      console.error('[handleApprove] Error en aprobación:', error);
      toast.error('Error al aprobar la inscripción.');
    }
  };

  const handleReject = async (attendeeId) => {
    try {
      console.log('[handleReject] Iniciando rechazo para el attendee:', attendeeId);
      const response = await axiosClient.post(`/api/events/${eventId}/attendees/${attendeeId}/reject`);
      console.log('[handleReject] Respuesta del servidor:', response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        if (response.data.event) {
          console.log('[handleReject] Actualizando eventDetails con la data del servidor.');
          updateEventDetails(response.data.event);
        } else {
          updateAttendees(attendeeId, 'not attending');
        }
      }
    } catch (error) {
      console.error('[handleReject] Error en rechazo:', error);
      toast.error('Error al rechazar la inscripción.');
    }
  };


  return { handleApprove, handleReject };
};
