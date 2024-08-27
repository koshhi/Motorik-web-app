import React, { useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm/EventForm';
import Button from '../components/Button/Button';


const CreateEvent = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleDiscard = () => {
    navigate('/');
  };

  const handleCreateEvent = () => {
    if (formRef.current) {
      formRef.current.submitForm(); // Llama a la función submitForm del formulario
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
      <EventForm ref={formRef} />
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
    max-width: 1248px;
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