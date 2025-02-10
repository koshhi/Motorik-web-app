import React from 'react';
import styled from 'styled-components';
import Typography from '../../components/Typography';

const MyEventsSettings = () => {
  return (
    <>
      <MyEventsSettingsSection>
        <Container>
          <SectionTitle>
            <Typography as="h1" $variant="title-3-semibold">Configuración de mis eventos</Typography>
          </SectionTitle>
        </Container>
      </MyEventsSettingsSection>
    </>
  );
};

export default MyEventsSettings;

const MyEventsSettingsSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
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

const SectionTitle = styled.div`
`;