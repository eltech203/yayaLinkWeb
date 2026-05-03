<template>
  <v-app class="auth-page">
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
            <div class="brand-sub">Employer Access</div>
          </div>
        </div>
      </nuxt-link>

      <v-spacer />

      <v-btn icon to="/">
        <v-icon color="white">mdi-home-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <div class="auth-shell">
        <v-row align="center" justify="center">
          <!-- FORM SIDE -->
          <v-col cols="12" md="6" lg="5">
            <v-card class="auth-card" elevation="0">
              <div class="auth-header">
                <div class="auth-badge">
                  <v-icon small color="black">mdi-account-tie-outline</v-icon>
                  Employer Portal
                </div>

                <h1>
                  {{ loginAuth ? "Welcome Back" : "Create Employer Account" }}
                </h1>

                <p>
                  {{
                    loginAuth
                      ? "Login to continue searching for verified house help candidates."
                      : "Create an employer account and start connecting with verified candidates."
                  }}
                </p>
              </div>

              <!-- TABS -->
              <div class="tab-switch">
                <button
                  type="button"
                  :class="{ active: loginAuth }"
                  @click="showLoginTab"
                >
                  Login
                </button>

                <button
                  type="button"
                  :class="{ active: registerAuth }"
                  @click="showRegisterTab"
                >
                  Create Account
                </button>
              </div>

              <!-- LOGIN FORM -->
              <div v-show="loginAuth" class="form-wrap">
                <v-form @submit.prevent="checkEmailDB">
                  <label class="input-label">Email Address</label>
                  <v-text-field
                    v-model="auth.email"
                    type="email"
                    outlined
                    rounded
                    dense
                    placeholder="Enter your email"
                    prepend-inner-icon="mdi-email-outline"
                    class="auth-input"
                  />

                  <label class="input-label">Password</label>
                  <v-text-field
                    v-model="auth.password"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    rounded
                    dense
                    placeholder="Enter your password"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    class="auth-input"
                    @click:append="showPassword = !showPassword"
                  />

                  <v-btn
                    block
                    large
                    rounded
                    class="primary-btn"
                    :loading="loading"
                    type="submit"
                  >
                    Login
                    <v-icon right>mdi-login</v-icon>
                  </v-btn>
                </v-form>

                <div class="switch-text">
                  I don’t have an account.
                  <button type="button" @click="showRegisterTab">
                    Create account
                  </button>
                </div>
              </div>

              <!-- REGISTER FORM -->
              <div v-show="registerAuth" class="form-wrap">
                <v-form @submit.prevent="signUp">
                  <div class="section-title-row">
                    <div class="section-icon">
                      <v-icon color="black">mdi-account-plus-outline</v-icon>
                    </div>

                    <div>
                      <h2>Personal Details</h2>
                      <p>Tell us who you are and where you are based.</p>
                    </div>
                  </div>

                  <v-row>
                    <v-col cols="12">
                      <label class="input-label">Full Name</label>
                      <v-text-field
                        v-model="form.name"
                        outlined
                        rounded
                        dense
                        placeholder="Enter your full name"
                        prepend-inner-icon="mdi-account-outline"
                        class="auth-input"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <label class="input-label">Phone Number</label>
                      <v-text-field
                        v-model="form.phone_no"
                        type="number"
                        outlined
                        rounded
                        dense
                        placeholder="07XXXXXXXX"
                        prepend-inner-icon="mdi-phone-outline"
                        class="auth-input"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <label class="input-label">County</label>
                      <v-text-field
                        v-model="form.county"
                        outlined
                        rounded
                        dense
                        placeholder="Example: Nairobi"
                        prepend-inner-icon="mdi-map-marker-outline"
                        class="auth-input"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <label class="input-label">City</label>
                      <v-text-field
                        v-model="form.city"
                        outlined
                        rounded
                        dense
                        placeholder="Example: Nairobi"
                        prepend-inner-icon="mdi-city-variant-outline"
                        class="auth-input"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <label class="input-label">Street Name</label>
                      <v-text-field
                        v-model="form.street_name"
                        outlined
                        rounded
                        dense
                        placeholder="Example: Kilimani"
                        prepend-inner-icon="mdi-road-variant"
                        class="auth-input"
                      />
                    </v-col>
                  </v-row>

                  <div class="section-title-row mt-5">
                    <div class="section-icon">
                      <v-icon color="black">mdi-lock-outline</v-icon>
                    </div>

                    <div>
                      <h2>Login Details</h2>
                      <p>Create your login credentials.</p>
                    </div>
                  </div>

                  <v-row>
                    <v-col cols="12">
                      <label class="input-label">Email Address</label>
                      <v-text-field
                        v-model="auth.email"
                        type="email"
                        outlined
                        rounded
                        dense
                        placeholder="Enter your email"
                        prepend-inner-icon="mdi-email-outline"
                        class="auth-input"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <label class="input-label">Password</label>
                      <v-text-field
                        v-model="auth.password"
                        :type="showPassword ? 'text' : 'password'"
                        outlined
                        rounded
                        dense
                        placeholder="Create password"
                        prepend-inner-icon="mdi-lock-outline"
                        :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                        class="auth-input"
                        @click:append="showPassword = !showPassword"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <label class="input-label">Confirm Password</label>
                      <v-text-field
                        v-model="password_matcher"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        outlined
                        rounded
                        dense
                        placeholder="Re-enter password"
                        prepend-inner-icon="mdi-lock-check-outline"
                        :append-icon="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                        class="auth-input"
                        @click:append="showConfirmPassword = !showConfirmPassword"
                      />
                    </v-col>
                  </v-row>

                  <v-btn
                    block
                    large
                    rounded
                    class="primary-btn"
                    :loading="loading"
                    type="submit"
                  >
                    Create Account
                    <v-icon right>mdi-account-plus-outline</v-icon>
                  </v-btn>
                </v-form>

                <div class="switch-text">
                  I already have an account.
                  <button type="button" @click="showLoginTab">
                    Login
                  </button>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- VISUAL SIDE -->
          <v-col cols="12" md="6" lg="5" class="visual-col">
            <div class="visual-card">
              <div class="visual-glow"></div>

              <div class="visual-content">
                <div class="visual-badge">
                  Trusted Hiring
                </div>

                <h2>
                  Find verified domestic help with confidence.
                </h2>

                <p>
                  Browse candidates, unlock profiles through M-Pesa, and connect
                  directly with bureaus managing verified house help candidates.
                </p>

                <div class="benefits">
                  <div class="benefit-item">
                    <v-icon color="cyan accent-2">mdi-shield-check-outline</v-icon>
                    <span>Verified candidate profiles</span>
                  </div>

                  <div class="benefit-item">
                    <v-icon color="cyan accent-2">mdi-cash-check</v-icon>
                    <span>Simple access payments</span>
                  </div>

                  <div class="benefit-item">
                    <v-icon color="cyan accent-2">mdi-phone-check-outline</v-icon>
                    <span>Direct bureau contact</span>
                  </div>

                  <div class="benefit-item">
                    <v-icon color="cyan accent-2">mdi-account-search-outline</v-icon>
                    <span>Fast candidate discovery</span>
                  </div>
                </div>

                <v-img
                  :src="bu"
                  contain
                  height="270"
                  class="hero-image"
                />
              </div>
            </div>
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
import bu from "@/assets/emp.png";

