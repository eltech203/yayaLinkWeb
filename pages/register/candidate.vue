<template>
  <v-app class="candidate-register-page">
    <!-- NAVBAR -->
    <v-app-bar
      app
      fixed
      dark
      height="76"
      elevation="0"
      class="top-nav"
    >
      <v-btn icon class="mr-2" to="/">
        <v-icon color="cyan accent-2">mdi-arrow-left</v-icon>
      </v-btn>

      <nuxt-link to="/" class="brand-link">
        <div class="brand-wrap">
          <div class="brand-icon">Y</div>

          <div>
            <div class="brand-name">YayaLink</div>
            <div class="brand-sub">Candidate Registration</div>
          </div>
        </div>
      </nuxt-link>

      <v-spacer />

      <v-btn icon to="/">
        <v-icon color="white">mdi-home-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <div class="page-shell">
        <v-row align="start">
          <!-- FORM SIDE -->
          <v-col cols="12" md="8">
            <v-card class="form-card" elevation="0">
              <div class="form-header">
                <div class="form-badge">
                  <v-icon small color="black">mdi-account-plus-outline</v-icon>
                  Add Candidate
                </div>

                <h1>Register a House Help Candidate</h1>

                <p>
                  Add candidate details, location, experience, salary expectations,
                  and bureau contact information.
                </p>
              </div>

              <v-alert
                v-if="bureau"
                dense
                outlined
                type="info"
                class="bureau-alert"
              >
                Candidate will be linked to
                <strong>{{ bureau.bureau_name }}</strong>
              </v-alert>

              <v-alert
                v-if="!uid"
                dense
                outlined
                type="warning"
                class="bureau-alert"
              >
                Please login first before adding a candidate.
              </v-alert>

              <v-form ref="candidateForm" @submit.prevent="submitCandidate">
                <!-- PERSONAL INFO -->
                <div class="section-title-row">
                  <div class="section-icon">
                    <v-icon color="black">mdi-account-outline</v-icon>
                  </div>

                  <div>
                    <h2>Personal Information</h2>
                    <p>Basic candidate details.</p>
                  </div>
                </div>

                <v-row>
                  <v-col cols="12" md="6">
                    <label class="input-label">Full Name</label>
                    <v-text-field
                      v-model="form.candidate_name"
                      outlined
                      rounded
                      dense
                      placeholder="Enter full name"
                      prepend-inner-icon="mdi-account-outline"
                      class="clean-input"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <label class="input-label">Phone Number</label>
                    <v-text-field
                      v-model="form.mobile_no"
                      outlined
                      rounded
                      dense
                      placeholder="07XXXXXXXX"
                      prepend-inner-icon="mdi-phone-outline"
                      class="clean-input"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <label class="input-label">Next of Kin Phone</label>
                    <v-text-field
                      v-model="form.kin_phone_no"
                      outlined
                      rounded
                      dense
                      placeholder="07XXXXXXXX"
                      prepend-inner-icon="mdi-phone-plus-outline"
                      class="clean-input"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <label class="input-label">Gender</label>
                    <v-select
                      v-model="form.gender"
                      :items="items_gender"
                      outlined
                      rounded
                      dense
                      placeholder="Select gender"
                      prepend-inner-icon="mdi-gender-male-female"
                      class="clean-input"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <label class="input-label">Date of Birth</label>
                    <v-text-field
                      v-model="form.dob"
                      type="date"
                      outlined
                      rounded
                      dense
                      prepend-inner-icon="mdi-calendar-outline"
                      class="clean-input"
                      @change="calculatedAge"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="age-box">
                      <span>Calculated Age</span>
                      <strong>{{ form.age || "-" }} years</strong>
                    </div>
                  </v-col>
                </v-row>

                <!-- LOCATION -->
                <div class="section-title-row mt-6">
                  <div class="section-icon">
                    <v-icon color="black">mdi-map-marker-radius-outline</v-icon>
                  </div>

                  <div>
                    <h2>Location Details</h2>
                    <p>Where the candidate is based.</p>
                  </div>
                </div>

                <v-row>
                  <v-col cols="12" md="6">
                    <label class="input-label">County</label>
                    <v-autocomplete
                      v-model="form.county"
                      :items="counties"
                      :loading="loadingCounties"
                      clearable
                      outlined
                      rounded
                      dense
                      hide-no-data
                      placeholder="Search or select county"
                      prepend-inner-icon="mdi-map-marker-outline"
                      class="clean-input"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <label class="input-label">Ward</label>
                    <v-text-field
                      v-model="form.ward"
                      outlined
                      rounded
                      dense
                      placeholder="Example: Westlands"
                      prepend-inner-icon="mdi-map-outline"
                      class="clean-input"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <label class="input-label">Village / Estate</label>
                    <v-text-field
                      v-model="form.village"
                      outlined
                      rounded
                      dense
                      placeholder="Example: Westlands"
                      prepend-inner-icon="mdi-home-city-outline"
                      class="clean-input"
                    />
                  </v-col>
                </v-row>

                <!-- WORK DETAILS -->
                <div class="section-title-row mt-6">
                  <div class="section-icon">
                    <v-icon color="black">mdi-briefcase-outline</v-icon>
                  </div>

                  <div>
                    <h2>Work Details</h2>
                    <p>Experience and expected salary.</p>
                  </div>
                </div>

                <v-row>
                  <v-col cols="12" md="4">
                    <label class="input-label">Experience</label>
                    <v-text-field
                      v-model="form.experience"
                      type="number"
                      outlined
                      rounded
                      dense
                      placeholder="Example: 5"
                      suffix="yrs"
                      prepend-inner-icon="mdi-briefcase-clock-outline"
                      class="clean-input"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <label class="input-label">Expected Salary</label>
                    <v-text-field
                      v-model="form.salary"
                      type="number"
                      outlined
                      rounded
                      dense
                      placeholder="Example: 7000"
                      prefix="Ksh"
                      prepend-inner-icon="mdi-cash"
                      class="clean-input"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <label class="input-label">Salary Period</label>
                    <v-select
                      v-model="form.salary_period"
                      :items="items_salary_period"
                      outlined
                      rounded
                      dense
                      placeholder="Select period"
                      prepend-inner-icon="mdi-calendar-clock"
                      class="clean-input"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <label class="input-label">Working Status</label>
                    <v-select
                      v-model="form.working_status"
                      :items="items_working_status"
                      outlined
                      rounded
                      dense
                      placeholder="Select status"
                      prepend-inner-icon="mdi-check-circle-outline"
                      class="clean-input"
                    />
                  </v-col>
                </v-row>

                <!-- BUREAU DETAILS -->
                <div class="section-title-row mt-6">
                  <div class="section-icon">
                    <v-icon color="black">mdi-domain</v-icon>
                  </div>

                  <div>
                    <h2>Bureau Details</h2>
                    <p>Candidate will appear under your bureau.</p>
                  </div>
                </div>

                <v-row>
                  <v-col cols="12" md="6">
                    <label class="input-label">Bureau Name</label>
                    <v-text-field
                      v-model="form.bureau_name"
                      outlined
                      rounded
                      dense
                      readonly
                      placeholder="Bureau name"
                      prepend-inner-icon="mdi-domain"
                      class="clean-input"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <label class="input-label">Bureau Number</label>
                    <v-text-field
                      v-model="form.bureau_no"
                      outlined
                      rounded
                      dense
                      placeholder="07XXXXXXXX"
                      prepend-inner-icon="mdi-phone-check-outline"
                      class="clean-input"
                    />
                  </v-col>
                </v-row>

                <div class="submit-area">
                  <v-btn
                    block
                    x-large
                    rounded
                    class="submit-btn"
                    :loading="submitLoading"
                    @click="submitCandidate"
                  >
                    Add Candidate
                    <v-icon right>mdi-account-plus-outline</v-icon>
                  </v-btn>
                </div>
              </v-form>
            </v-card>
          </v-col>

          <!-- SIDE PANEL -->
          <v-col cols="12" md="4">
            <v-card class="side-card" elevation="0">
              <div class="side-glow"></div>

              <div class="side-content">
                <div class="side-badge">
                  Bureau Dashboard
                </div>

                <h2>Grow your candidate database.</h2>

                <p>
                  Add verified candidates with clear details so employers can find
                  and contact the right person faster.
                </p>

                <div class="bureau-profile" v-if="bureau">
                  <v-avatar size="58" class="bureau-avatar">
                    {{ int_value || "YA" }}
                  </v-avatar>

                  <div>
                    <strong>{{ bureau.bureau_name }}</strong>
                    <span>{{ bureau.phone_no || form.bureau_no || "No phone set" }}</span>
                  </div>
                </div>

                <div class="tips-list">
                  <div class="tip-item">
                    <v-icon color="cyan accent-2">mdi-check-decagram</v-icon>
                    <span>Use real candidate details</span>
                  </div>

                  <div class="tip-item">
                    <v-icon color="cyan accent-2">mdi-phone-check-outline</v-icon>
                    <span>Confirm bureau contact number</span>
                  </div>

                  <div class="tip-item">
                    <v-icon color="cyan accent-2">mdi-map-marker-check-outline</v-icon>
                    <span>Add accurate county and ward</span>
                  </div>

                  <div class="tip-item">
                    <v-icon color="cyan accent-2">mdi-cash-check</v-icon>
                    <span>Set realistic salary expectations</span>
                  </div>
                </div>

                <v-img
                  :src="can"
                  contain
                  height="260"
                  class="side-image"
                />
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-main>

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
      v-model="snackbar2"
      :timeout="4000"
      color="red"
      bottom
      centered
    >
      {{ snackbarText2 }}
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from "axios";
import can from "@/assets/can.png";

