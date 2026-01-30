import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-size: ${theme.fontSizes.base};
    font-family: Pretendard, -apple-system, BlinkMacSystemFont;
    color: ${theme.colors.text.base};
    background: ${theme.colors.layout.body};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;
