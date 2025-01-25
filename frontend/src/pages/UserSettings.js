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
  const { user, logout, stripeStatus, refreshStripeStatus } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('onboarding') === 'success') {
      toast.success('Onboarding completado con éxito.');
    }
  }, []);

  useEffect(() => {
    if (!user || user.id !== userId) {
      toast.error('No tienes permiso para ver esta configuración.');
      navigate('/signin');
      return;
    }

    // Comprobar y actualizar el estado de Stripe
    refreshStripeStatus(userId);
  }, [user, userId, navigate, refreshStripeStatus]);

  // Abrir modal
  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleCloseSettings = () => {
    navigate('/')
  }

  const handleConfirmDelete = async () => {
    try {
      // Llamar a DELETE /api/users/delete
      const resp = await axiosClient.delete('/api/users/delete');
      if (resp.data.success) {
        toast.success('Tu cuenta se ha eliminado.');
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

  const handleConnectStripe = async () => {
    try {
      const response = await axiosClient.post('/stripe/create-or-connect-account', { userId });
      if (response.data.onboardingUrl) {
        window.location.href = response.data.onboardingUrl; // Redirige al onboarding
      } else {
        toast.success('Cuenta de Stripe conectada correctamente.');
      }
    } catch (error) {
      console.error('Error al conectar con Stripe:', error);
      toast.error('Ocurrió un error al conectar con Stripe. Por favor, intenta nuevamente.');
    }
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
      <Section>
        <SectionContainer>
          <SettingsHeader>
            <Typography as="h2" $variant="title-4-semibold">
              Cuenta:
            </Typography>
            <Typography as="p" color={theme.colors.defaultWeak}>
              Gestiona tus datos personales y preferencias.
            </Typography>
          </SettingsHeader>
          <SettingsBlock>
            <AccountContainer>
              <UserAvatar src={user.userAvatar} alt="user avatar" />
              <div>
                <Typography as="p" $variant="body-1-semibold">{user.name} {user.lastName}</Typography>
                <Typography as="p" color={theme.colors.defaultWeak}>{user.email}</Typography>
                <Typography color={theme.colors.defaultWeak}>{user.phonePrefix} {user.phoneNumber}</Typography>
              </div>
            </AccountContainer>
            <AccountActions>
              <Button $variant="ghost" onClick={() => navigate(`/user/${userId}/edit-profile`)}>Editar Perfil</Button>
              <Button $variant="ghostDanger" onClick={handleOpenDeleteModal}>Eliminar cuenta</Button>
            </AccountActions>
          </SettingsBlock>
        </SectionContainer>
      </Section>
      <Section>
        <SectionContainer>
          <SettingsHeader>
            <Typography as="h2" $variant="title-4-semibold">Pagos:</Typography>
            <Typography as="p" color={theme.colors.defaultWeak}>Configura tu cuenta para recibir pagos</Typography>
          </SettingsHeader>
          <SettingsBlock>
            <ConnectedAccountBanner>
              {stripeStatus.loading && <Typography as="p">Cargando estado de Stripe...</Typography>}

              {!stripeStatus.loading && (
                <>
                  {!stripeStatus.hasStripeAccount && (
                    <>
                      <IntegrationIcon src="/icons/motorik-stripe-connect.svg" alt="Stripe Integration" />
                      <Typography as="h3" $variant="body-1-semibold">Activa los pagos</Typography>
                      <Typography as="p" $variant="body-1-regular" style={{ marginBottom: "8px" }}>Para ofrecer tickets de pago, necesitas activar los pagos en tu cuenta.</Typography>
                      <Button onClick={handleConnectStripe}>Activar pagos</Button>
                      <Typography>ID en Stripe: <strong>{user?.stripeConnectedAccountId || 'No conectado'}</strong></Typography>
                    </>
                  )}

                  {stripeStatus.hasStripeAccount && !stripeStatus.chargesEnabled && (
                    <>
                      <p>Tienes cuenta en Stripe, pero aún no se han habilitado los cobros.</p>
                      <Button onClick={handleConnectStripe}>Completar verificación</Button>
                      <Typography>ID en Stripe: <strong>{user?.stripeConnectedAccountId || 'No conectado'}</strong></Typography>

                    </>
                  )}

                  {stripeStatus.hasStripeAccount && stripeStatus.chargesEnabled && (
                    <>
                      <p>¡Tienes los pagos activos!</p>
                      <Typography>ID en Stripe: <strong>{user?.stripeConnectedAccountId || 'No conectado'}</strong></Typography>
                    </>
                  )}
                </>
              )}
            </ConnectedAccountBanner>
          </SettingsBlock>
        </SectionContainer>
      </Section>

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

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  align-items: center;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.sm};
  max-width: 1400px;
  width: 100%;
`;

const SectionContainer = styled(Container)`
  flex-direction: column;
`;

const SettingsHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.sizing.sm};
`;

const SettingsBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
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
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
`;

const AccountActions = styled(AccountContainer)`
    border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
    width: 100%;
    padding: ${({ theme }) => theme.sizing.xs};
`;

const ConnectedAccountBanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: ${({ theme }) => theme.fill.defaultWeak};
  padding: ${({ theme }) => theme.sizing.sm};
  border-radius: ${({ theme }) => theme.sizing.xs};
  gap: ${({ theme }) => theme.sizing.xs};
  width: 100%;
`;

const IntegrationIcon = styled.img`
  width: auto;
  max-height: 48px;
  padding-bottom: ${({ theme }) => theme.sizing.xs};
`;