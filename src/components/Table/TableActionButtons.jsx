import React from "react";
import Button from "@/components/Button/Button";
import { TableActionButtonsWrap } from "./TableActionButtons.styles";

const TableActionButtons = ({ buttons = [] }) => {
  return (
    <TableActionButtonsWrap>
      {buttons.map((button, index) => {
        const { label, onClick, outlined = true, color, disabled = false, size, radius, fullWidth, icon } = button;

        return (
          <Button
            key={`${label}-${index}`}
            outlined={outlined}
            color={color}
            disabled={disabled}
            size={size}
            radius={radius}
            fullWidth={fullWidth}
            onClick={onClick}>
            {icon}
            {label}
          </Button>
        );
      })}
    </TableActionButtonsWrap>
  );
};

export default TableActionButtons;
