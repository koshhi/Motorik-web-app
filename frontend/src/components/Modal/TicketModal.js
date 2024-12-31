// components/Modal/TicketModal.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import Typography from '../Typography';
import Button from '../Button/Button';
import TicketItem from '../EventContent/TicketItem';
import ModalCheckout from './ModalCheckout'; // Importar el ModalCheckout

const TARIF_PERCENTAGE = 10; // 10%

const TicketModal = ({
  tickets,
  selectedTicketId,
  handleTicketSelect,
  onClose,
  onContinue,
  eventImage,
  organizerImage,
}) => {
  // Encontrar el ticket seleccionado
  const selectedTicket = tickets.find(ticket => ticket._id === selectedTicketId);

  // Función para calcular la tarifa basada en el porcentaje
  const calculateTariff = (price, percentage) => {
    return Math.round(price * (percentage / 100) * 100) / 100; // Redondear a dos decimales
  };

  // Calcular el resumen de costos
  const costSummary = selectedTicket
    ? {
      subTotal: selectedTicket.type === 'paid' ? selectedTicket.price : 0,
      tariffPercentage: selectedTicket.type === 'paid' ? TARIF_PERCENTAGE : 0,
      tariffAmount: selectedTicket.type === 'paid' ? calculateTariff(selectedTicket.price, TARIF_PERCENTAGE) : 0,
      total: selectedTicket.type === 'paid' ? selectedTicket.price + calculateTariff(selectedTicket.price, TARIF_PERCENTAGE) : 0,
    }
    : {
      subTotal: 0,
      tariffPercentage: 0,
      tariffAmount: 0,
      total: 0,
    };


  return (
    <Modal title="Inscríbete" onClose={onClose} maxWidth="800px">
      <ModalContent>
        <ModalTicketsContainer>
          <ModalHeading>
            <Typography $variant="title-5-semibold">Selecciona una entrada.</Typography>
            <Typography $variant="body-1-regular">
              Por favor, elige una entrada para inscribirte en el evento.
            </Typography>
          </ModalHeading>
          <TicketList>
            {tickets.length === 0 ? (
              <NoTicketsMessage>No hay entradas disponibles para este evento.</NoTicketsMessage>
            ) : (
              tickets
                .sort((a, b) => b.availableSeats - a.availableSeats)
                .map((ticket) => (
                  <TicketItem
                    key={ticket._id}
                    ticket={ticket}
                    selected={selectedTicketId === ticket._id}
                    onSelect={() => handleTicketSelect(ticket._id)}
                  />
                ))
            )}
          </TicketList>
          <ModalActions>
            <Button
              onClick={onContinue}
              disabled={!selectedTicketId}
              size="medium"
              style={{ justifyContent: "center" }}
            >
              Continuar
            </Button>
          </ModalActions>
        </ModalTicketsContainer>
        <ModalCheckout
          eventImage={eventImage}
          organizerImage={organizerImage}
          costSummary={costSummary}
        />
      </ModalContent>
    </Modal>
  );
};

TicketModal.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      price: PropTypes.number,
      approvalRequired: PropTypes.bool,
      availableSeats: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedTicketId: PropTypes.string,
  handleTicketSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  eventImage: PropTypes.string.isRequired,
  organizerImage: PropTypes.string.isRequired,
};

export default TicketModal;

// Styled Components
const ModalContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const ModalTicketsContainer = styled.div`
  display: flex;
  flex-direction: column;
  // gap: ${({ theme }) => theme.sizing.md};
  flex-grow: 1;
`;

const ModalHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const TicketList = styled.ul`
  list-style: none;
  padding: ${({ theme }) => theme.sizing.sm};
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
  height: 100%;
`;

const ModalActions = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm};
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
`;

const NoTicketsMessage = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;
