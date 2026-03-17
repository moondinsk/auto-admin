import React, { useEffect } from "react";
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
  onClose,
  closeFunc,
  confirmFunc,
  cancelFunc,
  confirmText = "확인",
  cancelText = "취소",
  isTop = true,
  zIndex = 1000,
  ...contentProps
}) => {
  const isConfirmModal = type === "confirm";

  const runModalAction = async (action) => {
    if (!isTop) {
      return;
    }

    try {
      await action?.();
    } catch {
      return;
    }

    onClose?.();
  };

  const handleRequestClose = () => {
    void runModalAction(closeFunc);
  };

  const handleCancel = () => {
    void runModalAction(cancelFunc);
  };

  const handleConfirm = () => {
    void runModalAction(confirmFunc);
  };

  useEffect(() => {
    if (!isTop) {
      return undefined;
    }

    const onKeyDown = async (event) => {
      if (event.key !== "Escape") {
        return;
      }

      const action = isConfirmModal ? cancelFunc : closeFunc;
      try {
        await action?.();
      } catch {
        return;
      }
      onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cancelFunc, closeFunc, isConfirmModal, isTop, onClose]);

  const renderedContent =
    children || (ContentComponent ? <ContentComponent {...contentProps} message={message} /> : message);
  return (
    <Dim
      className="modal-dim"
      $isTop={isTop}
      $zIndex={zIndex}
      onClick={isConfirmModal ? handleCancel : handleRequestClose}>
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
