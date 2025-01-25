// // pages/CreateStripeAccount.js
// import React, { useState } from 'react';
// import { useStripeConnect } from '../hooks/useStripeConnect';
// import { ConnectComponentsProvider, ConnectAccountOnboarding } from '@stripe/react-connect-js';
// import { useNavigate } from 'react-router-dom';
// import Typography from '../components/Typography';
// import Button from '../components/Button/Button';
// import styled from 'styled-components';

// function CreateStripeAccount() {
//   const navigate = useNavigate();


//   const [connectedAccountId, setConnectedAccountId] = useState(null);
//   const [error, setError] = useState(false);
//   const [onboardingExited, setOnboardingExited] = useState(false);
//   const [accountCreatePending, setAccountCreatePending] = useState(false);

//   // Hook que inicializa Connect.js con el ID de la cuenta
//   const stripeConnectInstance = useStripeConnect(connectedAccountId);

//   // const handleSignUp = async () => {
//   //   try {
//   //     setAccountCreatePending(true);
//   //     setError(false);

//   //     // Llamada a tu backend: crea la cuenta vacía en Stripe
//   //     const resp = await fetch(`${process.env.REACT_APP_API_URL}/stripe/create-or-connect-account`, { method: 'POST' });
//   //     const json = await resp.json();

//   //     if (json.account) {
//   //       setConnectedAccountId(json.account);
//   //       console.log(json.account)  // 'acc_123...'
//   //     } else if (json.error) {
//   //       setError(true);
//   //     }
//   //   } catch (err) {
//   //     setError(true);
//   //     console.error('Error al crear cuenta:', err);
//   //   } finally {
//   //     setAccountCreatePending(false);
//   //   }
//   // };

//   const handleSignUp = async () => {
//     try {
//       setAccountCreatePending(true);
//       setError(false);

//       const resp = await fetch(`${process.env.REACT_APP_API_URL}/stripe/create-or-connect-account`, { 
//         method: 'POST', 
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId }) 
//       });
//       const json = await resp.json();

//       if (json.onboardingUrl) {
//         window.location.href = json.onboardingUrl; // Redirige al onboarding
//       } else if (json.error) {
//         setError(true);
//       }
//     } catch (err) {
//       setError(true);
//       console.error('Error al crear cuenta:', err);
//     } finally {
//       setAccountCreatePending(false);
//     }
//   };


//   // Función para redirigir a la página de inicio
//   const handleGoHome = () => {
//     navigate('/');
//   };

//   return (
//     <PageWrapper>
//       <Container>
//         {!connectedAccountId && (
//           <>
//             <Typography as="h4" $variant="title-5-semibold">
//               Conecta tu cuenta de Stripe
//             </Typography>
//             <Typography as="p">
//               Utilizamos Stripe como nuestro procesador de pagos. Conéctate o configura una cuenta
//               de Stripe para comenzar a aceptar pagos.
//             </Typography>
//           </>
//         )}

//         {!connectedAccountId && !accountCreatePending && (
//           <Button onClick={handleSignUp}>Crear cuenta de Stripe</Button>
//         )}

//         {accountCreatePending && (
//           <Typography as="p">Creando una cuenta conectada...</Typography>
//         )}

//         {error && (
//           <Typography as="p" style={{ color: 'red' }}>
//             Ocurrió un error al crear la cuenta
//           </Typography>
//         )}

//         {/* Cuando tenemos la cuenta creada pero no se ha inicializado Connect.js */}
//         {connectedAccountId && !stripeConnectInstance && (
//           <Typography as="h4">
//             Añade tu información para empezar a recibir pagos
//           </Typography>
//         )}

