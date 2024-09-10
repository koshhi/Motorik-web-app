import React from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import InputText from '../Input/InputText';

const EventCapacityModal = ({ capacity, setCapacity, onClose }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <div className='Heading'>
          <h4>Capacidad máxima</h4>
          <p>Cierre automático de registros cuando se alcanza el aforo. Sólo los inscritos aprobados cuentan para el límite.</p>
        </div>
        <InputText size="medium" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Número máximo de personas" required />
        <Button size="medium" onClick={onClose}>Guadar limite</Button>
      </ModalContent>
    </ModalOverlay>


  )
}

export default EventCapacityModal;

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