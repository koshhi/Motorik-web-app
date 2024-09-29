import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button/Button';
import InputText from '../components/Input/InputText';

const EnterPassword = () => {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/verify-email');
    } catch (error) {
      setError('Error logging in, please try again');
    }
  };

  return (
    <div>
      <h2>Enter your password</h2>
      <form onSubmit={handleSubmit}>
        <InputText
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        {error && <p>{error}</p>}
        <Button type="submit">Continuar</Button>
      </form>
    </div>
  );
};

export default EnterPassword;
