import styled from 'styled-components';
import axiosClient from '../../api/axiosClient';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button/Button';
import EventCardRow from '../../components/EventCardRow'
import useUserEvents from '../../hooks/useUserEvents';
import useUserProfile from '../../hooks/useUserProfile';
import Typography from '../../components/Typography';
import { theme } from '../../theme';
import { getPlatform, getIcon } from '../../utils/socialMediaUtils';

const UserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate();
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
          <Grid>
            <UserInfo>
              <Bio>
                <Typography $variant="title-4-semibold" as="h3">Bio</Typography>
                {!profileUser.description ? (
                  isOwnProfile ? (
                    <EmptyStateWrapper>
                      <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>
                        Añade una biografía para que otros miembros de la comunidad te conozcan mejor.
                      </Typography>
                      <Button
                        $variant="outline"
                        onClick={() => navigate(`/user/${userId}/edit-profile`, { state: { returnTo: `/user/${userId}` } })}
                      >
                        Editar perfil
                      </Button>
                    </EmptyStateWrapper>
                  ) : (
                    <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>
                      Este usuario no tiene Bio
                    </Typography>
                  )
                ) : (
                  <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>
                    {profileUser.description}
                  </Typography>
                )}
                {profileUser.socialMediaLinks && profileUser.socialMediaLinks.length > 0 && (
                  <SocialMediaList>
                    {profileUser.socialMediaLinks.map((socialMediaLink, index) => {
                      const platform = getPlatform(socialMediaLink.url);
                      const icon = getIcon(platform);

                      return (
                        <SocialMediaItem key={index}>
                          <IconLink href={socialMediaLink.url} target='_blank' rel='noreferrer'>
                            <img src={icon} alt={platform} />
                          </IconLink>
                        </SocialMediaItem>
                      );
                    })}
                  </SocialMediaList>
                )}
              </Bio>
              {/* <Bio>
                <Typography $variant="title-4-semibold" as="h3">Bio</Typography>
                <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>{profileUser.description}</Typography>
                {
                  profileUser.socialMediaLinks && profileUser.socialMediaLinks.length > 0 && (
                    <SocialMediaList>
                      {profileUser.socialMediaLinks.map((socialMediaLink, index) => {
                        const platform = getPlatform(socialMediaLink.url);
                        const icon = getIcon(platform);

                        return (
                          <SocialMediaItem key={index}>
                            <IconLink href={socialMediaLink.url} target='_blank' rel='noreferrer'>
                              <img src={icon} alt={platform} />
                            </IconLink>
                          </SocialMediaItem>
                        );
                      })}
                    </SocialMediaList>
                  )
                }
              </Bio> */}
              {/* <Vehicles>
                <Typography $variant="title-4-semibold" as="h3">Garaje</Typography>
                {profileUser.vehicles && profileUser.vehicles.length > 0 ? (
                  <VehicleList>
                    {profileUser.vehicles.map(vehicle => (
                      <Vehicle key={vehicle.id} >
                        <VehicleContent>
                          <VehicleImage src={vehicle.image} alt={vehicle.brand + vehicle.model} />
                          <VehicleData>
                            {vehicle.nickname ? (
                              <>
                                <Typography $variant="body-1-medium" color={theme.colors.defaultMain}>
                                  {vehicle?.brand}
                                  <Typography as="span" color={theme.colors.defaultStrong} style={{ marginLeft: '4px' }}>
                                    {vehicle?.model}
                                  </Typography>
                                </Typography>
                                <Typography $variant="title-5-semibold" color={theme.colors.defaultMain}>{vehicle.nickname}</Typography>
                                <Typography $variant="body-3-medium" color={theme.colors.defaultStrong}>{vehicle.year}</Typography>
                              </>
                            ) : (
                              <>
                                <Typography $variant="body-1-medium" color={theme.colors.defaultMain}>
                                  {vehicle?.brand}
                                </Typography>
                                <Typography $variant="title-5-semibold" color={theme.colors.defaultMain}>{vehicle.model}</Typography>
                                <Typography $variant="body-3-medium" color={theme.colors.defaultStrong}>{vehicle.year}</Typography>
                              </>
                            )}
                          </VehicleData>

                        </VehicleContent>
                      </Vehicle>
                    ))}
                  </VehicleList>
                ) : (
                  <Typography $variant="body-1-regular" color={theme.colors.defaultWeak}>
                    {isOwnProfile ? 'No tienes vehículos' : `Sin Vehículos`}
                  </Typography>
                )}
              </Vehicles> */}
              <Vehicles>
                <Typography $variant="title-4-semibold" as="h3">Garaje</Typography>
                {profileUser.vehicles && profileUser.vehicles.length > 0 ? (
                  <VehicleList>
                    {profileUser.vehicles.map(vehicle => (
                      <Vehicle key={vehicle.id}>
                        <VehicleContent>
                          <VehicleImage src={vehicle.image} alt={vehicle.brand + ' ' + vehicle.model} />
                          <VehicleData>
                            {vehicle.nickname ? (
                              <>
                                <Typography $variant="body-1-medium" color={theme.colors.defaultMain}>
                                  {vehicle?.brand}
                                  <Typography as="span" color={theme.colors.defaultStrong} style={{ marginLeft: '4px' }}>
                                    {vehicle?.model}
                                  </Typography>
                                </Typography>
                                <Typography $variant="title-5-semibold" color={theme.colors.defaultMain}>
                                  {vehicle.nickname}
                                </Typography>
                                <Typography $variant="body-3-medium" color={theme.colors.defaultStrong}>
                                  {vehicle.year}
                                </Typography>
                              </>
                            ) : (
                              <>
                                <Typography $variant="body-1-medium" color={theme.colors.defaultMain}>
                                  {vehicle?.brand}
                                </Typography>
                                <Typography $variant="title-5-semibold" color={theme.colors.defaultMain}>
                                  {vehicle.model}
                                </Typography>
                                <Typography $variant="body-3-medium" color={theme.colors.defaultStrong}>
                                  {vehicle.year}
                                </Typography>
                              </>
                            )}
                          </VehicleData>
                        </VehicleContent>
                      </Vehicle>
                    ))}
                  </VehicleList>
                ) : (
                  // Empty state para vehículos: Si es el propio perfil, mostrar botón para añadir vehículo
                  isOwnProfile ? (
                    <EmptyStateWrapper>
                      <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>
                        Añade tus vehiculos a tu garaje y haz gala de ellos. Al inscribirte en un evento podrás elegir con cuál asistir.
                      </Typography>
                      <Button $variant="outline" onClick={() => navigate(`/user/${userId}/garage`)}>
                        Añadir vehículo
                      </Button>
                    </EmptyStateWrapper>
                  ) : (
                    <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>
                      Sin Vehículos
                    </Typography>
                  )
                )}
              </Vehicles>

              <Achievements>
                <Typography $variant="title-4-semibold" as="h3">Logros</Typography>
                <Typography $variant="body-2-regular" color={theme.colors.defaultWeak}>Proximamente...</Typography>
              </Achievements>
            </UserInfo>
            <EventsContainer>
              <HeaderBlock>
                <Typography $variant="title-3-semibold" as="h3">Eventos</Typography>
                <EventsTabs>
                  <Toogle
                    className={activeSubTab === 'organized' ? 'Active' : ''}
                    onClick={() => handleTabChange('organized')}
                  >
                    Organizados
                  </Toogle>
                  <Toogle
                    className={activeSubTab === 'attendee' ? 'Active' : ''}
                    onClick={() => handleTabChange('attendee')}
                  >
                    {isOwnProfile ? 'Asistiré' : `Asistirá`}
                  </Toogle>
                </EventsTabs>
              </HeaderBlock>

              {/* Contenido de la pestaña seleccionada */}
              <TabContentWrapper>
                {activeSubTab === 'organized' && (
                  <TabContent>
                    {futureEvents.length > 0 ? (
                      futureEvents.map(event => (
                        <EventCardRow key={event.id} event={event} />
                      ))
                    ) : (
                      // Empty state para eventos organizados
                      isOwnProfile ? (
                        <EmptyState>
                          <EmptyStateHeader>
                            <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>
                              No tienes eventos que mostrar.
                            </Typography>
                            <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
                              Cuando crees un evento aparecerá aquí.
                            </Typography>
                          </EmptyStateHeader>
                          <Button onClick={() => navigate('/create-event')}>
                            <img src="/icons/add-white.svg" alt="Crear evento" />
                            Crear Evento
                          </Button>
                        </EmptyState>
                      ) : (
                        <Typography $variant="body-1-regular" color={theme.colors.defaultWeak}>
                          Aún no ha creado ningún evento
                        </Typography>
                      )
                    )}
                  </TabContent>
                )}

                {activeSubTab === 'attendee' && (
                  <TabContent>
                    {attendeeEvents.length > 0 ? (
                      attendeeEvents.map(event => (
                        <EventCardRow key={event.id || event.id} event={event} />
                      ))
                    ) : (
                      // Empty state para eventos organizados
                      isOwnProfile ? (
                        <EmptyState>
                          <EmptyStateHeader>
                            <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>
                              Aún no estás inscrito en ningún evento
                            </Typography>
                            <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
                              Cuando te inscribas en un evento aparecerá aquí.
                            </Typography>
                          </EmptyStateHeader>
                          <Button onClick={() => navigate('/')}>
                            <img src='/icons/find-plan.svg' alt="Encuentra plan" />
                            Encuentra plan
                          </Button>
                        </EmptyState>
                      ) : (
                        <EmptyState>
                          <EmptyStateHeader>
                            <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>
                              Aún no se ha inscrito en ningún evento
                            </Typography>
                          </EmptyStateHeader>
                        </EmptyState>
                        // <Typography $variant="body-1-regular" color={theme.colors.defaultWeak}>
                        //   Aún no se ha inscrito en ningún evento
                        // </Typography>
                      )
                    )}

                    {/* original
                    {attendeeEvents.length > 0 ? (
                      attendeeEvents.map(event => (
                        <EventCardRow key={event.id || event.id} event={event} />
                      ))
                    ) : (
                      <Typography $variant="body-1-regular" color={theme.colors.defaultWeak}>
                        {isOwnProfile ? 'Aún no estás inscrito en ningún evento' : `Aún no se ha inscrito en ningún evento`}
                      </Typography>
                    )} */}
                  </TabContent>
                )}
              </TabContentWrapper>
            </EventsContainer>
          </Grid>
        </Container>
      </Profile>
    </>
  );
};

