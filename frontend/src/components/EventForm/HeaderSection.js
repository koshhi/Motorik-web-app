// src/components/EventForm/HeaderSection.js
import React from 'react';
import styled from 'styled-components';
import Typography from '../../components/Typography';
import InputText from '../../components/Input/InputText';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

const HeaderSection = ({ title, onTitleChange, error, user }) => {
  const { t } = useTranslation('createEvent');
  return (
    <HeaderSectionWrapper>
      <Container>
        <HeaderWrapper>
          <TitleInputBlock>
            <EventTitle
              name="title"
              value={title}
              onChange={onTitleChange}
              placeholder={t('eventForm.eventTitle.titlePlaceholder')}
              $variant={error ? 'error' : ''}
              required
            />

            {error &&
              <Typography as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
                {error}
              </Typography>
            }
          </TitleInputBlock>
          {user && (
            <EventOrganizer>
              <UserAvatar src={user.userAvatar} alt="User Avatar" />
              <UserData>
                <Typography $variant="caption-medium" color={theme.colors.defaultWeak}>
                  {t('eventForm.eventTitle.organizedBy')}
                </Typography>
                <Typography $variant="body-2-medium">
                  {user.name} {user.lastName}
                </Typography>
              </UserData>
            </EventOrganizer>
          )}
        </HeaderWrapper>
      </Container>
    </HeaderSectionWrapper>

  );
};

export default HeaderSection;

const HeaderSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: ${({ theme }) => theme.fill.defaultSubtle};
  padding-top: 74px;
`;

const TitleInputBlock = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xxs};
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px ${({ theme }) => theme.sizing.md};
  max-width: 1400px;
  width: 100%;
`;

const HeaderWrapper = styled.div`
  padding: ${({ theme }) => theme.sizing.lg} 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const EventTitle = styled(InputText)`
  width: 100%;
  padding: 0px;
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 1px solid transparent;
  background: none;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'ss01' on;

  /* Titles/Mobile/Title 1/Bold */
  font-family: "Mona Sans";
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 39.2px */

  &::placeholder {
    color: ${({ theme }) => theme.colors.defaultSubtle};
  }
`;

const UserData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const EventOrganizer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const UserAvatar = styled.img`
  border-radius: ${({ theme }) => theme.sizing.xs};
  height: ${({ theme }) => theme.sizing.xl};
  width: ${({ theme }) => theme.sizing.xl};
`;
