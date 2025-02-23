import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import Typography from '../components/Typography';
import { theme } from '../theme';

const CompleteProfile = () => {
  const { userId } = useParams();
  const isEditMode = Boolean(userId);
  const pageTitle = isEditMode ? 'Editar perfil' : 'Completa tu perfil';
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleAddressBlur = () => {
    if (formData.address && (!formData.locality || formData.locality === '')) {
      console.log("handleAddressBlur activado. Geocodificando la dirección:", formData.address);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: formData.address }, (results, status) => {
        console.log("Resultado del geocode. Estado:", status, "Resultados:", results);
        if (status === 'OK' && results.length > 0) {
          const addressComponents = results[0].address_components;
          let locality = '';
          let country = '';

          addressComponents.forEach(component => {
            const types = component.types;
            if (types.includes('locality')) {
              locality = component.long_name;
            } else if (types.includes('administrative_area_level_2') && !locality) {
              locality = component.long_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            }
          });

          console.log("Locality extraída:", locality, "y Country extraído:", country);
          setFormData(prev => ({
            ...prev,
            locality,
            country,
          }));
        } else {
          console.log('Geocoding no encontró resultados o ocurrió un error:', status);
        }
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el input es el de dirección, actualizar el estado directamente
    if (name === 'address') {
      setFormData(prev => ({
        ...prev,
        address: value,
        locality: ''
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

      // Check if the link already exists
      const isDuplicate = formData.socialMediaLinks.some(
        link => link.url.toLowerCase() === newLink.toLowerCase()
      );

      if (isDuplicate) {
        toast.error('Enlace duplicado');
        return;
      }

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
          // Si viene un returnTo en el state, redirigimos a esa URL; de lo contrario, a la home.
          const destination = location.state?.returnTo || '/';
          navigate(destination, { replace: true });
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

  return (
    <CompleteProfileForm onSubmit={handleSubmit}>
      <Navigation>
        <Container>
          {isEditMode ? (
            <Typography as="h1" $variant="title-3-semibold">{pageTitle}</Typography>

          ) : (
            <div className='tabs'>
              <div className='tab'>Completa tu perfil</div>
              <div className='tab'>Marca tus intereses</div>
              <div className='tab'>Añade tu garaje</div>
            </div>
          )}
          <Button type="submit" size="medium">Guardar cambios</Button>
        </Container>
      </Navigation>
      <FormContainer>
        <FormContent>
          <UserAvatarRow>
            {file ? (
              // Si hay un archivo subido, mostrar la imagen seleccionada
              <ImageWrapper>
                <AvatarImage src={URL.createObjectURL(file)} alt="User Avatar" />
              </ImageWrapper>
            ) : formData.userAvatar ? (
              // Si no hay archivo subido pero hay una imagen de perfil guardada, mostrarla
              <ImageWrapper>
                <AvatarImage src={formData.userAvatar} alt="User Avatar" />
              </ImageWrapper>
            ) : (
              // Si no hay archivo ni imagen de perfil guardada, mostrar el placeholder
              <EmptyImageWrapper>
                <EmptyAvatarImage src="/icons/helmet.svg" alt="empty avatar" />
              </EmptyImageWrapper>
            )}
            <UploadField>
              <UploadAvatarButton>
                <img src="/icons/upload-file.svg" alt="Subir fichero" />
                <Typography $variant="body-1-semibold">Sube una imagen</Typography>
              </UploadAvatarButton>
              <InputFile type="file" id="file" onChange={handleFileChange} />
            </UploadField>
          </UserAvatarRow>
          <FormRow>
            <NameInputWrapper>
              <Typography $variant="body-2-medium">Nombre:</Typography>
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
            </NameInputWrapper>
            <LastNameInputWrapper>
              <Typography $variant="body-2-medium">Apellidos:</Typography>
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
            </LastNameInputWrapper>
          </FormRow>
          <FormRow>
            <AddressInputWrapper>
              <Typography $variant="body-2-medium">Dirección:</Typography>
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
                  onBlur={handleAddressBlur}
                  $size="large"
                  placeholder="Introduce tu dirección"
                  $variant={errors.address ? 'error' : ''}
                  required
                  autoComplete="off"
                />
              </Autocomplete>
              <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>Mostraremos solo tu ciudad. Tu dirección completa no se mostrará.</Typography>
              {errors.address && <ErrorMsg>{errors.address}</ErrorMsg>}
            </AddressInputWrapper>
          </FormRow>
          <FormRow>
            <PhonePrefixInputWrapper>
              <Typography $variant="body-2-medium">Prefijo:</Typography>
              <PhonePrefixInput>
                {selectedCountry && (
                  <PrefixFlag countryCode={selectedCountry.code} height="20" />
                )}
                <PrefixSelect
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
                </PrefixSelect>
              </PhonePrefixInput>
              {errors.phonePrefix && <ErrorMsg>{errors.phonePrefix}</ErrorMsg>}
            </PhonePrefixInputWrapper>
            <PhoneInputWrapper>
              <Typography $variant="body-2-medium">Teléfono:</Typography>
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
            </PhoneInputWrapper>
          </FormRow>
          <FormRow>
            <InputTextAreaWrapper>
              <Typography $variant="body-2-medium">Descripción:</Typography>
              <InputTextArea style={{ fieldSizing: 'content' }}
                name="description"
                value={formData.description}
                onChange={handleChange}
                $size="large"
                autoComplete="off"
              />
            </InputTextAreaWrapper>
          </FormRow>
          <SocialMediaLinksRow>
            <InputLinksWrapper>
              <Typography $variant="body-2-medium">Redes sociales:</Typography>
              <LinksInputInnerWrapper>
                <InputText
                  type="text"
                  name="socialMediaLink"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="Introduce el enlace"
                  $size="large"
                />
                <Button $variant="outline" style={{ alignSelf: 'stretch' }} type="button" onClick={handleAddLink}>Añadir Enlace</Button>
              </LinksInputInnerWrapper>
            </InputLinksWrapper>
            {formData.socialMediaLinks.length > 0 && (
              <LinksList>
                {formData.socialMediaLinks.map((link, index) => (
                  <SocialLinkItem key={index}>
                    <SocialLink href={link.url} target="_blank" rel="noopener noreferrer">
                      <img src={getIcon(link.platform)} alt={`${link.platform} icon`} style={{ marginRight: '8px' }} />
                      <Typography style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{link.url}</Typography>
                    </SocialLink>
                    <Button $variant="ghost" $size="small" type="button" onClick={() => handleRemoveLink(index)}>Eliminar</Button>
                  </SocialLinkItem>
                ))}
              </LinksList>
            )}
          </SocialMediaLinksRow>
        </FormContent>
        <FormActions>
          {isEditMode && (
            <Button
              size="medium"
              $variant="outline"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
          )}
          <Button size="medium" type="submit" disabled={isLoading}>{isLoading ? 'Guardando...' : 'Guardar cambios'}</Button>
        </FormActions>
      </FormContainer>
    </CompleteProfileForm>
  );
};

export default CompleteProfile;

const CompleteProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: ${({ theme }) => theme.fill.defaultSubtle};
  position: relative;
  padding-bottom: 120px;
`;


const Navigation = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.fill.defaultMain};
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 1;
  border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};
  
  .tabs{
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex-direction: row;
  }
`;

const FormContainer = styled.div`
  display: flex;
  max-width: 590px;
  flex-direction: column;
  align-items: center;
  border-radius: ${({ theme }) => theme.sizing.sm};
  background: ${({ theme }) => theme.fill.defaultMain};
  box-shadow: 0px 2px 12px 0px rgba(26, 26, 26, 0.04);
  margin-top: 120px;
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
`;

const FormContent = styled.div`
  padding: ${({ theme }) => theme.sizing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.md};
`;

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  align-items: center;
  gap: 40px;
  justify-content: space-between;
`;

const UserAvatarRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ImageWrapper = styled.div`
    width: 160px;
    height: 160px;
    border-radius: 8px;
    overflow: hidden;
`;

const EmptyImageWrapper = styled(ImageWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  background: ${({ theme }) => theme.fill.defaultSubtle};
`;

const EmptyAvatarImage = styled.img`
  width: 60px;
  height: 60px;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InputWrapper = styled.label`
  display: flex;
  flex-direction: column; 
  gap: 6px;
  flex-grow: 1;
  width: 100%;
`;

const NameInputWrapper = styled(InputWrapper)``;

const LastNameInputWrapper = styled(InputWrapper)``;

const AddressInputWrapper = styled(InputWrapper)``;

const PhonePrefixInputWrapper = styled(InputWrapper)``;

const PhoneInputWrapper = styled(InputWrapper)``;

const PhonePrefixInput = styled.div`
  position: relative;
`;

const PrefixFlag = styled(CircleFlag)`
  position: absolute;
  top: 16px;
  left: 16px;
`;

const PrefixSelect = styled(Select)`
  padding-left: 44px;
  height: 53px;
`;

const InputTextAreaWrapper = styled(InputWrapper)``;

const InputLinksWrapper = styled(InputWrapper)``;

const FormRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const FormActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: ${({ children }) => children.length > 1 ? 'space-between' : 'flex-end'};
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  width: 100%;
  padding: ${({ theme }) => theme.sizing.md};
`;

const SocialMediaLinksRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  // padding-bottom: 0px;
`;

const SocialLinkItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 4px 4px 4px 16px;
  border-radius: 8px;
  width: 100%;
  justify-content: space-between;
  background: ${({ theme }) => theme.fill.defaultSubtle};
`;

const SocialLink = styled.a`
  width: 100%;
  display: inline-flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LinksInputInnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const LinksList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const UploadAvatarButton = styled.div`
  background-color: transparent;
  border: 1px solid ${theme.border.defaultWeak};
  color: ${theme.colors.defaultMain};
  transition: all 0.3s ease-in-out;
  gap: ${({ theme }) => theme.radius.xs};
  display: inline-flex;
  border-radius: ${({ theme }) => theme.radius.xs};
  padding: ${({ theme }) => theme.radius.xs} 12px;
  cursor: pointer;

  &:hover {
    background-color: ${theme.palette.alabaster[100]};
  }
`;

const UploadField = styled.label`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const InputFile = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden !important;
  position: absolute;
  z-index: -1;
`;