const API_BASE = "https://yayalinkserver-production-edaa.up.railway.app/api";

export default {
  data() {
    return {
      bu,

      snackbar: false,
      snackbarText: "",

      snackbar2: false,
      snackbarText2: "",

      loading: false,

      registerAuth: false,
      loginAuth: true,

      showPassword: false,
      showConfirmPassword: false,

      password_matcher: null,

      form: {
        name: null,
        phone_no: null,
        city: null,
        email: null,
        county: null,
        user_id: null,
        street_name: null,
      },

      auth: {
        email: null,
        password: null,
      },

      auth_state: false,
      uid: "",
    };
  },

  mounted() {
    this.checkUser();
  },

  methods: {
    showLoginTab() {
      this.loginAuth = true;
      this.registerAuth = false;
    },

    showRegisterTab() {
      this.loginAuth = false;
      this.registerAuth = true;
    },

    showError(message) {
      this.snackbarText2 = message || "Something went wrong.";
      this.snackbar2 = true;
    },

    showSuccess(message) {
      this.snackbarText = message || "Success";
      this.snackbar = true;
    },

    validateLogin() {
      if (!this.auth.email || !this.auth.password) {
        this.showError("Provide email and password.");
        return false;
      }

      return true;
    },

    validateRegister() {
      if (
        !this.form.name ||
        !this.form.phone_no ||
        !this.form.city ||
        !this.form.street_name ||
        !this.form.county ||
        !this.auth.email ||
        !this.auth.password
      ) {
        this.showError("Provide input for all required fields.");
        return false;
      }

      if (this.password_matcher !== this.auth.password) {
        this.showError("Passwords do not match.");
        return false;
      }

      if (this.auth.password.length < 6) {
        this.showError("Password should be at least 6 characters.");
        return false;
      }

      return true;
    },

    async checkEmailDB() {
      if (!this.validateLogin()) return;

      this.loading = true;

      try {
        const res = await axios.post(`${API_BASE}/auth/auth/check-email`, {
          email: this.auth.email,
        });

        if (res.data.exists === true) {
          await this.loginWithEmailPass();
        } else {
          this.showError("Account does not exist. Please register first.");
        }

        console.log("email check", res.data);
      } catch (err) {
        console.error("checkEmailDB error:", err);
        this.showError("Could not check account. Please try again.");
      } finally {
        this.loading = false;
      }
    },

    async signUp() {
      if (!this.validateRegister()) return;

      this.loading = true;

      try {
        const userCredential =
          await this.$fire.auth.createUserWithEmailAndPassword(
            this.auth.email,
            this.auth.password
          );

        const uid = userCredential.user.uid;
        this.uid = uid;

        await this.register(uid);

        this.showSuccess("Account created successfully.");
        this.$router.push("/selection");
      } catch (error) {
        console.error("signUp error:", error);
        this.showError(error.message || "Failed to create account.");
      } finally {
        this.loading = false;
      }
    },

    async loginWithEmailPass() {
      try {
        await this.$fire.auth.signInWithEmailAndPassword(
          this.auth.email,
          this.auth.password
        );

        this.showSuccess("Login successful.");
        this.$router.push("/selection");
      } catch (error) {
        console.error("loginWithEmailPass error:", error);
        this.showError(error.message || "Login failed.");
      }
    },

    checkUser() {
      if (this.$fire && this.$fire.auth && this.$fire.auth.currentUser) {
        this.uid = this.$fire.auth.currentUser.uid;
        this.auth_state = true;
      } else {
        this.uid = "";
        this.auth_state = false;
      }
    },

    async register(uid) {
      await axios.post(`${API_BASE}/employers/register`, {
        uid,
        name: this.form.name,
        phone_no: this.form.phone_no,
        city: this.form.city,
        county: this.form.county,
        email: this.auth.email,
        street_name: this.form.street_name,
        user_image: "https://avatar.iran.liara.run/public/19",
      });
    },
  },
};
</script>

