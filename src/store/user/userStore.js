import { makeAutoObservable } from "mobx";
import { getStore, useStore } from "../index.js";

export class UserStore {
  user = null; // 사용자 정보
  isLogin = false; // 로그인 여부
  role = null; // 권한 (admin, manager, user 등)
  isHydrated = false; //  초기 복구 완료 여부

  constructor(store) {
    this.store = store;
    makeAutoObservable(this, {}, { autoBind: true });

    // 🔥 새로고침 / 주소 직접 입력 대응
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.user = user;
      this.role = user.role;
      this.isLogin = true;
    }

    this.isHydrated = true;
  }

  login(user) {
    this.user = user;
    this.role = user.role;
    this.isLogin = true;

    localStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    this.user = null;
    this.role = null;
    this.isLogin = false;

    localStorage.removeItem("user");
  }

  get isAdmin() {
    return this.role === "admin";
  }
}

export const useUserStore = () => {
  return useStore().userStore;
};

export const getUserStore = () => {
  return getStore().userStore;
};
