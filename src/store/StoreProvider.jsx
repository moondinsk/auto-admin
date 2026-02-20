import { createContext } from "react";
import { confirmStore, modalStore } from "./modal";
import { toastStore } from "./toast";

export const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const store = {
    modalStore,
    confirmStore,
    toastStore,
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
