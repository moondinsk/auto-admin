import React from "react";
import Button from "@/components/Button/Button";
import { toastStore } from "@/store";
import { theme } from "@/styles/theme";
import { Dim, ModalBody, ModalFooter, ModalHeader, ModalPanel } from "./Modal.styles";

const Modal = ({
  title = "",
  message = "",
  children,
  onClose,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
}) => {
  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    toastStore.show("확인되었습니다.");
    onClose?.();
  };

  return (
    <Dim onClick={handleCancel}>
      <ModalPanel onClick={(e) => e.stopPropagation()}>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalBody>{children || message}</ModalBody>
        <ModalFooter>
          <Button outlined color={theme.colors.palette.gray800} onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm}>{confirmText}</Button>
        </ModalFooter>
      </ModalPanel>
    </Dim>
  );
};

export default Modal;
