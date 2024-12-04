// components/PriceDisplay.js

import React from 'react';
import styled from 'styled-components';
import Typography from './Typography';
import { theme } from '../theme';
import PropTypes from 'prop-types';

const PriceDisplay = ({ tickets, showOptions = true }) => {
  const getPriceDisplay = () => {
    if (!tickets || tickets.length === 0) {
      return <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>Sold out</Typography>;
    }

    let freeTicketsCount = 0;
    let paidTicketsCount = 0;
    let lowestPrice = Infinity;

    tickets.forEach(ticket => {
      if (ticket.type === 'free') {
        freeTicketsCount += 1;
      } else if (typeof ticket.price === 'number') {
        paidTicketsCount += 1;
        if (ticket.price < lowestPrice) {
          lowestPrice = ticket.price;
        }
      }
    });

    const totalTicketsCount = freeTicketsCount + paidTicketsCount;

    // Solo Tickets Gratuitos
    if (freeTicketsCount > 0 && paidTicketsCount === 0) {
      if (freeTicketsCount === 1) {
        return (
          <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>
            Gratis
          </Typography>
        );
      } else {
        return (
          <>
            <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>Gratis</Typography>
            {showOptions && (
              <Typography $variant="body-2-medium" color={theme.colors.defaultWeak}>
                · {freeTicketsCount} opciones
              </Typography>
            )}
          </>
        );
      }
    }

    // Tickets Gratuitos y de Pago
    if (freeTicketsCount > 0 && paidTicketsCount > 0) {
      return (
        <>
          <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>Gratis</Typography>
          {showOptions && (
            <Typography $variant="body-2-medium" color={theme.colors.defaultWeak}>
              · {totalTicketsCount} opciones
            </Typography>
          )}
        </>
      );
    }

    // Un Solo Ticket de Pago
    if (paidTicketsCount === 1 && lowestPrice !== Infinity) {
      return (
        <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>
          {lowestPrice}€
        </Typography>
      );
    }

    // Múltiples Tickets de Pago sin Tickets Gratuitos
    if (paidTicketsCount > 1 && freeTicketsCount === 0 && lowestPrice !== Infinity) {
      return (
        <>
          <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>Desde {lowestPrice}€</Typography>
          {showOptions && (
            <Typography $variant="body-2-medium" color={theme.colors.defaultWeak}>
              · {paidTicketsCount} opciones
            </Typography>
          )}
        </>
      );
    }

    // Caso por Defecto
    return (
      <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultMain}>
        Gratis
      </Typography>
    );
  };

  const priceDisplay = getPriceDisplay();

  return (
    <PriceContainer>
      {priceDisplay}
    </PriceContainer>
  );
};

PriceDisplay.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired, // 'free' o 'paid'
      price: PropTypes.number, // Solo relevante si es de pago
      availableSeats: PropTypes.number.isRequired,
      // Otros campos si los hay...
    })
  ),
  showOptions: PropTypes.bool, // Nueva prop
};

export default PriceDisplay;

// Styled Components
const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
