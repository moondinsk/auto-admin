import { createContext } from "react";
import { confirmStore, modalStore } from "./modal";

export const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const store = {
    modalStore,
    confirmStore,
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
