import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import EventCardHorizontal from '../../components/EventCardHorizontal';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';



const MyEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('upcoming');
  const authToken = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAuthenticated = !!user && !!authToken;


  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!authToken) {
        console.error('Error: El token de autenticación no está presente.');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/my-events`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Verificar la estructura de la respuesta
        if (response.data && response.data.success) {
          setUpcomingEvents(response.data.futureEvents || []);
          setPastEvents(response.data.attendeeEvents || []);
        } else {
          console.error('Error al obtener los eventos:', response.data.message || 'Estructura de datos inesperada.');
        }
      } catch (error) {
        console.error('Error fetching my events:', error);
      } finally {
        setLoading(false); // Dejar de cargar cuando se complete la solicitud
      }
    };

    fetchMyEvents();
  }, [authToken]);

  const handleTabChange = (tab) => setActiveSubTab(tab);

  const handleCreateEvent = () => {
    if (isAuthenticated) {
      navigate('/create-event'); // Redirigir a la página de creación de eventos si está autenticado
    } else {
      navigate('/login', { state: { message: 'You need to log in to create an event.' } }); // Redirigir al login si no está autenticado
    }
  };


  return (
    <>
      <MyEventsList>
        <Container>
          <div className='Header'>
            <div className='HeaderInner'>
              <h2 className='SectionTitle'>Eventos organizados</h2>
              <Button className="AddEventButton" $variant="outline" onClick={handleCreateEvent}>
                <img src='/icons/add.svg' alt='Añadir evento' />
              </Button>
            </div>
            <Tabs>
              <button
                className={activeSubTab === 'upcoming' ? 'Toogle Active' : 'Toogle'}
                onClick={() => handleTabChange('upcoming')}
              >
                Próximos
              </button>
              <button
                className={activeSubTab === 'past' ? 'Toogle Active' : 'Toogle'}
                onClick={() => handleTabChange('past')}
              >
                Pasados
              </button>
            </Tabs>
          </div>

          {activeSubTab === 'upcoming' && (
            <MyFutureEvents>
              {loading ? (
                <p>Cargando eventos...</p>
              ) : upcomingEvents.length > 0 ? (
                <div className='List'>
                  {upcomingEvents.map((event) => (
                    <EventCardHorizontal key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <p>No hay eventos proximos.</p>
              )}
            </MyFutureEvents>
          )}

          {activeSubTab === 'past' && (
            <MyPastEvents>
              {loading ? (
                <p>Cargando eventos...</p>
              ) : pastEvents.length > 0 ? (
                <div className='List'>
                  {pastEvents.map((event) => (
                    <EventCardHorizontal key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <p>No hay eventos pasados.</p>
              )}
            </MyPastEvents>
          )}
        </Container>
      </MyEventsList>
    </>
  );
};

export default MyEvents;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.sizing.sm} ${({ theme }) => theme.sizing.md};
  padding-bottom: 0px;
  width: 100%;
  max-width: 1400px;
  gap: ${({ theme }) => theme.sizing.md};
`;


const MyEventsList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;

    .Header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .HeaderInner {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
      }

      .AddEventButton {
        border-radius: 40px;
        padding: 4px;
      }
    }
`;
const MyFutureEvents = styled.div`

  .SectionTitle {
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Titles/Desktop/Title 3/Semibold */
    font-family: "Mona Sans";
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 33.6px */

    padding-bottom: 24px;
  }
  .List {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

`;
const MyPastEvents = styled.div`
  .List {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const Tabs = styled.div`
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
`;