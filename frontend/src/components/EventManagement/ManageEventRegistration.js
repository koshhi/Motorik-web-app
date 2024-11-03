import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import InputText from '../Input/InputText';
import Button from '../Button/Button';

const ManageEventRegistration = () => {
  const { id } = useParams(); // ID del evento
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ type: 'free', price: 0 });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar los tickets existentes del evento
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosClient.get(`/api/events/${id}/tickets`);
        if (response.data.success) {
          setTickets(response.data.tickets);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [id]);

  // Manejar cambios en el nuevo ticket
  const handleNewTicketChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Agregar un nuevo ticket
  const handleAddTicket = async () => {
    const { type, price } = newTicket;
    if (!type || !['free', 'paid'].includes(type)) {
      setErrors({ type: 'Tipo de ticket inválido' });
      return;
    }
    if (type === 'paid' && (price === undefined || isNaN(price))) {
      setErrors({ price: 'El precio es obligatorio para tickets de pago' });
      return;
    }

    try {
      const response = await axiosClient.post(`/api/events/${id}/tickets`, newTicket);
      if (response.data.success) {
        setTickets(response.data.tickets);
        setNewTicket({ type: 'free', price: 0 });
      }
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  // Actualizar un ticket existente
  const handleUpdateTicket = async (ticketId, updatedFields) => {
    try {
      const response = await axiosClient.put(`/api/events/${id}/tickets/${ticketId}`, updatedFields);
      if (response.data.success) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) => (ticket._id === ticketId ? response.data.ticket : ticket))
        );
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  // Eliminar un ticket
  const handleDeleteTicket = async (ticketId) => {
    try {
      const response = await axiosClient.delete(`/api/events/${id}/tickets/${ticketId}`);
      if (response.data.success) {
        setTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== ticketId));
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  if (loading) return <p>Cargando tickets...</p>;

  return (
    <TicketsContainer>
      <TicketSectionHeader>
        <h2>Entrada/s</h2>
        <Button $variant="outline">Añadir entrada</Button>
      </TicketSectionHeader>
      <TicketsList>
        {tickets.map((ticket) => (
          <TicketItem key={ticket._id}>
            <div>
              {ticket.type === 'free' && (
                <p>Estandar</p>
              )}
            </div>
            <div>
              <p>Precio de la entrada:</p>
              <p>{ticket.price} <img src="/icons/edit.svg" alt="Editar" /></p></div>
            <div>
              <select
                value={ticket.type}
                onChange={(e) =>
                  handleUpdateTicket(ticket._id, { type: e.target.value, price: ticket.price })
                }
              >
                <option value="free">Gratis</option>
                <option value="paid">De pago</option>
              </select>
            </div>
            {ticket.type === 'paid' && (
              <div>
                <label>Precio (€):</label>
                <InputText
                  type="number"
                  value={ticket.price}
                  onChange={(e) =>
                    handleUpdateTicket(ticket._id, {
                      type: ticket.type,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
            )}
            <Button $variant="danger" onClick={() => handleDeleteTicket(ticket._id)}>
              Eliminar
            </Button>
          </TicketItem>
        ))}
      </TicketsList>

      <NewTicketForm>
        <h3>Agregar Nuevo Ticket</h3>
        <div>
          <label>Tipo:</label>
          <select name="type" value={newTicket.type} onChange={handleNewTicketChange}>
            <option value="free">Gratis</option>
            <option value="paid">De pago</option>
          </select>
          {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
        </div>
        {newTicket.type === 'paid' && (
          <div>
            <label>Precio (€):</label>
            <InputText
              type="number"
              name="price"
              value={newTicket.price}
              onChange={handleNewTicketChange}
            />
            {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
          </div>
        )}
        <Button onClick={handleAddTicket}>Agregar Ticket</Button>
      </NewTicketForm>
    </TicketsContainer>
  );
};

export default ManageEventRegistration;

// Estilos
const TicketsContainer = styled.div`
  padding: 20px;
`;

const TicketSectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 32px;
`;

const TicketsList = styled.div`
  margin-bottom: 30px;
`;

const TicketItem = styled.div`
  display: flex;
  padding: var(--Spacing-md, 24px);
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: var(--Spacing-sm, 16px);
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--border-default-weak, #DCDCDC);
  background: var(--bg-default-main, #FFF);
`;

const NewTicketForm = styled.div`
  h3 {
    margin-bottom: 10px;
  }

  div {
    margin-bottom: 10px;
  }

  label {
    margin-right: 5px;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
`;
