<template>
  <v-app-bar fixed dense>
    <template v-slot:append>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      <v-icon icon="mdi-tractor-variant" />
      <v-icon icon="mdi-tractor-variant" />
      <v-icon icon="mdi-tractor-variant" />
      <span @click="chooseMenu('/')">Kalo-Drägger</span>
    </v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" location="right" temporary>
    <v-list>
      <v-list-item v-for="(menuItem, menuIndex) in items" :key="menuIndex" :value="menuIndex"
        @click="chooseMenu(menuItem.route, menuItem.external)">
        <v-list-item v-if="menuItem.icon" :append-icon="menuItem.icon" :title="menuItem.title"></v-list-item>
        <v-list-item v-else :title="menuItem.title"></v-list-item>
        <p v-if="menuItem.padding" class="mt-8"></p>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(false);
const router = useRouter();

const items = ref([
  { title: 'Tracker', route: '/', icon: 'mdi-counter' },
  { title: 'Statistiken', route: '/', icon: 'mdi-chart-bar' },
  { title: 'Kalorienrechner', route: '/calculator', icon: 'mdi-calculator', padding: true },
  { title: 'Trainingspläne', route: '/training', icon: 'mdi-dumbbell', padding: true },
  { title: 'Info & Hilfe', route: '/info', icon: 'mdi-help', padding: true },
  { title: 'GitHub', route: 'https://github.com/SphaeroX/kalotrack', icon: 'mdi-github', external: true },
  { title: 'Discord', route: 'https://discord.gg/qkxjGEp3Tg', icon: 'mdi-chat', external: true },
]);

const chooseMenu = (route, external = false) => {
  if (external) {
    window.open(route, '_blank');
  } else {
    router.push(route);
  }
  drawer.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>
