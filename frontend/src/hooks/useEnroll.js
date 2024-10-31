// src/hooks/useEnroll.js
import { useState } from 'react';
import AxiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const useEnroll = (eventId, user, onEnrollSuccess) => {
  const [loadingEnroll, setLoadingEnroll] = useState(false);
  const [errorEnroll, setErrorEnroll] = useState(null);

  const enroll = async (vehicleId) => {
    if (!user) {
      setErrorEnroll('Debes estar autenticado para inscribirte en un evento.');
      toast.error('Debes estar autenticado para inscribirte en un evento.');
      return;
    }

    if (!vehicleId) {
      setErrorEnroll('Debe seleccionar un vehículo para inscribirse.');
      toast.error('Debe seleccionar un vehículo para inscribirse.');
      return;
    }

    setLoadingEnroll(true);
    setErrorEnroll(null);

    try {
      const response = await AxiosClient.post(`/api/events/enroll/${eventId}`, {
        vehicleId,
      });

      if (response.data.success) {
        // Llamar a la función de éxito con el evento actualizado
        if (onEnrollSuccess) onEnrollSuccess(response.data.event);
        toast.success(response.data.message);
      } else {
        setErrorEnroll(response.data.message || 'Hubo un error al inscribirse en el evento.');
        toast.error(response.data.message || 'Hubo un error al inscribirse en el evento.');
      }
    } catch (err) {
      console.error('Error enrolling in event:', err);
      const message = err.response?.data?.message || 'Hubo un error al inscribirse en el evento.';
      setErrorEnroll(message);
      toast.error(message);
    } finally {
      setLoadingEnroll(false);
    }
  };

  return { enroll, loadingEnroll, errorEnroll };
};

export default useEnroll;
