<template>
    <v-text-field :label="label" v-model="inputValue" @blur="handleEnter" type="number" />
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useMainStore } from '@/stores/mainStore';

const store = useMainStore();

const inputValue = ref(null);
const label = computed(() => `${text} ${store.bodyData.weight}`);
const text = "Aktuelles Gewicht:";

const handleEnter = () => {
    if (!inputValue.value) {
        return;
    }

    store.updateWeight(inputValue.value);
    inputValue.value = null;
};

watch(() => store.weight, (newWeight) => {
    label.value = `${text} ${newWeight}`;
});
</script>

<style scoped></style>