<style scoped>
.auth-page {
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
.auth-shell {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 112px 20px 56px;
}

.auth-card {
  background: #ffffff !important;
  color: #1a1b2b !important;
  border-radius: 34px !important;
  padding: 30px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28) !important;
}

.auth-header {
  margin-bottom: 24px;
}

.auth-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  border-radius: 999px;
  background: rgba(0, 188, 212, 0.14);
  color: #05060f;
  font-weight: 950;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 18px;
}

.auth-header h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.05;
  font-weight: 950;
  letter-spacing: -1px;
  margin: 0 0 12px;
}

.auth-header p {
  color: rgba(26, 27, 43, 0.65);
  line-height: 1.7;
  margin: 0;
}

/* TABS */
.tab-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #eef6ff;
  border-radius: 999px;
  padding: 6px;
  margin-bottom: 26px;
}

.tab-switch button {
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 10px;
  border-radius: 999px;
  font-weight: 900;
  color: rgba(26, 27, 43, 0.58);
  cursor: pointer;
  transition: 0.2s ease;
}

.tab-switch button.active {
  background: #05060f;
  color: #00ffff;
}

/* SECTION */
.section-title-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
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
  font-size: 1.18rem;
  font-weight: 950;
  color: #1a1b2b;
}

.section-title-row p {
  margin: 4px 0 0;
  color: rgba(26, 27, 43, 0.6);
  font-size: 0.88rem;
}

