<template>
<form @submit.prevent="register">
    <v-text-field v-model="form.name" placeholder="Name" />
    <v-text-field v-model="form.phone_no" placeholder="Phone" />
    <v-text-field v-model="form.email" placeholder="Email" />
    <v-text-field v-model="form.street_name" placeholder="Street Name" />
    <v-text-field v-model="form.city" placeholder="City" />
    <v-text-field v-model="form.county" placeholder="County" />
    <v-btn @click="loginAnonymously1">Register Employer</v-btn>
</form>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            form: {
                name: "",
                phone_no: "",
                city: "",
                email: "elmasha@gmail.com",
                county: "",
                user_id: "",
                street_name: "",
            },
            auth_state: false,
            uid: "",
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
                    this.form.user_id = user.user.uid;
                    this.register()
                    this.show_auth = true;
                });
        },
        async register() {
            

            await axios.post("http://localhost:7000/api/employers/register", {
                uid: this.form.user_id,
                name: this.form.name,
                phone_no: this.form.phone_no,
                city: this.form.city,
                county: this.form.county,
                email: this.form.email,
                street_name: this.form.street_name,
                user_image: "https://avatar.iran.liara.run/public/19"
            });

            this.$router.push("/employer");
        }
    }

};
</script>