const API_BASE = "https://yayalinkserver-production-edaa.up.railway.app/api";

export default {
  data() {
    return {
      can,

      items_gender: ["Female", "Male"],
      items_salary_period: ["Daily", "Weekly", "Monthly"],
      items_working_status: ["available", "Unavailable"],

      snackbar: false,
      snackbarText: "",

      snackbar2: false,
      snackbarText2: "",

      loading: false,
      loadingCounties: false,
      submitLoading: false,

      uid: "",
      bureau: null,
      counties: [],
      int_value: "",

      form: {
        candidate_id: "",
        uid: "",
        user_id: "",
        candidate_name: "",
        age: "",
        gender: "",
        dob: "",
        mobile_no: "",
        kin_phone_no: "",
        next_of_kin: "",
        residence: "",
        village: "",
        ward: "",
        county: "",
        bureau_name: "",
        bureau_no: "",
        experience: "",
        salary: "",
        salary_period: "Monthly",
        working_status: "available",
        status: "Available",
        device_token: "",
        profile_image: "",
      },
    };
  },

  async mounted() {
    this.generateCandidateId();
    this.checkUser();

    await this.fetchCounties();

    if (this.uid) {
      await this.fetchBureau();
    }
  },

  methods: {
    generateCandidateId() {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        this.form.candidate_id = crypto.randomUUID();
      } else {
        this.form.candidate_id = `CAN-${Date.now()}-${Math.floor(
          Math.random() * 10000
        )}`;
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

    checkUser() {
      if (this.$fire && this.$fire.auth && this.$fire.auth.currentUser) {
        this.uid = this.$fire.auth.currentUser.uid;
        this.form.uid = this.uid;
      } else {
        this.uid = "";
        this.showError("Please login first.");
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

        console.log("counties", this.counties);
      } catch (err) {
        console.error("fetchCounties error:", err);
        this.showError("Failed to load counties.");
      } finally {
        this.loadingCounties = false;
      }
    },

    async fetchBureau() {
      this.loading = true;

      try {
        const res = await axios.get(`${API_BASE}/bureaus/get-bureau/${this.uid}`);

        this.bureau = res.data;

        if (this.bureau) {
          this.form.user_id = this.bureau.user_id || this.uid;
          this.form.bureau_name = this.bureau.bureau_name || "";
          this.form.bureau_no =
            this.bureau.bureau_no ||
            this.bureau.phone_no ||
            this.form.bureau_no ||
            "";

          if (this.bureau.bureau_name) {
            this.int_value = this.bureau.bureau_name
              .substring(0, 3)
              .toUpperCase();
          }
        }

        console.log("bureau", this.bureau);
      } catch (err) {
        console.error("fetchBureau error:", err);
        this.showError("Failed to load bureau details.");
      } finally {
        this.loading = false;
      }
    },

    calculatedAge() {
      if (!this.form.dob) {
        this.form.age = "";
        return;
      }

      const today = new Date();
      const dob = new Date(this.form.dob);

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      this.form.age = age;
    },

    validateForm() {
      if (!this.uid) {
        this.showError("Please login first.");
        return false;
      }

      if (!this.form.candidate_name) {
        this.showError("Provide candidate full name.");
        return false;
      }

      if (!this.form.mobile_no) {
        this.showError("Provide candidate phone number.");
        return false;
      }

      if (!this.form.gender) {
        this.showError("Select gender.");
        return false;
      }

      if (!this.form.dob || !this.form.age) {
        this.showError("Provide date of birth.");
        return false;
      }

      if (Number(this.form.age) < 18) {
        this.showError("Age should be 18 and above.");
        return false;
      }

      if (!this.form.county) {
        this.showError("Select county.");
        return false;
      }

      if (!this.form.bureau_name) {
        this.showError("Bureau details are missing.");
        return false;
      }

      if (!this.form.bureau_no) {
        this.showError("Provide bureau number.");
        return false;
      }

      if (!this.form.experience) {
        this.showError("Provide candidate experience.");
        return false;
      }

      if (!this.form.salary) {
        this.showError("Provide expected salary.");
        return false;
      }

      if (!this.form.salary_period) {
        this.showError("Select salary period.");
        return false;
      }

      return true;
    },

    async submitCandidate() {
      this.form.uid = this.uid;

      if (!this.validateForm()) return;

      this.submitLoading = true;

      try {
        await axios.post(`${API_BASE}/candidates/register`, this.form);

        this.showSuccess("Candidate added successfully.");

        this.resetForm();
      } catch (err) {
        console.error("submitCandidate error:", err);

        const message =
          err.response && err.response.data
            ? err.response.data.message || err.response.data
            : "Failed to add candidate.";

        this.showError(message);
      } finally {
        this.submitLoading = false;
      }
    },

    resetForm() {
      const bureauName = this.form.bureau_name;
      const bureauNo = this.form.bureau_no;
      const userId = this.form.user_id;

      this.form = {
        candidate_id: "",
        uid: this.uid,
        user_id: userId,
        candidate_name: "",
        age: "",
        gender: "",
        dob: "",
        mobile_no: "",
        kin_phone_no: "",
        next_of_kin: "",
        residence: "",
        village: "",
        ward: "",
        county: "",
        bureau_name: bureauName,
        bureau_no: bureauNo,
        experience: "",
        salary: "",
        salary_period: "Monthly",
        working_status: "available",
        status: "Available",
        device_token: "",
        profile_image: "",
      };

      this.generateCandidateId();
    },
  },
};
</script>

<style scoped>
.candidate-register-page {
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

/* LAYOUT */
.page-shell {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 108px 20px 56px;
}

.form-card {
  background: #ffffff !important;
  color: #1a1b2b !important;
  border-radius: 34px !important;
  padding: 30px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25) !important;
}

.form-header {
  margin-bottom: 24px;
}

.form-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(0, 188, 212, 0.15);
  color: #05060f;
  font-weight: 950;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 18px;
}

