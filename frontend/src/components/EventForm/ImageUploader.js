// src/components/EventForm/ImageUploader.js
import React from 'react';
import styled from 'styled-components';
import UploadFileIcon from '../../components/Icons/UploadFileIcon';
import Typography from '../../components/Typography';
import { getEventTypeIcon } from '../../utilities';
import { theme } from '../../theme';
import { useTranslation } from 'react-i18next';
import InfoCircleOutlineIcon from '../Icons/InfoCircleOutlineIcon';

// const ImageUploader = ({ file, imageUrl, onFileChange, eventType, error, warning }) => {
//   const { t } = useTranslation('createEvent');

//   const renderContent = () => {
//     if (file) {
//       return (
//         <Preview>
//           <Image src={URL.createObjectURL(file)} alt="Event" />
//           <InputOverlay>
//             <HiddenInput type="file" id="file" onChange={onFileChange} />
//             <InputLabel htmlFor="file" className={error ? 'error' : ''}>
//               <LabelContentWrapper>
//                 <LabelButton>
//                   <UploadFileIcon fill={theme.colors.defaultStrong} />
//                   <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
//                     {t('eventForm.eventImage.imageUpload')}
//                   </Typography>
//                 </LabelButton>
//               </LabelContentWrapper>
//               <StyledError as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
//                 {error}
//               </StyledError>
//               {warning && (
//                 <StyledWarning as="p" $variant="body-2-medium" color={theme.colors.warningMain || 'orange'}>
//                   {warning}
//                 </StyledWarning>
//               )}
//             </InputLabel>
//           </InputOverlay>
//         </Preview>
//       );
//     } else if (imageUrl) {
//       return (
//         <Preview>
//           <Image src={imageUrl} alt="Event" />
//           <InputOverlay>
//             <HiddenInput type="file" id="file" onChange={onFileChange} />
//             <InputLabel htmlFor="file" className={error ? 'error' : ''}>
//               <LabelContentWrapper>
//                 <LabelButton>
//                   <UploadFileIcon fill={theme.colors.defaultStrong} />
//                   <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
//                     {t('eventForm.eventImage.imageUpload')}
//                   </Typography>
//                 </LabelButton>
//                 <Typography as="p" $variant="body-2-medium" color={theme.colors.defaultWeak}>
//                   {t('eventForm.eventImage.warning')}
//                 </Typography>
//               </LabelContentWrapper>
//               <StyledError as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
//                 {error}
//               </StyledError>
//             </InputLabel>
//           </InputOverlay>
//         </Preview>
//       );
//     } else {
//       return (
//         <EmptyState>
//           <EmptyIcon src={getEventTypeIcon(eventType)} alt="empty state icon" />
//           <InputOverlay>
//             <HiddenInput type="file" id="file" onChange={onFileChange} />
//             <InputLabel htmlFor="file" className={error ? 'error' : ''}>
//               <LabelContentWrapperEmpty>
//                 <LabelButton>
//                   <UploadFileIcon fill={theme.colors.defaultStrong} />
//                   <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
//                     {t('eventForm.eventImage.imageUpload')}
//                   </Typography>
//                 </LabelButton>
//                 <Typography as="p" $variant="body-2-medium" color={theme.colors.defaultWeak}>
//                   {t('eventForm.eventImage.warning')}
//                 </Typography>
//               </LabelContentWrapperEmpty>
//               <StyledError as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
//                 {error}
//               </StyledError>
//             </InputLabel>
//           </InputOverlay>
//         </EmptyState>
//       );
//     }
//   };

//   return <Container>{renderContent()}</Container>;
// };

