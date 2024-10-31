import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import styled from 'styled-components';
import Button from '../components/Button/Button';


const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || 'tu correo';
  const [seconds, setSeconds] = useState(10);  // Temporizador de 10 segundos
  const [canResend, setCanResend] = useState(false);  // Control para habilitar el botón

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds === 1) {
          clearInterval(interval);
          setCanResend(true);  // Habilitar el botón después de 10 segundos
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);  // Limpiar intervalo cuando el componente se desmonte
  }, []);

  const handleResend = async () => {
    try {
      await axiosClient.post('/api/users/check-or-register', { email }); // Línea actualizada
      setSeconds(10);  // Reiniciar el temporizador
      setCanResend(false);  // Deshabilitar el botón de nuevo
    } catch (error) {
      console.error('Error reenviando el email:', error);
    }
  };


  return (
    <EmailConfirmation>
      <div className='messageContainer'>
        <div className='header'>
          <h1 className='heading'>Comprueba tu email</h1>
        </div>
        <div className='innerContainer'>
          <p className='title'>Enlace de inicio de sesión enviado.</p>
          <p className='subtitle'>Hemos enviado un enlace temporal para continuar a <span className='userEmail'>{email}</span>. <a>¿No eres tú?</a></p>
          <Button className={canResend ? 'resendButton' : 'resendButton disabled'} $variant='outline' onClick={handleResend} disabled={!canResend}>
            {canResend ? 'Reenviar email' : `Reenviar en ${seconds} segundos`}
          </Button>
          <p className='help'>Revisa tu bandeja de entrada y spam si no recibes el email.</p>
        </div>
      </div>
    </EmailConfirmation >
  );
};

export default VerifyEmail;

const EmailConfirmation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
  padding: 80px 24px;
  background: rgba(26, 26, 26, 0.90);
  backdrop-filter: blur(12px);

  .messageContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 472px;
    border-radius: ${({ theme }) => theme.radius.xs};
    background: ${({ theme }) => theme.fill.defaultMain};

    .header {
      padding: ${({ theme }) => theme.sizing.xs} ${({ theme }) => theme.sizing.md}; 
      border-bottom: 1px solid ${({ theme }) => theme.border.defaultWeak};
      width: 100%;
      text-align: center;

      .heading {
        color: ${({ theme }) => theme.colors.defaultStrong};
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        /* Body/Body 1/Semibold */
        font-family: "Mona Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%;
      }
    }

    .innerContainer {
      padding: ${({ theme }) => theme.sizing.md};

      .title {
        color: ${({ theme }) => theme.colors.defaultStrong};
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on, 'ss04' on;
        font-family: "Mona Sans";
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 25.2px */
        padding-bottom: 8px;
      }

      .subtitle {
        color:  ${({ theme }) => theme.colors.defaultWeak};
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        font-family: "Mona Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%; /* 24px */
        padding-bottom: ${({ theme }) => theme.sizing.md};

        .userEmail {
          color: ${({ theme }) => theme.colors.brandMain};
          font-weight: 500;
        }

        a {
          text-decoration: underline;
        }
      }

      .resendButton {
        width: 100%;
        justify-content: center;

        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .help {
        color: ${({ theme }) => theme.colors.defaultWeak};
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        padding-top: ${({ theme }) => theme.sizing.md};        
        font-family: "Mona Sans";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 140%; /* 19.6px */
      }
    }
  }
`;