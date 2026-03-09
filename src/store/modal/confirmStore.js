import { makeAutoObservable, observable } from "mobx";
import { getStore, useStore } from "../index.js";

const SHOULD_DEBUG_CONFIRM_MODAL = import.meta.env.DEV;

export class ConfirmStore {
  isOpen = false;
  title = "";
  message = "";
  confirmText = "확인";
  cancelText = "취소";
  successToastMessage = "확인되었습니다.";
  contentComponent = null;
  contentProps = {};
  resolve = null;

  constructor() {
    makeAutoObservable(
      this,
      {
        resolve: observable.ref,
      },
      { autoBind: true },
    );
  }

  debugConfirm(action, meta = {}) {
    if (!SHOULD_DEBUG_CONFIRM_MODAL) {
      return;
    }

    const snapshot = {
      isOpen: this.isOpen,
      title: this.title || "(no-title)",
      message: this.message || "(no-message)",
      component: this.contentComponent?.name || "(unknown)",
    };

    console.groupCollapsed(`[ConfirmModal] ${action} (isOpen: ${this.isOpen})`);
    if (Object.keys(meta).length > 0) {
      console.log("meta:", meta);
    }
    console.table([snapshot]);
    console.groupEnd();
  }

  open({
    title = "",
    message = "",
    contentComponent = null,
    contentProps = {},
    confirmText = "확인",
    cancelText = "취소",
    successToastMessage = "확인되었습니다.",
  }) {
    this.isOpen = true;
    this.title = title;
    this.message = message;
    this.confirmText = confirmText;
    this.cancelText = cancelText;
    this.successToastMessage = successToastMessage;
    this.contentComponent = contentComponent;
    this.contentProps = contentProps;
    this.debugConfirm("open", { title, message });

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  openByPayload(payload) {
    if (!payload) {
      return Promise.resolve(false);
    }

    const { component: ContentComponent, confirmProps = {} } = payload;
    const { contentProps = {}, data, message = "", successToastMessage, ...restConfirmProps } = confirmProps;

    return this.open({
      ...restConfirmProps,
      message,
      successToastMessage,
      contentComponent: ContentComponent,
      contentProps: {
        ...contentProps,
        data,
        message,
      },
    });
  }

  confirm() {
    this.resolve?.(true);
    this.debugConfirm("confirm");
    this.close("confirm");
  }

  cancel() {
    this.resolve?.(false);
    this.debugConfirm("cancel");
    this.close("cancel");
  }

  close(reason = "manual") {
    this.isOpen = false;
    this.debugConfirm("close", { reason });
  }

  reset() {
    const beforeState = {
      title: this.title,
      message: this.message,
      component: this.contentComponent?.name || "(unknown)",
    };

    this.isOpen = false;
    this.title = "";
    this.message = "";
    this.confirmText = "확인";
    this.cancelText = "취소";
    this.successToastMessage = "확인되었습니다.";
    this.contentComponent = null;
    this.contentProps = {};
    this.resolve = null;
    this.debugConfirm("reset", beforeState);
  }
}

export const useConfirmStore = () => {
  return useStore().confirmStore;
};

export const getConfirmStore = () => {
  return getStore().confirmStore;
};
