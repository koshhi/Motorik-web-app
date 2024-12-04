// hooks/useEventActions.js
import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';
import { useEventContext } from '../context/EventContext';

export const useEventActions = (eventId) => {
  const { eventDetails, setEventDetails } = useEventContext();

  const updateAttendees = (attendeeId, status) => {
    const updatedAttendees = eventDetails.attendees.map((attendee) =>
      attendee._id === attendeeId ? { ...attendee, status } : attendee
    );
    setEventDetails({ ...eventDetails, attendees: updatedAttendees });
  };

  const handleApprove = async (attendeeId) => {
    try {
      const response = await axiosClient.post(`/api/events/${eventId}/attendees/${attendeeId}/approve`);
      if (response.data.success) {
        toast.success(response.data.message);
        updateAttendees(attendeeId, 'attending');
      }
    } catch (error) {
      toast.error('Error al aprobar la inscripción.');
    }
  };

  const handleReject = async (attendeeId) => {
    try {
      const response = await axiosClient.post(`/api/events/${eventId}/attendees/${attendeeId}/reject`);
      if (response.data.success) {
        toast.success(response.data.message);
        updateAttendees(attendeeId, 'not attending');
      }
    } catch (error) {
      toast.error('Error al rechazar la inscripción.');
    }
  };

  return { handleApprove, handleReject };
};
