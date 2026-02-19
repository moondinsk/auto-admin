import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdCalendarToday } from "react-icons/md";
import {
  Required,
  StyledTable,
  TableWrap,
  SelectInputWrapper,
  ChoiceInput,
  DateRangeWrapper,
  DateInputWrapper,
} from "./table.styles";

const Table = ({ variant = "list", children, className }) => {
  return (
    <TableWrap className={className} $variant={variant}>
      <StyledTable $variant={variant}>{children}</StyledTable>
    </TableWrap>
  );
};

/** ---------- list table ---------- */
export function ListTable({ columns, rows, rowKey = "id", renderCell }) {
  return (
    <Table variant="list">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{ width: col.width, textAlign: col.align || "center" }}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={row[rowKey]}>
            {columns.map((col) => (
              <td key={col.key} style={{ textAlign: col.align || "center" }}>
                {renderCell ? renderCell(row, col) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

/** ---------- form table ---------- */
export function FormTable({ fields, values, onChange }) {
  const [activeDateButton, setActiveDateButton] = useState(null);

  const handleDateChange = (fieldName, date, fieldStartName, fieldEndName) => {
    const dateStr = date ? date.toISOString().split("T")[0] : "";
    onChange({
      target: {
        name: fieldName,
        value: dateStr,
      },
    });
  };

  const handleDateButtonClick = (btn) => {
    setActiveDateButton(btn.value);
    btn.onClick(onChange);
  };

  return (
    <Table variant="form">
      <tbody>
        {fields.map((f) => (
          <tr key={f.key}>
            <th>
              {f.label}
              {f.required && <Required>*</Required>}
            </th>
            <td>
              {f.type === "select" ? (
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
              ) : f.type === "select-input" ? (
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
              ) : f.type === "textarea" ? (
                <textarea
                  name={f.name}
                  value={values[f.name] || ""}
                  onChange={onChange}
                  placeholder={f.placeholder}
                  rows={f.rows || 4}
                />
              ) : f.type === "radio" ? (
                <ChoiceInput>
                  {f.options?.map((opt) => (
                    <label key={opt.value} htmlFor={`${f.name}-${opt.value}`}>
                      <input
                        type="radio"
                        id={`${f.name}-${opt.value}`}
                        name={f.name}
                        value={opt.value}
                        checked={String(values[f.name]) === String(opt.value)}
                        onChange={(e) => {
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
              ) : f.type === "checkbox" ? (
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
              ) : f.type === "date-range" ? (
                <DateRangeWrapper>
                  <div className="date-inputs">
                    <DateInputWrapper>
                      <DatePicker
                        selected={values[f.startName] ? new Date(values[f.startName]) : null}
                        onChange={(date) => handleDateChange(f.startName, date, f.startName, f.endName)}
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
                        onChange={(date) => handleDateChange(f.endName, date, f.startName, f.endName)}
                        placeholderText={f.endPlaceholder || "종료 날짜"}
                        dateFormat="yyyy-MM-dd"
                        className="date-picker-input"
                      />
                      <MdCalendarToday className="calendar-icon" />
                    </DateInputWrapper>
                  </div>
                  <div className="date-buttons">
                    {f.dateButtons?.map((btn) => (
                      <button
                        key={btn.value}
                        className={`${activeDateButton === btn.value ? "is-active" : ""}`}
                        type="button"
                        onClick={() => handleDateButtonClick(btn)}>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </DateRangeWrapper>
              ) : (
                <input
                  name={f.name}
                  value={values[f.name] || ""}
                  onChange={onChange}
                  placeholder={f.placeholder}
                  type="text"
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Table;
