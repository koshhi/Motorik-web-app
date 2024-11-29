// components/Input/InputRange.js
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const InputRange = React.forwardRef(({ min, max, step, value, onChange, label }, ref) => {
  const minValue = Number(min);
  const maxValue = Number(max);
  const currentValue = Number(value);

  const inputRef = useRef(null);

  // Actualizar el estilo del input cuando el valor cambie
  useEffect(() => {
    if (inputRef.current) {
      const percentage = ((currentValue - minValue) / (maxValue - minValue)) * 100;
      inputRef.current.style.background = `linear-gradient(to right, #f65703 0%, #f65703 ${percentage}%, #efefef ${percentage}%, #efefef 100%)`;
    }
  }, [currentValue, minValue, maxValue]);

  return (
    <RangeContainer>
      <SliderWrapper>
        <Slider
          id="radiusRange"
          type="range"
          min={minValue}
          max={maxValue}
          step={step}
          value={currentValue}
          onChange={onChange}
          ref={(element) => {
            inputRef.current = element;
            if (ref) ref.current = element; // Si necesitas pasar el ref hacia arriba
          }} />
        <ValueDisplay>{value} km</ValueDisplay>
      </SliderWrapper>
    </RangeContainer>
  );
});

export default InputRange;

/* Estilos */
const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  height: 40px;
`;

const ValueDisplay = styled.span`
  width: 70px;;
  text-align: right;
  flex-shrink: 0;
`;

const Slider = styled.input`
    border-radius: 8px;
    background: ${({ theme }) => theme.fill.brandMain};;
    height: 6px;
    width: 100%;
    outline: none;
    transition: background 450ms ease-in;
    appearance: none;
    -webkit-appearance: none;
    position: relative;

    &::-webkit-slider-runnable-track {
      // background: linear-gradient(90deg, #f65703 100%, #efefef 0%);
      border-radius: 8px;
      height: 6px;
    }

    &::-webkit-slider-thumb {
      right: 12px;
      margin-top: -9px;
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50 %;
      cursor: grab;
      transition: all 0.3s;
      border-radius: 16px;
      background-color: ${({ theme }) => theme.fill.defaultMain};
      background-image: url(${process.env.REACT_APP_CLIENT_URL}/icons/knob-drag.svg);
      background-size: 8px 8px;
      background-repeat: no-repeat;
      background-position: center;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16), 0px 0px 2px 0px rgba(0, 0, 0, 0.16);
    }

    &::-webkit-slider-thumb:hover {
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16), 0px 0px 2px 0px rgba(0, 0, 0, 0.16);
    }

    &::-moz-range-track {
      width: 100%;
      height: 6px;
      border-radius: 4px;
      background: linear-gradient(90deg, #f65703 100%, #efefef 0%);
    }

    &::-moz-range-thumb {
      right: 12px;
      margin-top: -9px;
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50 %;
      border: 0px;
      cursor: grab;
      transition: all 0.3s;
      border-radius: 16px;
      background-color: ${({ theme }) => theme.fill.defaultMain};
      background-image: url(${process.env.REACT_APP_CLIENT_URL}/icons/knob-drag.svg);
      background-size: 8px 8px;
      background-repeat: no-repeat;
      background-position: center;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16), 0px 0px 2px 0px rgba(0, 0, 0, 0.16);

      &:hover {
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16), 0px 0px 2px 0px rgba(0, 0, 0, 0.16);
      }
    }
`;


// .Slider {

//   &::-webkit-slider-runnable-track {
//   position: relative;
//     // width: 100%;
//     // height: 8px;
//     border-radius: 4px;
//     // background: ${({ theme }) => theme.fill.brandMain};
//     background: linear-gradient(f65703# 0 0) scroll no-repeat center / 100% 0.125em;
//     // background: linear-gradient(90deg, #f65703 ${(props) => ((props.value - props.min) / (props.max - props.min)) * 100}%, #ff720d 0%);
//     // background: linear-gradient(90deg, #4CAF50 ${(props) => ((props.value - props.min) / (props.max - props.min)) * 100}%, #ddd 0%);
//   }

//   &::-webkit-slider-thumb {
//     right: 12px;
//     margin-top: -8px;
//     -webkit-appearance: none;
//     appearance: none;
//     width: 24px;
//     height: 24px;
//     border-radius: 50%;
//     cursor: pointer;
//     transition: all 0.3s;
//     border-radius: var(--Spacing-sm, 16px);
//     background-color: ${({ theme }) => theme.fill.defaultMain};
//     background-image: url(${process.env.REACT_APP_CLIENT_URL}/icons/knob-drag.svg);
//     background-size: 8px 8px;
//     background-repeat: no-repeat;
//     background-position: center;
//     box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16), 0px 0px 2px 0px rgba(0, 0, 0, 0.16);
//   }

//   &::-webkit-slider-thumb:hover {
//     box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16), 0px 0px 2px 0px rgba(0, 0, 0, 0.16);
//   }

//   /* Estilo para Firefox (Moz) */
//   &::-moz-range-track {
//     width: 100%;
//     height: 8px;
//     border-radius: 4px;
//     background: linear-gradient(90deg, #4CAF50 ${(props) => ((props.value - props.min) / (props.max - props.min)) * 100}%, #ddd 0%);
//   }

//   &::-moz-range-thumb {
//     width: 20px;
//     height: 20px;
//     border-radius: 50%;
//     background: #4CAF50;
//     cursor: pointer;
//     transition: background 0.3s;
//   }

//   &::-moz-range-thumb:hover {
//     background: #45a049;
//   }
// }