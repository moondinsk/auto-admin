import { makeAutoObservable } from "mobx";
import { getStore, useStore } from "../index.js";

export class FormTableStore {
  managerName = "";
  managerRole = "";
  managerMemo = "";
  managerStatus = "active";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get values() {
    return {
      managerName: this.managerName,
      managerRole: this.managerRole,
      managerMemo: this.managerMemo,
      managerStatus: this.managerStatus,
    };
  }

  setField(name, value) {
    if (!["managerName", "managerRole", "managerMemo", "managerStatus"].includes(name)) {
      return;
    }

    this[name] = value;
  }

  reset() {
    this.managerName = "";
    this.managerRole = "";
    this.managerMemo = "";
    this.managerStatus = "active";
  }
}

export const useFormTableStore = () => {
  return useStore().formTableStore;
};

export const getFormTableStore = () => {
  return getStore().formTableStore;
};
