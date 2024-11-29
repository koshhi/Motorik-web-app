// components/Modal/ModalCheckout.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Typography from '../Typography';
import { theme } from '../../theme';

const ModalCheckout = ({
  eventImage,
  organizerImage,
  costSummary,
}) => {
  const { subTotal, tariffAmount, tariffPercentage, total } = costSummary;

  return (
    <CheckoutContainer>
      <EventCover>
        <EventImage src={eventImage} alt="Imagen del evento" />
        <OrganizerAvatar src={organizerImage} alt="Avatar del organizador" />
      </EventCover>

      <CheckoutList>
        <CheckoutListRow>
          <Typography $variant="body-1-semibold">Resumen de la inscripción:</Typography>
        </CheckoutListRow>
        <CheckoutListRow>
          <Typography $variant="body-2-semibold" color={theme.colors.defaultWeak}>Sub-total:</Typography>
          <Typography $variant="body-2-medium" color={theme.colors.defaultWeak}>{subTotal}€</Typography>
        </CheckoutListRow>
        <CheckoutListRow>
          <Typography $variant="body-2-semibold" color={theme.colors.defaultWeak}>Tarifa ({tariffPercentage}%)</Typography>
          <Typography $variant="body-2-medium" color={theme.colors.defaultWeak}>{tariffAmount}€ </Typography>
        </CheckoutListRow>
        <CheckoutListRow>
          <Typography $variant="body-1-semibold">Total</Typography>
          <Typography $variant="body-1-semibold">{total}€</Typography>
        </CheckoutListRow>
      </CheckoutList>
    </CheckoutContainer>
  );
};

ModalCheckout.propTypes = {
  eventImage: PropTypes.string.isRequired,
  organizerImage: PropTypes.string.isRequired,
  costSummary: PropTypes.shape({
    subTotal: PropTypes.number.isRequired,
    tariffPercentage: PropTypes.number.isRequired,
    tariffAmount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};

export default ModalCheckout;

// Styled Components
const CheckoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
  padding-bottom: ${({ theme }) => theme.sizing.lg};
  width: 280px;
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  border-left: 1px solid ${({ theme }) => theme.border.defaultSubtle};
`;

const EventCover = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
  position: relative;
  aspect-ratio: 4 / 3;
`;

const EventImage = styled.img`
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
  z-index: 1;
`;

const OrganizerAvatar = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.xs};
  position: absolute;
  left: ${({ theme }) => theme.sizing.xs};
  bottom: ${({ theme }) => theme.sizing.xs};
  border: 1px solid ${({ theme }) => theme.border.defaultMain};
  z-index: 2;
`;

const CheckoutList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const CheckoutListRow = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
