import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users`, { username, password, name });
      if (response.data.success) {
        // Guardar token en localStorage
        localStorage.setItem('authToken', response.data.token)

        // Redirigir al home con mensaje de bienvenida
        navigate('/', { state: { message: `Welcome, ${name}!` } })

      } else {
        // Manejar error de signup
        setError('Signup failed. Username might be taken.')
        navigate('/error', { state: { message: 'Signup failed. Please try again.' } });
      }
    } catch (error) {
      setError('An error occurred');
      navigate('/error', { state: { message: 'An error occurred during signup. Please try again.' } }); // Redirige a página de error
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <button type="submit">Signup</button>
      {error && <p>{error}</p>}
    </form>
  )
}

export default Signup;
