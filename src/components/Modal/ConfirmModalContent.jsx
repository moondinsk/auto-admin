import React from "react";
import Button from "@/components/Button/Button";
import { toastStore } from "@/store";
import { theme } from "@/styles/theme";
import { Dim, ModalBody, ModalFooter, ModalHeader, ModalPanel } from "./Modal.styles";

const ConfirmModalContent = ({
  title = "",
  message = "",
  contentComponent: ContentComponent,
  contentProps = {},
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  successToastMessage = "확인되었습니다.",
}) => {
  const handleCancel = () => {
    onCancel?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
    toastStore.show(successToastMessage);
  };

  const renderedContent = ContentComponent ? <ContentComponent {...contentProps} /> : message;

  return (
    <Dim onClick={handleCancel}>
      <ModalPanel onClick={(e) => e.stopPropagation()}>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalBody>{renderedContent}</ModalBody>
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

export default ConfirmModalContent;