const ImageUploader = ({ file, imageUrl, onFileChange, eventType, error, warning }) => {
  const { t } = useTranslation('createEvent');

  const renderContent = () => {
    if (file) {
      return (
        <>
          <Preview>
            <Image src={URL.createObjectURL(file)} alt="Event" />
            <InputOverlay>
              <HiddenInput type="file" id="file" onChange={onFileChange} />
              <InputLabel htmlFor="file" className={error ? 'error' : ''}>
                <LabelContentWrapper>
                  <LabelButtonHighlighted>
                    <UploadFileIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                      {t('eventForm.eventImage.imageUpload')}
                    </Typography>
                  </LabelButtonHighlighted>
                </LabelContentWrapper>
              </InputLabel>
            </InputOverlay>
          </Preview>
          <StyledError as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
            {error}
          </StyledError>
          {warning && (
            <StyledWarning as="p" $variant="body-2-medium" color={theme.colors.warningMain}>
              <InfoCircleOutlineIcon width="20px" height="20px" fill={theme.colors.warningMain} />
              {warning}
            </StyledWarning>
          )}

        </>
      );
    } else if (imageUrl) {
      return (
        <>
          <Preview>
            <Image src={imageUrl} alt="Event" />
            <InputOverlay>
              <HiddenInput type="file" id="file" onChange={onFileChange} />
              <InputLabel htmlFor="file" className={error ? 'error' : ''}>
                <LabelContentWrapper>
                  <LabelButton>
                    <UploadFileIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                      {t('eventForm.eventImage.imageUpload')}
                    </Typography>
                  </LabelButton>
                </LabelContentWrapper>
              </InputLabel>
            </InputOverlay>
          </Preview>
          <StyledError as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
            {error}
          </StyledError>
          {/* <Typography as="p" $variant="body-2-medium" color={theme.colors.defaultWeak}>
            {t('eventForm.eventImage.recommendations')}
          </Typography> */}
          {/* {warning && (
            <StyledWarning as="p" $variant="body-2-medium" color={theme.colors.warningMain || 'orange'}>
              {warning}
            </StyledWarning>
          )} */}
        </>
      );
    } else {
      return (
        <>
          <EmptyState>
            <EmptyIcon src={getEventTypeIcon(eventType)} alt="empty state icon" />
            <InputOverlay>
              <HiddenInput type="file" id="file" onChange={onFileChange} />
              <InputLabel htmlFor="file" className={error ? 'error' : ''}>
                <LabelContentWrapperEmpty>
                  <LabelButton>
                    <UploadFileIcon fill={theme.colors.defaultStrong} />
                    <Typography as="p" $variant="body-1-semibold" color={theme.colors.defaultStrong}>
                      {t('eventForm.eventImage.imageUpload')}
                    </Typography>
                  </LabelButton>
                  <Typography as="p" $variant="body-2-medium" color={theme.colors.defaultWeak}>
                    {t('eventForm.eventImage.recommendations')}
                  </Typography>
                </LabelContentWrapperEmpty>
              </InputLabel>
            </InputOverlay>
          </EmptyState>
          <StyledError as="p" $variant="body-2-medium" color={theme.colors.errorMain}>
            {error}
          </StyledError>
          {/* {warning && (
            <StyledWarning as="p" $variant="body-2-medium" color={theme.colors.warningMain || 'orange'}>
              {warning}
            </StyledWarning>
          )} */}
        </>
      );
    }
  };

  return <Container>{renderContent()}</Container>;
};

export default ImageUploader;

const Container = styled.div`
  width: 100%;
`;

const Preview = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  background-color: ${({ theme }) => theme.fill.defaultSubtle};
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: ${({ theme }) => theme.radius.sm};
  position: relative;
  transition: all 0.3s;
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};


  &:hover {
    border: 1px solid ${({ theme }) => theme.border.defaultStrong};
    background-color: ${({ theme }) => theme.fill.defaultWeak};

  }
`;

const EmptyState = styled(Preview)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    border: 1px solid ${({ theme }) => theme.border.defaultStrong};
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.sm};
`;

const EmptyIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const InputOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const HiddenInput = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden !important;
  position: absolute;
  z-index: -1;
`;

const InputLabel = styled.label`
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all 0.3s;

  &.error {
    border: 1px solid ${({ theme }) => theme.colors.errorMain};
    &:hover {
      outline: 1px solid ${({ theme }) => theme.colors.errorMain};
    }
  }
`;

const LabelButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  // padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.xs};
  // margin-bottom: 40px;
  padding: ${({ theme }) => theme.sizing.sm};
  background: ${({ theme }) => theme.fill.defaultMain};
  border: 1px solid ${({ theme }) => theme.border.defaultWeak};
`;

const LabelButtonHighlighted = styled(LabelButton)`
  box-shadow: rgba(16, 17, 15, 0.20) 0px 0px 24px;
`;

const LabelContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.sizing.sm};
  padding-bottom: ${({ theme }) => theme.sizing.md};
  background: linear-gradient(180deg, rgba(16, 17, 15, 0.00) 0%, rgba(16, 17, 15, 0.00) 6.67%, rgba(16, 17, 15, 0.01) 13.33%, rgba(16, 17, 15, 0.02) 20%, rgba(16, 17, 15, 0.04) 26.67%, rgba(16, 17, 15, 0.07) 33.33%, rgba(16, 17, 15, 0.10) 40%, rgba(16, 17, 15, 0.13) 46.67%, rgba(16, 17, 15, 0.17) 53.33%, rgba(16, 17, 15, 0.20) 60%, rgba(16, 17, 15, 0.23) 66.67%, rgba(16, 17, 15, 0.26) 73.33%, rgba(16, 17, 15, 0.28) 80%, rgba(16, 17, 15, 0.29) 86.67%, rgba(16, 17, 15, 0.30) 93.33%, rgba(16, 17, 15, 0.30) 100%);
  width: 100%;
  border-bottom-left-radius: ${({ theme }) => theme.radius.sm};
  border-bottom-right-radius: ${({ theme }) => theme.radius.sm};
`;

const LabelContentWrapperEmpty = styled(LabelContentWrapper)`
  background: none;
`;

const StyledError = styled(Typography)`
  padding-top: ${({ theme }) => theme.sizing.xs};
`;

const StyledWarning = styled(Typography)`
  padding-top: ${({ theme }) => theme.sizing.xs};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.sizing.xs};
  padding: ${({ theme }) => theme.sizing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.fill.warningAlphaMain16};
`;
