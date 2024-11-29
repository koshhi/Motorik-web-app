// components/EventHeader/OrganizerInfo.js

import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Typography from '../Typography';
import { theme } from '../../theme';

const OrganizerInfo = ({ organizer }) => {
  return (
    <OrganizerContainer>
      <OrganizerLink to={`/user/${organizer.id}`}>
        <OrganizerAvatar src={organizer.userAvatar} alt="Organizador" />
        <OrganizerData>
          <Typography $variant='caption-medium' color={theme.colors.defaultWeak}>
            Organizado por
          </Typography>
          <Typography $variant='body-2-semibold' color={theme.colors.defaultMain}>
            {organizer.name} {organizer.lastName}
          </Typography>
        </OrganizerData>
      </OrganizerLink>
    </OrganizerContainer>
  );
};

export default OrganizerInfo;

// Styled Components
const OrganizerContainer = styled.div`
  display: flex;
  margin-left: -${({ theme }) => theme.sizing.xs};
`;

const OrganizerLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xs};
  text-decoration: none;
  padding: ${({ theme }) => theme.sizing.xs};
  padding-right: ${({ theme }) => theme.sizing.sm};
  transition: all 0.3s ease-in-out;
  border-radius: ${({ theme }) => theme.radius.xs};

  &:hover {
    background-color: ${({ theme }) => theme.fill.defaultWeak};
  }
`;

const OrganizerData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const OrganizerAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.xs};
`;
