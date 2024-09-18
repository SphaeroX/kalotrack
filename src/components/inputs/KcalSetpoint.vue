<template>
    <v-container class="kcalText">
        <v-text-field :label="label" v-model="inputValue" @blur="handleEnter" @keydown.enter="handleEnter" type="number"></v-text-field>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMainStore } from '@/stores/mainStore';

const store = useMainStore();
const inputValue = ref(null);
const text = "Kalorienvorschlag/Ziel heute :";

// Computed property for the label
const label = computed(() => `${text} ${store.kcalSuggested}`);

// Function to handle input change
const handleEnter = () => {
    if (!inputValue.value) {
        return;
    }

    store.updateKcalSuggested(inputValue.value);
    inputValue.value = null;
};
</script>

<style scoped>
.kcalText {
    width: 310px;
    padding: 0
}
</style>
