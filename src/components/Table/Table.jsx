import React from "react";
import {
  ChoiceInput,
  DateInputWrapper,
  DateRangeWrapper,
  ListPagination,
  PageButtons,
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
 * 4) FormTable (입력 폼형 테이블)
 *  - fields: 폼 필드 정의 배열 (type, name, label, options 등)
 *  - values: 현재 폼 값 객체
 *  - onChange: 상위에서 내려주는 공통 변경 핸들러
 *  - columns: 한 행에 몇 개의 "필드(label+input)"를 배치할지
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

    case "date-range": {
      const isAllDateRange = !formData?.[field.startName] && !formData?.[field.endName];

      return (
        <DateRangeWrapper>
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
        </DateRangeWrapper>
      );
    }

    default:
      return null;
  }
}
export function FormTable({
  fields,
  formData,
  handleFormChange,
  handleDateChange,
  activeDateButton,
  handleDateButtonClick,
}) {
  return (
    <Table variant="form">
      <tbody>
        {fields.map((field, index) => (
          <tr key={field.key ?? `row-${index}`}>
            <th>{field.label}</th>
            <td>
              {renderField(field, formData, handleFormChange, {
                handleDateChange,
                activeDateButton,
                handleDateButtonClick,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Table;
