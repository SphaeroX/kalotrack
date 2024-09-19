<template>
    <v-dialog v-model="dialog" width="full">
        <v-card>
            <v-card-text>
                <h3>Update {{ latestNews }}</h3>
                <v-divider class="pb-4"></v-divider>
                <p class="pb-3">Fehler beim Bilder Upload behoben.</p>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" block @click="closeDialog">Schließen</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const dialog = ref(false);
const latestNews = ref("20240919"); // Das aktuelle Datum als News-Version

// Funktion zum Überprüfen von Nachrichten
const checkNews = () => {
    const storedNews = localStorage.getItem("latestNews");
    if (!storedNews || latestNews.value !== storedNews) {
        dialog.value = true;
    }
};

// Funktion zum Schließen des Dialogs und Setzen der neuesten Nachricht in localStorage
const closeDialog = () => {
    localStorage.setItem("latestNews", latestNews.value);
    dialog.value = false;
};

// Überprüfe Nachrichten beim Mounten des Components
onMounted(() => {
    checkNews();
});
</script>
