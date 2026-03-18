import { createContext, createElement, useContext } from "react";
import { ModalStore } from "./modal/modalStore";
import { UserStore } from "./user/userStore";
import { FormTableStore } from "./form/formTableStore";
import { ExampleStore } from "./example/exampleStore";
import { LoadingStore } from "./loading/loadingStore";

export const StoreContext = createContext(null);

export class Store {
  modalStore;
  userStore;
  formTableStore;
  exampleStore;
  loadingStore;
  constructor() {
    this.modalStore = new ModalStore(this);
    this.userStore = new UserStore(this);
    this.formTableStore = new FormTableStore(this);
    this.exampleStore = new ExampleStore(this);
    this.loadingStore = new LoadingStore(this);
  }
}

let store = new Store();

export const StoreProvider = ({ children, initialState }) => {
  if (!store) {
    store = new Store(initialState);
  }
  return createElement(StoreContext.Provider, { value: store }, children);
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside of StoreProvider");

  return context;
};

export const getStore = () => {
  if (!store) throw new Error("Store has not been initialized");

  return store;
};

window.getStore = getStore;
