<template>
  <v-app class="candidate-page">
    <!-- TOP NAV -->
    <v-app-bar
      app
      fixed
      dark
      height="76"
      elevation="0"
      class="top-nav"
    >
      <v-btn icon class="mr-2" to="/selection">
        <v-icon color="cyan accent-2">mdi-arrow-left</v-icon>
      </v-btn>

      <div>
        <div class="page-title">Candidate Information</div>
        <div class="page-subtitle">Review candidate details</div>
      </div>

      <v-spacer />

      <v-btn icon to="/">
        <v-icon color="white">mdi-home-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <div class="page-shell">
        <!-- LOADING -->
        <div v-if="loading && !candidate" class="loading-state">
          <v-progress-circular
            indeterminate
            color="cyan accent-2"
            size="46"
          />
          <p>Loading candidate information...</p>
        </div>

        <!-- CONTENT -->
        <div v-else-if="candidate" class="content-wrap">
          <!-- CANDIDATE HERO CARD -->
          <section class="hero-card">
            <div class="hero-glow"></div>

            <v-row align="center">
              <v-col cols="12" md="7">
                <div class="profile-main">
                  <v-avatar size="82" class="candidate-avatar">
                    {{ int_value }}
                  </v-avatar>

                  <div>
                    <div class="verified-badge">
                      <v-icon small color="black">mdi-check-decagram</v-icon>
                      Verified Candidate
                    </div>

                    <h1>{{ candidate.candidate_name || "Unnamed Candidate" }}</h1>

                    <div class="candidate-meta">
                      <span>{{ candidate.gender || "Not specified" }}</span>
                      <span>•</span>
                      <span>{{ candidate.age || "-" }} yrs</span>
                      <span>•</span>
                      <span>{{ candidate.county || "County not set" }}</span>
                    </div>

                    <div class="chip-row">
                      <v-chip small class="soft-chip">
                        <v-icon left small>mdi-briefcase-outline</v-icon>
                        {{ candidate.experience || 0 }} yrs experience
                      </v-chip>

                      <v-chip small class="soft-chip">
                        <v-icon left small>mdi-map-marker-outline</v-icon>
                        {{ candidate.county || "N/A" }}
                      </v-chip>

                      <v-chip
                        small
                        outlined
                        :color="candidate.working_status === 'Available' ? 'green' : 'cyan accent-2'"
                      >
                        {{ candidate.working_status || "Available" }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="5">
                <div class="salary-card">
                  <span>Expected Salary</span>

                  <strong>
                    Ksh {{ numeral(candidate.salary || 0).format("0,0") }}
                  </strong>

                  <p>
                    per {{ candidate.salary_period || "month" }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </section>

          <!-- BODY -->
          <v-row>
            <!-- LEFT SIDE -->
            <v-col cols="12" md="7">
              <!-- INSTRUCTIONS -->
              <v-card class="info-card" elevation="0">
                <div class="section-heading">
                  <v-icon color="cyan accent-2">mdi-information-outline</v-icon>

                  <div>
                    <h2>How to Proceed</h2>
                    <p>Follow these steps before confirming the deal.</p>
                  </div>
                </div>

                <div class="steps-list">
                  <div class="step-item">
                    <div class="step-number">1</div>
                    <p>
                      Click <strong>Call Agent/Bureau</strong> to discuss the
                      candidate and arrange an interview directly.
                    </p>
                  </div>

                  <div class="step-item">
                    <div class="step-number">2</div>
                    <p>
                      Once agreed, click <strong>Confirm Deal</strong>.
                    </p>
                  </div>

                  <div class="step-item">
                    <div class="step-number">3</div>
                    <p>
                      If the candidate is not suitable, click
                      <strong>Change Preference</strong> and select another candidate.
                    </p>
                  </div>
                </div>

                <div class="notice-box">
                  <v-icon color="orange">mdi-alert-circle-outline</v-icon>

                  <p>
                    Clicking <strong>Confirm Deal</strong> removes this candidate
                    from the available list so another employer cannot select them.
                    Your access remains valid for your paid period.
                  </p>
                </div>
              </v-card>

              <!-- CANDIDATE SUMMARY -->
              <v-card class="info-card mt-5" elevation="0">
                <div class="section-heading">
                  <v-icon color="cyan accent-2">mdi-account-details-outline</v-icon>

                  <div>
                    <h2>Candidate Summary</h2>
                    <p>Quick profile overview.</p>
                  </div>
                </div>

                <div class="details-grid">
                  <div class="detail-item">
                    <span>Name</span>
                    <strong>{{ candidate.candidate_name || "N/A" }}</strong>
                  </div>

                  <div class="detail-item">
                    <span>Gender</span>
                    <strong>{{ candidate.gender || "N/A" }}</strong>
                  </div>

                  <div class="detail-item">
                    <span>Age</span>
                    <strong>{{ candidate.age || "N/A" }} yrs</strong>
                  </div>

                  <div class="detail-item">
                    <span>County</span>
                    <strong>{{ candidate.county || "N/A" }}</strong>
                  </div>

                  <div class="detail-item">
                    <span>Experience</span>
                    <strong>{{ candidate.experience || 0 }} yrs</strong>
                  </div>

                  <div class="detail-item">
                    <span>Status</span>
                    <strong class="status-text">
                      {{ candidate.working_status || "Available" }}
                    </strong>
                  </div>
                </div>
              </v-card>
            </v-col>

            <!-- RIGHT SIDE -->
            <v-col cols="12" md="5">
              <!-- BUREAU DETAILS -->
              <v-card class="bureau-card" elevation="0">
                <div class="bureau-top">
                  <v-avatar size="58" class="bureau-avatar">
                    <v-icon color="black">mdi-domain</v-icon>
                  </v-avatar>

                  <div>
                    <h2>Bureau Details</h2>
                    <p>Contact the bureau managing this candidate.</p>
                  </div>
                </div>

                <div class="bureau-name">
                  {{ candidate.bureau_name || "Bureau not provided" }}
                </div>

                <div class="rating-row">
                  <v-rating
                    v-model="rating"
                    background-color="grey lighten-2"
                    color="yellow darken-2"
                    dense
                    half-increments
                    readonly
                    size="18"
                  />

                  <span>({{ rating }})</span>
                </div>

                <div class="contact-box">
                  <span>Contact Person / Number</span>
                  <strong>{{ candidate.bureau_no || "Not available" }}</strong>
                </div>

                <v-btn
                  block
                  rounded
                  large
                  class="call-btn"
                  :disabled="!candidate.bureau_no"
                  @click="CheckGoalProgress"
                >
                  Call Agent/Bureau
                  <v-icon right>mdi-phone</v-icon>
                </v-btn>

                <v-btn
                  block
                  rounded
                  large
                  outlined
                  color="cyan accent-2"
                  class="mt-3"
                  to="/selection"
                >
                  Change Preference
                  <v-icon right>mdi-account-search-outline</v-icon>
                </v-btn>
              </v-card>

              <!-- MESSAGE -->
              <v-alert
                v-if="message"
                class="mt-4"
                :type="messageType"
                dense
                outlined
              >
                {{ message }}
              </v-alert>

              <!-- CONFIRM DEAL -->
              <v-card class="confirm-card mt-5" elevation="0">
                <h3>Ready to continue?</h3>

                <p>
                  Confirm only when you are sure you want to proceed with this
                  candidate.
                </p>

                <v-btn
                  block
                  rounded
                  large
                  class="confirm-btn"
                  :loading="confirmLoading"
                  @click="ConfimeDeal"
                >
                  Confirm Deal
                  <v-icon right>mdi-check-circle-outline</v-icon>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- EMPTY STATE -->
        <div v-else class="empty-state">
          <v-icon size="58" color="cyan accent-2">
            mdi-account-alert-outline
          </v-icon>

          <h3>Candidate not found</h3>

          <p>
            We could not load this candidate. Please go back and try again.
          </p>

          <v-btn rounded class="confirm-btn" to="/selection">
            Back to Candidates
          </v-btn>
        </div>
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
import numeral from "numeral";
import user from "@/assets/user.png";

const API_BASE = "https://yayalinkserver-production-edaa.up.railway.app/api";

export default {
  data() {
    return {
      user,
      numeral,

      candidate: null,

      loading: false,
      confirmLoading: false,

      uid: null,
      int_value: "YA",

      message: null,
      messageType: "success",

      snackbar: false,
      snackbarText: "",

      snackbar2: false,
      snackbarText2: "",

      rating: 4.5,

      auth_state: false,
    };
  },

  async mounted() {
    this.checkUser();
    await this.fetchCandidates();
  },

  methods: {
    checkUser() {
      if (this.$fire && this.$fire.auth && this.$fire.auth.currentUser) {
        this.uid = this.$fire.auth.currentUser.uid;
        this.auth_state = true;
        console.log("UID =>", this.uid);
      } else {
        this.uid = null;
        this.auth_state = false;
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

    getInitials(name) {
      if (!name) return "YA";

      const parts = name.trim().split(" ");

      if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
      }

      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    },

    async fetchCandidates() {
      this.loading = true;

      try {
        const candidateId = this.$route.params.id;

        const res = await axios.get(
          `${API_BASE}/candidates/get-candidate/${candidateId}`
        );

        this.candidate = res.data;
        this.int_value = this.getInitials(res.data.candidate_name);

        console.log("candidate", res.data);
      } catch (err) {
        console.error("fetchCandidates error:", err);
        this.candidate = null;
        this.showError("Failed to load candidate information.");
      } finally {
        this.loading = false;
      }
    },

    CheckGoalProgress() {
      if (!this.candidate || !this.candidate.bureau_no) {
        this.showError("Bureau phone number is not available.");
        return;
      }

      const phone = String(this.candidate.bureau_no).replace(/\s/g, "");

      window.location.href = `tel:${phone}`;
    },

    async ConfimeDeal() {
      if (!this.uid) {
        this.showError("Please login first before confirming the deal.");
        return;
      }

      if (!this.candidate) {
        this.showError("Candidate information is missing.");
        return;
      }

      this.confirmLoading = true;
      this.message = null;

      try {
        const candidateId =
          this.candidate.candidate_id || this.$route.params.id;

        const res = await axios.post(`${API_BASE}/employer-access/select`, {
          employer_uid: this.uid,
          candidate_id: candidateId,
        });

        if (res.status === 200) {
          this.messageType = "success";
          this.message = res.data.message || "Deal confirmed successfully.";
          this.showSuccess(this.message);

          await this.fetchCandidates();
        }

        console.log("confirm deal", res.data);
      } catch (err) {
        console.error("ConfimeDeal error:", err);

        const errorMessage =
          err.response && err.response.data
            ? err.response.data.message ||
              err.response.data.reason ||
              "Failed to confirm deal."
            : "Failed to confirm deal.";

        this.messageType = "error";
        this.message = errorMessage;
        this.showError(errorMessage);
      } finally {
        this.confirmLoading = false;
      }
    },

    async Send_sms() {
      this.loading = true;

      try {
        const res = await axios.post(
          "https://quicksms.advantasms.com/api/services/sendsms/",
          {
            apikey: process.env.SmsAPIKey,
            partnerID: process.env.PartnerID,
            message: "This is a test message",
            shortcode: process.env.ShortCode,
            mobile: "254796124865",
          }
        );

        if (res.status === 200) {
          this.$router.push("/employer");
        }

        console.log("SMS response", res.data);
      } catch (err) {
        console.error("Send_sms error:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.candidate-page {
  background: #0f1020 !important;
  color: white;
  min-height: 100vh;
}

/* TOP NAV */
.top-nav {
  background: rgba(5, 6, 15, 0.94) !important;
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.page-title {
  color: white;
  font-size: 1rem;
  font-weight: 950;
  line-height: 1.1;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.74rem;
  margin-top: 4px;
}

/* LAYOUT */
.page-shell {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 104px 20px 56px;
}

.content-wrap {
  width: 100%;
}

/* LOADING / EMPTY */
.loading-state,
.empty-state {
  min-height: 70vh;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 24px;
}

.loading-state p,
.empty-state p {
  color: rgba(255, 255, 255, 0.68);
  margin: 0;
}

.empty-state h3 {
  font-size: 1.6rem;
  font-weight: 950;
  margin: 0;
}

/* HERO */
.hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 34px;
  padding: 34px;
  margin-bottom: 24px;
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
  display: flex;
  align-items: center;
  gap: 22px;
  position: relative;
  z-index: 2;
}

.candidate-avatar {
  background: #00ffff !important;
  color: #05060f !important;
  font-weight: 950;
  font-size: 1.4rem;
  box-shadow: 0 18px 40px rgba(0, 255, 255, 0.18);
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #00ffff;
  color: #05060f;
  padding: 7px 12px;
  border-radius: 999px;
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

.candidate-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 700;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 18px;
}

.soft-chip {
  background: rgba(255, 255, 255, 0.09) !important;
  color: white !important;
}

/* SALARY */
.salary-card {
  position: relative;
  z-index: 2;
  border-radius: 28px;
  padding: 28px;
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.09);
  text-align: center;
}

.salary-card span {
  display: block;
  color: rgba(255, 255, 255, 0.62);
  font-weight: 800;
  margin-bottom: 8px;
}

.salary-card strong {
  display: block;
  color: #00ffff;
  font-size: 2rem;
  font-weight: 950;
  line-height: 1.1;
}

.salary-card p {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.7);
}

/* CARDS */
.info-card,
.bureau-card,
.confirm-card {
  background: rgba(255, 255, 255, 0.07) !important;
  color: white !important;
  border-radius: 28px !important;
  padding: 26px;
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 22px;
}

.section-heading h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 950;
}

.section-heading p {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.62);
}

/* STEPS */
.steps-list {
  display: grid;
  gap: 14px;
}

.step-item {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.055);
}

.step-number {
  min-width: 34px;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #00ffff;
  color: #05060f;
  font-weight: 950;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-item p {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  line-height: 1.65;
}

.notice-box {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.18);
}

.notice-box p {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  line-height: 1.6;
}

/* DETAILS */
.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.detail-item {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.055);
}

.detail-item span {
  display: block;
  color: rgba(255, 255, 255, 0.54);
  font-size: 0.78rem;
  margin-bottom: 6px;
}

.detail-item strong {
  color: white;
  font-size: 0.98rem;
}

.status-text {
  color: #3eea84 !important;
}

/* BUREAU */
.bureau-card {
  background: #ffffff !important;
  color: #1a1b2b !important;
}

.bureau-top {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 22px;
}

.bureau-avatar {
  background: #00ffff !important;
}

.bureau-top h2 {
  margin: 0;
  font-weight: 950;
  color: #1a1b2b;
}

.bureau-top p {
  margin: 4px 0 0;
  color: rgba(26, 27, 43, 0.62);
  line-height: 1.5;
}

.bureau-name {
  padding: 18px;
  border-radius: 20px;
  background: #eef6ff;
  font-weight: 950;
  font-size: 1.1rem;
  margin-bottom: 14px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}

.rating-row span {
  color: rgba(26, 27, 43, 0.62);
  font-weight: 800;
}

.contact-box {
  padding: 18px;
  border-radius: 20px;
  background: #f7fbff;
  margin-bottom: 18px;
}

.contact-box span {
  display: block;
  color: rgba(26, 27, 43, 0.58);
  font-size: 0.8rem;
  margin-bottom: 6px;
}

.contact-box strong {
  display: block;
  font-size: 1.2rem;
  color: #1a1b2b;
}

.call-btn {
  background: #05060f !important;
  color: #00ffff !important;
  font-weight: 900;
  text-transform: none;
}

/* CONFIRM */
.confirm-card h3 {
  margin: 0 0 8px;
  font-weight: 950;
}

.confirm-card p {
  margin: 0 0 18px;
  color: rgba(255, 255, 255, 0.66);
  line-height: 1.6;
}

.confirm-btn {
  background: #00ffff !important;
  color: #05060f !important;
  font-weight: 950;
  text-transform: none;
}

/* MOBILE */
@media (max-width: 760px) {
  .page-shell {
    padding: 96px 14px 40px;
  }

  .hero-card {
    padding: 24px;
    border-radius: 26px;
  }

  .profile-main {
    flex-direction: column;
    text-align: center;
  }

  .candidate-meta,
  .chip-row {
    justify-content: center;
  }

  .salary-card {
    margin-top: 16px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .info-card,
  .bureau-card,
  .confirm-card {
    border-radius: 24px !important;
    padding: 22px;
  }
}
</style>