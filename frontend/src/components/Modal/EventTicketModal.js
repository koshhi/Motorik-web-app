import React from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import InputText from '../Input/InputText';
import Select from '../Select/Select'

const EventTicketModal = ({ ticketPrice, ticketType, setTicketPrice, setTicketType, onClose }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <div className='Heading'>
          <h4>Empieza a vender entradas</h4>
          <p>Una vez vinculada una cuenta Stripe podrás recibir  el pago de las inscripciones en la cuenta bancaria asociada.</p>
        </div>
        <Select value={ticketType} onChange={(e) => setTicketType(e.target.value)}>
          <option value="free">Gratis</option>
          <option value="paid">De pago</option>
        </Select>
        {ticketType === 'paid' && (
          <InputText
            size="medium"
            type="number"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
            placeholder="Precio del ticket"
            required
          />
        )}
        <Button size="medium" onClick={onClose}>Guadar ticket</Button>
      </ModalContent>
    </ModalOverlay>
  )
}

export default EventTicketModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: rgba(26, 26, 26, 0.90);
  backdrop-filter: blur(12px);
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  padding: var(--Spacing-md, 24px);
  flex-direction: column;
  align-items: flex-start;
  gap: var(--Spacing-lg, 32px);
  border-radius: ${({ theme }) => theme.radius.sm};
  max-width: 488px;

  .Heading {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h4 {
      color: ${({ theme }) => theme.colors.defaultMain};
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;
      /* Titles/Mobile/Title 5/Semibold */
      font-family: "Mona Sans";
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 150%;
    }

    p {
      color: ${({ theme }) => theme.colors.defaultWeak};
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;

      /* Body/Body 1/Medium */
      font-family: "Mona Sans";
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 150%; /* 24px */
    }
  }
`;