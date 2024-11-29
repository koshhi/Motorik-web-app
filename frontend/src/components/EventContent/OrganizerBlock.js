// components/EventContent/OrganizerBlock.js

import React from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import Typography from '../Typography';
import { theme } from '../../theme';
import { getIcon } from '../../utils/socialMediaUtils';

const OrganizerBlock = ({ organizer }) => {

  if (!organizer) {
    return null; // O puedes mostrar un mensaje de carga o placeholder
  }

  return (
    <OrganizerContainer>
      <Typography $variant="title-4-semibold" as='p'>Sobre el organizador</Typography>
      <OrganizerCard>
        <OrganizerHeader>
          <OrganizerInfo>
            <OrganizerAvatar src={organizer.userAvatar} alt="Organizador" />
            <OrganizerData>
              <Typography $variant='body-1-semibold' as='p'>{organizer.name} {organizer.lastName}</Typography>
              <Typography $variant='caption-medium' as='p' color={theme.colors.defaultWeak}>22 Seguidores</Typography>
            </OrganizerData>
          </OrganizerInfo>
          <OrganizerActions>
            <Button size="small" $variant="ghost">
              Contactar
            </Button>
            <Button size="small" $variant="outline">
              Seguir
            </Button>
          </OrganizerActions>
        </OrganizerHeader>
        <Typography $variant='body-1-regular' as='p'>{organizer.description}</Typography>
        {organizer.socialMediaLinks && organizer.socialMediaLinks.length > 0 && (
          <SocialMediaContainer>
            {organizer.socialMediaLinks.map((link) => {
              const iconPath = getIcon(link.platform);
              return (
                <SocialMediaLink
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                >
                  <SocialMediaIcon src={iconPath} alt={`${link.platform} icon`} />
                </SocialMediaLink>
              );
            })}
          </SocialMediaContainer>
        )}
      </OrganizerCard>
    </OrganizerContainer>
  );
};

export default OrganizerBlock;

// Styled Components
const OrganizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const OrganizerCard = styled.div`
  padding: ${({ theme }) => theme.sizing.sm};
  border-radius: ${({ theme }) => theme.sizing.sm};
  border: 1px solid ${({ theme }) => theme.border.defaultSubtle};
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.md};
`;

const OrganizerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrganizerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const OrganizerAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.xs};
`;

const OrganizerData = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const OrganizerActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const SocialMediaContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.sizing.sm};
`;

const SocialMediaLink = styled.a`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const SocialMediaIcon = styled.img`
  width: 20px;
  height: 20px;
`;
