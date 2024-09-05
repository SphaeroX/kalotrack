<template>
    <v-btn class="button" @click="toggleRecording" :color="isRecording.value ? 'red' : ''">{{ buttonText }}</v-btn>
    <v-overlay v-model="overlay.value" contained class="align-center justify-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
</template>

<script setup>
import { ref, computed } from 'vue';

const isRecording = ref(false);
const mediaRecorder = ref(null);
const chunks = ref([]);
const audioPlayback = new Audio();
const overlay = ref(false);
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const buttonText = computed(() => {
    return isRecording.value ? 'Aufnahme läuft' : 'Essen Hinzufügen';
});

const toggleRecording = async () => {
    isRecording.value = !isRecording.value;

    if (isRecording.value) {
        await startRecording();
    } else {
        await stopRecording();
    }
};

const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);

    mediaRecorder.value.ondataavailable = event => {
        if (event.data.size > 0) {
            chunks.value.push(event.data);
        }
    };

    mediaRecorder.value.onstop = async () => {
        const audioBlob = new Blob(chunks.value, { type: 'audio/mp3' });
        // playAudio(audioBlob);
        await sendAudioToAPI(audioBlob);

        chunks.value = [];
    };

    mediaRecorder.value.start();
};

const stopRecording = async () => {
    if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
        mediaRecorder.value.stop();
        mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
    }
};

const playAudio = (blob) => {
    const objectUrl = URL.createObjectURL(blob);
    audioPlayback.src = objectUrl;
    audioPlayback.play();
};

const sendAudioToAPI = async (audioBlob) => {
    overlay.value = true;

    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.mp3');

        const response = await fetch(`${backendUrl}/api/transcribe`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        // adding daily:0
        const formattedItems = data.items.map(item => ({
            ...item,
            daily: 0
        }));

        // Emit the event with formatted items
        emit('addItem', formattedItems);
    } catch (error) {
        console.error('Fehler beim Senden der Datei an die API:', error);
    }

    overlay.value = false;
};
</script>

<style scoped>
.button {
    height: 60px;
    width: 100%;
}
</style>