//         {/* Cuando ya está inicializado Connect.js (obtuvimos client_secret) */}
//         {stripeConnectInstance && (
//           <>
//             <Typography as="h4" $variant="title-5-semibold">
//               Configura tu cuenta
//             </Typography>
//             <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
//               <ConnectAccountOnboarding
//                 onExit={() => {
//                   console.log('Onboarding finalizado.');
//                   setOnboardingExited(true);
//                 }}
//               />
//             </ConnectComponentsProvider>
//           </>
//         )}
//         {/* 
//         {onboardingExited && (
//           <Typography as="p">El proceso de onboarding se ha cerrado.</Typography>
//         )} */}

//         {onboardingExited && (
//           <>
//             <Typography as="p">El proceso de onboarding se ha cerrado.</Typography>
//             <Button onClick={handleGoHome}>Volver a inicio</Button>
//           </>
//         )}

//         {/* Info dev: mostrar el ID de la cuenta creada */}
//         {connectedAccountId && (
//           <Typography as="p">
//             Connected account ID: {connectedAccountId}
//           </Typography>
//         )}

//       </Container>
//     </PageWrapper>
//   );
// }

// export default CreateStripeAccount;

// // Ejemplo de estilos
// const PageWrapper = styled.div`
//   width: 100%;
//   padding: 24px;
// `;

// const Container = styled.div`
//   max-width: 600px;
//   margin: 0 auto;
//   background: #fff;
//   padding: 24px;
//   border-radius: 8px;
// `;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripeConnect } from '../hooks/useStripeConnect';
import { ConnectComponentsProvider, ConnectAccountOnboarding } from '@stripe/react-connect-js';
import Typography from '../components/Typography';
import Button from '../components/Button/Button';
import styled from 'styled-components';

function CreateStripeAccount() {
  const navigate = useNavigate();
  const [connectedAccountId, setConnectedAccountId] = useState(null);
  const [error, setError] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [accountCreatePending, setAccountCreatePending] = useState(false);

  const stripeConnectInstance = useStripeConnect(connectedAccountId);

  const handleSignUp = async () => {
    try {
      setAccountCreatePending(true);
      setError(false);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/stripe/create-or-connect-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "your-user-id" }), // Reemplaza con la lógica para obtener el ID del usuario
      });

      const data = await response.json();

      if (data.onboardingUrl) {
        window.location.href = data.onboardingUrl; // Redirige al onboarding
      } else if (data.connectedAccountId) {
        setConnectedAccountId(data.connectedAccountId);
      } else if (data.error) {
        setError(true);
      }
    } catch (err) {
      setError(true);
      console.error('Error al crear cuenta:', err);
    } finally {
      setAccountCreatePending(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <PageWrapper>
      <Container>
        {!connectedAccountId && (
          <>
            <Typography as="h4" $variant="title-5-semibold">
              Conecta tu cuenta de Stripe
            </Typography>
            <Typography as="p">
              Utilizamos Stripe como nuestro procesador de pagos. Conéctate o configura una cuenta de Stripe para comenzar a aceptar pagos.
            </Typography>
            {!accountCreatePending && (
              <Button onClick={handleSignUp}>Crear cuenta de Stripe</Button>
            )}
            {accountCreatePending && <Typography as="p">Creando una cuenta conectada...</Typography>}
          </>
        )}

        {error && (
          <Typography as="p" style={{ color: 'red' }}>
            Ocurrió un error al crear la cuenta.
          </Typography>
        )}

        {connectedAccountId && !stripeConnectInstance && (
          <Typography as="h4">
            Añade tu información en Stripe para activar los pagos.
          </Typography>
        )}

        {stripeConnectInstance && (
          <>
            <Typography as="h4" $variant="title-5-semibold">
              Configura tu cuenta
            </Typography>
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
          <>
            <Typography as="p">El proceso de onboarding se ha cerrado.</Typography>
            <Button onClick={handleGoHome}>Volver a inicio</Button>
          </>
        )}

        {connectedAccountId && (
          <Typography as="p">
            Connected account ID: {connectedAccountId}
          </Typography>
        )}
      </Container>
    </PageWrapper>
  );
}

export default CreateStripeAccount;

const PageWrapper = styled.div`
  width: 100%;
  padding: 24px;
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
`;