// src/components/EventForm/OptionsSection.js
import React from 'react';
import styled from 'styled-components';
import OptionsIcon from '../../components/Icons/OptionsIcon';
import EventTypeIcon from '../../components/Icons/EventTypeIcon';
import TicketsIcon from '../../components/Icons/TicketsIcon';
import TerrainIcon from '../../components/Icons/TerrainIcon';
import ExperienceIcon from '../../components/Icons/ExperienceIcon';
import WheelIcon from '../../components/Icons/WheelIcon';
import EditIcon from '../../components/Icons/EditIcon';
import Typography from '../../components/Typography';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';
import Tooltip from '../Tooltip/Tooltip';
import InfoCircleOutlineIcon from '../Icons/InfoCircleOutlineIcon';

const OptionsSection = ({
  formData,
  isEditMode,
  handleOpenModal,
  errors
}) => {
  const { t } = useTranslation('createEvent');
  return (
    <Wrapper>
      <SectionHeader>
        <OptionsIcon stroke={theme.colors.defaultStrong} />
        <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
          {t('eventForm.options.heading')}
        </Typography>
        <Tooltip text={t('eventForm.options.tooltip')} maxWidth='260px' style={{ marginLeft: '-4px' }}>
          <InfoButton>
            <InfoCircleOutlineIcon width="20px" height="20px" fill={theme.colors.defaultSubtle} />
          </InfoButton>
        </Tooltip>
      </SectionHeader>
      <OptionsContainer>
        <Option onClick={() => handleOpenModal('eventType')}>
          <OptionTitle>
            <EventTypeIcon fill={theme.colors.defaultStrong} />
            <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
              {t('eventForm.options.eventType.label')}
            </Typography>
          </OptionTitle>
          <OptionSelected>
            <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
              {formData.eventType}
            </Typography>
            <EditIcon fill={theme.colors.defaultSubtle} />
          </OptionSelected>
        </Option>
        {!isEditMode && (
          <Option onClick={() => handleOpenModal('ticket')}>
            <OptionTitle>
              <TicketsIcon fill={theme.colors.defaultStrong} />
              <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
                {t('eventForm.options.ticket.label')}
              </Typography>
            </OptionTitle>
            <OptionSelected>
              <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
                {formData.tickets[0].type === 'free'
                  ? t('eventForm.options.ticket.free')
                  : t('eventForm.options.ticket.paid', { price: formData.tickets[0].price })}
              </Typography>
              <EditIcon fill={theme.colors.defaultSubtle} />
            </OptionSelected>
          </Option>
        )}
        <Option onClick={() => handleOpenModal('vehicleRequirement')}>
          <OptionTitle>
            <WheelIcon fill={theme.colors.defaultStrong} />
            <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
              {t('eventForm.options.vehicle.label')}
            </Typography>
          </OptionTitle>
          <OptionSelected>
            <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
              {formData.needsVehicle
                ? (formData.organizerVehicle
                  ? formData.organizerVehicle.nickname || formData.organizerVehicle.model
                  : t('eventForm.options.vehicle.required'))
                : t('eventForm.options.vehicle.notRequired')}
            </Typography>
            <EditIcon fill={theme.colors.defaultSubtle} />
          </OptionSelected>
        </Option>
        {formData.needsVehicle && (
          <>
            <Option onClick={() => handleOpenModal('selectVehicle')}>
              <OptionTitle>
                <WheelIcon fill={theme.colors.defaultStrong} />
                <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
                  {t('eventForm.options.organizerVehicle.label')}
                </Typography>
              </OptionTitle>
              <OptionSelected>
                <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
                  {formData.organizerVehicle
                    ? formData.organizerVehicle.nickname || formData.organizerVehicle.model
                    : t('eventForm.options.organizerVehicle.select')}
                </Typography>
                <EditIcon fill={theme.colors.defaultSubtle} />
              </OptionSelected>
            </Option>
            <Option onClick={() => handleOpenModal('terrain')}>
              <OptionTitle>
                <TerrainIcon fill={theme.colors.defaultStrong} />
                <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
                  {t('eventForm.options.terrain.label')}
                </Typography>
              </OptionTitle>
              <OptionSelected>
                <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
                  {formData.terrain}
                </Typography>
                <EditIcon fill={theme.colors.defaultSubtle} />
              </OptionSelected>
            </Option>
            <Option onClick={() => handleOpenModal('experience')}>
              <OptionTitle>
                <ExperienceIcon fill={theme.colors.defaultStrong} />
                <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultStrong}>
                  {t('eventForm.options.experience.label')}
                </Typography>
              </OptionTitle>
              <OptionSelected>
                <Typography as="p" $variant="body-1-medium" color={theme.colors.defaultSubtle}>
                  {formData.experience}
                </Typography>
                <EditIcon fill={theme.colors.defaultSubtle} />
              </OptionSelected>
            </Option>
          </>
        )}
      </OptionsContainer>
    </Wrapper>
  );
};

export default OptionsSection;

const Wrapper = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.sizing.xs};
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
`;

const SectionHeader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xs};;
`;

const OptionsContainer = styled.div`
  border-radius: ${({ theme }) => theme.sizing.xs};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  background: ${({ theme }) => theme.fill.defaultSubtle};
  overflow: hidden;
`;

const Option = styled.div`
  display: flex;
  padding: 12px ${({ theme }) => theme.sizing.sm};
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
  cursor: pointer;
  transition: background 0.3s;
  &:first-child {
    border-top: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.fill.defaultWeak};
  }
`;

const OptionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OptionSelected = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.sizing.md};
  height: ${({ theme }) => theme.sizing.md};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.fill.defaultMain};
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.fill.defaultWeak};
  }
`;