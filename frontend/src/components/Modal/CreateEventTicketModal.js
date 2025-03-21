// components/CreateEventTicketModal.js

import React, { useEffect, useState } from 'react';
import Modal from './Modal'; // Import the Modal component
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
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const CreateEventTicketModal = ({
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
  const { t } = useTranslation('createEvent');
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
    { label: t('createEventTicketModal.ticketOptions.free'), value: 'free' },
    { label: t('createEventTicketModal.ticketOptions.paid'), value: 'paid' }
  ];

  const navigate = useNavigate();

  // Al montar (o cuando el userId esté disponible), se consulta Stripe para obtener el estado de la cuenta.
  useEffect(() => {
    if (userId) {
      refreshStripeStatus();
    }
  }, [userId]);

  const refreshStripeStatus = async () => {
    if (!userId) return;
    setLoadingStripeCheck(true);
    try {
      const resp = await axiosClient.get(`/api/stripe/refresh-account-status?userId=${userId}`);
      setHasStripeAccount(resp.data.hasStripeAccount);
      setChargesEnabled(resp.data.chargesEnabled);
    } catch (error) {
      console.error('Error verificando estado de Stripe:', error);
    } finally {
      setLoadingStripeCheck(false);
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
    <Modal onClose={onClose} title={t('createEventTicketModal.title')}>
      <ModalContent>
        <ModalContentRow>
          <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
            {t('createEventTicketModal.description')}
            {/* Customiza la entrada, su precio y cantidad disponible. */}
          </Typography>
        </ModalContentRow>
        <ModalContentRow>
          <InputWrapper>
            <Typography $variant="body-2-medium" as="label" color={theme.colors.defaultMain}>
              {t('createEventTicketModal.name.label')}
            </Typography>
            <InputText
              $size="large"
              type="text"
              value={ticketName}
              onChange={(e) => setTicketName(e.target.value)}
              // placeholder="Nombre de la entrada"
              placeholder={t('createEventTicketModal.name.placeholder')}
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

        {/* Si el ticket es "free", mostramos su config normal */}
        {ticketType === 'free' && (
          <>
            <ModalContentRow>
              <InputWrapperHorizontal>
                <Typography $variant="body-1-medium" as="label" color={theme.colors.defaultMain} style={{ width: "100%" }}>
                  {t('createEventTicketModal.freeTicket.capacityLabel')}

                </Typography>
                <InputText
                  size="medium"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  // placeholder="Capacidad del ticket"
                  placeholder={t('createEventTicketModal.freeTicket.capacityPlaceholder')}
                  required
                  style={{ width: "80px" }}
                />
              </InputWrapperHorizontal>
            </ModalContentRow>
            <ModalContentRow>
              <InputWrapperHorizontal style={{ minHeight: "38px" }}>
                <Typography $variant="body-1-medium" as="label" color={theme.colors.defaultMain} style={{ width: "100%" }}>
                  {t('createEventTicketModal.freeTicket.approvalLabel')}
                </Typography>
                <Switch
                  value={approvalRequired}
                  onChange={(value) => setApprovalRequired(value)}
                  disabled={ticketType === 'paid'}
                />
              </InputWrapperHorizontal>
            </ModalContentRow>
            <FormActions>
              <Button size="medium" onClick={onClose}>
                {t('createEventTicketModal.freeTicket.save')}
              </Button>
            </FormActions>
          </>
        )}

        {ticketType === 'paid' && (
          <>
            {loadingStripeCheck ? (
              <p>{t('createEventTicketModal.paidTicket.loadingStripe')}</p>
            ) : (
              <>
                {/* Caso 1: El usuario no tiene cuenta Stripe conectada */}
                {!hasStripeAccount && (
                  <ConnectedAccountWrapper>
                    <ConnectedAccountBanner>
                      <IntegrationIcon src="/icons/motorik-stripe-connect.svg" alt="Stripe Integration" />
                      <Typography as="h3" $variant="title-5-semibold">
                        {t('createEventTicketModal.paidTicket.noStripe.title')}
                      </Typography>
                      <Typography as="p" $variant="body-1-regular" color={theme.colors.defaultWeak}>
                        {t('createEventTicketModal.paidTicket.noStripe.description')}
                      </Typography>
                      <StripeActions>
                        <Button size="medium" onClick={() => navigate('/user/' + userId + '/settings')}>
                          {t('createEventTicketModal.paidTicket.noStripe.button')}
                        </Button>
                      </StripeActions>
                    </ConnectedAccountBanner>
                  </ConnectedAccountWrapper>
                )}

                {/* Caso 2: El usuario tiene la cuenta conectada pero los cobros no están habilitados */}
                {hasStripeAccount && !chargesEnabled && (
                  <ConnectedAccountWrapper>
                    <ConnectedAccountBanner>
                      <IntegrationIcon src="/icons/motorik-stripe-connect.svg" alt="Stripe Integration" />
                      <Typography as="h3" $variant="title-5-semibold">
                        {t('createEventTicketModal.paidTicket.stripeNotEnabled.title')}
                      </Typography>
                      <Typography as="p" $variant="body-2-regular">
                        {t('createEventTicketModal.paidTicket.stripeNotEnabled.description')}
                      </Typography>
                      <Button size="small" onClick={() => navigate('/user/' + userId + '/settings')}>
                        {t('createEventTicketModal.paidTicket.stripeNotEnabled.button')}
                      </Button>
                    </ConnectedAccountBanner>
                  </ConnectedAccountWrapper>
                )}

                {/* Caso 3: El usuario tiene la cuenta y los cobros activados (se permite editar precio y capacidad) */}
                {hasStripeAccount && chargesEnabled && (
                  <>
                    <ModalContentRow>
                      <InputWrapperHorizontal>
                        <Typography
                          $variant="body-1-medium"
                          as="label"
                          color={theme.colors.defaultMain}
                          style={{ width: '100%' }}
                        >
                          {t('createEventTicketModal.paidTicket.enabled.capacityLabel')}
                        </Typography>
                        <InputText
                          size="medium"
                          type="number"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          // placeholder="Capacidad del ticket"
                          placeholder={t('createEventTicketModal.paidTicket.enabled.capacityPlaceholder')}

                          required
                          style={{ width: '80px' }}
                        />
                      </InputWrapperHorizontal>
                    </ModalContentRow>

                    <ModalContentRow>
                      <InputWrapperHorizontal>
                        <Typography
                          $variant="body-1-medium"
                          as="label"
                          color={theme.colors.defaultMain}
                          style={{ width: '100%' }}
                        >
                          {t('createEventTicketModal.paidTicket.enabled.priceLabel')}

                        </Typography>
                        <TicketPriceInput>
                          <InputText
                            size="medium"
                            type="number"
                            value={ticketPrice}
                            onChange={(e) => setTicketPrice(e.target.value)}
                            placeholder={t('createEventTicketModal.paidTicket.enabled.pricePlaceholder')}
                            required
                            style={{ width: '80px' }}
                          />
                          <Typography>€</Typography>
                        </TicketPriceInput>
                      </InputWrapperHorizontal>
                    </ModalContentRow>
                  </>
                )}
              </>
            )}
          </>
        )}


      </ModalContent>

      {/* Modal para Onboarding de Stripe */}
      {showOnboardingModal && (
        <StripeOnboardingModal onClose={handleCloseOnboarding} />
      )}

    </Modal>
  )
}

export default CreateEventTicketModal;

// Estilos para el componente

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  padding-top: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  width: 100%;

`;

const ModalContentRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0px ${({ theme }) => theme.sizing.sm};
`;

const ConnectedAccountWrapper = styled(ModalContentRow)`
  padding-bottom: ${({ theme }) => theme.sizing.sm}; 
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

const FormActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  text-align: center;
`;

const InputWrapperHorizontal = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  width: 100%;
`;

const ConnectedAccountBanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: ${({ theme }) => theme.fill.defaultWeak};
  padding: ${({ theme }) => theme.sizing.sm};
  border-radius: ${({ theme }) => theme.sizing.xs};
  gap: ${({ theme }) => theme.sizing.xs};
`;

const IntegrationIcon = styled.img`
  width: auto;
  max-height: 40px;
  padding-bottom: ${({ theme }) => theme.sizing.xs};
`;

const StripeActions = styled.div`
  padding: ${({ theme }) => theme.sizing.sm} 0px 0px 0px;
`;