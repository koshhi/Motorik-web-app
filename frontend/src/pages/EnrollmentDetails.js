// src/pages/EnrollmentDetails.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useEnrollmentDetails from '../hooks/useEnrollmentDetails.js';
import MainNavbar from '../components/Navbar/MainNavbar';
import styled from 'styled-components';
import { toast } from 'react-toastify';

// Styled Components (opcional)
const Container = styled.div`
  padding: 20px;
  /* Otros estilos */
`;

const EnrollmentDetails = () => {
  const { id } = useParams(); // eventId
  const { enrollment, event, loading, error } = useEnrollmentDetails(id);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Error al cargar los detalles de inscripción.');
    }
  }, [error]);

  if (loading) return <p>Cargando detalles de inscripción...</p>;
  if (error) return <p>Error al cargar los detalles de inscripción.</p>;

  if (!enrollment) return <p>No tienes una inscripción en este evento.</p>;

  return (
    <>
      <MainNavbar />
      <Container>
        <h1>Detalles de tu Inscripción</h1>
        <p><strong>Evento:</strong> {event.title}</p>
        <p><strong>Vehículo:</strong> {enrollment.vehicleId.brand} {enrollment.vehicleId.model}</p>
        <p><strong>Fecha de Inscripción:</strong> {new Date(enrollment.createdAt).toLocaleString()}</p>
        {/* Otros detalles relevantes */}
      </Container>
    </>
  );
};

export default EnrollmentDetails;
