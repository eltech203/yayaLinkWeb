<!-- Please remove this file from your project -->
<template >
<v-app>
    <div style="background: linear-gradient(to left, #05F3DF,#1A1B2B); ">

        <v-card rounded elevation="10" class="text-center" style=" margin:40px;">
            <v-card-subtitle class="text-h6 grey--text text--darken-1">Candidate Information</v-card-subtitle>
            <div class="container">
                <div class="d-flex flex-column align-center">
                    <v-space></v-space>
                    <div>
                        <img :src="user" contain height="100" />
                    </div>
                    <v-space></v-space>
                    <div>
                        <h3>{{ candidate.candidate_name }}</h3>
                        <p>{{ candidate.gender }}</p>
                    </div>
                    <v-space></v-space>
                </div>

                <p>{{ candidate.age }} Yrs</p>
                <p>{{ candidate.county }}</p>
                <v-chip>{{ numeral(candidate.salary).format('0,0')  }} per {{ candidate.salary_period }}</v-chip>
                <p>Status <b style="color:green">{{ candidate.working_status }}</b></p>
            </div>
            <v-divider></v-divider>

            <div class="container" style="background: linear-gradient(to left, #05F3DF,#1A1B2B); color:white; ">
                <h4> Bureuau Details</h4>
                <p>Bureau Name: <b>{{ candidate.bureau_name }}</b></p>
                <p>Contact Person: <b>{{ candidate.bureau_no }}</b></p>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="CheckGoalProgress(candidate.candidate_id)" rounded small color="primary">
                        Call Agent/Bureau
                        <v-icon right>mdi-phone</v-icon>
                    </v-btn>

                    <v-spacer></v-spacer>
                </v-card-actions>
            </div>
            <v-divider></v-divider>
            <div class="container">

                <v-alert border="top" colored-border type="info" elevation="2" color="accent">
                    <p>1. Click on Call 'agent/bureau' to discuss the candidate and interview him/her directly</p>
                    <p>
                        2. Once agreed click on 'confirm deal'. Otherwise if not agreed, click on 'Change preference'.</p>
                    <p>After 3 days, you will need to make another payment to access more candidates.</p>
                    <p>
                        NB: Clicking on 'Confirm Deal' is what will remove your choice from the list of available candidates, so that other people do not select him/her.
                        Your payment shall remain valid for 3 days.
                    </p>
                </v-alert>

            </div>
            <v-card-actions class="container">
                <v-spacer></v-spacer>
                <v-btn style="color: red;" to="/employer" outlined rounded color="red">
                    <v-icon right>mdi-arrow-left</v-icon>
                    Back to Listings

                </v-btn>

                <v-btn @click="CheckGoalProgress(candidate.candidate_id)" style="color: aqua;" rounded color="black">
                    <v-icon right>mdi-account-multiple-plus-outline</v-icon>
                    {{" "}}Confirm Deal

                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
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
        this.fetchCandidates();
    },
    data() {
        return {
            user,
            numeral,
            candidate: [],
            loading: false,
        }
    },
    methods: {
        async fetchCandidates() {

            this.loading = true;
            try {
                const res = await axios.get(`http://localhost:7000/api/candidates/get-candidate/${this.$route.params.id}`, {});
                this.candidate = res.data;
                console.log(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }

        },
    }

}
</script>
