import React from "react";
import { observer } from "mobx-react-lite";
import { toastStore } from "@/store";
import { ToastItem, ToastViewport } from "./Toast.styles";

function Toast() {
  if (!toastStore.isOpen) {
    return null;
  }

  return (
    <ToastViewport>
      <ToastItem>{toastStore.message}</ToastItem>
    </ToastViewport>
  );
}

export default observer(Toast);
