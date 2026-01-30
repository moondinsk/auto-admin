import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";
import { reset } from "styled-reset";

export const GlobalStyle = createGlobalStyle`
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

  .flex-box {
    display: flex;

    &.ac { align-items: center; }
    &.jc { justify-content: center; }
    &.jb { justify-content: space-between; }
    &.col { flex-direction: column; }
  }


`;
