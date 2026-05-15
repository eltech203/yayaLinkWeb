<template>
  <v-app class="yayalink-app">
    <!-- TOP NAV -->
    <v-app-bar
      app
      fixed
      dark
      height="78"
      elevation="0"
      class="top-nav"
    >
      <v-btn icon class="mr-2" @click="$router.push('/')">
        <v-icon color="cyan accent-2">mdi-home-outline</v-icon>
      </v-btn>

      <nuxt-link to="/" class="brand-link">
        <div class="brand-wrap">
          <div class="brand-icon">
             <v-img src="/logo.png" :size="20" alt="YayaLink Logo"></v-img>
          </div>

          <div>
            <div class="brand-name">YayaLink</div>
            <div class="brand-sub">Find trusted domestic help</div>
          </div>
        </div>
      </nuxt-link>

      <v-spacer />

      <v-btn icon class="notification-btn" @click="drawer = true">
        <v-badge
          v-if="notification_count > 0"
          :content="notification_count"
          color="red"
          overlap
        >
          <v-icon color="white">mdi-bell-outline</v-icon>
        </v-badge>

        <v-icon v-else color="white">mdi-bell-outline</v-icon>
      </v-btn>

      <v-btn icon color="white" @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- NOTIFICATIONS DRAWER -->
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
      right
      width="360"
      class="notification-drawer"
    >
      <div class="drawer-header">
        <div>
          <h3>Notifications</h3>
          <p>
            {{ notification_count }} update{{ notification_count === 1 ? "" : "s" }}
          </p>
        </div>

        <v-btn icon @click="drawer = false">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="drawer-body">
        <div v-if="notifications.length === 0" class="empty-notification">
          <v-icon color="cyan accent-2" large>mdi-bell-sleep-outline</v-icon>
          <p>No notifications yet.</p>
        </div>

        <div
          v-for="(n, i) in notifications"
          :key="i"
          class="notification-card"
        >
          <div class="notification-icon">
            <v-icon small color="black">mdi-bell</v-icon>
          </div>

          <div>
            <strong>{{ n.title }}</strong>
            <p>{{ n.message }}</p>
            <small>
              {{ n.created_at ? $dayjs(n.created_at).fromNow() : "Just now" }}
            </small>
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- MAIN -->
    <v-main>
      <div class="page-shell">
        <!-- PROFILE -->
        <div class="top-profile-row">
          <nuxt-link
            v-if="showProfile && employer"
            to="/employer"
            class="profile-link"
          >
            <v-avatar size="44" class="profile-avatar">
              {{ int_value }}
            </v-avatar>

            <div>
              <div class="profile-name">{{ employer.name }}</div>
              <div class="profile-sub">Employer account</div>
            </div>
          </nuxt-link>

          <div v-else class="profile-placeholder">
            <v-avatar size="44" class="profile-avatar">
              <v-icon color="black">mdi-account</v-icon>
            </v-avatar>

            <div>
              <div class="profile-name">Welcome</div>
              <div class="profile-sub">Browse verified candidates</div>
            </div>
          </div>

          <v-spacer />

          <v-btn
            rounded
            class="refresh-btn"
            :loading="loading"
            @click="fetchCandidates"
          >
            <v-icon left small>mdi-refresh</v-icon>
            Refresh
          </v-btn>
        </div>

        <!-- HERO -->
        <section class="search-hero">
          <div>
            <div class="hero-badge">
              Verified Candidates
            </div>

            <h1>Find a House Help</h1>

            <p>
              Use location, age, salary, gender, and experience filters to find a
              candidate that matches your home needs.
            </p>
          </div>
        </section>

        <!-- FILTER CARD -->
        <v-card class="filter-card" elevation="0">
          <v-row align="center">
            <v-col cols="12" md="7">
              <label class="input-label">Search by County</label>

              <v-autocomplete
                v-model="filters.county"
                :items="counties"
                clearable
                outlined
                rounded
                dense
                hide-details
                :loading="loadingCounties"
                placeholder="Search or select county..."
                prepend-inner-icon="mdi-map-marker-outline"
                class="county-search"
                @change="fetchCandidates"
              />
            </v-col>

            <v-col cols="12" md="5" class="filter-actions">
              <v-btn
                rounded
                class="filter-toggle-btn"
                @click="show = !show"
              >
                <v-icon left>
                  {{ show ? "mdi-chevron-up" : "mdi-tune" }}
                </v-icon>
                {{ show ? "Hide Filters" : "More Filters" }}
              </v-btn>

              <v-btn
                rounded
                outlined
                color="cyan accent-2"
                @click="resetFilters"
              >
                Reset
              </v-btn>
            </v-col>
          </v-row>

          <v-expand-transition>
            <div v-show="show" class="advanced-filters">
              <v-row>
                <v-col cols="12" md="4">
                  <label class="input-label dark">Gender</label>

                  <v-select
                    v-model="filters.gender"
                    :items="items_gender"
                    filled
                    rounded
                    dense
                    clearable
                    hide-details
                    placeholder="Select gender"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <label class="input-label dark">Minimum Experience</label>

                  <v-text-field
                    v-model="filters.min_experience"
                    type="number"
                    filled
                    rounded
                    dense
                    clearable
                    hide-details
                    placeholder="Example: 1"
                    suffix="yrs"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <label class="input-label dark">Maximum Experience</label>

                  <v-text-field
                    v-model="filters.max_experience"
                    type="number"
                    filled
                    rounded
                    dense
                    clearable
                    hide-details
                    placeholder="Example: 5"
                    suffix="yrs"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <div class="slider-header">
                    <label class="input-label dark">Age Range</label>
                    <strong>
                      {{ filters.min_age || 18 }} - {{ filters.max_age || 40 }} yrs
                    </strong>
                  </div>

                  <v-slider
                    v-model="filters.min_age"
                    min="18"
                    max="40"
                    step="1"
                    thumb-label
                    label="Min"
                  />

                  <v-slider
                    v-model="filters.max_age"
                    min="18"
                    max="40"
                    step="1"
                    thumb-label
                    label="Max"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <label class="input-label dark">Salary Range</label>

                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="filters.min_salary"
                        type="number"
                        filled
                        rounded
                        dense
                        clearable
                        hide-details
                        placeholder="Min Salary"
                        prefix="Ksh"
                      />
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="filters.max_salary"
                        type="number"
                        filled
                        rounded
                        dense
                        clearable
                        hide-details
                        placeholder="Max Salary"
                        prefix="Ksh"
                      />
                    </v-col>
                  </v-row>

                  <div class="apply-row">
                    <v-btn
                      rounded
                      class="apply-btn"
                      :loading="loading"
                      @click="fetchCandidates"
                    >
                      <v-icon left small>mdi-filter-outline</v-icon>
                      Apply Filters
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </v-card>

        <!-- RESULTS HEADER -->
        <div class="results-header">
          <div>
            <h2>Available Candidates</h2>
            <p v-if="!loading">
              {{ candidates.length }} candidate{{ candidates.length === 1 ? "" : "s" }} found
            </p>
            <p v-else>Loading candidates...</p>
          </div>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="loading-box">
          <v-progress-circular
            indeterminate
            color="cyan accent-2"
            size="42"
          />
          <p>Loading candidates...</p>
        </div>

        <!-- EMPTY -->
        <div
          v-if="candidates.length === 0 && !loading"
          class="empty-state"
        >
          <v-icon size="54" color="cyan accent-2">
            mdi-account-search-outline
          </v-icon>
          <h3>No candidates found</h3>
          <p>Try changing your filters or click refresh.</p>
        </div>

        <!-- CANDIDATES -->
        <div
          v-if="candidates.length > 0 && !loading"
          class="candidate-grid"
        >
          <v-card
            v-for="candidate in candidates"
            :key="candidate.id || candidate.candidate_id"
            class="candidate-card"
            elevation="0"
          >
            <div class="candidate-top">
              <v-avatar size="54" class="candidate-avatar">
                <img :src="user" alt="Candidate" />
              </v-avatar>

              <v-spacer />

              <v-chip
                small
                outlined
                :color="candidate.working_status === 'Available' ? 'green' : 'cyan accent-2'"
              >
                {{ candidate.working_status || "Available" }}
              </v-chip>
            </div>

            <div class="candidate-body">
              <div class="name-row">
                <h3>{{ candidate.candidate_name || "Unnamed Candidate" }}</h3>
                <v-icon small color="blue">mdi-check-decagram</v-icon>
              </div>

              <p class="candidate-meta">
                {{ candidate.gender || "Not specified" }}
                <span>•</span>
                {{ candidate.age || "-" }} yrs
              </p>

              <div class="candidate-tags">
                <v-chip small>
                  <v-icon left small>mdi-map-marker</v-icon>
                  {{ candidate.county || "N/A" }}
                </v-chip>

                <v-chip small>
                  <v-icon left small>mdi-briefcase-outline</v-icon>
                  {{ candidate.experience || 0 }} yrs exp.
                </v-chip>
              </div>
            </div>

            <div class="candidate-footer">
              <div>
                <div class="salary">
                  Ksh {{ numeral(candidate.salary || 0).format("0,0") }}
                </div>
                <div class="salary-period">
                  {{ candidate.salary_period || "Monthly" }}
                </div>
              </div>

              <v-btn
                rounded
                small
                class="view-btn"
                @click="CheckProgress(candidate.candidate_id)"
              >
                View Profile
                <v-icon right small>mdi-account-arrow-right-outline</v-icon>
              </v-btn>
            </div>
          </v-card>
        </div>
      </div>
    </v-main>

    <!-- PAYMENT DIALOG -->
    <v-dialog v-model="dialog" max-width="520">
      <v-card class="payment-card">
        <div class="payment-header">
          <div>
            <h2>Selection Access</h2>
            <p>Pay to unlock candidate profiles and contacts.</p>
          </div>

          <v-btn icon @click="dialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="payment-body">
          <label class="input-label dark">Choose Access Plan</label>

          <div class="plans-grid">
            <div
              class="plan-card"
              :class="{ active: plan_days === 3 }"
              @click="selectPlan(3, 150)"
            >
              <strong>3 Days</strong>
              <span>Ksh 150</span>
            </div>

            <div
              class="plan-card"
              :class="{ active: plan_days === 7 }"
              @click="selectPlan(7, 300)"
            >
              <strong>7 Days</strong>
              <span>Ksh 300</span>
            </div>

            <div
              class="plan-card"
              :class="{ active: plan_days === 30 }"
              @click="selectPlan(30, 900)"
            >
              <strong>30 Days</strong>
              <span>Ksh 900</span>
            </div>
          </div>

          <div class="mt-6">
            <label class="input-label dark">M-Pesa Phone Number</label>

            <v-text-field
              v-model="phoneNumber"
              outlined
              rounded
              dense
              :prefix="phonePrefix"
              placeholder="7XXXXXXXX"
              type="number"
              hide-details
            />
          </div>

          <div class="payment-summary">
            <div>
              <span>Total Amount</span>
              <strong>Ksh {{ numeral(amount).format("0,0") }}</strong>
            </div>

            <div>
              <span>Access Period</span>
              <strong>{{ plan_days }} days</strong>
            </div>
          </div>

          <div class="stk-info">
            <v-icon color="cyan accent-2">mdi-cellphone-check</v-icon>

            <p>
              An STK Push will be sent to
              <strong>{{ phonePrefix }}{{ phoneNumber || "7XXXXXXXX" }}</strong>.
              Enter your M-Pesa PIN to complete payment.
            </p>
          </div>

          <v-progress-linear
            v-show="progress_bar"
            indeterminate
            color="cyan accent-2"
            class="mt-4"
          />

          <v-alert
            v-if="message"
            class="mt-4"
            type="success"
            dense
            outlined
          >
            {{ message }}
          </v-alert>
        </div>

        <v-card-actions class="payment-actions">
          <v-btn
            rounded
            class="pay-btn"
            :loading="progress_bar"
            @click="processPayment"
          >
            Make Payment
          </v-btn>

          <v-spacer />

          <v-btn text color="white" @click="dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SNACKBARS -->
    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      color="black"
      bottom
      centered
    >
      {{ snackbarText }}
    </v-snackbar>

    <v-snackbar
      v-model="snackbarError"
      :timeout="4000"
      color="red"
      bottom
      centered
    >
      {{ snackbarTextError }}
    </v-snackbar>

    <v-snackbar
      v-model="snackbar_s"
      :timeout="6000"
      color="primary"
      bottom
      centered
    >
      {{ snackbarText_s }}
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import user from "@/assets/user.png";

