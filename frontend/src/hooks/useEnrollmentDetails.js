// src/hooks/useEnrollmentDetails.js
import { useState, useEffect } from 'react';
import AxiosClient from '../api/axiosClient';

const useEnrollmentDetails = (eventId) => {
  const [enrollment, setEnrollment] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const response = await AxiosClient.get(`/api/events/${eventId}/enrollment`);
        if (response.data.success) {
          setEnrollment(response.data.enrollment);
          setEvent(response.data.event);
        } else {
          setError({ message: response.data.message || 'Error al obtener la inscripción.' });
        }
      } catch (err) {
        setError({ message: err.response?.data?.message || 'Error al obtener la inscripción.' });
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [eventId]);

  return { enrollment, event, loading, error };
};

export default useEnrollmentDetails;
