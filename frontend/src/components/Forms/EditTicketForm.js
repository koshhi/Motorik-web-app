// EditTicketForm.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InputText from '../Input/InputText';
import Button from '../Button/Button';
import Switch from '../Switch';
import Typography from '../Typography'
// import Select from '../components/Select/Select';
import ToogableTabs from '../Toogle/ToogableTabs';
import { theme } from '../../theme';
import { toast } from 'react-toastify'; // Importa toast para notificaciones
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


// Estilos para el formulario
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
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

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
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
  padding: ${({ theme }) => theme.sizing.sm} 0 0 0;
`;

// Opciones para el tipo de ticket
const ticketOptions = [
  { label: 'Gratis', value: 'free' },
  { label: 'De Pago', value: 'paid' },
];

const EditTicketForm = ({ ticket, onSubmit, onClose }) => {
  const { user, stripeStatus, refreshStripeStatus } = useAuth();
  const navigate = useNavigate();

  // Estado local del formulario
  const [formData, setFormData] = useState({
    name: ticket.name,
    type: ticket.type,
    price: ticket.type === 'paid' ? ticket.price : 0,
    approvalRequired: ticket.type === 'free' ? ticket.approvalRequired : false,
    capacity: ticket.capacity,
  });

  const [errors, setErrors] = useState({});

  // Al montar, si el usuario existe, refrescamos el estado de Stripe
  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      refreshStripeStatus(userId);
    }
  }, [user, refreshStripeStatus]);

  // Manejar cambios en las pestañas de tipo de ticket
  const handleTabChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
      // Si se cambia a 'paid' y el precio es 0, establecerlo en 10
      price: value === 'paid' && prev.price === 0 ? 10 : prev.price,
      // Si se cambia a 'free', desactivar la aprobación requerida
      approvalRequired: value === 'free' ? prev.approvalRequired : false,
    }));
  };

  // Validación del formulario
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre del ticket es obligatorio.';
    if (formData.type === 'paid' && (formData.price === undefined || formData.price <= 0)) {
      newErrors.price = 'El precio debe ser mayor a 0 para tickets de pago.';
    }
    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = 'La capacidad debe ser al menos 1.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Por favor, corrige los errores en el formulario.');
      return;
    }
    onSubmit(ticket._id, formData);
  };


  return (
    // <Form onSubmit={handleSubmit}>
    //   <FormFields>
    //     {/* Nombre del Ticket */}
    //     <InputWrapper>
    //       <Typography $variant="body-2-medium" as="label">Nombre del Ticket:</Typography>
    //       <InputText
    //         type="text"
    //         name="name"
    //         value={formData.name}
    //         onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
    //         placeholder="Nombre del ticket"
    //         required
    //       />
    //       {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
    //     </InputWrapper>

    //     {/* Tipo de Ticket usando ToogableTabs */}
    //     <InputWrapper>
    //       <Typography $variant="body-2-medium" as="label">Tipo de Ticket:</Typography>
    //       <ToogableTabs
    //         options={ticketOptions}
    //         activeOption={formData.type}
    //         onTabChange={handleTabChange}
    //       />
    //     </InputWrapper>

    //     {/* Precio del Ticket (solo para tipo 'paid') */}
    //     {formData.type === 'paid' && (
    //       <InputWrapper>
    //         <Typography $variant="body-2-medium" as="label">Precio (€):</Typography>
    //         <InputText
    //           type="number"
    //           name="price"
    //           value={formData.price}
    //           onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
    //           placeholder="Precio del ticket"
    //           required={formData.type === 'paid'}
    //         />
    //         {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
    //       </InputWrapper>
    //     )}

    //     {/* Capacidad del Ticket */}
    //     <InputWrapper>
    //       <Typography $variant="body-2-medium" as="label">Capacidad:</Typography>
    //       <InputText
    //         type="number"
    //         name="capacity"
    //         value={formData.capacity}
    //         onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
    //         placeholder="Capacidad del ticket"
    //         required
    //       />
    //       {errors.capacity && <ErrorMessage>{errors.capacity}</ErrorMessage>}
    //     </InputWrapper>

    //     {/* Aprobación Requerida (solo para tipo 'free') */}
    //     {formData.type === 'free' && (
    //       <InputWrapper>
    //         <Typography $variant="body-2-medium" as="label">Aprobación Requerida:</Typography>
    //         <Switch
    //           value={formData.approvalRequired}
    //           onChange={(value) => setFormData(prev => ({ ...prev, approvalRequired: value }))}
    //         />
    //       </InputWrapper>
    //     )}

    //   </FormFields>
    //   <FormActions>
    //     <Button style={{ justifyContent: "center" }} type="submit">Guardar Ticket</Button>
    //     {/* <Button type="button" $variant="ghost" onClick={onClose}>Cancelar</Button> */}
    //   </FormActions>
    // </Form>
    <Form onSubmit={handleSubmit}>
      <FormFields>
        {/* Nombre del Ticket */}
        <InputWrapper>
          <Typography $variant="body-2-medium" as="label">Nombre</Typography>
          <InputText
            type="text"
            name="name"
            $size="large"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Dale un nombre a la entrada..."
            required
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </InputWrapper>

        {/* Tipo de Ticket */}
        <InputWrapper>
          <Typography $variant="body-2-medium" as="label">Tipo</Typography>
          <ToogableTabs
            options={ticketOptions}
            activeOption={formData.type}
            onTabChange={handleTabChange}
          />
        </InputWrapper>

        {/* Si el ticket es de pago, gestionamos de forma condicional */}
        {formData.type === 'paid' ? (
          <>
            {stripeStatus.loading ? (
              <p>Cargando estado de Stripe...</p>
            ) : (
              <>
                {!stripeStatus.hasStripeAccount ? (
                  <ConnectedAccountBanner>
                    <IntegrationIcon src="/icons/motorik-stripe-connect.svg" alt="Stripe Integration" />
                    <Typography as="h3" $variant="title-5-semibold">
                      Configura tu cuenta para vender entradas de pago.
                    </Typography>
                    <Typography as="p" $variant="body-1-regular" color={theme.colors.defaultWeak}>
                      Para crear entradas de pago, activa los pagos en tu cuenta. Ve a tu configuración.
                    </Typography>
                    <StripeActions>
                      <Button size="medium" onClick={() => navigate('/user/' + (user._id || user.id) + '/settings')}>
                        Ir a Configuración
                      </Button>
                    </StripeActions>
                  </ConnectedAccountBanner>
                ) : !stripeStatus.chargesEnabled ? (
                  <ConnectedAccountBanner>
                    <IntegrationIcon src="/icons/motorik-stripe-connect.svg" alt="Stripe Integration" />
                    <Typography as="h3" $variant="title-5-semibold">
                      No tienes habilitados los cobros.
                    </Typography>
                    <Typography as="p" $variant="body-2-regular">
                      Para ofrecer tickets de pago, tu cuenta de Stripe debe estar verificada y habilitada para cobrar.
                    </Typography>
                    <Button size="small" onClick={() => navigate('/user/' + (user._id || user.id) + '/settings')}>
                      Ir a Configuración
                    </Button>
                  </ConnectedAccountBanner>
                ) : (
                  <>
                    <InputWrapper>
                      <Typography $variant="body-2-medium" as="label">Precio (€):</Typography>
                      <InputText
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        placeholder="Precio del ticket"
                        required
                      />
                      {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
                    </InputWrapper>
                    {/* En este ejemplo, suponemos que para tickets de pago también se edita la capacidad */}
                    <InputWrapper>
                      <Typography $variant="body-2-medium" as="label">Capacidad:</Typography>
                      <InputText
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                        placeholder="Capacidad del ticket"
                        required
                      />
                      {errors.capacity && <ErrorMessage>{errors.capacity}</ErrorMessage>}
                    </InputWrapper>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          // Para tickets "free" se muestran los campos de capacidad y opción de aprobación
          <>
            <InputWrapper>
              <Typography $variant="body-2-medium" as="label">Capacidad:</Typography>
              <InputText
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                placeholder="Capacidad del ticket"
                required
              />
              {errors.capacity && <ErrorMessage>{errors.capacity}</ErrorMessage>}
            </InputWrapper>
            <InputWrapper>
              <Typography $variant="body-2-medium" as="label">Aprobación Requerida:</Typography>
              <Switch
                value={formData.approvalRequired}
                onChange={(value) => setFormData(prev => ({ ...prev, approvalRequired: value }))}
              />
            </InputWrapper>
          </>
        )}
      </FormFields>
      <FormActions>
        <Button
          style={{ justifyContent: "center" }}
          type="submit"
          size="medium"
          disabled={formData.type === 'paid' && (!stripeStatus.hasStripeAccount || !stripeStatus.chargesEnabled)}
        >
          Guardar Ticket
        </Button>
      </FormActions>
    </Form>
  );
};

export default EditTicketForm;
