<template>
    <v-dialog v-model="dialog" width="full">
        <v-card>
            <v-card-text>
                <h3>Update 08.11.2023</h3>
                <v-divider class="pb-4"></v-divider>
                <p>Eingabe durch Foto!</p>
                <p class="pt-3">Ihr habt jetzt die Möglichkeit ein Bild von eurem Essen zu machen und dies hinzuzufügen
                    den Button dafür findet ihr Links unten neben Essen hinzufügen</p>
                <p class="pt-7">Bei Fehlern oder Ideen meldet euch jederzeit per <a
                        href="mailto:prompt-engineered@protonmail.com">Mail</a>
                </p>
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
            dialog: false,
            latestNews: "20240905"
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