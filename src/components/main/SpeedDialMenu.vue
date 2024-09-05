<template>
    <div class="floating-speed-dial">
        <v-speed-dial location="top center" transition="fade-transition">
            <template v-slot:activator="{ props: activatorProps }">
                <v-fab v-bind="activatorProps" size="large" icon="mdi-plus"></v-fab>
            </template>
            <v-btn key="1" icon="mdi-format-text" @click="toggleTextField"></v-btn>
            <v-btn key="2" icon="mdi-microphone" @click="startRecording"></v-btn>
            <v-btn key="3" icon="mdi-camera" @click="openCamera"></v-btn>

            <v-btn key="4" icon="mdi-chat" @click="openChatDialog"></v-btn>
        </v-speed-dial>

        <!-- Sticky-Textfeld  -->
        <v-text-field v-if="showTextField" v-model="inputText" ref="inputFieldRef" :label="label"
            append-inner-icon="mdi-send" class="sticky-textfield" placeholder="Texteingabe für Kalotrack"
            @focus="clearInactivityTimer" @blur="startInactivityTimer" @click="exampleInput"
            @click:append-inner="handleEnter" @keydown.enter="handleEnter">
            <v-overlay v-model="overlay" contained class="align-center justify-center">
                <v-progress-circular indeterminate size="30"></v-progress-circular>
            </v-overlay>
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
                    <div v-for="message in chatMessages" :key="message">{{ message }}</div>
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
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { useMainStore } from '@/stores/mainStore';

const store = useMainStore();

let inactivityTimer = null;

// Reactive data
const showTextField = ref(false);
const inputText = ref('');
const chatDialog = ref(false);
const recordingDialog = ref(false);
const chatInput = ref('');
const chatMessages = ref([]);
const inputFieldRef = ref(null);
const overlay = ref(false);
const label = ref('Fang an zu tippen...');
const backendUrl = import.meta.env.VITE_BACKEND_URL;


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

// Camera function (Web API)
const openCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                // Handle the stream here
                console.log("Camera stream started");
            })
            .catch(error => {
                console.error("Camera access denied", error);
            });
    } else {
        alert("Kamera wird nicht unterstützt.");
    }
};

// Voice recording function (Web API)
const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                console.log("Recording started");

                // Stop and discard the recording
                const stopRecording = () => {
                    mediaRecorder.stop();
                    console.log("Recording stopped");
                };

                // You can attach this stopRecording to a button or dialog
                setTimeout(stopRecording, 5000); // Example: Auto-stop after 5 seconds
            })
            .catch(error => {
                console.error("Microphone access denied", error);
            });
    } else {
        alert("Mikrofon wird nicht unterstützt.");
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

@keyframes fade {
    from {
        opacity: 0.25;
    }

    to {
        opacity: 1;
    }
}
</style>
