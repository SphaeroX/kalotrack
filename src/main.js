/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { createApp } from "vue";
import { createPinia } from "pinia";
//import { loadFonts } from './plugins/webfontloader';

import VueApexCharts from "vue3-apexcharts";

// create App
const app = createApp(App);

// create Store
const pinia = createPinia();

app.use(vuetify);
app.use(router);
app.use(VueApexCharts);
app.use(pinia);

app.mount("#app");
