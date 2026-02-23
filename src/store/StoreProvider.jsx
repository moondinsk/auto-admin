import { createContext } from "react";
import { confirmStore, modalStore } from "./modal";
import { toastStore } from "./toast";
import { formTableStore } from "./form";

export const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const store = {
    modalStore,
    confirmStore,
    toastStore,
    formTableStore,
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
