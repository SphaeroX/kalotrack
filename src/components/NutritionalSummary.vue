<template>
    <v-card class="mx-auto" max-width="400">
        <v-card-title>Nährstoffverteilung</v-card-title>
        <v-card-subtitle>
            Kohlenhydrate {{ carbsConsumed }} g von {{ nutrientGoals.carbs }} g
        </v-card-subtitle>
        <v-card-subtitle>
            Protein {{ proteinConsumed }} g von {{ nutrientGoals.protein }} g
        </v-card-subtitle>
        <v-card-subtitle>
            Fett {{ fatConsumed }} g von {{ nutrientGoals.fat }} g
        </v-card-subtitle>
    </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/stores/mainStore';

const store = useMainStore();

const carbsConsumed = computed(() => store.carbsConsumed);
const proteinConsumed = computed(() => store.proteinConsumed);
const fatConsumed = computed(() => store.fatConsumed);
const nutrientGoals = computed(() => store.nutrientSuggested);
</script>

<style scoped>
.v-card {
    margin: 16px;
    padding: 16px;
}
</style>