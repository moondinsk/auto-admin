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

  openByPayload(payload) {
    if (!payload) {
      return;
    }

    const { component: ContentComponent, modalProps = {} } = payload;
    const { contentProps = {}, data, ...restModalProps } = modalProps;

    this.open(null, {
      ...restModalProps,
      contentComponent: ContentComponent,
      contentProps: {
        ...contentProps,
        data,
      },
    });
  }

  close() {
    this.isOpen = false;
  }

  reset() {
    this.isOpen = false;
    this.content = null;
    this.props = {};
  }
}

export const modalStore = new ModalStore();