const API_BASE = "https://yayalinkserver-production-edaa.up.railway.app/api";

export default {
  data() {
    return {
      numeral,
      user,

      drawer: false,
      show: false,

      notification_count: 0,
      notifications: [],

      CheckoutRequestID: "",
      selectedCandidateId: null,

      snackbar_s: false,
      snackbarText_s: "",

      dialog: false,

      snackbar: false,
      snackbarText: "",

      snackbarError: false,
      snackbarTextError: "",

      message: null,

      phoneNumber: "",
      phonePrefix: "254",

      amount: 150,
      plan_days: 3,

      progress_bar: false,

      items_gender: ["Female", "Male"],

      loading: false,
      loadingCounties: false,

      counties: [],

      filters: {
        gender: "",
        county: "",
        ward: "",
        min_age: "",
        max_age: "",
        min_salary: "",
        max_salary: "",
        min_experience: "",
        max_experience: "",
        working_status: "",
      },

      uid: "",
      candidates: [],

      auth_state: false,

      timerEnabled: false,
      timerCount: 25,

      employer: null,
      int_value: "",
      showProfile: false,

      pageInitialized: false,
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
        } else if (value === 0 && this.timerEnabled) {
          this.StkQuery();
          this.timerCount = 25;
        }
      },
      immediate: true,
    },
  },

  async mounted() {
    await this.initPage();

  },

  async activated() {
    if (!this.pageInitialized) {
      await this.initPage();
    } else if (this.candidates.length === 0) {
      await this.fetchCandidates();
    }
  },

  methods: {
    async initPage() {
        this.resetFilters();
      this.checkUser();

      await this.fetchCounties();

      await this.fetchCandidates();

      if (this.uid) {
        this.CheckPaymentStatus();
        this.fetchEmployer();
        this.fetchNotification();
      }

      this.pageInitialized = true;
    },

    logout() {
      if (this.$fire && this.$fire.auth) {
        this.$fire.auth.signOut();
        window.location.reload(true);
      }
    },

    showError(message) {
      this.snackbarTextError = message || "Something went wrong.";
      this.snackbarError = true;
    },

    showSuccess(message) {
      this.snackbarText = message || "Success";
      this.snackbar = true;
    },

    selectPlan(days, amount) {
      this.plan_days = days;
      this.amount = amount;
    },

    checkUser() {
      if (this.$fire && this.$fire.auth && this.$fire.auth.currentUser) {
        this.showProfile = true;
        this.uid = this.$fire.auth.currentUser.uid;
        this.auth_state = true;
      } else {
        this.showProfile = false;
        this.auth_state = false;
        this.uid = "";
      }
    },

    async fetchNotification() {
      if (!this.uid) return;

      try {
        const res = await axios.get(
          `${API_BASE}/notifications/get-notifications/${this.uid}`
        );

        this.notifications = Array.isArray(res.data) ? res.data : [];
        this.notification_count = this.notifications.length;
      } catch (err) {
        console.error("fetchNotification error:", err);
      }
    },

    async fetchEmployer() {
      if (!this.uid) return;

      try {
        const res = await axios.get(
          `${API_BASE}/employers/get-employer/${this.uid}`
        );

        this.employer = res.data;

        if (this.employer && this.employer.name) {
          this.int_value = this.employer.name.substring(0, 3).toUpperCase();
        }
      } catch (err) {
        console.error("fetchEmployer error:", err);
      }
    },

    async fetchCounties() {
      this.loadingCounties = true;

      try {
        const response = await axios.get(`${API_BASE}/counties/get-counties`);

        const data = Array.isArray(response.data) ? response.data : [];

        this.counties = data
          .map((item) => {
            if (typeof item === "string") return item;
            return item.county || item.name || item.county_name || "";
          })
          .filter(Boolean);
      } catch (err) {
        console.error("fetchCounties error:", err);
      } finally {
        this.loadingCounties = false;
      }
    },

    async CheckPaymentStatus() {
      if (!this.uid) return;

      try {
        const res = await axios.get(
          `${API_BASE}/employer-access/payment-status/${this.uid}`
        );

        console.log("Payment status", res.data);
      } catch (err) {
        console.error("CheckPaymentStatus error:", err);
      }
    },

    async CheckProgress(candidateId) {
      this.selectedCandidateId = candidateId;

      if (!this.uid) {
        this.showError("Please login first to view candidate profiles.");
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/employer-access/${this.uid}`);

        if (res.data.allowed === false) {
          this.dialog = true;
        } else {
          this.$router.push(`/candidate_info/${candidateId}`);
        }
      } catch (err) {
        if (err.response && err.response.status === 403) {
          const reason = err.response.data.reason;

          if (reason === "PAYMENT_REQUIRED") {
            this.dialog = true;
            return;
          }

          if (reason === "GRACE_PERIOD_EXPIRED") {
            this.dialog = true;
            this.showError("Your access period has expired. Please renew to continue.");
            return;
          }
        }

        console.error("CheckProgress error:", err);
        this.showError("Could not check access. Please try again.");
      }
    },

    async fetchCandidates() {
      
      this.loading = true;

      try {
        const cleanFilters = {};

        Object.keys(this.filters).forEach((key) => {
          const value = this.filters[key];

          if (value !== "" && value !== null && value !== undefined) {
            cleanFilters[key] = value;
          }
        });

        const res = await axios.get(`${API_BASE}/candidates/filter`, {
          params: cleanFilters,
        });

        this.candidates = Array.isArray(res.data) ? res.data : [];

        console.log("Candidates loaded on page load:", this.candidates);
      } catch (err) {
        console.error("fetchCandidates error:", err);
        this.showError("Failed to load candidates.");
        this.candidates = [];
      } finally {
        this.loading = false;
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
        min_experience: "",
        max_experience: "",
        working_status: "",
      };

      this.fetchCandidates();
    },

    async StkQuery() {
      if (!this.CheckoutRequestID) return;

      this.snackbar_s = true;
      this.snackbarText_s = "Checking payment status...";

      try {
        const response = await axios.post(`${API_BASE}/payments/stk/query`, {
          checkoutRequestId: this.CheckoutRequestID,
        });

        this.progress_bar = false;
        this.timerCount = 25;
        this.timerEnabled = false;

        this.showSuccess(response.data.ResultDesc || "Payment status received.");

        if (
          response.data.ResultCode === "0" ||
          response.data.ResultCode === 0
        ) {
          this.dialog = false;
          this.message = null;

          if (this.selectedCandidateId) {
            this.$router.push(`/candidate_info/${this.selectedCandidateId}`);
          } else {
            this.fetchCandidates();
          }
        }
      } catch (error) {
        console.error("StkQuery error:", error);

        this.timerCount = 25;
        this.timerEnabled = false;
        this.progress_bar = false;

        this.showError("Could not confirm payment. Please try again.");
      }
    },

    async processPayment() {
      if (!this.uid) {
        this.showError("Please login first.");
        return;
      }

      if (!this.phoneNumber) {
        this.showError("Provide your M-Pesa phone number.");
        return;
      }

      const cleanedPhone = String(this.phoneNumber).replace(/\D/g, "");
      const phone = this.phonePrefix + cleanedPhone;

      if (phone.length !== 12) {
        this.showError("Phone number should be 12 digits including country code.");
        return;
      }

      this.progress_bar = true;
      this.message = null;

      try {
        const response = await axios.post(`${API_BASE}/payments/stk`, {
          phone,
          amount: this.amount,
          user_id: this.uid,
          plan_days: this.plan_days,
          User_name:
            this.employer && this.employer.name
              ? this.employer.name
              : "Employer",
        });

        if (response.status === 200) {
          this.CheckoutRequestID = response.data.CheckoutRequestID;
          this.message = "Payment initiated. Enter your M-Pesa PIN to confirm.";
          this.showSuccess("STK Push sent to your phone.");
          this.timerEnabled = true;
        }
      } catch (error) {
        console.error("processPayment error:", error);

        this.progress_bar = false;

        const msg =
          error.response && error.response.data
            ? error.response.data.message || error.response.data
            : "Payment request failed.";

        this.showError(msg);
      }
    },
  },
};
</script>

<style scoped>
.yayalink-app {
  background: #0f1020 !important;
  color: white;
}

/* NAV */
.top-nav {
  background: rgba(5, 6, 15, 0.94) !important;
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.brand-wrap {
  display: flex;
  align-items: center;
}

.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, #00ffff, #00bcd4);
  color: #05060f;
  font-weight: 950;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 1.2rem;
}

.brand-name {
  font-weight: 950;
  color: #ffffff;
  font-size: 1.1rem;
  line-height: 1.1;
}

.brand-sub {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.72rem;
  margin-top: 3px;
}

.notification-btn {
  margin-right: 8px;
}

/* DRAWER */
.notification-drawer {
  background: #0b0c18 !important;
  color: white;
}

.drawer-header {
  padding: 24px;
  background: #05060f;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drawer-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 900;
}

.drawer-header p {
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.9rem;
}

.drawer-body {
  padding: 18px;
}

.notification-card {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 12px;
}

.notification-icon {
  min-width: 34px;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #00ffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-card strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.notification-card p {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.45;
}

.notification-card small {
  color: #00ffff;
  font-weight: 800;
}

.empty-notification {
  text-align: center;
  padding: 50px 20px;
  color: rgba(255, 255, 255, 0.65);
}

/* MAIN */
.page-shell {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 108px 20px 60px;
}

.top-profile-row {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.profile-link,
.profile-placeholder {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.profile-avatar {
  background: #00ffff !important;
  color: #05060f !important;
  font-weight: 950;
}

.profile-name {
  color: white;
  font-weight: 900;
  font-size: 0.98rem;
}

.profile-sub {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.78rem;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  color: white !important;
  text-transform: none;
  font-weight: 800;
}

/* HERO */
.search-hero {
  position: relative;
  overflow: hidden;
  padding: 42px;
  border-radius: 34px;
  background:
    radial-gradient(circle at top left, rgba(0, 255, 255, 0.18), transparent 34%),
    radial-gradient(circle at bottom right, rgba(0, 188, 212, 0.12), transparent 34%),
    linear-gradient(135deg, #15172d, #0b0c18);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 22px;
}

.hero-badge {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  border: 1px solid rgba(0, 255, 255, 0.24);
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 18px;
}

.search-hero h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.05;
  font-weight: 950;
  letter-spacing: -1.5px;
  margin-bottom: 14px;
}

.search-hero p {
  color: rgba(255, 255, 255, 0.72);
  max-width: 680px;
  line-height: 1.8;
  margin: 0;
}

/* FILTER */
.filter-card {
  background: rgba(255, 255, 255, 0.07) !important;
  border-radius: 28px !important;
  padding: 24px;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.09);
  margin-bottom: 28px;
}

.input-label {
  display: block;
  font-weight: 900;
  font-size: 0.82rem;
  margin-bottom: 8px;
  color: #ffffff !important;
}

.input-label.dark {
  color: #1a1b2b !important;
}

.advanced-filters .input-label {
  color: #1a1b2b !important;
}

.county-search {
  background: #ffffff;
  border-radius: 999px;
}

.county-search ::v-deep .v-input__slot {
  background: #ffffff !important;
  min-height: 48px !important;
  box-shadow: none !important;
  border: 1px solid rgba(0, 188, 212, 0.22) !important;
}

.county-search ::v-deep fieldset {
  border-color: rgba(0, 188, 212, 0.35) !important;
}

.county-search ::v-deep input {
  color: #1a1b2b !important;
  font-weight: 800;
}

.county-search ::v-deep input::placeholder {
  color: rgba(26, 27, 43, 0.55) !important;
  font-weight: 700;
}

.county-search ::v-deep .v-icon {
  color: #00bcd4 !important;
}

.county-search ::v-deep .v-select__selection {
  color: #1a1b2b !important;
  font-weight: 900;
}

.advanced-filters {
  margin-top: 22px;
  background: #f7fbff;
  color: #1a1b2b;
  border-radius: 24px;
  padding: 22px;
}

.advanced-filters ::v-deep .v-input__slot {
  background: #ffffff !important;
}

.advanced-filters ::v-deep input {
  color: #1a1b2b !important;
  font-weight: 800;
}

.advanced-filters ::v-deep input::placeholder {
  color: rgba(26, 27, 43, 0.45) !important;
}

.advanced-filters ::v-deep .v-select__selection {
  color: #1a1b2b !important;
  font-weight: 800;
}

.advanced-filters ::v-deep .v-slider__track-fill,
.advanced-filters ::v-deep .v-slider__thumb {
  background-color: #00bcd4 !important;
}

.filter-actions {
  display: flex;
  align-items: end;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-toggle-btn {
  background: #00ffff !important;
  color: #05060f !important;
  font-weight: 900;
  text-transform: none;
}

.slider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slider-header strong {
  color: #1a1b2b;
}

.apply-row {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}

.apply-btn {
  background: #05060f !important;
  color: #00ffff !important;
  font-weight: 900;
  text-transform: none;
}

/* RESULTS */
.results-header {
  display: flex;
  align-items: center;
  margin: 16px 0 18px;
}

.results-header h2 {
  margin: 0;
  font-weight: 950;
  font-size: 1.5rem;
}

.results-header p {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.62);
}

.loading-box,
.empty-state {
  min-height: 240px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
}

.empty-state h3 {
  margin: 0;
  color: white;
  font-size: 1.4rem;
}

/* CANDIDATES */
.candidate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 22px;
}

.candidate-card {
  background: #ffffff !important;
  color: #1a1b2b !important;
  border-radius: 26px !important;
  padding: 18px;
  transition: 0.25s ease;
}

.candidate-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28) !important;
}

.candidate-top {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.candidate-avatar {
  background: #05060f !important;
}

.candidate-body {
  min-height: 145px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.name-row h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 950;
}

.candidate-meta {
  margin: 7px 0 14px;
  color: rgba(26, 27, 43, 0.65);
  font-weight: 700;
}

.candidate-meta span {
  margin: 0 6px;
}

.candidate-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.candidate-footer {
  margin-top: 16px;
  padding: 14px;
  border-radius: 20px;
  background: #eef6ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.salary {
  font-size: 1.1rem;
  font-weight: 950;
}

.salary-period {
  color: rgba(26, 27, 43, 0.62);
  font-size: 0.8rem;
  font-weight: 700;
}

.view-btn {
  background: #05060f !important;
  color: white !important;
  font-weight: 800;
  text-transform: none;
}

/* PAYMENT */
.payment-card {
  background: #ffffff !important;
  border-radius: 28px !important;
  overflow: hidden;
}

.payment-header {
  background:
    radial-gradient(circle at top left, rgba(0, 255, 255, 0.18), transparent 38%),
    #05060f;
  color: white;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.payment-header h2 {
  margin: 0;
  font-weight: 950;
}

.payment-header p {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.65);
}

.payment-body {
  padding: 24px;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.plan-card {
  padding: 18px 10px;
  border-radius: 18px;
  background: #f1f5f9;
  border: 2px solid transparent;
  cursor: pointer;
  text-align: center;
  transition: 0.2s ease;
}

.plan-card.active {
  background: rgba(0, 255, 255, 0.16);
  border-color: #00bcd4;
}

.plan-card strong {
  display: block;
  font-size: 0.95rem;
  font-weight: 950;
  margin-bottom: 6px;
}

.plan-card span {
  color: rgba(26, 27, 43, 0.68);
  font-weight: 800;
}

.payment-summary {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.payment-summary div {
  padding: 16px;
  border-radius: 18px;
  background: #f7fbff;
}

.payment-summary span {
  display: block;
  color: rgba(26, 27, 43, 0.62);
  font-size: 0.78rem;
  margin-bottom: 6px;
}

.payment-summary strong {
  font-size: 1.15rem;
  font-weight: 950;
}

.stk-info {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 20px;
  background: #0f1020;
  color: white;
}

.stk-info p {
  margin: 0;
  line-height: 1.6;
  font-size: 0.9rem;
}

.payment-actions {
  padding: 0 24px 24px;
}

.pay-btn {
  background: #05060f !important;
  color: #00ffff !important;
  font-weight: 900;
  text-transform: none;
}

/* MOBILE */
@media (max-width: 760px) {
  .page-shell {
    padding: 98px 14px 40px;
  }

  .brand-sub {
    display: none;
  }

  .search-hero {
    padding: 28px 22px;
    border-radius: 26px;
  }

  .filter-card {
    padding: 18px;
  }

  .filter-actions {
    justify-content: flex-start;
  }

  .candidate-grid {
    grid-template-columns: 1fr;
  }

  .candidate-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .view-btn {
    width: 100%;
  }

  .plans-grid,
  .payment-summary {
    grid-template-columns: 1fr;
  }

  .notification-drawer {
    width: 100% !important;
  }
}
</style>