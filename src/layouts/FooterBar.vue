<template>
    <div class="bg-grey-lighten-1 footer text-center">
        <p v-for="link in links" :key="link" class="pb-7">
            <v-btn color="white" variant="text" class="mx-2" rounded="xl" @click="openRoute(link.route);">
                {{ link.title }}
            </v-btn>
        </p>
        <p class="text">
            Kalotrack Apps:
        </p>
        <p>
            <a href="https://play.google.com/store/apps/details?id=de.murmli.kalotrack"><v-icon size="40"
                    color="grey-lighten-2" icon="mdi-google-play"></v-icon></a>

            <a href="#"><v-icon size="40" color="grey-lighten-2" icon="mdi-microsoft"></v-icon></a>
        </p>
    </div>
</template>
  
<script>
export default {
    data: () => ({
        links: [
            { title: 'Datenschutz', route: "/datenschutz" }
        ],
    }),
    methods: {
        openRoute(route) {
            this.$router.push(route);
        }
    }
}
</script>

<style scoped>
.footer {
    bottom: 0px;
    width: 100%;
    margin-top: 40px;
    padding: 40px;
    padding-bottom: 80px;
    position: static;
}

.text {
    color: white
}
</style>