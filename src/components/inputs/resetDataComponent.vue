<template>
    <v-btn color="red" variant="elevated" @click="resetData()">Daten zurücksetzen</v-btn>

    <!-- Dialog Speech Input -->
    <v-dialog v-model="dialogResetData" width="auto">
        <v-card>
            <v-card-text class="text-center">
                <p class="mb-4 font-weight-bold">Daten zurücksetzen</p>
                <p class="mb-4">Möchstest du wirklich alle Daten löschen und die App somit zurücksetzen?</p>
                <v-card-actions>
                    <v-btn color="red" variant="elevated" @click="resetData()">Ja, alles löschen</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="dialogResetData = !dialogResetData">Abbrechen</v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialogResetData: false,
        }
    },
    methods: {
        resetData() {
            if (!this.dialogResetData) {
                this.dialogResetData = true;
                return;
            } else {
                localStorage.clear();
                this.dialogResetData = false;
                window.location.reload();
            }

        }
    },
    created() {
    }
}
</script> 

