import React, { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import MainNavbar from '../components/Navbar/MainNavbar';
import EventManagementHeader from '../components/EventManagementHeader';
import styled from 'styled-components';
import axiosClient from '../api/axiosClient';

const EventManagement = () => {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axiosClient.get(`/api/events/${id}`);
        setEventDetails(response.data.event);
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!eventDetails) return <p>Event not found</p>;

  return (
    <>
      <MainNavbar />
      <EventManagementHeader eventDetails={eventDetails} />
      <Outlet context={{ eventDetails }} />
    </>
  );
};

export default EventManagement;
