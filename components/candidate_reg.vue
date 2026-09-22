<template>
  <div class="candidate-reg">
    <v-row>
      <v-col cols="12" md="12" class="text-center">
        <v-card elevation="0" class="reg-card">
          <v-tabs color="black" center-active :show-arrows="true" class="text-center">
            <v-tab v-show="!auth_state" value="two">
              <span>Create a Candidate Account</span>
            </v-tab>
          </v-tabs>

          <v-row>
            <v-col>
              <div class="container">
                <div class="row">
                  <form @submit.prevent="submitCandidate">
                    <v-text-field
                      v-model="form.candidate_name"
                      placeholder="Full Name"
                      required
                      outlined
                      rounded
                    />

                    <v-text-field
                      v-model="form.mobile_no"
                      placeholder="Phone"
                      required
                      outlined
                      rounded
                    />

                    <v-text-field
                      v-model="form.kin_phone_no"
                      placeholder="Next of Kin Phone"
                      outlined
                      rounded
                    />

                    <v-text-field
                      v-model="form.next_of_kin"
                      placeholder="Next of Kin Name"
                      outlined
                      rounded
                    />

                    <v-select
                      v-model="form.gender"
                      :items="items_gender"
                      label="Gender"
                      required
                      outlined
                      rounded
                    />

                    <v-select
                      v-model="form.salary_period"
                      :items="items_salary_period"
                      label="Salary Period"
                      required
                      outlined
                      rounded
                    />

                    <v-text-field
                      v-model="form.dob"
                      placeholder="Date of Birth"
                      type="date"
                      outlined
                      rounded
                      @change="calculatedAge"
                    />

                    <p class="age-display">
                      Age: <strong>{{ form.age || 0 }}</strong> years
                    </p>

                    <v-autocomplete
                      v-model="form.county"
                      :items="counties"
                      :loading="loadingCounties"
                      outlined
                      rounded
                      hide-no-data
                      hide-details
                      label="Provide county"
                      class="mb-4"
                    />

                    <v-text-field
                      v-model="form.ward"
                      placeholder="Ward"
                      outlined
                      rounded
                    />

                    <v-text-field
                      v-model="form.village"
                      placeholder="Village"
                      outlined
                      rounded
                    />

                    <v-text-field
                      v-model="form.bureau_name"
                      placeholder="Bureau Name"
                      outlined
                      rounded
                      disabled
                    />

                    <v-text-field
                      v-model="form.bureau_no"
                      placeholder="Bureau Number"
                      outlined
                      rounded
                    />

                    <v-text-field
                      v-model="form.experience"
                      placeholder="Experience (years)"
                      outlined
                      rounded
                    />

                    <v-text-field
                      v-model="form.salary"
                      placeholder="Salary"
                      type="number"
                      outlined
                      rounded
                    />

                    <v-btn
                      type="submit"
                      width="100%"
                      color="black"
                      class="submit-btn"
                      :loading="submitting"
                      :disabled="submitting"
                    >
                      Add Candidate
                    </v-btn>
                  </form>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

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
    </v-row>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE = "https://yayalinkserver-production-cc96.up.railway.app/api";

