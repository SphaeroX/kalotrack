<template>
  <v-app>
    <v-main class="main">
      <!-- NavBar Top -->
      <NavBarTop />
      <div class="mb-2"></div>
      <!-- Router View -->
      <router-view />
      <!-- Bottom Bar -->
      <FooterBar />
      <!-- <BottomBar /> -->
      <ChangelogNews />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavBarTop from './layouts/NavBarTop.vue';
import FooterBar from './layouts/FooterBar.vue';
// import BottomBar from './layouts/BottomBar.vue';
import ChangelogNews from './layouts/ChangelogNews.vue';

const router = useRouter();

onMounted(() => {
  const bodyData = JSON.parse(localStorage.getItem('bodyData'));
  if (!bodyData) {
    router.push('/calculator');
  }
});
</script>

<style scoped>
.main {
  height: 100%;
}
</style>
