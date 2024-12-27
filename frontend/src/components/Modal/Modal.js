import React from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import Typography from '../Typography';
import PropTypes from 'prop-types';

const Modal = ({ children, onClose, title, maxWidth = '500px' }) => {
  return (
    <ModalWrapper >
      <ModalContent style={{ maxWidth: maxWidth }}>
        <ModalHeader>
          <Typography $variant="title-5-semibold">{title}</Typography>
          <Button $variant="ghost" onClick={onClose}><img src='/icons/close.svg' alt='Close' /></Button>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalWrapper>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  maxWidth: PropTypes.string
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
  width: 100%;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction row;
  padding: 8px 8px 8px 16px;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  align-self: stretch;  
  border-bottom: 1px solid var(--border-default-subtle, #EFEFEF);
  background: var(--bg-default-main, #FFF);
`;