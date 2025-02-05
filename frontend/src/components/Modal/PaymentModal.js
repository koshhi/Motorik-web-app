// frontend/src/components/Modal/PaymentModal.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../Button/Button';
import { toast } from 'react-toastify';

const PaymentModal = ({ clientSecret, onPaymentSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Puedes definir aquí una URL de retorno si deseas redirigir al usuario
        return_url: window.location.origin + '/payment-success',
      },
      redirect: 'if_required',
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success('Pago realizado exitosamente.');
      onPaymentSuccess(paymentIntent);
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" disabled={loading || !stripe}>
        {loading ? 'Procesando...' : 'Pagar'}
      </Button>
    </Form>
  );
};

export default PaymentModal;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
