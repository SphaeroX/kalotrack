<template>
    <v-expansion-panels variant="accordion">
        <v-expansion-panel v-for="(plan, index) in planArray" :key="index">
            <v-expansion-panel-title>{{ plan.name }} ({{ plan.codeName }})</v-expansion-panel-title>

            <v-expansion-panel-text>
                <div>
                    <p class="text-right py-5">
                        <v-icon color="red" @click="deletePlanDialog(index)" icon="mdi-delete"></v-icon>
                    </p>
                </div>
                <v-card v-for="(exercise, index) in plan.exercises" :key="index" class="mb-5">
                    <v-card-item>
                        <v-card-title>
                            <v-icon color="blue" icon="mdi-information" @click="showInstructions(exercise.instructions)"></v-icon>
                            {{ exercise.name }}
                        </v-card-title>

                        <v-card-subtitle>
                            <p>{{ exercise.repetitions }} Wiederholungen</p>
                            <p>{{ exercise.sets }} Sätze</p>
                            <p>{{ exercise.restBetweenReps }} Sek. Pause nach Wdh.</p>
                            <p>{{ exercise.restBetweenSets }} Sek. Pause nach diesem Set</p>
                        </v-card-subtitle>

                    </v-card-item>

                    <v-card-text>
                        <v-btn class="my-3" @click="startTimer(exercise.restBetweenReps)">
                            {{ buttonText }}
                        </v-btn>
                        <v-btn class="my-3" @click="startTimerSet(exercise.restBetweenSets)">{{ setButtonText
                        }}</v-btn>
                    </v-card-text>
                </v-card>

                <div class="text-center">
                    <v-btn append-icon="mdi-check-circle" class="mb-3" @click="showFinishPlan(plan.calories)">
                        <template v-slot:append>
                            <v-icon color="success"></v-icon>
                        </template>
                        Training wurde absolviert</v-btn>
                </div>

            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

    <!-- Dialog -->
    <v-dialog v-model="dialog" width="auto">
        <v-card>
            <v-card-text>
                {{ dialogText }}
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" variant="elevated" @click="deletePlan()">Bestätigen</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="dialog = !dialog">Schließen</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Dialog Anleitung -->
    <v-dialog v-model="dialogInstructions" width="auto">
        <v-card>
            <v-card-text>
                <v-list>
                    <v-list-item v-for="(instruction, index) in instructionList" :key="index">
                        <v-list-item-subtitle>{{ instruction }} </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="dialogInstructions = !dialogInstructions">Schließen</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- Dialog Training abschließen -->
    <v-dialog v-model="dialogFinishPlan" width="auto">
        <v-card>
            <v-card-text>
                Super gemacht, möchtest du die verbrauchten Kalorien ({{ memory }}) zu deinem Tagesbdarf dazurechnen?
            </v-card-text>
            <v-card-actions>
                <v-btn color="green" variant="elevated" @click="finishPlan()">Bestätigen</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="dialogFinishPlan = !dialogFinishPlan">Schließen</v-btn>
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
        dialog: false,
        dialogText: null,
        dialogFinishPlan: false,
        dialogInstructions: false,
        memory: null,
        timer: null,
        remainingTime: 0,
        setTimer: null,
        setRemainingTime: 0,
        buttonClass: 'my-3',
        instructionList: []
    }),
    created() {
        this.store = useTraningStore();
        this.store.readPlans();
    },
    methods: {
        deletePlanDialog(index) {
            this.dialogText = `${this.planArray[index].name} wirklich löschen?`;
            this.memory = index;
            this.dialog = true;
        },
        deletePlan() {
            this.store.deletePlan(this.memory);
            this.dialog = false;
        },
        showInstructions(array) {
            this.instructionList = array;
            this.dialogText = '<ul>';
            array.forEach((item) => {
                this.dialogText += `<li>${item}</li>`;
            });
            this.dialogText += '</ul>';
            this.dialogInstructions = true;

            return true;
        },
        showFinishPlan(calories) {
            this.memory = calories;
            this.dialogFinishPlan = true;
        },
        finishPlan() {
            const kcalSuggested = localStorage.getItem("kcalSuggested");
            if (kcalSuggested) {
                localStorage.setItem("kcalSuggested", parseInt(kcalSuggested) + parseInt(this.memory))
            }
            this.dialogFinishPlan = false;
        },
        startTimer(duration) {
            if (this.timer) {
                clearInterval(this.timer);
                this.remainingTime = 0;
                return;
            }
            this.remainingTime = duration;
            this.timer = setInterval(() => {
                if (this.remainingTime > 0) {
                    this.remainingTime--;
                } else {
                    this.playBeep();
                    clearInterval(this.timer);
                }
            }, 1000);
        },
        playBeep() {
            // Erstellen Sie einen AudioContext
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Erstellen Sie einen Oszillator
            const oscillator = audioContext.createOscillator();
            oscillator.type = 'sine'; // Sinuswelle für einen einfachen Ton

            // Legen Sie die Frequenz des Tons fest (z. B. 440 Hz für A4)
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);

            // Verbinden Sie den Oszillator mit dem AudioContext-Ausgang
            oscillator.connect(audioContext.destination);

            // Starten Sie den Oszillator
            oscillator.start();

            // Stoppen Sie den Oszillator nach einer Sekunde (1000 Millisekunden)
            oscillator.stop(audioContext.currentTime + 0.3);
        },
        startTimerSet(duration) {
            if (this.setTimer) {
                clearInterval(this.setTimer);
                this.setRemainingTime = 0;
                return;
            }
            this.setRemainingTime = duration;
            this.setTimer = setInterval(() => {
                if (this.setRemainingTime > 0) {
                    this.setRemainingTime--;
                } else {
                    this.playBeep();
                    clearInterval(this.setTimer);
                }
            }, 1000);
        },
    },
    computed: {
        planArray() {
            return this.store.plans;
        },
        buttonText() {
            return this.remainingTime ? `Pause läuft (${this.remainingTime})` : 'Start Pausentimer';
        },
        setButtonText() {
            return this.setRemainingTime ? `Satzpause läuft (${this.setRemainingTime})` : 'Set beenden';
        },
    }
}
</script>
<style scoped>
.v-list-item-subtitle {
    display: block;
}
</style>