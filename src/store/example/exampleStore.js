import { makeAutoObservable } from "mobx";
import axios from "axios";
import { getStore, useStore } from "../index.js";

export class ExampleStore {
  list = [];
  totalCount = 0;

  constructor(store) {
    this.store = store;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async getBanners({ searchParams }) {
    try {
      const query = new URLSearchParams(searchParams).toString();

      console.log("searchParams", Object.fromEntries(searchParams));
      console.log("query", query);

      const { data } = await axios.get(`http://localhost:3001/banners?${query}`);
      console.log("data", data);
      this.list = data ?? [];
      this.totalCount = data?.length ?? 0;
    } catch (error) {
      console.error("banners fetch error:", error);
    }
  }
}

export const useExampleStore = () => {
  return useStore().exampleStore;
};

export const getExampleStore = () => {
  return getStore().exampleStore;
};
