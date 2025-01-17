import React, { useState } from 'react';
import { useStripeConnect } from '../../hooks/useStripeConnect';
import { ConnectComponentsProvider, ConnectAccountOnboarding } from '@stripe/react-connect-js';
import styled from 'styled-components';
import Typography from '../Typography';
import Button from '../Button/Button';

function StripeOnboardingPage({ onClose }) {
  const [connectedAccountId, setConnectedAccountId] = useState(null);
  const [error, setError] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [accountCreatePending, setAccountCreatePending] = useState(false);

  // Este hook inicializa Connect.js con el ID de la cuenta
  const stripeConnectInstance = useStripeConnect(connectedAccountId);

  const handleSignUp = async () => {
    setAccountCreatePending(true);
    setError(false);

    try {
      // const resp = await fetch('/stripe/account', { method: 'POST' });
      const resp = await fetch(`${process.env.REACT_APP_API_URL}/stripe/account`, { method: 'POST' })
      const json = await resp.json();

      if (json.account) {
        setConnectedAccountId(json.account);  // 'acc_123...'
      } else if (json.error) {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.error('Error al crear cuenta:', error);
    } finally {
      setAccountCreatePending(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        {!connectedAccountId &&
          <>
            <Button onClick={onClose}>X</Button>

            <IntegrationIcon src="/icons/motorik-stripe-connect.svg" alt="Stripe Integration" />
            <Typography as="h4" $variant="title-5-semibold">Comienza a recibir pagos en 5 minutos.</Typography>
            <Typography as="p">Utilizamos Stripe como nuestro procesador de pagos. Conéctate o configura una cuenta de Stripe para comenzar a aceptar pagos</Typography>
          </>
        }

        {/* Botón para crear cuenta si no la tienes */}
        {!connectedAccountId && !accountCreatePending && (
          <Button onClick={handleSignUp}>
            Conectar con Stripe
          </Button>
        )}

        {accountCreatePending &&
          <Typography as="p">Creando una cuenta conectada...</Typography>
        }

        {error && <Typography as="p">Ocurrió un error</Typography>}

        {/* Muestra Connect.js Onboarding cuando ya tenemos connectedAccountId */}

        {connectedAccountId && !stripeConnectInstance && (
          <h2>Add info to start accepting money</h2>
        )}

        {stripeConnectInstance && (
          <>
            <Typography as="h4" $variant="title-5-semibold">Crea tu cuenta con Stripe</Typography>
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectAccountOnboarding
                onExit={() => {
                  console.log('Onboarding finalizado.');
                  setOnboardingExited(true);
                }}
              />
            </ConnectComponentsProvider>
          </>
        )}

        {onboardingExited && (
          <p>The Account Onboarding component has exited.</p>
        )}

        {/* Info dev para dev */}
        {connectedAccountId && (
          <div>
            <p>Connected account ID: {connectedAccountId}</p>
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

export default StripeOnboardingPage;


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const IntegrationIcon = styled.img`
  width: 100%;
  max-height: 68px;
`;
