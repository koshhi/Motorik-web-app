// // components/EventContent/TicketItem.js

// import React from 'react';
// import styled from 'styled-components';
// import PropTypes from 'prop-types';
// import Typography from '../Typography';
// import { theme } from '../../theme';

// const TicketItem = ({ ticket, selected, onSelect }) => {
//   const handleClick = () => {
//     if (ticket.availableSeats > 0) {
//       onSelect();
//     }
//   };

//   return (
//     <TicketContainer selected={selected} onClick={handleClick} disabled={ticket.availableSeats <= 0}>
//       <TicketContent>
//         <Typography $variant="body-1-medium">{ticket.name}</Typography>
//         <Typography $variant="body-2-medium" color={theme.colors.defaultWeak}>
//           {ticket.type === 'free' ? 'Gratis' : `${ticket.price}€`}
//         </Typography>
//         {ticket.approvalRequired && <Typography>(Requiere aprobación)</Typography>}
//         <Typography>{ticket.availableSeats} disponibles</Typography>
//         {ticket.availableSeats <= 0 && <Typography color="red">Sin asientos disponibles</Typography>}
//       </TicketContent>
//       {selected && <SelectedIndicator>✔️</SelectedIndicator>}
//     </TicketContainer>
//   );
// };

// TicketItem.propTypes = {
//   ticket: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//     type: PropTypes.string.isRequired,
//     price: PropTypes.number,
//     approvalRequired: PropTypes.bool,
//     availableSeats: PropTypes.number.isRequired,
//   }).isRequired,
//   selected: PropTypes.bool.isRequired,
//   onSelect: PropTypes.func.isRequired,
// };

// export default TicketItem;

// // Styled Components
// const TicketContainer = styled.li`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 12px;
//   border: 1px solid ${({ theme, selected }) => (selected ? theme.colors.primary : theme.border.defaultWeak)};
//   border-radius: 4px;
//   background-color: ${({ theme, selected }) => (selected ? theme.colors.primaryLight : theme.fill.defaultMain)};
//   opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
//   cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

//   &:hover {
//     background-color: ${({ selected, theme }) => (selected ? theme.colors.primaryLight : theme.fill.brandAlphaMain16)};
//     border-color: ${({ selected, theme }) => (selected ? theme.colors.primary : theme.border.brandMain)};
//   }
// `;

// const TicketContent = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 4px;
// `;

// const SelectedIndicator = styled.span`
//   font-size: 20px;
//   color: ${({ theme }) => theme.colors.primary};
// `;


// components/EventContent/TicketItem.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Typography from '../Typography';
import { theme } from '../../theme';
import RadioButton from '../RadioButton/RadioButton'; // Importar el RadioButton
import Tag from '../Tag';

const TicketItem = ({ ticket, selected, onSelect }) => {
  const handleClick = () => {
    if (ticket.availableSeats > 0) {
      onSelect();
    }
  };

  return (
    <TicketContainer selected={selected} onClick={handleClick} disabled={ticket.availableSeats <= 0}>
      <div style={{ marginTop: "2px" }} >
        <RadioButton selected={selected} onClick={onSelect} />
      </div>
      <TicketContent>
        <TicketData>
          <Typography $variant="body-1-semibold">{ticket.name}</Typography>
          <Typography $variant="body-1-semibold">
            {ticket.type === 'free' ? 'Gratis' : `${ticket.price}€`}
          </Typography>
        </TicketData>
        <TicketTags>
          <Tag>{ticket.availableSeats} disponible{ticket.availableSeats !== 1 ? 's' : ''}</Tag>
          {ticket.approvalRequired && <Tag>Requiere aprobación</Tag>}
        </TicketTags>
        {ticket.availableSeats <= 0 && <Typography color="red">Sin asientos disponibles</Typography>}
      </TicketContent>
    </TicketContainer>
  );
};

TicketItem.propTypes = {
  ticket: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired, // 'free' o 'paid'
    price: PropTypes.number, // Solo relevante si type === 'paid'
    approvalRequired: PropTypes.bool,
    availableSeats: PropTypes.number.isRequired,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default TicketItem;

// Styled Components
const TicketContainer = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme, selected }) => (selected ? theme.border.brandMain : theme.border.defaultWeak)};
  border-radius: ${({ theme }) => theme.sizing.xs};
  background-color: ${({ theme, selected }) => (selected ? theme.fill.defaultSubtle : theme.fill.defaultMain)};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  
  &:hover {
    // background-color: ${({ selected, theme }) => (selected ? theme.colors.brandMain : theme.fill.defaultMain)};
    // border-color: ${({ selected, theme }) => (selected ? theme.border.brandMain : theme.border.defaultStrong)};
  }
`;

const TicketContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};
  width: 100%;
`;

const TicketData = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TicketTags = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
`;
