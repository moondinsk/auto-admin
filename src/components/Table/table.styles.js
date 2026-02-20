import { theme } from "@/styles/theme";
import Select from "react-select";
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
      button {
        margin: 0 auto;
      }
    `}

  /* 폼 테이블 */
  ${({ $variant }) =>
    $variant === "form" &&
    css`
      border-top: 1px solid #dedcec;
      th,
      td {
        padding: 12px 24px;
        border-bottom: 1px solid #dedcec;
      }
      th {
        width: 220px;
        background: ${({ theme }) => theme.colors.bg?.subtle || theme.colors.palette.gray100};
        font-weight: 600;
      }
      td {
        text-align: left;
        background: ${({ theme }) => theme.colors.gray.white};
      }
    `}
`;

// 필수 입력 표시 스타일
export const Required = styled.span`
  margin-left: 4px;
  color: ${({ theme }) => theme.colors.error.main};
`;

// 셀렉트 스타일
export const SelectInputWrapper = styled.div`
  display: flex;
  gap: 10px;
  .react-select__control {
    width: 150px;
  }

  .custom-select {
    flex: none;
  }
`;

// 체크박스, 라디오 버튼 스타일
export const ChoiceInput = styled.div`
  display: flex;
  gap: 20px;
  label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.primary};
    input {
      margin: 0;
    }
  }
`;

// 날짜 범위 선택 스타일
export const DateRangeWrapper = styled.div`
  display: flex;
  gap: 10px;

  .date-inputs {
    display: flex;
    gap: 10px;
    align-items: center;

    .separator {
      color: #999;
      font-weight: 500;
    }
  }

  .date-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    button {
      padding: 6px 12px;
      border: 1px solid #ddd;
      background: #fff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;

      &:hover {
        border-color: ${({ theme }) => theme.colors.primary.main};
        color: ${({ theme }) => theme.colors.primary.main};
      }

      &.is-active {
        background: ${({ theme }) => theme.colors.primary.main};
        color: #fff;
        border-color: ${({ theme }) => theme.colors.primary.main};
      }
    }
  }
`;

// 날짜 입력 스타일
export const DateInputWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__tab-loop {
    position: absolute;
    left: 0;
    top: 0;
  }

  .react-datepicker {
    position: absolute;
    transform: translateX(-50%);
  }

  .date-picker-input {
    width: 100%;
    padding: 8px 12px 8px 36px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary.main};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary.main}22;
    }

    &::placeholder {
      color: #999;
    }
  }

  .calendar-icon {
    position: absolute;
    left: 12px;
    font-size: 16px;
    color: #666;
    pointer-events: none;
  }
`;

// 페이지네이션 스타일
export const ListPagination = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

// 페이지당 항목 수 선택 스타일
export const PerPageControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .custom-select {
    width: 120px;
  }

  .label {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 13px;
  }
`;

// 페이지네이션 버튼 스타일
export const PageButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  button {
    min-width: 34px;
    height: 34px;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.gray.white};
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 13px;
    cursor: pointer;
    padding: 0 10px;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &.is-active {
      border-color: ${({ theme }) => theme.colors.primary.main};
      background: ${({ theme }) => theme.colors.primary.main};
      color: ${({ theme }) => theme.colors.text.inverse};
    }
  }
`;
