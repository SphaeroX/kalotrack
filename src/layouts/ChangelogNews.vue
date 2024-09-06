<template>
    <v-dialog v-model="dialog" width="full">
        <v-card>
            <v-card-text>
                <h3>Update 06.09.2024</h3>
                <v-divider class="pb-4"></v-divider>
                <p class="pb-3">Die App ist opensource, Discord und Github Link sind im Menü</p>
                <p class="pb-3">Zudem wurde die Hauptseite überarbeitet, die Chatfunktion kommt noch.</p>
                <p class="pb-3">CSV Export wurde optimiert.</p>
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
const latestNews = '20240906';

const checkNews = () => {
    const news = localStorage.getItem('latestNews');
    if (!news || latestNews !== parseInt(news)) {
        dialog.value = true;
    }
};

const closeDialog = () => {
    localStorage.setItem('latestNews', latestNews);
    dialog.value = false;
};

onMounted(() => {
    checkNews();
});
</script>

<style scoped></style>