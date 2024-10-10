import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/Button/Button';
import InputText from '../Input/InputText';
import InputImage from '../Input/InputImage';
import Select from '../Select/Select';

const AddVehicleModal = ({ isOpen, onClose, onVehicleSaved, vehicle, onVehicleDeleted }) => {
  const [formData, setFormData] = useState({
    brand: '',
    customBrand: '',
    model: '',
    customModel: '',
    nickname: '',
    year: '',
    image: null,
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosClient.get('/api/vehicles/brands');
        setBrands(response.data.brands);
      } catch (error) {
        console.error('Error al cargar las marcas:', error);
      }
    };
    fetchBrands();
  }, []);

  const resetForm = () => {
    setFormData({
      brand: '',
      customBrand: '',
      model: '',
      customModel: '',
      nickname: '',
      year: '',
      image: null,
    });
    setFile(null);
    setIsCustomBrand(false);
    setIsCustomModel(false);
    setModels([]);
  };

  useEffect(() => {
    if (isOpen) {
      if (vehicle) {
        // Establecer formData con los datos del vehículo para edición
        setFormData({
          brand: vehicle.brand || '',
          customBrand: '',
          model: vehicle.model || '',
          customModel: '',
          nickname: vehicle.nickname || '',
          year: vehicle.year || '',
          image: {
            file: null,
            previewUrl: vehicle.image,
          },
        });
        setFile(null);

        // Lógica para manejar marcas y modelos personalizados
        if (brands.length > 0) {
          if (!brands.includes(vehicle.brand)) {
            setIsCustomBrand(true);
            setFormData((prev) => ({
              ...prev,
              customBrand: vehicle.brand,
              brand: '',
            }));
          } else {
            setIsCustomBrand(false);
          }
        }

        if (models.length > 0) {
          if (!models.includes(vehicle.model)) {
            setIsCustomModel(true);
            setFormData((prev) => ({
              ...prev,
              customModel: vehicle.model,
              model: '',
            }));
          } else {
            setIsCustomModel(false);
          }
        }
      } else {
        // Reiniciar formData para agregar un nuevo vehículo
        resetForm();
      }
    } else {
      // Reiniciar formData al cerrar el modal
      resetForm();
    }
  }, [isOpen, vehicle]);

  useEffect(() => {
    if (vehicle && brands.length > 0) {
      if (!brands.includes(vehicle.brand)) {
        setIsCustomBrand(true);
        setFormData((prev) => ({
          ...prev,
          customBrand: vehicle.brand,
          brand: '',
        }));
      } else {
        setIsCustomBrand(false);
        setFormData((prev) => ({
          ...prev,
          brand: vehicle.brand,
        }));
      }
    }
  }, [brands]);


  useEffect(() => {
    if (vehicle && models.length > 0) {
      if (!models.includes(vehicle.model)) {
        setIsCustomModel(true);
        setFormData((prev) => ({
          ...prev,
          customModel: vehicle.model,
          model: '',
        }));
      } else {
        setIsCustomModel(false);
        setFormData((prev) => ({
          ...prev,
          model: vehicle.model,
        }));
      }
    }
  }, [models]);

  const loadModels = async (brand) => {
    try {
      const response = await axiosClient.get(`/api/vehicles/models?brand=${brand}`);
      setModels(response.data.models);
    } catch (error) {
      console.error('Error al cargar los modelos:', error);
    }
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    if (value === 'Other Brand') {
      setIsCustomBrand(true);
      setIsCustomModel(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        brand: '',
        customBrand: '',
        model: '',
        customModel: '',
      }));
      setModels([]);
    } else {
      setIsCustomBrand(false);
      setIsCustomModel(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        brand: value,
        customBrand: '',
        model: '',
        customModel: '',
      }));
      loadModels(value);
    }
  };

  const handleCustomBrandChange = (e) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      customBrand: value,
      model: '',
      customModel: '',
    }));
    if (brands.includes(value)) {
      setIsCustomBrand(false);
      setIsCustomModel(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        brand: value,
        customBrand: '',
        model: '',
        customModel: '',
      }));
      loadModels(value);
    }
  };


  const handleModelChange = (e) => {
    const value = e.target.value;
    if (value === 'Other Model') {
      setIsCustomModel(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        model: '',
        customModel: '',
      }));
    } else {
      setIsCustomModel(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        model: value,
        customModel: '',
      }));
    }
  };

  const handleCustomModelChange = (e) => {
    const value = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      customModel: value,
    }));
    if (models.includes(value)) {
      setIsCustomModel(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        model: value,
        customModel: '',
      }));
    }
  };

  const handleDelete = async () => {
    if (!vehicle) return;

    try {
      await axiosClient.delete(`/api/vehicles/${vehicle.id}`);
      onVehicleDeleted(vehicle.id); // Notificar que el vehículo fue eliminado
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const imagePreviewUrl = URL.createObjectURL(selectedFile);
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: { file: selectedFile, previewUrl: imagePreviewUrl },
      }));
      setFile(selectedFile);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isCustomBrand) {
      if (!formData.customBrand) {
        newErrors.customBrand = 'Debes especificar la marca personalizada';
      }
    } else {
      if (!formData.brand) {
        newErrors.brand = 'La marca es obligatoria';
      }
    }

    if (isCustomModel || isCustomBrand) {
      if (!formData.customModel) {
        newErrors.customModel = 'Debes especificar el modelo personalizado';
      }
    } else {
      if (!formData.model) {
        newErrors.model = 'El modelo es obligatorio';
      }
    }

    if (!formData.year) {
      newErrors.year = 'El año es obligatorio';
    }

    if (!formData.image?.file && !vehicle?.image) {
      newErrors.file = 'La imagen es obligatoria';
    }

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
    vehicleFormData.append(
      'brand',
      isCustomBrand ? formData.customBrand : formData.brand
    );
    vehicleFormData.append(
      'model',
      isCustomModel ? formData.customModel : formData.model
    );
    vehicleFormData.append('nickname', formData.nickname);
    vehicleFormData.append('year', formData.year);

    if (formData.image?.file) {
      vehicleFormData.append('image', formData.image.file);
    }

    try {
      let response;
      if (vehicle) {
        // Si se está editando, enviamos una solicitud PUT
        response = await axiosClient.put(`/api/vehicles/${vehicle.id}`, vehicleFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Si es un nuevo vehículo, enviamos una solicitud POST
        response = await axiosClient.post('/api/vehicles', vehicleFormData, {
          headers: {
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

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <Modal>
        <div className='Heading'>
          <h3>{vehicle ? 'Editar moto' : 'Añadir moto'}</h3>
          <Button $variant="ghost" onClick={onClose}><img src='/icons/close.svg' alt='Close' /></Button>
        </div>
        <div className='ModalContent'>
          <form onSubmit={handleSubmit}>
            <InputImage
              imgSrc={formData.image?.previewUrl}
              onChangeFile={handleFileChange}
              fileInputRef={fileInputRef}
              inputFileId="vehicleImage"
              errors={errors}
              required={!vehicle}
            />
            <div className='FormItem'>
              <label>Marca:</label>
              <div className='RowWrapper'>
                <div className='BrandSelect'>
                  <Select
                    name="brand"
                    onChange={handleBrandChange}
                    value={isCustomBrand ? 'Other Brand' : formData.brand}
                    required
                    $size="large"
                  >
                    <option value="">Selecciona una marca</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                    <option value="Other Brand">Otra marca</option>
                  </Select>
                  {errors.brand && <p className="error">{errors.brand}</p>}
                </div>
                {isCustomBrand && (
                  <>
                    <div className='BrandSelect'>
                      <InputText
                        style={{ maxHeight: "50px" }}
                        name="customBrand"
                        value={formData.customBrand}
                        onChange={handleCustomBrandChange}
                        placeholder="Escribe la marca"
                        required
                        $size="large"
                      />
                      {errors.customBrand && (
                        <p className="error">{errors.customBrand}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className='FormItem'>
              <label>Modelo:</label>
              <div className='RowWrapper'>
                {!isCustomBrand && (
                  <>
                    <div className='BrandSelect'>
                      <Select
                        name="model"
                        onChange={handleModelChange}
                        value={isCustomModel ? 'Other Model' : formData.model}
                        required
                        $size="large"
                      >
                        <option value="">Selecciona un modelo</option>
                        {models.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                        <option value="Other Model">Otro modelo</option>
                      </Select>
                      {errors.model && <p className="error">{errors.model}</p>}
                    </div>
                  </>
                )}
                {(isCustomModel || isCustomBrand) && (
                  <>
                    <div className='BrandSelect'>
                      <InputText
                        style={{ maxHeight: "50px" }}
                        name="customModel"
                        value={formData.customModel}
                        onChange={handleCustomModelChange}
                        placeholder="Escribe el modelo"
                        required
                        $size="large"
                      />
                      {errors.customModel && (
                        <p className="error">{errors.customModel}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className='FormItem'>
              <div className='RowWrapper'>
                <div className='YearInput'>
                  <label>Año:</label>
                  <InputText
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    $size="large"
                  />
                  {errors.year && <p className="error">{errors.year}</p>}
                </div>
                <div className='NicknameInput'>
                  <label>Apodo (opcional):</label>
                  <InputText
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    $size="large"
                  />
                </div>
              </div>
            </div>
            <Button style={{ justifyContent: "center" }} type="submit" size="medium">
              {vehicle ? 'Guardar Cambios' : 'Guardar moto'}
            </Button>
            {vehicle && (
              <Button style={{ justifyContent: "center" }} type="button" $variant="outlineDanger" size="medium" onClick={handleDelete}>
                Eliminar moto
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
    gap: 16px;
    width: 100%;

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;

      .FormItem {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        width: 100%;

        .RowWrapper {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          width: 100%;

          .BrandSelect {
            width: 100%;
          }
          
          .YearInput,
          .NicknameInput {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
        }
      }
    }
  }
`;

