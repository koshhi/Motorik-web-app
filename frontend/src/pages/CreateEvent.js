import React, { useRef, useState } from 'react';
import axiosClient from '../api/axiosClient';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import Button from '../components/Button/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Typography from '../components/Typography';

const CreateEvent = () => {
  const { t } = useTranslation('createEvent');
  const { user } = useAuth();
  const navigate = useNavigate();
  const eventFormRef = useRef();
  const [loadingCreate, setLoadingCreate] = useState(false);

  const handleDiscard = () => {
    navigate('/');
  };

  const handleCreateEvent = async () => {
    if (loadingCreate) return;
    if (eventFormRef.current) {
      setLoadingCreate(true);
      try {
        const formData = await eventFormRef.current.getFormData();

        if (!formData) {
          console.error('Errores en el formulario, no se puede enviar');
          setLoadingCreate(false);
          return;
        }

        // Verificar que si hay tickets de pago, el usuario tenga activados los cobros
        const hasPaidTicket = formData.get('tickets').includes('"type":"paid"');
        if (hasPaidTicket && (!user.stripeConnectedAccountId || !user.chargesEnabled)) {
          toast.error('No puedes crear eventos de pago sin tener una cuenta de Stripe validada y con cobros activados. Por favor, activa los pagos en tu configuración.');
          setLoadingCreate(false);
          return;
        }

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
      } finally {
        setLoadingCreate(false);
      }
    }
  };

  return (
    <>
      <Topbar>
        <Container>
          <Typography as="p" $variant="title-4-semibold">{t('createEventPage.title')}</Typography>
          <Links>
            <Button size="default" $variant="outline" onClick={handleDiscard}>
              {t('createEventPage.discard')}
            </Button>
            <Button
              size="default"
              $variant="default"
              onClick={handleCreateEvent}
              disabled={loadingCreate}
            >
              {loadingCreate ? t('createEventPage.creating') : t('createEventPage.create')}
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

export const Links = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;