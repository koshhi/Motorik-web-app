import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import { Autocomplete } from '@react-google-maps/api';
import { useAuth } from '../context/AuthContext';
import Typography from './Typography';
import InputText from './Input/InputText';
import InputTextArea from './Input/InputTextArea';
import { getEventTypeIcon } from '../utilities';
import CreateEventTypeModal from './Modal/CreateEventTypeModal';
import CreateEventTerrainModal from './Modal/CreateEventTerrainModal';
import CreateEventExperienceModal from './Modal/CreateEventExperienceModal';
import CreateEventTicketModal from './Modal/CreateEventTicketModal';
import VehicleRequirementModal from './Modal/CreateEventVehicleRequirementModal';
import SelectVehicleModal from './Modal/CreateEventSelectVehicleModal';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';
import WheelIcon from './Icons/WheelIcon';
import EventTypeIcon from './Icons/EventTypeIcon';
import TerrainIcon from './Icons/TerrainIcon';
import ExperienceIcon from './Icons/ExperienceIcon';
import TicketsIcon from './Icons/TicketsIcon';
import UploadFileIcon from './Icons/UploadFileIcon';
import CalendarIcon from './Icons/CalendarIcon';
import LocationIcon from './Icons/LocationIcon';
import OptionsIcon from './Icons/OptionsIcon';

