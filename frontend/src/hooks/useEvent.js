// // src/hooks/useEvent.js
// import { useState, useEffect } from 'react';
// import AxiosClient from '../api/axiosClient';

// const useEvent = (id, user) => {
//   const [event, setEvent] = useState(null);
//   const [isOwner, setIsOwner] = useState(false);
//   const [loadingEvent, setLoadingEvent] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEventDetails = async () => {
//       setLoadingEvent(true);
//       try {
//         const response = await AxiosClient.get(`/api/events/${id}`);
//         setEvent(response.data.event);
//         setIsOwner(user && response.data.event.owner && response.data.event.owner.id === user.id);
//       } catch (err) {
//         console.error('Error fetching event details:', err);
//         setError(err);
//       } finally {
//         setLoadingEvent(false);
//       }
//     };

//     if (id) {
//       fetchEventDetails();
//     }
//   }, [id, user]);

//   return { event, isOwner, loadingEvent, error, setEvent };
// };

// export default useEvent;

// src/hooks/useEvent.js
import { useState, useEffect } from 'react';
import AxiosClient from '../api/axiosClient';

const useEvent = (eventId, user) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await AxiosClient.get(`/api/events/${eventId}`);
        if (response.data.success) {
          setEvent(response.data.event);
          setIsOwner(user && response.data.event.owner._id === user.id);
        } else {
          setError({ message: response.data.message || 'Error al obtener el evento.' });
        }
      } catch (err) {
        setError({ message: err.response?.data?.message || 'Error al obtener el evento.' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user]);

  return { event, isOwner, loadingEvent: loading, error, setEvent };
};

export default useEvent;

