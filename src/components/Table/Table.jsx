import React from "react";
import { Required, StyledTable, TableWrap } from "./table.styles";

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
              {f.type === "textarea" ? (
                <textarea
                  name={f.name}
                  value={values[f.name] || ""}
                  onChange={onChange}
                  placeholder={f.placeholder}
                  rows={f.rows || 4}
                />
              ) : (
                <input name={f.name} value={values[f.name] || ""} onChange={onChange} placeholder={f.placeholder} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default Table;
