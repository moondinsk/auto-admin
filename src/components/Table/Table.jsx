import React from "react";
import { observer } from "mobx-react-lite";
import {
  ChoiceInput,
  DateInputWrapper,
  DateRangeWrapper,
  FileInputWrapper,
  ListPagination,
  PageButtons,
  Required as TableRequiredChk,
  StyledTable,
  TableWrap,
} from "./table.styles";
import Select from "react-select";
import { MdCalendarToday } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
const Table = ({ variant = "list", children, className }) => {
  return (
    <TableWrap className={className} $variant={variant}>
      <StyledTable $variant={variant}>{children}</StyledTable>
    </TableWrap>
  );
};

export function ListTable({
  columns,
  rows,
  rowKey = "id",
  renderCell,
  pagination = false,
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const goToPage = (nextPage) => {
    onPageChange(nextPage);
    return;
  };

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
          {rows.length ? (
            rows.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align || "center" }}>
                    {renderCell ? renderCell(row, col) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
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
        <ListPagination className="flex-box ac jc">
          <PageButtons>
            <button type="button" onClick={() => goToPage(1)} disabled={currentPage === 1}>
              처음
            </button>
            <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              이전
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  disabled={isActive}
                  className={isActive ? "is-active" : ""}>
                  {page}
                </button>
              );
            })}

            <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              다음
            </button>
            <button type="button" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
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
    <Table variant="info">
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
 *  - formRows: 행별 필드 정의 배열 (각 행은 label+input 쌍 배열)
 *  - formData: 현재 폼 값 객체
 *  - handleFormChange: 상위에서 내려주는 공통 변경 핸들러
 *  - renderComponent: 필드 컴포넌트를 감싸는 선택적 렌더 함수
 * ========================================================= */
