import { makeAutoObservable, observable } from "mobx";

class ConfirmStore {
  isOpen = false;
  title = "";
  message = "";
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

  open({ title = "", message = "" }) {
    this.isOpen = true;
    this.title = title;
    this.message = message;

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  confirm() {
    this.resolve?.(true);
    this.reset();
  }

  cancel() {
    this.resolve?.(false);
    this.reset();
  }

  reset() {
    this.isOpen = false;
    this.title = "";
    this.message = "";
    this.resolve = null;
  }
}

export const confirmStore = new ConfirmStore();

// 사용예시
// import { confirmStore } from "../store";
// const result = await confirmStore.open({ title: "Confirm", message: "Are you sure?" });
// if (result) {
//   // 사용자가 확인을 눌렀을 때의 처리
// } else {
//   // 사용자가 취소를 눌렀을 때의 처리
// }
