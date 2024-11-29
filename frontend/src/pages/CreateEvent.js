import React, { useRef } from 'react';
import axiosClient from '../api/axiosClient';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import Button from '../components/Button/Button';

const CreateEvent = () => {
  const navigate = useNavigate();
  const eventFormRef = useRef();

  const handleDiscard = () => {
    navigate('/');
  };

  const handleCreateEvent = async () => {
    if (eventFormRef.current) {
      const formData = await eventFormRef.current.getFormData();

      if (!formData) {
        console.error('Errores en el formulario, no se puede enviar');
        return;
      }

      // Mostrar el contenido de FormData (opcional)
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      try {
        const response = await axiosClient.post('/api/events', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          navigate(`/events/manage/${response.data.event.id}`);
        } else {
          console.error('Error en la creación del evento');
        }
      } catch (error) {
        console.error('Error creando el evento:', error);
      }
    }
  };

  return (
    <>
      <Topbar>
        <Container>
          <Heading>Crea un evento</Heading>
          <Links>
            <Button size="default" $variant="outline" onClick={handleDiscard}>
              Descartar
            </Button>
            <Button size="default" $variant="default" onClick={handleCreateEvent}>
              Crear Evento
            </Button>
          </Links>
        </Container>
      </Topbar>
      <EventForm ref={eventFormRef} />
    </>
  );
};


export default CreateEvent;

//Estilos del componente

export const Topbar = styled.header`
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

export const Container = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
    max-width: 1400px;
    width: 100%;
`;

export const Heading = styled.h1`
  color: ${({ theme }) => theme.colors.defaultStrong};
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;

  /* Titles/Desktop/Title 4/Semibold */
  font-family: "Mona Sans";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 28px */
`;

export const Links = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;