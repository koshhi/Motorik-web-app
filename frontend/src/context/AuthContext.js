import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {

  //   const fetchUserProfile = async () => {
  //     const token = localStorage.getItem('authToken');
  //     console.log({ tokenCaptured: token })
  //     if (!token) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (response.data.success) {
  //         setUser(response.data.user);  // Aquí se setea el usuario
  //       } else {
  //         alert('No se ha podido obtener el perfil del usuario.');
  //         console.error('Error fetching user profile');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user profile:', error);
  //       alert('Error al obtener el perfil del usuario');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserProfile();
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Verificar si hay un token en localStorage
    if (token) {
      // console.log(token)

      // Si existe un token, obtener el perfil del usuario
      const fetchUserProfile = async () => {
        try {

          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            setUser(response.data.user); // Actualiza el estado con la información del usuario
          } else {
            setUser(null); // Si no se puede obtener el perfil, establece el usuario en null
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        } finally {
          setLoading(false); // Finaliza la carga
        }
      };

      fetchUserProfile();
    } else {
      setLoading(false); // Si no hay token, también finaliza la carga
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
