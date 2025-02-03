// ManageEventRegistration.js

import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEventContext } from '../../context/EventContext';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { theme } from '../../theme';
import Button from '../Button/Button';
import Typography from '../Typography';
import Modal from '../Modal/Modal';
import AddTicketForm from '../Forms/AddTicketForm';
import EditTicketForm from '../Forms/EditTicketForm';
import Tag from '../Tag';
import DropdownButton from '../DropdownButton';



const ManageEventRegistration = () => {
  const { id } = useParams();
  const { eventDetails, setEventDetails } = useEventContext();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState(null);

  // Cargar los tickets existentes del evento
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosClient.get(`/api/tickets/event/${id}`);
        if (response.data.success) {
          setTickets(response.data.tickets);
        } else {
          toast.error(response.data.message || 'Error al obtener los tickets.');
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast.error('Error al obtener los tickets.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [id]);

  // Funciones para manejar los modales
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const openEditModal = (ticket) => {
    setTicketToEdit(ticket);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setTicketToEdit(null);
    setIsEditModalOpen(false);
  };

  // Función auxiliar para actualizar la capacidad total del evento
  const updateEventCapacity = async () => {
    try {
      const response = await axiosClient.get(`/api/events/${id}`);
      if (response.data.success) {
        setEventDetails(response.data.event); // Actualiza el estado del evento en el contexto
      } else {
        toast.error(response.data.message || 'Error al actualizar la capacidad del evento.');
      }
    } catch (error) {
      console.error('Error updating event capacity:', error);
      toast.error('Error al actualizar la capacidad del evento.');
    }
  };

  // Recalcular la capacidad total cada vez que los tickets cambian
  useEffect(() => {
    const calculateTotalCapacity = () => {
      const total = tickets.reduce((sum, ticket) => sum + ticket.capacity, 0);
      setEventDetails(prev => ({ ...prev, capacity: total }));
    };

    if (tickets.length > 0) {
      calculateTotalCapacity();
    }
  }, [tickets, setEventDetails]);

  // Antes de enviar la petición, verificamos si el ticket es de pago y si el usuario tiene cuenta Stripe válida
  const canCreatePaidTicket = user?.stripeConnectedAccountId && user?.chargesEnabled;

  // Agregar un nuevo ticket
  const handleAddTicket = async (ticketData) => {
    const { type, price, approvalRequired, name, capacity } = ticketData;

    // Si se intenta crear un ticket de pago sin cuenta Stripe válida, se cancela
    if (type === 'paid' && !canCreatePaidTicket) {
      toast.error('No puedes agregar tickets de pago sin tener una cuenta de Stripe validada y con cobros activados. Por favor, activa los pagos en tu configuración.');
      return;
    }

    try {
      const response = await axiosClient.post(`/api/tickets/event/${id}`, {
        type,
        price: type === 'paid' ? Number(price) : 0,
        approvalRequired,
        capacity: Number(capacity),
        name
      });

      if (response.data.success) {
        setTickets(prevTickets => [...prevTickets, response.data.ticket]);
        toast.success('Ticket agregado exitosamente.');
        closeAddModal();
        await updateEventCapacity(); // Actualizar la capacidad total del evento
      } else {
        toast.error(response.data.message || 'Error al agregar el ticket.');
      }
    } catch (error) {
      console.error('Error adding ticket:', error);
      toast.error('Error al agregar el ticket.');
    }
  };

  // Actualizar un ticket existente
  const handleUpdateTicket = async (ticketId, updatedFields) => {
    // Si se intenta actualizar un ticket a tipo "paid" sin cuenta Stripe válida, se cancela
    if (updatedFields.type === 'paid' && !canCreatePaidTicket) {
      toast.error('No puedes actualizar a un ticket de pago sin tener una cuenta de Stripe validada y con cobros activados.');
      return;
    }

    try {
      const response = await axiosClient.put(`/api/tickets/${ticketId}`, updatedFields);
      if (response.data.success) {
        setTickets(prevTickets =>
          prevTickets.map(ticket => (ticket._id === ticketId ? response.data.ticket : ticket))
        );
        toast.success('Ticket actualizado exitosamente.');
        closeEditModal();
        await updateEventCapacity(); // Actualizar la capacidad total del evento
      } else {
        toast.error(response.data.message || 'Error al actualizar el ticket.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al actualizar el ticket.');
      }
      console.error('Error updating ticket:', error);
    }
  };

  // Eliminar un ticket
  const handleDeleteTicket = async (ticketId) => {
    try {
      const response = await axiosClient.delete(`/api/tickets/${ticketId}`);
      if (response.data.success) {
        setTickets(prevTickets => prevTickets.filter(ticket => ticket._id !== ticketId));
        toast.success('Ticket eliminado exitosamente.');
        await updateEventCapacity(); // Actualizar la capacidad total del evento
      } else {
        toast.error(response.data.message || 'Error al eliminar el ticket.');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Error al eliminar el ticket.');
    }
  };

  if (loading || !eventDetails) return <p>Cargando tickets...</p>;

  return (
    <RegistrationContainer>
      <Container style={{ paddingBottom: '40px' }}>
        <TicketsHeader>
          <Typography $variant="title-4-semibold">Entradas</Typography>
          <Button $variant="outline" onClick={openAddModal}>
            <img src="/icons/add.svg" alt="Añadir Entrada" />
            Añadir Entrada
          </Button>
        </TicketsHeader>

        {/* Lista de Tickets */}
        <TicketsList>
          {tickets.map((ticket) => (
            <TicketItem
              key={ticket._id}
              onClick={() => openEditModal(ticket)}
            >
              <TicketMainInfo>
                <Typography $variant="title-5-medium">{ticket.name}</Typography>
                <Typography $variant="body-1-medium" color={theme.colors.defaultWeak}>
                  {ticket.type === 'free' ? 'Gratis' : `${ticket.price}€`}
                </Typography>
              </TicketMainInfo>
              <TicketSecondaryInfo>
                {ticket.approvalRequired && (
                  <Tag $variant='brandSubtle' $textStyle='caption-medium' $textTransform='capitalize' $letterSpacing='none' $borderRadius='8px'>
                    Aprobación Requerida
                  </Tag>
                )}
                <Typography $variant="body-2-regular">{ticket.availableSeats} de {ticket.capacity} disponibles</Typography>
                <TicketActions onClick={(e) => e.stopPropagation()}>
                  <DropdownButton
                    options={[
                      { label: 'Editar', onClick: () => openEditModal(ticket) },
                      { label: 'Eliminar', onClick: () => handleDeleteTicket(ticket._id) }
                    ]}
                  />
                </TicketActions>
              </TicketSecondaryInfo>

            </TicketItem>
          ))}
        </TicketsList>

        {/* Modal para Agregar Ticket */}
        {isAddModalOpen && (
          <Modal onClose={closeAddModal} title="Añadir Entrada">
            <AddTicketForm onSubmit={handleAddTicket} onClose={closeAddModal} />
          </Modal>
        )}

        {/* Modal para Editar Ticket */}
        {isEditModalOpen && ticketToEdit && (
          <Modal onClose={closeEditModal} title="Editar Entrada">
            <EditTicketForm
              ticket={ticketToEdit}
              onSubmit={handleUpdateTicket}
              onClose={closeEditModal}
            />
          </Modal>
        )}
      </Container>
      <Container style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        <EmailsHeader>
          <Typography $variant="title-4-semibold">Emails de registro</Typography>
          <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>Personalice los correos electrónicos enviados cuando un invitado se registra, es aprobado o rechazado para el evento.</Typography>
        </EmailsHeader>
      </Container>
      <Container style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        <QuestionsHeader>
          <Typography $variant="title-4-semibold">Preguntas adicionales </Typography>
          <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>Le haremos a los invitados las siguientes preguntas cuando se registren para el evento.</Typography>
        </QuestionsHeader>
      </Container>
    </RegistrationContainer>
  );
};

export default ManageEventRegistration;


// Estilos
const RegistrationContainer = styled.section`
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  max-width: 1400px;
  width: 100%;
`;

const TicketsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: ${({ theme }) => theme.sizing.md};
`;

const TicketsList = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  border-radius: ${({ theme }) => theme.radius.xs};
  width: 100%;
`;

const TicketItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.fill.defaultSubtle};
  }

  &:first-child {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }

  &:last-child {
    border-bottom: none;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }
`;

const TicketMainInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

const TicketSecondaryInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
`;

const TicketActions = styled.div`
  display: flex;
  align-items: center;
`;

const EmailsHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  gap: 8px;
  padding-top: 40px;
  padding-bottom: 40px;
  border-top: 1px solid ${theme.border.defaultSubtle};
`;

const QuestionsHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  gap: 8px;
  padding-top: 40px;
  padding-bottom: 40px;
  border-top: 1px solid ${theme.border.defaultSubtle};
  border-bottom: 1px solid ${theme.border.defaultSubtle};
`;
