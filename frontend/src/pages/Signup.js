import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input/InputText';
import Button from '../components/Button/Button';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/signup`, {
        email,
        password,
        name,
        lastName,
        userAvatar,
        description,
      })
      if (response.data.success) {
        // Guardar token en localStorage
        localStorage.setItem('authToken', response.data.token)

        // Obtener la información del usuario
        const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        // Actualizar el estado del usuario en el contexto
        setUser(userResponse.data.user);

        // Redirigir al home con mensaje de bienvenida
        navigate('/')

      } else {
        // Manejar error de signup
        setError('Signup failed. Email might be taken.')
        navigate('/error');
      }
    } catch (error) {
      setError('An error occurred');
      navigate('/error');
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <Input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
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
