import styled from "styled-components";

const SIZE_MAP = {
  sm: { height: 32, padding: "0 12px", fontSize: 12 },
  md: { height: 40, padding: "0 16px", fontSize: 14 },
  lg: { height: 48, padding: "0 20px", fontSize: 16 },
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
`;
