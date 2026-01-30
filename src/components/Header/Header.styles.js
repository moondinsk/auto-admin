import { theme } from "@/styles/theme";
import styled from "styled-components";

export const StyledHeader = styled.header`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 9999;
  height: ${theme.size.headerHeight};
  background: ${theme.colors.layout.headerBG};
  padding: 20px 32px;
`;

export const Logo = styled.h1``;

export const Buttons = styled.ul`
  gap: ${({ gap }) => `${gap}px`};
  svg {
    font-size: 16px;
    display: block;
  }
`;
