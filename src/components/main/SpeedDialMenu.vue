<template>
    <div class="floating-speed-dial">
        <v-speed-dial location="top center" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
                <v-fab v-bind="activatorProps" size="large" icon="mdi-plus"></v-fab>
            </template>
            <v-btn key="1" icon="mdi-format-text" @click="toggleTextField"></v-btn>
            <v-btn key="2" icon="mdi-microphone" @click="startRecording"></v-btn>
            <v-btn key="3" icon="mdi-camera" @click="openImagePicker"></v-btn>
            <v-btn key="4" icon="mdi-chat" @click="openChatDialog"></v-btn>
        </v-speed-dial>

        <!-- Sticky-Textfeld  -->
        <v-text-field v-if="showTextField" v-model="inputText" ref="inputFieldRef" :label="label"
            append-inner-icon="mdi-send" class="sticky-textfield" placeholder="Texteingabe für Kalotrack"
            @focus="clearInactivityTimer" @blur="startInactivityTimer" @click="exampleInput"
            @click:append-inner="handleEnter" @keydown.enter="handleEnter">
        </v-text-field>


        <!-- Chat-Dialog -->
        <v-dialog v-model="chatDialog" fullscreen persistent>
            <v-card>
                <v-toolbar flat dark color="primary">
                    <v-btn icon @click="chatDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Chat</v-toolbar-title>
                </v-toolbar>

                <v-card-text class="chat-content">
                    <!-- Chat-Nachrichten anzeigen -->
                    <div v-for="message in chatMessages" :key="message">
                        <p>{{ message }}</p>
                    </div>
                </v-card-text>

                <!-- Chat-Eingabe -->
                <v-card-actions>
                    <v-text-field v-model="chatInput" placeholder="Schreiben Sie eine Nachricht"
                        @keyup.enter="sendMessage"></v-text-field>
                    <v-btn @click="sendMessage">Senden</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Recording-Dialog -->
        <v-dialog v-model="recordingDialog">
            <v-card>
                <v-card-text class="text-center">
                    <div class="text-h6 text-red font-weight-bold recording-text">
                        Aufnahme läuft...
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="error" block rounded="3" variant="flat" class="my-4" @click="discardVoiceInput">
                        Verwerfen
                    </v-btn>
                </v-card-actions>
                <v-card-actions>
                    <v-btn color="success" block rounded="3" variant="flat" class="mb-4" @click="submitVoiceInput">
                        Absenden
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--- Loading Dialog -->
        <v-overlay v-model="overlay" absolute class="d-flex align-center justify-center" z-index="10">
            <v-progress-circular indeterminate size="50" color="primary"></v-progress-circular>
        </v-overlay>

    </div>

    <!-- Hidden File Input -->
    <input type="file" ref="fileInput" accept="image/*" @change="handleImageSelect" style="display: none;" />

</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { useMainStore } from '@/stores/mainStore';
import { useApiStore } from '@/stores/apiStore'; // Api Store für Backend-Verbindung

const store = useMainStore();
const apiStore = useApiStore();

const recordingDialog = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);

const inputText = ref('');
const label = ref('Fang an zu tippen...');
const overlay = ref(false);

let inactivityTimer = null;

// Reactive data
const showTextField = ref(false);
const chatDialog = ref(false);
const chatInput = ref('');
const chatMessages = ref(["Hier kann man unter anderem dann Fragen zur seiner Ernährung, Diät etc stellen.", "Folgt bald..."]);
const inputFieldRef = ref(null);
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const fileInput = ref(null);

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

