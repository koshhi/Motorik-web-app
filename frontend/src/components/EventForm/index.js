// src/components/EventForm/index.js
import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import useDateTimeSync from '../../hooks/useDateTimeSync';

// Subcomponentes
import HeaderSection from './HeaderSection';
import ImageUploader from './ImageUploader';
import DescriptionSection from './DescriptionSection';
import DateTimeSection from './DateTimeSection';
import LocationSection from './LocationSection';
import OptionsSection from './OptionsSection';

// Modales que se usan en las opciones
import CreateEventTypeModal from '../Modal/CreateEventTypeModal';
import CreateEventTerrainModal from '../Modal/CreateEventTerrainModal';
import CreateEventExperienceModal from '../Modal/CreateEventExperienceModal';
import CreateEventTicketModal from '../Modal/CreateEventTicketModal';
import VehicleRequirementModal from '../Modal/CreateEventVehicleRequirementModal';
import SelectVehicleModal from '../Modal/CreateEventSelectVehicleModal';

const EventForm = forwardRef(({ initialData, onSubmit, isEditMode = false }, ref) => {
  const { t } = useTranslation('createEvent');
  const { user } = useAuth();
  const autocompleteRef = useRef(null);

  // Hook para fechas y horas
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
  const [fileWarning, setFileWarning] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  // Si hay datos iniciales para edición
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

  // Validación (similar a la versión original)
  const validateForm = () => {
    const newErrors = {};
    const startDT = new Date(`${startDay}T${startTime}`);
    const endDT = new Date(`${endDay}T${endTime}`);

    if (!formData.title.trim()) newErrors.title = t('eventForm.eventTitle.error');
    if (!formData.location.trim()) newErrors.location = t('eventForm.location.error');
    if (!formData.description.trim()) newErrors.description = t('eventForm.detailsPlaceholder');
    if (!file && !isEditMode && !formData.imageUrl) newErrors.file = t('eventForm.eventImage.error');
    if (startDT >= endDT) {
      newErrors.startDay = t('eventForm.date.invalid') || `${t('eventForm.date.startLabel')} ${t('eventForm.date.endLabel')}`;
      newErrors.endDay = t('eventForm.date.invalid') || t('eventForm.date.endLabel');
    }
    if (!formData.coordinates.lat || !formData.coordinates.lng) {
      newErrors.location = t('eventForm.location.error');
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

  // Handlers para inputs y Autocomplete
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   setFile(selectedFile);
  //   if (errors.file) setErrors({ ...errors, file: '' });
  // };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrors(prev => ({ ...prev, file: 'Solo se permiten imágenes JPG o PNG.' }));
      return;
    }

    // Validar tamaño del archivo (máximo 200 KB)
    if (selectedFile.size > 300 * 1024) {
      setErrors(prev => ({ ...prev, file: 'El tamaño del archivo no debe superar los 300 KB.' }));
      return;
    }

    // Validar dimensiones y relación de aspecto
    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => {
      // Validar ancho máximo
      if (img.width > 1500) {
        setErrors(prev => ({ ...prev, file: 'El ancho de la imagen no debe superar los 1500 píxeles.' }));
        return;
      }

      // Comprobar relación de aspecto 4:3 con una tolerancia
      const ratio = img.width / img.height;
      if (Math.abs(ratio - (4 / 3)) > 0.01) {
        // Avisar que la imagen se recortará para ajustarse a la proporción 4:3
        setFileWarning(t('eventForm.eventImage.warning'));
        // window.alert('La imagen tiene una relación de aspecto diferente a 4:3 y será recortada automáticamente.');
      }

      // Si se cumplen las condiciones, se limpia el error y se guarda el archivo
      setErrors(prev => ({ ...prev, file: '' }));
      setFile(selectedFile);
    };

    // Limpiar el error previo (opcional)
    if (errors.file) {
      setErrors(prev => ({ ...prev, file: '' }));
    }
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
      <HeaderSection
        title={formData.title}
        onTitleChange={handleInputChange}
        error={errors.title}
        user={user}
      />
      <FormWrapper>
        <Grid>
          <Details>
            <ImageSection>
              <ImageUploader
                file={file}
                imageUrl={formData.imageUrl}
                eventType={formData.eventType}
                onFileChange={handleFileChange}
                error={errors.file}
                warning={fileWarning}
              />
            </ImageSection>
            <DescriptionSection
              description={formData.description}
              onChange={handleInputChange}
              error={errors.description}
            />
          </Details>
          <Settings>
            <DateTimeSection
              startDay={startDay}
              setStartDay={setStartDay}
              startTime={startTime}
              setStartTime={setStartTime}
              endDay={endDay}
              setEndDay={setEndDay}
              endTime={endTime}
              setEndTime={setEndTime}
              setIsEndDayChanged={setIsEndDayChanged}
              setIsEndTimeChanged={setIsEndTimeChanged}
              errors={{ startDay: errors.startDay, startTime: errors.startTime, endDay: errors.endDay, endTime: errors.endTime }}
            />
            <LocationSection
              location={formData.location}
              onLocationChange={handleInputChange}
              onPlaceChanged={onPlaceChanged}
              autocompleteRef={autocompleteRef}
              coordinates={formData.coordinates}
              error={errors.location}
            />
            <OptionsSection
              formData={formData}
              isEditMode={isEditMode}
              handleOpenModal={handleOpenModal}
              errors={errors}
            />
          </Settings>
        </Grid>
      </FormWrapper>
      {/* Los modales se renderizan según activeModal */}
      {/* Renderizado de los modales según el valor de activeModal */}
      {activeModal === 'eventType' && (
        <CreateEventTypeModal
          eventType={formData.eventType}
          setEventType={(value) =>
            setFormData(prev => ({ ...prev, eventType: value }))
          }
          onClose={handleCloseModal}
        />
      )}
      {activeModal === 'terrain' && (
        <CreateEventTerrainModal
          terrain={formData.terrain}
          setTerrain={(value) =>
            setFormData(prev => ({ ...prev, terrain: value }))
          }
          onClose={handleCloseModal}
        />
      )}
      {activeModal === 'experience' && (
        <CreateEventExperienceModal
          experience={formData.experience}
          setExperience={(value) =>
            setFormData(prev => ({ ...prev, experience: value }))
          }
          onClose={handleCloseModal}
        />
      )}
      {activeModal === 'vehicleRequirement' && (
        <VehicleRequirementModal
          needsVehicle={formData.needsVehicle}
          setNeedsVehicle={(value) =>
            setFormData(prev => ({ ...prev, needsVehicle: value }))
          }
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
      {activeModal === 'ticket' && (
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

const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-gap: ${({ theme }) => theme.sizing.md};
  max-width: 1400px;
  width: 100%;
  padding: ${({ theme }) => theme.sizing.md};
`;

const Details = styled.div`
  // grid-column: span 7;
  grid-area: 1 / 1 / 2 / 8;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.md};
`;

const ImageSection = styled.div`
  width: 100%;
`;

const Settings = styled.div`
  // grid-column: span 5;
  grid-area: 1 / 8 / 2 / 13;
  border-radius: 16px;
  border: 1px solid var(--border-default-weak, #DCDCDC);
  height: fit-content;
`;

export { EventForm };
