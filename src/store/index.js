import { createContext, createElement, useContext } from "react";
import { ConfirmStore } from "./modal/confirmStore";
import { ModalStore } from "./modal/modalStore";
import { UserStore } from "./user/userStore";
import { FormTableStore } from "./form/formTableStore";

export const StoreContext = createContext(null);

export class Store {
  modalStore;
  confirmStore;
  userStore;
  formTableStore;
  constructor() {
    this.modalStore = new ModalStore(this);
    this.confirmStore = new ConfirmStore(this);
    this.userStore = new UserStore(this);
    this.formTableStore = new FormTableStore(this);
  }
}

const store = new Store();

export const StoreProvider = ({ children }) => {
  return createElement(StoreContext.Provider, { value: store }, children);
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside of StoreProvider");

  return context;
};

export const getStore = () => {
  return store;
};

window.getStore = getStore;
