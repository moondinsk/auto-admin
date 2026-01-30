import { theme } from "@/styles/theme";
import styled, { css } from "styled-components";

export const TableWrap = styled.div``;

export const StyledTable = styled.table`
  width: 100%;
  table-layout: fixed;

  th,
  td {
    vertical-align: middle;
  }

  /* 리스트 테이블 */
  ${({ $variant }) =>
    $variant === "list" &&
    css`
      th {
        font-weight: 500;
        background: ${theme.colors.palette.gray100};
        font-size: 13px;
        height: 44px;
      }
      td {
        padding: 20px 0;
        border-bottom: 1px solid ${theme.colors.palette.gray100};
      }
    `}

  /* 폼 테이블 */
  ${({ $variant }) =>
    $variant === "form" &&
    css`
      th {
        width: 220px;
        text-align: left;
        background: ${({ theme }) => theme.colors.bg?.subtle || theme.colors.palette.gray100};
        font-weight: 600;
      }

      td {
        text-align: left;
        background: ${({ theme }) => theme.colors.gray.white};
      }
    `}
`;

export const Required = styled.span`
  margin-left: 4px;
  color: ${({ theme }) => theme.colors.error.main};
`;
