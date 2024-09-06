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

    async voiceToItems(formData) {
      try {
        const url = import.meta.env.VITE_BACKEND_URL + "/api/transcribe";
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = response.data.items;

        // adding daily:0
        const formattedItems = data.items.map(item => ({
          ...item,
          daily: 0
        }));


        return formattedItems;
      } catch (error) {
        console.log("Error during voice to items request:", error);
        return false;
      }
    },

    async imageToItems(formData) {
      try {
        const url = import.meta.env.VITE_BACKEND_URL + "/api/imageToItems";
        const response = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data.items;
      } catch (error) {
        console.error('Fehler beim Senden des Bildes:', error);
        throw error;
      }
    },
  },
});
