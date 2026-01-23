<!-- Please remove this file from your project -->
<template>
<v-app style="background-color: #1A1B2B;">
    <!-- <v-app-bar height="90" elevation="0" color="black" dark :clipped-left="clipped" fixed app rounded>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-spacer />

        <v-toolbar-title>
            <span style="color: white; font-weight: bold; font-size: 20px;margin-left: 10px;"></span>
        </v-toolbar-title>

        <v-btn v-show="" color="white" icon @click="logout()">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar> -->

    <v-card rounded elevation="10" dark style=" margin:0px;" color="black">
        <div class="text-start">
            <div class="container">
                <div class="d-flex flex-column">
                    <div class="d-flex" style=" margin:10px;">
                        <v-avatar color="primary" size="46" style="color: aliceblue;">{{ int_value }}</v-avatar>

                        <h3 style="margin-left: 10px;margin-top: 6px;">{{ employer.name +" "}}</h3>

                        <v-spacer />
                        <div>
                            <p v-if="payemtStatus.paid == true" style="font-size: 0.8rem;">Selection is Active <br>{{ payemtStatus.days_remaining  +" days remaining"}}</p>
                            <p v-if="payemtStatus.paid == false" style="font-size: 0.8rem;">Selection is InActive <br>{{ payemtStatus.days_remaining  +" days remaining"}}</p>
                        </div>
                    </div>
                    <div class="container">
                        <p>{{ employer.county }} <br>{{ employer.email }} <br> {{ employer.phone_no }}</p>

                    </div>

                </div>
                <!-- <p>{{ employer.county }}</p> -->
            </div>

            <div class="container">
                <div class="d-flex">
                    <v-spacer />
                    <div>

                        <v-btn icon style="color: aqua;" color="aqua" @click="list = true,grid = false">
                            <v-icon>mdi-format-list-bulleted</v-icon>
                        </v-btn>
                        <v-btn icon style="color: aqua;" color="aqua" @click="grid = true, list= false">
                            <v-icon>mdi-grid</v-icon>
                        </v-btn>
                    </div>
                </div>

            </div>

        </div>

        <!-- RESULTS -->
        <div style="border-radius: 12px;background-color: aliceblue; margin: 20px; padding: 10px;" v-show="grid">
            <div style="margin-top: 0px; color: black; font-weight: 1200;" v-if="loading">Loading...</div>

            <div style="margin-top: 0px; color: black; font-weight: 1200;" v-if="candidates.length === 0 && !loading">
                No candidates found
            </div>
            <div style="color: black;" class="" v-if="candidates.length > 0 && !loading">
                <h2 style="font-size: 1.3rem;margin-left: 10px;"> {{ employer.employer_name }} Selected candidate's</h2>
            </div>

            <div class="row">
                <div v-for="candidate in candidates" :key="candidate.id" class="col-md-3">

                    <v-card elevation="2" color="white" light class="ma-3 pa-3" style="border-radius: 12px;">
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
                            <p>Status <br> <b style="color:red">{{ candidate.status }}</b></p>
                            <v-spacer></v-spacer>
                            <v-btn @click=" dialogView = true,can_details = candidate" rounded small color="black" style="color:aliceblue">
                                Discharge
                                <v-icon right>mdi-account-arrow-right-outline</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>

                </div>
            </div>
        </div>

        <div style="border-radius: 12px;background-color: aliceblue; margin: 20px; padding: 10px;" v-show="list">
            <div>
                <div class="container">
                    <v-data-table :headers="headers" :items="candidates" light color="white" item-key="name" class="elevation-1" :search="search" :custom-filter="filterOnlyCapsText">
                        <template v-slot:top>
                            <v-text-field v-model="search" label="Search (UPPER CASE ONLY)" class="mx-4"></v-text-field>
                        </template>
                        <template v-slot:body.append>
                            <tr>
                                <td></td>
                                <td>
                                    <v-text-field v-model="calories" type="number" label="Less than"></v-text-field>
                                </td>
                                <td colspan="4"></td>
                            </tr>
                        </template>

                        <!-- <template v-slot:item.canidate_name="{ headers }">
                            <v-avatar color="primary" size="36" style="color: aliceblue;">{{ item.canidate_name.substring(0,2) }}</v-avatar>
                        </template> -->
                    </v-data-table>
                </div>
            </div>
        </div>

    </v-card>

    <v-dialog v-model="dialogView" color="black" max-width="400">
        <v-card>
            <div class="d-flex">
                <v-spacer>

                </v-spacer>

                <v-btn icon color="red" @click="dialogView = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-spacer>

                </v-spacer>
            </div>
            <div class="container">

                <v-card elevation="2" color="white" light class="ma-3 pa-3" style="border-radius: 12px;">
                    <div class="container">
                        <div class="d-flex">
                            <img :src="user" width="60" contain height="60" />
                            <div>
                                <h3>{{ can_details.candidate_name }}</h3>
                                <p>{{ can_details.gender }}</p>
                            </div>
                        </div>

                        <p>{{ can_details.age }} Yrs</p>
                        <p>{{ can_details.county }}</p>
                    </div>
                    <div>
                        <v-select v-model="discharge_msg" :items="discharge_items" placeholder="Discharge messade"></v-select>
                    </div>
                    <v-card-actions>
                        
                       <v-btn @click="Discharge(can_details.candidate_id)" rounded small color="black" style="color:aliceblue">
                                Discharge {{ can_details.candidate_name }}
                                <v-icon right>mdi-account-arrow-right-outline</v-icon>
                            </v-btn>

                    </v-card-actions>

                </v-card>

            </div>
        </v-card>

    </v-dialog>
    <v-dialog v-model="dialogAdd" color="black" max-width="700">
        <v-card>
            <div class="d-flex">
                <v-spacer>

                </v-spacer>
                <v-btn icon color="red" @click="dialogAdd = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-spacer>

                </v-spacer>
            </div>
            <div class="container">

                <candidate_reg></candidate_reg>
            </div>
        </v-card>

    </v-dialog>
