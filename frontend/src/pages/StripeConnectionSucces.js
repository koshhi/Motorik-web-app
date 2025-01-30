// src/pages/StripeConnectionSuccess.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button/Button';
import Typography from '../components/Typography';
import styled from 'styled-components';

function StripeConnectionSuccess() {
  const navigate = useNavigate();
  const { user, stripeStatus, refreshStripeStatus } = useAuth();

  // Al montar la pantalla, forzar la verificación real
  useEffect(() => {
    if (user) {
      refreshStripeStatus(user.id);
    }
  }, [user, refreshStripeStatus]);

  const handleGoToSettings = () => {
    if (user) {
      navigate(`/user/${user.id}/settings`);
    } else {
      navigate('/');
    }
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  return (
    <Container>
      <Typography as="h2" $variant="title-3-semibold">
        ¡Volviste de Stripe!
      </Typography>

      {/* Mensaje condicional según chargesEnabled */}
      {stripeStatus.loading ? (
        <Typography as="p">Verificando tu cuenta de Stripe...</Typography>
      ) : stripeStatus.chargesEnabled ? (
        <Typography as="p">
          Tu cuenta de Stripe está habilitada para recibir pagos.
        </Typography>
      ) : (
        <Typography as="p">
          Parece que aún no está habilitado para cobros (revisa tu configuración).
        </Typography>
      )}

      <Actions>
        <Button onClick={handleGoToSettings}>Volver a Configuración</Button>
        <Button $variant="outline" onClick={handleCreateEvent}>
          Crear un Evento
        </Button>
      </Actions>
    </Container>
  );
}

export default StripeConnectionSuccess;

const Container = styled.div`
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;
