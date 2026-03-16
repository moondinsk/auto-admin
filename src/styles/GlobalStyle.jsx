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
    scrollbar-gutter: stable;
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

  .gap-2 { gap: 2px; }
  .gap-4 { gap: 4px; }
  .gap-6 { gap: 6px; }
  .gap-8 { gap: 8px; }
  .gap-10 { gap: 10px; }
  .gap-12 { gap: 12px; }
  .gap-14 { gap: 14px; }
  .gap-16 { gap: 16px; }
  .gap-18 { gap: 18px; }
  .gap-20 { gap: 20px; }
  .gap-22 { gap: 22px; }
  .gap-24 { gap: 24px; }
  .gap-26 { gap: 26px; }
  .gap-28 { gap: 28px; }
  .gap-30 { gap: 30px; }
  .gap-32 { gap: 32px; }
  .gap-34 { gap: 34px; }
  .gap-36 { gap: 36px; }
  .gap-38 { gap: 38px; }
  .gap-40 { gap: 40px; }
  .gap-42 { gap: 42px; }
  .gap-44 { gap: 44px; }
  .gap-46 { gap: 46px; }
  .gap-48 { gap: 48px; }
  .gap-50 { gap: 50px; }

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
    cursor: pointer;
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
      min-width: 100px;

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

  .modal-transition-enter .modal-dim,
  .confirm-transition-enter .modal-dim {
    opacity: 0;
  }

  .modal-transition-enter .modal-panel,
  .confirm-transition-enter .modal-panel {
    opacity: 0;
    transform: none;
  }

  .modal-transition-enter-active .modal-dim,
  .confirm-transition-enter-active .modal-dim {
    opacity: 1;
    transition: opacity 0.5s;
  }

  .modal-transition-enter-active .modal-panel,
  .confirm-transition-enter-active .modal-panel {
    opacity: 1;
    transform: none;
    transition: opacity 0.5s;
  }

  .modal-transition-exit .modal-dim,
  .confirm-transition-exit .modal-dim {
    opacity: 1;
  }

  .modal-transition-exit .modal-panel,
  .confirm-transition-exit .modal-panel {
    opacity: 1;
    transform: none;
  }

  .modal-transition-exit-active .modal-dim,
  .confirm-transition-exit-active .modal-dim {
    opacity: 0;
    transition: opacity 0.5s;
  }

  .modal-transition-exit-active .modal-panel,
  .confirm-transition-exit-active .modal-panel {
    opacity: 0;
    transform: none;
    transition: opacity 0.5s;
  }

  /* toast */
  .custom-toast {
    min-height: 52px;
    border-radius: 4px;
    font-size: 18px;
    font-weight: 500;
    gap: 8px;
    align-items: center;
    min-width: 344px;
    padding:16px;


    .Toastify__toast-icon {
      width: 24px;
      height: 24px;
      margin-right: 0;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .toast-success {
    border: 1px solid #35C63C;
    background: linear-gradient(0deg, rgba(53, 198, 60, 0.20) 0%, rgba(53, 198, 60, 0.20) 100%), rgba(255, 255, 255, 0.90);
    color:#35C63C;
  }

  .toast-error {
    border: 1px solid #FF463F;
    background: linear-gradient(0deg, rgba(255, 70, 63, 0.20) 0%, rgba(255, 70, 63, 0.20) 100%), rgba(255, 255, 255, 0.90);
    color:#FF463F;
  }

  .toast-warning {
    border: 1px solid #FFA007;
    background: linear-gradient(0deg, rgba(255, 160, 7, 0.20) 0%, rgba(255, 160, 7, 0.20) 100%), rgba(255, 255, 255, 0.90);
    color:#FFA007;
  }


`;
