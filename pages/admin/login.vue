<template>
  <div class="admin-login-page">
    <!-- AMBIENT BACKGROUND -->
    <div class="ambient-glow cyan"></div>
    <div class="ambient-glow purple"></div>
    <div class="ambient-glow pink"></div>

    <div class="login-shell">
      <!-- BRAND SIDE -->
      <div class="login-brand">
        <div class="brand-icon">
          <v-icon color="black" size="32">mdi-shield-account</v-icon>
        </div>
        <h1 class="brand-title">YayaLink</h1>
        <p class="brand-subtitle">Admin Portal</p>

        <div class="brand-features">
          <div class="feature">
            <v-icon color="cyan accent-2" size="20">mdi-check-circle-outline</v-icon>
            <span>Manage candidates, employers &amp; bureaus</span>
          </div>
          <div class="feature">
            <v-icon color="cyan accent-2" size="20">mdi-chart-line</v-icon>
            <span>Real-time analytics &amp; revenue tracking</span>
          </div>
          <div class="feature">
            <v-icon color="cyan accent-2" size="20">mdi-shield-lock-outline</v-icon>
            <span>Secure Firebase-backed authentication</span>
          </div>
        </div>
      </div>

      <!-- FORM SIDE -->
      <div class="login-card">
        <div class="login-header">
          <h2>Admin Sign In</h2>
          <p>Enter your admin credentials to continue</p>
        </div>

        <form class="login-form" @submit.prevent="submit">
          <div class="field">
            <label class="field-label">Email Address</label>
            <v-text-field
              v-model="email"
              type="email"
              outlined
              dense
              hide-details
              placeholder="admin@yayalink.com"
              prepend-inner-icon="mdi-email-outline"
              :disabled="loading"
              @keyup.enter="submit"
            />
          </div>

          <div class="field">
            <label class="field-label">Password</label>
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense
              hide-details
              placeholder="••••••••"
              prepend-inner-icon="mdi-lock-outline"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              :disabled="loading"
              @click:append="showPassword = !showPassword"
              @keyup.enter="submit"
            />
          </div>

          <v-alert
            v-if="error"
            type="error"
            dense
            outlined
            class="login-error"
          >
            <v-icon small left>mdi-alert-circle-outline</v-icon>
            {{ error }}
          </v-alert>

          <v-btn
            type="submit"
            rounded
            block
            large
            class="login-btn"
            :loading="loading"
            :disabled="loading || !email || !password"
            style="color:#0E1018"
          >
            <v-icon left size="18">mdi-login</v-icon>
            Sign In
          </v-btn>

          <div class="login-footer">
            <v-icon small color="grey" left>mdi-shield-check</v-icon>
            Authorized personnel only. All sign-ins are logged.
          </div>
        </form>
      </div>
    </div>

    <!-- LOADING OVERLAY -->
    <v-overlay :value="verifying" z-index="9999" color="#08090F">
      <div class="verify-box">
        <v-progress-circular indeterminate color="cyan accent-2" size="52" />
        <p>Verifying admin access...</p>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import axios from "axios";

const API_BASE = "https://yayalinkserver-production-b920.up.railway.app";

