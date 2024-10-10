import styled from 'styled-components';
import axiosClient from '../../api/axiosClient';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import EventCardRow from '../../components/EventCardRow'
import useUserEvents from '../../hooks/useUserEvents';
import useUserProfile from '../../hooks/useUserProfile';




const UserProfile = () => {
  const { userId } = useParams()
  const { user, refreshUserData } = useAuth();
  const { profileUser, loadingProfile, errorProfile } = useUserProfile(userId);
  const { futureEvents, attendeeEvents, loadingEvents, errorEvents } = useUserEvents(userId);
  const [activeSubTab, setActiveSubTab] = useState('organized')


  const handleTabChange = (tab) => setActiveSubTab(tab);

  const isOwnProfile = user && user.id === userId;

  if (loadingProfile || loadingEvents) {
    return <LoadingContainer>Cargando perfil y eventos...</LoadingContainer>;
  }

  if (errorProfile) {
    return <ErrorContainer>{errorProfile}</ErrorContainer>;
  }

  if (errorEvents) {
    return <ErrorContainer>{errorEvents}</ErrorContainer>;
  }

  return (
    <>
      <Profile>
        <Container>
          <div className='Grid'>
            <div className='UserInfo'>
              <Bio>
                <h3>Bio</h3>
                <p className='Biography'>{profileUser.description}</p>
                {profileUser.socialMediaLinks && profileUser.socialMediaLinks.length > 0 ? (
                  <SocialMediaList>
                    {profileUser.socialMediaLinks.map((socialMediaLink, index) => (
                      <SocialMediaItem key={index}>
                        <a href={socialMediaLink.url} target='_blank' rel='noreferrer'>
                          {socialMediaLink.platform}
                        </a>
                      </SocialMediaItem>
                    ))}
                  </SocialMediaList>
                ) : (
                  <p>No tienes enlaces de redes sociales.</p>
                )}
              </Bio>
              <Vehicles className="Vehicles">
                <h3 className='BlockTitle'>Garaje</h3>
                {profileUser.vehicles && profileUser.vehicles.length > 0 ? (
                  <ul className='VehicleList'>
                    {profileUser.vehicles.map(vehicle => (
                      <li key={vehicle.id} className='Vehicle'>
                        <div className='VehicleContent'>
                          <img src={vehicle.image} className='VehicleImage' alt={vehicle.brand + vehicle.model} />
                          <div className='VehicleData'>
                            <p className='Brand'>{vehicle.brand}<span className='Model'> {vehicle.model}</span></p>
                            <p className='Subtitle'>{vehicle.nickname || vehicle.model}</p>
                            <p className='Year'>{vehicle.year}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No tienes vehículos.</p>
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
                    className={activeSubTab === 'organized' ? 'Toogle Active' : 'Toogle'}
                    onClick={() => handleTabChange('organized')}
                  >
                    Organizados
                  </button>
                  <button
                    className={activeSubTab === 'attendee' ? 'Toogle Active' : 'Toogle'}
                    onClick={() => handleTabChange('attendee')}
                  >
                    {isOwnProfile ? 'Asistiré' : `Asistirá`}
                  </button>
                </div>
              </div>

              {/* Contenido de la pestaña seleccionada */}
              <div className="TabContentWrapper">
                {activeSubTab === 'organized' && (
                  <div className='TabContent'>
                    {futureEvents.length > 0 ? (
                      futureEvents.map(event => (
                        <EventCardRow key={event.id || event.id} event={event} />
                      ))
                    ) : (
                      <p>No tienes eventos futuros</p>
                    )}
                  </div>
                )}

                {activeSubTab === 'attendee' && (
                  <div className='TabContent'>
                    {attendeeEvents.length > 0 ? (
                      attendeeEvents.map(event => (
                        <EventCardRow key={event.id || event.id} event={event} />
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
    </>
  );
};

export default UserProfile;


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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ErrorContainer = styled.div`
  color: red;
  text-align: center;
  margin-top: 20px;
`;

const SocialMediaList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const SocialMediaItem = styled.li`
  margin-bottom: 5px;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;