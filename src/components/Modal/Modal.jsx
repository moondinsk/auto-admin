import React, { useEffect } from "react";
import Button from "@/components/Button/Button";
import { theme } from "@/styles/theme";
import { Dim, ModalBody, ModalFooter, ModalHeader, ModalPanel } from "./Modal.styles";

const Modal = ({
  type = "default",
  title = "",
  message = "",
  children,
  component: ContentComponent,
  width,
  maxHeight,
  onClose,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  isTop = true,
  zIndex = 1000,
  ...contentProps
}) => {
  const isConfirmModal = type === "confirm";

  const handleCancel = () => {
    if (!isTop) {
      return;
    }

    onCancel?.();
    onClose?.();
  };

  const handleConfirm = () => {
    if (!isTop) {
      return;
    }

    onConfirm?.();
    onClose?.();
  };

  useEffect(() => {
    if (!isTop) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isConfirmModal) {
          onCancel?.();
        }
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isConfirmModal, isTop, onCancel, onClose]);

  const renderedContent =
    children || (ContentComponent ? <ContentComponent {...contentProps} message={message} /> : message);
  return (
    <Dim className="modal-dim" $isTop={isTop} $zIndex={zIndex} onClick={isConfirmModal ? handleCancel : undefined}>
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
