import React from "react";
import Button from "@/components/Button/Button";
import { theme } from "@/styles/theme";
import { Dim, ModalBody, ModalFooter, ModalHeader, ModalPanel } from "./Modal.styles";

const Modal = ({
  type = "modal",
  title = "",
  message = "",
  children,
  component: ContentComponent,
  width,
  maxHeight,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  zIndex = 1000,
  ...contentProps
}) => {
  const isConfirmModal = type === "confirm";

  const handleCancel = () => {
    void onCancel?.();
  };

  const handleConfirm = () => {
    void onConfirm?.();
  };

  const renderedContent =
    children || (ContentComponent ? <ContentComponent {...contentProps} message={message} /> : message);
  return (
    <Dim
      className="modal-dim"
      $zIndex={zIndex}
      onClick={handleCancel}>
      <ModalPanel className="modal-panel" $width={width} $maxHeight={maxHeight} onClick={(e) => e.stopPropagation()}>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalBody>{renderedContent}</ModalBody>
        <ModalFooter>
          {isConfirmModal && (
            <Button outlined color={theme.colors.palette.gray800} onClick={handleCancel}>
              {cancelText}
            </Button>
          )}
          <Button onClick={handleConfirm}>{confirmText}</Button>
        </ModalFooter>
      </ModalPanel>
    </Dim>
  );
};

export default Modal;
