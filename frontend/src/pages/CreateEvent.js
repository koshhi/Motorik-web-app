import React, { useRef } from 'react';
import axios from 'axios';
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
      const formData = await eventFormRef.current.submitForm();

      if (formData) {
        try {
          const authToken = localStorage.getItem('authToken');
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, formData, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (response.data.success) {
            // Manejar la redirección o mensaje de éxito aquí
            navigate('/');
          } else {
            // Manejar el error aquí
          }
        } catch (error) {
          console.error('Error creating event:', error);
        }
      }
    }
  };

  return (
    <>
      <Topbar>
        <Container>
          <Heading>Crea un evento</Heading>
          <Links>
            <Button size="default" variant="outline" onClick={handleDiscard}>Descartar</Button>
            <Button size="default" variant="default" onClick={handleCreateEvent}>Crear Evento</Button>
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