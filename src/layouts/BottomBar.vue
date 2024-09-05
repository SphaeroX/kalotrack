<template>
    <v-container class="spacer"> </v-container>
    <v-container class="sticky-bottom-bar" fixed dense>
        <v-row no-gutters justify="center">
            <v-col cols="6">
                <v-btn class="button">
                    Fragen
                </v-btn>
            </v-col>
            <v-col cols="6">
                <v-btn class="button">
                    Hinzufügen
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<style scoped>
.spacer {
    padding-top: 69px;
}

.sticky-bottom-bar {
    position: fixed;
    margin: 0px;
    padding: 0px;
    bottom: 0px;
    width: 100%;
    z-index: 999;
}

.button {
    width: 100%;
    height: 60px;
}
</style>