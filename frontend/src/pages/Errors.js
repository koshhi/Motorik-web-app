import React from 'react';
import { useLocation } from 'react-router-dom';

const ErrorPage = () => {
  const location = useLocation();
  const errorMessage = location.state?.message;

  return (
    <div>
      <h1>Error</h1>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default ErrorPage;