import styled from "styled-components";

export const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: ${({ theme }) => `${theme.colors.palette.gray900}66`};
`;

export const ModalPanel = styled.div`
  width: 100%;
  max-width: 520px;
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
