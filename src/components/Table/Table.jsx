import React, { useMemo, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdCalendarToday } from "react-icons/md";
import { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import {
  Required,
  StyledTable,
  TableWrap,
  SelectInputWrapper,
  ChoiceInput,
  DateRangeWrapper,
  DateInputWrapper,
  ListPagination,
  PerPageControl,
  PageButtons,
} from "./table.styles";

/* =========================================================
 * 1) 공통 Table 래퍼 컴포넌트
 *  - variant(list/form)에 따라 스타일/레이아웃을 다르게 적용
 *  - children으로 thead/tbody 등 테이블 구조를 전달받음
 * ========================================================= */
const Table = ({ variant = "list", children, className }) => {
  return (
    <TableWrap className={className} $variant={variant}>
      <StyledTable $variant={variant}>{children}</StyledTable>
    </TableWrap>
  );
};

/* =========================================================
 * 2) ListTable (목록형 테이블)
 *  - columns: 헤더/정렬/폭/키 정보
 *  - rows: 실제 데이터 배열
 *  - renderCell: 셀 커스텀 렌더링 옵션 (없으면 row[col.key] 출력)
 * ========================================================= */
export function ListTable({
  columns,
  rows,
  rowKey = "id",
  renderCell,
  pagination = false,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  defaultPageSize = DEFAULT_PAGE_SIZE,
  showPerPageControl = true,
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) {
  const isControlledPagination =
    pagination && typeof onPageChange === "function" && Number.isFinite(Number(totalCount));

  // 페이지네이션 상태: 선택된 페이지 크기, 현재 페이지
  const [selectedPageSize, setSelectedPageSize] = useState(
    pageSizeOptions.find((option) => option.value === defaultPageSize) || pageSizeOptions[0],
  );

  // 현재 페이지 상태 (1부터 시작)
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);

  /* =====================================================
      페이지네이션 계산
  ===================================================== */
  const safePageSize = isControlledPagination
    ? Math.max(1, Number(pageSize) || defaultPageSize || 10)
    : selectedPageSize?.value || defaultPageSize || 10;
  const safeTotalCount = isControlledPagination ? Math.max(0, Number(totalCount) || 0) : rows.length;
  const totalPages = Math.max(1, Math.ceil(safeTotalCount / safePageSize));
  const safeCurrentPage = Math.min(
    isControlledPagination ? Math.max(1, Number(currentPage) || 1) : internalCurrentPage,
    totalPages,
  );

  const goToPage = (nextPage) => {
    if (isControlledPagination) {
      onPageChange(nextPage);
      return;
    }

    setInternalCurrentPage(nextPage);
  };

  // 현재 페이지에 해당하는 데이터 슬라이스 (useMemo로 최적화)
  const paginatedRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * safePageSize;
    return rows.slice(start, start + safePageSize);
  }, [rows, safeCurrentPage, safePageSize]);

  // 제어형에서 totalCount가 rows.length보다 크고 rows가 pageSize 이하이면 외부 페이징된 rows로 간주
  const isExternallyPaginatedRows =
    isControlledPagination && safeTotalCount > rows.length && rows.length <= safePageSize;

  // pagination이 true일 때: 외부 페이징 rows는 그대로, 그 외에는 내부 계산 페이지를 렌더
  const rowsToRender = pagination ? (isExternallyPaginatedRows ? rows : paginatedRows) : rows;

  const renderRow = (row) => (
    <tr key={row[rowKey]}>
      {columns.map((col) => (
        <td key={col.key} style={{ textAlign: col.align || "center" }}>
          {renderCell ? renderCell(row, col) : row[col.key]}
        </td>
      ))}
    </tr>
  );

  return (
    <>
      <Table variant="list">
        {/* ---------- 2-1) 헤더 영역 ---------- */}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width, textAlign: col.align || "center" }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* ---------- 2-2) 바디(데이터) 영역 ---------- */}
        <tbody>
          {rowsToRender.length > 0 ? (
            rowsToRender.map((row) => renderRow(row))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                데이터가 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {pagination && (
        <ListPagination $onlyPageButtons={!showPerPageControl}>
          {showPerPageControl && !isControlledPagination && (
            <PerPageControl>
              <Select
                className="custom-select"
                classNamePrefix="react-select"
                options={pageSizeOptions}
                value={selectedPageSize}
                isSearchable={false}
                onChange={(option) => {
                  setSelectedPageSize(
                    option || pageSizeOptions.find((item) => item.value === defaultPageSize) || pageSizeOptions[0],
                  );
                  setInternalCurrentPage(1);
                }}
              />
              <span className="label">개씩 보기</span>
            </PerPageControl>
          )}
          <PageButtons>
            <button type="button" onClick={() => goToPage(1)} disabled={safeCurrentPage === 1}>
              처음
            </button>

            <button
              type="button"
              onClick={() => goToPage(Math.max(1, safeCurrentPage - 1))}
              disabled={safeCurrentPage === 1}>
              이전
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  type="button"
                  className={safeCurrentPage === page ? "is-active" : ""}
                  onClick={() => goToPage(page)}>
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => goToPage(Math.min(totalPages, safeCurrentPage + 1))}
              disabled={safeCurrentPage === totalPages}>
              다음
            </button>

            <button type="button" onClick={() => goToPage(totalPages)} disabled={safeCurrentPage === totalPages}>
              마지막
            </button>
          </PageButtons>
        </ListPagination>
      )}
    </>
  );
}

