import { createRouter, createWebHistory } from "vue-router";

import MainApp from "./views/MainApp.vue";
// Lazy Loading
const KcalCalculator = () => import("./views/KcalCalculator.vue");
const InformationSite = () => import("./views/InformationSite.vue");
const PrivacyPolicy = () => import("./views/PrivacyPolicy.vue");
const TrainingView = () => import("./views/TrainingView.vue");

const routes = [
  {
    path: "/",
    name: "MainApp",
    component: MainApp,
  },
  {
    path: "/calculator",
    name: "KcalCalculator",
    component: KcalCalculator,
  },
  {
    path: "/info",
    name: "InformationSite",
    component: InformationSite,
  },
  {
    path: "/datenschutz",
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
  },
  {
    path: "/training",
    name: "TrainingView",
    component: TrainingView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