export default {
  name: "CandidateReg",

  data() {
    return {
      items_gender: ["Female", "Male"],
      items_salary_period: ["Daily", "Weekly", "Monthly"],

      form: {
        candidate_id: this.generateUUID(),
        user_id: "",
        candidate_name: "",
        age: "",
        gender: "Female",
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

      uid: null,
      auth_state: false,

      counties: [],
      loadingCounties: false,

      submitting: false,

      snackbar: false,
      snackbarText: "",

      snackbar2: false,
      snackbarText2: "",
    };
  },

  async mounted() {
    this.checkUser();

    const jobs = [this.fetchCounties()];

    if (this.uid) {
      jobs.push(this.fetchBureau());
    }

    await Promise.all(jobs);
  },

  methods: {
    /* ─────────── UTIL ─────────── */

    generateUUID() {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // Fallback for older browsers
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
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

    /* ─────────── DATA ─────────── */

    async fetchCounties() {
      this.loadingCounties = true;

      try {
        const res = await axios.get(`${API_BASE}/counties/get-counties`);
        const data = Array.isArray(res.data) ? res.data : [];

        // Normalize: [{ id, name }] → ["Baringo", "Bomet", ...]
        this.counties = data
          .map((c) => {
            if (typeof c === "string") return c;
            return c.name || c.county || c.county_name || "";
          })
          .filter(Boolean);
      } catch (err) {
        console.error("fetchCounties error:", err);
        this.showError("Failed to load counties.");
      } finally {
        this.loadingCounties = false;
      }
    },

    async fetchBureau() {
      try {
        const res = await axios.get(`${API_BASE}/bureaus/get-bureau/${this.uid}`);
        const bureau = res.data || {};

        this.form.bureau_name = bureau.bureau_name || "";
        this.form.user_id = bureau.user_id || this.uid;

        console.log("Bureau loaded:", bureau);
      } catch (err) {
        console.error("fetchBureau error:", err);
        // Not fatal — user can still fill form manually
      }
    },

    /* ─────────── AGE ─────────── */

    calculatedAge() {
      if (!this.form.dob) {
        this.form.age = "";
        return;
      }

      const today = new Date();
      const dob = new Date(this.form.dob);

      if (Number.isNaN(dob.getTime())) {
        this.form.age = "";
        return;
      }

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      this.form.age = Number(age);
    },

    /* ─────────── SUBMIT ─────────── */

    async submitCandidate() {
      // Ensure user_id is populated — required by the backend subscription guard
      this.form.user_id = this.uid;

      if (!this.form.candidate_name) {
        this.showError("Provide the candidate's full name.");
        return;
      }

      if (!this.form.mobile_no) {
        this.showError("Provide the candidate's phone number.");
        return;
      }

      if (!this.form.county) {
        this.showError("Select a county.");
        return;
      }

      if (this.form.age === "" || this.form.age === null) {
        this.showError("Provide the Date of Birth.");
        return;
      }

      if (Number(this.form.age) < 18) {
        this.showError("Age should be 18 and above.");
        return;
      }

      this.submitting = true;

      try {
        const res = await axios.post(
          `${API_BASE}/candidates/register`,
          this.form
        );

        this.showSuccess(
          res.data.message || "Candidate added successfully."
        );

        this.$emit("candidate-added", res.data);

        // Reset the form so the next add starts fresh
        this.resetForm();
      } catch (err) {
        console.error("submitCandidate error:", err);

        const status = err.response ? err.response.status : 0;
        const data = err.response ? err.response.data : null;
        const message =
          (data && (data.message || data.error)) ||
          "Failed to add candidate. Please try again.";

        // 402 → subscription expired → tell parent to open renewal
        if (status === 402) {
          this.showError(message);
          this.$emit("subscription-expired", data);
          return;
        }

        // 400 → validation error from backend
        if (status === 400) {
          this.showError(message);
          return;
        }

        this.showError(message);
      } finally {
        this.submitting = false;
      }
    },

    resetForm() {
      this.form = {
        candidate_id: this.generateUUID(),
        user_id: this.uid || "",
        candidate_name: "",
        age: "",
        gender: "Female",
        dob: "",
        mobile_no: "",
        kin_phone_no: "",
        next_of_kin: "",
        residence: "",
        village: "",
        ward: "",
        county: "",
        bureau_name: this.form.bureau_name, // keep bureau context
        bureau_no: this.form.bureau_no,
        experience: "",
        salary: "",
        salary_period: "Monthly",
        working_status: "available",
        status: "Available",
        device_token: "",
        profile_image: "",
      };
    },

    /* ─────────── FEEDBACK ─────────── */

    showSuccess(message) {
      this.snackbarText = message || "Success";
      this.snackbar = true;
    },

    showError(message) {
      this.snackbarText2 = message || "Something went wrong.";
      this.snackbar2 = true;
    },
  },
};
</script>

<style scoped>
.candidate-reg {
  width: 100%;
}

.reg-card {
  background: transparent !important;
  padding: 0;
}

.reg-card ::v-deep .v-tabs {
  margin-bottom: 18px;
}

.reg-card ::v-deep .v-tab {
  font-weight: 900;
  text-transform: none;
  letter-spacing: 0.2px;
  color: #05060f !important;
}

.container {
  width: 100%;
}

.row {
  display: block;
}

form {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 4px 8px;
}

form ::v-deep .v-input__slot {
  background: #ffffff !important;
}

form ::v-deep input,
form ::v-deep .v-select__selection {
  color: #1a1b2b !important;
  font-weight: 700;
}

form ::v-deep input::placeholder {
  color: rgba(26, 27, 43, 0.5) !important;
  font-weight: 600;
}

form ::v-deep .v-label {
  color: rgba(26, 27, 43, 0.65) !important;
  font-weight: 700;
}

.age-display {
  margin: -4px 0 14px;
  font-size: 0.9rem;
  color: rgba(26, 27, 43, 0.7);
  font-weight: 700;
}

.age-display strong {
  color: #05060f;
  font-weight: 950;
}

.submit-btn {
  background: #05060f !important;
  color: #00ffff !important;
  font-weight: 950;
  text-transform: none;
  height: 48px !important;
  letter-spacing: 0.3px;
}

.submit-btn:hover {
  background: #0f1020 !important;
}

/* Mobile */
@media (max-width: 760px) {
  form {
    padding: 0;
  }
}
</style>