import React, { useState } from 'react';
import styled from 'styled-components';
import EventCardHorizontal from '../../components/EventCardHorizontal';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '../../components/Typography';
import { useEventContext } from '../../context/EventContext';
import { theme } from '../../theme';

const MyEventsOrganized = () => {
  // Obtenemos los eventos organizados del contexto
  const { myEvents } = useEventContext();
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  // Usamos la parte “organized” del contexto
  const { organized } = myEvents || { organized: { upcoming: [], past: [] } };

  // Para manejar la pestaña activa puedes seguir con estado local:
  const [activeSubTab, setActiveSubTab] = useState('upcoming');

  return (
    <>
      <MyEventsList>
        <Container>
          <SectionHeader>
            <HeaderInner>
              <HeaderBlock>
                <Typography as="h1" $variant="title-3-semibold">Tus eventos organizados</Typography>
                <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>Estos son los eventos que creaste.</Typography>
              </HeaderBlock>
              <AddEventButton $variant="outline" onClick={handleCreateEvent}>
                <img src='/icons/add.svg' alt='Añadir evento' />
              </AddEventButton>
            </HeaderInner>
            <Tabs>
              <ButttonTab
                $variant="defaultInverse"
                className={activeSubTab === 'upcoming' ? 'Active' : ''}
                onClick={() => setActiveSubTab('upcoming')}
              >
                Próximos
              </ButttonTab>
              <ButttonTab
                $variant="defaultInverse"
                className={activeSubTab === 'past' ? 'Active' : ''}
                onClick={() => setActiveSubTab('past')}
              >
                Pasados
              </ButttonTab>
            </Tabs>
          </SectionHeader>
          {activeSubTab === 'upcoming' && (
            <MyFutureEvents>
              {organized.upcoming && organized.upcoming.length > 0 ? (
                <div className='List'>
                  {organized.upcoming.map((event) => (
                    <EventCardHorizontal key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <EmptyState>
                  <EmptyStateHeader>
                    <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>
                      No tienes eventos que mostrar.
                    </Typography>
                    <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
                      Cuando crees un evento aparecerá aquí.
                    </Typography>
                  </EmptyStateHeader>
                  <Button onClick={handleCreateEvent}>
                    <img src="/icons/add-white.svg" alt="Crear evento" />
                    Crear Evento
                  </Button>
                </EmptyState>
              )}

            </MyFutureEvents>
          )}

          {activeSubTab === 'past' && (
            <MyPastEvents>
              {organized.past && organized.past.length > 0 ? (
                <div className='List'>
                  {organized.past.map((event) => (
                    <EventCardHorizontal key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <EmptyState>
                  <EmptyStateHeader>
                    <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>
                      No tienes eventos que mostrar.
                    </Typography>
                    <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
                      Cuando crees un evento aparecerá aquí.
                    </Typography>
                  </EmptyStateHeader>
                  <Button onClick={handleCreateEvent}>
                    <img src="/icons/add-white.svg" alt="Crear evento" />
                    Crear Evento
                  </Button>
                </EmptyState>
              )}

            </MyPastEvents>
          )}
        </Container>
      </MyEventsList>
    </>
  );
};

export default MyEventsOrganized;

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding:  ${({ theme }) => theme.sizing.md};
  // padding-bottom: 0px;
  width: 100%;
  max-width: 1400px;
  gap: ${({ theme }) => theme.sizing.md};
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const AddEventButton = styled(Button)`
  border-radius: 40px;
  padding: 4px;
`;

const Tabs = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.xxs};
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.fill.defaultWeak};
`;

const ButttonTab = styled(Button)`
  border-radius: ${({ theme }) => theme.radius.xl};
  background-color: transparent;
  transition: all 0.3s ease-in-out;
  color: ${({ theme }) => theme.colors.defaultWeak};

  &.Active {
    background-color: ${({ theme }) => theme.fill.defaultMain};
    color: ${({ theme }) => theme.colors.defaultMain};
    box-shadow: 0px 0px 4px rgba(0,0,0,0.08), 0px 4px 12px rgba(0,0,0,0.04);
  }
`;

const MyEventsList = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
  align-items: center;
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