export default UserProfile;

const Profile = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultMain};
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: ${({ theme }) => theme.sizing.lg};
  grid-row-gap: 0px;
`;

const UserInfo = styled.div`
  grid-area: 1 / 1 / 2 / 5;
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
`;

const UserInfoBlock = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};
  padding-top: 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
  align-self: stretch;
`;

const Bio = styled(UserInfoBlock)`
`;

const SocialMediaList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top:  ${({ theme }) => theme.sizing.xs};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const SocialMediaItem = styled.li`
`;

const IconLink = styled.a`
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.6;
  }
`;

const Vehicles = styled(UserInfoBlock)`
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
`;

const VehicleList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  padding-top: ${({ theme }) => theme.sizing.xxs};
`;

const Vehicle = styled.li`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: ${({ theme }) => theme.sizing.sm};
`;

const VehicleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`;

const VehicleImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radius.xxs};
  object-fit: cover;
`;

const VehicleData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const Achievements = styled(UserInfoBlock)`
  border-top: 1px solid ${({ theme }) => theme.border.defaultSubtle};
`;

const EventsContainer = styled.div`
  grid-area: 1 / 5 / 2 / 13;
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const EventsTabs = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.xxs};
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.fill.defaultWeak};
`;

const Toogle = styled.button`
  display: flex;
  padding: ${({ theme }) => theme.sizing.xs} ${({ theme }) => theme.sizing.sm};
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: none;
  color: ${({ theme }) => theme.colors.defaultWeak};
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;
  font-family: "Mona Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.fill.defaultSubtle};
  }

  &.Active {
    border-radius: var(--Spacing-lg, 32px);
    background: ${({ theme }) => theme.fill.defaultMain};
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08), 0px 4px 12px 0px rgba(0, 0, 0, 0.04);
    color: ${({ theme }) => theme.colors.defaultStrong};
  }
`;

const TabContentWrapper = styled.div`
  padding-top: ${({ theme }) => theme.sizing.md};
`;

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.md};
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

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const EmptyState = styled.div`
  display: flex;
  padding: 80px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--Spacing-sm, 16px);
  align-self: stretch;
  border-radius: 16px;
  border: 2px dashed ${({ theme }) => theme.border.defaultWeak};
`;

const EmptyStateHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xxs};
`;