// Componente principal del formulario
const EventForm = forwardRef(({ initialData, onSubmit, isEditMode = false }, ref) => {
  const { t } = useTranslation('createEvent');

  const roundTimeToNearestHalfHour = () => {
    const now = new Date();
    const minutes = now.getMinutes();

    if (minutes > 0 && minutes <= 30) {
      now.setMinutes(30);
    } else {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
    }

    now.setSeconds(0);
    return now.toTimeString().slice(0, 5);
  };

  const adjustEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':');
    const endTime = new Date();
    endTime.setHours(parseInt(hours) + 1);
    endTime.setMinutes(parseInt(minutes));
    return endTime.toTimeString().slice(0, 5);
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    shortLocation: '',
    startDate: '',
    endDate: '',
    eventType: 'Meetup',
    terrain: 'offroad',
    experience: 'none',
    tickets: isEditMode ? [] : [{
      name: 'Entrada Estandar',
      type: 'free',
      price: 0,
      approvalRequired: false,
      capacity: 10
    }],
    approvalRequired: false,
    coordinates: { lat: null, lng: null },
    imageUrl: '',
    needsVehicle: true,
    organizerVehicle: null
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const { user } = useAuth();
  const autocompleteRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);

  // Estados para fechas y horas
  const [startDay, setStartDay] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDay, setEndDay] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(() => roundTimeToNearestHalfHour());
  const [endTime, setEndTime] = useState(() => adjustEndTime(roundTimeToNearestHalfHour()));

  // Estados adicionales
  const [isEndDayChanged, setIsEndDayChanged] = useState(false);
  const [isEndTimeChanged, setIsEndTimeChanged] = useState(false);

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        tickets: initialData.tickets
          ? initialData.tickets.map((ticket) => ({
            ...ticket,
            approvalRequired: ticket.approvalRequired !== undefined ? ticket.approvalRequired : false,
          }))
          : [],
        imageUrl: initialData.image || '',
        coordinates: initialData.locationCoordinates
          ? {
            lat: initialData.locationCoordinates.coordinates[1],
            lng: initialData.locationCoordinates.coordinates[0],
          }
          : { lat: null, lng: null },
        needsVehicle: initialData.needsVehicle !== undefined ? initialData.needsVehicle : true // Cargar valor si existe
      }));

      const startDateObj = new Date(initialData.startDate);
      const endDateObj = new Date(initialData.endDate);
      setStartDay(startDateObj.toISOString().split('T')[0]);
      setEndDay(endDateObj.toISOString().split('T')[0]);
      setStartTime(startDateObj.toISOString().substr(11, 5));
      setEndTime(endDateObj.toISOString().substr(11, 5));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isEditMode]);

  // useEffect para sincronizar endDay con startDay
  useEffect(() => {
    if (!isEndDayChanged) {
      if (endDay !== startDay) {
        setEndDay(startDay);
      }
    } else if (new Date(endDay) < new Date(startDay)) {
      setEndDay(startDay);
      setIsEndDayChanged(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDay, endDay, isEndDayChanged]);

  // useEffect para sincronizar endTime con startTime
  useEffect(() => {
    if (!isEndTimeChanged) {
      setEndTime(adjustEndTime(startTime));
    } else {
      const startDateTime = new Date(`${startDay}T${startTime}`);
      const endDateTime = new Date(`${endDay}T${endTime}`);

      if (endDateTime <= startDateTime) {
        setEndTime(adjustEndTime(startTime));
        setIsEndTimeChanged(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, startDay, endDay, isEndTimeChanged, endTime, endDay]);

  // Función para determinar si el evento es de pago
  const isEventPaid = () => {
    return formData.tickets.some(ticket => ticket.type === 'paid');
  };

  // Efecto para forzar 'approvalRequired' a 'false' si el evento es de pago
  useEffect(() => {
    if (isEventPaid() && formData.approvalRequired) {
      setFormData(prevData => ({ ...prevData, approvalRequired: false }));
    }
  }, [formData.tickets]);

  // Función de validación del formulario
  const validateForm = () => {
    const newErrors = {};
    const startDateTime = new Date(`${startDay}T${startTime}`);
    const endDateTime = new Date(`${endDay}T${endTime}`);

    // Validaciones básicas
    // if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    // if (!formData.location.trim()) newErrors.location = 'La localización es obligatoria';
    // if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    // if (!file && !isEditMode && !formData.imageUrl) newErrors.file = 'La imagen es obligatoria';
    if (!formData.title.trim()) newErrors.title = t('eventForm.titlePlaceholder');
    if (!formData.location.trim()) newErrors.location = t('eventForm.location.heading');
    if (!formData.description.trim()) newErrors.description = t('eventForm.detailsPlaceholder');
    if (!file && !isEditMode && !formData.imageUrl) newErrors.file = t('eventForm.imageUpload');

    // if (startDateTime >= endDateTime) {
    //   newErrors.startDay =
    //     'La fecha y hora de inicio no pueden ser posteriores o iguales a la de fin.';
    //   newErrors.endDay = 'La fecha y hora de fin deben ser posteriores a las de inicio.';
    // }

    if (startDateTime >= endDateTime) {
      newErrors.startDay = t('eventForm.date.invalid') || t('eventForm.date.startLabel') + " " + t('eventForm.date.endLabel');
      newErrors.endDay = t('eventForm.date.invalid') || t('eventForm.date.endLabel');
    }

    // if (!formData.coordinates.lat || !formData.coordinates.lng) {
    //   newErrors.location = 'Selecciona una ubicación válida del autocompletado.';
    // }
    if (!formData.coordinates.lat || !formData.coordinates.lng) {
      newErrors.location = t('eventForm.location.searchPlaceholder');
    }

    // Validaciones de tickets
    if (!formData.tickets || !Array.isArray(formData.tickets) || formData.tickets.length === 0) {
      newErrors.tickets = 'Se requiere al menos un ticket.';
    } else {
      formData.tickets.forEach((ticket, index) => {
        if (!ticket.name || !ticket.name.trim()) {
          newErrors[`tickets.${index}.name`] = `El nombre del ticket ${index + 1} es obligatorio.`;
        }
        if (!ticket.type) {
          newErrors[`tickets.${index}.type`] = `El tipo del ticket ${index + 1} es obligatorio.`;
        }
        if (ticket.type === 'paid') {
          const price = Number(ticket.price);
          if (isNaN(price) || price <= 0) {
            newErrors[`tickets.${index}.price`] = `El precio del ticket ${index + 1} debe ser un número positivo.`;
          }
        }
        // Validar 'approvalRequired'
        const approvalValue = ticket.approvalRequired;
        if (approvalValue !== true && approvalValue !== false) {
          newErrors[`tickets.${index}.approvalRequired`] = `El campo 'Aprobación requerida' del ticket ${index + 1} debe ser verdadero o falso.`;
        }
        // Validar 'capacity'
        const capacityValue = Number(ticket.capacity);
        if (isNaN(capacityValue) || capacityValue < 1) {
          newErrors[`tickets.${index}.capacity`] = `La capacidad del ticket ${index + 1} debe ser un número entero positivo.`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Exponer funciones al componente padre usando useImperativeHandle
  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      if (!validateForm()) {
        console.error('Errores en el formulario, no se puede enviar');
        return null;
      }

      const startDateTime = new Date(`${startDay}T${startTime}`).toISOString();
      const endDateTime = new Date(`${endDay}T${endTime}`).toISOString();

      // Construir locationCoordinates con la estructura esperada por el backend
      const locationCoordinates = {
        type: 'Point',
        coordinates: [formData.coordinates.lng, formData.coordinates.lat], // [lng, lat]
      };

      const tickets = formData.tickets.map((ticket) => ({
        name: ticket.name,
        type: ticket.type,
        price: ticket.type === 'paid' ? Number(ticket.price) : 0,
        approvalRequired: ticket.approvalRequired,
        capacity: Number(ticket.capacity)
      }));

      const newFormData = new FormData();
      newFormData.append('title', formData.title);
      newFormData.append('description', formData.description);
      newFormData.append('location', formData.location);
      newFormData.append('shortLocation', formData.shortLocation);
      newFormData.append('startDate', startDateTime);
      newFormData.append('endDate', endDateTime);
      newFormData.append('eventType', formData.eventType);
      newFormData.append('terrain', formData.terrain);
      newFormData.append('experience', formData.experience);
      newFormData.append('tickets', JSON.stringify(tickets));
      newFormData.append('locationCoordinates', JSON.stringify(locationCoordinates));
      newFormData.append('needsVehicle', formData.needsVehicle);
      if (file) newFormData.append('image', file);
      if (formData.organizerVehicle) {
        newFormData.append('organizerVehicle', formData.organizerVehicle.id);
      }

      return newFormData;
    },
    setInitialData: (data) => {
      setFormData((prev) => ({
        ...prev,
        ...data,
        tickets: data.tickets || [{
          name: '',
          type: 'free',
          price: 0,
          approvalRequired: false,
          capacity: 10
        }],
        imageUrl: data.image || '',
        coordinates: data.locationCoordinates
          ? {
            lat: data.locationCoordinates.coordinates[1],
            lng: data.locationCoordinates.coordinates[0],
          }
          : { lat: null, lng: null },
        needsVehicle: data.needsVehicle !== undefined ? data.needsVehicle : true
      }));

      const startDateObj = new Date(data.startDate);
      const endDateObj = new Date(data.endDate);
      setStartDay(startDateObj.toISOString().split('T')[0]);
      setEndDay(endDateObj.toISOString().split('T')[0]);
      setStartTime(startDateObj.toISOString().substr(11, 5));
      setEndTime(endDateObj.toISOString().substr(11, 5));
    },
  }));

  // Manejar cambios en los campos de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  // Manejar cambios en la imagen
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (errors.file) setErrors({ ...errors, file: '' });
  };

  // Manejar la selección de lugar usando Autocomplete de Google Maps
  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();

    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setFormData((prevData) => ({
        ...prevData,
        location: place.formatted_address,
        coordinates: { lat, lng },
      }));

      const addressComponents = place.address_components;
      let locality = '';
      let administrativeArea = '';
      let country = '';

      addressComponents.forEach((component) => {
        if (component.types.includes('locality')) {
          locality = component.long_name;
        }
        if (component.types.includes('administrative_area_level_2')) {
          administrativeArea = component.long_name;
        }
        if (component.types.includes('country')) {
          country = component.long_name;
        }
      });

      let shortLocation =
        locality && administrativeArea && locality !== administrativeArea
          ? `${locality}, ${administrativeArea}, ${country}`
          : `${administrativeArea}, ${country}`;

      setFormData((prevData) => ({
        ...prevData,
        shortLocation,
      }));
    } else {
      // alert('No se pudieron obtener las coordenadas. Intenta de nuevo.');
      alert(t('eventForm.location.searchPlaceholder'));

    }
  };

  // Manejar la apertura de modales
  const handleOpenModal = (modalId) => {
    setActiveModal(modalId);
  };

  // Manejar el cierre de modales
  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <FormContainer>
      <FormHeader>
        <Container>
          <HeaderWrapper>
            <TitleInputBlock>
              <EventTitle
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={t('eventForm.titlePlaceholder')}
                $variant={errors.title ? 'error' : ''}
                required
              />
              {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
            </TitleInputBlock>
            {user && (
              <EventOrganizer>
                <UserAvatar src={user.userAvatar} alt="User Avatar" />
                <UserData>
                  <Typography $variant="caption-medium" color={theme.colors.defaultWeak}>
                    {t('eventForm.organizedBy')}
                  </Typography>
                  <Typography $variant="body-2-medium">
                    {user.name} {user.lastName}
                  </Typography>
                </UserData>
              </EventOrganizer>
            )}
          </HeaderWrapper>
        </Container>
      </FormHeader>
      <FormWrapper>
        <Grid>
          <Details>
            <Image>
              <ImageContainer>
                {file ? (
                  <EventImageWrapper>
                    <EventImage src={URL.createObjectURL(file)} alt="Event" />
                    <ImageInputBlock>
                      <InputFile
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                      />
                      <InputFileLabel
                        htmlFor="file"
                        className={errors.file ? 'error' : ''}
                      >
                        <LabelContent>
                          <UploadFileIcon fill={theme.colors.defaultStrong} />
                          <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                            {t('eventForm.imageUpload')}
                          </Typography>
                        </LabelContent>
                        {errors.file && <ErrorMessage>{errors.file}</ErrorMessage>}
                      </InputFileLabel>
                    </ImageInputBlock>
                  </EventImageWrapper>
                ) : formData.imageUrl ? (
                  <EventImageWrapper>
                    <EventImage src={formData.imageUrl} alt="Event" />
                    <ImageInputBlock>
                      <InputFile
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                      />
                      <InputFileLabel
                        htmlFor="file"
                        className={errors.file ? 'error' : ''}
                      >
                        <LabelContent>
                          <UploadFileIcon fill={theme.colors.defaultStrong} />
                          <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                            {t('eventForm.imageUpload')}
                          </Typography>
                        </LabelContent>
                        {errors.file && <ErrorMessage>{errors.file}</ErrorMessage>}
                      </InputFileLabel>
                    </ImageInputBlock>
                  </EventImageWrapper>
                ) : (
                  <EventEmptyImageWrapper>
                    <EmptyStateIcon
                      src={getEventTypeIcon(formData.eventType)}
                      alt="empty state icon"
                    />
                    <ImageInputBlock>
                      <InputFile
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                      />
                      <InputFileLabel
                        htmlFor="file"
                        className={errors.file ? 'error' : ''}

                      >
                        <LabelContent>
                          <UploadFileIcon fill={theme.colors.defaultStrong} />
                          <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                            {t('eventForm.imageUpload')}
                          </Typography>
                        </LabelContent>
                        {errors.file && (
                          <ImageUploadError>{errors.file}</ImageUploadError>
                        )}
                      </InputFileLabel>
                    </ImageInputBlock>
                  </EventEmptyImageWrapper>
                )}
              </ImageContainer>
            </Image>
            <Description>
              <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                {t('eventForm.details')}
              </Typography>
              <DescriptionInputBlock>
                <DescriptionArea
                  size="large"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t('eventForm.detailsPlaceholder')}
                  $variant={errors.description ? 'error' : ''}
                  required
                />
                {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
              </DescriptionInputBlock>
            </Description>
          </Details>
          <Settings>
            <div className="Date">
              <SettingsHeader>
                <CalendarIcon fill={theme.colors.defaultStrong} />
                <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                  {t('eventForm.date.heading')}
                </Typography>
              </SettingsHeader>
              <div className="DateInputTexts">
                <div className="Row">
                  <label>{t('eventForm.date.startLabel')}</label>
                  <div className="DateInputBlock">
                    <div className="ComboBlock">
                      <InputText
                        size="medium"
                        type="date"
                        value={startDay}
                        onChange={(e) => {
                          setStartDay(e.target.value);
                          if (errors.startDay) setErrors({ ...errors, startDay: '' });
                        }}
                        $variant={errors.startDay ? 'error' : ''}
                        placeholder="Start Day"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <InputText
                        size="medium"
                        type="time"
                        value={startTime}
                        onChange={(e) => {
                          setStartTime(e.target.value);
                          if (errors.startTime) setErrors({ ...errors, startTime: '' });
                        }}
                        $variant={errors.startTime ? 'error' : ''}
                        placeholder="Start Time"
                        required
                      />
                    </div>
                    {errors.startTime && <ErrorMessage>{errors.startTime}</ErrorMessage>}
                    {errors.startDay && <ErrorMessage>{errors.startDay}</ErrorMessage>}
                  </div>
                </div>
                <div className="Row">
                  <label>{t('eventForm.date.endLabel')}</label>
                  <div className="DateInputBlock">
                    <div className="ComboBlock">
                      <InputText
                        size="medium"
                        type="date"
                        value={endDay}
                        onChange={(e) => {
                          const newEndDay = e.target.value;
                          setEndDay(newEndDay);
                          setIsEndDayChanged(true);

                          const startDateTime = new Date(`${startDay}T${startTime}`);
                          const endDateTime = new Date(`${newEndDay}T${endTime}`);

                          if (new Date(newEndDay) < new Date(startDay)) {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              endDay: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
                            }));
                          } else if (endDateTime <= startDateTime) {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              endDay:
                                'La fecha y hora de fin deben ser posteriores a la fecha y hora de inicio.',
                            }));
                          } else {
                            setErrors((prevErrors) => ({ ...prevErrors, endDay: '' }));
                          }
                        }}
                        $variant={errors.endDay ? 'error' : ''}
                        placeholder="End Day"
                        min={startDay}
                        required
                      />
                      <InputText
                        size="medium"
                        type="time"
                        value={endTime}
                        onChange={(e) => {
                          const newEndTime = e.target.value;
                          setEndTime(newEndTime);
                          setIsEndTimeChanged(true);

                          const startDateTime = new Date(`${startDay}T${startTime}`);
                          const endDateTime = new Date(`${endDay}T${newEndTime}`);

                          if (endDateTime <= startDateTime) {
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              endTime:
                                'La fecha y hora de fin deben ser posteriores a la fecha y hora de inicio.',
                            }));
                          } else {
                            setErrors((prevErrors) => ({ ...prevErrors, endTime: '' }));
                          }
                        }}
                        $variant={errors.endTime ? 'error' : ''}
                        placeholder="End Time"
                        required
                      />
                    </div>
                    {errors.endDay && <ErrorMessage>{errors.endDay}</ErrorMessage>}
                    {errors.endTime && <ErrorMessage>{errors.endTime}</ErrorMessage>}
                  </div>
                </div>
              </div>
            </div>
            <div className="Location">
              <SettingsHeader>
                <LocationIcon fill={theme.colors.defaultStrong} />
                <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                  {t('eventForm.location.heading')}
                </Typography>
              </SettingsHeader>
              <div className="SearchLocation">
                <div className="LocationInputBlock">
                  <img src="/icons/search.svg" alt={t('eventForm.location.searchAlt')} />
                  <Autocomplete
                    onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                    onPlaceChanged={onPlaceChanged}
                  >
                    <InputText
                      size="large"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={(e) => {
                        handleInputChange(e);
                        if (errors.location) setErrors({ ...errors, location: '' });
                      }}
                      placeholder={t('eventForm.location.searchPlaceholder')}
                      // placeholder="Introduce localización del evento"
                      $variant={errors.location ? 'error' : ''}
                      required
                    />
                  </Autocomplete>
                  {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
                </div>
              </div>
            </div>
            <Options>
              <SettingsHeader>
                <OptionsIcon stroke={theme.colors.defaultStrong} />
                <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                  {t('eventForm.options.heading')}
                </Typography>
              </SettingsHeader>
              <div className="OptionsContainer">
                <Option onClick={() => handleOpenModal('eventType')}>
                  <OptionTitle>
                    <EventTypeIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                      {t('eventForm.options.eventType.label')}
                    </Typography>
                  </OptionTitle>
                  <button className="OptionSelected">
                    {formData.eventType} <img src="/icons/edit.svg" alt={t('eventForm.options.eventType.edit')} />
                  </button>
                </Option>

                {!isEditMode && (
                  <Option onClick={() => handleOpenModal('ticket')}>
                    <OptionTitle>
                      <TicketsIcon fill={theme.colors.defaultStrong} />
                      <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                        {t('eventForm.options.ticket.label')}
                      </Typography>
                    </OptionTitle>

                    <button className="OptionSelected">
                      {formData.tickets[0].type === 'free'
                        ? t('eventForm.options.ticket.free')
                        : t('eventForm.options.ticket.paid', { price: formData.tickets[0].price })}
                      <img src="/icons/edit.svg" alt={t('eventForm.options.ticket.edit')} />

                      {/* {formData.tickets[0].type === 'free' ? 'Gratis' : `De pago - ${formData.tickets[0].price}€`} <img src="/icons/edit.svg" alt="Editar" /> */}
                    </button>
                  </Option>
                )}

                <Option onClick={() => handleOpenModal('terrain')}>
                  <OptionTitle>
                    <TerrainIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                      {t('eventForm.options.terrain.label')}
                    </Typography>
                  </OptionTitle>

                  <button className="OptionSelected">
                    {formData.terrain} <img src="/icons/edit.svg" alt={t('eventForm.options.terrain.edit')} />
                  </button>
                </Option>

                <Option onClick={() => handleOpenModal('experience')}>
                  <OptionTitle>
                    <ExperienceIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                      {t('eventForm.options.experience.label')}
                    </Typography>
                  </OptionTitle>

                  <button className="OptionSelected">
                    {formData.experience} <img src="/icons/edit.svg" alt={t('eventForm.options.experience.edit')} />
                  </button>
                </Option>

                <Option onClick={() => handleOpenModal('vehicleRequirement')}>
                  <OptionTitle>
                    <WheelIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                      {t('eventForm.options.vehicle.label')}
                    </Typography>
                  </OptionTitle>
                  <button className="OptionSelected">
                    {formData.needsVehicle
                      ? (formData.organizerVehicle
                        ? formData.organizerVehicle.nickname || formData.organizerVehicle.model
                        : t('eventForm.options.vehicle.required'))
                      : t('eventForm.options.vehicle.notRequired')}
                    <img src="/icons/edit.svg" alt={t('eventForm.options.vehicle.edit')} />
                  </button>
                </Option>

                {formData.needsVehicle && (
                  <Option onClick={() => handleOpenModal('selectVehicle')}>
                    <OptionTitle>
                      <WheelIcon fill={theme.colors.defaultStrong} />
                      <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                        {t('eventForm.options.organizerVehicle.label')}
                      </Typography>
                    </OptionTitle>
                    <button className="OptionSelected">
                      {formData.organizerVehicle
                        ? formData.organizerVehicle.nickname || formData.organizerVehicle.model
                        : t('eventForm.options.organizerVehicle.select')}
                      <img src="/icons/edit.svg" alt={t('eventForm.options.organizerVehicle.edit')} />
                    </button>
                  </Option>
                )}

                {/* <Option onClick={() => handleOpenModal('capacity')}>
                  <div className="Title">
                    <img src="/icons/capacity.svg" alt="Capacidad" /> Capacidad
                  </div>

                  <button className="OptionSelected">
                    {formData.capacity} <img src="/icons/edit.svg" alt="Editar" />
                  </button>
                </Option> */}



                {/* 
                {!isEditMode && (
                  <Option>
                    <div className="Title">
                      <img src="/icons/approval-required.svg" alt="Aprobación requerida" /> Aprobación requerida
                    </div>
                    <div>
                      <Switch
                        value={formData.tickets[0].approvalRequired}
                        onChange={(value) => {
                          const updatedTickets = [...formData.tickets];
                          updatedTickets[0].approvalRequired = value;
                          setFormData((prevData) => ({ ...prevData, tickets: updatedTickets }));
                        }}
                        disabled={ticketType === 'paid'}
                      />
                    </div>
                  </Option>
                )} */}

                {/* Renderizar modales según el estado */}
                {activeModal === 'eventType' && (
                  <CreateEventTypeModal
                    eventType={formData.eventType}
                    setEventType={(value) =>
                      setFormData((prevData) => ({ ...prevData, eventType: value }))
                    }
                    onClose={handleCloseModal}
                  />
                )}

                {activeModal === 'terrain' && (
                  <CreateEventTerrainModal
                    terrain={formData.terrain}
                    setTerrain={(value) =>
                      setFormData((prevData) => ({ ...prevData, terrain: value }))
                    }
                    onClose={handleCloseModal}
                  />
                )}

                {activeModal === 'experience' && (
                  <CreateEventExperienceModal
                    experience={formData.experience}
                    setExperience={(value) =>
                      setFormData((prevData) => ({ ...prevData, experience: value }))
                    }
                    onClose={handleCloseModal}
                  />
                )}

                {activeModal === 'vehicleRequirement' && (
                  <VehicleRequirementModal
                    needsVehicle={formData.needsVehicle}
                    setNeedsVehicle={(value) =>
                      setFormData((prev) => ({ ...prev, needsVehicle: value }))
                    }
                    organizerVehicle={formData.organizerVehicle}
                    onOpenSelectVehicle={() => setActiveModal('selectVehicle')}
                    onClose={handleCloseModal}
                  />
                )}

                {activeModal === 'selectVehicle' && (
                  <SelectVehicleModal
                    onSelectVehicle={(vehicle) => {
                      setFormData((prev) => ({ ...prev, organizerVehicle: vehicle }));
                      setActiveModal('vehicleRequirement'); // Regresar al modal de requerimiento
                    }}
                    selectedVehicle={formData.organizerVehicle}
                    onClose={handleCloseModal}
                  />
                )}

                {/* {activeModal === 'capacity' && (
                  <EventCapacityModal
                    capacity={formData.capacity}
                    setCapacity={(value) =>
                      setFormData((prevData) => ({ ...prevData, capacity: value }))
                    }
                    onClose={handleCloseModal}
                  />
                )} */}

                {!isEditMode && activeModal === 'ticket' && (
                  <CreateEventTicketModal
                    ticketName={formData.tickets[0].name}
                    ticketType={formData.tickets[0].type}
                    ticketPrice={formData.tickets[0].price}
                    capacity={formData.tickets[0].capacity}
                    approvalRequired={formData.tickets[0].approvalRequired}
                    setTicketName={(value) => {
                      const updatedTickets = [...formData.tickets];
                      updatedTickets[0].name = value;
                      setFormData((prevData) => ({ ...prevData, tickets: updatedTickets }));
                    }}
                    setTicketType={(value) => {
                      const updatedTickets = [...formData.tickets];
                      updatedTickets[0].type = value;
                      if (value === 'free') updatedTickets[0].price = 0;
                      setFormData((prevData) => ({ ...prevData, tickets: updatedTickets }));
                    }}
                    setTicketPrice={(value) => {
                      const updatedTickets = [...formData.tickets];
                      updatedTickets[0].price = value;
                      setFormData((prevData) => ({ ...prevData, tickets: updatedTickets }));
                    }}
                    setCapacity={(value) => {
                      const updatedTickets = [...formData.tickets];
                      updatedTickets[0].capacity = value;
                      setFormData((prevData) => ({ ...prevData, tickets: updatedTickets }));
                    }}
                    setApprovalRequired={(value) => {
                      const updatedTickets = [...formData.tickets];
                      updatedTickets[0].approvalRequired = value;
                      setFormData((prevData) => ({ ...prevData, tickets: updatedTickets }));
                    }}
                    onClose={handleCloseModal}
                  />
                )}
              </div>
            </Options>
          </Settings>
        </Grid>
      </FormWrapper>
    </FormContainer>
  );
});

