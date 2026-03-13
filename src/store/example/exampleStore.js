import { makeAutoObservable } from "mobx";
import axios from "axios";

export class ExampleStore {
  list = [];
  totalCount = 0;
  formData = {};

  constructor(store) {
    this.store = store;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  initForm(initialForm, searchParams) {
    this.formData = {
      ...initialForm,
      ...searchParams,
    };
  }

  setField(name, value) {
    this.formData = {
      ...this.formData,
      [name]: value,
    };
  }

  resetForm(initialForm) {
    this.formData = { ...initialForm };
  }

  async getBanners({ searchParams }) {
    try {
      const query = new URLSearchParams(searchParams).toString();

      const { data } = await axios.get(`http://localhost:3001/banners?${query}`);

      this.list = data ?? [];
      this.totalCount = data?.length ?? 0;
    } catch (error) {
      console.error("banners fetch error:", error);
    }
  }
}
