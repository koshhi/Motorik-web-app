// components/EventContent/TicketsList.js

// delete this file

import React from 'react';
import styled from 'styled-components';
import TicketItem from './TicketItem';
import Typography from '../Typography';
import { theme } from '../../theme';
import PropTypes from 'prop-types';


const TicketsList = ({ tickets, selectedTicketId, handleTicketSelect }) => {
  return (
    <TicketsContainer>
      <Typography $variant="h2">Entradas Disponibles</Typography>
      {tickets.length === 0 ? (
        <p>No hay entradas disponibles para este evento.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <TicketItem
              key={ticket._id}
              ticket={ticket}
              selected={selectedTicketId === ticket._id}
              onSelect={() => handleTicketSelect(ticket._id)}
            />
          ))}
        </ul>
      )}
    </TicketsContainer>
  );
};

TicketsList.propTypes = {
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
};

export default TicketsList;

// Styled Components
const TicketsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.md};
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;
