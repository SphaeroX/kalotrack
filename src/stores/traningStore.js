// traningStore.js
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

export const useTraningStore = defineStore({
  id: "traningStore",
  state: () => ({
    plans: [],
    lsKey: "plans",
  }),
  actions: {
    /**
     * Erstellt einen Trainingsplan basierend auf den folgenden Parametern.
     *
     * @param {Object} planData - Die Daten, die für die Erstellung des Trainingsplans benötigt werden.
     *   @param {number} amount - Die Menge des Plans.
     *   @param {number} weight - Das Gewicht.
     *   @param {string} gender - Das Geschlecht (z.B. "male" oder "female").
     *   @param {string} level - Das Trainingsniveau.
     *   @param {string} type - Der Plan-Typ.
     *   @param {string} focus - Der Fokus des Trainings.
     *   @param {string} duration - Die Dauer des Plans.
     *   @param {number} exercisesAmount - Die Anzahl der Übungen.
     *   @param {boolean} [additional=false] - (Optional) Gibt an, ob zusätzliche Informationen vorhanden sind.
     *
     * @returns {Promise} - Ein Versprechen, das das Ergebnis der Planerstellung enthält.
     */
    async createPlans(planData) {
      try {
        const requestData = { ...planData };
        const endpoint = "/plans/create";
        const req = await apiRequest(endpoint, requestData);

        if (req && Array.isArray(req)) {
          if (this.plans == null) this.plans = [];
          this.plans = this.plans.concat(req);
          this.updatePlans(this.plans);
          return req;
        } else {
          throw new Error("Bad API Data");
        }
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    },
    deletePlan(arrayKey) {
      this.plans.splice(arrayKey, 1);
      this.updatePlans(this.plans);
    },
    readPlans() {
      const read = JSON.parse(localStorage.getItem(this.lsKey));
      if (!read) this.updatePlans([]);
      this.plans = read;
      return read;
    },
    updatePlans(plans) {
      return localStorage.setItem(this.lsKey, JSON.stringify(plans));
    },
  },
  getters: {},
});
