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
import UploadFileIcon from './Icons/UploadFileIcon';
import CalendarIcon from './Icons/CalendarIcon';
import LocationIcon from './Icons/LocationIcon';
import OptionsIcon from './Icons/OptionsIcon';
import TicketsIcon from './Icons/TicketsIcon';
import TerrainIcon from './Icons/TerrainIcon';
import ExperienceIcon from './Icons/ExperienceIcon';
import EventTypeIcon from './Icons/EventTypeIcon';
import WheelIcon from './Icons/WheelIcon';
import useDateTimeSync from '../hooks/useDateTimeSync';
import EditIcon from './Icons/EditIcon';
import SearchIcon from './Icons/SearchIcon';

const EventForm = forwardRef(({ initialData, onSubmit, isEditMode = false }, ref) => {
  const { t } = useTranslation('createEvent');

  // Utilizar el hook para la sincronización de fechas y horas
  const {
    startDay,
    setStartDay,
    endDay,
    setEndDay,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    setIsEndDayChanged,
    setIsEndTimeChanged
  } = useDateTimeSync();

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

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        tickets: initialData.tickets
          ? initialData.tickets.map(ticket => ({
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
        needsVehicle: initialData.needsVehicle !== undefined ? initialData.needsVehicle : true
      }));

      const startDateObj = new Date(initialData.startDate);
      const endDateObj = new Date(initialData.endDate);
      setStartDay(startDateObj.toISOString().split('T')[0]);
      setEndDay(endDateObj.toISOString().split('T')[0]);
      setStartTime(startDateObj.toISOString().substr(11, 5));
      setEndTime(endDateObj.toISOString().substr(11, 5));
    }
  }, [initialData, isEditMode, setStartDay, setEndDay, setStartTime, setEndTime]);

  // Los useEffect para sincronizar endDay y endTime se gestionan en el hook

  const isEventPaid = () => formData.tickets.some(ticket => ticket.type === 'paid');

  useEffect(() => {
    if (isEventPaid() && formData.approvalRequired) {
      setFormData(prev => ({ ...prev, approvalRequired: false }));
    }
  }, [formData.tickets]);

  // Función de validación (no modificada)
  const validateForm = () => {
    const newErrors = {};
    const startDT = new Date(`${startDay}T${startTime}`);
    const endDT = new Date(`${endDay}T${endTime}`);

    if (!formData.title.trim()) newErrors.title = t('eventForm.titlePlaceholder');
    if (!formData.location.trim()) newErrors.location = t('eventForm.location.heading');
    if (!formData.description.trim()) newErrors.description = t('eventForm.detailsPlaceholder');
    if (!file && !isEditMode && !formData.imageUrl) newErrors.file = t('eventForm.imageUpload');

    if (startDT >= endDT) {
      newErrors.startDay = t('eventForm.date.invalid') || `${t('eventForm.date.startLabel')} ${t('eventForm.date.endLabel')}`;
      newErrors.endDay = t('eventForm.date.invalid') || t('eventForm.date.endLabel');
    }

    if (!formData.coordinates.lat || !formData.coordinates.lng) {
      newErrors.location = t('eventForm.location.searchPlaceholder');
    }

    if (!formData.tickets || !Array.isArray(formData.tickets) || formData.tickets.length === 0) {
      newErrors.tickets = t('eventForm.tickets.required');
    } else {
      formData.tickets.forEach((ticket, index) => {
        if (!ticket.name || !ticket.name.trim()) {
          newErrors[`tickets.${index}.name`] = t('eventForm.tickets.nameRequired', { index: index + 1 });
        }
        if (!ticket.type) {
          newErrors[`tickets.${index}.type`] = t('eventForm.tickets.typeRequired', { index: index + 1 });
        }
        if (ticket.type === 'paid') {
          const price = Number(ticket.price);
          if (isNaN(price) || price <= 0) {
            newErrors[`tickets.${index}.price`] = t('eventForm.tickets.priceInvalid', { index: index + 1 });
          }
        }
        const approvalValue = ticket.approvalRequired;
        if (approvalValue !== true && approvalValue !== false) {
          newErrors[`tickets.${index}.approvalRequired`] = t('eventForm.tickets.approvalInvalid', { index: index + 1 });
        }
        const capValue = Number(ticket.capacity);
        if (isNaN(capValue) || capValue < 1) {
          newErrors[`tickets.${index}.capacity`] = t('eventForm.tickets.capacityInvalid', { index: index + 1 });
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({
    getFormData: async () => {
      if (!validateForm()) {
        console.error('Errores en el formulario, no se puede enviar');
        return null;
      }
      const startDT = new Date(`${startDay}T${startTime}`).toISOString();
      const endDT = new Date(`${endDay}T${endTime}`).toISOString();
      const locationCoordinates = {
        type: 'Point',
        coordinates: [formData.coordinates.lng, formData.coordinates.lat]
      };
      const tickets = formData.tickets.map(ticket => ({
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
      newFormData.append('startDate', startDT);
      newFormData.append('endDate', endDT);
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
      setFormData(prev => ({
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
    }
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (errors.file) setErrors({ ...errors, file: '' });
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setFormData(prev => ({
        ...prev,
        location: place.formatted_address,
        coordinates: { lat, lng }
      }));
      let locality = '', administrativeArea = '', country = '';
      place.address_components.forEach(component => {
        if (component.types.includes('locality')) locality = component.long_name;
        if (component.types.includes('administrative_area_level_2')) administrativeArea = component.long_name;
        if (component.types.includes('country')) country = component.long_name;
      });
      const shortLocation = locality && administrativeArea && locality !== administrativeArea
        ? `${locality}, ${administrativeArea}, ${country}`
        : `${administrativeArea}, ${country}`;
      setFormData(prev => ({ ...prev, shortLocation }));
    } else {
      alert(t('eventForm.location.searchPlaceholder'));
    }
  };

  const handleOpenModal = (modalId) => setActiveModal(modalId);
  const handleCloseModal = () => setActiveModal(null);

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
                      <InputFile type="file" id="file" onChange={handleFileChange} />
                      <InputFileLabel htmlFor="file" className={errors.file ? 'error' : ''}>
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
                      <InputFile type="file" id="file" onChange={handleFileChange} />
                      <InputFileLabel htmlFor="file" className={errors.file ? 'error' : ''}>
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
                    <EmptyStateIcon src={getEventTypeIcon(formData.eventType)} alt="empty state icon" />
                    <ImageInputBlock>
                      <InputFile type="file" id="file" onChange={handleFileChange} />
                      <InputFileLabel htmlFor="file" className={errors.file ? 'error' : ''}>
                        <LabelContent>
                          <UploadFileIcon fill={theme.colors.defaultStrong} />
                          <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                            {t('eventForm.imageUpload')}
                          </Typography>
                        </LabelContent>
                        {errors.file && <ImageUploadError>{errors.file}</ImageUploadError>}
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
            <DateOptions>
              <SettingsHeader>
                <CalendarIcon fill={theme.colors.defaultStrong} />
                <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                  {t('eventForm.date.heading')}
                </Typography>
              </SettingsHeader>
              <DateInputs>
                <StartDateRow>
                  <Typography as="label" $variant="body-1-medium" color={theme.colors.defaultStrong} style={{ width: '64px' }}>
                    {t('eventForm.date.startLabel')}
                  </Typography>
                  <DateInputBlock>
                    <DateInputsWrapper>
                      <InputText
                        size="medium"
                        type="date"
                        value={startDay}
                        onChange={(e) => {
                          setStartDay(e.target.value);
                          if (errors.startDay) setErrors({ ...errors, startDay: '' });
                        }}
                        onClick={(e) => {
                          if (e.target.showPicker) e.target.showPicker();
                        }}
                        onKeyDown={(e) => e.preventDefault()}
                        $variant={errors.startDay ? 'error' : ''}
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
                        onClick={(e) => {
                          if (e.target.showPicker) e.target.showPicker();
                        }}
                        onKeyDown={(e) => e.preventDefault()}
                        $variant={errors.startTime ? 'error' : ''}
                        required
                      />
                    </DateInputsWrapper>
                    {errors.startTime && <ErrorMessage>{errors.startTime}</ErrorMessage>}
                    {errors.startDay && <ErrorMessage>{errors.startDay}</ErrorMessage>}
                  </DateInputBlock>
                </StartDateRow>
                <EndDateRow>
                  <Typography as="label" $variant="body-1-medium" color={theme.colors.defaultStrong} style={{ width: '64px' }}>
                    {t('eventForm.date.endLabel')}
                  </Typography>
                  <DateInputBlock>
                    <DateInputsWrapper>
                      <InputText
                        size="medium"
                        type="date"
                        value={endDay}
                        onChange={(e) => {
                          const newEndDay = e.target.value;
                          setEndDay(newEndDay);
                          setIsEndDayChanged(true);
                          const startDT = new Date(`${startDay}T${startTime}`);
                          const endDT = new Date(`${newEndDay}T${endTime}`);
                          if (new Date(newEndDay) < new Date(startDay)) {
                            setErrors(prev => ({ ...prev, endDay: t('eventForm.date.invalid') }));
                          } else if (endDT <= startDT) {
                            setErrors(prev => ({ ...prev, endDay: t('eventForm.date.invalid') }));
                          } else {
                            setErrors(prev => ({ ...prev, endDay: '' }));
                          }
                        }}
                        onClick={(e) => {
                          if (e.target.showPicker) e.target.showPicker();
                        }}
                        onKeyDown={(e) => e.preventDefault()}
                        $variant={errors.endDay ? 'error' : ''}
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
                          const startDT = new Date(`${startDay}T${startTime}`);
                          const endDT = new Date(`${endDay}T${newEndTime}`);
                          if (endDT <= startDT) {
                            setErrors(prev => ({ ...prev, endTime: t('eventForm.date.invalid') }));
                          } else {
                            setErrors(prev => ({ ...prev, endTime: '' }));
                          }
                        }}
                        onClick={(e) => {
                          if (e.target.showPicker) e.target.showPicker();
                        }}
                        onKeyDown={(e) => e.preventDefault()}
                        $variant={errors.endTime ? 'error' : ''}
                        required
                      />
                    </DateInputsWrapper>
                    {errors.endDay && <ErrorMessage>{errors.endDay}</ErrorMessage>}
                    {errors.endTime && <ErrorMessage>{errors.endTime}</ErrorMessage>}
                  </DateInputBlock>
                </EndDateRow>
              </DateInputs>
            </DateOptions>
            <LocationOptions>
              <SettingsHeader>
                <LocationIcon fill={theme.colors.defaultStrong} />
                <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                  {t('eventForm.location.heading')}
                </Typography>
              </SettingsHeader>
              <LocationInput>
                <SearchIcon
                  fill={theme.colors.defaultWeak}
                  style={{ position: "absolute", left: "8px", top: "8px" }}
                />
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={onPlaceChanged}
                  className='Autocomplete'
                >
                  <AutocompleteInput
                    size="large"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (errors.location) setErrors({ ...errors, location: '' });
                    }}
                    placeholder={t('eventForm.location.searchPlaceholder')}
                    $variant={errors.location ? 'error' : ''}
                    required
                  />
                </Autocomplete>
                {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
              </LocationInput>
            </LocationOptions>
            <EventOptions>
              <SettingsHeader>
                <OptionsIcon stroke={theme.colors.defaultStrong} />
                <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                  {t('eventForm.options.heading')}
                </Typography>
              </SettingsHeader>
              <OptionsContainer>
                <EventOption onClick={() => handleOpenModal('eventType')}>
                  <OptionTitle>
                    <EventTypeIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
                      {t('eventForm.options.eventType.label')}
                    </Typography>
                  </OptionTitle>
                  <OptionSelected>
                    <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
                      {formData.eventType}
                    </Typography>
                    <EditIcon fill={theme.colors.defaultSubtle} />
                  </OptionSelected>
                </EventOption>
                {!isEditMode && (
                  <EventOption onClick={() => handleOpenModal('ticket')}>
                    <OptionTitle>
                      <TicketsIcon fill={theme.colors.defaultStrong} />
                      <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
                        {t('eventForm.options.ticket.label')}
                      </Typography>
                    </OptionTitle>
                    <OptionSelected>
                      <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
                        {formData.tickets[0].type === 'free'
                          ? t('eventForm.options.ticket.free')
                          : t('eventForm.options.ticket.paid', { price: formData.tickets[0].price })}
                      </Typography>
                      <EditIcon fill={theme.colors.defaultSubtle} />
                    </OptionSelected>
                  </EventOption>
                )}
                <EventOption onClick={() => handleOpenModal('terrain')}>
                  <OptionTitle>
                    <TerrainIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
                      {t('eventForm.options.terrain.label')}
                    </Typography>
                  </OptionTitle>
                  <OptionSelected>
                    <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
                      {formData.terrain}
                    </Typography>
                    <EditIcon fill={theme.colors.defaultSubtle} />
                  </OptionSelected>
                </EventOption>
                <EventOption onClick={() => handleOpenModal('experience')}>
                  <OptionTitle>
                    <ExperienceIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
                      {t('eventForm.options.experience.label')}
                    </Typography>
                  </OptionTitle>
                  <OptionSelected>
                    <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
                      {formData.experience}
                    </Typography>
                    <EditIcon fill={theme.colors.defaultSubtle} />
                  </OptionSelected>
                </EventOption>
                <EventOption onClick={() => handleOpenModal('vehicleRequirement')}>
                  <OptionTitle>
                    <WheelIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
                      {t('eventForm.options.vehicle.label')}
                    </Typography>
                  </OptionTitle>
                  <OptionSelected>
                    <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
                      {formData.needsVehicle
                        ? (formData.organizerVehicle
                          ? formData.organizerVehicle.nickname || formData.organizerVehicle.model
                          : t('eventForm.options.vehicle.required'))
                        : t('eventForm.options.vehicle.notRequired')}
                    </Typography>
                    <EditIcon fill={theme.colors.defaultSubtle} />
                  </OptionSelected>
                </EventOption>
                {formData.needsVehicle && (
                  <EventOption onClick={() => handleOpenModal('selectVehicle')}>
                    <OptionTitle>
                      <WheelIcon fill={theme.colors.defaultStrong} />
                      <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
                        {t('eventForm.options.organizerVehicle.label')}
                      </Typography>
                    </OptionTitle>
                    <OptionSelected>
                      <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
                        {formData.organizerVehicle
                          ? formData.organizerVehicle.nickname || formData.organizerVehicle.model
                          : t('eventForm.options.organizerVehicle.select')}
                      </Typography>
                      <EditIcon fill={theme.colors.defaultSubtle} />
                    </OptionSelected>
                  </EventOption>
                )}
                {activeModal === 'eventType' && (
                  <CreateEventTypeModal
                    eventType={formData.eventType}
                    setEventType={(value) => setFormData(prev => ({ ...prev, eventType: value }))}
                    onClose={handleCloseModal}
                  />
                )}
                {activeModal === 'terrain' && (
                  <CreateEventTerrainModal
                    terrain={formData.terrain}
                    setTerrain={(value) => setFormData(prev => ({ ...prev, terrain: value }))}
                    onClose={handleCloseModal}
                  />
                )}
                {activeModal === 'experience' && (
                  <CreateEventExperienceModal
                    experience={formData.experience}
                    setExperience={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                    onClose={handleCloseModal}
                  />
                )}
                {activeModal === 'vehicleRequirement' && (
                  <VehicleRequirementModal
                    needsVehicle={formData.needsVehicle}
                    setNeedsVehicle={(value) => setFormData(prev => ({ ...prev, needsVehicle: value }))}
                    organizerVehicle={formData.organizerVehicle}
                    onOpenSelectVehicle={() => setActiveModal('selectVehicle')}
                    onClose={handleCloseModal}
                  />
                )}
                {activeModal === 'selectVehicle' && (
                  <SelectVehicleModal
                    onSelectVehicle={(vehicle) => {
                      setFormData(prev => ({ ...prev, organizerVehicle: vehicle }));
                      setActiveModal('vehicleRequirement');
                    }}
                    selectedVehicle={formData.organizerVehicle}
                    onClose={handleCloseModal}
                  />
                )}
                {!isEditMode && activeModal === 'ticket' && (
                  <CreateEventTicketModal
                    ticketName={formData.tickets[0].name}
                    ticketType={formData.tickets[0].type}
                    ticketPrice={formData.tickets[0].price}
                    capacity={formData.tickets[0].capacity}
                    approvalRequired={formData.tickets[0].approvalRequired}
                    setTicketName={(value) => {
                      const updated = [...formData.tickets];
                      updated[0].name = value;
                      setFormData(prev => ({ ...prev, tickets: updated }));
                    }}
                    setTicketType={(value) => {
                      const updated = [...formData.tickets];
                      updated[0].type = value;
                      if (value === 'free') updated[0].price = 0;
                      setFormData(prev => ({ ...prev, tickets: updated }));
                    }}
                    setTicketPrice={(value) => {
                      const updated = [...formData.tickets];
                      updated[0].price = value;
                      setFormData(prev => ({ ...prev, tickets: updated }));
                    }}
                    setCapacity={(value) => {
                      const updated = [...formData.tickets];
                      updated[0].capacity = value;
                      setFormData(prev => ({ ...prev, tickets: updated }));
                    }}
                    setApprovalRequired={(value) => {
                      const updated = [...formData.tickets];
                      updated[0].approvalRequired = value;
                      setFormData(prev => ({ ...prev, tickets: updated }));
                    }}
                    onClose={handleCloseModal}
                  />
                )}
              </OptionsContainer>
            </EventOptions>
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

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: ${({ theme }) => theme.fill.defaultSubtle};
  padding-top: 74px;
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

const UserAvatar = styled.img`
  border-radius: ${({ theme }) => theme.sizing.xs};
  height: 40px;
  width: 40px;
`;

const UserData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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

const Settings = styled.div`
  grid-area: 1 / 8 / 2 / 13;
  border-radius: 16px;
  border: 1px solid var(--border-default-weak, #DCDCDC);
  height: fit-content;
`;

const SettingsHeader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const OptionsBlock = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.sizing.sm};
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
`;
const DateOptions = styled(OptionsBlock)`
  border-top: none;
`;

const DateInputs = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.sm};
  align-self: stretch;
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  background: ${({ theme }) => theme.fill.defaultSubtle};
`;

const DateInputRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const StartDateRow = styled(DateInputRow)``;
const EndDateRow = styled(DateInputRow)``;

const DateInputBlock = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const DateInputsWrapper = styled.div`
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
`;

const LocationOptions = styled(OptionsBlock)`
`;

const LocationInput = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xxs};
  width: 100%;

  .Autocomplete {
    width: 100%;
  }
`;

const AutocompleteInput = styled(InputText)`
  padding-left: 44px;
  background: var(--bg-default-subtle, #FAFAFA);

  &:hover {
    background: #efefef;
  }
`;

const EventOptions = styled(OptionsBlock)``;

const OptionsContainer = styled.div`
  border-radius: ${({ theme }) => theme.sizing.xs};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  background: ${({ theme }) => theme.fill.defaultSubtle};
  overflow: hidden;
`;

const EventOption = styled.div`
  display: flex;
  padding: 12px ${({ theme }) => theme.sizing.sm};
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xss};
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  cursor: pointer;
  transition: all 0.3s;

  &:first-child {
    border-top: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.fill.defaultWeak};
  }
`;

const OptionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OptionSelected = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background-color: unset;
  padding: 0;
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