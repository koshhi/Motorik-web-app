import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

/**
 * Hook personalizado para manejar la creación y eliminación de vehículos.
 */
const useVehicleHandlers = () => {
  const [loading, setLoading] = useState(false);

  const handleVehicleCreatedOrUpdated = async (vehicleData, existingVehicleId = null) => {
    console.log('handleVehicleCreatedOrUpdated called with existingVehicleId:', existingVehicleId);
    try {
      setLoading(true);
      let response;

      if (existingVehicleId) {
        console.log('Updating vehicle with ID:', existingVehicleId);
        response = await axiosClient.put(`/api/vehicles/${existingVehicleId}`, vehicleData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        console.log('Creating new vehicle');
        response = await axiosClient.post('/api/vehicles', vehicleData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.data.success) {
        console.log('Vehicle operation successful:', response.data.vehicle);
        toast.success(existingVehicleId ? 'Vehículo actualizado exitosamente.' : 'Vehículo creado exitosamente.');
        return response.data.vehicle;
      } else {
        toast.error(response.data.message || 'Error al guardar el vehículo.');
        console.error('Error guardando el vehículo:', response.data.message);
        return null;
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Error al guardar el vehículo:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error al guardar el vehículo:', error.message);
        toast.error('Error al guardar el vehículo.');
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleDeleted = async (vehicleId) => {
    console.log('handleVehicleDeleted called with vehicleId:', vehicleId);
    try {
      setLoading(true);
      const response = await axiosClient.delete(`/api/vehicles/${vehicleId}`);

      if (response.data.success) {
        toast.success('Vehículo eliminado exitosamente.');
        return true;
      } else {
        toast.error(response.data.message || 'Error al eliminar el vehículo.');
        console.error('Error eliminando el vehículo:', response.data.message);
        return false;
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.error('Error al eliminar el vehículo:', error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error('Error al eliminar el vehículo:', error.message);
        toast.error('Error al eliminar el vehículo.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleVehicleCreatedOrUpdated,
    handleVehicleDeleted,
    loading,
  };
};

export default useVehicleHandlers;
