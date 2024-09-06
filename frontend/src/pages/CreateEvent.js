import React, { useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import Button from '../components/Button/Button';


// const CreateEvent = () => {
//   const navigate = useNavigate();
//   const formRef = useRef(null);

//   const handleDiscard = () => {
//     navigate('/');
//   };

//   const handleCreateEvent = async () => {
//     if (formRef.current) {
//       const formData = await formRef.current.submitForm();
//       console.log({ formData });

//       if (!formData) return; // Detener si no se obtuvo formData

//       try {
//         const token = localStorage.getItem('authToken');

//         const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data.success) {
//           navigate('/');
//         } else {
//           console.error('Failed to create event');
//         }
//       } catch (error) {
//         console.error('Error creating event:', error);
//       }
//     }
//   };

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
          <Heading>Crear Evento</Heading>
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
    font-size: 20px;
    line-height: 100%;
    margin: unset;
`;

export const Links = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;