// handleEnter function
const handleEnter = async () => {
    if (!inputText.value) {
        return;
    }

    overlay.value = true;

    try {
        const formData = new FormData();
        formData.append('prompt', inputText.value);

        const response = await fetch(`${backendUrl}/api/prompt`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        const formattedItems = data.items.map(item => ({ ...item, daily: 0 }));

        inputText.value = '';
        store.addItems(formattedItems);
    } catch (error) {
        inputText.value = 'FEHLER';
        console.error('Fehler beim Senden der Datei an die API:', error);
    }

    overlay.value = false;
};

// Toggle sticky text field
const toggleTextField = () => {
    showTextField.value = !showTextField.value;
    if (showTextField.value) {
        nextTick(() => {
            inputFieldRef.value.focus();  // Fokus auf das Textfeld setzen
        });
        startInactivityTimer();
    } else {
        clearInactivityTimer();
    }
};

// Start inactivity timer
const startInactivityTimer = () => {
    clearInactivityTimer();
    inactivityTimer = setTimeout(() => {
        showTextField.value = false;
    }, 5000);
};

// Clear inactivity timer
const clearInactivityTimer = () => {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
};

// Open chat dialog
const openChatDialog = () => {
    chatDialog.value = true;
};

// Send a chat message
const sendMessage = () => {
    if (chatInput.value.trim() !== '') {
        chatMessages.value.push(chatInput.value);
        chatInput.value = '';
    }
};

// Send Picture
const sendPicture = () => {

};

// Start Recording Funktion
const startRecording = async () => {
    recordingDialog.value = true;
    audioChunks.value = [];

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.value = new MediaRecorder(stream);

        mediaRecorder.value.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.value.push(event.data);
            }
        };

        mediaRecorder.value.start();
    } catch (error) {
        console.error('Fehler beim Starten der Aufnahme:', error);
        recordingDialog.value = false;
    }
};

// Aufnahme stoppen und verwerfen
const discardVoiceInput = () => {
    if (mediaRecorder.value) {
        mediaRecorder.value.stop();
        mediaRecorder.value = null;
    }
    audioChunks.value = [];
    recordingDialog.value = false;
};

// Aufnahme stoppen und an Backend senden
const submitVoiceInput = async () => {
    if (mediaRecorder.value) {
        mediaRecorder.value.stop();
        recordingDialog.value = false;
        overlay.value = true;


        mediaRecorder.value.onstop = async () => {
            const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('audio', audioBlob);

            try {
                const result = await apiStore.voiceToItems(formData);
                store.addItems(result);
                audioChunks.value = [];
                overlay.value = false;

            } catch (error) {
                alert('Fehler beim Senden der Aufnahme.');
                console.error('Fehler beim Senden der Aufnahme:', error);
            }
        };
    }
};

// Function to open image picker
const openImagePicker = () => {
    fileInput.value.click();
};

// Funktion zur Reduzierung der Bildgröße
const resizeImage = (file, maxDimension) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxDimension) {
                    height = (height * maxDimension) / width;
                    width = maxDimension;
                }
            } else {
                if (height > maxDimension) {
                    width = (width * maxDimension) / height;
                    height = maxDimension;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                resolve(blob);
            }, file.type);
        };

        reader.readAsDataURL(file);
    });
};

// Handle selected image
const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Bild auf maximale Dimension von 600 Pixel verkleinern
    const resizedBlob = await resizeImage(file, 600);
    const formData = new FormData();
    formData.append('image', resizedBlob, file.name);

    overlay.value = true;

    try {
        const result = await apiStore.imageToItems(formData);
        store.addItems(result);
    } catch (error) {
        console.error('Fehler beim Senden des Bildes:', error);
        alert('Fehler beim Senden des Bildes.');
    } finally {
        overlay.value = false;
    }
};

onMounted(() => {
    exampleInput();
});
</script>

<style scoped>
.floating-speed-dial {
    position: fixed;
    bottom: 60px;
    right: 60px;
    width: 100%;
    height: 60px;
    text-align: right;
}

.sticky-textfield {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: white;
}

.chat-content {
    max-height: calc(100vh - 150px);
    overflow-y: auto;
    padding: 16px;
}

.recording-text {
    animation: fade 1.0s infinite alternate;
}

.v-overlay--absolute {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
}


@keyframes fade {
    from {
        opacity: 0.25;
    }

    to {
        opacity: 1;
    }
}
</style>
