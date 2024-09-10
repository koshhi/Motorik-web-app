import React, { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef(({ children, buttonLabel, iconRight, defaultContent }, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({
    toggleVisibility
  }));

  return (
    <div>
      {/* Renderiza el contenido por defecto cuando no es visible */}
      {!visible && (
        <div className='OptionSelected' onClick={toggleVisibility}>
          {defaultContent || buttonLabel}
          {iconRight && <img src={iconRight} alt="icon right" />}
        </div>
      )}

      {/* Renderiza los children cuando es visible */}
      {visible && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  buttonLabel: PropTypes.string,
  iconRight: PropTypes.string,
  defaultContent: PropTypes.node, // Agrega un prop para el contenido predeterminado
  children: PropTypes.node
};

export default Togglable;
