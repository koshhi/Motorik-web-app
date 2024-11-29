// components/EventTicketModal.js

import React, { useEffect } from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import InputText from '../Input/InputText';
import Switch from '../Switch';
import Typography from '../Typography';
import ToogableTabs from '../Toogle/ToogableTabs';
import { theme } from '../../theme';

const EventTicketModal = ({
  ticketName,
  ticketPrice,
  ticketType,
  capacity,
  approvalRequired,
  setTicketName,
  setTicketPrice,
  setTicketType,
  setCapacity,
  setApprovalRequired,
  onClose,
}) => {

  // Opciones para ToogableTabs
  const ticketOptions = [
    { label: 'Gratis', value: 'free' },
    { label: 'De Pago', value: 'paid' },
  ];

  // useEffect para establecer el precio por defecto cuando el tipo es 'paid'
  useEffect(() => {
    if (ticketType === 'paid' && (ticketPrice === '' || ticketPrice === 0)) {
      setTicketPrice(10); // Precio por defecto para tickets de pago
    } else if (ticketType === 'free') {
      setTicketPrice(0); // Asegurar que el precio es 0 para tickets gratuitos
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketType]);

  return (
    <ModalOverlay>
      <ModalContent>

        <ModalHeading>
          <Typography as="h4" $variant="title-5-semibold" color={theme.colors.defaultMain}>
            Configura la entrada
          </Typography>
          <Typography $variant="body-1-regular" color={theme.colors.defaultWeak}>
            Define el nombre, tipo, precio y capacidad de tu ticket, y si requiere aprobación.
          </Typography>
        </ModalHeading>

        <ModalContentRow>
          <InputWrapper>
            <Typography $variant="body-2-medium" as="label" color={theme.colors.defaultMain}>
              Nombre de la entrada:
            </Typography>
            <InputText
              size="medium"
              type="text"
              value={ticketName}
              onChange={(e) => setTicketName(e.target.value)}
              placeholder="Nombre del ticket"
              required
            />
          </InputWrapper>
        </ModalContentRow>

        <ModalContentRow>
          <ToogableTabs
            options={ticketOptions}
            activeOption={ticketType}
            onTabChange={(value) => setTicketType(value)}
          />
        </ModalContentRow>

        <ModalContentRow>
          <InputWrapperHorizontal>
            <Typography $variant="body-1-medium" as="label" color={theme.colors.defaultMain} style={{ width: "100%" }}>Número de Entradas:</Typography>
            <InputText
              size="medium"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Capacidad del ticket"
              required
              style={{ width: "80px" }}
            />
          </InputWrapperHorizontal>
        </ModalContentRow>

        {ticketType === 'paid' && (
          <ModalContentRow>
            <InputWrapperHorizontal>
              <Typography $variant="body-1-medium" as="label" color={theme.colors.defaultMain} style={{ width: "100%" }}>
                Precio:
              </Typography>
              <TicketPriceInput>
                <InputText
                  size="medium"
                  type="number"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  placeholder="Precio del ticket"
                  required
                  style={{ width: "80px" }}
                />
                <Typography>€</Typography>
              </TicketPriceInput>
            </InputWrapperHorizontal>
          </ModalContentRow>
        )}

        {ticketType === 'free' && (
          <ModalContentRow>
            <InputWrapperHorizontal style={{ minHeight: "38px" }}>
              <Typography $variant="body-1-medium" as="label" color={theme.colors.defaultMain} style={{ width: "100%" }}>Aprobación requerida:</Typography>
              <Switch
                value={approvalRequired}
                onChange={(value) => setApprovalRequired(value)}
                disabled={ticketType === 'paid'}
              />
            </InputWrapperHorizontal>
          </ModalContentRow>
        )}
        <Button size="medium" onClick={onClose}>
          Guardar ticket
        </Button>
      </ModalContent>
    </ModalOverlay>
  )
}

export default EventTicketModal;

// Estilos para el componente
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
`;

const ModalHeading = styled.div`
  margin-bottom: 24px;
`;

const ModalContentRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-bottom: 24px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const TicketPriceInput = styled.div`
  display: flex;
  position: relative;

  span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 8px;
  }
`;

const InputWrapperHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  width: 100%;
`;