.form-header h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.05;
  font-weight: 950;
  letter-spacing: -1px;
  margin: 0 0 12px;
}

.form-header p {
  color: rgba(26, 27, 43, 0.66);
  line-height: 1.75;
  margin: 0;
}

.bureau-alert {
  border-radius: 18px;
  margin-bottom: 24px;
}

/* SECTION TITLE */
.section-title-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 20px;
}

.section-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 14px;
  background: #00ffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title-row h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 950;
  color: #1a1b2b;
}

.section-title-row p {
  margin: 4px 0 0;
  color: rgba(26, 27, 43, 0.6);
  font-size: 0.9rem;
}

/* INPUTS */
.input-label {
  display: block;
  color: #1a1b2b;
  font-weight: 900;
  font-size: 0.82rem;
  margin-bottom: 8px;
}

.clean-input ::v-deep .v-input__slot {
  background: #f7fbff !important;
}

.clean-input ::v-deep input {
  color: #1a1b2b !important;
  font-weight: 750;
}

.clean-input ::v-deep input::placeholder {
  color: rgba(26, 27, 43, 0.45) !important;
}

.clean-input ::v-deep .v-icon {
  color: #00bcd4 !important;
}

.clean-input ::v-deep .v-select__selection {
  color: #1a1b2b !important;
  font-weight: 800;
}

