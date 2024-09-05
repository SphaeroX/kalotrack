<template>
    <v-btn class="button" @click="toggleRecording" :color="isRecording ? 'red' : ''">{{ buttonText }}</v-btn>
    <v-overlay v-model="overlay" contained class="align-center justify-center">
        <v-progress-circular indeterminate size="64">
        </v-progress-circular>
    </v-overlay>
</template>

  
<script>
export default {
    emits: ['showDialog'],
    props: {
        items: Array,
        nutrientSuggested: Object,
        kcalSuggested: String
    },
    created() {
        this.calculateTotalNutrition()
    },
    data() {
        return {
            isRecording: false,
            mediaRecorder: null,
            chunks: [],
            audioPlayback: new Audio(),
            overlay: false,
            backendUrl: import.meta.env.VITE_BACKEND_URL,
            currentTotalNutrition: null
        };
    },
    computed: {
        buttonText() {
            return this.isRecording ? 'Aufnahme läuft' : 'Fragen';
        },
    },
    methods: {
        async toggleRecording() {
            this.isRecording = !this.isRecording;

            if (this.isRecording) {
                await this.startRecording();
            } else {
                await this.stopRecording();
            }
        },
        async startRecording() {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);

            this.mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    this.chunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.chunks, { type: 'audio/mp3' });
                // this.playAudio(audioBlob);
                await this.sendAudioToAPI(audioBlob);

                this.chunks = [];
            };

            this.mediaRecorder.start();
        },
        async stopRecording() {
            if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                this.mediaRecorder.stop();
                this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }
        },
        playAudio(blob) {
            const objectUrl = URL.createObjectURL(blob);
            this.audioPlayback.src = objectUrl;
            this.audioPlayback.play();
        },
        async sendAudioToAPI(audioBlob) {
            this.overlay = true;

            try {
                const formData = new FormData();
                formData.append('audio', audioBlob, 'recording.mp3');

                this.calculateTotalNutrition();

                const current = this.currentTotalNutrition;

                let target = this.nutrientSuggested === false ? {} : this.nutrientSuggested;

                target.kcal = this.kcalSuggested;

                const rest = this.calculateNutritionDifferences(current, target);

                // JSON-Objekt erstellen
                const jsonPayload = {
                    current,
                    target,
                    rest
                };

                // JSON-Objekt in einen String konvertieren und als Teil der FormData hinzufügen
                formData.append('jsonPayload', JSON.stringify(jsonPayload));

                const response = await fetch(`${this.backendUrl}/api/speech/ask`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                this.$emit('showDialog', data.answer);
            } catch (error) {
                console.error('Fehler beim Senden der Datei an die API:', error);
            }

            this.overlay = false;
        },

        calculateTotalNutrition() {
            let kcal = 0;
            let protein = 0;
            let fat = 0;
            let carbs = 0;

            for (const meal of this.items) {
                kcal += meal.kcal;
                protein += meal.protein;
                fat += meal.fat;
                carbs += meal.carbohydrates;
            }

            this.currentTotalNutrition = {
                kcal,
                protein,
                fat,
                carbs,
            }
        },
        calculateNutritionDifferences(current, target) {
            const differences = {};

            // Berechnen der Differenzen für jede Eigenschaft
            for (const nutrient in current) {
                if (Object.prototype.hasOwnProperty.call(current, nutrient) && Object.prototype.hasOwnProperty.call(target, nutrient)) {
                    const difference = target[nutrient] - current[nutrient];
                    differences[nutrient] = difference;
                }
            }

            return differences;
        }
    }
};
</script>

<style scoped>
.button {
    height: 60px;
    width: 100%;
}
</style>
  
