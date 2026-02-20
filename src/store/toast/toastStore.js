import { makeAutoObservable } from "mobx";

class ToastStore {
  isOpen = false;
  message = "";
  timer = null;

  constructor() {
    makeAutoObservable(
      this,
      {
        timer: false,
      },
      { autoBind: true },
    );
  }

  show(message, duration = 2000) {
    this.message = message;
    this.isOpen = true;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.hide();
    }, duration);
  }

  hide() {
    this.isOpen = false;
    this.message = "";

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const toastStore = new ToastStore();
