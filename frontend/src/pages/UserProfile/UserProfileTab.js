import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect } from 'react';
import EventCardRow from '../../components/EventCardRow'

const UserProfileTab = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState('organizo');
  const [futureEvents, setFutureEvents] = useState([]);
  const [attendeeEvents, setAttendeeEvents] = useState([]);

  // Función para cambiar la pestaña activa
  const handleTabChange = (tab) => {
    setActiveSubTab(tab);
  };

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


        // Solicitud para obtener los eventos creados por el usuario
        const eventsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/user/myevents`, config);
        setFutureEvents(eventsResponse.data.futureEvents);
        setAttendeeEvents(eventsResponse.data.attendeeEvents);


      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) return <div>Cargando perfil...</div>;

  return (
    <Profile>
      <Container>
        <div className='Grid'>
          <div className='UserInfo'>
            <Bio>
              <h3>Bio</h3>
              <p className='Biography'>{user.description}</p>
            </Bio>
            <Vehicles className="Vehicles">
              <h3 className='BlockTitle'>Garaje</h3>
              {user.vehicles && user.vehicles.length > 0 ? (
                <ul className='VehicleList'>
                  {user.vehicles.map(vehicle => (
                    <li key={vehicle._id} className='Vehicle'>
                      <div className='VehicleContent'>
                        <img src={vehicle.image} className='VehicleImage' alt={vehicle.brand + vehicle.model} />
                        {vehicle.nickname.length > 0 ? (
                          <div className='VehicleData'>
                            <p className='Brand'>{vehicle.brand}<span className='Model'> {vehicle.model}</span></p>
                            <p className='Subtitle'>{vehicle.nickname}</p>
                            <p className='Year'>2020</p>
                          </div>
                        ) : (
                          <div className='VehicleData'>
                            <p className='Brand'>{vehicle.brand}</p>
                            <p className='Subtitle'>{vehicle.model}</p>
                            <p className='Year'>2020</p>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tienes vehículos en tu garaje.</p>
              )}
            </Vehicles>
            <Achievements className="Achievements">
              <h3>Logros</h3>
              <p>Comming soon...</p>
            </Achievements>
          </div>
          <EventsContainer>
            <div className='Header'>
              <h3 className='BlockTitle'>Eventos</h3>
              <div className="EventsTabs">
                <button
                  className={activeSubTab === 'organizo' ? 'Toogle Active' : 'Toogle'}
                  onClick={() => handleTabChange('organizo')}
                >
                  Organizo
                </button>
                <button
                  className={activeSubTab === 'asistire' ? 'Toogle Active' : 'Toogle'}
                  onClick={() => handleTabChange('asistire')}
                >
                  Asistiré
                </button>
              </div>
            </div>

            {/* Contenido de la pestaña seleccionada */}
            <div className="TabContentWrapper">
              {activeSubTab === 'organizo' && (
                <div className='TabContent'>
                  {futureEvents.length > 0 ? (
                    futureEvents.map(event => (
                      <EventCardRow key={event._id || event.id} event={event} />
                    ))
                  ) : (
                    <p>No tienes eventos futuros</p>
                  )}
                </div>
              )}

              {activeSubTab === 'asistire' && (
                <div className='TabContent'>
                  {attendeeEvents.length > 0 ? (
                    attendeeEvents.map(event => (
                      <EventCardRow key={event._id || event.id} event={event} />
                    ))
                  ) : (
                    <p>No tienes eventos como asistente</p>
                  )}
                </div>
              )}
            </div>
          </EventsContainer>
        </div>
      </Container>
    </Profile>
  )
};



export default UserProfileTab;


const Profile = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultMain};
`;

const Bio = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.md};
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
  align-self: stretch;

  .Biography {
    color: ${({ theme }) => theme.colors.defaultWeak};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;
    font-family: "Mona Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 19.6px */
  }
`;

const Vehicles = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.md};
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
  align-self: stretch;
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};

  .BlockTitle {
    color: var(--text-icon-default-main, #292929);
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Titles/Desktop/Title 4/Semibold */
    font-family: "Mona Sans";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 28px */
  }

  .VehicleList {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;

    .Vehicle {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-right: 16px;

      .VehicleContent {
        display: flex;
        align-items: center;
        gap: 16px;
        align-self: stretch;

        .VehicleData {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .Brand {
            color: var(--text-icon-default-main, #292929);
            font-variant-numeric: lining-nums tabular-nums;
            font-feature-settings: 'ss01' on;

            /* Body/Body 2/Semibold */
            font-family: "Mona Sans";
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: 140%; /* 19.6px */
          }

          .Model {
            color: var(--text-icon-default-weak, #656565);
            font-variant-numeric: lining-nums tabular-nums;
            font-feature-settings: 'ss01' on;

            /* Body/Body 3/Medium */
            font-family: "Mona Sans";
            font-size: 13px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%; /* 19.5px */
          }

          .Subtitle {
            color: var(--text-icon-default-main, #292929);
            font-variant-numeric: lining-nums tabular-nums;
            font-feature-settings: 'ss01' on;

            /* Body/Body 1/Semibold */
            font-family: "Mona Sans";
            font-size: 16px;
            font-style: normal;
            font-weight: 600;
            line-height: 150%; /* 24px */
          }
          .Year {
            color: var(--text-icon-default-weak, #656565);
            font-variant-numeric: lining-nums tabular-nums;
            font-feature-settings: 'ss01' on;

            /* Body/Body 3/Medium */
            font-family: "Mona Sans";
            font-size: 13px;
            font-style: normal;
            font-weight: 500;
            line-height: 150%; /* 19.5px */
          }
        }

        .VehicleImage {
          width: 56px;
          height: 56px;
          border-radius: ${({ theme }) => theme.radius.xs}; 
        }
      }
    }
  }
`;

const Achievements = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.md};
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.md};
  align-self: stretch;
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
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
    // .EventsInfo {
    //   grid-area: 1 / 5 / 2 / 13;
    // }
  }
`;

const EventsContainer = styled.div`
  grid-area: 1 / 5 / 2 / 13;

  .Header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .BlockTitle {
      color: var(--text-icon-default-main, #292929);
      font-variant-numeric: lining-nums tabular-nums;
      font-feature-settings: 'ss01' on;
      font-family: "Mona Sans";
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 33.6px */
    }

    .EventsTabs {
      display: flex;
      padding: var(--Spacing-xxs, 4px);
      align-items: flex-start;
      gap: var(--Spacing-xs, 8px);
      border-radius: var(--Spacing-md, 24px);
      background: var(--bg-default-weak, #EFEFEF);

      .Toogle {
        display: flex;
        padding: var(--Spacing-xs, 8px) var(--Spacing-sm, 16px);
        justify-content: center;
        align-items: center;
        border-radius: var(--Spacing-lg, 32px);
        border: 0px;
        color: var(--text-icon-default-weak, #656565);
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        font-family: "Mona Sans";
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%; /* 24px */
      }

      .Active {
        border-radius: var(--Spacing-lg, 32px);
        background: var(--bg-default-main, #FFF);
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08), 0px 4px 12px 0px rgba(0, 0, 0, 0.04);
        color: var(--text-icon-default-main, #292929);
      }
    }
  }

  .TabContentWrapper {
    padding-top: 32px;

    .TabContent {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
`;