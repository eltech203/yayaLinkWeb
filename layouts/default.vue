<template>
<v-app dark class="" style="background-color: #1A1B2B;">

    <div class="d-flex text-center">
        <v-spacer></v-spacer>
        <v-app-bar elevation="0" color="black" dark :clipped-left="clipped" fixed app rounded>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
            <v-toolbar-title>
                <span style="color: aqua; font-weight: bold; font-size: 20px;">YayaLink</span>
            </v-toolbar-title>

            <v-spacer />

            <v-btn icon v-show="false">
                <v-icon>mdi-chart-line-stacked</v-icon>
            </v-btn>
            <v-btn icon v-show="!auth_state">
                <v-icon>mdi-bell-badge</v-icon>
            </v-btn>

            <v-btn v-show="!auth_state" icon @click="logout()">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>
        <v-spacer></v-spacer>
    </div>

    <v-main>
        <Nuxt />
    </v-main>

    <v-footer style="background-color: #1A1B2B;" dark :absolute="!fixed" app>
        <v-row>
            <v-col>

            </v-col>
        </v-row>
        <div class="text-center">

            <div class="d-flex">
                <div class="d-flex">
                    <h5 style="color: aqua;">YayaLink</h5>
                    <span>&copy; {{ new Date().getFullYear() }}</span>
                </div>
            </div>
        </div>
        <v-row>
            <v-col>

            </v-col>
        </v-row>
    </v-footer>
</v-app>
</template>

<script>
export default {
    name: 'DefaultLayout',
    data() {
        return {
            clipped: false,
            auth_state: false,
            drawer: false,
            fixed: false,
            items: [{
                    icon: 'mdi-account',
                    title: 'Account',
                    to: '/'
                },
                {
                    icon: 'mdi-wallet',
                    title: 'Wallet',
                    to: '/inspire'
                }
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: ''
        }
    },
    methods: {
        logout() {
            this.$fire.auth.signOut();
            window.location.reload(true);
        },

    },
}
</script>

<style>


* {
    font-family: "Quicksand", sans-serif;
    scroll-behavior: smooth;
    overflow: hidden;

}
</style>
