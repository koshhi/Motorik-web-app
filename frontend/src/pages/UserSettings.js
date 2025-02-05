// src/pages/UserSettings.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button/Button';
import Typography from '../components/Typography';
import ConfirmDeleteModal from '../components/Modal/ConfirmDeleteModal';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { theme } from '../theme';

function UserSettings() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, setUser, logout, stripeStatus, refreshStripeStatus } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Loading para cuando se hace clic en "Activar pagos" y se genera la URL de Stripe
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    // Ver si la URL trae ?onboarding=success o ?onboarding=cancelled
    const params = new URLSearchParams(window.location.search);
    const onboardingStatus = params.get('onboarding');

    if (onboardingStatus === 'success') {
      toast.success('Onboarding de Stripe completado (o se ha detectado como finalizado).');
    } else if (onboardingStatus === 'cancelled') {
      toast.warn('Onboarding de Stripe cancelado o no finalizado.');
    }
  }, []);

  useEffect(() => {
    // Si el user logueado NO coincide con el userId de la URL => no puede ver
    if (!user || user.id !== userId) {
      toast.error('No tienes permiso para ver esta configuración.');
      navigate('/signin');
      return;
    }
    // Revisar estado de Stripe (charges_enabled, etc.)
    refreshStripeStatus(userId);
  }, [user, userId, navigate, refreshStripeStatus]);

  // Cerrar panel de settings y volver a la home (o a donde quieras)
  const handleCloseSettings = () => {
    navigate('/');
  };

  // === Eliminar cuenta (modal) ===
  const handleOpenDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  // Confirmar borrado de cuenta
  const handleConfirmDelete = async () => {
    try {
      const resp = await axiosClient.delete('/api/users/delete');
      if (resp.data.success) {
        toast.success('Tu cuenta se ha eliminado correctamente.');
        logout();
        navigate('/');
      } else {
        toast.error('Error al eliminar la cuenta: ' + resp.data.message);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error al eliminar la cuenta.');
    } finally {
      handleCloseDeleteModal();
    }
  };

  // ========== Stripe Handlers ==========

  /**
   * 1) handleConnectStripe: crea o conecta cuenta si no existía,
   *    llamando a POST /api/stripe/create-or-connect-account
   */
  const handleConnectStripe = async () => {
    try {
      setIsActivating(true);
      const { data } = await axiosClient.post('/api/stripe/create-or-connect-account', { userId });
      if (data.onboardingUrl) {
        // Redirige al flujo de Onboarding
        window.location.href = data.onboardingUrl;
      } else {
        // Si no hay URL, ya existía la cuenta => recargamos su status
        toast.success('Cuenta de Stripe ya conectada.');
        refreshStripeStatus(userId);
      }
    } catch (error) {
      console.error('Error al conectar con Stripe:', error);
      toast.error('No se pudo conectar con Stripe, intente de nuevo.');
    } finally {
      setIsActivating(false);
    }
  };

  /**
   * 2) handleCompleteVerification: genera un nuevo enlace de onboarding
   *    si la cuenta existe pero no está chargesEnabled
   */
  const handleCompleteVerification = async () => {
    try {
      setIsActivating(true);
      const { data } = await axiosClient.post('/api/stripe/create-account-link', { userId });
      if (data.success && data.url) {
        window.location.href = data.url; // Redirige a Stripe
      } else {
        toast.info(data.message || 'No se generó un nuevo link de verificación');
      }
    } catch (error) {
      console.error('Error al generar link de verificación:', error);
      toast.error('Hubo un error al tratar de completar la verificación en Stripe.');
    } finally {
      setIsActivating(false);
    }
  };

  /**
   * 3) handleDisconnectStripe: desvincula la cuenta, llamando a POST /api/stripe/disconnect-account
   */
  const handleDisconnectStripe = async () => {
    try {
      const { data } = await axiosClient.post('/api/stripe/disconnect-account');
      if (data.success) {
        toast.success('Cuenta de Stripe desvinculada.');
        // Actualizar user local
        setUser(data.user);
        refreshStripeStatus(userId);
      } else {
        toast.error(data.message || 'No se pudo desvincular la cuenta de Stripe.');
      }
    } catch (error) {
      console.error('Error desvinculando Stripe:', error);
      toast.error('Error al desvincular Stripe.');
    }
  };

  /**
 * 4) handleOpenStripeDashboard: abre el Dashboard estándar de Stripe
 */
  const handleOpenStripeDashboard = () => {
    window.open('https://dashboard.stripe.com/', '_blank');
  };

  return (
    <PageWrapper>
      <PageHeader>
        <Container>
          <Typography as="h1" $variant="title-3-semibold">
            Configuración
          </Typography>
          <Button $variant="outline" onClick={handleCloseSettings}>
            <img src="/icons/close.svg" alt="close icon" />
          </Button>
        </Container>
      </PageHeader>
      <SectionRow>
        <SettingsContainer>
          <SettingsBlock>
            <BlockHeader>
              <Typography as="h2" $variant="title-4-semibold">
                Cuenta:
              </Typography>
              <Typography as="p" color={theme.colors.defaultWeak}>
                Gestiona tus datos personales y preferencias.
              </Typography>
            </BlockHeader>
            <AccountContainer>
              <AccountBlock>
                {user && (
                  <>
                    <UserAvatar src={user.userAvatar} alt="user avatar" />
                    <UserDescription>
                      <Typography as="p" $variant="body-1-semibold">{user.name} {user.lastName}</Typography>
                      <Typography as="p" color={theme.colors.defaultWeak}>{user.email}</Typography>
                      <Typography color={theme.colors.defaultWeak}>{user.phonePrefix} {user.phoneNumber}</Typography>
                    </UserDescription>
                  </>
                )}
              </AccountBlock>
            </AccountContainer>
            <AccountActions>
              <Button $variant="ghost" onClick={() => navigate(`/user/${userId}/edit-profile`)}>Editar Perfil</Button>
              <Button $variant="ghostDanger" onClick={handleOpenDeleteModal}>Eliminar cuenta</Button>
            </AccountActions>
          </SettingsBlock>
          <SettingsBlock>
            <BlockHeader>
              <Typography as="h2" $variant="title-4-semibold">Pagos:</Typography>
              <Typography as="p" color={theme.colors.defaultWeak}>Configura tu cuenta para recibir pagos</Typography>
            </BlockHeader>
            <ConnectedAccountContainer>
              {/* Estado cargando */}
              {stripeStatus.loading && (
                <ConnectedAccountBlock>
                  <Typography as="p">Cargando estado de Stripe...</Typography>
                </ConnectedAccountBlock>
              )}

              {/* Estado ya cargado */}
              {!stripeStatus.loading && (
                <>
                  {/* Caso 1: NO tiene cuenta de Stripe */}
                  {!stripeStatus.hasStripeAccount && (
                    <ConnectedAccountBlock>
                      <IntegrationIcon
                        src="/icons/motorik-stripe-connect.svg"
                        alt="Stripe Integration"
                      />
                      <Typography as="h3" $variant="body-1-semibold">
                        Activa los pagos para vender tickets de pago.
                      </Typography>
                      <Typography as="p" $variant="body-1-regular" color={theme.colors.defaultWeak}>
                        Conecta o crea tu cuenta de Stripe. No te llevará más de 5 minutos.
                      </Typography>
                      <StripeActions>
                        <Button onClick={handleConnectStripe} disabled={isActivating}>
                          {isActivating ? 'Redirigiendo a Stripe...' : 'Activar pagos'}
                        </Button>
                      </StripeActions>
                    </ConnectedAccountBlock>
                  )}

                  {/* Caso 2: Sí tiene cuenta, pero chargesEnabled = false */}
                  {stripeStatus.hasStripeAccount && !stripeStatus.chargesEnabled && (
                    <ConnectedAccountBlock>
                      <StripeDescription>
                        <Typography as="h3" $variant="body-1-semibold">
                          Casi has terminado!
                        </Typography>
                        <Typography as="p" $variant="body-1-regular" color={theme.colors.defaultWeak}>
                          Stripe requiere algunos datos para habilitarte los cobros.
                        </Typography>
                        {/* <Typography>
                            Tu ID de Stripe: {user?.stripeConnectedAccountId || 'No conectado'}
                          </Typography> */}
                      </StripeDescription>

                      {/* <Typography as="h3" $variant="body-1-semibold">
                          Tu cuenta de Stripe existe, pero aún no se han habilitado los cobros.
                        </Typography> */}
                      {/* Botón para “Completar verificación” */}
                      <StripeActions>
                        <Button onClick={handleCompleteVerification} disabled={isActivating}>
                          {isActivating ? 'Redirigiendo a Stripe...' : 'Completar verificación'}
                        </Button>
                        <Button $variant="ghostDanger" onClick={handleDisconnectStripe}>
                          Desvincular Stripe
                        </Button>
                      </StripeActions>
                    </ConnectedAccountBlock>
                  )}

                  {/* Caso 3: hasStripeAccount = true y chargesEnabled = true */}
                  {stripeStatus.hasStripeAccount && stripeStatus.chargesEnabled && (
                    <ConnectedAccountBlock>
                      <StripeDescription>
                        <Typography as="h3" $variant="body-1-semibold">
                          Cuenta de Stripe activa
                        </Typography>
                        <Typography as="p" $variant="body-1-regular" color={theme.colors.defaultWeak} >
                          ¡Tienes los pagos activos!
                        </Typography>
                        <Typography>
                          Tu ID de Stripe: {user?.stripeConnectedAccountId || 'No conectado'}
                        </Typography>
                      </StripeDescription>
                      <StripeActions>
                        <Button onClick={handleOpenStripeDashboard}>
                          Ver Dashboard de Stripe
                        </Button>
                        <Button $variant="ghostDanger" onClick={handleDisconnectStripe}>
                          Desvincular Stripe
                        </Button>
                      </StripeActions>

                    </ConnectedAccountBlock>
                  )}
                </>
              )}

            </ConnectedAccountContainer>
          </SettingsBlock>
        </SettingsContainer>
      </SectionRow>

      {/* Modal de confirmación de borrado */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </PageWrapper>
  );
}

export default UserSettings;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SectionRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.sm};
  max-width: 1400px;
  width: 100%;
  gap: ${({ theme }) => theme.sizing.sm};