.age-box {
  height: 40px;
  min-height: 40px;
  margin-top: 30px;
  border-radius: 999px;
  padding: 0 18px;
  background: #eef6ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.age-box span {
  color: rgba(26, 27, 43, 0.58);
  font-weight: 800;
  font-size: 0.85rem;
}

.age-box strong {
  color: #1a1b2b;
  font-weight: 950;
}

.submit-area {
  margin-top: 28px;
}

.submit-btn {
  background: #05060f !important;
  color: #00ffff !important;
  font-weight: 950;
  text-transform: none;
}

/* SIDE CARD */
.side-card {
  position: sticky;
  top: 100px;
  overflow: hidden;
  min-height: 680px;
  border-radius: 34px !important;
  padding: 30px;
  color: white !important;
  background:
    radial-gradient(circle at top left, rgba(0, 255, 255, 0.22), transparent 36%),
    radial-gradient(circle at bottom right, rgba(0, 188, 212, 0.16), transparent 36%),
    linear-gradient(135deg, #15172d, #0b0c18) !important;
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.side-glow {
  position: absolute;
  top: -80px;
  right: -80px;
  width: 220px;
  height: 220px;
  background: rgba(0, 255, 255, 0.2);
  filter: blur(60px);
  pointer-events: none;
}

.side-content {
  position: relative;
  z-index: 2;
}

.side-badge {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(0, 255, 255, 0.12);
  color: #00ffff;
  border: 1px solid rgba(0, 255, 255, 0.24);
  font-size: 0.78rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 18px;
}

.side-card h2 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1.08;
  font-weight: 950;
  letter-spacing: -1px;
  margin-bottom: 16px;
}

.side-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
}

.bureau-profile {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.09);
  margin: 24px 0;
}

.bureau-avatar {
  background: #00ffff !important;
  color: #05060f !important;
  font-weight: 950;
}

.bureau-profile strong {
  display: block;
  color: white;
  font-weight: 950;
}

.bureau-profile span {
  display: block;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.85rem;
  margin-top: 3px;
}

.tips-list {
  display: grid;
  gap: 14px;
  margin-top: 24px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-weight: 800;
}

.side-image {
  margin-top: 30px;
}

/* MOBILE */
@media (max-width: 960px) {
  .page-shell {
    padding: 100px 14px 40px;
  }

  .form-card {
    padding: 24px;
    border-radius: 28px !important;
  }

  .side-card {
    position: relative;
    top: auto;
    min-height: auto;
    border-radius: 28px !important;
  }
}

@media (max-width: 520px) {
  .brand-sub {
    display: none;
  }

  .age-box {
    margin-top: 0;
  }
}
</style>