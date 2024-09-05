<template>
    <v-expansion-panels variant="accordion" v-model="panels">
        <v-expansion-panel value="generator">
            <v-expansion-panel-title>Pläne generieren</v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-form v-on:submit.prevent>
                    <v-text-field v-model="plan.weight" label="Gewicht*" type="number"></v-text-field>
                    <v-text-field v-model="plan.duration" label="Trainingsdauer (Minuten) pro Plan*" type="number"></v-text-field>
                    <v-select v-model="plan.amount" :items="amountItems" label="Anzahl der Pläne*"></v-select>
                    <v-select v-model="plan.gender" :items="genderItems" label="Geschlecht*"></v-select>
                    <v-select v-model="plan.level" :items="levelItems" label="Trainingserfahrung*"></v-select>
                    <v-select v-model="plan.type" :items="typeItems" label="Wo willst du trainieren?*"></v-select>
                    <v-select v-model="plan.exercisesAmount" :items="exercisesAmountItems" label="Übungsanzahl pro Plan"></v-select>
                    <v-text-field v-model="plan.focus" label="Trainingsfokus auf den du Wert legst*"></v-text-field>
                    <v-textarea v-model="plan.additional" clearable label="Extrawünsche (freitext)"></v-textarea>

                    <v-row class="align-center justify-center">
                        <v-btn @click="generatePlans()" prepend-icon="mdi-check-circle">
                            <template v-slot:prepend>
                                <v-icon color="success"></v-icon>
                            </template>
                            Generieren
                        </v-btn>
                        <div>
                            <p class="text-caption pb-3"> Kann bis zu 50 Sekunden dauern. </p>
                        </div>
                    </v-row>
                </v-form>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

    <!-- LoadingOverlay -->
    <v-overlay v-model="overlayLoading" contained class="align-center justify-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <!-- Dialog -->
    <v-dialog v-model="dialog" width="auto">
        <v-card>
            <v-card-text>
                {{ dialogText }}
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" block @click="dialog = false">Schließen</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useTraningStore } from '@/stores/traningStore';
</script>

<script>
export default {
    data: () => ({
        store: null,
        panels: [],
        overlayLoading: false,
        dialog: false,
        dialogText: false,
        plan: {
            weight: null,
            duration: null,
            amount: null,
            gender: null,
            level: null,
            type: null,
            focus: null,
            exercisesAmount: null,
            additional: null,
        },

        amountItems: [1, 2, 3, 4, 5],
        genderItems: ["männlich", "weiblich"],
        levelItems: ["Beginner", "Erfahrend", "Profi"],
        typeItems: ["Fitnessstudio", "Zuhause"],
        focusItems: [
            "Fettreduzierung",
            "Muskelaufbau: Ganzkörper",
            "Muskelaufbau: Oberkörper",
            "Muskelaufbau: Unterkörper",
            "Muskelausdauer: Ganzkörper",
            "Muskelausdauer: Oberkörper",
            "Muskelausdauer: Unterkörper",
        ],
        exercisesAmountItems: ["Keine Angabe", 1, 2, 3, 4, 5, 6, 7, 8, 9],
    }),
    created() {
        this.store = useTraningStore();
        this.preSetValues();
    },
    methods: {
        async generatePlans() {
            const additional = this.plan.additional;

            try {
                if (additional === null) this.plan.additional = false;

                for (const key in this.plan) {
                    if (this.plan[key] === null) {
                        this.plan.additional = additional;
                        this.dialog = true;
                        this.dialogText = 'Bitte alle Felder ausfüllen.';
                    }
                }

                this.overlayLoading = true;
                this.panels = [];
                await this.store.createPlans(this.plan);
                this.plan.additional = additional;
                this.overlayLoading = false;

            } catch (error) {
                this.dialog = true;
                this.dialogText = 'Es ist ein Fehler aufgetreten, versuche es nochmals oder melde den Fehler unter Info & Hilfe';
                this.plan.additional = additional;
                this.overlayLoading = false;
            }

        },
        preSetValues() {
            const bodyData = JSON.parse(localStorage.getItem("bodyData"));

            if (bodyData.weight) {
                this.plan.weight = bodyData.weight;
            }

            if (bodyData.gender) {
                this.plan.gender = bodyData.gender;
            }
        }
    }
}
</script>
