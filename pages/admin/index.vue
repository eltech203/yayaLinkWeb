<template>
<div class="admin-page">
    <!-- TOP BAR -->
    <div class="top-bar">
        <div>
            <h1 class="page-title">YayaLink Admin</h1>
            <p class="page-subtitle">
                Monitor users, candidates, revenue and platform activity
            </p>
        </div>

        <v-btn rounded color="cyan accent-2" dark @click="fetchDashboard">
            Refresh
            <v-icon right small>mdi-refresh</v-icon>
        </v-btn>
    </div>

    <!-- STATS -->
    <v-row class="mt-2">
        <v-col cols="6" sm="6" md="4">
            <div class="stats-card">
                <div class="stats-icon cyan-card">
                    <v-icon color="black">mdi-account-group</v-icon>
                </div>

                <div class="stats-info">
                    <h2>{{ dashboard.total_candidates }}</h2>
                    <p>Total Candidates</p>
                </div>
            </div>
        </v-col>

        <v-col cols="6" sm="6" md="4">
            <div class="stats-card">
                <div class="stats-icon green-card">
                    <v-icon color="black">mdi-check-circle</v-icon>
                </div>

                <div class="stats-info">
                    <h2>{{ dashboard.available_candidates }}</h2>
                    <p>Available</p>
                </div>
            </div>
        </v-col>

        <v-col cols="6" sm="6" md="4">
            <div class="stats-card">
                <div class="stats-icon orange-card">
                    <v-icon color="black">mdi-account-tie</v-icon>
                </div>

                <div class="stats-info">
                    <h2>{{ dashboard.total_employers }}</h2>
                    <p>Employers</p>
                </div>
            </div>
        </v-col>

          <v-col cols="6" sm="6" md="4">
            <div class="stats-card">
                <div class="stats-icon pink-card">
                    <v-icon color="white">mdi-account-details</v-icon>
                </div>

                <div class="stats-info">
                    <h2>{{ dashboard.total_bureaus }}</h2>
                    <p>Bureaus</p>
                </div>
            </div>
        </v-col>

        <v-col cols="6" sm="6" md="4">
            <div class="stats-card">
                <div class="stats-icon pink-card">
                    <v-icon color="black">mdi-cash</v-icon>
                </div>

                <div class="stats-info">
                    <h2>KES {{ formatMoney(dashboard.total_revenue) }}</h2>
                    <p>Total Revenue</p>
                </div>
            </div>
        </v-col>
         <v-col cols="6" sm="6" md="4">
            <div class="stats-card">
                <div class="stats-icon pink-card">
                    <v-icon color="black">mdi-cash</v-icon>
                </div>

                <div class="stats-info">
                    <h2>KES {{ formatMoney(dashboard.monthly_revenue) }}</h2>
                    <p>Monthly Revenue</p>
                </div>
            </div>
        </v-col>
    </v-row>

    <!-- SEARCH -->
    <div class="search-wrap">
        <v-text-field v-model="search" outlined dark hide-details prepend-inner-icon="mdi-magnify" label="Search candidates..." @keyup.enter="searchCandidates"></v-text-field>

        <v-btn color="cyan accent-2" dark rounded class="ml-3" @click="searchCandidates">
            Search
        </v-btn>
    </div>

    <!-- TABS -->
    <v-tabs v-model="tab" background-color="transparent" color="cyan accent-2" dark class="mt-6">
        <v-tab>Candidates</v-tab>
        <v-tab>Employers</v-tab>
        <v-tab>Bureaus</v-tab>
        <v-tab>Payments</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="transparent-tabs">

        <!-- CANDIDATES -->
        <v-tab-item>
            <div class="table-card">

                <div class="table-title">
                    Candidates
                </div>

                <v-data-table :headers="candidateHeaders" :items="candidates" dark class="elevation-0">

                    <template v-slot:item.status="{ item }">
                        <v-chip small :color="item.status === 'Available' ? 'green' : 'orange'">
                            {{ item.status }}
                        </v-chip>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-btn icon color="red" @click="deleteCandidate(item.candidate_id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>

                </v-data-table>
            </div>
        </v-tab-item>

        <!-- EMPLOYERS -->
        <v-tab-item>
            <div class="table-card">

                <div class="table-title">
                    Employers
                </div>

                <v-data-table :headers="employerHeaders" :items="employers" dark class="elevation-0">

                    <template v-slot:item.actions="{ item }">
                        <v-btn icon color="red" @click="deleteEmployer(item.uid)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>

                </v-data-table>
            </div>
        </v-tab-item>

        <!-- BUREAUS -->
        <v-tab-item>
            <div class="table-card">

                <div class="table-title">
                    Bureaus
                </div>

                <v-data-table :headers="bureauHeaders" :items="bureaus" dark class="elevation-0">

                    <template v-slot:item.actions="{ item }">
                        <v-btn icon color="red" @click="deleteBureau(item.user_id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>

                </v-data-table>
            </div>
        </v-tab-item>

        <!-- PAYMENTS -->
        <v-tab-item>
            <div class="table-card">

                <div class="table-title">
                    Payments
                </div>

                <v-data-table :headers="paymentHeaders" :items="payments" dark class="elevation-0"></v-data-table>

            </div>
        </v-tab-item>

    </v-tabs-items>

</div>
</template>

