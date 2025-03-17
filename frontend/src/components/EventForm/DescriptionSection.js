// src/components/EventForm/DescriptionSection.js
import React from 'react';
import styled from 'styled-components';
import Typography from '../../components/Typography';
import InputTextArea from '../../components/Input/InputTextArea';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';

const DescriptionSection = ({ description, onChange, error }) => {
  const { t } = useTranslation('createEvent');
  return (
    <Wrapper>
      <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
        {t('eventForm.details')}
      </Typography>
      <InputWrapper>
        <DescriptionArea
          size="large"
          name="description"
          value={description}
          onChange={onChange}
          placeholder={t('eventForm.detailsPlaceholder')}
          $variant={error ? 'error' : ''}
          required
        />
        {error &&
          <Typography as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
            {error}
          </Typography>
        }
      </InputWrapper>
    </Wrapper>
  );
};

export default DescriptionSection;

const Wrapper = styled.div`
  gap: ${({ theme }) => theme.sizing.xs};
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xxs};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DescriptionArea = styled(InputTextArea)`
  field-sizing: content;
  min-height: 80px;
`;
