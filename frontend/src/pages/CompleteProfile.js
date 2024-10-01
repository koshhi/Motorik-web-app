import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Button from '../components/Button/Button';
import InputText from '../components/Input/InputText';
import InputTextArea from '../components/Input/InputTextArea';

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    userAvatar: '',
    description: '',
    city: '',
    country: '',
    phone: '',
    socialMediaLinks: []
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
        alert('Perfil completado con éxito');
        window.location.href = '/';  // Redirigir a la home después de completar el perfil
      } else {
        alert('Error completando el perfil');
      }
    } catch (error) {
      console.error('Error completando el perfil:', error);
    }
  };

  return (
    <EditForm onSubmit={handleSubmit}>
      <Navigation>
        <div className='container'>
          <div className='tabs'>
            <div className='tab'>Completa tu perfil</div>
            <div className='tab'>Marca tus intereses</div>
            <div className='tab'>Añade tu garaje</div>
          </div>
          <Button type="submit">Guardar cambios</Button>
        </div>
      </Navigation>
      <div className='header'>
        <h1>Completa tu perfil</h1>
      </div>
      <FormContainer>
        <img src={formData.userAvatar} alt="avatar" style={{ width: '100px', height: '100px' }} />
        <Button>Subir Imagen</Button>
        <label>
          Avatar URL:
          <InputText
            type="text"
            name="userAvatar"
            value={formData.userAvatar}
            onChange={handleChange}
            $size="large"
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
              $size="large"
            />
          </label>
          <label>
            Apellidos:
            <InputText
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              $size="large"
            />
          </label>
        </div>
        <div className='Row'>
          <label>
            Ciudad:
            <InputText
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              $size="large"
            />
          </label>
          <label>
            País:
            <InputText
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              $size="large"
            />
          </label>
        </div>
        <label>
          Teléfono:
          <InputText
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            $size="large"
          />
        </label>
        <label>
          Descripción:
          <InputTextArea style={{ height: '160px' }}
            name="description"
            value={formData.description}
            onChange={handleChange}
            $size="large"
          />
        </label>
        <div>Redes sociales</div>
        <FormActions>
          <Button type="submit">Guardar cambios</Button>
        </FormActions>
      </FormContainer>
    </EditForm>
  );
};

export default CompleteProfile;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: ${({ theme }) => theme.fill.defaultSubtle};
  position: relative;
  padding-bottom: 24px;

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

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 124px 0px ${({ theme }) => theme.sizing.xxl} 0px;

    h1 {
      color: ${({ theme }) => theme.colors.defaultStrong};
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;
      font-family: "Mona Sans";
      font-size: 28px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 39.2px */
    }
`;

const FormActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: flex-end;
`;

const FormContainer = styled.div`
  display: flex;
  width: 590px;
  padding: var(--Spacing-lg, 32px);
  flex-direction: column;
  align-items: center;
  gap: var(--Spacing-lg, 32px);
  border-radius: var(--Spacing-xs, 8px);
  background: var(--bg-default-main, #FFF);
  box-shadow: 0px 2px 12px 0px rgba(26, 26, 26, 0.04);
`;

const Navigation = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-default-main, #FFF);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 1;

  .container {
    width: 100%;
    max-width: 1400px;
    display: flex;
    padding: 16px 24px;
    align-items: center;
    gap: 40px;
    justify-content: space-between;

    .tabs{
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex-direction: row;
      
      .tab {
      
      }
    }
  }
`;
