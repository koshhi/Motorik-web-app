// frontend/src/components/Enroll/PaymentStep.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import styled from 'styled-components';
import Typography from '../Typography';
import Button from '../Button/Button';
import axiosClient from '../../api/axiosClient';
import PaymentModal from '../Modal/PaymentModal';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../config/stripePromise';

const PaymentStep = ({ eventId, ticket, onPaymentSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const handleCreatePaymentIntent = async () => {
    setLoading(true);
    try {
      console.log('Creando PaymentIntent para eventId:', eventId, 'ticketId:', ticket._id);
      const response = await axiosClient.post('/api/stripe/create-payment-intent', {
        eventId,
        ticketId: ticket._id,
      });
      console.log('Respuesta de create-payment-intent:', response.data);
      if (response.data.success) {
        // Guardamos el clientSecret para poder inicializar Elements
        setClientSecret(response.data.clientSecret);
      } else {
        alert(response.data.message || 'Error al crear el pago.');
      }
    } catch (error) {
      console.error('Error creando PaymentIntent:', error);
      alert('Error al crear el pago.');
    } finally {
      setLoading(false);
    }
  };

  // Una vez obtenido el clientSecret, renderizamos el PaymentModal envuelto en un proveedor de Elements
  if (clientSecret) {
    console.log('ClientSecret obtenido:', clientSecret);
    const elementsOptions = {
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#10110f',
          // fontFamily: 'Ideal Sans, system-ui, sans-serif',
          fontFamily: 'Mona Sans, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px'
        }
      }
    };

    return (
      <Elements stripe={stripePromise} options={elementsOptions}>
        <PaymentModal
          // onPaymentSuccess={(paymentIntent) => {
          //   console.log('Pago confirmado con PaymentIntent:', paymentIntent);
          //   onPaymentSuccess(paymentIntent);
          // }}
          onPaymentSuccess={(paymentIntent) => {
            console.log('Pago confirmado con PaymentIntent:', paymentIntent);
            // Al confirmarse el pago, llamamos al callback que en el flujo disparará la inscripción.
            onPaymentSuccess(paymentIntent);
          }}
          onClose={onCancel}
        />
      </Elements>
    );
  }

  return (
    <Modal title="Pago" onClose={onCancel} maxWidth="500px">
      <Container>
        <Typography $variant="body-1-regular">
          Para completar la inscripción, realiza el pago de {ticket.price} €.
        </Typography>
        <Button onClick={handleCreatePaymentIntent} disabled={loading}>
          {loading ? 'Procesando...' : 'Confirmar Pago'}
        </Button>
        <Button onClick={onCancel} $variant="outline">
          Cancelar
        </Button>
      </Container>
    </Modal>
  );
};

PaymentStep.propTypes = {
  eventId: PropTypes.string.isRequired,
  ticket: PropTypes.object.isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PaymentStep;

const Container = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
