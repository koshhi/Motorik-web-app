import React from 'react';
import styled from 'styled-components';

const InputImage = ({ imgSrc, onChangeFile, fileInputRef, inputFileId, errors, required = false }) => {
  return (
    <Image>
      <div className="ImageContainer">
        {imgSrc ? (
          <div className='ImageWrapper'>
            <img
              src={imgSrc}
              alt="Vista previa"
              className="Image"
            />
            <div className="ImageInputBlock">
              <input
                type="file"
                ref={fileInputRef}
                id={inputFileId}
                onChange={onChangeFile}
                accept="image/*"
                required={required}
                className="inputFile"
              />
              <label
                htmlFor={inputFileId}
                className={errors.file ? 'inputFileLabel error' : 'inputFileLabel'}
              >
                <div className='labelContent'>
                  <img src="/icons/upload-file.svg" alt="Subir fichero" />
                  <p>Sube una nueva imagen</p>
                </div>
                {errors.file && <ErrorMessage>{errors.file}</ErrorMessage>}
              </label>
            </div>
          </div>
        ) : (
          <div className="EmptyImageWrapper">
            <img
              src='/icons/vehicle.svg'
              alt="empty state icon"
              className="empty-state-icon"
            />
            <div className="ImageInputBlock">
              <input
                type="file"
                id={inputFileId}
                ref={fileInputRef}
                onChange={onChangeFile}
                required={required}
                className="inputFile"
              />
              <label
                htmlFor={inputFileId}
                className={errors.file ? 'inputFileLabel error' : 'inputFileLabel'}
              >
                <div className='labelContent'>
                  <img src="/icons/upload-file.svg" alt="Subir fichero" />
                  <p>Sube una imagen</p>
                </div>
                {errors.file && <ErrorMessage className='error'>{errors.file}</ErrorMessage>}
              </label>
            </div>
          </div>
        )}
      </div>
    </Image>
  );
};

export default InputImage;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.errorMain};
  font-size: 14px;
  font-weight: 500;
`;

const Image = styled.div`
  width: 100%;

  .ImageContainer {
    display: flex;
    justify-content: center;
    align-items: stretch;
    background-color: ${({ theme }) => theme.fill.defaultWeak};
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: ${({ theme }) => theme.radius.sm};

    .ImageWrapper,
    .EmptyImageWrapper {
      position: relative;
      width: 100%;
      height: 100%;

      .ImageInputBlock {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;

        .inputFile {
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden !important;
          position: absolute;
          z-index: -1;
        }
        .inputFileLabel {
          cursor: pointer;
          color: ${({ theme }) => theme.colors.defaultStrong};
          font-variant-numeric: lining-nums tabular-nums;
          font-feature-settings: 'ss01' on;
          font-family: "Mona Sans";
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 150%; /* 24px */
          border-radius: ${({ theme }) => theme.radius.sm};
          border: 1px solid transparent;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-direction: column;

          // &:hover {
          //   border-color: ${({ theme }) => theme.border.defaultWeak};
          // }

          .labelContent {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 40px;
            margin-bottom: 40px;
          }
          
          .error {
            position: absolute;
            bottom: 12px;
          }
        }

        .inputFileLabel.error {
          border: 1px solid ${({ theme }) => theme.colors.errorMain};
        
          &:hover {
            outline: 1px solid ${({ theme }) => theme.colors.errorMain};
          }
        }
      }
    }

    .EmptyImageWrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      .empty-state-icon {
        width: 32px;
        height: 32px;
      }
    }
    
    .ImageWrapper {
      transition: all 0.3s;
      &:hover {
        opacity: 80%;
      }
      .Image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: ${({ theme }) => theme.radius.sm};
      }

      .ImageInputBlock{
        .inputFileLabel {
          &:hover {
            border: 1px solid transparent;
          }
          .labelContent {
            background-color: ${({ theme }) => theme.fill.defaultMain};
          }
        }
      }
    }
  }
`;
