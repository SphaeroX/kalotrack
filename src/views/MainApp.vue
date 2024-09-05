<template>
  <!-- ProgressBar  -->
  <v-container>
    <v-row>
      <ProgressBar />
    </v-row>
  </v-container>

  <!-- FoodCards  -->
  <FoodCards />

  <!-- Nutritional Summary  -->
  <v-container>
    <v-row>
      <NutritionalSummary />
    </v-row>
  </v-container>

  <!-- KcalSetpoint  -->
  <v-container>
    <v-row>
      <KcalSetpoint />
    </v-row>
  </v-container>

  <!-- WeightSetpoint  -->
  <v-container>
    <v-row>
      <WeightSetpoint />
    </v-row>
  </v-container>

  <!-- Archive Button  -->
  <v-container>
    <v-row justify="center">
      <DownloadArchive />
    </v-row>
  </v-container>

  <SpeedDialMenu />

  <!-- Dialog -->
  <v-dialog v-model="dialog" width="auto">
    <v-card>
      <v-card-text>
        {{ dialogText }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="dialog = false">Schließen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import FoodCards from '@/components/FoodCards.vue';
// import ImageInput from '@/components/buttons/ImageInput.vue';
import DownloadArchive from '@/components/buttons/DownloadArchive.vue';
import KcalSetpoint from '@/components/inputs/KcalSetpoint.vue';
import WeightSetpoint from '@/components/inputs/WeightSetpoint.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import NutritionalSummary from '@/components/NutritionalSummary.vue';

import SpeedDialMenu from '../components/main/SpeedDialMenu.vue';
import { useMainStore } from '@/stores/mainStore';

const store = useMainStore();

store.initialize();

const addItem = (items) => store.addItem(items);
const setItems = (items) => store.setItems(items);
const updateItems = (items) => store.updateItems(items);
const deleteItem = (index) => store.deleteItem(index);
const updateKcalSuggested = (kcal) => store.updateKcalSuggested(kcal);
const updateWeight = (weight) => store.updateWeight(weight);
const showDialog = (text) => store.showDialog(text);

const { items, dailyItems, kcalSuggested, bodyData, archive, dialogText, dialog } = store.$state;
</script>

<style scoped>
.spacer {
  padding-top: 69px;
}

.sticky-bottom-bar {
  position: fixed;
  margin: 0px;
  padding: 0px;
  bottom: 0px;
  width: 100%;
  z-index: 999;
  height: 60px;
}
</style>
