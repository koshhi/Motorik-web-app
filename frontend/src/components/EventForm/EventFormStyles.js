import styled from 'styled-components';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  max-width: 400px;
  padding: 24px;

  .autocomplete-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  .image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #E0E0E0;
  width: 100%;
  height: 200px; /* Ajusta el tamaño según lo necesites */
  margin-bottom: 20px;
  border-radius: 10px;
}

.event-image-preview {
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.empty-state-icon {
  width: 50px;
  height: 50px;
}

`;