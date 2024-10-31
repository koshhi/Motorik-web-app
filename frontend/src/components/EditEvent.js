import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../api/axiosClient'; // Importación actualizada
import { useParams, useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import Button from '../components/Button/Button';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const eventFormRef = useRef();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axiosClient.get(`/api/events/${id}`); // Solicitud actualizada
        if (response.data.event) {
          setInitialData(response.data.event);
          if (eventFormRef.current) {
            eventFormRef.current.setInitialData(response.data.event);
          }
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        toast.error('Error al obtener los detalles del evento.');
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleDiscard = () => {
    navigate(`/events/manage/${id}`);
  };

  const handleSaveChanges = async () => {
    if (eventFormRef.current) {
      const formData = await eventFormRef.current.getFormData();
      if (!formData) {
        console.error('Errores en el formulario, no se puede enviar');
        toast.error('Por favor, corrige los errores en el formulario antes de enviar.');
        return;
      }

      try {
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        const response = await axiosClient.put(
          `/api/events/${id}`, // Solicitud actualizada
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.data.success) {
          toast.success('Evento actualizado exitosamente.');
          navigate(`/events/manage/${id}`);
        } else {
          console.error('Error actualizando el evento');
          toast.error('Hubo un error al actualizar el evento. Inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error actualizando el evento:', error);
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(`Error: ${error.response.data.message}`);
        } else {
          toast.error('Hubo un error al actualizar el evento. Inténtalo de nuevo.');
        }
      }
    }
  };

  return (
    <>
      <Topbar>
        <Container>
          <Heading>Editar evento</Heading>
          <Links>
            <Button size="default" $variant="outline" onClick={handleDiscard}>
              Descartar
            </Button>
            <Button size="default" $variant="default" onClick={handleSaveChanges}>
              Guardar Cambios
            </Button>
          </Links>
        </Container>
      </Topbar>
      {initialData && (
        <EventForm ref={eventFormRef} initialData={initialData} isEditMode={true} />
      )}
    </>
  );
};

export default EditEvent;

// Estilos (puedes mantener tus estilos existentes)


const Topbar = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};
  background: ${({ theme }) => theme.fill.defaultSubtle};
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
`;

const Container = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  max-width: 1400px;
  width: 100%;
`;

const Heading = styled.h1`
  color: ${({ theme }) => theme.colors.defaultStrong};
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
`;

const Links = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
