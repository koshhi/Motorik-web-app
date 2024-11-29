// components/AddTicketForm.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InputText from '../components/Input/InputText';
import Button from '../components/Button/Button';
import Switch from '../components/Switch';
import Typography from '../components/Typography';
import ToogableTabs from '../components/Toogle/ToogableTabs'; // Importa ToogableTabs
import { theme } from '../theme';
import { toast } from 'react-toastify'; // Importa toast para notificaciones

// Opciones para ToogableTabs
const ticketOptions = [
  { label: 'Gratis', value: 'free' },
  { label: 'De Pago', value: 'paid' },
];

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

const AddTicketForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'free',
    price: 0,
    approvalRequired: false,
    capacity: 10,
  });

  const [errors, setErrors] = useState({});

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
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormFields>
        {/* Nombre del Ticket */}
        <InputWrapper>
          <Typography $variant="body-2-medium" as="label">Nombre del Ticket:</Typography>
          <InputText
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre del ticket"
            required
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </InputWrapper>

        {/* Tipo de Ticket usando ToogableTabs */}
        <InputWrapper>
          <Typography $variant="body-2-medium" as="label">Tipo de Ticket:</Typography>
          <ToogableTabs
            options={ticketOptions}
            activeOption={formData.type}
            onTabChange={handleTabChange}
          />
        </InputWrapper>

        {/* Precio del Ticket (solo para tipo 'paid') */}
        {formData.type === 'paid' && (
          <InputWrapper>
            <Typography $variant="body-2-medium" as="label">Precio (€):</Typography>
            <InputText
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              placeholder="Precio del ticket"
              required={formData.type === 'paid'}
            />
            {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
          </InputWrapper>
        )}

        {/* Capacidad del Ticket */}
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

        {/* Aprobación Requerida (solo para tipo 'free') */}
        {formData.type === 'free' && (
          <InputWrapper>
            <Typography $variant="body-2-medium" as="label">Aprobación Requerida:</Typography>
            <Switch
              value={formData.approvalRequired}
              onChange={(value) => setFormData(prev => ({ ...prev, approvalRequired: value }))}
            />
          </InputWrapper>
        )}

      </FormFields>
      <FormActions>
        <Button style={{ justifyContent: "center" }} type="submit">Crear Ticket</Button>
        {/* <Button type="button" $variant="ghost" onClick={onClose}>Cancelar</Button> */}
      </FormActions>
    </Form>
  );
};

export default AddTicketForm;
