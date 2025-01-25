// components/ConfirmDeleteModal.js
import React from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';

function ConfirmDeleteModal({ onClose, onConfirm }) {
  return (
    <Overlay>
      <Modal>
        <h2>¿Estás seguro de eliminar tu cuenta?</h2>
        <p>Esta acción no se puede deshacer.</p>
        <ButtonContainer>
          <Button onClick={onClose} $variant="outline">Cancelar</Button>
          <Button onClick={onConfirm} $variant="error">Eliminar cuenta</Button>
        </ButtonContainer>
      </Modal>
    </Overlay>
  );
}

export default ConfirmDeleteModal;

const Overlay = styled.div`
  /* estilos de overlay */
  position: fixed;
  top:0; left:0;
  width:100%; height:100%;
  background: rgba(0,0,0,0.5);
`;

const Modal = styled.div`
  /* estilos de modal */
  background: #fff;
  padding: 24px;
  width: 400px;
  margin: auto;
  margin-top: 100px;
  border-radius: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;
