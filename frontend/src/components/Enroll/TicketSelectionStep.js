// frontend/src/components/enroll/TicketSelectionStep.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import styled from 'styled-components';
import Typography from '../Typography';
import Button from '../Button/Button';
import TicketItem from '../EventContent/TicketItem';

const TicketSelectionStep = ({ tickets, onTicketSelected, onCancel }) => {
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const handleSelect = (ticket) => {
    setSelectedTicketId(ticket._id);
  };

  return (
    <Modal title="Selecciona tu Entrada" onClose={onCancel} maxWidth="600px">
      <Container>
        <Typography $variant="body-1-regular">
          Elige la entrada con la que deseas inscribirte:
        </Typography>
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
        <Actions>
          <Button
            onClick={() => {
              const selectedTicket = tickets.find((t) => t._id === selectedTicketId);
              if (selectedTicket) onTicketSelected(selectedTicket);
            }}
            disabled={!selectedTicketId}
          >
            Continuar
          </Button>
          <Button onClick={onCancel} $variant="outline">
            Cancelar
          </Button>
        </Actions>
      </Container>
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
  padding: 16px;
`;

const TicketList = styled.ul`
  list-style: none;
  margin: 16px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;
