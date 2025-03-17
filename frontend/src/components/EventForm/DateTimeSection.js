// src/components/EventForm/DateTimeSection.js
import React from 'react';
import styled from 'styled-components';
import InputText from '../../components/Input/InputText';
import CalendarIcon from '../../components/Icons/CalendarIcon';
import Typography from '../../components/Typography';
import Tooltip from '../Tooltip/Tooltip';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';
import InfoCircleOutlineIcon from '../Icons/InfoCircleOutlineIcon';

const DateTimeSection = ({
  startDay,
  setStartDay,
  startTime,
  setStartTime,
  endDay,
  setEndDay,
  endTime,
  setEndTime,
  setIsEndDayChanged,
  setIsEndTimeChanged,
  errors
}) => {
  const { t } = useTranslation('createEvent');

  // Los onClick para showPicker y onKeyDown para prevenir la entrada manual se aplican a cada input
  const handleDateClick = (e) => {
    if (e.target.showPicker) e.target.showPicker();
  };

  const handleTimeClick = (e) => {
    if (e.target.showPicker) e.target.showPicker();
  };

  return (
    <DateSection>
      <SectionHeader>
        <CalendarIcon fill={theme.colors.defaultStrong} />
        <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
          {t('eventForm.date.heading')}
        </Typography>
        <Tooltip text={t('eventForm.date.tooltip')} maxWidth='160px' style={{ marginLeft: '-4px' }}>
          <InfoButton>
            <InfoCircleOutlineIcon width="20px" height="20px" fill={theme.colors.defaultSubtle} />
          </InfoButton>
        </Tooltip>
      </SectionHeader>
      <DateInputs>
        <Row>
          <StyledLabel as="label" $variant="body-1-medium" color={theme.colors.defaultStrong}>
            {t('eventForm.date.startLabel')}
          </StyledLabel>
          <InputGroup>
            <InputText
              size="medium"
              type="date"
              value={startDay}
              onChange={(e) => {
                setStartDay(e.target.value);
                if (errors.startDay) { /* limpiar error */ }
              }}
              onClick={handleDateClick}
              onKeyDown={(e) => e.preventDefault()}
              $variant={errors.startDay ? 'error' : ''}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <InputText
              size="medium"
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                if (errors.startTime) { /* limpiar error */ }
              }}
              onClick={handleTimeClick}
              onKeyDown={(e) => e.preventDefault()}
              $variant={errors.startTime ? 'error' : ''}
              required
            />
          </InputGroup>
          {errors.startDay &&
            <Typography as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
              {errors.startDay}
            </Typography>
          }
          {errors.startTime &&
            <Typography as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
              {errors.startTime}
            </Typography>
          }
        </Row>
        <Row>
          <StyledLabel as="label" $variant="body-1-medium" color={theme.colors.defaultStrong}>
            {t('eventForm.date.endLabel')}
          </StyledLabel>
          <InputGroup>
            <InputText
              size="medium"
              type="date"
              value={endDay}
              onChange={(e) => {
                const newEndDay = e.target.value;
                setEndDay(newEndDay);
                setIsEndDayChanged(true);
              }}
              onClick={handleDateClick}
              onKeyDown={(e) => e.preventDefault()}
              $variant={errors.endDay ? 'error' : ''}
              min={startDay}
              required
            />
            <InputText
              size="medium"
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setIsEndTimeChanged(true);
              }}
              onClick={handleTimeClick}
              onKeyDown={(e) => e.preventDefault()}
              $variant={errors.endTime ? 'error' : ''}
              required
            />
          </InputGroup>
          {errors.endDay &&
            <Typography as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
              {errors.endDay}
            </Typography>
          }
          {errors.endTime &&
            <Typography as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
              {errors.endTime}
            </Typography>
          }
        </Row>
      </DateInputs>
    </DateSection>
  );
};

export default DateTimeSection;

const DateSection = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.sizing.xs};
  border-top: none;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const DateInputs = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: ${({ theme }) => theme.sizing.sm};
  align-self: stretch;
  border-radius: ${({ theme }) => theme.radius.xs};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
  background: ${({ theme }) => theme.fill.defaultSubtle};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.md};;
  width: 100%;
`;

const StyledLabel = styled(Typography)`
  width: 64px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0;
  width: 100%;
  
  input {
    height: ${({ theme }) => theme.sizing.xl};
    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
      width: 100%;
    }
    &:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      width: 100px;
    }
  }
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