<template>
<v-app style="background-color: #1A1B2B;">
    <div class="container">
        <div class="container" style="margin-top: 0px; color: aliceblue; font-weight: 1200;">
            <h2>Find Candidates</h2>
            <p>Here is some information to help you narrow down your preference.</p>
        </div>
        <!-- FILTER FORM -->
        <v-card color="white" style="border-radius: 12px;">
            <div class="">

                <v-row>
                    <v-col cols="12">
                        <v-row class="container">

                            <v-col cols="12" md="12" class="">
                                <div style="padding: 0px;" class="">
                                    <v-autocomplete v-model="filters.county" clearable filled rounded dense :loading="loading" @change="fetchCandidates" :items="counties" :search-input.sync="search" cache-items class="mx-2" flat hide-no-data hide-details placeholder="Search county...   "></v-autocomplete>

                                        <v-btn large elevation="0"  @click="show = !show" style="border-radius: 12px;background-color: aliceblue; margin-left: 12px; padding-bottom: 0px; margin-top: 10px;">
                                            <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-tune' }}</v-icon>
                                            <p style="margin-top: 15px; font-size: 0.9rem; font-weight: 900;margin-right: 10px;">Filters</p>
                                        </v-btn>
                                </div>

                                <v-expand-transition>
                                    <v-row v-show="show" style="border-radius: 12px;background-color: floralwhite; margin-top: 10px; padding: 10px;">
                                        <v-col v-show="true" cols="12" md="6" class="">

                                            <!-- <v-text-field v-model="filters.ward" filled rounded dense placeholder="Ward" clearable /> -->
                                            <div>
                                                <v-select style="width: 100%;" v-model="filters.gender" filled rounded dense :items="items_gender" label="Gender" required clearable />

                                            </div>
                                        </v-col>

                                        <v-col cols="12" md="6" class="">
                                            <div>
                                                <b class="d-flex">
                                                    <p>{{ numeral(filters.min_age||18).format('0,0') +" - "+ numeral(filters.max_age||40).format('0,0') }}</p>
                                                </b>
                                            </div>
                                            <div>
                                                <v-slider v-model="filters.min_age" min="18" step="1" max="40" label="Min Age" thumb-label></v-slider>
                                            </div>
                                            <div>
                                                <v-slider v-model="filters.max_age" min="18" step="1" max="40" label="Max Age" thumb-label></v-slider>
                                            </div>

                                        </v-col>

                                        <v-col cols="12" md="6" class="">
                                            <div class="d-flex">
                                                <v-text-field type="number" filled rounded dense v-model="filters.max_salary" placeholder="Max Salary" clearable />

                                                <v-text-field type="number" filled rounded dense v-model="filters.min_salary" placeholder="Min Salary" clearable />
                                                <!-- <v-slider v-model="filters.min_salary" min="0" step="1000" max="50000" label="Min Salary" thumb-label></v-slider> -->

                                            </div>

                                        </v-col>

                                        <div>
                                            <v-card-actions>
                                                <!-- <v-spacer></v-spacer> -->

                                                <v-btn rounded color="black" style="color: aqua;" @click="fetchCandidates">
                                                    <v-icon>mdi-filter-outline</v-icon> Apply filter
                                                </v-btn>
                                                <v-btn text @click="resetFilters">Reset</v-btn>
                                                <v-spacer></v-spacer>

                                            </v-card-actions>
                                        </div>
                                    </v-row>

                                </v-expand-transition>

                            </v-col>

                            <v-col cols="12" md="9" class="">

                            </v-col>

                        </v-row>
                    </v-col>

                </v-row>

            </div>

            <div class="" style="border-radius: 12px;background-color: aliceblue; margin: 10px; padding: 10px;">
                <!-- RESULTS -->
                <div style="margin-top: 0px; color: black; font-weight: 1200;" v-if="loading">Loading...</div>

                <div style="margin-top: 0px; color: black; font-weight: 1200;" v-if="candidates.length === 0 && !loading">
                    No candidates found
                </div>
                <div class="" v-if="candidates.length > 0 && !loading">
                    <p>Select a candidate</p>
                </div>
                <div class="grid">
                    <div v-for="candidate in candidates" :key="candidate.id">

                        <v-card style="border-radius: 12px;">
                            <div class="container">
                                <div class="d-flex">
                                    <v-avatar size="40" color="black">
                                        <img :src="user" width="60" contain height="60" />
                                    </v-avatar>

                                    <v-spacer />
                                    <v-chip outlined>{{ candidate.working_status }}</v-chip>
                                </div>
                                <div style="padding: 6px;">

                                    <h3>{{ candidate.candidate_name }}</h3>
                                    <div class="d-flex">
                                        <!-- <v-icon >mdi-gender-male-female</v-icon> -->
                                        <p>{{ candidate.gender +" . " }} {{ candidate.age }} Yrs </p>
                                    </div>
                                    <v-chip>{{ candidate.county }}</v-chip>
                                </div>

                            </div>
                            <v-card-actions style="border-radius: 12px;background-color: aliceblue; margin: 9px; padding: 12px;">
                                <!-- <p>Status <br> <b style="color:green">{{ candidate.working_status }}</b></p> -->
                                <h4 style="font-size: 1rem; color:#1A1B2B;">Ksh{{ numeral(candidate.salary).format('0,0')  }} <br>
                                    <p style="font-size: 0.9rem;color: #1A1B2B;">{{ candidate.salary_period }}</p>
                                </h4>
                                <v-spacer></v-spacer>
                                <v-btn @click="CheckGoalProgress(candidate.candidate_id)" rounded small color="black" style="color: white;">
                                    View Profile
                                    <v-icon right>mdi-account-arrow-right-outline</v-icon>
                                </v-btn>
                            </v-card-actions>
                        </v-card>

                    </div>
                </div>
            </div>

        </v-card>

    </div>

    <v-dialog v-model="dialog" width="500">

        <v-card>
            <v-card-title class="headline">Selection payment</v-card-title>
            <v-card-text>
                <label for="phoneNumber">Provide you mpesa number</label>
                <v-text-field v-model="phoneNumber" :prefix="phonePrefix" placeholder="(7.. format)" dense></v-text-field>
                <label for="voteCount">You will pay a selection fee of 150 ksh </label>
                <span></span>
                <br>
                <br>
                <div class="d-flex">
                    <p style="font-size: 0.9rem;">Total amount to be paid. <h4>{{ numeral(150).format("0,0") }} ksh</h4>
                    </p>
                </div>

                <div class="d-flex" style="padding: 0.8rem;border-radius: 1rem;background-color: antiquewhite;color: black;">
                    <p style="font-size: 0.9rem;"> An STK push will prompted on the <b>{{ phonePrefix+phoneNumber }}</b> check for an mpesa prompting you to pay <b>{{ numeral(amount).format("0,0") }}</b> ksh</p>
                </div>
                <v-progress-linear v-show="progress_bar" indeterminate color="black"></v-progress-linear>
                <!-- Message -->
                <v-alert v-if="message" class="mt-4" type="success" dense outlined>
                    {{ message }}
                </v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false">Cancel</v-btn>
                <v-btn color="black" @click="processPayment" style="color: white;">Make payment</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-snackbar color="white--text" :timeout="4000" v-model="snackbar" center>
        {{ snackbarText }}
    </v-snackbar>
    <v-snackbar color="red" :timeout="4000" v-model="snackbarError" outlined bottom center>
        {{ snackbarError }}
    </v-snackbar>
    <v-snackbar color="primary accent-8" :timeout="6000" v-model="snackbar_s" centered bottom>
        {{ snackbarText_s }}
    </v-snackbar>

