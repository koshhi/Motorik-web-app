import styled from 'styled-components';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from './Button/Button';
import Typography from './Typography';
import { theme } from '../theme';

const ProfileHeader = ({ profileUser, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();

  if (!profileUser) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <>
      <ProfileHeaderWrapper>
        <Container>
          <UserHeader>
            <UserDataWrapper>
              <UserAvatar src={profileUser.userAvatar} alt='user avatar' />
              <UserData>
                <Typography as="h1" $variant="title-3-semibold">{profileUser.name} {profileUser.lastName}</Typography>
                <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>{profileUser.locality}, {profileUser.country}</Typography>
              </UserData>
            </UserDataWrapper>
            {user && user.id === userId && (
              <Button
                onClick={() => navigate(`/user/${userId}/edit-profile`, { state: { returnTo: `/user/${userId}` } })}
                size="small"
                $variant="outline"
              >
                Editar perfil
              </Button>
            )}
          </UserHeader>
          <SectionTabs>
            <SectionTab
              to={`/user/${userId}`}
              className={`SectionTab ${location.pathname === `/user/${userId}` ? 'Active' : ''}`}
            >
              <Typography
                $variant="body-1-semibold"
                color={location.pathname === `/user/${userId}` ? theme.colors.brandMain : theme.colors.defaultWeak}
              >
                Perfil
              </Typography>
            </SectionTab>
            <SectionTab
              to={`/user/${userId}/garage`}
              className={`SectionTab ${location.pathname === `/user/${userId}/garage` ? 'Active' : ''}`}
            >
              <Typography
                $variant="body-1-semibold"
                color={location.pathname === `/user/${userId}/garage` ? theme.colors.brandMain : theme.colors.defaultWeak}
              >
                Garaje
              </Typography>
            </SectionTab>
          </SectionTabs>
        </Container>
      </ProfileHeaderWrapper>
    </>
  );
};

export default ProfileHeader;

const ProfileHeaderWrapper = styled.section`
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  padding-bottom: 0px;
  width: 100%;
  max-width: 1400px;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const UserHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserDataWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.lg};
`;

const UserData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserAvatar = styled.img`
  height: 120px;
  width: 120px;
  border-radius: ${({ theme }) => theme.radius.xs};
`;

const SectionTabs = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const SectionTab = styled(Link)`
  display: flex;
  padding: 16px 0px;
  justify-content: center;
  align-items: flex-end;
  border-bottom: 4px solid transparent;
  background-color: transparent;

  &.Active {
    color: ${({ theme }) => theme.colors.brandMain};
    border-bottom: 4px solid ${({ theme }) => theme.colors.brandMain};
  }
`;
