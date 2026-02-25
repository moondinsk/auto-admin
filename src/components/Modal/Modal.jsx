import React from "react";
import Button from "@/components/Button/Button";
import { toastStore } from "@/store";
import { theme } from "@/styles/theme";
import { Dim, ModalBody, ModalFooter, ModalHeader, ModalPanel } from "./Modal.styles";

const Modal = ({
  title = "",
  message = "",
  children,
  contentComponent: ContentComponent,
  contentProps = {},
  width,
  height,
  onClose,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "",
  successToastMessage = "",
}) => {
  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();

    if (successToastMessage) {
      toastStore.show(successToastMessage);
    }

    onClose?.();
  };
  const renderedContent = children || (ContentComponent ? <ContentComponent {...contentProps} /> : message);

  return (
    <Dim className="modal-dim" onClick={handleCancel}>
      <ModalPanel className="modal-panel" $width={width} $height={height} onClick={(e) => e.stopPropagation()}>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalBody>{renderedContent}</ModalBody>
        <ModalFooter>
          {cancelText && (
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