<script>
const API_BASE = "https://yayalinkserver-production-edaa.up.railway.app";
import axios from "axios";
import numeral from "numeral";
export default {
    name: "AdminDashboard",

    data() {
        return {
            tab: 0,
            search: "",
            dashboard: {
                total_candidates: 0,
                available_candidates: 0,
                total_employers: 0,
                total_revenue: 0,
            },

            candidates: [],
            employers: [],
            bureaus: [],
            payments: [],

            candidateHeaders: [{
                    text: "Name",
                    value: "candidate_name"
                },
                {
                    text: "Phone",
                    value: "mobile_no"
                },
                {
                    text: "County",
                    value: "county"
                },
                {
                    text: "Ward",
                    value: "ward"
                },
                {
                    text: "Bureau",
                    value: "bureau_name"
                },
                {
                    text: "Bureau No",
                    value: "bureau_no"
                },
                {
                    text: "Status",
                    value: "status"
                },
                {
                    text: "Actions",
                    value: "actions",
                    sortable: false
                },
            ],

            employerHeaders: [{
                    text: "Name",
                    value: "name"
                },
                {
                    text: "Phone",
                    value: "phone_no"
                },
                {
                    text: "County",
                    value: "county"
                },
                {
                    text: "Actions",
                    value: "actions",
                    sortable: false
                },
            ],

            bureauHeaders: [{
                    text: "Bureau",
                    value: "bureau_name"
                },
                {
                    text: "Phone",
                    value: "phone_no"
                },
                {
                    text: "County",
                    value: "county"
                },
                {
                    text: "Actions",
                    value: "actions",
                    sortable: false
                },
            ],

            paymentHeaders: [{
                    text: "Receipt",
                    value: "mpesa_receipt"
                },
                {
                    text: "Amount",
                    value: "amount"
                },
                {
                    text: "Phone",
                    value: "phone_no"
                },
                {
                    text: "Date",
                    value: "created_at"
                },
            ],
        };
    },

    mounted() {
        this.fetchDashboard();
        this.fetchCandidates();
        this.fetchEmployers();
        this.fetchBureaus();
        this.fetchPayments();
    },

    methods: {

        formatMoney(value) {
            if (!value) return "0";

            return Number(value).toLocaleString();
        },

        async fetchDashboard() {
            try {
                const res = await axios.get(
                    `${API_BASE}/api/admin/dashboard`
                );

                this.dashboard = res.data;
                console.log(this.dashboard);

            } catch (error) {
                console.log(error);
            }
        },

        async fetchCandidates() {
            try {
                const res = await axios.get(
                    `${API_BASE}/api/admin/candidates`
                );

                this.candidates = res.data;

            } catch (error) {
                console.log(error);
            }
        },

        async fetchEmployers() {
            try {
                const res = await axios.get(
                    `${API_BASE}/api/admin/employers`
                );

                this.employers = res.data;

            } catch (error) {
                console.log(error);
            }
        },

        async fetchBureaus() {
            try {
                const res = await axios.get(
                    `${API_BASE}/api/admin/bureaus`
                );

                this.bureaus = res.data;

            } catch (error) {
                console.log(error);
            }
        },

        async fetchPayments() {
            try {
                const res = await axios.get(
                    `${API_BASE}/api/admin/payments`
                );

                this.payments = res.data;

            } catch (error) {
                console.log(error);
            }
        },

        async searchCandidates() {
            try {
                const res = await axios.get(
                    `${API_BASE}/api/admin/search/candidates?keyword=${this.search}`
                );

                this.candidates = res.data;

            } catch (error) {
                console.log(error);
            }
        },

        async deleteCandidate(id) {
            try {

                await axios.delete(
                    `${API_BASE}/api/admin/candidate/${id}`
                );

                this.fetchCandidates();

            } catch (error) {
                console.log(error);
            }
        },

        async deleteEmployer(uid) {
            try {

                await axios.delete(
                    `${API_BASE}/api/admin/employer/${uid}`
                );

                this.fetchEmployers();

            } catch (error) {
                console.log(error);
            }
        },

        async deleteBureau(uid) {
            try {

                await axios.delete(
                    `${API_BASE}/api/admin/bureau/${uid}`
                );

                this.fetchBureaus();

            } catch (error) {
                console.log(error);
            }
        },

    },
};
</script>

<style scoped>
.admin-page {
    min-height: 100vh;
    background: #0F1020;
    padding: 24px;
    color: white;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.page-title {
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 5px;
}

.page-subtitle {
    color: rgba(255, 255, 255, 0.7);
}

.stats-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 20px;
    display: flex;
    align-items: center;
}

.stats-icon {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
}

.cyan-card {
    background: #00FFFF;
}

.green-card {
    background: #3EEA84;
}

.orange-card {
    background: #FFC107;
}

.pink-card {
    background: #FF6B9D;
}

.stats-info h2 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 900;
}

.stats-info p {
    margin: 4px 0 0;
    color: rgba(255, 255, 255, 0.7);
}

.search-wrap {
    margin-top: 30px;
    display: flex;
    align-items: center;
}

.table-card {
    margin-top: 24px;
    padding: 20px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.table-title {
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 16px;
}

.transparent-tabs {
    background: transparent !important;
}

::v-deep .v-data-table {
    background: transparent !important;
}

::v-deep .v-data-table-header {
    background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {

    .top-bar {
        gap: 20px;
    }

    .search-wrap {
        flex-direction: column;
        align-items: stretch;
    }

    .search-wrap .v-btn {
        margin-left: 0 !important;
        margin-top: 12px;
    }

}
</style>
