import React, { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import MainNavbar from '../components/Navbar/MainNavbar';
import EventManagementHeader from '../components/EventManagementHeader';
import styled from 'styled-components';
import axiosClient from '../api/axiosClient';
// import { useAuth } from '../context/AuthContext';
import { EventProvider } from '../context/EventContext';


const EventManagement = () => {
  const { id } = useParams();
  // const { user } = useAuth();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosClient.get(`/api/events/${id}`);
        if (response.data.success) {
          setEventDetails(response.data.event);
        } else {
          setError(response.data.message || 'Error al obtener el evento.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error al obtener el evento.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!eventDetails) return <p>Evento no encontrado</p>;

  return (
    <>
      <MainNavbar />
      <EventProvider initialEventDetails={eventDetails}>
        <EventManagementHeader />
        <Outlet />
      </EventProvider>
    </>
  );
};

export default EventManagement;
