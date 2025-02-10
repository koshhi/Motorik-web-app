// src/pages/EnrollmentDetails.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useEnrollmentDetails from '../hooks/useEnrollmentDetails.js';
import MainNavbar from '../components/Navbar/MainNavbar';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { theme } from '../theme';
import Typography from '../components/Typography.js';

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
      <EnrollmentSection>
        <Container>
          <Typography
            as="h1"
            color={theme.colors.defaultMain}
            $variant="title-3-semibold"
          >
            Detalles de la Inscripción
          </Typography>
          <Typography as="p">
            {event.title}
          </Typography>

          {event.needsVehicle &&
            <Typography>
              Vehículo: {enrollment.vehicleId.brand} {enrollment.vehicleId.model}
            </Typography>
          }
          <Typography>
            Fecha de Inscripción: {new Date(enrollment.createdAt).toLocaleString()}
          </Typography>
        </Container>
      </EnrollmentSection>
    </>
  );
};

export default EnrollmentDetails;

// Styled Components (opcional)
const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const EnrollmentSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultMain};
`;