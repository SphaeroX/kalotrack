// src/stores/mainStore.js

import { defineStore } from "pinia";
import {
  getCurrentDate,
  calculateCalories,
  calculateDietCalories,
  calculateNutrientDistribution,
} from "@/utils/main.js";

export const useMainStore = defineStore("main", {
  state: () => ({
    kcalSuggested: 2000,
    items: [],
    dailyItems: [],
    lastResetDate: null,
    archive: [],
    nutrientSuggested: null,
    bodyData: null,
    dialogText: null,
    dialog: false,
    nutrientGoals: {
      carbs: 0,
      protein: 0,
      fat: 0,
    },
  }),

  actions: {
    // Initialize the store with local storage data
    initialize() {
      this.getBodyData();
      const currentDateStamp = getCurrentDate();
      this.getItems();
      this.getDailyItems();
      this.getLastResetDate();
      this.getArchive();
      this.getSuggestions();

      if (this.lastResetDate !== currentDateStamp) {
        setTimeout(() => {
          const archive = [
            {
              items: this.items,
              date: getCurrentDate(),
              bodyData: this.bodyData,
              kcalSuggested: this.kcalSuggested,
              nutrientSuggested: this.nutrientSuggested,
            },
          ];
          this.archive = this.archive.concat(archive);
          this.updateArchive(this.archive);
          this.updateLastResetData(currentDateStamp);
          this.resetLastResetDate();
          this.updateBodyData();
          location.reload();
        }, 500);
      }
    },

    addItems(items) {
      this.items = [...this.items, ...items];
      this.updateItems(this.items);
    },

    setItems(items) {
      this.items = [...items];
      this.updateItems(this.items);
    },

    updateItems(items) {
      if (items.length > 0) {
        this.updateDailyItems(items);
      }
      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteItem(arrayPosition) {
      const newItems = [...this.items];
      newItems.splice(arrayPosition, 1);
      this.items = newItems;
      this.updateItems(this.items);
    },

    getItems() {
      const storedItems = localStorage.getItem("items");
      this.items = storedItems ? JSON.parse(storedItems) : [];
    },

    getDailyItems() {
      const dailyItems = localStorage.getItem("dailyItems");
      this.dailyItems = dailyItems ? JSON.parse(dailyItems) : [];
    },

    addDailyItems(items) {
      this.dailyItems = [...this.dailyItems, ...items];
      this.updateDailyItems(this.dailyItems);
    },

    updateDailyItems(items) {
      const dailyItems = items.filter((item) => item.daily === 1);
      localStorage.setItem("dailyItems", JSON.stringify(dailyItems));
    },

    getLastResetDate() {
      const lastReset = localStorage.getItem("lastReset");
      this.lastResetDate = lastReset ? JSON.parse(lastReset) : getCurrentDate();
      this.updateLastResetData(this.lastResetDate);
    },

    updateLastResetData(date) {
      localStorage.setItem("lastReset", JSON.stringify(date));
    },

    resetLastResetDate() {
      const dailyItems = this.dailyItems;
      this.updateItems(dailyItems);
    },

    updateKcalSuggested(kcal) {
      this.kcalSuggested = kcal;
      localStorage.setItem("kcalSuggested", JSON.stringify(kcal));
    },

    getArchive() {
      const archive = localStorage.getItem("archive");
      this.archive = archive ? JSON.parse(archive) : [];
      return this.archive;
    },

    updateArchive(archive) {
      localStorage.setItem("archive", JSON.stringify(archive));
    },

    getSuggestions() {
      this.kcalSuggested =
        JSON.parse(localStorage.getItem("kcalSuggested")) || 2000;
      this.nutrientSuggested =
        JSON.parse(localStorage.getItem("nutrientsSuggested")) || false;
    },

    getBodyData() {
      const bodyData = JSON.parse(localStorage.getItem("bodyData"));
      if (bodyData) {
        this.bodyData = bodyData;
      } else {
        return false;
      }
    },

    updateBodyData() {
      const totalCalories = calculateCalories(
        this.bodyData.height,
        this.bodyData.weight,
        this.bodyData.age,
        this.bodyData.gender,
        this.bodyData.bodyFatLevel,
        this.bodyData.weeklyExerciseHours,
        this.bodyData.exerciseIntensity,
        this.bodyData.stressLevel,
        this.bodyData.sleepHours,
        this.bodyData.workHours,
        this.bodyData.workIntensity
      );

      const suggesedCalories = calculateDietCalories(
        totalCalories,
        this.bodyData.dietLevel
      );
      this.kcalSuggested = Math.round(suggesedCalories);
      const nutrientSuggested = calculateNutrientDistribution(
        suggesedCalories,
        this.bodyData.diet
      );
      this.nutrientSuggested = nutrientSuggested;

      localStorage.setItem("bodyData", JSON.stringify(this.bodyData));
      localStorage.setItem("kcalSuggested", JSON.stringify(this.kcalSuggested));
      localStorage.setItem(
        "nutrientsSuggested",
        JSON.stringify(this.nutrientSuggested)
      );
    },

    updateWeight(weight) {
      this.bodyData.weight = weight;
      this.updateBodyData();
    },

    showDialog(text) {
      this.dialogText = text;
      this.dialog = true;
    },
  },

  watch: {
    items(newItemsValue) {
      this.updateItems(newItemsValue);
    },
  },

  getters: {
    carbsConsumed(state) {
      return state.items.reduce(
        (total, item) => total + (item.carbohydrates || 0),
        0
      );
    },
    proteinConsumed(state) {
      return state.items.reduce(
        (total, item) => total + (item.protein || 0),
        0
      );
    },
    fatConsumed(state) {
      return state.items.reduce((total, item) => total + (item.fat || 0), 0);
    },
  },
});
