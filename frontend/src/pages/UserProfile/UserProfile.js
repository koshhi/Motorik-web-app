import styled from 'styled-components';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MainNavbar from '../../components/Navbar/MainNavbar'
import Button from '../../components/Button/Button';
import UserProfileTab from './UserProfileTab';
import GarageTab from './GarageTab';

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');

  if (!user) return <div>Cargando perfil...</div>;

  return (
    <>
      <MainNavbar />
      <ProfileHeader>
        <Container>
          <div className='UserHeader'>
            <div className='UserData'>
              <img className='Avatar' src={user.userAvatar} alt='user avatar' />
              <div className='Data'>
                <h1>{user.name} {user.lastName}</h1>
                <p>Sevilla, España </p>
              </div>
            </div>
            <Button size="small" variant="outline">Editar perfil</Button>
          </div>

          {/* Tabs */}
          <SectionTabs>
            <button
              className={activeTab === 'Profile' ? 'SectionTab Active' : 'SectionTab'}
              onClick={() => setActiveTab('Profile')}
            >
              Perfil
            </button>
            <button
              className={activeTab === 'Garage' ? 'SectionTab Active' : 'SectionTab'}
              onClick={() => setActiveTab('Garage')}
            >
              Garaje
            </button>
          </SectionTabs>
        </Container>
      </ProfileHeader>
      {activeTab === 'Profile' && (
        <UserProfileTab user={user} />
      )}
      {activeTab === 'Garage' && (
        <GarageTab vehicles={user.vehicles} />
      )}
    </>
  );
};

export default UserProfile;


const ProfileHeader = styled.section`
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  align-items: center;
  display:flex;
  flex-direction: column;
  
  .UserHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .UserData {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${({ theme }) => theme.sizing.lg};

      .Avatar {
        height: 120px;
        width: 120px;
        border-radius: ${({ theme }) => theme.radius.xs};
      }

      .Data {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        h1 {
          color: ${({ theme }) => theme.colors.defaultStrong};
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;
          font-family: "Mona Sans";
          font-size: 32px;
          font-style: normal;
          font-weight: 600;
          line-height: 140%; /* 44.8px */
        }
      }
    }

  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  padding-bottom: 0px;
  width: 100%;
  max-width: 1400px;
  gap: ${({ theme }) => theme.sizing.md};

  .Grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 32px;
  grid-row-gap: 0px;

    .UserInfo {
      grid-area: 1 / 1 / 2 / 5;
      border-radius: ${({ theme }) => theme.radius.xs};
      border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
      background-color: ${({ theme }) => theme.fill.defaultMain};
      display: flex;
      flex-direction: column;
      align-items: center;

    }
  }
`;

const SectionTabs = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;

  .SectionTab {
    color: var(--text-icon-default-subtle, #989898);
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Body/Body 1/Semibold */
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */

    display: flex;
    padding: 16px 0px var(--Spacing-sm, 16px) 0px;
    justify-content: center;
    align-items: flex-end;
    border: none;
    border-bottom: 4px solid transparent;
    background-color: transparent;
  }

  .SectionTab.Active {
    color: var(--text-icon-brand-main, #F65703);
    border-bottom: 4px solid var(--border-brand-main, #F65703);
  }
`;
