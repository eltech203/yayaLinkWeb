<template>
<v-row style="background-color: #1A1B2B;" class="parallax_about">

    <v-col cols="12" sm="12" md="12">
        <v-row>
            <v-col cols="12" sm="12" md="12">
                <div class=" ">
                    <div class="text-center ">

                        <div class="d-flex">
                            <v-spacer></v-spacer>
                            <div class="text-center">
                                <v-carousel height="350" cycle :interval="4000" show-arrows-on-hover :continuous="false" :show-arrows="false" hide-delimiter-background delimiter-icon="mdi-minus">
                                    <v-carousel-item v-for="(item,i) in items" :key="i" reverse-transition="fade-transition" transition="fade-transition">

                                        <div class="container">
                                            <h1 style="color: aqua;margin-top: 120px;">{{ item.title }}</h1>
                                        </div>

                                    </v-carousel-item>
                                </v-carousel>
                            </div>
                            <v-spacer></v-spacer>

                        </div>

                    </div>

                </div>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-row class="container">
                    <v-col cols="12" sm="12" md="12">
                        <div class="container text-center">
                            <h4 style="color: white;">We would like to know what you are looking for.</h4>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <div class="container text-center">
                            <v-card class="container text-center">
                                <v-img :src="can" contain height="150"></v-img>
                                <h2>Am a house help job seeker</h2>
                                <br>
                                <v-btn fab to="/register/candidate" color="black">
                                    <v-icon color="accent">mdi-arrow-right</v-icon>
                                </v-btn>
                            </v-card>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <div class="container text-center">
                            <v-card class="container text-center">
                                <v-img :src="bu" contain height="150"></v-img>
                                <h2>Im a house help Bureau</h2>
                                <br>
                                <v-btn fab color="black" to="/register/bureau">
                                    <v-icon color="accent">mdi-arrow-right</v-icon>
                                </v-btn>
                            </v-card>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <div class="container text-center">
                            <v-card class="container text-center">
                                <v-img :src="emp" contain height="150"></v-img>
                                <h2>Im looking for a house help</h2>
                                <br>
                                <v-btn fab color="black" to="/selection">
                                    <v-icon color="accent">mdi-arrow-right</v-icon>
                                </v-btn>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-col>

</v-row>
</template>

<script>
import bu from "@/assets/bu1.png";
import emp from "@/assets/emp.png";
import can from "@/assets/can.png";

// Register the Vue component

export default {
    name: "Index",
    data() {
        return {
            bu,
            emp,
            can,
            items: [{
                    title: "Lets Get Started With Yaya Nannies App.",
                },
                {
                    title: "Your Domestic Manager called off?\nYou are 2 minutes away from Help.",
                },
                {
                    title: "Need to change househelp?\nSearch one of your liking on the yaya app.",
                },
                {
                    title: "Your househelp didnt show up?\nGet instant Help. ",
                },
            ],
            uid: null,
            auth_state: true,
        };
    },
    methods: {
        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                this.uid = this.$fire.auth.currentUser.uid;

            } else {
                this.auth_state = false;
            }
        },

    },
    created() {
        //this.setPin();
    },

    mounted() {
        // this.checkUser();
        // this.FetchProfile();
        // this.FetchWallet();
    },
};
</script>

<style scoped>
/* *{
        color:#202020;
    } */

.parallax_about {
    /* Background image */
    background-image: url('~/assets/hh.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
