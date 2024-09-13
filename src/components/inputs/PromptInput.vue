<template>
    <v-text-field :label="label" v-model="inputValue" @click="exampleInput" append-inner-icon="mdi-send" @click:append-inner="handleEnter" @keydown.enter="handleEnter" type="text">
        <v-overlay v-model="overlay" contained class="align-center justify-center">
            <v-progress-circular indeterminate size="30"></v-progress-circular>
        </v-overlay>
    </v-text-field>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMainStore } from '@/stores/mainStore';

const store = useMainStore();
const inputValue = ref('');
const label = ref('Texteingabe für Kalotrack');
const overlay = ref(false);
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const text = "Texteingabe für Kalotrack";

// Function to get random example text
const exampleInput = () => {
    const examples = [
        "Ich habe einen großen Teller Spaghetti gehabt.",
        "Ich hatte eben eine Handvoll Walnüsse.",
        "Füge einen Proteinshake mit 300 Kalorien hinzu.",
        "Ich habe gerade bei McDonald's einen Big Mac gehabt.",
        "Ein Stück Schokoladenkuchen zum Nachtisch.",
        "Heute morgen gab es ein Schüssel Haferflocken mit Bananen.",
        "Eine Portion Hähnchenbrust mit Gemüse.",
        "Ich habe einen Apfel als Snack gegessen.",
        "Ein Glas Orangensaft zum Frühstück.",
        "Ein Stück Pizza zum Mittagessen.",
        "Eine Tasse Kaffee mit Milch und Zucker.",
        "Ich habe eine Schüssel Erdbeereis gegessen.",
        "Eine Schale Reis mit Linsen und Gemüse.",
        "Ein Thunfischsandwich zum Abendessen.",
        "Ich habe einen Smoothie mit Spinat und Beeren getrunken.",
        "Ein Becher Joghurt mit Honig und Müsli.",
        "Ein Hamburger bei Burger King.",
        "Eine Portion Sushi mit Sojasauce.",
        "Ein Schokoriegel als Snack.",
        "Ich habe eine Tasse grünen Tee getrunken.",
        "Ein Stück Hühnchen-Curry.",
        "Ein paar Kekse zum Naschen.",
        "Ein Glas Wein zum Abendessen.",
        "Eine Portion Rührei zum Frühstück.",
        "Ein Bagel mit Frischkäse.",
        "Ein Stück Wassermelone als Nachtisch.",
        "Ich habe einen Caesar-Salat gegessen.",
        "Eine Tasse Hühnersuppe.",
        "Ein Schüssel Chili con Carne.",
        "Ein Schokoladenmuffin zum Kaffee."
    ];
    const random = Math.floor(Math.random() * examples.length);
    label.value = `zB ${examples[random]}`;
};

// Function to handle input submission
const handleEnter = async () => {
    label.value = text;
    if (!inputValue.value) {
        return;
    }

    overlay.value = true;

    try {
        const formData = new FormData();
        formData.append('prompt', inputValue.value);

        const response = await fetch(`${backendUrl}/api/prompt`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        const formattedItems = data.items.map(item => ({ ...item, daily: 0 }));

        inputValue.value = '';
        store.addItems(formattedItems);
    } catch (error) {
        inputValue.value = 'FEHLER';
        console.error('Fehler beim Senden der Datei an die API:', error);
    }

    overlay.value = false;
};

onMounted(() => {
    label.value = text;
});
</script>

<style scoped></style>
