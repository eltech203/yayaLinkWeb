<template>
  <v-app class="bureau-page">
    <!-- NAVBAR -->
    <v-app-bar app fixed dark height="76" elevation="0" class="top-nav">
      <v-btn icon class="mr-2" to="/">
        <v-icon color="cyan accent-2">mdi-arrow-left</v-icon>
      </v-btn>

      <nuxt-link to="/" class="brand-link">
        <div class="brand-wrap">
          <div class="brand-icon">Y</div>

          <div>
            <div class="brand-name">YayaLink</div>
            <div class="brand-sub">Bureau Dashboard</div>
          </div>
        </div>
      </nuxt-link>

      <v-spacer />

      <v-btn
        icon
        class="mr-2"
        :disabled="isSubscriptionBlocked"
        @click="dialogAdd = true"
      >
        <v-icon color="cyan accent-2">mdi-account-plus-outline</v-icon>
      </v-btn>

      <v-btn icon color="white" @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <div class="page-shell">
        <!-- SUBSCRIPTION BANNER -->
        <div
          v-if="subscription && subscription.status"
          class="sub-banner"
          :class="bannerClass"
        >
          <div class="sub-banner-left">
            <div class="sub-banner-icon">
              <v-icon color="black">{{ bannerIcon }}</v-icon>
            </div>

            <div>
              <strong>{{ bannerTitle }}</strong>
              <p>{{ bannerMessage }}</p>
            </div>
          </div>

          <div class="sub-banner-right">
            <v-btn
              v-if="showRenewButton"
              rounded
              class="renew-btn"
              @click="openRenewDialog"
            >
              <v-icon left small>mdi-refresh</v-icon>
              Renew — Ksh {{ numeral(planFee).format("0,0") }}
            </v-btn>
          </div>
        </div>

        <!-- HERO -->
        <section class="profile-hero">
          <div class="hero-glow"></div>

          <v-row align="center">
            <v-col cols="12" md="7">
              <div class="profile-main">
                <v-avatar size="72" class="profile-avatar">
                  {{ int_value || "YA" }}
                </v-avatar>

                <div>
                  <div class="hero-badge">
                    <v-icon small color="black">mdi-domain</v-icon>
                    Bureau Account
                  </div>

                  <h1>{{ bureau.bureau_name || "Bureau" }}</h1>

                  <div class="profile-meta">
                    <span>{{ bureau.county || "County not set" }}</span>
                    <span>•</span>
                    <span>{{ bureau.email || "No email" }}</span>
                    <span>•</span>
                    <span>{{ bureau.phone_no || "No phone" }}</span>
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="5">
              <div class="action-card">
                <div class="action-icon">
                  <v-icon color="black">mdi-account-multiple-plus-outline</v-icon>
                </div>

                <div>
                  <span>Candidate Management</span>
                  <strong>Add and manage candidates</strong>
                  <p>Upload verified candidates and monitor their availability.</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </section>

        <!-- STATS -->
        <v-row class="stats-row">
          <v-col cols="12" md="4">
            <div class="stat-card">
              <div class="stat-icon">
                <v-icon color="black">mdi-account-group-outline</v-icon>
              </div>

              <div>
                <span>Total Candidates</span>
                <strong>{{ candidate_count }}</strong>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div class="stat-card">
              <div class="stat-icon">
                <v-icon color="black">mdi-account-check-outline</v-icon>
              </div>

              <div>
                <span>Available</span>
                <strong>{{ availableCount }}</strong>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div class="stat-card">
              <div class="stat-icon">
                <v-icon color="black">mdi-account-off-outline</v-icon>
              </div>

              <div>
                <span>Unavailable</span>
                <strong>{{ unavailableCount }}</strong>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- ACTION BAR -->
        <div class="action-bar">
          <div>
            <h2>{{ bureau.bureau_name || "Bureau" }} Candidates</h2>
            <p>View, add, update, and manage candidates under your bureau.</p>
          </div>

          <div class="view-actions">
            <v-btn
              rounded
              class="primary-btn"
              :disabled="isSubscriptionBlocked"
              @click="dialogAdd = true"
            >
              <v-icon left small>mdi-account-plus-outline</v-icon>
              Add Candidate
            </v-btn>

            <v-btn
              rounded
              :class="grid ? 'active-view-btn' : 'view-btn'"
              @click="grid = true; list = false"
            >
              <v-icon left small>mdi-grid</v-icon>
              Grid
            </v-btn>

            <v-btn
              rounded
              :class="list ? 'active-view-btn' : 'view-btn'"
              @click="list = true; grid = false"
            >
              <v-icon left small>mdi-format-list-bulleted</v-icon>
              List
            </v-btn>

            <v-btn
              rounded
              class="refresh-btn"
              :loading="loading"
              @click="refreshDashboard"
            >
              <v-icon left small>mdi-refresh</v-icon>
              Refresh
            </v-btn>
          </div>
        </div>

        <!-- GRID VIEW -->
        <div v-show="grid" class="content-panel">
          <div v-if="loading" class="loading-box">
            <v-progress-circular indeterminate color="cyan accent-2" size="42" />
            <p>Loading candidates...</p>
          </div>

          <div v-else-if="candidates.length === 0" class="empty-state">
            <v-icon size="58" color="cyan accent-2">mdi-account-search-outline</v-icon>

            <h3>No candidates found</h3>
            <p>Add your first candidate to start building your bureau profile.</p>

            <v-btn
              rounded
              class="primary-btn"
              :disabled="isSubscriptionBlocked"
              @click="dialogAdd = true"
            >
              Add Candidate
              <v-icon right>mdi-account-plus-outline</v-icon>
            </v-btn>
          </div>

          <div v-else class="candidate-grid">
            <v-card
              v-for="candidate in candidates"
              :key="candidate.candidate_id || candidate.id"
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
                  :color="isUnavailable(candidate.working_status) ? 'red' : 'green'"
                >
                  {{ candidate.working_status || "available" }}
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
                    <v-icon left small>mdi-cash</v-icon>
                    Ksh {{ numeral(candidate.salary || 0).format("0,0") }}
                  </v-chip>
                </div>
              </div>

              <div class="candidate-footer">
                <div>
                  <div class="salary">
                    Ksh {{ numeral(candidate.salary || 0).format("0,0") }}
                  </div>
                  <div class="salary-period">
                    per {{ candidate.salary_period || "month" }}
                  </div>
                </div>

                <v-btn
                  rounded
                  small
                  class="view-profile-btn"
                  @click="openCandidate(candidate)"
                >
                  View
                  <v-icon right small>mdi-account-arrow-right-outline</v-icon>
                </v-btn>
              </div>
            </v-card>
          </div>
        </div>

        <!-- LIST VIEW -->
        <div v-show="list" class="content-panel">
          <div class="table-card">
            <v-text-field
              v-model="search"
              outlined
              rounded
              dense
              placeholder="Search candidate..."
              prepend-inner-icon="mdi-magnify"
              class="table-search"
              hide-details
            />

            <v-data-table
              :headers="headers"
              :items="candidates"
              :search="search"
              :loading="loading"
              item-key="candidate_id"
              class="modern-table"
              light
            >
              <template v-slot:item.salary="{ item }">
                Ksh {{ numeral(item.salary || 0).format("0,0") }}
              </template>

              <template v-slot:item.working_status="{ item }">
                <v-chip
                  small
                  outlined
                  :color="isUnavailable(item.working_status) ? 'red' : 'green'"
                >
                  {{ item.working_status || "available" }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn
                  rounded
                  x-small
                  class="view-profile-btn"
                  @click="openCandidate(item)"
                >
                  View
                </v-btn>
              </template>
            </v-data-table>
          </div>
        </div>
      </div>
    </v-main>

    <!-- VIEW / EDIT CANDIDATE DIALOG -->
    <v-dialog v-model="dialogView" max-width="640" persistent>
      <v-card class="candidate-dialog">
        <div class="dialog-header">
          <div>
            <h2>{{ updateCanidate ? "Edit Candidate" : "Candidate Details" }}</h2>
            <p>
              {{
                updateCanidate
                  ? "Update the candidate information below."
                  : "Review candidate information and manage actions."
              }}
            </p>
          </div>

          <v-btn icon @click="closeCandidateDialog" :disabled="saving">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- VIEW MODE -->
        <div class="dialog-body" v-if="can_details && !updateCanidate">
          <div class="dialog-profile">
            <v-avatar size="64" class="candidate-avatar">
              <img :src="user" alt="Candidate" />
            </v-avatar>

            <div>
              <h3>{{ can_details.candidate_name }}</h3>
              <p>
                {{ can_details.gender }} • {{ can_details.age }} yrs •
                {{ can_details.county }}
              </p>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <span>Salary</span>
              <strong>
                Ksh {{ numeral(can_details.salary || 0).format("0,0") }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Salary Period</span>
              <strong>{{ can_details.salary_period || "Monthly" }}</strong>
            </div>

            <div class="detail-item">
              <span>Status</span>
              <strong
                :class="isUnavailable(can_details.working_status) ? 'danger-text' : 'success-text'"
              >
                {{ can_details.working_status || "available" }}
              </strong>
            </div>

            <div class="detail-item">
              <span>Experience</span>
              <strong>{{ can_details.experience || 0 }} yrs</strong>
            </div>

            <div class="detail-item">
              <span>Phone</span>
              <strong>{{ can_details.mobile_no || "N/A" }}</strong>
            </div>

            <div class="detail-item">
              <span>Next of Kin</span>
              <strong>{{ can_details.next_of_kin || "N/A" }}</strong>
            </div>

            <div class="detail-item">
              <span>Ward</span>
              <strong>{{ can_details.ward || "N/A" }}</strong>
            </div>

            <div class="detail-item">
              <span>Village</span>
              <strong>{{ can_details.village || "N/A" }}</strong>
            </div>
          </div>

          <div
            v-if="isUnavailable(can_details.working_status)"
            class="employer-box"
          >
            <h4>Current Employer Details</h4>

            <p>
              <strong>Employer:</strong>
              {{ can_details.employer || "N/A" }}
            </p>

            <p>
              <strong>Employer Contact:</strong>
              {{ can_details.employer_no || "N/A" }}
            </p>

            <p>
              <strong>Employer County:</strong>
              {{ can_details.employer_county || "N/A" }}
            </p>
          </div>

          <div v-if="deletCanidate" class="delete-confirm-box">
            <v-icon color="red">mdi-alert-circle-outline</v-icon>

            <div>
              <h3>Delete {{ can_details.candidate_name }}?</h3>
              <p>
                This action cannot be undone. You cannot delete a candidate who is
                currently unavailable.
              </p>

              <div class="delete-actions">
                <v-btn
                  rounded
                  color="red"
                  dark
                  :loading="deleteLoading"
                  @click="deleteCandidate(can_details.candidate_id, can_details.working_status)"
                >
                  Yes, Delete
                </v-btn>

                <v-btn rounded outlined @click="deletCanidate = false">
                  Cancel
                </v-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- EDIT MODE -->
        <div class="dialog-body" v-if="can_details && updateCanidate">
          <div class="dialog-profile">
            <v-avatar size="64" class="candidate-avatar">
              <img :src="user" alt="Candidate" />
            </v-avatar>

            <div>
              <h3>{{ edit_form.candidate_name || "Candidate" }}</h3>
              <p>Editing candidate details</p>
            </div>
          </div>

          <div class="edit-grid">
            <v-text-field
              v-model="edit_form.candidate_name"
              label="Full Name"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />

            <v-text-field
              v-model="edit_form.mobile_no"
              label="Phone"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />

            <v-text-field
              v-model="edit_form.kin_phone_no"
              label="Next of Kin Phone"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />

            <v-text-field
              v-model="edit_form.next_of_kin"
              label="Next of Kin Name"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />

            <v-select
              v-model="edit_form.gender"
              :items="items_gender"
              label="Gender"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />

            <v-text-field
              v-model="edit_form.dob"
              label="Date of Birth"
              type="date"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
              @change="calculatedEditAge"
            />

            <div class="edit-age">
              Age: <strong>{{ edit_form.age || 0 }}</strong> yrs
            </div>

            <v-autocomplete
              v-model="edit_form.county"
              :items="counties"
              label="County"
              outlined
              rounded
              dense
              hide-details
              :loading="loadingCounties"
              :disabled="saving"
            />

            <v-text-field
              v-model="edit_form.ward"
              label="Ward"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />

            <v-text-field
              v-model="edit_form.village"
              label="Village"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />

            <v-text-field
              v-model="edit_form.experience"
              label="Experience (years)"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />

            <v-text-field
              v-model="edit_form.salary"
              label="Salary"
              type="number"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />

            <v-select
              v-model="edit_form.salary_period"
              :items="items_salary_period"
              label="Salary Period"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />

            <v-select
              v-model="edit_form.working_status"
              :items="items_working_status"
              label="Working Status"
              outlined
              rounded
              dense
              hide-details
              :disabled="saving"
            />
          </div>
        </div>

        <v-card-actions class="dialog-actions">
          <!-- VIEW MODE ACTIONS -->
          <template v-if="!updateCanidate">
            <v-btn
              rounded
              class="danger-btn"
              :disabled="isSubscriptionBlocked || deletCanidate"
              @click="deletCanidate = true"
            >
              Delete
              <v-icon right small>mdi-delete-outline</v-icon>
            </v-btn>

            <v-btn
              rounded
              class="update-btn"
              :disabled="isSubscriptionBlocked"
              @click="startEdit"
            >
              Update
              <v-icon right small>mdi-pencil-outline</v-icon>
            </v-btn>

            <v-spacer />

            <v-btn text color="white" @click="closeCandidateDialog">
              Close
            </v-btn>
          </template>

          <!-- EDIT MODE ACTIONS -->
          <template v-else>
            <v-btn
              rounded
              class="update-btn"
              :loading="saving"
              :disabled="saving"
              @click="saveChanges"
            >
              <v-icon left small>mdi-content-save-outline</v-icon>
              Save Changes
            </v-btn>

            <v-btn
              rounded
              text
              color="white"
              :disabled="saving"
              @click="cancelEdit"
            >
              Cancel
            </v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ADD CANDIDATE DIALOG -->
    <v-dialog v-model="dialogAdd" max-width="900">
      <v-card class="add-dialog">
        <div class="dialog-header">
          <div>
            <h2>Add Candidate</h2>
            <p>Register a new candidate under your bureau.</p>
          </div>

          <v-btn icon @click="closeAddDialog">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="dialog-body">
          <candidate_reg
            @candidate-added="onCandidateAdded"
            @subscription-expired="onSubscriptionExpired"
          />
        </div>
      </v-card>
    </v-dialog>

    <!-- RENEW SUBSCRIPTION DIALOG -->
    <v-dialog v-model="dialogRenew" max-width="520" persistent>
      <v-card class="renew-dialog">
        <div class="dialog-header">
          <div>
            <h2>Renew Subscription</h2>
            <p>
              Pay Ksh {{ numeral(planFee).format("0,0") }} to extend your access
              by {{ planDays }} days.
            </p>
          </div>

          <v-btn icon @click="dialogRenew = false" v-if="!renewLoading">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="dialog-body">
          <!-- Loading plan -->
          <div v-if="planLoading" class="plans-loading">
            <v-progress-circular indeterminate color="cyan accent-2" size="32" />
            <span>Loading plan...</span>
          </div>

          <template v-else>
            <div class="renew-summary">
              <div class="renew-row">
                <span>Plan</span>
                <strong>Monthly Subscription</strong>
              </div>

              <div class="renew-row">
                <span>Duration</span>
                <strong>{{ planDays }} days</strong>
              </div>

              <div class="renew-row">
                <span>Total Amount</span>
                <strong class="amount-text">
                  Ksh {{ numeral(planFee).format("0,0") }}
                </strong>
              </div>
            </div>

            <div class="mt-6">
              <label class="renew-label">M-Pesa Phone Number</label>

              <v-text-field
                v-model="renewPhone"
                outlined
                rounded
                dense
                prefix="254"
                placeholder="7XXXXXXXX"
                type="number"
                hide-details
                :disabled="renewLoading"
              />
            </div>

            <div class="stk-info">
              <v-icon color="cyan accent-2">mdi-cellphone-check</v-icon>

              <p>
                An STK Push will be sent to
                <strong>254{{ renewPhone || "7XXXXXXXX" }}</strong>.
                Enter your M-Pesa PIN to complete payment.
              </p>
            </div>
          </template>

          <v-progress-linear
            v-show="renewLoading"
            indeterminate
            color="cyan accent-2"
            class="mt-4"
          />

          <v-alert
            v-if="renewMessage"
            class="mt-4"
            type="success"
            dense
            outlined
          >
            {{ renewMessage }}
          </v-alert>

          <v-alert
            v-if="renewError"
            class="mt-4"
            type="error"
            dense
            outlined
          >
            {{ renewError }}
          </v-alert>
        </div>

        <v-card-actions class="dialog-actions">
          <v-btn
            rounded
            class="update-btn"
            :loading="renewLoading"
            :disabled="renewLoading || planLoading"
            @click="processRenewal"
          >
            <v-icon left small>mdi-cellphone-arrow-down</v-icon>
            Send STK Push
          </v-btn>

          <v-spacer />

          <v-btn
            text
            color="white"
            @click="dialogRenew = false"
            :disabled="renewLoading"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SNACKBARS -->
    <v-snackbar v-model="snackbar" :timeout="4000" color="black" bottom centered>
      {{ snackbarText }}
    </v-snackbar>

    <v-snackbar v-model="snackbar2" :timeout="4000" color="red" bottom centered>
      {{ snackbarText2 }}
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from "axios";
import numeral from "numeral";
import user from "@/assets/user.png";
import Candidate_reg from "../components/candidate_reg.vue";

const API_BASE = "https://yayalinkserver-production-b920.up.railway.app/api";

export default {
  middleware: ["auth", "roleGuard"],

  components: {
    Candidate_reg,
  },

  data() {
    return {
      search: "",

      grid: true,
      list: false,

      deletCanidate: false,
      updateCanidate: false,
      saving: false,

      dialogAdd: false,
      dialogView: false,
      dialogRenew: false,

      snackbar: false,
      snackbarText: "",

      snackbar2: false,
      snackbarText2: "",

      deleteLoading: false,

      // ─── Payment plan (fetched from backend) ───
      planFee: 1000,        // fallback default
      planDays: 30,         // fallback default
      planLoading: false,
      planLoaded: false,

      // Renewal state
      renewPhone: "",
      renewLoading: false,
      renewMessage: "",
      renewError: "",
      renewCheckoutId: "",
      renewPollTimer: null,
      renewPollCount: 0,

      candidate_count: 0,

      uid: null,
      auth_state: true,

      user,
      numeral,

      bureau: {},
      candidates: [],
      can_details: null,
      edit_form: null,

      // For county dropdown in edit mode
      counties: [],
      loadingCounties: false,

      items_gender: ["Female", "Male"],
      items_salary_period: ["Daily", "Weekly", "Monthly"],
      items_working_status: ["available", "unavailable"],

      loading: false,
      int_value: "",

      pageInitialized: false,

      headers: [
        { text: "Candidate name", align: "start", value: "candidate_name" },
        { text: "Gender", value: "gender" },
        { text: "Age", value: "age" },
        { text: "County", value: "county" },
        { text: "Salary", value: "salary" },
        { text: "Salary Period", value: "salary_period" },
        { text: "Status", value: "working_status" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },

  computed: {
    availableCount() {
      return this.candidates.filter(
        (candidate) => !this.isUnavailable(candidate.working_status)
      ).length;
    },

    unavailableCount() {
      return this.candidates.filter((candidate) =>
        this.isUnavailable(candidate.working_status)
      ).length;
    },

    subscription() {
      return this.bureau && this.bureau.subscription ? this.bureau.subscription : null;
    },

    isSubscriptionBlocked() {
      return this.subscription ? this.subscription.is_expired === true : false;
    },

    bannerClass() {
      if (!this.subscription) return "banner-trial";

      switch (this.subscription.status) {
        case "TRIAL":
          return "banner-trial";
        case "ACTIVE":
          return "banner-active";
        case "GRACE":
          return "banner-grace";
        case "EXPIRED":
          return "banner-expired";
        default:
          return "banner-trial";
      }
    },

    bannerIcon() {
      if (!this.subscription) return "mdi-information";

      switch (this.subscription.status) {
        case "TRIAL":
          return "mdi-gift-outline";
        case "ACTIVE":
          return "mdi-check-circle-outline";
        case "GRACE":
          return "mdi-alert-outline";
        case "EXPIRED":
          return "mdi-lock-outline";
        default:
          return "mdi-information";
      }
    },

    bannerTitle() {
      if (!this.subscription) return "Subscription";

      const days = this.subscription.days_left || 0;

      switch (this.subscription.status) {
        case "TRIAL":
          return `Free Trial — ${days} day${days === 1 ? "" : "s"} left`;
        case "ACTIVE":
          return `Active — ${days} day${days === 1 ? "" : "s"} remaining`;
        case "GRACE":
          return `Grace Period — ${days} day${days === 1 ? "" : "s"} left`;
        case "EXPIRED":
          return "Account Locked — Subscription Expired";
        default:
          return "Subscription";
      }
    },

    bannerMessage() {
      if (!this.subscription) return "";

      switch (this.subscription.status) {
        case "TRIAL":
          return "Enjoy full access during your trial. Renew anytime to avoid interruption.";
        case "ACTIVE":
          return "Your subscription is active. Renew early to extend your access.";
        case "GRACE":
          return "Your subscription has ended. Renew now to avoid losing access to candidate management.";
        case "EXPIRED":
          return "You can still view candidates, but adding, updating, and deleting are disabled until you renew.";
        default:
          return "";
      }
    },

    showRenewButton() {
      if (!this.subscription) return false;
      return true;
    },
  },

  async mounted() {
    this.checkUser();

    await this.initPage();

    window.addEventListener("bureau-subscription-expired", this.onSubscriptionExpired);
  },

  async activated() {
    if (!this.pageInitialized) {
      await this.initPage();
    } else {
      // Nuxt keep-alive re-entry: refresh plan + dashboard
      await Promise.all([
        this.fetchPlan(),
        this.uid ? this.refreshDashboard() : Promise.resolve(),
      ]);
    }
  },

  beforeDestroy() {
    window.removeEventListener("bureau-subscription-expired", this.onSubscriptionExpired);
    if (this.renewPollTimer) clearInterval(this.renewPollTimer);
  },

  methods: {
    /* ─────── INIT ─────── */
    async initPage() {
      this.checkUser();

      await Promise.all([
        this.fetchPlan(),
        this.uid ? this.refreshDashboard() : Promise.resolve(),
      ]);

      this.fetchCounties();

      this.pageInitialized = true;
    },

    checkUser() {
      if (this.$fire && this.$fire.auth && this.$fire.auth.currentUser) {
        this.uid = this.$fire.auth.currentUser.uid;
        this.auth_state = true;
      } else {
        this.uid = null;
        this.auth_state = false;
      }
    },

    logout() {
      if (this.$fire && this.$fire.auth) {
        this.$fire.auth.signOut();
        window.location.reload(true);
      }
    },

    showSuccess(message) {
      this.snackbarText = message || "Success";
      this.snackbar = true;
    },

    showError(message) {
      this.snackbarText2 = message || "Something went wrong.";
      this.snackbar2 = true;
    },

    isUnavailable(status) {
      if (!status) return false;

      const normalized = String(status).toLowerCase();

      return (
        normalized === "unavailable" ||
        normalized === "hired" ||
        normalized === "selected"
      );
    },

    onSubscriptionExpired() {
      this.dialogRenew = true;
      this.showError("Your subscription has expired. Please renew to continue.");
      this.fetchBureau();
    },

    onCandidateAdded() {
      this.showSuccess("Candidate added successfully.");
      this.closeAddDialog();
    },

    async refreshDashboard() {
      await Promise.all([
        this.fetchPlan(),
        this.fetchBureau(),
        this.fetchBureauCandidates(),
      ]);
    },

    openCandidate(candidate) {
      this.can_details = candidate;
      this.deletCanidate = false;
      this.updateCanidate = false;
      this.edit_form = null;
      this.dialogView = true;
    },

    closeCandidateDialog() {
      this.dialogView = false;
      this.can_details = null;
      this.edit_form = null;
      this.deletCanidate = false;
      this.updateCanidate = false;
      this.saving = false;
    },

    closeAddDialog() {
      this.dialogAdd = false;
      this.fetchBureauCandidates();
    },

    /* ─────── PLAN (fetched from settings) ─────── */
    async fetchPlan() {
      this.planLoading = true;

      try {
        const res = await axios.get(`${API_BASE}/payment/plans/BUREAU`);
        const plans = Array.isArray(res.data?.plans) ? res.data.plans : [];

        if (plans.length > 0) {
          // Bureau only has one plan — 30 days
          this.planFee = plans[0].fee;
          this.planDays = plans[0].days;
          this.planLoaded = true;
        } else {
          console.warn("fetchPlan: no plans returned");
        }
      } catch (err) {
        console.error("fetchPlan error:", err);
        // Fallback to hardcoded defaults (1000 KES / 30 days)
      } finally {
        this.planLoading = false;
      }
    },

    /* ─────── EDIT MODE ─────── */
    startEdit() {
      if (!this.can_details) return;

      this.edit_form = {
        candidate_id: this.can_details.candidate_id,
        user_id: this.can_details.user_id || this.uid,
        candidate_name: this.can_details.candidate_name || "",
        gender: this.can_details.gender || "Female",
        dob: this.formatDOB(this.can_details.dob),
        age: this.can_details.age || 0,
        mobile_no: this.can_details.mobile_no || "",
        kin_phone_no: this.can_details.kin_phone_no || "",
        next_of_kin: this.can_details.next_of_kin || "",
        village: this.can_details.village || "",
        ward: this.can_details.ward || "",
        county: this.can_details.county || "",
        bureau_name: this.can_details.bureau_name || "",
        bureau_no: this.can_details.bureau_no || "",
        experience: this.can_details.experience || "",
        salary: this.can_details.salary || "",
        salary_period: this.can_details.salary_period || "Monthly",
        working_status: this.can_details.working_status || "available",
        status: this.can_details.status || "Available",
      };

      this.deletCanidate = false;
      this.updateCanidate = true;
    },

    cancelEdit() {
      this.updateCanidate = false;
      this.edit_form = null;
    },

    formatDOB(dob) {
      if (!dob) return "";

      try {
        const d = new Date(dob);
        if (Number.isNaN(d.getTime())) return "";

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      } catch {
        return "";
      }
    },

    calculatedEditAge() {
      if (!this.edit_form || !this.edit_form.dob) {
        if (this.edit_form) this.edit_form.age = "";
        return;
      }

      const today = new Date();
      const dob = new Date(this.edit_form.dob);

      if (Number.isNaN(dob.getTime())) {
        this.edit_form.age = "";
        return;
      }

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      this.edit_form.age = Number(age);
    },

    async saveChanges() {
      if (!this.edit_form) return;

      if (!this.edit_form.candidate_name) {
        this.showError("Candidate name is required.");
        return;
      }

      if (!this.edit_form.mobile_no) {
        this.showError("Phone number is required.");
        return;
      }

      if (!this.edit_form.county) {
        this.showError("County is required.");
        return;
      }

      if (this.edit_form.age === "" || Number(this.edit_form.age) < 18) {
        this.showError("Candidate must be 18 years or older.");
        return;
      }

      this.saving = true;

      try {
        const payload = {
          user_id: this.uid,
          candidate_name: this.edit_form.candidate_name,
          gender: this.edit_form.gender,
          dob: this.edit_form.dob,
          mobile_no: this.edit_form.mobile_no,
          kin_phone_no: this.edit_form.kin_phone_no,
          next_of_kin: this.edit_form.next_of_kin,
          village: this.edit_form.village,
          ward: this.edit_form.ward,
          county: this.edit_form.county,
          bureau_name: this.edit_form.bureau_name,
          bureau_no: this.edit_form.bureau_no,
          experience: this.edit_form.experience,
          salary: this.edit_form.salary,
          salary_period: this.edit_form.salary_period,
          working_status: this.edit_form.working_status,
          status: this.edit_form.status,
          age: this.edit_form.age,
        };

        const res = await axios.post(
          `${API_BASE}/candidates/update-candidate/${this.edit_form.candidate_id}`,
          payload
        );

        if (res.status === 200) {
          this.showSuccess(
            res.data.message || "Candidate updated successfully."
          );

          await this.fetchBureauCandidates();
          this.closeCandidateDialog();
        }
      } catch (err) {
        console.error("saveChanges error:", err);

        if (err.response && err.response.status === 402) {
          this.dialogRenew = true;
          this.showError(
            err.response.data.message ||
              "Your subscription has expired. Please renew to continue."
          );
          return;
        }

        const message =
          err.response && err.response.data
            ? err.response.data.message || "Failed to update candidate."
            : "Failed to update candidate.";

        this.showError(message);
      } finally {
        this.saving = false;
      }
    },

    /* ─────── COUNTIES ─────── */
    async fetchCounties() {
      this.loadingCounties = true;

      try {
        const res = await axios.get(`${API_BASE}/counties/get-counties`);
        const data = Array.isArray(res.data) ? res.data : [];

        this.counties = data
          .map((c) => {
            if (typeof c === "string") return c;
            return c.name || c.county || c.county_name || "";
          })
          .filter(Boolean);
      } catch (err) {
        console.error("fetchCounties error:", err);
      } finally {
        this.loadingCounties = false;
      }
    },

    /* ─────── RENEWAL ─────── */
    async openRenewDialog() {
      // Always fetch fresh plan data before showing the dialog
      await this.fetchPlan();

      this.dialogRenew = true;
      this.renewMessage = "";
      this.renewError = "";

      if (this.bureau && this.bureau.phone_no) {
        const cleaned = String(this.bureau.phone_no).replace(/\D/g, "");
        this.renewPhone = cleaned.startsWith("254")
          ? cleaned.substring(3)
          : cleaned;
      }
    },

    async processRenewal() {
      this.renewMessage = "";
      this.renewError = "";

      if (!this.renewPhone) {
        this.renewError = "Enter your M-Pesa phone number.";
        return;
      }

      const cleaned = String(this.renewPhone).replace(/\D/g, "");

      if (cleaned.length !== 9 && cleaned.length !== 10 && cleaned.length !== 12) {
        this.renewError = "Enter a valid Kenyan phone number.";
        return;
      }

      const phone =
        cleaned.length === 12
          ? cleaned
          : "254" + cleaned.replace(/^0/, "").slice(-9);

      this.renewLoading = true;

      try {
        // Backend reads the fee + days from yaya_settings
        const res = await axios.post(`${API_BASE}/payment/stk`, {
          phone,
          user_id: this.uid,
          plan_days: this.planDays,
          user_type: "BUREAU",
          User_name:
            this.bureau && this.bureau.bureau_name
              ? this.bureau.bureau_name
              : "Bureau",
        });

        if (res.status === 200) {
          this.renewCheckoutId =
            res.data.CheckoutRequestID || res.data.checkoutRequestId;
          this.renewMessage =
            "STK Push sent. Enter your M-Pesa PIN to complete payment.";
          this.startRenewPolling();
        }
      } catch (err) {
        console.error("processRenewal error:", err);
        this.renewLoading = false;
        this.renewError =
          err.response && err.response.data
            ? err.response.data.message || "Payment request failed."
            : "Payment request failed.";
      }
    },

    startRenewPolling() {
      this.renewPollCount = 0;

      if (this.renewPollTimer) clearInterval(this.renewPollTimer);

      this.renewPollTimer = setInterval(async () => {
        this.renewPollCount++;

        if (this.renewPollCount > 20) {
          clearInterval(this.renewPollTimer);
          this.renewLoading = false;
          this.renewError = "Payment confirmation timed out. Please try again.";
          return;
        }

        try {
          const res = await axios.post(`${API_BASE}/payment/stk/query`, {
            checkoutRequestId: this.renewCheckoutId,
          });

          const code = res.data.ResultCode;
          if (code === 0 || code === "0") {
            clearInterval(this.renewPollTimer);
            this.renewLoading = false;
            this.renewMessage = "Payment successful. Your access has been extended.";
            this.showSuccess("Subscription renewed successfully.");
            await this.fetchBureau();
            setTimeout(() => {
              this.dialogRenew = false;
            }, 1500);
          }
        } catch (err) {
          console.warn("renew poll:", err.message);
        }
      }, 3000);
    },

    /* ─────── CANDIDATE ACTIONS ─────── */
    async deleteCandidate(id, status) {
      if (this.isSubscriptionBlocked) {
        this.dialogRenew = true;
        return;
      }

      if (this.isUnavailable(status)) {
        this.showError("Cannot delete unavailable candidate.");
        return;
      }

      if (!id) {
        this.showError("Candidate ID is missing.");
        return;
      }

      this.deleteLoading = true;

      try {
        const res = await axios.delete(
          `${API_BASE}/candidates/delete-candidate/${id}`,
          { params: { user_id: this.uid } }
        );

        if (res.status === 200) {
          this.showSuccess(res.data.message || "Candidate deleted successfully.");
          this.closeCandidateDialog();
          await this.fetchBureauCandidates();
        }
      } catch (err) {
        console.error("deleteCandidate error:", err);

        if (err.response && err.response.status === 402) {
          this.dialogRenew = true;
          this.showError(
            err.response.data.message ||
              "Your subscription has expired. Please renew to continue."
          );
          return;
        }

        const message =
          err.response && err.response.data
            ? err.response.data.message || err.response.data
            : "Failed to delete candidate.";

        this.showError(message);
      } finally {
        this.deleteLoading = false;
      }
    },

    /* ─────── DATA ─────── */
    async fetchBureau() {
      this.loading = true;

      try {
        const res = await axios.get(`${API_BASE}/bureaus/get-bureau/${this.uid}`);

        this.bureau = res.data || {};

        if (this.bureau && this.bureau.bureau_name) {
          this.int_value = this.bureau.bureau_name
            .substring(0, 3)
            .toUpperCase();
        }
      } catch (err) {
        console.error("fetchBureau error:", err);
        this.showError("Failed to load bureau details.");
      } finally {
        this.loading = false;
      }
    },

    async fetchBureauCandidates() {
      this.loading = true;

      try {
        const res = await axios.get(
          `${API_BASE}/candidates/bureau-candidate/${this.uid}`
        );

        this.candidates = Array.isArray(res.data) ? res.data : [];
        this.candidate_count = this.candidates.length;
      } catch (err) {
        console.error("fetchBureauCandidates error:", err);
        this.candidates = [];
        this.candidate_count = 0;
        this.showError("Failed to load candidates.");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.bureau-page {
  background: #0f1020 !important;
  color: white;
  min-height: 100vh;
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

/* MAIN */
.page-shell {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 108px 20px 60px;
}

/* SUBSCRIPTION BANNER */
.sub-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 22px;
  border-radius: 24px;
  margin-bottom: 20px;
  color: #05060f;
  border: 1px solid transparent;
}

.sub-banner-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.sub-banner-icon {
  width: 46px;
  height: 46px;
  min-width: 46px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sub-banner strong {
  display: block;
  font-weight: 950;
  font-size: 1rem;
}

.sub-banner p {
  margin: 4px 0 0;
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.85;
}

.sub-banner-right {
  flex-shrink: 0;
}

.renew-btn {
  background: #05060f !important;
  color: #00ffff !important;
  font-weight: 950;
  text-transform: none;
}

/* Banner variants */
.banner-trial {
  background: linear-gradient(135deg, #00ffff, #00bcd4);
}

.banner-active {
  background: linear-gradient(135deg, #b7f7c5, #6ee7a3);
}

.banner-grace {
  background: linear-gradient(135deg, #ffe28a, #f7c948);
}

.banner-expired {
  background: linear-gradient(135deg, #ffb4b4, #ff7676);
}

/* HERO */
.profile-hero {
  position: relative;
  overflow: hidden;
  border-radius: 34px;
  padding: 34px;
  margin-bottom: 22px;
  background:
    radial-gradient(circle at top left, rgba(0, 255, 255, 0.18), transparent 34%),
    radial-gradient(circle at bottom right, rgba(0, 188, 212, 0.14), transparent 34%),
    linear-gradient(135deg, #15172d, #0b0c18);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.hero-glow {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 180px;
  height: 180px;
  background: rgba(0, 255, 255, 0.18);
  filter: blur(50px);
  pointer-events: none;
}

.profile-main {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  background: #00ffff !important;
  color: #05060f !important;
  font-weight: 950;
  font-size: 1.25rem;
  box-shadow: 0 18px 40px rgba(0, 255, 255, 0.16);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  border-radius: 999px;
  background: #00ffff;
  color: #05060f;
  font-weight: 950;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 12px;
}

.profile-main h1 {
  margin: 0;
  color: white;
  font-size: clamp(2rem, 5vw, 3.8rem);
  line-height: 1.05;
  font-weight: 950;
  letter-spacing: -1px;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 700;
}

/* ACTION CARD */
.action-card {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 28px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.action-icon {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 18px;
  background: #00ffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-card span {
  display: block;
  color: rgba(255, 255, 255, 0.62);
  font-weight: 800;
  font-size: 0.8rem;
  margin-bottom: 5px;
}

.action-card strong {
  display: block;
  font-size: 1.25rem;
  font-weight: 950;
  color: white;
}

.action-card p {
  color: rgba(255, 255, 255, 0.68);
  margin: 4px 0 0;
}

/* STATS */
.stats-row {
  margin-bottom: 18px;
}

.stat-card {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.065);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 18px;
  background: #00ffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card span {
  display: block;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.82rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.stat-card strong {
  color: white;
  font-size: 1.8rem;
  font-weight: 950;
}

/* ACTION BAR */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin: 28px 0 18px;
}

.action-bar h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 950;
}

.action-bar p {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.6;
}

.view-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* BUTTONS */
.primary-btn,
.active-view-btn {
  background: #00ffff !important;
  color: #05060f !important;
  font-weight: 950;
  text-transform: none;
}

.view-btn,
.refresh-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  color: white !important;
  font-weight: 850;
  text-transform: none;
}

.view-profile-btn {
  background: #05060f !important;
  color: #ffffff !important;
  font-weight: 900;
  text-transform: none;
}

.danger-btn {
  background: #05060f !important;
  color: #ff6b6b !important;
  font-weight: 900;
  text-transform: none;
}

.update-btn {
  background: #05060f !important;
  color: #00ffff !important;
  font-weight: 900;
  text-transform: none;
}

/* CONTENT */
.content-panel {
  border-radius: 30px;
  padding: 22px;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.loading-box,
.empty-state {
  min-height: 260px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.055);
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
  font-weight: 950;
}

.empty-state p {
  margin: 0 0 10px;
}

/* GRID */
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

/* TABLE */
.table-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 18px;
  color: #1a1b2b;
}

.table-search {
  max-width: 420px;
  margin-bottom: 18px;
}

.table-search ::v-deep .v-input__slot {
  background: #f7fbff !important;
}

.modern-table {
  border-radius: 18px;
  overflow: hidden;
}

/* ─────── DIALOG (mobile-safe flex layout) ─────── */
.candidate-dialog,
.add-dialog,
.renew-dialog {
  background: #ffffff !important;
  border-radius: 28px !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.candidate-dialog .dialog-header,
.add-dialog .dialog-header,
.renew-dialog .dialog-header {
  flex-shrink: 0;
}

.dialog-header {
  background:
    radial-gradient(circle at top left, rgba(0, 255, 255, 0.18), transparent 38%),
    #05060f;
  color: white;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.dialog-header h2 {
  margin: 0;
  font-weight: 950;
}

.dialog-header p {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.65);
}

.dialog-body {
  padding: 24px;
  color: #1a1b2b;
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}

.dialog-profile {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 20px;
  background: #f7fbff;
  margin-bottom: 20px;
}

.dialog-profile h3 {
  margin: 0;
  font-weight: 950;
}

.dialog-profile p {
  margin: 5px 0 0;
  color: rgba(26, 27, 43, 0.62);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  padding: 16px;
  border-radius: 18px;
  background: #f7fbff;
}

.detail-item span {
  display: block;
  color: rgba(26, 27, 43, 0.55);
  font-size: 0.78rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.detail-item strong {
  color: #1a1b2b;
  font-weight: 950;
}

.success-text {
  color: #1fa463 !important;
}

.danger-text {
  color: #e53935 !important;
}

.employer-box {
  margin-top: 18px;
  padding: 16px;
  border-radius: 20px;
  background: #eef6ff;
}

.employer-box h4 {
  margin: 0 0 10px;
  font-weight: 950;
}

.employer-box p {
  margin: 6px 0;
  color: rgba(26, 27, 43, 0.75);
}

.delete-confirm-box {
  margin-top: 20px;
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 20px;
  background: rgba(244, 67, 54, 0.08);
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.delete-confirm-box h3 {
  margin: 0 0 8px;
  color: #1a1b2b;
  font-weight: 950;
}

.delete-confirm-box p {
  color: rgba(26, 27, 43, 0.68);
  margin: 0 0 14px;
  line-height: 1.6;
}

.delete-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.dialog-actions {
  background: #05060f;
  padding: 18px 24px;
  flex-shrink: 0;
}

/* EDIT MODE */
.edit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.edit-grid ::v-deep .v-input__slot {
  background: #f7fbff !important;
}

.edit-grid ::v-deep input,
.edit-grid ::v-deep .v-select__selection {
  color: #1a1b2b !important;
  font-weight: 700;
}

.edit-grid ::v-deep .v-label {
  color: rgba(26, 27, 43, 0.7) !important;
  font-weight: 700;
}

.edit-age {
  grid-column: 1 / -1;
  padding: 10px 16px;
  border-radius: 14px;
  background: #eef6ff;
  color: rgba(26, 27, 43, 0.75);
  font-weight: 700;
  font-size: 0.9rem;
}

.edit-age strong {
  color: #05060f;
  font-weight: 950;
}

/* RENEW DIALOG */
.renew-summary {
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 20px;
  background: #f7fbff;
}

.renew-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 800;
}

.renew-row span {
  color: rgba(26, 27, 43, 0.62);
}

.renew-row strong {
  color: #1a1b2b;
  font-weight: 950;
}

.amount-text {
  color: #00bcd4 !important;
  font-size: 1.15rem;
}

.renew-label {
  display: block;
  font-weight: 900;
  font-size: 0.85rem;
  margin-bottom: 8px;
  color: #1a1b2b;
}

.plans-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 16px;
  color: #1a1b2b;
  font-weight: 800;
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

/* MOBILE */
@media (max-width: 760px) {
  .page-shell {
    padding: 98px 14px 40px;
  }

  .brand-sub {
    display: none;
  }

  .sub-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .sub-banner-right {
    width: 100%;
  }

  .renew-btn {
    width: 100%;
  }

  .profile-hero {
    padding: 24px;
    border-radius: 26px;
  }

  .profile-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-meta {
    display: block;
  }

  .profile-meta span {
    display: block;
    margin-bottom: 4px;
  }

  .action-card {
    margin-top: 16px;
  }

  .action-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .view-actions {
    width: 100%;
  }

  .view-actions .v-btn {
    flex: 1;
  }

  .candidate-grid {
    grid-template-columns: 1fr;
  }

  .candidate-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .view-profile-btn,
  .danger-btn,
  .update-btn {
    width: 100%;
  }

  .details-grid,
  .edit-grid {
    grid-template-columns: 1fr;
  }

  .edit-age {
    grid-column: auto;
  }

  .candidate-dialog,
  .add-dialog,
  .renew-dialog {
    max-height: 92vh;
    border-radius: 20px !important;
  }

  .dialog-header {
    padding: 18px;
  }

  .dialog-body {
    padding: 18px;
  }

  .dialog-actions {
    flex-wrap: wrap;
    gap: 8px;
    padding: 14px 18px;
  }

  .dialog-actions .v-btn {
    flex: 1 1 calc(50% - 4px);
    min-width: 0;
    margin: 0 !important;
    height: 40px !important;
    font-size: 0.82rem;
  }

  .dialog-actions .v-btn:last-child {
    flex: 1 1 100%;
  }
}
</style>