<template>
  <v-container>
    <v-row>
      <PlanGenerator />
      <v-divider class="mb-5"></v-divider>
      <PlanOverview />
    </v-row>
  </v-container>
</template>

<script setup>
import PlanGenerator from '@/components/training/PlanGenerator.vue';
import PlanOverview from '@/components/training/PlanOverview.vue';
</script>
  
