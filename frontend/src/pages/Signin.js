import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import InputText from '../components/Input/InputText';
import Button from '../components/Button/Button';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      // Petición al backend para enviar el Magic Link
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/check-or-register`, { email });

      if (response.data.success) {
        navigate('/email-verification');  // Redirigir a la vista de confirmación
      } else {
        setError('Error sending email, please try again.');
      }
    } catch (error) {
      setError('Error processing request, please try again.');
    }
  };

  const handleGoogleSignin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  const handleFacebookSignin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/facebook`;
  };

  return (
    <div>
      <Button onClick={handleGoogleSignin}>Continuar con Google</Button>
      <Button onClick={handleFacebookSignin}>Continuar con Facebook</Button>

      <form onSubmit={handleEmailSubmit}>
        <InputText
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Introduce tu email"
          required
        />
        {error && <p>{error}</p>}
        <Button type="submit">Continuar con Email</Button>
      </form>
    </div>
  );
};

export default Signin;
