// src/components/Forms/AddVehicleForm.js

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import Button from '../Button/Button';
import InputText from '../Input/InputText';
import InputImage from '../Input/InputImage';
import Select from '../Select/Select';
import Typography from '../Typography';
import { useVehicles } from '../../context/VehicleContext';

const AddVehicleForm = ({ onSubmit, vehicle, onClose }) => {
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

  const { loading } = useVehicles();

  // Cargar marcas al montar
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosClient.get('/api/vehicles/brands');
        setBrands(response.data.brands);
      } catch (error) {
        console.error('Error al cargar las marcas:', error);
        toast.error('Error al cargar las marcas.');
      }
    };
    fetchBrands();
  }, []);

  // Resetear formulario
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
    setErrors({});
  };

  // Manejar edición de vehículo
  useEffect(() => {
    if (vehicle) {
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

      const checkCustomBrand = async () => {
        if (!brands.includes(vehicle.brand)) {
          // Marca personalizada
          setIsCustomBrand(true);
          setIsCustomModel(true); // Asegurar que isCustomModel esté activo
          setFormData((prev) => ({
            ...prev,
            customBrand: vehicle.brand,
            brand: '',
            customModel: vehicle.model,
            model: '',
          }));
          setModels([]);
        } else {
          // Marca existente, cargar modelos
          setIsCustomBrand(false);
          setIsCustomModel(false); // Inicializar isCustomModel a false
          const loadedModels = await loadModels(vehicle.brand);
          console.log('Modelos cargados:', loadedModels);
          console.log('Modelo del vehículo:', vehicle.model);
          if (loadedModels.includes(vehicle.model)) {
            // Modelo existente
            setIsCustomModel(false);
            setFormData((prev) => ({
              ...prev,
              model: vehicle.model,
              customModel: '',
            }));
          } else {
            // Modelo personalizado
            setIsCustomModel(true);
            setFormData((prev) => ({
              ...prev,
              model: '',
              customModel: vehicle.model,
            }));
          }
        }
      };

      checkCustomBrand();
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle, brands]);

  // Función para cargar modelos según la marca
  const loadModels = async (brand) => {
    try {
      const response = await axiosClient.get(`/api/vehicles/models?brand=${brand}`);
      setModels(response.data.models);
      return response.data.models; // Retornar los modelos cargados
    } catch (error) {
      console.error('Error al cargar los modelos:', error);
      toast.error('Error al cargar los modelos.');
      return [];
    }
  };

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    if (value === 'Other Brand') {
      setIsCustomBrand(true);
      setIsCustomModel(true); // Activar isCustomModel
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
      setFormData((prevFormData) => ({
        ...prevFormData,
        brand: value,
        customBrand: '',
        model: '',
        customModel: '',
      }));
      setIsCustomModel(false); // Desactivar isCustomModel al seleccionar una marca existente
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
      loadModels(value);
    }
  };

  const handleModelChange = (e) => {
    const value = e.target.value;
    console.log('handleModelChange:', value);
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
    console.log('handleCustomModelChange:', value);
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

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar Marca
    if (isCustomBrand) {
      if (!formData.customBrand.trim()) {
        newErrors.customBrand = 'Debes especificar la marca personalizada.';
      }
    } else {
      if (!formData.brand) {
        newErrors.brand = 'La marca es obligatoria.';
      }
    }

    // Validar Modelo
    if (isCustomModel || isCustomBrand) { // Modificación aquí
      if (!formData.customModel.trim()) {
        newErrors.customModel = 'Debes especificar el modelo personalizado.';
      }
    } else {
      if (!formData.model) {
        newErrors.model = 'El modelo es obligatorio.';
      }
    }

    // Validar Año
    if (!formData.year) {
      newErrors.year = 'El año es obligatorio.';
    } else if (isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'El año es inválido.';
    }

    // Validar Imagen
    if (!formData.image?.file && !vehicle?.image) {
      newErrors.file = 'La imagen es obligatoria.';
    }

    return newErrors;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Por favor, corrige los errores en el formulario.');
      return;
    }

    setErrors({});

    try {
      const vehicleData = new FormData();
      vehicleData.append('brand', isCustomBrand ? formData.customBrand : formData.brand);
      vehicleData.append('model', isCustomModel ? formData.customModel : formData.model);
      vehicleData.append('nickname', formData.nickname);
      vehicleData.append('year', formData.year);

      if (formData.image?.file) {
        vehicleData.append('image', formData.image.file);
      }

      console.log('Submitting vehicleData:', {
        brand: isCustomBrand ? formData.customBrand : formData.brand,
        model: isCustomModel ? formData.customModel : formData.model,
        nickname: formData.nickname,
        year: formData.year,
        image: formData.image?.file ? formData.image.file.name : null,
      });

      await onSubmit(vehicleData);
    } catch (error) {
      console.error('Error al guardar el vehículo:', error);
      toast.error('Error al guardar el vehículo.');
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormItem>
          <InputImage
            imgSrc={formData.image?.previewUrl || (vehicle ? vehicle.image : '')}
            onChangeFile={handleFileChange}
            fileInputRef={fileInputRef}
            inputFileId="vehicleImage"
            errors={errors}
            required={!vehicle}
          />
          {errors.file && <ErrorText>{errors.file}</ErrorText>}
        </FormItem>

        <FormItem>
          <Typography as="label" $variant="body-1-regular">Marca:</Typography>
          <RowWrapper>
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
            {isCustomBrand && (
              <InputText
                name="customBrand"
                value={formData.customBrand}
                onChange={handleCustomBrandChange}
                placeholder="Escribe la marca"
                required
                $size="large"
              />
            )}
          </RowWrapper>
          {errors.brand && <ErrorText>{errors.brand}</ErrorText>}
          {errors.customBrand && <ErrorText>{errors.customBrand}</ErrorText>}
        </FormItem>

        <FormItem>
          <Typography as="label" $variant="body-1-regular">Modelo:</Typography>
          <RowWrapper>
            {!isCustomBrand && (
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
            )}
            {(isCustomModel || isCustomBrand) && (
              <InputText
                name="customModel"
                value={formData.customModel}
                onChange={handleCustomModelChange}
                placeholder="Escribe el modelo"
                required
                $size="large"
              />
            )}
          </RowWrapper>
          {errors.model && <ErrorText>{errors.model}</ErrorText>}
          {errors.customModel && <ErrorText>{errors.customModel}</ErrorText>}
        </FormItem>

        <FormItem>
          <RowWrapper>
            <FormGroup>
              <Typography as="label" $variant="body-1-regular">Año:</Typography>
              <InputText
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                $size="large"
              />
              {errors.year && <ErrorText>{errors.year}</ErrorText>}
            </FormGroup>
            <FormGroup>
              <Typography as="label" $variant="body-1-regular">Apodo (opcional):</Typography>
              <InputText
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                $size="large"
              />
            </FormGroup>
          </RowWrapper>
        </FormItem>

        <ActionsContainer>
          <Button type="submit" size="medium" disabled={loading}>
            {loading ? 'Guardando...' : (vehicle ? 'Guardar Cambios' : 'Guardar Vehículo')}
          </Button>
          <Button
            $variant="outline"
            $fullWidth
            $contentAlign="center"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </ActionsContainer>

      </form>
    </FormContainer>
  );
};

AddVehicleForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  vehicle: PropTypes.object, // Puede ser null o undefined si se está creando un nuevo vehículo
  onClose: PropTypes.func, // Opcional: si es necesario
};

export default AddVehicleForm;

// Styled Components

const FormContainer = styled.div`
  padding-top: ${({ theme }) => theme.sizing.sm};
  width: 100%;
`;

const FormItem = styled.div`
  padding-left: ${({ theme }) => theme.sizing.sm};
  padding-right: ${({ theme }) => theme.sizing.sm};
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xxs};
  align-items: flex-start;
  width: 100%;
`;

const RowWrapper = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.8rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
  padding: ${({ theme }) => theme.sizing.sm};
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  width: 100%;
`;
