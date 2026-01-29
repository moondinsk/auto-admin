import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Pretendard, -apple-system, BlinkMacSystemFont;
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.white};
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
