import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/signup`, {
        username,
        password,
        name,
        lastName,
        userAvatar,
        description,
      })
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
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="First Name"
        required
      />
      <Input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
      />
      <Input
        type="text"
        value={userAvatar}
        onChange={(e) => setUserAvatar(e.target.value)}
        placeholder="Profile Image URL"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Tell us something about you"
      />
      <Button type="submit">Signup</Button>
      {error && <p>{error}</p>}
    </form>
  )
}

export default Signup;
