<template>
<v-app dark class="" style="background-color: #1A1B2B;">

  

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
