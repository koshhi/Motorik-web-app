// context/VehicleContext.js

import React, { createContext, useState, useCallback, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVehicles = useCallback(async (userId) => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/vehicles/user/${userId}`);
      if (response.data.success) {
        setVehicles(response.data.vehicles);
      } else {
        toast.error(response.data.message || 'Error al obtener los vehículos.');
      }
    } catch (error) {
      console.error('Error al obtener los vehículos:', error);
      toast.error('Error al obtener los vehículos.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addVehicle = useCallback(async (vehicleData) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/api/vehicles', vehicleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        setVehicles((prevVehicles) => [...prevVehicles, response.data.vehicle]);
        // Eliminar el toast de éxito para evitar duplicados
        // toast.success('Vehículo creado exitosamente.');
        return response.data.vehicle;
      } else {
        toast.error(response.data.message || 'Error al crear el vehículo.');
        return null;
      }
    } catch (error) {
      console.error('Error al crear el vehículo:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al crear el vehículo.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVehicle = useCallback(async (vehicleId, vehicleData) => {
    setLoading(true);
    try {
      const response = await axiosClient.put(`/api/vehicles/${vehicleId}`, vehicleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        setVehicles((prevVehicles) =>
          prevVehicles.map((v) => (v._id === vehicleId ? response.data.vehicle : v))
        );
        // Eliminar el toast de éxito para evitar duplicados
        // toast.success('Vehículo actualizado exitosamente.');
        return response.data.vehicle;
      } else {
        toast.error(response.data.message || 'Error al actualizar el vehículo.');
        return null;
      }
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al actualizar el vehículo.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVehicle = useCallback(async (vehicleId) => {
    setLoading(true);
    try {
      const response = await axiosClient.delete(`/api/vehicles/${vehicleId}`);
      if (response.data.success) {
        setVehicles((prevVehicles) => prevVehicles.filter((v) => v._id !== vehicleId));
        // Eliminar el toast de éxito para evitar duplicados
        // toast.success('Vehículo eliminado exitosamente.');
        return true;
      } else {
        toast.error(response.data.message || 'Error al eliminar el vehículo.');
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar el vehículo:', error);
      toast.error('Error al eliminar el vehículo.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        loading,
        fetchVehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

VehicleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook personalizado para usar el contexto de vehículos
export const useVehicles = () => {
  return useContext(VehicleContext);
};
