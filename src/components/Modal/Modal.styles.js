import styled from "styled-components";

export const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex = 1000 }) => $zIndex};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: ${({ theme }) => `${theme.colors.palette.gray900}66`};
`;

export const ModalPanel = styled.div`
  width: ${({ $width }) => {
    if (!$width) return "100%";
    return typeof $width === "number" ? `${$width}px` : $width;
  }};
  max-width: ${({ $width }) => {
    if (!$width) return "520px";
    return typeof $width === "number" ? `${$width}px` : $width;
  }};
  max-height: ${({ $maxHeight }) => {
    if (!$maxHeight) return "auto";
    return typeof $maxHeight === "number" ? `${$maxHeight}px` : $maxHeight;
  }};

  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gray.white};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
`;

export const ModalBody = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`;
