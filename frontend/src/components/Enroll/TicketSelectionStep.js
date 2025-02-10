// frontend/src/components/enroll/TicketSelectionStep.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import styled from 'styled-components';
import Typography from '../Typography';
import Button from '../Button/Button';
import TicketItem from '../EventContent/TicketItem';
import { theme } from '../../theme';

const TicketSelectionStep = ({ tickets, onTicketSelected, onCancel }) => {
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const handleSelect = (ticket) => {
    setSelectedTicketId(ticket._id);
  };

  return (
    <Modal title="Selecciona tu Entrada" onClose={onCancel} maxWidth="500px" maxHeight="calc(100% - 2rem)" >
      <Container>
        <TicketHeading as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
          Elige una entrada para inscribirte:
        </TicketHeading>
        <TicketList>
          {tickets.map((ticket) => (
            <TicketItem
              key={ticket._id}
              ticket={ticket}
              selected={selectedTicketId === ticket._id}
              onSelect={() => handleSelect(ticket)}
            />
          ))}
        </TicketList>
      </Container>
      <Actions>
        <Button onClick={onCancel} $variant="outline">
          Cancelar
        </Button>
        <Button
          onClick={() => {
            const selectedTicket = tickets.find((t) => t._id === selectedTicketId);
            if (selectedTicket) onTicketSelected(selectedTicket);
          }}
          disabled={!selectedTicketId}
        >
          Continuar
          <img src="/icons/arrow-right-solid.svg" alt="Continue icon" />
        </Button>
      </Actions>
    </Modal>
  );
};

TicketSelectionStep.propTypes = {
  tickets: PropTypes.array.isRequired,
  onTicketSelected: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TicketSelectionStep;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: scroll;
`;

const TicketHeading = styled(Typography)`
  padding: ${({ theme }) => theme.sizing.sm};
  width: 100%;
`;

const TicketList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  witdh: 100%;
  padding: ${({ theme }) => theme.sizing.sm};
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  padding: ${({ theme }) => theme.sizing.sm};
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
`;
