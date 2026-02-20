import { makeAutoObservable, observable } from "mobx";

class ModalStore {
  isOpen = false;
  content = null;
  props = {};

  constructor() {
    makeAutoObservable(
      this,
      {
        content: observable.ref,
        props: observable.ref,
      },
      { autoBind: true },
    );
  }

  open(content, props = {}) {
    this.isOpen = true;
    this.content = content;
    this.props = props;
  }

  close() {
    this.isOpen = false;
    this.content = null;
    this.props = {};
  }
}

export const modalStore = new ModalStore();

//  사용 예시
// import { modalStore } from "../store";
// modalStore.open(<YourComponent />, { someProp: value });
// modalStore.close();
