import { makeAutoObservable, observable } from "mobx";
import { getStore, useStore } from "../index.js";

const SHOULD_DEBUG_MODAL_STACK = import.meta.env.DEV;

export class ModalStore {
  modals = [];

  constructor() {
    makeAutoObservable(
      this,
      {
        modals: observable.shallow,
      },
      { autoBind: true },
    );
  }

  get isOpen() {
    return this.modals.length > 0;
  }

  get topModal() {
    return this.modals[this.modals.length - 1] ?? null;
  }

  get content() {
    return this.topModal?.content ?? null;
  }

  get props() {
    return this.topModal?.props ?? {};
  }

  debugStack(action, meta = {}) {
    if (!SHOULD_DEBUG_MODAL_STACK) {
      return;
    }

    const snapshot = this.modals.map((modal, index) => ({
      index,
      id: modal.id,
      title: modal.props?.title || "(no-title)",
      component: modal.props?.contentComponent?.name || "(unknown)",
    }));

    console.groupCollapsed(`[ModalStack] ${action} (length: ${this.modals.length})`);
    if (Object.keys(meta).length > 0) {
      console.log("meta:", meta);
    }
    console.table(snapshot);
    console.groupEnd();
  }

  open(content, props = {}) {
    const id = props.id ?? `modal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    this.modals.push({
      id,
      content,
      props,
    });

    this.debugStack("open", { id, title: props?.title || "(no-title)" });
    return id;
  }

  openByPayload(payload) {
    if (!payload) {
      return null;
    }

    const { component: ContentComponent, modalProps = {}, content = null } = payload;
    const { contentProps = {}, data, ...restModalProps } = modalProps;

    return this.open(content, {
      ...restModalProps,
      contentComponent: ContentComponent,
      contentProps: {
        ...contentProps,
        data,
      },
    });
  }

  closeTop() {
    const removedId = this.topModal?.id;
    this.modals.pop();
    this.debugStack("closeTop", { removedId });
  }

  closeById(id) {
    const beforeLength = this.modals.length;

    this.modals = this.modals.filter((modal) => modal.id !== id);
    this.debugStack("closeById", { targetId: id, removedCount: beforeLength - this.modals.length });
  }

  close() {
    this.closeTop();
  }

  closeAll() {
    const beforeLength = this.modals.length;
    this.modals = [];
    this.debugStack("closeAll", { beforeLength });
  }

  reset() {
    this.closeAll();
  }
}

export const useModalStore = () => {
  return useStore().modalStore;
};

export const getModalStore = () => {
  return getStore().modalStore;
};
