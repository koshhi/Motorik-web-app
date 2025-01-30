import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import styled from 'styled-components';
import Button from '../components/Button/Button';
import InputText from '../components/Input/InputText';
import InputTextArea from '../components/Input/InputTextArea';
import Select from '../components/Select/Select';
import countryCodes from '../utils/CountryCodes';
import { toast } from 'react-toastify';
import { getPlatform, getIcon } from '../utils/socialMediaUtils';
import { CircleFlag } from 'react-circle-flags';
import { Autocomplete } from '@react-google-maps/api';

const CompleteProfile = () => {
  const { userId } = useParams();
  const isEditMode = Boolean(userId);
  const pageTitle = isEditMode ? 'Editar perfil' : 'Completa tu perfil';
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    userAvatar: '',
    description: '',
    address: '',
    locality: '',
    country: '',
    phonePrefix: '+34',
    phoneNumber: '',
    socialMediaLinks: []
  });

  // Replace the existing useEffect with this one
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        userAvatar: user.userAvatar || '',
        description: user.description || '',
        address: user.address || '',
        locality: user.locality || '',
        country: user.country || '',
        phonePrefix: user.phonePrefix || '+34',
        phoneNumber: user.phoneNumber || '',
        socialMediaLinks: user.socialMediaLinks || []
      });
    }
  }, [user]);

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newLink, setNewLink] = useState('');
  const [errors, setErrors] = useState({});
  const addressRef = useRef(null);

  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        // Extraer locality y country de address_components
        const addressComponents = place.address_components;
        let locality = '';
        let country = '';

        addressComponents.forEach(component => {
          const types = component.types;
          if (types.includes('locality')) {
            locality = component.long_name;
          } else if (types.includes('administrative_area_level_2') && !locality) {
            // Fallback si no hay locality
            locality = component.long_name;
          } else if (types.includes('country')) {
            country = component.long_name;
          }
        });

        setFormData(prev => ({
          ...prev,
          address: place.formatted_address,
          locality: locality,
          country: country
        }));
      }
    } else {
      console.log('¡Autocomplete aún no está cargado!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el input es el de dirección, actualizar el estado directamente
    if (name === 'address') {
      setFormData(prev => ({
        ...prev,
        address: value
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      const platform = getPlatform(newLink);

      setFormData((prevState) => ({
        ...prevState,
        socialMediaLinks: [
          ...prevState.socialMediaLinks,
          { url: newLink, platform }
        ]
      }));
      setNewLink('');
    }
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = formData.socialMediaLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, socialMediaLinks: updatedLinks });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'Los apellidos son obligatorios';
    if (!formData.userAvatar && !file) newErrors.userAvatar = 'La imagen de perfil es obligatoria';
    if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!formData.phonePrefix) newErrors.phonePrefix = 'El prefijo del teléfono es obligatorio';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'El número de teléfono es obligatorio';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      // Create FormData object
      const data = new FormData();
      data.append('name', formData.name);
      data.append('lastName', formData.lastName);
      data.append('description', formData.description);
      data.append('address', formData.address);
      data.append('locality', formData.locality);
      data.append('country', formData.country);
      data.append('phonePrefix', formData.phonePrefix);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('socialMediaLinks', JSON.stringify(formData.socialMediaLinks));
      if (file) data.append('userAvatar', file);
      data.append('profileFilled', true);

      const updateResponse = await axiosClient.put(
        '/api/users/profile',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (updateResponse.data.success) {
        // Force a fresh fetch of user data
        const updatedUser = await refreshUserData();

        if (updatedUser && updatedUser.profileFilled) {
          toast.success('Perfil completado correctamente');
          navigate('/', { replace: true });
        } else {
          toast.error('Error actualizando los datos del usuario');
        }
      }
    } catch (error) {
      console.error('Error al completar el perfil:', error);
      if (error?.response?.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        navigate('/signin');
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCountry = countryCodes.find(code => code.dial_code === formData.phonePrefix);

  // if (!isLoaded) return <div>Cargando...</div>;


  return (
    <EditForm onSubmit={handleSubmit}>
      <Navigation>
        <div className='container'>
          {isEditMode ? (
            <h2>Editar perfil</h2>
          ) : (
            <div className='tabs'>
              <div className='tab'>Completa tu perfil</div>
              <div className='tab'>Marca tus intereses</div>
              <div className='tab'>Añade tu garaje</div>
            </div>
          )}
          <Button type="submit">Guardar cambios</Button>
        </div>
      </Navigation>
      <div className='header'>
        <h1>{pageTitle}</h1>
      </div>
      <FormContainer>
        <div className='ImageContainer'>
          {file ? (
            // Si hay un archivo subido, mostrar la imagen seleccionada
            <div className='ImageWrapper'>
              <img src={URL.createObjectURL(file)} alt="User Avatar" className="AvatarImage" />
            </div>
          ) : formData.userAvatar ? (
            // Si no hay archivo subido pero hay una imagen de perfil guardada, mostrarla
            <div className='ImageWrapper'>
              <img src={formData.userAvatar} alt="User Avatar" className="AvatarImage" />
            </div>
          ) : (
            // Si no hay archivo ni imagen de perfil guardada, mostrar el placeholder
            <div className="EmptyImageWrapper">
              <img src="/icons/helmet.svg" alt="empty avatar" className="EmptyAvatarImage" />
            </div>
          )}
          <label className='uploadField'>
            <div className='labelContent'>
              <img src="/icons/upload-file.svg" alt="Subir fichero" />
              <p>Sube una imagen</p>
            </div>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="inputFile"
            />
          </label>
        </div>
        <div className='Row'>
          <label>
            Nombre:
            <InputText
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              $size="large"
              placeholder="Introduce tu nombre"
              $variant={errors.name ? 'error' : ''}
              required
            />
            {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}

          </label>
          <label>
            Apellidos:
            <InputText
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              $size="large"
              placeholder="Introduce tus apellidos"
              $variant={errors.lastName ? 'error' : ''}
              required
            />
            {errors.lastName && <ErrorMsg>{errors.lastName}</ErrorMsg>}

          </label>
        </div>
        <label>
          Dirección:
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <InputText
              ref={addressRef}
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              $size="large"
              placeholder="Introduce tu dirección"
              $variant={errors.address ? 'error' : ''}
              required
              autoComplete="off"
            />
          </Autocomplete>
          {errors.address && <ErrorMsg>{errors.address}</ErrorMsg>}

          <p className='inputNote'>Tu dirección completa no se mostrará al público.</p>
        </label>
        <div className='Row'>
          <label>
            Prefijo:
            <div className='phonePrefixWrapper'>
              {selectedCountry && (
                <CircleFlag className='prefixFlag' countryCode={selectedCountry.code} height="20" />
              )}
              <Select
                name="phonePrefix"
                value={formData.phonePrefix}
                onChange={handleChange}
                $size="large"
                $variant={errors.phonePrefix ? 'error' : ''}
                required
                autoComplete="off"
              >
                {countryCodes.map((code) => (
                  <option key={`${code.dial_code}-${code.code}`} value={code.dial_code}>
                    {code.name} ({code.dial_code})
                  </option>
                ))}
              </Select>
            </div>
            {errors.phonePrefix && <ErrorMsg>{errors.phonePrefix}</ErrorMsg>}

          </label>
          <label>
            Teléfono:
            <InputText
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              $size="large"
              placeholder="Introduce tu número"
              $variant={errors.phoneNumber ? 'error' : ''}
              required
              autoComplete="off"
            />
            {errors.phoneNumber && <ErrorMsg>{errors.phoneNumber}</ErrorMsg>}

          </label>
        </div>

        <label>
          Descripción:
          <InputTextArea style={{ height: '160px' }}
            name="description"
            value={formData.description}
            onChange={handleChange}
            $size="large"
            autoComplete="off"
          />
        </label>
        <div className='LinksListWrapper'>
          <label>
            Redes Sociales:
            <div className='LinkInputBlock'>
              <InputText
                type="text"
                name="socialMediaLink"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="Introduce el enlace"
                $size="large"
              />
              <Button $variant="outline" style={{ alignSelf: 'stretch' }} type="button" onClick={handleAddLink}>Añadir Enlace</Button>
            </div>
          </label>
          <ul className='LinksList'>
            {formData.socialMediaLinks.map((link, index) => (
              <li className='Link' key={index}>
                <img src={getIcon(link.platform)} alt={`${link.platform} icon`} style={{ marginRight: '8px' }} />
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                <Button $variant="ghost" $size="small" type="button" onClick={() => handleRemoveLink(index)}>Eliminar</Button>
              </li>
            ))}
          </ul>
        </div>
        <FormActions>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Guardando...' : 'Guardar cambios'}</Button>
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
  height: 100vh;

  label {
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    font-family: "Mona Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    display: flex;
    flex-direction: column; 
    gap: 6px;
    flex-grow: 1;
    width: 100%;

    .inputNote {
      color: ${({ theme }) => theme.colors.defaultWeak};
      font-weight: 400;
    }
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

  .ImageContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .uploadField {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .labelContent {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;
      font-family: "Mona Sans";
      font-style: normal;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      padding: 8px;
      font-size: 16px;
      background-color: transparent;
      border: 2px solid ${({ theme }) => theme.border.defaultWeak};
      color: ${({ theme }) => theme.colors.defaultMain};
      line-height: 150%;
      
      p {
        color: var(--text-icon-default-main, #292929);
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        font-family: "Mona Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%;
      }
    }

    .inputFile {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden !important;
      position: absolute;
      z-index: -1;
    }
  }

  .ImageWrapper,
  .EmptyImageWrapper {
    width: 160px;
    height: 160px;
    border-radius: 8px;
    overflow: hidden;
  }

  .EmptyImageWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid var(--border-default-weak, #DCDCDC);
    background: var(--bg-default-subtle, #FAFAFA);

    .EmptyAvatarImage {
      width: 60px;
      height: 60px;
    }
  }

  .ImageWrapper {
    .AvatarImage {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .phonePrefixWrapper {
    position: relative;

    .prefixFlag  {
      position: absolute;
      top: 16px;
      left: 16px;
    }

    select {
      padding-left: 44px;
      height: 53px;
    }
  }

  .LinksListWrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;

    .LinkInputBlock {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;

      Button {
        flex-shrink: 0;
      }
    }

    .LinksList {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;


      .Link {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        padding: 4px 4px 4px 16px;
        border-radius: 8px;
        width: 100%;
        justify-content: space-between;
        background: ${({ theme }) => theme.fill.defaultSubtle};

        a {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--text-icon-default-strong, #464646);
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;
          /* Body/Body 2/Medium */
          font-family: "Mona Sans";
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 140%; /* 19.6px */
        }
      }
    }
  }
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

const ErrorMsg = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;