/* FORM */
.form-wrap {
  margin-top: 6px;
}

.input-label {
  display: block;
  color: #1a1b2b;
  font-weight: 900;
  font-size: 0.82rem;
  margin-bottom: 8px;
}

.auth-input ::v-deep .v-input__slot {
  background: #f7fbff !important;
}

.auth-input ::v-deep input {
  color: #1a1b2b !important;
  font-weight: 700;
}

.auth-input ::v-deep input::placeholder {
  color: rgba(26, 27, 43, 0.45) !important;
}

.auth-input ::v-deep .v-icon {
  color: #00bcd4 !important;
}

.primary-btn {
  background: #05060f !important;
  color: #00ffff !important;
  font-weight: 950;
  text-transform: none;
  margin-top: 8px;
}

.switch-text {
  text-align: center;
  margin-top: 22px;
  color: rgba(26, 27, 43, 0.65);
  font-weight: 700;
}

.switch-text button {
  border: none;
  background: transparent;
  color: #00a6b8;
  font-weight: 950;
  cursor: pointer;
  margin-left: 4px;
}

/* VISUAL */
.visual-col {
  display: flex;
}

.visual-card {
  position: sticky;
  top: 100px;
  overflow: hidden;
  width: 100%;
  min-height: 640px;
  border-radius: 36px;
  padding: 36px;
  background:
    radial-gradient(circle at top left, rgba(0, 255, 255, 0.22), transparent 36%),
    radial-gradient(circle at bottom right, rgba(0, 188, 212, 0.16), transparent 36%),
    linear-gradient(135deg, #15172d, #0b0c18);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.visual-glow {
  position: absolute;
  right: -90px;
  top: -90px;
  width: 240px;
  height: 240px;
  background: rgba(0, 255, 255, 0.2);
  filter: blur(60px);
}

.visual-content {
  position: relative;
  z-index: 2;
}

.visual-badge {
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

.visual-card h2 {
  color: white;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.05;
  font-weight: 950;
  letter-spacing: -1px;
  margin-bottom: 16px;
}

.visual-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  max-width: 520px;
}

.benefits {
  display: grid;
  gap: 14px;
  margin: 28px 0;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-weight: 800;
}

.hero-image {
  margin-top: 30px;
}

/* MOBILE */
@media (max-width: 960px) {
  .visual-col {
    display: none;
  }

  .auth-shell {
    padding: 100px 14px 40px;
  }

  .auth-card {
    border-radius: 28px !important;
    padding: 24px;
  }
}

@media (max-width: 520px) {
  .brand-sub {
    display: none;
  }

  .tab-switch {
    grid-template-columns: 1fr;
    border-radius: 24px;
  }

  .tab-switch button {
    border-radius: 18px;
  }
}
</style>