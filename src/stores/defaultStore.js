// defaultStore.js
import { defineStore } from "pinia";
import { useApiStore } from "./apiStore";

const apiRequest = async (endpoint, requestData) => {
  const api = useApiStore();
  try {
    return await api.request(endpoint, requestData);
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const defaultStore = defineStore({
  id: "defaultStore",
  state: () => ({
    data: false,
    defaultId: false,
  }),
  actions: {
    async createDefault(name) {
      const requestData = { name };
      const endpoint = "default/create";
      const req = await apiRequest(endpoint, requestData);
      this.data = req;
      return req;
    },
    async readDefault() {
      const endpoint = "default/read";
      const req = await apiRequest(endpoint);
      this.data = req;
      return req;
    },
    async updateDefault(id, data) {
      const requestData = { id, data };
      const endpoint = "default/update";
      const req = await apiRequest(endpoint, requestData);
      return req.status;
    },
    async deleteDefault(arrayKey) {
      const index = this.defaultItems.findIndex(
        (item) => item.key === arrayKey
      );

      if (index !== -1) {
        this.items.splice(index, 1);
        this.updateDefault(this.id, this.items);
        return true;
      } else {
        return false;
      }
    },
  },
  getters: {
    itemCount(state) {
      return state.data.items.length;
    },
    items(state) {
      return state.data.items;
    },
    id(state) {
      return state.data.id;
    },
  },
});