export default EventForm;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px ${({ theme }) => theme.sizing.md};
  max-width: 1400px;
  width: 100%;
`;

const HeaderWrapper = styled.div`
  padding: ${({ theme }) => theme.sizing.lg} 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const Image = styled.div`
  width: 100%;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  background-color: ${({ theme }) => theme.fill.defaultWeak};
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: ${({ theme }) => theme.radius.sm};
`;

const EventImageWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const EventEmptyImageWrapper = styled(EventImageWrapper)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyStateIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const ImageInputBlock = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`;

const InputFile = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden !important;
  position: absolute;
  z-index: -1;
`;

const InputFileLabel = styled.label`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.defaultStrong};
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 24px */
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid transparent;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;

  &.error {
    border: 1px solid ${({ theme }) => theme.colors.errorMain};
  
    &:hover {
      outline: 1px solid ${({ theme }) => theme.colors.errorMain};
    }
  }
`;
const LabelContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 40px;
  margin-bottom: 40px;
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.sm};     
`;

const Description = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  textarea {
    min-height: 120px;
  }
`;

const DescriptionInputBlock = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const DescriptionArea = styled(InputTextArea)`
  field-sizing: content;
`;

const TitleInputBlock = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xxs};
  width: 100%;
`;

const EventTitle = styled(InputText)`
  width: 100%;
  padding: 0px;
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 1px solid transparent;
  background: none;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;

  /* Titles/Mobile/Title 1/Bold */
  font-family: "Mona Sans";
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 39.2px */

  &::placeholder {
    color: ${({ theme }) => theme.colors.defaultSubtle};
  }
