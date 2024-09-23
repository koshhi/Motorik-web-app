import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from './Button/Button';

const ProfileHeader = ({ profileUser, user, userId }) => {

  if (!profileUser) {
    return <div>Cargando perfil...</div>;  // Mostrar un mensaje mientras el perfil se carga
  }

  return (
    <ProfileHeaderWrapper>
      <Container>
        <div className='UserHeader'>
          <div className='UserData'>
            <img className='Avatar' src={profileUser.userAvatar} alt='user avatar' />
            <div className='Data'>
              <h1>{profileUser.name} {profileUser.lastName}</h1>
              <p>Sevilla, España </p>
            </div>
          </div>
          {user && user.id === userId && (
            <Button size="small" variant="outline">Editar perfil</Button>
          )}
        </div>

        <SectionTabs>
          <Link to={`/user/${userId}`} className='SectionTab'>Perfil</Link>
          <Link to={`/user/${userId}/garage`} className='SectionTab Active'>Garaje</Link>
        </SectionTabs>
      </Container>
    </ProfileHeaderWrapper>
  );
};

export default ProfileHeader;

const ProfileHeaderWrapper = styled.section`
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  align-items: center;
  display: flex;
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
`;

const SectionTabs = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;

  .SectionTab {
    color: var(--text-icon-default-subtle, #989898);
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    font-family: "Mona Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 24px */
    display: flex;
    padding: 16px 0px;
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
