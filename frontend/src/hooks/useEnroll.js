// hooks/useEnroll.js

import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

/**
 * Hook para manejar la inscripción de un usuario en un evento.
 * @param {string} eventId - ID del evento.
 * @param {object} user - Objeto del usuario actual.
 * @param {function} onSuccess - Callback que se ejecuta al inscribirse exitosamente.
 * @returns {object} { enroll, loadingEnroll, errorEnroll }
 */
const useEnroll = (eventId, user, onSuccess) => {
  const [loadingEnroll, setLoadingEnroll] = useState(false);
  const [errorEnroll, setErrorEnroll] = useState(null);

  /**
   * Función para inscribir al usuario en el evento.
   * @param {string} vehicleId - ID del vehículo seleccionado.
   * @param {string} ticketId - ID del ticket seleccionado.
   */
  const enroll = async (vehicleId, ticketId) => {
    setLoadingEnroll(true);
    setErrorEnroll(null);

    try {
      // Solicitud corregida
      const response = await axiosClient.post(`/api/events/enroll/${eventId}`, {
        vehicleId,
        ticketId,
      });

      // Verifica si la inscripción fue exitosa
      if (response.data.success) {
        toast.success(response.data.message || 'Inscripción exitosa.');
        if (onSuccess) {
          onSuccess(response.data.event); // Actualiza el estado del evento en el componente
        }
      } else {
        // Maneja errores devueltos por el servidor
        setErrorEnroll(response.data.message || 'No se pudo inscribir al evento.');
        toast.error(response.data.message || 'No se pudo inscribir al evento.');
      }
    } catch (error) {
      // Maneja errores de red u otros errores inesperados
      console.error('Error al inscribirse en el evento:', error);
      setErrorEnroll('Error al inscribirse en el evento.');
      toast.error('Error al inscribirse en el evento.');
    } finally {
      setLoadingEnroll(false);
    }
  };

  return { enroll, loadingEnroll, errorEnroll };
};

export default useEnroll;
