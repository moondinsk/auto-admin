import { theme } from "@/styles/theme";
import styled from "styled-components";

const SIZE_MAP = {
  sm: { height: 32, padding: "0 20px", fontSize: 14, fontWeight: 400 },
  md: { height: 40, padding: "0 32px", fontSize: 15, fontWeight: 700 },
  lg: { height: 48, padding: "0 40px", fontSize: 16, fontWeight: 700 },
};

const RADIUS_MAP = {
  sm: 4,
  md: 8,
  lg: 12,
};

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};

  ${({ size, height }) => {
    const h = height || SIZE_MAP[size].height;
    return `
      height: ${h}px;
    `;
  }}

  padding: ${({ padding, size }) => padding || SIZE_MAP[size].padding};

  font-size: ${({ fontSize, size }) => (fontSize ? `${fontSize}px` : `${SIZE_MAP[size].fontSize}px`)};

  border-radius: ${({ radius, size, height }) => {
    const h = height || SIZE_MAP[size].height;

    if (radius === "half") return `${h / 2}px`;
    if (radius === "pill") return "9999px";
    if (typeof radius === "number") return `${radius}px`;

    return `${RADIUS_MAP[radius]}px`;
  }};

  font-weight: ${({ fontWeight, size }) => fontWeight || SIZE_MAP[size].fontWeight};
  /* =======================
     BORDER
  ======================= */
  border: 1px solid
    ${({ outlined, disabled, color }) => {
      if (disabled && outlined) return theme.colors.gray[300];
      if (outlined) return color;
      return "transparent";
    }};

  background-color: ${({ outlined, disabled, bgColor }) => {
    if (disabled) return theme.colors.gray[100];
    if (!outlined) return bgColor;
    return "transparent";
  }};

  color: ${({ outlined, disabled, color }) => {
    if (disabled) return theme.colors.gray[500];
    if (!outlined) return theme.colors.gray.white;
    return color;
  }};

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    ${({ disabled, outlined, bgColor, color }) => {
      if (disabled) return "";

      // Filled 버튼
      if (!outlined && bgColor) {
        return `
        background-color: ${theme.colors.gray.white};
        color: ${bgColor};
        border: 1px solid ${bgColor};
      `;
      }

      // Outlined 버튼
      if (outlined) {
        return `
        background-color: ${color};
        color: ${theme.colors.gray.white};
        border-color: ${color};
      `;
      }

      return "";
    }}
  }
`;
