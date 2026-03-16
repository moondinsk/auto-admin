import { makeAutoObservable } from "mobx";
import { getStore, useStore } from "../index.js";

const SHOULD_DEBUG_MODAL_STACK = import.meta.env.DEV;

export class ModalStore {
  modals = [];

  constructor(store) {
    this.store = store;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isOpen() {
    return this.modals.length > 0;
  }

  get topModal() {
    return this.modals[this.modals.length - 1] ?? null;
  }

  get topType() {
    return this.topModal?.type ?? null;
  }

  get topProps() {
    return this.topModal?.props ?? {};
  }

  debugStack(action, meta = {}) {
    if (!SHOULD_DEBUG_MODAL_STACK) {
      return;
    }

    const snapshot = this.modals.map((modal, index) => ({
      index,
      id: modal.id,
      type: modal.type,
      title: modal.props?.title || "(no-title)",
      component: modal.component?.name || "(unknown)",
    }));

    console.groupCollapsed(`[ModalStack] ${action} (length: ${this.modals.length})`);
    if (Object.keys(meta).length > 0) {
      console.log("meta:", meta);
    }
    console.table(snapshot);
    console.groupEnd();
  }

  createModal({ type = "default", id, component = null, props = {}, resolve = null }) {
    return {
      id: id ?? `modal-${crypto.randomUUID()}`,
      type,
      component,
      props,
      resolve,
    };
  }

  open({ id, component = null, props = {} } = {}) {
    const modal = this.createModal({
      type: "default",
      id,
      component,
      props,
    });

    this.modals.push(modal);
    this.debugStack("open", {
      id: modal.id,
      type: modal.type,
      title: props?.title || "(no-title)",
    });

    return modal.id;
  }

  openByPayload(payload) {
    if (!payload?.component) {
      return null;
    }

    const { component, props = {} } = payload;
    return this.open({ component, props });
  }

  openConfirm({ id, component = null, props = {} } = {}) {
    return new Promise((resolve) => {
      const modal = this.createModal({
        type: "confirm",
        id,
        component,
        props,
        resolve,
      });

      this.modals.push(modal);
      this.debugStack("openConfirm", {
        id: modal.id,
        type: modal.type,
        title: props?.title || "(no-title)",
      });
    });
  }

  openConfirmByPayload(payload) {
    if (!payload?.component) {
      return null;
    }

    const { component, props = {} } = payload;
    return this.openConfirm({ component, props });
  }

  confirm(value = true) {
    const modal = this.topModal;
    if (!modal) {
      return;
    }

    modal.resolve?.(value);
    this.debugStack("confirm", { id: modal.id, type: modal.type });
    this.modals.pop();
  }

  cancel(value = false) {
    const modal = this.topModal;
    if (!modal) {
      return;
    }

    modal.resolve?.(value);
    this.debugStack("cancel", { id: modal.id, type: modal.type });
    this.modals.pop();
  }

  closeTop() {
    const modal = this.topModal;
    if (!modal) {
      return;
    }

    if (modal.type === "confirm") {
      modal.resolve?.(false);
    }

    this.modals.pop();
    this.debugStack("closeTop", {
      removedId: modal.id,
      removedType: modal.type,
    });
  }

  closeById(id) {
    const target = this.modals.find((modal) => modal.id === id);

    if (target?.type === "confirm") {
      target.resolve?.(false);
    }

    const beforeLength = this.modals.length;
    this.modals = this.modals.filter((modal) => modal.id !== id);

    this.debugStack("closeById", {
      targetId: id,
      removedCount: beforeLength - this.modals.length,
    });
  }

  close() {
    this.closeTop();
  }

  closeAll() {
    this.modals.forEach((modal) => {
      if (modal.type === "confirm") {
        modal.resolve?.(false);
      }
    });

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