</v-app>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import user from "@/assets/user.png";

export default {
    data() {
        return {
            show: false,
            user,
            CheckoutRequestID: "",
            snackbar_s: false,
            snackbarText_s: "",
            dialog: false,
            snackbar: false,
            snackbarText: "No error message",
            snackbarError: false,
            showLogin: false,
            snackbarTextError: "",
            message: null,
            paymentDialog: false,
            paymentConfirmDialog: false,
            phoneNumber: "",
            phonePrefix: "254",
            numeral,
            amount: 1,
            progress_bar: false,
            items_gender: ['Female', 'Male'],
            loading: false,
            items: [],
            search: null,
            counties: [],
            filters: {
                gender: "",
                county: "",
                ward: "",
                min_age: "",
                max_age: "",
                min_salary: "",
                max_salary: "",
                working_status: ""
            },
            uid: "",
            candidates: [],
            loading: false,
            auth_state: false,
            amaount: 0,
            timerEnabled: false,
            timerCount: 25,
        };
    },
    watch: {

        timerEnabled(value) {
            if (value) {
                setTimeout(() => {
                    this.timerCount--;
                }, 1000);
            }
        },
        timerCount: {
            handler(value) {
                if (value > 0 && this.timerEnabled) {
                    setTimeout(() => {
                        this.timerCount--;
                    }, 1000);
                } else if (value == 0) {
                    this.StkQuery();
                    this.timerCount = 25;
                }
            },
            immediate: true, // This ensures the watcher is triggered upon creation
        },
    },
    methods: {

        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                this.uid = this.$fire.auth.currentUser.uid;
                console.log("UID =>", this.uid);
            } else {
                this.auth_state = false;
            }
        },
         async CheckPaymentStatus() {

            try {
                const res = await axios.get(`https://yayalinkserver-production.up.railway.app/api/employer-access/payment-status/${this.uid}`);
                console.log("Payment status",res.data);
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
        async CheckGoalProgress(val) {

            try {
                const res = await axios.get(`https://yayalinkserver-production.up.railway.app/api/employer-access/${this.uid}`);
                console.log(res.data);
                if (res.data.allowed == false) {

                    // proceed
                    // alert("Payment required to view candidate profiles.");
                    this.dialog = true;
                } else {
                    this.$router.push(`/candidate_info/${val}`);
                }
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    const reason = err.response.data.reason;

                    if (reason === "PAYMENT_REQUIRED") {
                        //this.$router.push("/payment");

                        alert("Payment required to view candidate profiles.");
                    }

                    if (reason === "GRACE_PERIOD_EXPIRED") {
                        alert("Your grace period has expired. Please contact support.");
                        console.log(reason);
                    }
                } else {
                    console.error("Unexpected error", err);
                }
            }
        },
        async fetchCandidates() {

            this.loading = true;
            try {
                const res = await axios.get("https://yayalinkserver-production.up.railway.app/api/candidates/filter", {
                    params: this.filters
                });
                this.candidates = res.data;
                console.log(res.data);
            } catch (err) {
                console.error(err);
                // alert("Failed to load candidates");
            } finally {
                this.loading = false;
            }

        },

        async submitCandidate() {
            try {
                await axios.post("https://yayalinkserver-production.up.railway.app/api/candidates/register", this.form);
                alert("Candidate added successfully");
                this.$router.push("/candidates");
            } catch (err) {
                alert(err.response);
            }
        },

        resetFilters() {
            this.filters = {
                gender: "",
                county: "",
                ward: "",
                min_age: "",
                max_age: "",
                min_salary: "",
                max_salary: "",
                working_status: ""
            };
            this.fetchCandidates();
        },
        StkQuery() {
            let that = this;
            that.snackbar_s = true;
            that.snackbarText_s = "Checking payment status...";
            that.step = 5;
            axios
                .post("https://yayalinkserver-production.up.railway.app/api/payments/stk/query", {
                    checkoutRequestId: that.CheckoutRequestID,
                })
                .then(function (response) {
                    console.log("StkPush Query", response.data);
                    if (response.status == 200) {
                        this.$router.push(`/candidate_info/${val}`);
                        that.progress_bar = false;
                        that.snackbar = true;
                        that.snackbarText = response.data.ResultDesc;
                        if (response.data.ResultCode == "0") {
                            that.dialog = true;
                        }
                        that.timerCount = 25;
                        that.timerEnabled = false;

                    }
                })
                .catch(function (error) {
                    that.snackbarError = true;
                    that.snackbarTextError = error;
                    that.timerCount = 25;
                    that.timerEnabled = false;
                    that.show6 = false;
                    that.progress_bar = false;
                });
        },
        async processPayment() {
            let that = this;
            if (that.phoneNumber == null) {
                that.snackbarTextError = "Provide phone..";
                that.snackbarError = true;
            } else {
                let phone = that.phonePrefix + that.phoneNumber;
                if (phone.length != 12) {
                    that.snackbarTextError = "Phone number should be 12 digits including country code";
                    that.snackbarError = true;
                    return;
                }
                axios
                    .post("https://yayalinkserver-production.up.railway.app/api/payments/stk", {
                        phone: phone,
                        amount: that.amount,
                        user_id: that.uid,
                        User_name: "Employer Test",
                    })
                    .then(function (response) {
                        console.log(response);
                        if (response.status == 200) {
                            that.CheckoutRequestID = response.data.CheckoutRequestID;
                            that.snackbar = true;
                            that.message = "Payment initiated. Enter Mpesa PIN to confirm.";
                            that.progress_bar = true;
                            that.snackbarText = response.data;
                            that.timerEnabled = true;
                        } else if (response.status == 400) {
                            that.snackbarError = true;
                            that.snackbarTextError = response.data;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        that.snackbarTextError = error;
                        that.snackbarError = true;
                        that.progress_bar = false;
                    });
            }
            Error;
        },

        viewProfile(id) {

        }
    },

    async mounted() {
        this.checkUser();
        this.resetFilters();
        this.fetchCandidates();
        this.CheckPaymentStatus();
        let response = await axios.get("https://yayalinkserver-production.up.railway.app/api/counties/get-counties");
        this.counties = response.data;
        console.log(this.counties);

    }
};
</script>

<style scoped>
.container {
    padding: 20px;
}

.filters {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
}

.filters v-text-field,
.filters select,
.filters v-btn {
    padding: 10px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
}

.card {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 6px;
}

.card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}
</style>
