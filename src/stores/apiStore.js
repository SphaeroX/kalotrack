import { defineStore } from "pinia";
import axios from "axios";

export const useApiStore = defineStore("api", {
  state: () => ({
    sessionIdLength: 90,
    sessionID: null,
  }),
  actions: {
    async request(endpoint, postData = false) {
      try {
        const url = import.meta.env.VITE_BACKEND_URL + "/api" + endpoint;
        const response = await axios.post(url, postData);
        this.responseData = response;

        return JSON.parse(response.data);
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});
