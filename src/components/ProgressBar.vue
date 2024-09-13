<template>
    <v-progress-linear :color="progressColor" :value="kcalTotalPercent" :model-value="kcalTotalPercent" height="25">
        <strong>{{ kcalSuggested - kcalTotal }} verbleibend von {{ kcalSuggested }}</strong>
    </v-progress-linear>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useMainStore } from '@/stores/mainStore';

const store = useMainStore();

const kcalTotal = ref(0);
const kcalSuggested = computed(() => store.kcalSuggested);

const kcalTotalPercent = computed(() => {
    return kcalSuggested.value > 0 ? (100 / kcalSuggested.value) * kcalTotal.value : 0;
});

const progressColor = computed(() => {
    const percentage = kcalTotalPercent.value;
    if (percentage >= 100) {
        return 'error';
    } else if (percentage >= 70) {
        return `yellow-darken-2`;
    } else {
        return `success`;
    }
});

const calculateKcal = (items) => {
    const total = items.reduce((acc, item) => acc + item.kcal, 0);
    kcalTotal.value = total;
};

watch(
    () => store.items,
    (newItems) => calculateKcal(newItems),
    { immediate: true }
);

watch(
    () => store.kcalSuggested,
    () => calculateKcal(store.items),
);
</script>

<style scoped>
.v-progress-linear {
    background: var(--v-progress-linear-background);
    transition: background 0.3s ease;
}
</style>
