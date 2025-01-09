// components/EventTicketModal.js

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import InputText from '../Input/InputText';
import Switch from '../Switch';
import Typography from '../Typography';
import ToogableTabs from '../Toogle/ToogableTabs';
import { theme } from '../../theme';
import axiosClient from '../../api/axiosClient';
import StripeOnboardingModal from './StripeOnboardingModal';
import { useAuth } from '../../context/AuthContext';


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

  const { user } = useAuth();
  const userId = user?._id || user?.id

  // Estados para Stripe
  const [hasStripeAccount, setHasStripeAccount] = useState(false);
  const [chargesEnabled, setChargesEnabled] = useState(false);
  const [loadingStripeCheck, setLoadingStripeCheck] = useState(false);

  // Control del modal de onboarding
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);


  // Opciones para ToogableTabs
  const ticketOptions = [
    { label: 'Gratis', value: 'free' },
    { label: 'De Pago', value: 'paid' },
  ];

  // Al montar, o cada vez que cambie el ticketType, revisamos la cuenta Stripe (opcional)
  useEffect(() => {
    if (ticketType === 'paid') {
      refreshStripeStatus();
    }
  }, [ticketType]);

  const refreshStripeStatus = async () => {
    if (!userId) return;
    setLoadingStripeCheck(true);
    try {
      const resp = await axiosClient.get(`/stripe/refresh-account-status?userId=${userId}`);
      setHasStripeAccount(resp.data.hasStripeAccount);
      setChargesEnabled(resp.data.chargesEnabled);
    } catch (error) {
      console.error('Error verificando estado de Stripe:', error);
    } finally {
      setLoadingStripeCheck(false);
    }
  };

  // Lógica para crear/conectar cuenta Stripe
  const handleConnectStripe = async () => {
    try {
      // Llamada a tu endpoint que crea/recupera la cuenta
      await axiosClient.post('/stripe/create-or-connect-account', { userId });
      // Abre el modal de Onboarding
      setShowOnboardingModal(true);
    } catch (error) {
      console.error('Error al crear/conectar cuenta de Stripe:', error);
    }
  };

  // Manejar el cierre del modal de onboarding
  const handleCloseOnboarding = () => {
    setShowOnboardingModal(false);
    // Re-check status (por si terminó el onboarding con éxito)
    refreshStripeStatus();
  };

  // useEffect para setear precio por defecto cuando es pago (tu lógica anterior)
  useEffect(() => {
    if (ticketType === 'paid' && (ticketPrice === '' || ticketPrice === 0)) {
      setTicketPrice(10); // Por defecto
    } else if (ticketType === 'free') {
      setTicketPrice(0);
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

        {/* Si el ticket es "paid", chequeamos estado de Stripe */}
        {ticketType === 'paid' && (
          // <ModalContentRow>
          //   <InputWrapperHorizontal>
          //     <Typography $variant="body-1-medium" as="label" color={theme.colors.defaultMain} style={{ width: "100%" }}>
          //       Precio:
          //     </Typography>
          //     <TicketPriceInput>
          //       <InputText
          //         size="medium"
          //         type="number"
          //         value={ticketPrice}
          //         onChange={(e) => setTicketPrice(e.target.value)}
          //         placeholder="Precio del ticket"
          //         required
          //         style={{ width: "80px" }}
          //       />
          //       <Typography>€</Typography>
          //     </TicketPriceInput>
          //   </InputWrapperHorizontal>
          // </ModalContentRow>
          <>
            <ModalContentRow>
              <InputWrapperHorizontal>
                <Typography
                  $variant="body-1-medium"
                  as="label"
                  color={theme.colors.defaultMain}
                  style={{ width: '100%' }}
                >
                  Número de Entradas:
                </Typography>
                <InputText
                  size="medium"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Capacidad del ticket"
                  required
                  style={{ width: '80px' }}
                />
              </InputWrapperHorizontal>
            </ModalContentRow>

            {loadingStripeCheck ? (
              <p>Cargando estado de Stripe...</p>
            ) : !hasStripeAccount || !chargesEnabled ? (
              // Mostrar Banner de "Necesitas conectar Stripe" si no tiene cuenta o no está habilitada
              <div>
                <Typography>
                  Para ofrecer tickets de pago, necesitas conectar o crear tu cuenta de Stripe.
                </Typography>
                <Button size="small" onClick={handleConnectStripe}>
                  Conectar Cuenta Stripe
                </Button>
              </div>
            ) : (
              // Si tiene cuenta y puede cobrar, mostramos input de precio
              <ModalContentRow>
                <InputWrapperHorizontal>
                  <Typography
                    $variant="body-1-medium"
                    as="label"
                    color={theme.colors.defaultMain}
                    style={{ width: '100%' }}
                  >
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
                      style={{ width: '80px' }}
                    />
                    <Typography>€</Typography>
                  </TicketPriceInput>
                </InputWrapperHorizontal>
              </ModalContentRow>
            )}
          </>
        )}

        {/* Si el ticket es "free", mostramos su config normal */}
        {ticketType === 'free' && (
          <>
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
          </>

        )}
        <Button size="medium" onClick={onClose}>
          Guardar ticket
        </Button>
      </ModalContent>

      {/* Modal para Onboarding de Stripe */}
      {showOnboardingModal && (
        <StripeOnboardingModal onClose={handleCloseOnboarding} />
      )}

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