`;

const EventOrganizer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const UserData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const UserAvatar = styled.img`
  border-radius: ${({ theme }) => theme.sizing.xs};
  height: 40px;
  width: 40px;
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: ${({ theme }) => theme.fill.defaultSubtle};
  padding-top: 74px;
`;

const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Options = styled.div`
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  border-top: 1px solid var(--border-default-weak, #DCDCDC);

  .Heading {
    display: inline-flex;
    gap: 8px;
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Semibold */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */
  }

  .OptionsContainer {
    border-radius: 8px;
    border: 1px solid var(--border-default-weak, #DCDCDC);
    background: var(--bg-default-subtle, #FAFAFA);
    // overflow: hidden;
  }
`;


const Option = styled.div`
  display: flex;
  padding: 16px;
  align-items: flex-start;
  gap: 8px;
  justify-content: space-between;
  border-top: 1px solid var(--border-default-weak, #DCDCDC);
  cursor: pointer;
  transition: all 0.3s;

  &:first-child {
    border-top: none;
  }


  &:hover {
    background-color: #EFEFEF;
  }

  .Title,
  .OptionSelected {
    display: inline-flex;
    gap: 8px;
  }

  // .Title {
  //   color: var(--text-icon-default-strong, #464646);
  //   font-variant-numeric: lining-nums tabular-nums;
  //   font-feature-settings: 'ss01' on;

  //   /* Body/Body 1/Semibold */
  //   font-family: "Mona Sans";
  //   font-size: 16px;
  //   font-style: normal;
  //   font-weight: 600;
  //   line-height: 150%; /* 24px */
  // }
  .OptionSelected {
    color: var(--text-icon-default-subtle, #989898);
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Semibold */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */
    border: 0;
    background-color: unset;
  }
`;

const OptionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.errorMain};
  font-variant-numeric: lining-nums tabular-nums;
  /* Body 2/Medium */
  font-family: "Satoshi Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;         
`;

const ImageUploadError = styled(ErrorMessage)`
  position: absolute;
  bottom: 12px;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 32px;
    grid-row-gap: 0px;
    max-width: 1400px;
    width: 100%;
    padding: ${({ theme }) => theme.sizing.md};
`;

const Details = styled.div`
  grid-area: 1 / 1 / 2 / 8;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
`;

const SettingsHeader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const Settings = styled.div`
  grid-area: 1 / 8 / 2 / 13;
  border-radius: 16px;
  border: 1px solid var(--border-default-weak, #DCDCDC);
  height: fit-content;

  .Date,
  .Location {
    display: flex;
    padding: 24px;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    border-top: 1px solid var(--border-default-weak, #DCDCDC);
  }
  
  .Date {
    border-top: none;

    .DateInputTexts {
      display: flex;
      padding: 16px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 16px;
      align-self: stretch;
      border-radius: 8px;
      border: 1px solid var(--border-default-weak, #DCDCDC);
      background: var(--bg-default-subtle, #FAFAFA);

      .Row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
        width: 100%;
  
        .DateInputBlock {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;

          .ComboBlock {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;

            input {
              height: 40px;

              &:first-child {
                border-top-right-radius: 0px;
                border-bottom-right-radius: 0px;
                border-right: 0px;
                width: 100%;
              }
              &:last-child {
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
                width: 100px;
              }
            }
            

          }
        }

        label {
          width: 64px;
        }
      }
    }
  }

  .Location {
    padding-top: 0px;
    border-top: none;

    .SearchLocation {
      .LocationInputBlock {
        position: relative;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      

        img {
          position: absolute;
          left: 16px;
          top: 16px;
        }

        div {
          width: 100%;
        }
      
        input {
          padding-left: 44px;
          background: var(--bg-default-subtle, #FAFAFA);

          &:hover {
            background: #efefef;
          }
        }
      }
    }
  }
`;



const OptionsContainer = styled.div`
  border-radius: 8px;
  border: 1px solid var(--border-default-weak, #DCDCDC);
  background: var(--bg-default-subtle, #FAFAFA);
  overflow: hidden;
`;


const AddTicketButton = styled.button`
  /* Estilos para el botón de añadir ticket */
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const RemoveTicketButton = styled.button`
  /* Estilos para el botón de eliminar ticket */
  margin-left: 10px;
  padding: 4px 8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;

const TicketItem = styled.div`
  /* Estilos para cada item de ticket */
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  & > input {
    margin-right: 10px;
  }

  & > button {
    margin-left: auto;
  }
`;


const DisabledMessage = styled.p`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
`;