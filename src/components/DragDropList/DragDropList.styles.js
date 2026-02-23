import styled from "styled-components";

export const DndList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  box-sizing: border-box;
`;

export const DndItem = styled.li`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray.white};
  box-sizing: border-box;
`;

export const DndItemMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const DndChildren = styled.div`
  margin-left: 16px;
  min-height: 8px;
`;

export const DndMainText = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
`;

export const DndSubText = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 13px;
`;
