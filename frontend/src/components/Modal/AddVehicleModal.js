import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Button from '../../components/Button/Button';
import InputText from '../Input/InputText';

const AddVehicleModal = ({ isOpen, onClose, onVehicleCreated }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    nickname: '',
    year: '',
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.brand) newErrors.brand = 'La marca es obligatoria';
    if (!formData.model) newErrors.model = 'El modelo es obligatorio';
    if (!formData.year) newErrors.year = 'El año es obligatorio';
    if (!file) newErrors.file = 'La imagen es obligatoria';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const vehicleFormData = new FormData();
    vehicleFormData.append('brand', formData.brand);
    vehicleFormData.append('model', formData.model);
    vehicleFormData.append('nickname', formData.nickname);
    vehicleFormData.append('year', formData.year);
    vehicleFormData.append('image', file);

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/vehicles`, vehicleFormData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onVehicleCreated(response.data.vehicle); // Notificar que el vehículo fue creado
        onClose(); // Cerrar el modal
      } else {
        console.error('Error creando el vehículo');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Añadir Vehículo</h3>
        <Button variant="ghost" onClick={onClose}><img src='/icons/close.svg' alt='Close' /></Button>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Marca:</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
            />
            {errors.brand && <p className="error">{errors.brand}</p>}
          </div>
          <div>
            <label>Modelo:</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
            />
            {errors.model && <p className="error">{errors.model}</p>}
          </div>
          <div>
            <label>Año:</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
            />
            {errors.year && <p className="error">{errors.year}</p>}
          </div>
          <div>
            <label>Apodo (opcional):</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Subir imagen:</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              required
            />
            {errors.file && <p className="error">{errors.file}</p>}
          </div>
          <Button type="submit" variant="outline">Añadir Vehículo</Button>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddVehicleModal;

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
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;

  .error {
    color: red;
    font-size: 0.8rem;
  }
`;

