import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para redirigir


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password });

      // console.log(response)

      if (response.data.success) {
        // Guardar token en localStorage
        localStorage.setItem('authToken', response.data.token);

        // Redirigir al home con mensaje de bienvenida
        navigate('/', { state: { message: `Welcome back, ${username}!` } });

      } else {
        setError('Username or password is incorrect');
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
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
