<!-- Please remove this file from your project -->
<template>
<v-app>
    <div style="background: linear-gradient(to left, #05F3DF,#1A1B2B); ">

        <v-card rounded elevation="10"  style=" margin:40px;">
         <div class="text-center">
             <v-card-subtitle class="text-h6 grey--text text--darken-1">Bureau Profile</v-card-subtitle>
            <div class="container">
                <div class="d-flex flex-column align-center">
                    <v-space></v-space>
                    <div>
                        <v-avatar color="primary" size="56" style="color: aliceblue;">{{ int_value }}</v-avatar>
                    </div>
                    <v-space></v-space>
                    <div>
                        <h3>{{ bureau.bureau_name }}</h3>
                        <p>{{ bureau.email }}</p>
                    </div>
                    <v-space></v-space>
                </div>

                <p>{{ bureau.county }}</p>
                <v-chip>{{ bureau.phone_no  }}</v-chip>
            </div>
            <v-divider></v-divider>

            <div class="container">
                <h4> {{ bureau.bureau_name }} candidate Details</h4>
                <br>
                <div class="d-flex text-center justify-space-around">
                    <div>
                      <p>  <b>{{ candidate_count }}</b> <br> Candidate count</p>
                    </div>
                    <div>
                      <p> <b>{{ 0 }}</b> <br> Available candidates</p>
                    </div>
                    <div>
                      <p> <b>{{ 0 }}</b> <br> UnAvailable candidates</p>
                    </div>
                </div>

                <v-card-actions>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </div>
            <v-divider></v-divider>

            <v-card-actions class="container">
                <v-spacer></v-spacer>

                <v-btn  style="color: aqua;" rounded color="black">
                    <v-icon right>mdi-account-multiple-plus-outline</v-icon>
                    Add candidate

                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
         </div>

             <!-- RESULTS -->
        


        </v-card>
        <v-card style=" margin:40px;" rounded elevation="10" >
            <v-card-subtitle class="text-h6 grey--text text--darken-1">Candidates from {{ bureau.bureau_name }}</v-card-subtitle>
            <div v-if="loading">Loading...</div>

        <div v-if="candidates.length === 0 && !loading">
            No candidates found
        </div>

        <div  class="row">
            <div v-for="candidate in candidates" :key="candidate.id" class="col-md-3" >

                <v-card rounded elevation="10" class="ma-3 pa-3">
                    <div class="container">
                        <div class="d-flex">
                            <img :src="user" width="60" contain height="60" />
                            <div>
                                <h3>{{ candidate.candidate_name }}</h3>
                                <p>{{ candidate.gender }}</p>
                            </div>
                        </div>

                        <p>{{ candidate.age }} Yrs</p>
                        <p>{{ candidate.county }}</p>
                        <v-chip>{{ numeral(candidate.salary).format('0,0')  }} per {{ candidate.salary_period }}</v-chip>
                    </div>
                    <v-card-actions>
                        <p>Status <br> <b style="color:green">{{ candidate.working_status }}</b></p>
                        <v-spacer></v-spacer>
                        <v-btn @click="CheckGoalProgress(candidate.candidate_id)" rounded small color="primary">
                            View Profile
                            <v-icon right>mdi-account-arrow-right-outline</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>

            </div>
        </div>
        </v-card>
         

    </div>

</v-app>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import user from "@/assets/user.png";
export default {
    mounted() {

        if (this.$fire.auth.currentUser != null) {
            this.uid = this.$fire.auth.currentUser.uid;
            console.log("UID =>", this.uid);
        } else {
            this.auth_state = false;
        }
        this.fetchBureau();
        this.fetchCandidates();

    },
    data() {
        return {
          candidate_count:0,
            uid: null,
            auth_state: true,
            user,
            numeral,
            bureau: [],
            candidates: [],
            loading: false,
            int_value:"",
        }
    },
    methods: {
        async fetchBureau() {

            this.loading = true;
            try {
                const res = await axios.get(`http://localhost:7000/api/bureaus/get-bureau/${this.uid}`, {});
                this.bureau = res.data;
                this.int_value=this.bureau.bureau_name.substring(0,3).toUpperCase();
                console.log(this.int_value );
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }

        },
        async fetchCandidates() {
            this.loading = true;
            try {
                const res = await axios.get(`http://localhost:7000/api/candidates/bureau-candidate/${this.uid}`, {
                    params: this.filters
                });
                this.candidates = res.data;
                this.candidate_count = res.data.length;
                console.log(res.data);
            } catch (err) {
                console.error(err);
                // alert("Failed to load candidates");
            } finally {
                this.loading = false;
            }

        },
    }

}
</script>
