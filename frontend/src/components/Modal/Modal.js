import React from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';

// const Modal = ({ title, children, onClose }) => {
//   return (
//     <ModalOverlay onClick={onClose}>
//       <ModalContent onClick={(e) => e.stopPropagation()}>
//         <div className='Heading'>
//           <h3>{title}</h3>
//           <Button $variant="ghost" onClick={onClose}><img src='/icons/close.svg' alt='Close' /></Button>
//         </div>
//         {children}
//       </ModalContent>
//     </ModalOverlay>
//   );
// };

// export default Modal;


const Modal = ({ children, onClose }) => {
  return (
    <ModalWrapper>
      <ModalContent>
        <Button $variant="ghost" onClick={onClose}><img src='/icons/close.svg' alt='Close' /></Button>

        {/* <CloseButton onClick={onClose} aria-label="Cerrar modal">
          &times;
        </CloseButton> */}
        {children}
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: rgba(26, 26, 26, 0.90);
  backdrop-filter: blur(12px);
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.fill.defaultMain};
  border-radius: 8px;
  z-index: 1001;
  max-width: 500px;
  width: 100%;

  //   .Heading {
  //   display: flex;
  //   flex-direction: row;
  //   align-items: center;
  //   justify-content: space-between;
  //   width: 100%;
  //   padding: 8px 8px 8px 16px;
  //   border-bottom: 1px solid ${({ theme }) => theme.border.defaultSubtle};

  //   h3 {
  //     color: ${({ theme }) => theme.colors.defaultStrong};
  //     text-align: center;
  //     font-variant-numeric: lining-nums tabular-nums;
  //     font-feature-settings: 'ss01' on, 'ss04' on;

  //     /* Titles/Desktop/Title 5/Semibold */
  //     font-family: "Mona Sans";
  //     font-size: 18px;
  //     font-style: normal;
  //     font-weight: 600;
  //     line-height: 140%; /* 25.2px */
  //   }
  // }
`;

// const ModalWrapper = styled.div`
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100vw;
//     height: 100vh;
//     z-index: 1000;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;

//     .modalOverlay {
//       width: 100%;
//       height: 100%;
//       background: rgba(26, 26, 26, 0.90);
//       backdrop-filter: blur(12px);
//       position: absolute;
//     }
//   `;

// const ModalWrapper = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(26, 26, 26, 0.90);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1001;
// `;