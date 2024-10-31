import styled from 'styled-components';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from './Button/Button';

const EventManagementHeader = ({ eventDetails }) => {
  const location = useLocation();
  const { id } = useParams(); // ID del evento
  const navigate = useNavigate();

  const { title } = eventDetails;

  console.log(eventDetails)

  return (
    <>
      <HeaderWrapper>
        <Container>
          <div className='Header'>
            <Button $variant="ghost" onClick={() => navigate(-1)}><img src="/icons/chevron-left.svg" alt="Back button" />Back</Button>
            <div className='Data'>
              <h1 className='EventTitle'>{title}</h1>
              <Button $variant="outline" as={Link} to={`/events/${id}/${title}`}>Ver página del evento<img src="/icons/arrow-right-up.svg" alt="new window icon" /></Button>
            </div>
          </div>
          <SectionTabs>
            <Link
              to={`/events/manage/${id}`}
              className={`SectionTab ${location.pathname === `/events/manage/${id}` ? 'Active' : ''}`}
            >
              Resumen
            </Link>
            <Link
              to={`/events/manage/${id}/attendees`}
              className={`SectionTab ${location.pathname.includes('attendees') ? 'Active' : ''}`}
            >
              Inscritos
            </Link>
            <Link
              to={`/events/manage/${id}/registration`}
              className={`SectionTab ${location.pathname.includes('registration') ? 'Active' : ''}`}
            >
              Registro
            </Link>
            <Link
              to={`/events/manage/${id}/email`}
              className={`SectionTab ${location.pathname.includes('email') ? 'Active' : ''}`}
            >
              Email
            </Link>
            <Link
              to={`/events/manage/${id}/options`}
              className={`SectionTab ${location.pathname.includes('options') ? 'Active' : ''}`}
            >
              Opciones
            </Link>
          </SectionTabs>
        </Container>
      </HeaderWrapper>
    </>
  );
};

export default EventManagementHeader;


const HeaderWrapper = styled.section`
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  align-items: center;
  display: flex;
  flex-direction: column;

  .Header {
    display: flex;
    flex-direction: column;
    gap:8px;

    .Data {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    
      .EventTitle {
        color: ${({ theme }) => theme.colors.defaultStrong};
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: 'ss01' on;
        /* Titles/Mobile/Title 1/Bold */
        font-family: "Mona Sans";
        font-size: 28px;
        font-style: normal;
        font-weight: 700;
        line-height: 140%; /* 39.2px */
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
