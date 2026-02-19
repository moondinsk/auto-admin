import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";
import { reset } from "styled-reset";

export const GlobalStyle = createGlobalStyle`
  /* ================================
      RESET & BASE
  ================================= */
  ${reset}

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: ${theme.fonts.family};
    font-size: ${theme.fonts.size};
    color: ${theme.fonts.color};
    background: ${theme.colors.layout.bodyBG};
  }

  li::marker {
    content: "";
  }

  input,
  button,
  select,
  textarea {
    font-family: inherit;
    font-size: inherit;
  }

  /* ================================
      FLEX UTILS
  ================================= */
  .flex-box {
    display: flex;

    &.ac { align-items: center; }
    &.jc { justify-content: center; }
    &.jb { justify-content: space-between; }
    &.col { flex-direction: column; }
  }

  /* ================================
      FORM BASE
  ================================= */
  select,
  input,
  textarea {
    width: 100%;
    border-radius: 8px;
    border: 1px solid ${theme.colors.palette.gray300};
    outline: none;

    &:focus {
      border-color: ${({ theme }) => theme.colors.gray.black};
    }
  }

  select,
  input[type="text"],
  input[type="password"] {
    height: 44px;
    padding: 0 14px;
  }

  textarea {
    padding: 10px 14px;
  }

  input[type="checkbox"],
  input[type="radio"] {
    margin: 0;
    appearance: none;
    position: relative;
  }

  /* ================================
      RADIO
  ================================= */
  input[type="radio"] {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  input[type="radio"]:checked {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  input[type="radio"]:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary.main};
    transform: translate(-50%, -50%);
  }

  /* ================================
      CHECKBOX
  ================================= */
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }

  input[type="checkbox"]:checked {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  input[type="checkbox"]:checked::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 6px;
    width: 6px;
    height: 12px;
    border: solid ${({ theme }) => theme.colors.primary.main};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  /* ================================
      REACT SELECT
  ================================= */
  .custom-select {

    .react-select__control {
      height: 44px;
      border-radius: 6px;
      border: 1px solid ${({ theme }) => theme.colors.palette.gray300};
      box-shadow: none;
      font-size: 14px;

      &:hover {
        border-color: inherit;
        background: ${({ theme }) => theme.colors.palette.gray100};
      }
    }

    .react-select__value-container {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;
      height: 100%;
      padding: 0 14px;
    }

    .react-select__indicator-separator {
      display: none;
    }

    .react-select__indicator {
      padding: 0 14px 0 0;
      color: #000;
    }

    .react-select__single-value,
    .react-select__input-container {
      margin: 0;
    }

    .react-select__indicators {
      height: 100%;
    }

    .react-select__option--is-selected {
      background: ${({ theme }) => theme.colors.primary.main};
    }

    .react-select__option--is-focused {
      background: ${({ theme }) => theme.colors.primary.light};
    }
  }
`;
