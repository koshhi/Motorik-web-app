//AddVehicleModal.js

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AddVehicleForm from '../Forms/AddVehicleForm';
import Modal from './Modal';


const AddVehicleModal = ({ isOpen, onClose, onVehicleSaved, vehicle }) => {
  if (!isOpen) return null;

  return (
    <Modal
      title={vehicle ? 'Editar Vehículo' : 'Añadir Vehículo'}
      onClose={onClose}
      isOpen={isOpen}
      maxWidth="600px"
    >
      <AddVehicleForm
        onSubmit={(savedVehicle) => {
          onVehicleSaved(savedVehicle);
          onClose();
        }}
        vehicle={vehicle}
      />
    </Modal>
  );
};

AddVehicleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onVehicleSaved: PropTypes.func.isRequired,
  vehicle: PropTypes.object, // Puede ser null o undefined si se está creando un nuevo vehículo
};

export default AddVehicleModal;


// const Modal = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   background-color: ${({ theme }) => theme.fill.defaultMain};
//   border-radius: 8px;
//   z-index: 1001;
//   max-width: 500px;
//   width: 100%;

//   .error {
//     color: red;
//     font-size: 0.8rem;
//   }

//   .Heading {
//     display: flex;
//     flex-direction: row;
//     align-items: center;
//     justify-content: space-between;
//     width: 100%;
//     padding: 8px 8px 8px 16px;
//     border-bottom: 1px solid ${({ theme }) => theme.border.defaultSubtle};

//     h3 {
//       color: ${({ theme }) => theme.colors.defaultStrong};
//       text-align: center;
//       font-variant-numeric: lining-nums tabular-nums;
//       font-feature-settings: 'ss01' on, 'ss04' on;

//       /* Titles/Desktop/Title 5/Semibold */
//       font-family: "Mona Sans";
//       font-size: 18px;
//       font-style: normal;
//       font-weight: 600;
//       line-height: 140%; /* 25.2px */
//     }
//   }

//   .ModalContent {
//     padding: 16px;
//     display: flex;
//     flex-direction: column;
//     gap: 16px;
//     width: 100%;

//     form {
//       display: flex;
//       flex-direction: column;
//       gap: 16px;
//       width: 100%;

//       .FormItem {
//         display: flex;
//         flex-direction: column;
//         align-items: flex-start;
//         gap: 6px;
//         width: 100%;

//         .RowWrapper {
//           display: flex;
//           align-items: flex-start;
//           gap: 16px;
//           width: 100%;

//           .BrandSelect {
//             width: 100%;
//           }
          
//           .YearInput,
//           .NicknameInput {
//             width: 100%;
//             display: flex;
//             flex-direction: column;
//             gap: 6px;
//           }
//         }
//       }
//     }
//   }
// `;