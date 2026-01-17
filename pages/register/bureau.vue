<template>
<div class="container">
    <v-row>
        <v-col cols="12" class="">
           <nuxt-link to="/" style="text-decoration: none;">
                <v-btn icon>
                    <v-icon color="black">mdi-arrow-left</v-icon>
                </v-btn>
            </nuxt-link>
        </v-col>
        <v-col cols="12" md="6" sm="6" class="">
            <v-tabs color="black" center-active :show-arrows="true" class="text-center">

                    <v-tab  value="two" >
                        <span>Register a New Account</span></v-tab>

                </v-tabs>
            <div class="container">
                <form @submit.prevent="registerBureau">
                     <v-autocomplete v-model="form.county" :loading="loading" :items="counties" :search-input.sync="search" cache-items class="mx-2" flat hide-no-data hide-details label="Which county are you from?   " solo></v-autocomplete>
                    <v-text-field v-model="form.bureau_name" placeholder="Bureau Name" />
                    <v-text-field v-model="form.name" placeholder="Owner Name" />
                    <v-text-field v-model="form.phone_no" placeholder="Phone" />
                    <v-text-field v-model="form.email" placeholder="Email" />
                    <v-text-field v-model="form.city" placeholder="City" />
                    <v-text-field v-model="form.box_no" placeholder="Box No" />
                    <v-text-field v-model="form.building" placeholder="Building" />
                    <v-text-field v-model="form.postal_code" placeholder="Postal Code" />
                    <v-text-field v-model="form.id_no" placeholder="ID Number" />
                   
                    <v-btn @click="loginAnonymously1">Register Bureau</v-btn>
                </form>
            </div>
        </v-col>
        <v-col cols="12" md="6" sm="6" class="">
            <v-img :src="bu" contain height="400" style="margin: 120px;"></v-img>

        </v-col>

    </v-row>
</div>
</template>

<script>
import axios from "axios";
import bu from "@/assets/bu1.png";
import emp from "@/assets/emp.png";
import can from "@/assets/can.png";

export default {
    data() {
        return {
            bu,
            loading: false,
            items: [],
            search: null,
            counties: [],
            form: {
                bureau_name: "",
                name: "",
                phone_no: "",
                city: "",
                email: "",
                id_no: "",
                box_no: "",
                building: "",
                street_name: "",
                county: "",
                postal_code: "",
                bureau_image: "https://avatar.iran.liara.run/public/28",
                device_token: "wqieywuq0e8-wewqee21342134"
            },
            uid: "",
        };
    },

    async mounted() {
        this.checkUser();
        let response = await axios.get("http://localhost:7000/api/counties/get-counties");
        this.counties = response.data.map(r => r.name);
    },

    methods: {
        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                this.uid = this.$fire.auth.currentUser.uid;
            } else {
                this.auth_state = false;
            }
        },
        loginAnonymously1() {
            this.$fire.auth
                .signInAnonymously()
                .catch(function (error) {
                    this.snackbarText = error.message;
                    this.snackbar = true;
                    this.showLogin = false;
                })
                .then((user) => {
                    //we are signed in
                    const start_time = this.$dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss");
                    this.uid = user.user.uid;
                    this.registerBureau()
                });
        },
        async registerBureau() {

            await axios.post("http://localhost:7000/api/bureaus/register", {
                user_id: this.uid,
                bureau_name: this.form.bureau_name,
                name: this.form.name,
                phone_no: this.form.phone_no,
                city: this.form.city,
                box_no: this.form.box_no,
                building: this.form.building,
                postal_code: this.form.postal_code,
                id_no: this.form.id_no,
                street_name: this.form.street_name,
                county: this.form.county,
                email: this.form.email,
                bureau_image: "https://avatar.iran.liara.run/public/19"
            });

            this.$router.push("/bureau/dashboard");
        }
    }
};
</script>
