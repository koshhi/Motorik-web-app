import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import EventCardHorizontal from '../../components/EventCardHorizontal';
// import { useAuth } from '../../context/AuthContext';
import { useEventContext } from '../../context/EventContext';
import { useNavigate } from 'react-router-dom';
import Typography from '../../components/Typography';
import Button from '../../components/Button/Button';
import { theme } from '../../theme';

const MyEventsEnrolled = () => {
  const { myEvents } = useEventContext();
  const [activeSubTab, setActiveSubTab] = useState('upcoming');
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  // Usamos la parte "enrolled" del contexto
  const { enrolled } = myEvents || { enrolled: { upcoming: [], past: [] } };

  return (
    <MyEventsEnrolledSection>
      <Container>
        <SectionHeader>
          <HeaderBlock>
            <Typography as="h1" $variant="title-3-semibold">
              Tus eventos inscritos
            </Typography>
            <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
              Estos son los eventos en los que te has inscrito.
            </Typography>
          </HeaderBlock>
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
          <div>
            {enrolled.upcoming && enrolled.upcoming.length > 0 ? (
              enrolled.upcoming.map((event) => (
                <EventCardHorizontal key={event.id} event={event} />
              ))
            ) : (
              <EmptyState>
                <EmptyStateHeader>
                  <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>
                    No tienes eventos que mostrar.
                  </Typography>
                  <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
                    Cuando te inscribas en un evento aparecerá aquí.
                  </Typography>
                </EmptyStateHeader>
                <Button onClick={handleCreateEvent}>
                  <img src="/icons/add-white.svg" alt="Crear evento" />
                  Crear Evento
                </Button>
              </EmptyState>
            )}
          </div>
        )}
        {activeSubTab === 'past' && (
          <div>
            {enrolled.past && enrolled.past.length > 0 ? (
              enrolled.past.map((event) => (
                <EventCardHorizontal key={event.id} event={event} />
              ))
            ) : (
              <EmptyState>
                <EmptyStateHeader>
                  <Typography as="p" $variant="title-4-semibold" color={theme.colors.defaultMain}>
                    No tienes eventos que mostrar.
                  </Typography>
                  <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
                    Cuando te inscribas en un evento aparecerá aquí.
                  </Typography>
                </EmptyStateHeader>
                <Button onClick={handleCreateEvent}>
                  <img src="/icons/add-white.svg" alt="Crear evento" />
                  Crear Evento
                </Button>
              </EmptyState>
            )}
          </div>
        )}
      </Container>
    </MyEventsEnrolledSection>

  );
};

export default MyEventsEnrolled;

const MyEventsEnrolledSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.fill.defaultMain};
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

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding:  ${({ theme }) => theme.sizing.md};
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