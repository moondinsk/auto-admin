import { makeAutoObservable } from "mobx";
import { useStore } from "../index.js";

export class ModalStore {
  modals = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  open(payload = {}) {
    const { id, component, props = {} } = payload;

    if (!component) {
      return null;
    }

    const { type = "modal", ...modalProps } = props;

    const modalData = {
      id: id ?? `modal-${crypto.randomUUID()}`,
      type,
      component,
      props: modalProps,
    };

    this.modals.push(modalData);
    return modalData.id;
  }

  closeById(id) {
    this.modals = this.modals.filter((modal) => modal.id !== id);
  }

  close() {
    this.modals.pop();
  }

  closeAll() {
    this.modals = [];
  }
}

export const useModalStore = () => {
  return useStore().modalStore;
};
