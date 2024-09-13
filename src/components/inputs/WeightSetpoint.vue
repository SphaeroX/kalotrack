<template>
    <v-container class="weightSetpoint">
        <v-text-field :label="label" v-model="inputValue" @blur="handleEnter" type="number" />
    </v-container>
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

<style scoped>
.weightSetpoint {
    width: 310px;
    padding: 0
}
</style>