`;

// const SettingsWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   gap: ${({ theme }) => theme.sizing.sm};
// `;

const SettingsContainer = styled(Container)`
  //  flex-wrap: wrap;
`;

const BlockHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: ${({ theme }) => theme.sizing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};
`;

const SettingsBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // width: 100%;
  flex-grow: 1;
  flex-basis: 50%;
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  border-radius: ${({ theme }) => theme.radius.xs};
`;

const UserAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radius.xs};
  object-fit: cover;
`;

const AccountContainer = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const AccountBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const AccountActions = styled(AccountContainer)`
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  width: 100%;
  padding: ${({ theme }) => theme.sizing.xs};
  flex-grow: 0;
`;

const StripeActions = styled(AccountActions)`
  border: none;
  padding: ${({ theme }) => theme.sizing.sm} 0px 0px 0px;
`;

const ConnectedAccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // background: ${({ theme }) => theme.fill.defaultWeak};
  // padding: ${({ theme }) => theme.sizing.sm};
  // border-radius: ${({ theme }) => theme.sizing.xs};
  gap: ${({ theme }) => theme.sizing.xs};
  width: 100%;
  flex-grow: 1;
`;

const ConnectedAccountBlock = styled.div`
  padding: ${({ theme }) => theme.sizing.sm};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const IntegrationIcon = styled.img`
  width: auto;
  max-height: 48px;
  padding-bottom: ${({ theme }) => theme.sizing.xs};
`;

const UserDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const StripeDescription = styled(UserDescription)`
  flex-grow: 1;
`;