export default {
  name: "AdminLogin",

  // Prevent the standard auth middleware from running on this page
  middleware: [],

  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      loading: false,
      verifying: false,
      error: "",
    };
  },

  async mounted() {
    // If already logged in as a valid admin, redirect
    if (this.$fire && this.$fire.auth && this.$fire.auth.currentUser) {
      const ok = await this.verifyAdmin();
      if (ok) {
        this.$router.replace("/admin");
      } else {
        // Logged in but not an admin — sign out
        await this.$fire.auth.signOut();
      }
    }
  },

  methods: {
    async submit() {
      this.error = "";
      if (!this.email || !this.password) return;

      this.loading = true;

      try {
        // 1. Sign in with Firebase
        const cred = await this.$fire.auth.signInWithEmailAndPassword(
          this.email.trim(),
          this.password
        );

        // 2. Verify the user is a registered admin
        this.verifying = true;
        const ok = await this.verifyAdmin();

        if (!ok) {
          // Not an admin — sign out immediately
          await this.$fire.auth.signOut();
          this.error = "This account does not have admin access.";
          this.loading = false;
          this.verifying = false;
          return;
        }

        // 3. Redirect to admin dashboard
        this.$router.replace("/admin");
      } catch (err) {
        console.error("Admin login error:", err);

        const code = err.code || "";

        if (code === "auth/user-not-found") {
          this.error = "No account found for that email.";
        } else if (code === "auth/wrong-password") {
          this.error = "Incorrect password.";
        } else if (code === "auth/invalid-email") {
          this.error = "Please enter a valid email address.";
        } else if (code === "auth/too-many-requests") {
          this.error = "Too many attempts. Try again later.";
        } else if (code === "auth/invalid-credential") {
          this.error = "Invalid email or password.";
        } else {
          this.error = err.message || "Login failed. Please try again.";
        }

        this.loading = false;
        this.verifying = false;
      }
    },

    async verifyAdmin() {
      try {
        if (!this.$fire || !this.$fire.auth || !this.$fire.auth.currentUser) {
          return false;
        }

        const idToken = await this.$fire.auth.currentUser.getIdToken();

        const res = await axios.get(`${API_BASE}/api/admin/dashboard/summary`, {
          headers: { Authorization: `Bearer ${idToken}` },
          validateStatus: () => true, // don't throw on 401/403
        });

        return res.status === 200;
      } catch (err) {
        console.error("verifyAdmin error:", err);
        return false;
      }
    },
  },
};
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  background: #08090F;
  color: #E2E8F0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* AMBIENT */
.ambient-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.12;
  pointer-events: none;
  z-index: 0;
}

.ambient-glow.cyan {
  width: 600px;
  height: 600px;
  background: #00FFFF;
  top: -200px;
  right: -100px;
  animation: float 20s infinite ease-in-out;
}

.ambient-glow.purple {
  width: 500px;
  height: 500px;
  background: #9C27B0;
  bottom: -150px;
  left: -100px;
  animation: float 25s infinite ease-in-out reverse;
}

.ambient-glow.pink {
  width: 400px;
  height: 400px;
  background: #E91E63;
  top: 40%;
  left: 30%;
  animation: float 22s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

/* SHELL */
.login-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: rgba(14, 16, 24, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}

/* BRAND SIDE */
.login-brand {
  padding: 56px 48px;
  background:
    radial-gradient(circle at top left, rgba(0, 255, 255, 0.08), transparent 50%),
    linear-gradient(135deg, #0f1020, #05060f);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-icon {
  width: 64px;
  height: 64px;
  background: #00FFFF;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.35);
  margin-bottom: 24px;
}

.brand-title {
  font-size: 2rem;
  font-weight: 950;
  color: #fff;
  margin: 0 0 8px 0;
  letter-spacing: -1px;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
  margin: 0 0 40px 0;
  font-weight: 500;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
}

/* FORM SIDE */
.login-card {
  padding: 56px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-header {
  margin-bottom: 32px;
}

.login-header h2 {
  font-size: 1.6rem;
  font-weight: 900;
  color: #fff;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.login-header p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.login-card ::v-deep .v-input__slot {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  min-height: 48px !important;
}

.login-card ::v-deep input {
  color: #fff !important;
  font-weight: 600;
}

.login-card ::v-deep input::placeholder {
  color: rgba(255, 255, 255, 0.25) !important;
}

.login-card ::v-deep fieldset {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.login-card ::v-deep .v-icon {
  color: rgba(255, 255, 255, 0.4) !important;
}

.login-error {
  margin: 0 !important;
}

.login-btn {
  background: #00FFFF !important;
  color: #05060f !important;
  font-weight: 900;
  text-transform: none;
  letter-spacing: 0;
  height: 52px !important;
  margin-top: 8px;
  box-shadow: 0 8px 30px rgba(0, 255, 255, 0.3) !important;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  box-shadow: 0 12px 40px rgba(0, 255, 255, 0.45) !important;
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.5;
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

/* VERIFY OVERLAY */
.verify-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

/* RESPONSIVE */
@media (max-width: 860px) {
  .login-shell {
    grid-template-columns: 1fr;
    max-width: 440px;
  }

  .login-brand {
    padding: 40px 32px;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .brand-title {
    font-size: 1.6rem;
  }

  .brand-features {
    display: none;
  }

  .login-card {
    padding: 40px 32px;
  }

  .login-header h2 {
    font-size: 1.4rem;
  }
}
</style>