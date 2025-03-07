import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import InputText from '../components/Input/InputText';
import Button from '../components/Button/Button';


const Signin = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation('signin');

  const location = useLocation();
  const returnTo = location.state?.returnTo || '/'; // Valor por defecto si no viene definido
  console.log('Signin: returnTo recibido desde location.state:', returnTo);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // const response = await axiosClient.post('/api/users/check-or-register', { email });
      const response = await axiosClient.post('/api/users/check-or-register', { email, returnTo });

      if (response.data.success) {
        // Pasamos email y returnTo para que luego se pueda redirigir al usuario a la URL original
        navigate('/email-verification', { state: { email, returnTo } });
      } else {
        setError(response.data.message || 'Error enviando el email, por favor intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error en Signin:', err);
      setError(err.response?.data?.message || 'Error procesando la solicitud, por favor intenta de nuevo.');
    }
  };

  const handleGoogleSignin = () => {
    const url = `${process.env.REACT_APP_API_URL}/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
    console.log('Google signin URL:', url);
    window.location.href = url;
    // window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
    // window.location.href = `${process.env.REACT_APP_API_URL}/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
  };

  const handleFacebookSignin = () => {
    // window.location.href = `${process.env.REACT_APP_API_URL}/auth/facebook`;
    // window.location.href = `${process.env.REACT_APP_API_URL}/auth/facebook?returnTo=${encodeURIComponent(returnTo)}`;
    const url = `${process.env.REACT_APP_API_URL}/auth/facebook?returnTo=${encodeURIComponent(returnTo)}`;
    console.log('Facebook signin URL:', url);
    window.location.href = url;
  };

  return (
    <SigninContainer>
      <SigninBlock>
        <Header>
          <Link className='BackLink' to={returnTo}><img src="/icons/chevron-left.svg" alt="Back button" /></Link>
          {/* <p>Únete o entra a Motorik</p> */}
          {t('signinHeader')}
        </Header>

        <OauthSignin>
          {/* <h2 className='Title'>{t('oauthTitle')}Unete o entra en un click</h2> */}
          <h2 className='Title'>{t('oauthTitle')}</h2>
          <p className='Subtitle'>{t('oauthSubtitle')}</p>
          <div className='OauthButtons'>
            <Button className='GoogleSignin' onClick={handleGoogleSignin} $variant="outline" size="medium"><img src="icons/google-color.svg" alt="Google logo" /><p>{t('googleSigninButton')}</p><img src="icons/chevron-right.svg" alt="arrow icon" /></Button>
            <Button className='FacebookSignin' onClick={handleFacebookSignin} $variant="outline" size="medium"><img src="icons/facebook-color.svg" alt="Google logo" /><p>{t('facebookSigninButton')}</p><img src="icons/chevron-right.svg" alt="arrow icon" /></Button>
          </div>
        </OauthSignin>
        <EmailSigninForm onSubmit={handleEmailSubmit}>
          <p className='Subtitle'>{t('emailSigninSubtitle')}</p>
          <InputText
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            required
            $size='large'
          />
          {error && <p>{error}</p>}
          <Button className='EmailSignin' size="medium" type="submit">{t('emailSigninButton')}<img src="icons/chevron-right-white.svg" alt="arrow icon" /></Button>
        </EmailSigninForm>

      </SigninBlock>
    </SigninContainer>
  );
};

export default Signin;

const SigninContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.fill.inverseStrong};
`;

const SigninBlock = styled.div`
  background: ${({ theme }) => theme.fill.defaultMain};
  width: 480px;
  border-radius: ${({ theme }) => theme.radius.xs};

  .Divider {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.inverseStrong};

    .DividerLine {
      width: 100%;
      height: 1px;
      background-color: ${({ theme }) => theme.fill.defaultWeak};
    }
  }
`;

const OauthSignin = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.sizing.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xs};

  .Title {
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on, 'ss04' on;
    font-family: "Mona Sans";
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%;
  }
  
  .Subtitle {
    color:${({ theme }) => theme.colors.defaultWeak};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 24px */
  }

  .OauthButtons {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 16px;

    .GoogleSignin,
    .FacebookSignin {
      p {
        width: 100%;
        text-align: left
      }
    }  
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: ${({ theme }) => theme.sizing.sm};
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  color: var(--text-icon-default-main, #292929);
  text-align: center;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;

  .BackLink {
    position: absolute;
    left: 12px;
    top: 16px;
  }
`;


const EmailSigninForm = styled.form`
  width: 100%;
  padding: ${({ theme }) => theme.sizing.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};

  .Subtitle {
    color:${({ theme }) => theme.colors.defaultWeak};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 24px */
  }

  .EmailSignin {
    justify-content: space-between;
  }
`;