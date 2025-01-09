import React, { useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import Typography from '../Typography';
import { useStripe, useElements, OnboardingElement } from '@stripe/react-stripe-js';

const StripeOnboardingModal = ({ onClose }) => {
  useEffect(() => {
    // Aquí podrías inicializar o cargar la info necesaria para mostrar el formulario incrustado
    // Por ejemplo, si tu backend te devolvió una `url` (onboardingUrl),
    // podrías usar un iframe. O si usas OnboardingElement, renderizarlo.
  }, []);

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>X</CloseButton>
        <h2>Completa tu cuenta de Stripe</h2>
        <p>Por favor, rellena la información necesaria.</p>

        <OnboardingElement
          onComplete={(result) => {
            console.log('Onboarding completado:', result);
            onClose(); // cierra y refresca estado en el padre
          }}
        />

      </ModalContainer>
    </Overlay>
  );
};

export default StripeOnboardingModal;


const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  position: relative;
  width: 600px;
  max-width: 90%;
  background: white;
  padding: 24px;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
`;
