<template>
    <div>
        <v-btn class="button" @click="openFileInput" :color="isSending ? 'red' : ''">{{ buttonText }}</v-btn>
        <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleFileChange" />
        <v-overlay v-model="overlay" contained class="align-center justify-center">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </div>
</template>
  
<script>
export default {
    emits: ['addItem'],
    props: {
        items: Array,
    },
    data() {
        return {
            backendUrl: import.meta.env.VITE_BACKEND_URL,
            isSending: false,
            overlay: false,
        };
    },
    computed: {
        buttonText() {
            return 'Foto Eingabe';
        },
    },
    methods: {
        openFileInput() {
            const fileInput = this.$refs.fileInput;
            if (fileInput) {
                fileInput.click();
            }
        },
        handleFileChange(event) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                this.uploadImage(selectedFile);
            }
        },
        async uploadImage(file) {
            this.isSending = true;
            this.overlay = true;

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(`${this.backendUrl}/api/imageToText`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                const formattedItems = data.items.map(item => {
                    return { ...item, daily: 0 };
                });

                this.$emit('addItem', formattedItems);
            } catch (error) {
                console.error('Fehler beim Senden der Datei an die API:', error);
            }

            this.overlay = false;
            this.isSending = false;
        },
    },
};
</script>
  
<style scoped>
.button {
    height: 60px;
    width: 100%;
}
</style>
  