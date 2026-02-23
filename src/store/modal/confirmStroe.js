import { makeAutoObservable, observable } from "mobx";

class ConfirmStore {
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
    this.close();
  }

  cancel() {
    this.resolve?.(false);
    this.close();
  }

  close() {
    this.isOpen = false;
  }

  reset() {
    this.isOpen = false;
    this.title = "";
    this.message = "";
    this.confirmText = "확인";
    this.cancelText = "취소";
    this.successToastMessage = "확인되었습니다.";
    this.contentComponent = null;
    this.contentProps = {};
    this.resolve = null;
  }
}

export const confirmStore = new ConfirmStore();
