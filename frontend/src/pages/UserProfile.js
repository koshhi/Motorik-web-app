import axios from 'axios';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard'
import MainNavbar from '../components/Navbar/MainNavbar'
import Button from '../components/Button/Button';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [futureEvents, setFutureEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [attendeeEvents, setAttendeeEvents] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Obtener el token desde el almacenamiento local
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error('Token no encontrado');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Solicitud para obtener el perfil del usuario
        const response = await axios.get('http://localhost:5002/api/users/profile', config);
        setUserProfile(response.data.user);

        // Solicitud para obtener los eventos creados por el usuario
        const eventsResponse = await axios.get('http://localhost:5002/api/events/user/myevents', config);
        setFutureEvents(eventsResponse.data.futureEvents);
        setPastEvents(eventsResponse.data.pastEvents);
        setAttendeeEvents(eventsResponse.data.attendeeEvents);


      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!userProfile) return <div>Cargando perfil...</div>;

  return (
    <>
      <MainNavbar />
      <ProfileHeader>
        <Container>
          <div className='UserHeader'>
            <div className='UserData'>
              <img className='Avatar' src={userProfile.userAvatar} alt='user avatar' />
              <div className='Data'>
                <h1>{userProfile.name} {userProfile.lastName}</h1>
                <p>Sevilla, España </p>
              </div>
            </div>
            <Button size="small" variant="outline">Editar perfil</Button>
          </div>
          <div className='Tabs'>
            Tabs
          </div>
        </Container>
      </ProfileHeader>
      <ProfileBody>
        <Container>
          <div className='Grid'>
            <div className='UserInfo'>
              <div className="Bio">
                <h3>Bio</h3>
                <p>{user.description}</p>


                {/* <p>{userProfile.description}</p> */}
              </div>
              <div className="Vehicles">
                <h3>Garaje</h3>
                <p>Listado de vehiculos</p>
              </div>
              <div className="Achievements">
                <h3>Logros</h3>
                <p>Listado de vehiculos</p>
              </div>
            </div>
            <div className='EventsInfo'>
              <h3>Eventos</h3>
              <div>
                <h4>Eventos futuros</h4>
                {futureEvents.length > 0 ? (
                  futureEvents.map(event => (
                    <EventCard key={event._id || event.id} event={event} />
                  ))
                ) : <p>No tienes eventos futuros</p>}
              </div>
              <div>
                <h4>Eventos pasados</h4>
                {pastEvents.length > 0 ? (
                  pastEvents.map(event => (
                    <EventCard key={event._id || event.id} event={event} />
                  ))
                ) : <p>No tienes eventos pasados</p>}
              </div>
              <div>
                <h4>Eventos como asistente</h4>
                {attendeeEvents.length > 0 ? (
                  attendeeEvents.map(event => (
                    <EventCard key={event._id || event.id} event={event} />
                  ))
                ) : <p>No tienes eventos como asistente</p>}
              </div>
              <div>
                Listado de eventos creador
                {/* Renderiza los eventos creados por el usuario usuario */}
              </div>
              <div>
                Listado de eventos creador
                {/* Renderizar los eventos creados en los el usuario es attendee */}
              </div>
            </div>
          </div>
        </Container>
      </ProfileBody>
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
      
      .Achievements,
      .Bio,
      .Vehicles {
        display: flex;
        padding: ${({ theme }) => theme.sizing.md};
        flex-direction: column;
        align-items: flex-start;
        gap: ${({ theme }) => theme.sizing.md};
        align-self: stretch;
      }

      .Bio {}

      .Vehicles {
        border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
      }

      .Achievements {
        border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
      }


    }
    .EventsInfo {
      grid-area: 1 / 5 / 2 / 13;
    }
  }
`;

const ProfileBody = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultMain};
`;