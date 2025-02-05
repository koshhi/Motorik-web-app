// frontend/src/components/Modal/PaymentModal.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Modal from './Modal';
import styled from 'styled-components';
import Button from '../Button/Button';
import Typography from '../Typography';

const PaymentModal = ({ onPaymentSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // Confirmamos el pago sin redirección (usando redirect: 'if_required')
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required'
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
      setLoading(false);
    }
  };

  return (
    <Modal title="Confirmar Pago" onClose={onClose} maxWidth="500px">
      <Form onSubmit={handleSubmit}>
        {/* El PaymentElement usará la apariencia configurada en Elements */}
        <PaymentElement />
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        <Button type="submit" disabled={!stripe || loading}>
          {loading ? 'Procesando...' : 'Pagar'}
        </Button>
      </Form>
    </Modal>
  );
};

PaymentModal.propTypes = {
  onPaymentSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px;
`;

const ErrorText = styled.p`
  color: red;
`;

export default PaymentModal;
