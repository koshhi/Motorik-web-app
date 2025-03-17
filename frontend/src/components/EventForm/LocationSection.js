// src/components/EventForm/LocationSection.js
import React from 'react';
import styled from 'styled-components';
import { Autocomplete } from '@react-google-maps/api';
import InputText from '../../components/Input/InputText';
import LocationIcon from '../../components/Icons/LocationIcon';
import SearchIcon from '../../components/Icons/SearchIcon';
import Typography from '../../components/Typography';
import EventMap from '../../components/EventMap';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';
import InfoCircleOutlineIcon from '../Icons/InfoCircleOutlineIcon';
import Tooltip from '../Tooltip/Tooltip';

const LocationSection = ({ location, onLocationChange, onPlaceChanged, autocompleteRef, coordinates, error }) => {
  const { t } = useTranslation('createEvent');
  return (
    <Wrapper>
      <SectionHeader>
        <LocationIcon fill={theme.colors.defaultStrong} />
        <Typography as="label" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
          {t('eventForm.location.heading')}
        </Typography>
        <Tooltip text={t('eventForm.location.tooltip')} maxWidth='230px' style={{ marginLeft: '-4px' }}>
          <InfoButton>
            <InfoCircleOutlineIcon width="20px" height="20px" fill={theme.colors.defaultSubtle} />
          </InfoButton>
        </Tooltip>
      </SectionHeader>
      <InputWrapper>
        <SearchIconStyled fill={theme.colors.defaultWeak} />
        <Autocomplete onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} onPlaceChanged={onPlaceChanged}>
          <StyledInput
            size="large"
            type="text"
            name="location"
            value={location}
            onChange={onLocationChange}
            placeholder={t('eventForm.location.searchPlaceholder')}
            $variant={error ? 'error' : ''}
            required
          />
        </Autocomplete>
        {error &&
          <Typography as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
            {error}
          </Typography>
        }
      </InputWrapper>

      {coordinates && coordinates.lat && coordinates.lng && (
        <MapWrapper>
          <EventMap
            lat={coordinates.lat}
            lng={coordinates.lng}
            maxHeight="200px"
            mobileHeight="200px"
            borderRadius="8px"
          />
        </MapWrapper>
      )}
    </Wrapper>
  );
};

export default LocationSection;

const Wrapper = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.sizing.sm};
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.sizing.xs};
  border-top: 1px solid ${({ theme }) => theme.border.defaultWeak};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.xs};
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.sizing.xxs};
`;

const StyledInput = styled(InputText)`
  padding-left: 36px;
  height: ${({ theme }) => theme.sizing.xl};
  background: ${({ theme }) => theme.fill.defaultSubtle};
  &:hover {
    background: ${({ theme }) => theme.fill.defaultWeak};
  }
`;

const SearchIconStyled = styled(SearchIcon)`
  position: absolute;
  left: ${({ theme }) => theme.sizing.xs};
  top: 10px;
`;

const MapWrapper = styled.div`
  margin-top: ${({ theme }) => theme.sizing.xs};
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