import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import Typography from './Typography';

const MyEventsHeader = () => {
  const location = useLocation();

  return (
    <MyEventsHeaderWrapper>
      <Container>
        <Typography as="h1" $variant="title-4-semibold">Mis eventos</Typography>
        <SectionTabs>
          <Link to="/my-events" className={`SectionTab ${location.pathname === '/my-events' ? 'Active' : ''}`}>
            Eventos organizados
          </Link>
          <Link to="/my-events/enrolled" className={`SectionTab ${location.pathname === '/my-events/enrolled' ? 'Active' : ''}`}>
            Eventos Inscritos
          </Link>
          <Link to="/my-events/people" className={`SectionTab ${location.pathname === '/my-events/people' ? 'Active' : ''}`}>
            Gente
          </Link>
          <Link to="/my-events/settings" className={`SectionTab ${location.pathname === '/my-events/settings' ? 'Active' : ''}`}>
            Configuración
          </Link>
        </SectionTabs>
      </Container>
    </MyEventsHeaderWrapper>
  );
};

export default MyEventsHeader;

const MyEventsHeaderWrapper = styled.section`
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  align-items: center;
  display:flex;
  flex-direction: column;

  .Heading h1 {
    color: ${({ theme }) => theme.colors.defaultStrong};
    font-variant-numeric: lining-nums tabular-nums;
    font-feature-settings: 'ss01' on;

    /* Titles/Desktop/Title 2/Semibold */
    font-family: "Mona Sans";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 39.2px */
  }  

  .Tabs {
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