import React, { useEffect } from "react";
import Button from "@/components/Button/Button";
import { theme } from "@/styles/theme";
import { Dim, ModalBody, ModalFooter, ModalHeader, ModalPanel } from "./Modal.styles";
import { showToast } from "@/utils/toast";

const Modal = ({
  title = "",
  message = "",
  children,
  contentComponent: ContentComponent,
  contentProps = {},
  width,
  maxHeight,
  onClose,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "",
  successToastMessage = "",
  isTop = true,
  zIndex = 1000,
}) => {
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

    if (successToastMessage) {
      showToast(successToastMessage);
    }

    onClose?.();
  };

  useEffect(() => {
    if (!isTop) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel?.();
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isTop, onCancel, onClose]);

  const renderedContent = children || (ContentComponent ? <ContentComponent {...contentProps} /> : message);

  return (
    <Dim className="modal-dim" $isTop={isTop} $zIndex={zIndex} onClick={handleCancel}>
      <ModalPanel className="modal-panel" $width={width} $maxHeight={maxHeight} onClick={(e) => e.stopPropagation()}>
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
