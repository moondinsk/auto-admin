import styled from "styled-components";
import { theme } from "@/styles/theme";

export const ToastViewport = styled.div`
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  z-index: 1200;
  pointer-events: none;
`;

export const ToastItem = styled.div`
  min-width: 220px;
  max-width: 360px;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${theme.colors.palette.gray900};
  color: ${theme.colors.palette.white};
  font-size: 14px;
  line-height: 1.4;
  text-align: center;
`;
