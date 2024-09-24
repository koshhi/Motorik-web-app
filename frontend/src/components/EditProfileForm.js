import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from './Button/Button';
import InputText from './Input/InputText';
import InputTextArea from './Input/InputTextArea';

const EditProfileForm = ({ profileUser, onClose }) => {
  const [formData, setFormData] = useState({
    name: profileUser.name || '',
    lastName: profileUser.lastName || '',
    userAvatar: profileUser.userAvatar || '',
    description: profileUser.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        alert('Perfil actualizado con éxito');
        onClose(); // Cierra el modal después de actualizar
      } else {
        alert('Error actualizando el perfil');
      }
    } catch (error) {
      console.error('Error actualizando el perfil:', error);
    }
  };

  return (
    <EditForm onSubmit={handleSubmit}>
      <img src={formData.userAvatar} alt="avatar" style={{ width: '100px', height: '100px' }} />
      <label>
        Avatar URL:
        <InputText
          type="text"
          name="userAvatar"
          value={formData.userAvatar}
          onChange={handleChange}
        />
      </label>
      <div className='Row'>
        <label>
          Nombre:
          <InputText
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Apellidos:
          <InputText
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
      </div>
      <label>
        Descripción:
        <InputTextArea style={{ height: '160px' }}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <FormActions>
        <Button type="submit">Guardar cambios</Button>
        <Button $variant="outline" type="button" onClick={onClose}>Cancelar</Button>
      </FormActions>
    </EditForm>
  );
};

export default EditProfileForm;

const EditForm = styled.form`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  width: 100%;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    color: var(--text-icon-default-main, #292929);
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    font-family: "Mona Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 19.6px */
  }
  
  .Row {
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    width: 100%;

  }
`;

const FormActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: flex-end;
`;