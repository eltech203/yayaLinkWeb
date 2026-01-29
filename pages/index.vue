<template>
<v-row style="background-color: #1A1B2B; color: #fff;">

        <v-row>
            <v-col cols="12" sm="12" md="12" class="parallax_about">
                <div class="container" style="padding: 30px;">
                    <div class="text-center">

                        <div class="d-flex">
                            <v-spacer />
                            <div class="text-center">
                                <v-carousel style="padding: 20px;" height="350" cycle :interval="4000" show-arrows-on-hover :continuous="false" :show-arrows="false" hide-delimiters>
                                    <v-carousel-item v-for="(item,i) in items" :key="i" reverse-transition="fade-transition" transition="fade-transition">

                                        <div class="container text-center">
                                            <h1 style="color: aqua;margin-top: 50px;">{{ item.title }}</h1>
                                        </div>

                                    </v-carousel-item>
                                </v-carousel>
                            </div>
                            <v-spacer />
                        </div>
                        <!-- 
                        <p> Hire, replace or get emergency</p>
                        <p>househelp — fast & trusted</p> -->
                        <br>
                        <br>
                        <v-btn outlined style="margin-left: 0px;" rounded color="white">Get Started <v-icon>mdi-arrow-top-right</v-icon>
                        </v-btn>

                    </div>

                </div>
            </v-col>
            <v-col cols="12" sm="12" md="12" class="container">
                <v-row class="">

                    <v-col cols="12" sm="12" md="6" class="container" style="margin-top: 50px;">
                        <div class="container">
                            <div class="row">
                                <div class="d-flex" style="margin-top: 50px;">
                                    <div class="container text-bottom pa-8 align-center">
                                        <h1>Choose What You’re Looking For</h1>

                                        <p>Whether you’re a house help searching for work, a bureau managing candidates, or an employer looking to hire.</p>
                                    </div>
                                    <v-icon x-large color="white">mdi-arrow-right</v-icon>
                                </div>

                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                        <v-row class="">
                            <v-col cols="12" sm="4" md="4">
                                <div class="container text-center">
                                    <v-card class="container text-center " max-width="400" style="border-radius: 14px;">
                                        <v-img :src="can" contain height="100"></v-img>
                                        <h3>I’m a House Help Job Seeker</h3>
                                        <p>Create your profile, get verified, and connect with trusted employers and bureaus looking for reliable house helps.</p>
                                        <br>
                                        <v-btn fab to="/register/candidate" color="black">
                                            <v-icon color="accent">mdi-arrow-right</v-icon>
                                        </v-btn>
                                    </v-card>
                                </div>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <div class="container text-center">
                                    <v-card class="container text-center" max-width="400" style="border-radius: 14px;">
                                        <v-img :src="bu" contain height="100"></v-img>
                                        <h3>Im a house help Bureau</h3>
                                        <p>Manage candidates easily, connect with verified employers, and place house helps faster with confidence.</p>
                                        <br>
                                        <v-btn fab color="black" to="/register/bureau">
                                            <v-icon color="accent">mdi-arrow-right</v-icon>
                                        </v-btn>
                                    </v-card>
                                </div>
                            </v-col>
                            <v-col cols="12" sm="4" md="4">
                                <div class="container text-center">
                                    <v-card class="container text-center" max-width="400" style="border-radius: 14px;">
                                        <v-img :src="emp" contain height="100"></v-img>
                                        <h3>Im looking for a house help</h3>
                                        <p>Browse verified house helps, choose based on experience and location, and hire instantly with flexible access plans.</p>
                                        <br>
                                        <v-btn fab color="black" to="/selection">
                                            <v-icon color="accent">mdi-arrow-right</v-icon>
                                        </v-btn>
                                    </v-card>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <div class="d-flex">
                            <v-spacer />
                            <div class="container text-center">
                                <h1>How it Works.</h1>

                                <p> Browse verified profiles, get access through a simple payment, <br> and contact candidates directly. No middlemen, no delays just fast and reliable connections.</p>
                            </div>
                            <v-spacer />
                        </div>

                    </v-col>
                    <v-row>
                        <v-col cols="12" sm="12" md="6">
                            <div class="text-start container" style="padding: 20px;">
                                <v-img :src="laundry" contain height="350"></v-img>
                            </div>

                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <div class="container">
                                <v-row>
                                    <v-col cols="12" sm="12" md="6">
                                        <div class="text-start container">
                                            <div class="">
                                                <v-icon large color="accent">mdi-search-web</v-icon>
                                                <h2 style="font-size: 1.6rem; font-weight: 600;">Browes View verified candidates </h2>
                                                <p>Explore a list of verified househelps with detailed profiles including experience, location, and expected salary. Every candidate is screened to help you make confident and informed hiring decisions.</p>
                                                <v-btn outlined rounded to="/selection" color="accent">Learn more <v-icon>mdi-arrow-top-right</v-icon>
                                                </v-btn>
                                            </div>

                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="6">
                                        <div class="text-start container">
                                            <div class="">
                                                <v-icon large color="accent">mdi-credit-card-outline</v-icon>
                                                <h2 style="font-size: 1.6rem; font-weight: 600;">Pay for Access period</h2>
                                                <p>Choose an access plan that works for you — 3 days, 1 week, or 1 month. Once payment is completed, you can view full candidate details and contact them directly during your active period.</p>
                                                <v-btn outlined rounded to="/selection" color="accent">Learn more <v-icon>mdi-arrow-top-right</v-icon>
                                                </v-btn>

                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <div class="text-start container">
                                            <div class="">
                                                <v-icon large color="accent">mdi-phone</v-icon>
                                                <h2 style="font-size: 1.6rem; font-weight: 600;">Higher candidate instantly </h2>
                                                <p>Select a candidate you like and hire instantly with just one click.
                                                    Their status updates automatically, ensuring availability is accurate and preventing double hiring.</p>
                                                <v-btn outlined rounded to="/selection" color="accent">Learn more <v-icon>mdi-arrow-top-right</v-icon>
                                                </v-btn>

                                            </div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </div>

                        </v-col>

                    </v-row>

                    <v-col cols="12" sm="12" md="12">
                        <div class="container">
                            <div class="d-flex row">

                                <div class="container text-start pa-8">
                                    <h1>Trust & Safety Section Paragraph</h1>

                                    <p><b>Your peace of mind matters to us.</b> <br> Every candidate and bureau on YayaLink goes through verification <br> to ensure safety and reliability. <br> We prioritize transparency, accountability, and trust in every connection made on the platform.</p>
                                </div>

                                <div class="container text-end pa-8">
                                    <h1>Pricing Preview Section Paragraph</h1>

                                    <p><b>Clear pricing with no hidden charges.</b> <br>Choose a plan that fits your needs whether you need access <br> for a few days, a week, or a full month. <br> Pay once and connect with candidates during your active period.</p>
                                </div>

                                <div class="container text-start pa-8">
                                    <h1>Coverage Section Paragraph</h1>

                                    <p><b>Local help, wherever you are.
                                        </b> <br> YayaLink is expanding across counties in Kenya, making it easier to find househelps <br> and employers within your area. <br> We focus on local connections for faster and better matches.</p>
                                </div>

                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

</v-row>
</template>

<script>
import bu from "@/assets/bu1.png";
import emp from "@/assets/emp.png";
import can from "@/assets/can.png";
import laundry from "@/assets/laundry.svg"

// Register the Vue component

export default {
    name: "Index",
    data() {
        return {
            laundry,
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
    background-image: url('~/assets/he.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;

}

/* .parallax {
    background-image: url('~/assets/hr.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;

} */
</style>