</v-app>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import user from "@/assets/user.png";
import Candidate_reg from "../components/candidate_reg.vue";
import {
    lib
} from "crypto-js";
export default {
    middleware: 'auth',
    components: {
        Candidate_reg
    },
    mounted() {

        if (this.$fire.auth.currentUser != null) {
            this.uid = this.$fire.auth.currentUser.uid;
            console.log("UID =>", this.uid);
        } else {
            this.auth_state = false;
        }
        this.fetchEmployer();
        this.fetchCandidates();
        this.CheckPaymentStatus();

    },
    data() {
        return {
            discharge_msg:null,
            payemtStatus: "",
            search: '',
            grid: true,
            table: false,
            dialogAdd: false,
            dialogView: false,
            candidate_count: 0,
            uid: null,
            auth_state: true,
            user,
            numeral,
            employer: [],
            candidates: [],
            can_details: false,
            loading: false,
            int_value: "",
            discharge_items:['Services no longer needed','Breach of agreed Code of conduct','Greener Pastures','Unsatisfactory work','Pay Related'],
            headers: [{
                    text: '',
                    align: 'start',
                    value: 'candidate_image',
                }, {
                    text: 'Candidate name',
                    align: 'start',
                    value: 'candidate_name',
                },
                {
                    text: 'Gender',
                    value: 'gender'
                },
                {
                    text: 'Age',
                    value: 'age'
                },
                {
                    text: 'County',
                    value: 'county'
                },
                {
                    text: 'Salary',
                    value: 'salary'
                },
                {
                    text: 'Salary period',
                    value: 'salary_period'
                },
                {
                    text: 'Status',
                    value: 'status'
                },
                {
                    text: 'Salary',
                    value: 'salary_period'
                },
            ],
        }
    },
    methods: {
        async Discharge(val) {

            try {
                const res = await axios.post(`https://yayalinkserver-production.up.railway.app/api/employers/discharge/${val}`,{
                    employer_uid: this.uid,
                    discharge_message:this.discharge_msg,
                });
                console.log("discharge", res.data);
                if(res.data.message=== "✅ Candidate discharged successfully"){
                    this.dialogView = false;
                    this.fetchCandidates();
                }
                // this.payemtStatus = res.data;
                if (res.data.allowed == false) {

                    // proceed
                    // alert("Payment required to view candidate profiles.");
                    // this.dialog = true;
                } else {
                    // this.$router.push(`/candidate_info/${val}`);
                }
            } catch (err) {

                console.error("Unexpected error", err);

            }
        },
        async CheckPaymentStatus() {

            try {
                const res = await axios.get(`https://yayalinkserver-production.up.railway.app/api/employer-access/payment-status/${this.uid}`);
                console.log("Payment status", res.data);
                this.payemtStatus = res.data;
                if (res.data.allowed == false) {

                    // proceed
                    // alert("Payment required to view candidate profiles.");
                    // this.dialog = true;
                } else {
                    // this.$router.push(`/candidate_info/${val}`);
                }
            } catch (err) {

                console.error("Unexpected error", err);

            }
        },
        async fetchEmployer() {

            this.loading = true;
            try {
                const res = await axios.get(`https://yayalinkserver-production.up.railway.app/api/employers/get-employer/${this.uid}`, {});
                this.employer = res.data;
                this.int_value = this.employer.name.substring(0, 3).toUpperCase();
                console.log(this.employer);
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }

        },
        async fetchCandidates() {
            this.loading = true;
            try {
                const res = await axios.get(`https://yayalinkserver-production.up.railway.app/api/employers/employers-candidates/${this.uid}`, {
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
