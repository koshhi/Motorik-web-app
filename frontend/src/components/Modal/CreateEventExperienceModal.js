import React from 'react';
import Modal from './Modal'; // Import the Modal component
import Button from '../Button/Button';
import CardToogle from '../Toogle/CardToogle';
import { getEventExperienceSvgIcon } from '../../utilities';
import { theme } from '../../theme';
import Typography from '../Typography';
import styled from 'styled-components';

const CreateEventExperienceModal = ({ experience, setExperience, onClose }) => {
  const experienceTypes = ['none', 'beginner', 'intermediate', 'advanced'];

  return (
    <Modal onClose={onClose} title="Experiencia deseada">
      <ModalContent>
        <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultWeak}>
          Esta información ayudará a dar visibilidad a tu evento.
        </Typography>
        <ExperienceList>
          {experienceTypes.map((experienceType) => (
            <CardToogle
              key={experienceType}
              category={experienceType}
              isActive={experience === experienceType}
              onClick={() => setExperience(experienceType)}
              icon={getEventExperienceSvgIcon(experienceType, experience === experienceType ? theme.colors.brandMain : theme.colors.defaultSubtle)}
            />
          ))}
        </ExperienceList>
      </ModalContent>
      <FormActions>
        <Button size="medium" onClick={onClose}>Guardar experiencia deseada</Button>
      </FormActions>
    </Modal>
  );
};

export default CreateEventExperienceModal;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.fill.defaultMain};
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  width: 100%;
`;


const ExperienceList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  width: 100%;
`;

const FormActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  text-align: center;
`;