function renderField(
  field,
  formData,
  handleChange,
  { handleDateChange, activeDateButton, handleDateButtonClick } = {},
) {
  switch (field.type) {
    case "input":
      return (
        <input
          type="text"
          name={field.name}
          value={formData?.[field.name] ?? ""}
          placeholder={field.placeholder ?? ""}
          onChange={handleChange}
        />
      );

    case "textarea":
      return (
        <textarea
          name={field.name}
          value={formData?.[field.name] ?? ""}
          placeholder={field.placeholder ?? ""}
          onChange={handleChange}
          rows={4}
        />
      );

    case "select":
      return (
        <Select
          isSearchable={false}
          className="custom-select"
          classNamePrefix="react-select"
          name={field.name}
          options={field.options ?? []}
          placeholder={field.placeholder ?? "선택하세요"}
          value={field.options?.find((option) => option.value === formData?.[field.name]) ?? field.options?.[0]}
          onChange={(selectedOption) => {
            handleChange({
              target: {
                name: field.name,
                value: selectedOption?.value ?? "",
              },
            });
          }}
        />
      );

    case "select-input":
      return (
        <div className="flex-box gap-10">
          <Select
            isSearchable={false}
            className="custom-select"
            classNamePrefix="react-select"
            name={field.selectName}
            options={field.selectOptions ?? []}
            placeholder={field.selectPlaceholder ?? "선택하세요"}
            value={
              field.selectOptions?.find((option) => option.value === formData?.[field.selectName]) ??
              field.selectOptions?.[0]
            }
            onChange={(selectedOption) => {
              handleChange({
                target: {
                  name: field.selectName,
                  value: selectedOption?.value ?? "",
                },
              });
            }}
            styles={{
              container: (base) => ({
                ...base,
                width: 200,
              }),
            }}
          />

          <input
            type="text"
            name={field.inputName}
            value={formData?.[field.inputName] ?? ""}
            placeholder={field.inputPlaceholder ?? ""}
            onChange={handleChange}
          />
        </div>
      );

    case "checkbox":
      return (
        <ChoiceInput>
          {field.options?.map((option) => {
            const checkedValues = formData?.[field.name] ?? [];
            const checked = checkedValues.includes(option.value);

            return (
              <label key={option.value}>
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  checked={checked}
                  onChange={(e) => {
                    const prev = formData?.[field.name] ?? [];

                    const nextValues = e.target.checked
                      ? [...prev, option.value]
                      : prev.filter((v) => v !== option.value);

                    handleChange({
                      target: {
                        name: field.name,
                        value: nextValues,
                      },
                    });
                  }}
                />
                {option.label}
              </label>
            );
          })}
        </ChoiceInput>
      );

    case "radio":
      return (
        <ChoiceInput>
          {field.options?.map((option) => {
            const checked = formData?.[field.name] === option.value;

            return (
              <label key={option.value}>
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={checked}
                  onChange={(e) => {
                    handleChange({
                      target: {
                        name: field.name,
                        value: e.target.value,
                      },
                    });
                  }}
                />
                {option.label}
              </label>
            );
          })}
        </ChoiceInput>
      );

    case "file":
      return (
        <FileInputWrapper>
          <div className="file-name">
            {formData?.[field.name]?.name || "파일을 선택하세요."}
          </div>
          <label className="file-trigger">
            {field.fileButtonText ?? "파일 선택"}
            <input
              name={field.name}
              type="file"
              accept={field.accept}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: field.name,
                    value: e.target.files?.[0] || null,
                  },
                })
              }
            />
          </label>
        </FileInputWrapper>
      );

    case "date-range": {
      const isAllDateRange = !formData?.[field.startName] && !formData?.[field.endName];

      return (
        <DateRangeWrapper>
          {field.selectName ? (
            <Select
              isSearchable={false}
              className="custom-select"
              classNamePrefix="react-select"
              name={field.selectName}
              options={field.selectOptions ?? []}
              placeholder={field.selectPlaceholder ?? "선택하세요"}
              value={
                field.selectOptions?.find((option) => option.value === formData?.[field.selectName]) ??
                field.selectOptions?.[0]
              }
              onChange={(selectedOption) => {
                handleChange({
                  target: {
                    name: field.selectName,
                    value: selectedOption?.value ?? "",
                  },
                });
              }}
              styles={{
                container: (base) => ({
                  ...base,
                  width: field.selectWidth ?? 160,
                  flexShrink: 0,
                }),
              }}
            />
          ) : null}
          <div className="date-buttons">
            {field.dateButtons?.map((btn) => (
              <button
                key={btn.value}
                type="button"
                className={`${
                  isAllDateRange
                    ? btn.value === "all"
                      ? "is-active"
                      : ""
                    : activeDateButton === btn.value
                      ? "is-active"
                      : ""
                }`}
                onClick={() => handleDateButtonClick(btn)}>
                {btn.label}
              </button>
            ))}
          </div>
          
          <div className="date-inputs">
            <DateInputWrapper>
              <DatePicker
                selected={formData?.[field.startName] ? new Date(formData[field.startName]) : null}
                onChange={(date) => handleDateChange(field.startName, date)}
                placeholderText={field.startPlaceholder || "시작 날짜"}
                dateFormat="yyyy-MM-dd"
                className="date-picker-input"
              />
              <MdCalendarToday className="calendar-icon" />
            </DateInputWrapper>

            <span className="separator">~</span>

            <DateInputWrapper>
              <DatePicker
                selected={formData?.[field.endName] ? new Date(formData[field.endName]) : null}
                onChange={(date) => handleDateChange(field.endName, date)}
                placeholderText={field.endPlaceholder || "종료 날짜"}
                dateFormat="yyyy-MM-dd"
                className="date-picker-input"
              />
              <MdCalendarToday className="calendar-icon" />
            </DateInputWrapper>
          </div>
        </DateRangeWrapper>
      );
    }

    default:
      return null;
  }
}
export const FormTable = observer(({
  formRows = [],
  formData,
  handleFormChange,
  handleDateChange,
  activeDateButton,
  handleDateButtonClick,
  renderComponent,
}) => {
  const renderFieldComponent = (field) => {
    const fieldComponent = renderField(field, formData, handleFormChange, {
      handleDateChange,
      activeDateButton,
      handleDateButtonClick,
    });

    return renderComponent ? renderComponent(fieldComponent, field) : fieldComponent;
  };

  const normalizedRows = Array.isArray(formRows)
    ? formRows.filter((row) => Array.isArray(row) && row.length > 0)
    : [];

  return (
    <Table variant="form">
      <tbody>
        {normalizedRows.map((row, rowIndex) => (
          <tr key={`form-row-${rowIndex}`}>
            {row.map((field, fieldIndex) => (
              <React.Fragment key={field.key ?? `${rowIndex}-${fieldIndex}`}>
                <th>
                  {field.label}
                  {field.required && <TableRequiredChk>*</TableRequiredChk>}
                </th>
                <td colSpan={field?.colSpan}>{renderFieldComponent(field)}</td>
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
});

export default Table;