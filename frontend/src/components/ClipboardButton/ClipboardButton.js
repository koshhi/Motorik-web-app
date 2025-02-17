// components/ClipboardButton/ClipboardButton.js

import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import Tooltip from '../Tooltip/Tooltip';

const ClipboardButton = ({
  text,
  tooltipText = "URL copiada",
  label,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar la URL:", err);
    }
  };

  return (
    <Tooltip text={tooltipText} trigger="click">
      <Button onClick={handleCopy} {...props}>
        <img src="/icons/link.svg" alt="copy-icon" />
        {label}
      </Button>
    </Tooltip>
  );
};

export default ClipboardButton;
