// hooks/useTickets.js

import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'
import { toast } from 'react-toastify'

const useTickets = (eventId) => {
  const [tickets, setTickets] = useState([])
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [errorTickets, setErrorTickets] = useState(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosClient.get(`/api/tickets/event/${eventId}`)
        if (response.data.success) {
          setTickets(response.data.tickets)
        } else {
          setErrorTickets(response.data.message || 'Error al obtener los tickets.')
          toast.error(response.data.message || 'Error al obtener los tickets.')
        }
      } catch (error) {
        console.error('Error fetching tickets:', error)
        setErrorTickets(error.response?.data?.message || 'Error al obtener los tickets.')
        toast.error(error.response?.data?.message || 'Error al obtener los tickets.')
      } finally {
        setLoadingTickets(false)
      }
    }

    fetchTickets()
  }, [eventId])

  return { tickets, loadingTickets, errorTickets }
}

export default useTickets
