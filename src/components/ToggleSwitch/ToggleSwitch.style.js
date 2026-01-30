import styled from "styled-components";

export const Switch = styled.label`
  position: relative;

  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* track */
  span {
    width: 44px;
    height: 24px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.palette.gray100};
    border: 1px solid ${({ theme }) => theme.colors.palette.gray400};
    position: relative;
    transition: 0.2s ease;
  }

  /* knob */
  span::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    transform: translateY(-50%);
    background: ${({ theme }) => theme.colors.gray.white};
    transition: 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  input:checked + span {
    background: ${({ theme }) => theme.colors.primary.main};
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  input:checked + span::after {
    left: 22px;
  }

  /* 키보드 포커스 */
  input:focus-visible + span {
    outline: 2px solid rgba(115, 134, 232, 0.35);
    outline-offset: 2px;
  }
`;
