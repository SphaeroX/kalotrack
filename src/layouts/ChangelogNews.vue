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
                <v-btn color="primary" block @click="closeDialog()">Schließen</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>


export default {
    data() {
        return {
            dialog: true,
            latestNews: "20240906"
        }
    },
    created() {
        this.checkNews();
    },
    methods: {
        checkNews() {
            if (!this.latestNews) { return; }
            const news = localStorage.getItem("latestNews");
            if (!news) {
                this.dialog = true;
            }

            if (this.latestNews != parseInt(news)) {
                this.dialog = true;
            }
        },
        closeDialog() {
            localStorage.setItem("latestNews", this.latestNews);
            this.dialog = false
        },
        currentDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            const formattedDate = `${year}${month}${day}`;

            return formattedDate;
        }
    }
}
</script>

<style scoped></style>