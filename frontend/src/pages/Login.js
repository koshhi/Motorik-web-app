import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input/InputText';
import Button from '../components/Button/Button';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, { email, password });

      // console.log(response)

      if (response.data.success) {
        // Guardar token en localStorage
        localStorage.setItem('authToken', response.data.token);

        // Obtener la información del usuario
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        // Actualizar el estado del usuario en el contexto
        setUser(userResponse.data.user);

        // Redirigir al home con mensaje de bienvenida
        navigate('/');

      } else {
        setError('Email or password is incorrect');
        navigate('/error', { state: { message: 'Login failed. Please try again.' } }); // Redirige a página de error
      }
    } catch (error) {
      console.error(error)
      setError('An error occurred');
      navigate('/error', { state: { message: 'An error occurred during login. Please try again.' } }); // Redirige a página de error
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
