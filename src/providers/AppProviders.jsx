// 기능적 전역 provider 묶음
// CookiesProvider
// MobX store
// Auth, Query 등을 한 번에 관리
import { StoreProvider } from "@/store/StoreProvider";
import { CookiesProvider } from "react-cookie";

export function AppProviders({ children }) {
  return (
    <CookiesProvider>
      <StoreProvider>{children}</StoreProvider>
    </CookiesProvider>
  );
}