/* =========================================================
 * 3) InfoTable (조회형 정보 테이블)
 *  - rows: 각 행을 구성하는 label/value 쌍 배열
 *  - 행마다 쌍 개수가 달라도 되고, 전체 폭 안에서 각 쌍의 너비를 자동 분배
 * ========================================================= */
export function InfoTable({ rows = [], emptyMessage = "데이터가 없습니다" }) {
  const normalizedRows = Array.isArray(rows) ? rows.filter((row) => Array.isArray(row) && row.length > 0) : [];

  const maxPairCount = normalizedRows.reduce((acc, row) => Math.max(acc, row.length), 0);
  const totalColumns = Math.max(2, maxPairCount * 2);

  return (
    <Table variant="form">
      <tbody>
        {normalizedRows.length > 0 ? (
          normalizedRows.map((row, rowIndex) => (
            <tr key={`info-row-${rowIndex}`}>
              {row.map((cell, cellIndex) => {
                const rowPairCount = row.length;
                const basePairWidth = Math.floor(totalColumns / rowPairCount);
                const extraColumns = totalColumns % rowPairCount;
                const pairWidth = basePairWidth + (cellIndex < extraColumns ? 1 : 0);
                const safeColSpan =
                  cell?.colSpan != null ? Math.max(1, Number(cell.colSpan) || 1) : Math.max(1, pairWidth - 1);

                return (
                  <React.Fragment key={cell?.key || `${rowIndex}-${cellIndex}`}>
                    <th>{cell?.label ?? "-"}</th>
                    <td colSpan={safeColSpan}>{cell?.value ?? "-"}</td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={totalColumns} style={{ textAlign: "center" }}>
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

/* =========================================================
 * 4) FormTable (입력 폼형 테이블)
 *  - fields: 폼 필드 정의 배열 (type, name, label, options 등)
 *  - values: 현재 폼 값 객체
 *  - onChange: 상위에서 내려주는 공통 변경 핸들러
 *  - columns: 한 행에 몇 개의 "필드(label+input)"를 배치할지
 * ========================================================= */
export function FormTable({ fields, values, onChange, columns = 1 }) {
  /* ---------- 3-1) 내부 상태: 날짜 버튼 활성값 ---------- */
  const [activeDateButton, setActiveDateButton] = useState(null);

  /* ---------- 3-2) columns 값 정규화 (최소 1) ---------- */
  const normalizedColumns = Math.max(1, Number(columns) || 1);

  /* =====================================================
   * 3-3) 유틸 핸들러: DatePicker -> yyyy-mm-dd 문자열로 변환하여 onChange 형태로 전달
   * ===================================================== */
  const handleDateChange = (fieldName, date) => {
    const dateStr = date ? date.toISOString().split("T")[0] : "";
    onChange({
      target: {
        name: fieldName,
        value: dateStr,
      },
    });
  };

  /* =====================================================
   * 3-4) 유틸 핸들러: 날짜 범위 버튼 클릭 처리
   *  - activeDateButton 업데이트
   *  - 버튼 정의(btn.onClick)를 실행 (onChange 전달)
   * ===================================================== */
  const handleDateButtonClick = (btn) => {
    setActiveDateButton(btn.value);
    btn.onClick(onChange);
  };

  /* =====================================================
   * 3-5) 필드 타입별 컨트롤 렌더러
   *  - field.type에 따라 Select / textarea / radio / checkbox / date-range / input 렌더
   * ===================================================== */
  const renderFieldControl = (f) => {
    /* ---------- 3-5-1) Select (단일) ---------- */
    if (f.type === "select") {
      return (
        <Select
          className="custom-select"
          classNamePrefix="react-select"
          name={f.name}
          options={f.options}
          placeholder={f.placeholder}
          value={f.options?.find((opt) => opt.value === values[f.name]) || null}
          onChange={(selectedOption) =>
            onChange({
              target: {
                name: f.name,
                value: selectedOption ? selectedOption.value : "",
              },
            })
          }
        />
      );
    }

    /* ---------- 3-5-2) Select + Input (콤보) ---------- */
    if (f.type === "select-input") {
      return (
        <SelectInputWrapper>
          <Select
            className="custom-select"
            classNamePrefix="react-select"
            name={f.selectName}
            options={f.selectOptions}
            placeholder={f.selectPlaceholder}
            value={f.selectOptions?.find((opt) => opt.value === values[f.selectName]) || null}
            onChange={(selectedOption) =>
              onChange({
                target: {
                  name: f.selectName,
                  value: selectedOption ? selectedOption.value : "",
                },
              })
            }
            styles={{ container: (base) => ({ ...base, flex: 1 }) }}
          />
          <input
            name={f.inputName}
            value={values[f.inputName] || ""}
            onChange={onChange}
            placeholder={f.inputPlaceholder}
            type="text"
            style={{ flex: 1 }}
          />
        </SelectInputWrapper>
      );
    }

    /* ---------- 3-5-3) Textarea ---------- */
    if (f.type === "textarea") {
      return (
        <textarea
          name={f.name}
          value={values[f.name] || ""}
          onChange={onChange}
          placeholder={f.placeholder}
          rows={f.rows || 4}
        />
      );
    }

    /* ---------- 3-5-4) Radio ---------- */
    if (f.type === "radio") {
      return (
        <ChoiceInput>
          {f.options?.map((opt) => (
            <label key={opt.value} htmlFor={`${f.name}-${opt.value}`}>
              <input
                type="radio"
                id={`${f.name}-${opt.value}`}
                name={f.name}
                value={opt.value}
                checked={String(values[f.name]) === String(opt.value)}
                onChange={() => {
                  onChange({
                    target: {
                      name: f.name,
                      value: opt.value,
                    },
                  });
                }}
              />
              {opt.label}
            </label>
          ))}
        </ChoiceInput>
      );
    }

    /* ---------- 3-5-5) Checkbox (다중 선택) ---------- */
    if (f.type === "checkbox") {
      return (
        <ChoiceInput>
          {f.options?.map((opt) => (
            <label key={opt.value} htmlFor={`${f.name}-${opt.value}`}>
              <input
                type="checkbox"
                id={`${f.name}-${opt.value}`}
                name={f.name}
                value={opt.value}
                checked={values[f.name]?.includes(opt.value)}
                onChange={(e) => {
                  const { checked } = e.target;

                  // 체크되면 추가, 해제되면 제거
                  const newValue = checked
                    ? [...(values[f.name] || []), opt.value]
                    : (values[f.name] || []).filter((v) => v !== opt.value);

                  onChange({ target: { name: f.name, value: newValue } });
                }}
              />
              {opt.label}
            </label>
          ))}
        </ChoiceInput>
      );
    }

    /* ---------- 3-5-6) Date Range (시작~종료 + 빠른 버튼) ---------- */
    if (f.type === "date-range") {
      const isAllDateRange = !values[f.startName] && !values[f.endName];

      return (
        <DateRangeWrapper>
          {/* 날짜 입력 2개(시작/종료) */}
          <div className="flex-box ac gap-10">
            <DateInputWrapper>
              <DatePicker
                selected={values[f.startName] ? new Date(values[f.startName]) : null}
                onChange={(date) => handleDateChange(f.startName, date)}
                placeholderText={f.startPlaceholder || "시작 날짜"}
                dateFormat="yyyy-MM-dd"
                className="date-picker-input"
              />
              <MdCalendarToday className="calendar-icon" />
            </DateInputWrapper>

            <span className="separator">~</span>

            <DateInputWrapper>
              <DatePicker
                selected={values[f.endName] ? new Date(values[f.endName]) : null}
                onChange={(date) => handleDateChange(f.endName, date)}
                placeholderText={f.endPlaceholder || "종료 날짜"}
                dateFormat="yyyy-MM-dd"
                className="date-picker-input"
              />
              <MdCalendarToday className="calendar-icon" />
            </DateInputWrapper>
          </div>

          {/* 빠른 선택 버튼들(예: 오늘/1주/1개월 등) */}
          <div className="date-buttons">
            {f.dateButtons?.map((btn) => (
              <button
                key={btn.value}
                className={`${
                  isAllDateRange
                    ? btn.value === "all"
                      ? "is-active"
                      : ""
                    : activeDateButton === btn.value
                      ? "is-active"
                      : ""
                }`}
                type="button"
                onClick={() => handleDateButtonClick(btn)}>
                {btn.label}
              </button>
            ))}
          </div>
        </DateRangeWrapper>
      );
    }

    /* ---------- 3-5-7) 기본 Input (text) ---------- */
    return (
      <input name={f.name} value={values[f.name] || ""} onChange={onChange} placeholder={f.placeholder} type="text" />
    );
  };

  /* =========================================================
   * 3-6) 테이블 행 구성 로직 (colSpan 기반 배치)
   *  - 한 "필드"는 (th 1칸 + td colSpan 칸) 만큼의 unit을 사용
   *  - normalizedColumns 기준으로 한 행의 최대 unit = columns * 2
   *    (필드 1개당 th/td 2개 셀 구조이므로 *2 개념)
   * ========================================================= */
  const maxRowUnits = normalizedColumns * 2;
  const formRows = [];
  let currentRow = [];
  let usedUnits = 0;

  fields.forEach((field) => {
    // td colSpan 안전 처리
    const parsedColSpan = Number(field.colSpan);
    const tdColSpan = Math.max(1, Number.isNaN(parsedColSpan) ? 1 : parsedColSpan);

    // 행 최대치를 넘지 않도록 상한 보정 (최소 1, 최대 maxRowUnits-1)
    const safeTdColSpan = Math.min(tdColSpan, Math.max(1, maxRowUnits - 1));

    // 필드 1개가 소비하는 unit: th(1) + td(colSpan)
    const fieldUnits = 1 + safeTdColSpan;

    // 현재 행에 넣으면 넘치면 행을 닫고 새 행 시작
    if (usedUnits + fieldUnits > maxRowUnits) {
      formRows.push(currentRow);
      currentRow = [];
      usedUnits = 0;
    }

    currentRow.push({ field, tdColSpan: safeTdColSpan });
    usedUnits += fieldUnits;
  });

  // 마지막 행 처리
  if (currentRow.length > 0) {
    formRows.push(currentRow);
  }

  /* =========================================================
   * 3-7) 렌더링: formRows를 돌며 (th + td) 구조로 출력
   *  - 필드별 key: field.key || field.name || fallback
   *  - required 표시: Required 컴포넌트로 *
   * ========================================================= */
  return (
    <Table variant="form">
      <tbody>
        {formRows.map((rowFields, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {rowFields.map(({ field, tdColSpan }, fieldIndex) => (
              <React.Fragment key={field.key || field.name || `${rowIndex}-${fieldIndex}`}>
                <th>
                  {field.label}
                  {field.required && <Required>*</Required>}
                </th>
                <td colSpan={tdColSpan}>{renderFieldControl(field)}</td>
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

/* =========================================================
 * 4) 기본 export: 공통 Table 래퍼
 * ========================================================= */
export default Table;
