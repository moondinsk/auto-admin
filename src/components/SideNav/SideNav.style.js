import { theme } from "@/styles/theme";
import styled from "styled-components";

export const StyledAside = styled.aside`
  width: 250px;
  height: calc(100vh - ${theme.size.headerHeight});
  position: sticky;
  left: 0;
  top: ${theme.size.headerHeight};
  background: ${theme.colors.layout.sidebarBG};
  flex-shrink: 0;
`;
