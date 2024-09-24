import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Button from '../../components/Button/Button';
import InputText from '../Input/InputText';
import InputImage from '../Input/InputImage';

const AddVehicleModal = ({ isOpen, onClose, onVehicleSaved, vehicle, onVehicleDeleted }) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    nickname: '',
    year: '',
    image: null,
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        nickname: vehicle.nickname || '',
        year: vehicle.year || '',
        image: {
          file: null,
          previewUrl: vehicle.image,
        },
      });
      setFile(null);
    } else if (isOpen) {
      setFormData({
        brand: '',
        model: '',
        nickname: '',
        year: '',
        image: null,
      });
      setFile(null);
    }
  }, [vehicle, isOpen]);

  const handleDelete = async () => {
    if (!vehicle) return;

    try {
      const authToken = localStorage.getItem('authToken');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/vehicles/${vehicle._id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      onVehicleDeleted(vehicle._id); // Notificar que el vehículo fue eliminado
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Crear una URL temporal para mostrar la imagen en la previsualización
      const imagePreviewUrl = URL.createObjectURL(selectedFile);
      setFormData({
        ...formData,
        image: { file: selectedFile, previewUrl: imagePreviewUrl },
      });
      setFile(selectedFile); // Actualizar el estado de `file` también
    }
  };
  // const handleClose = () => {
  //   if (!vehicle) {
  //     // Solo limpiamos si es un nuevo vehículo
  //     setFormData({
  //       brand: '',
  //       model: '',
  //       nickname: '',
  //       year: '',
  //       image: null,
  //     });
  //     setFile(null); // Reinicia el archivo
  //   }
  //   onClose(); // Llama a la función de cierre del modal
  // };

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

    if (formData.image?.file) {
      vehicleFormData.append('image', formData.image.file);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      let response;
      if (vehicle) {
        // Si se está editando, enviamos una solicitud PUT
        response = await axios.put(`${process.env.REACT_APP_API_URL}/api/vehicles/${vehicle._id}`, vehicleFormData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Si es un nuevo vehículo, enviamos una solicitud POST
        response = await axios.post(`${process.env.REACT_APP_API_URL}/api/vehicles`, vehicleFormData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.data.success) {
        onVehicleSaved(response.data.vehicle); // Notificar que el vehículo fue guardado
        onClose(); // Cerrar el modal
      } else {
        console.error('Error guardando el vehículo');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.brand) newErrors.brand = 'La marca es obligatoria';
    if (!formData.model) newErrors.model = 'El modelo es obligatorio';
    if (!formData.year) newErrors.year = 'El año es obligatorio';

    // Verifica si la imagen está en formData.image
    if (!formData.image?.file && !vehicle?.image) {
      newErrors.file = 'La imagen es obligatoria';
    }

    return newErrors;
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <Modal>
        <div className='Heading'>
          <h3>{vehicle ? 'Editar Vehículo' : 'Añadir Vehículo'}</h3>
          <Button $variant="ghost" onClick={onClose}><img src='/icons/close.svg' alt='Close' /></Button>
        </div>
        <div className='ModalContent'>
          <form onSubmit={handleSubmit}>
            <InputImage
              imgSrc={formData.image?.previewUrl} // Vista previa de la imagen cargada
              onChangeFile={handleFileChange} // Manejador de cambio de archivo
              fileInputRef={fileInputRef}
              inputFileId="vehicleImage"
              errors={errors} // Manejo de errores
              required={!vehicle} // Requerido solo si es un nuevo vehículo
            />



            {/* <div>
              {formData.image?.previewUrl && (
                <div>
                  <img src={formData.image.previewUrl} alt="Vista previa" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                </div>
              )}
              <label>Subir imagen:</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                required={!vehicle} // Solo es requerido si se está añadiendo un vehículo
              />
              {errors.file && <p className="error">{errors.file}</p>}
            </div> */}
            <div>
              <label>Marca:</label>
              <InputText
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
              <InputText
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
              <InputText
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
              <InputText
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit" $variant="outline">
              {vehicle ? 'Guardar Cambios' : 'Añadir Vehículo'}
            </Button>
            {vehicle && (
              <Button type="button" $variant="danger" onClick={handleDelete}>
                Eliminar Vehículo
              </Button>
            )}
          </form>
        </div>
      </Modal>
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

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.fill.defaultMain};
  border-radius: 8px;
  z-index: 1001;
  max-width: 500px;
  width: 100%;

  .error {
    color: red;
    font-size: 0.8rem;
  }

  .Heading {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 8px 8px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.border.defaultSubtle};

    h3 {
      color: ${({ theme }) => theme.colors.defaultStrong};
      text-align: center;
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on, 'ss04' on;

      /* Titles/Desktop/Title 5/Semibold */
      font-family: "Mona Sans";
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 25.2px */
    }
  }

  .ModalContent {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
`;

