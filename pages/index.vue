<template>
  <div class="yayalink-page" v-resize="onResize">
    <!-- NAVBAR -->
    <v-app-bar app fixed dark elevation="0" class="nav-bar" height="72">
      <div class="brand-wrap" @click="scrollToSection('home')">
        <div class="brand-icon">Y</div>
        <div>
          <div class="brand-name">YayaLink</div>
          <div class="brand-subtitle">Trusted Domestic Help</div>
        </div>
      </div>

      <v-spacer />

      <div v-if="!showBurger" class="desktop-links">
        <button @click="scrollToSection('home')">Home</button>
        <button @click="scrollToSection('about')">About</button>
        <button @click="scrollToSection('aim')">How it Works</button>
        <button @click="scrollToSection('download_app')">Download App</button>
        <button @click="scrollToSection('why_yayalink')">Why YayaLink</button>
      </div>

      <v-spacer v-if="!showBurger" />

      <v-btn v-if="!showBurger" rounded class="download-nav-btn" @click="scrollToSection('download_app')">
        Download App
        <v-icon right small>mdi-download</v-icon>
      </v-btn>

      <v-btn v-if="!showBurger" rounded class="nav-cta ml-2" to="/selection">
        Get Started
        <v-icon right small>mdi-arrow-top-right</v-icon>
      </v-btn>

      <v-menu v-if="showBurger" offset-y left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon color="white">mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list dark class="mobile-menu">
          <v-list-item @click="scrollToSection('home')">
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item @click="scrollToSection('about')">
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>

          <v-list-item @click="scrollToSection('aim')">
            <v-list-item-title>How it Works</v-list-item-title>
          </v-list-item>

          <v-list-item @click="scrollToSection('download_app')">
            <v-list-item-title>Download App</v-list-item-title>
          </v-list-item>

          <v-list-item @click="scrollToSection('why_yayalink')">
            <v-list-item-title>Why YayaLink</v-list-item-title>
          </v-list-item>

          <v-list-item to="/selection">
            <v-list-item-title>Get Started</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- HERO -->
    <section id="home" class="hero-section">
      <div class="hero-overlay"></div>

      <v-container class="hero-container">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-center">
            <div class="hero-badge">
              Fast. Verified. Trusted.
            </div>

            <h1 class="hero-title">
              Find Reliable House Help in Minutes
            </h1>

            <p class="hero-text">
              YayaLink connects employers, house helps, and bureaus through a simple,
              trusted, and verified platform built for Kenyan homes.
            </p>

            <div class="hero-actions">
              <v-btn x-large rounded class="primary-btn" to="/selection">
                Get Started
                <v-icon right>mdi-arrow-top-right</v-icon>
              </v-btn>

              <v-btn x-large rounded class="app-btn" @click="scrollToSection('download_app')">
                Download App
                <v-icon right>mdi-cellphone-arrow-down</v-icon>
              </v-btn>

              <v-btn x-large rounded outlined color="white" @click="scrollToSection('about')">
                Learn More
              </v-btn>
            </div>

            <div class="hero-slider">
              <v-carousel
                height="90"
                cycle
                :interval="4000"
                :continuous="true"
                :show-arrows="false"
                hide-delimiters
              >
                <v-carousel-item
                  v-for="(item, i) in items"
                  :key="i"
                  transition="fade-transition"
                  reverse-transition="fade-transition"
                >
                  <div class="slider-text">
                    {{ item.title }}
                  </div>
                </v-carousel-item>
              </v-carousel>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- USER OPTIONS -->
    <section id="about" class="section-block">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="5">
            <div class="section-kicker">Choose your path</div>
            <h2 class="section-title">
              What are you looking for?
            </h2>
            <p class="section-text">
              Whether you are a house help looking for work, a bureau managing
              candidates, or an employer looking to hire, YayaLink gives you the
              right tools to connect faster.
            </p>
          </v-col>

          <v-col cols="12" md="7">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-card class="option-card">
                  <div class="card-image-wrap">
                    <v-img :src="can" contain height="110"></v-img>
                  </div>

                  <h3>I’m a House Help</h3>

                  <p>
                    Create your profile, get verified, and connect with trusted
                    employers and bureaus.
                  </p>

                  <v-btn rounded class="card-btn" to="/register/candidate">
                    Register
                    <v-icon right small>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card class="option-card">
                  <div class="card-image-wrap">
                    <v-img :src="bu" contain height="110"></v-img>
                  </div>

                  <h3>I’m a Bureau</h3>

                  <p>
                    Manage candidates, connect with employers, and place house helps
                    faster with confidence.
                  </p>

                  <v-btn rounded class="card-btn" to="/register/bureau">
                    Register
                    <v-icon right small>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card class="option-card">
                  <div class="card-image-wrap">
                    <v-img :src="emp" contain height="110"></v-img>
                  </div>

                  <h3>I Need House Help</h3>

                  <p>
                    Browse verified candidates, view profiles, and hire based on
                    experience and location.
                  </p>

                  <v-btn rounded class="card-btn" to="/selection">
                    Find Help
                    <v-icon right small>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- HOW IT WORKS -->
    <section id="aim" class="section-block darker-section">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-kicker">Simple process</div>
          <h2 class="section-title">
            How YayaLink Works
          </h2>
          <p class="section-text center-text">
            Browse verified profiles, activate access through payment, and contact
            candidates directly. No delays. No confusion.
          </p>
        </div>

        <v-row align="center">
          <v-col cols="12" md="5">
            <div class="image-panel">
              <v-img :src="laundry" contain height="360"></v-img>
            </div>
          </v-col>

          <v-col cols="12" md="7">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="step-card">
                  <div class="step-icon">
                    <v-icon color="black">mdi-search-web</v-icon>
                  </div>

                  <h3>Browse Verified Candidates</h3>

                  <p>
                    View profiles with experience, location, expected salary, and
                    availability.
                  </p>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="step-card">
                  <div class="step-icon">
                    <v-icon color="black">mdi-credit-card-outline</v-icon>
                  </div>

                  <h3>Pay for Access</h3>

                  <p>
                    Choose an access period and unlock full candidate details during
                    your active plan.
                  </p>
                </div>
              </v-col>

              <v-col cols="12">
                <div class="step-card wide-step">
                  <div class="step-icon">
                    <v-icon color="black">mdi-phone</v-icon>
                  </div>

                  <div>
                    <h3>Hire Instantly</h3>

                    <p>
                      Contact the candidate directly and move faster. Candidate status
                      can be updated to avoid double hiring.
                    </p>

                    <v-btn outlined rounded color="cyan accent-2" to="/selection">
                      Start Searching
                      <v-icon right>mdi-arrow-top-right</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- DOWNLOAD APP -->
    <section id="download_app" class="download-section">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <div class="section-kicker">YayaLink Mobile App</div>

            <h2 class="section-title">
              Download the App and Find Help Faster
            </h2>

            <p class="section-text">
              Get YayaLink on your phone for faster access to verified house helps,
              bureau profiles, notifications, payments, and candidate selection.
            </p>

            <div class="download-points">
              <div class="download-point">
                <v-icon color="cyan accent-2">mdi-check-circle</v-icon>
                <span>Search verified candidates from your phone</span>
              </div>

              <div class="download-point">
                <v-icon color="cyan accent-2">mdi-check-circle</v-icon>
                <span>Get notifications and profile updates</span>
              </div>

              <div class="download-point">
                <v-icon color="cyan accent-2">mdi-check-circle</v-icon>
                <span>Easy access for employers, bureaus, and job seekers</span>
              </div>
            </div>

            <div class="store-buttons">
              <!-- Change href when your Play Store link is ready -->
              <a
                class="store-btn"
                :href="androidAppLink"
                target="_blank"
                rel="noopener"
              >
                <v-icon>mdi-google-play</v-icon>
                <div>
                  <small>Get it on</small>
                  <strong>Google Play</strong>
                </div>
              </a>

              <!-- Change href when your APK link is ready -->
              <a
                class="store-btn alt-store"
                :href="apkDownloadLink"
                target="_blank"
                rel="noopener"
              >
                <v-icon>mdi-android</v-icon>
                <div>
                  <small>Download</small>
                  <strong>Android APK</strong>
                </div>
              </a>
            </div>

            <p class="download-note">
              Replace the download links in the script with your real Play Store or APK link.
            </p>
          </v-col>

          <v-col cols="12" md="6">
            <div class="phone-preview-wrap">
              <div class="phone-glow"></div>

              <div class="phone-preview">
                <div class="phone-top"></div>

                <div class="phone-screen">
                  <div class="phone-logo">Y</div>
                  <h3>YayaLink App</h3>
                  <p>Trusted domestic help in your pocket.</p>

                  <div class="phone-card">
                    <div>
                      <strong>Verified Candidates</strong>
                      <small>Browse by county and experience</small>
                    </div>
                    <v-icon color="cyan accent-2">mdi-account-check</v-icon>
                  </div>

                  <div class="phone-card">
                    <div>
                      <strong>Fast Selection</strong>
                      <small>Pay access and contact directly</small>
                    </div>
                    <v-icon color="cyan accent-2">mdi-flash</v-icon>
                  </div>

                  <div class="phone-card">
                    <div>
                      <strong>Bureau Tools</strong>
                      <small>Manage candidates easily</small>
                    </div>
                    <v-icon color="cyan accent-2">mdi-briefcase-check</v-icon>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- WHY YAYALINK -->
    <section id="why_yayalink" class="section-block">
      <v-container>
        <div class="text-center mb-10">
          <div class="section-kicker">Why YayaLink</div>
          <h2 class="section-title">
            Built for Trust, Speed, and Local Access
          </h2>
        </div>

        <v-row>
          <v-col cols="12" md="4">
            <div class="feature-card">
              <v-icon large color="cyan accent-2">mdi-shield-check</v-icon>
              <h3>Trust & Safety</h3>
              <p>
                Every candidate and bureau goes through verification to improve
                safety, reliability, and accountability.
              </p>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div class="feature-card">
              <v-icon large color="cyan accent-2">mdi-cash-check</v-icon>
              <h3>Clear Pricing</h3>
              <p>
                Choose access for a few days, a week, or a month. Pay once and
                connect during your active period.
              </p>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <div class="feature-card">
              <v-icon large color="cyan accent-2">mdi-map-marker-radius</v-icon>
              <h3>County Coverage</h3>
              <p>
                YayaLink is built to support local matching across counties in Kenya
                for faster and better connections.
              </p>
            </div>
          </v-col>
        </v-row>

        <div class="bottom-cta">
          <h2>Ready to find trusted domestic help?</h2>
          <p>Use YayaLink on web or download the mobile app.</p>

          <div class="bottom-actions">
            <v-btn x-large rounded class="primary-btn" to="/selection">
              Get Started Now
              <v-icon right>mdi-arrow-top-right</v-icon>
            </v-btn>

            <v-btn x-large rounded class="app-btn" @click="scrollToSection('download_app')">
              Download App
              <v-icon right>mdi-download</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script>
import bu from "@/assets/bu1.png";
import emp from "@/assets/emp.png";
import can from "@/assets/can.png";
import laundry from "@/assets/laundry.svg";

export default {
  name: "Index",

  data() {
    return {
      laundry,
      bu,
      emp,
      can,

      androidAppLink: "#",
      apkDownloadLink: "#",

      windowSize: {
        x: 0,
        y: 0,
      },

      showBurger: false,
      uid: null,
      auth_state: true,

      items: [
        {
          title: "Your domestic manager called off? You are minutes away from help.",
        },
        {
          title: "Need to replace your house help? Browse verified candidates easily.",
        },
        {
          title: "Are you a house help looking for work? Create your profile today.",
        },
        {
          title: "Bureaus can manage candidates and connect with employers faster.",
        },
      ],
    };
  },

  methods: {
    logout() {
      if (this.$fire && this.$fire.auth) {
        this.$fire.auth.signOut();
        window.location.reload(true);
      }
    },

    scrollToSection(id) {
      const target = document.getElementById(id);

      if (!target) return;

      const navOffset = 72;
      const start = window.scrollY;
      const end = target.offsetTop - navOffset;
      const distance = end - start;
      const duration = 800;
      let startTime = null;

      function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;

        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, start + distance * easeInOutQuad(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    },

    onResize() {
      if (process.client) {
        this.windowSize = {
          x: window.innerWidth,
          y: window.innerHeight,
        };

        this.showBurger = this.windowSize.x < 950;
      }

      return this.windowSize;
    },

    checkUser() {
      if (this.$fire && this.$fire.auth && this.$fire.auth.currentUser) {
        this.uid = this.$fire.auth.currentUser.uid;
        this.auth_state = true;
      } else {
        this.auth_state = false;
      }
    },
  },

  mounted() {
    this.onResize();
    // this.checkUser();
  },
};
</script>

<style scoped>
.yayalink-page {
  background: #0f1020;
  color: #ffffff;
  min-height: 100vh;
  overflow-x: hidden;
}

/* NAVBAR */
.nav-bar {
  background: rgba(5, 6, 15, 0.92) !important;
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-wrap {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.brand-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, #00ffff, #00bcd4);
  color: #05060f;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 1.2rem;
}

.brand-name {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 900;
  line-height: 1.1;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.72rem;
  margin-top: 3px;
}

.desktop-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.desktop-links button {
  color: rgba(255, 255, 255, 0.78);
  background: transparent;
  border: none;
  outline: none;
  padding: 10px 12px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
}

.desktop-links button:hover {
  color: #00ffff;
  background: rgba(0, 255, 255, 0.08);
}

.nav-cta {
  background: #00ffff !important;
  color: #05060f !important;
  font-weight: 800;
  text-transform: none;
}

.download-nav-btn {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff !important;
  font-weight: 800;
  text-transform: none;
  border: 1px solid rgba(0, 255, 255, 0.25);
}

.mobile-menu {
  background: #111325 !important;
}

/* HERO */
.hero-section {
  position: relative;
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(15, 16, 32, 0.45), rgba(15, 16, 32, 0.92)),
    url("~/assets/he.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  padding-top: 72px;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(0, 255, 255, 0.2), transparent 35%),
    radial-gradient(circle at bottom right, rgba(0, 188, 212, 0.15), transparent 35%);
  pointer-events: none;
}

.hero-container {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  padding: 9px 16px;
  border-radius: 999px;
  background: rgba(0, 255, 255, 0.12);
  border: 1px solid rgba(0, 255, 255, 0.28);
  color: #00ffff;
  font-weight: 800;
  font-size: 0.82rem;
  margin-bottom: 22px;
}

.hero-title {
  font-size: clamp(2.4rem, 6vw, 5.4rem);
  font-weight: 950;
  line-height: 1.02;
  letter-spacing: -2px;
  max-width: 900px;
  margin: 0 auto;
}

.hero-text {
  max-width: 720px;
  margin: 24px auto 0;
  color: rgba(255, 255, 255, 0.76);
  font-size: 1.1rem;
  line-height: 1.8;
}

.hero-actions {
  margin-top: 34px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.primary-btn {
  background: #00ffff !important;
  color: #05060f !important;
  font-weight: 900;
  text-transform: none;
  box-shadow: 0 14px 36px rgba(0, 255, 255, 0.22);
}

.app-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  font-weight: 900;
  text-transform: none;
  border: 1px solid rgba(0, 255, 255, 0.35);
}

.hero-slider {
  max-width: 760px;
  margin: 38px auto 0;
  padding: 12px 20px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.09);
  backdrop-filter: blur(14px);
}

.slider-text {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ffff;
  font-weight: 800;
  font-size: 1rem;
  text-align: center;
  padding: 0 12px;
}

/* SECTIONS */
.section-block {
  padding: 96px 0;
  background: #0f1020;
}

.darker-section {
  background: #0b0c18;
}

.section-kicker {
  color: #00ffff;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.78rem;
  margin-bottom: 12px;
}

.section-title {
  color: #ffffff;
  font-size: clamp(2rem, 4vw, 3.3rem);
  font-weight: 950;
  line-height: 1.1;
  letter-spacing: -1px;
  margin-bottom: 18px;
}

.section-text {
  color: rgba(255, 255, 255, 0.72);
  font-size: 1rem;
  line-height: 1.8;
}

.center-text {
  max-width: 760px;
  margin: 0 auto;
}

/* OPTION CARDS */
.option-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.06) !important;
  color: #ffffff !important;
  border-radius: 26px !important;
  padding: 26px 20px;
  text-align: center;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.09);
  transition: 0.25s ease;
}

.option-card:hover {
  transform: translateY(-8px);
  border-color: rgba(0, 255, 255, 0.35);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25) !important;
}

.card-image-wrap {
  width: 130px;
  height: 130px;
  margin: 0 auto 18px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-card h3 {
  font-size: 1.08rem;
  font-weight: 900;
  margin-bottom: 12px;
}

.option-card p {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.9rem;
  line-height: 1.65;
  min-height: 104px;
}

.card-btn {
  background: #00ffff !important;
  color: #05060f !important;
  font-weight: 900;
  text-transform: none;
}

/* HOW IT WORKS */
.image-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 34px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.step-card {
  height: 100%;
  padding: 26px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.step-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: #00ffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.step-card h3 {
  font-size: 1.25rem;
  font-weight: 900;
  margin-bottom: 10px;
}

.step-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.75;
}

.wide-step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* DOWNLOAD APP */
.download-section {
  padding: 100px 0;
  background:
    radial-gradient(circle at top right, rgba(0, 255, 255, 0.16), transparent 34%),
    radial-gradient(circle at bottom left, rgba(0, 188, 212, 0.12), transparent 30%),
    #0f1020;
}

.download-points {
  margin-top: 28px;
}

.download-point {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 13px;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 700;
}

.store-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 34px;
}

.store-btn {
  min-width: 190px;
  height: 64px;
  padding: 0 18px;
  border-radius: 20px;
  background: #00ffff;
  color: #05060f;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  font-weight: 900;
  box-shadow: 0 16px 40px rgba(0, 255, 255, 0.2);
}

.store-btn i {
  color: #05060f !important;
}

.store-btn small {
  display: block;
  font-size: 0.72rem;
  opacity: 0.8;
  line-height: 1;
}

.store-btn strong {
  display: block;
  font-size: 1.02rem;
  line-height: 1.1;
}

.alt-store {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(0, 255, 255, 0.26);
  box-shadow: none;
}

.alt-store i {
  color: #00ffff !important;
}

.download-note {
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.85rem;
}

.phone-preview-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.phone-glow {
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 999px;
  background: rgba(0, 255, 255, 0.18);
  filter: blur(60px);
  top: 80px;
}

.phone-preview {
  position: relative;
  z-index: 2;
  width: 300px;
  min-height: 610px;
  border-radius: 44px;
  padding: 12px;
  background: #05060f;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.45);
}

.phone-top {
  width: 90px;
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.25);
  margin: 10px auto 18px;
}

.phone-screen {
  min-height: 540px;
  border-radius: 34px;
  background:
    radial-gradient(circle at top, rgba(0, 255, 255, 0.18), transparent 35%),
    #101225;
  padding: 26px 18px;
  text-align: center;
}

.phone-logo {
  width: 62px;
  height: 62px;
  border-radius: 22px;
  background: #00ffff;
  color: #05060f;
  font-size: 1.8rem;
  font-weight: 950;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
}

.phone-screen h3 {
  font-weight: 950;
  margin-bottom: 8px;
}

.phone-screen p {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.9rem;
  margin-bottom: 22px;
}

.phone-card {
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  text-align: left;
  justify-content: space-between;
}

.phone-card strong {
  display: block;
  color: #ffffff;
  font-size: 0.92rem;
}

.phone-card small {
  display: block;
  color: rgba(255, 255, 255, 0.58);
  margin-top: 4px;
}

/* FEATURES */
.feature-card {
  height: 100%;
  padding: 34px 28px;
  border-radius: 28px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.07),
    rgba(255, 255, 255, 0.035)
  );
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.feature-card h3 {
  font-size: 1.35rem;
  font-weight: 900;
  margin: 18px 0 10px;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.75;
}

.bottom-cta {
  margin-top: 70px;
  padding: 46px 24px;
  border-radius: 34px;
  text-align: center;
  background:
    radial-gradient(circle at top left, rgba(0, 255, 255, 0.18), transparent 35%),
    rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(0, 255, 255, 0.18);
}

.bottom-cta h2 {
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 950;
  margin-bottom: 10px;
}

.bottom-cta p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 26px;
}

.bottom-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* MOBILE */
@media (max-width: 960px) {
  .section-block,
  .download-section {
    padding: 72px 0;
  }

  .hero-section {
    min-height: 92vh;
  }

  .hero-title {
    letter-spacing: -1px;
  }

  .wide-step {
    display: block;
  }

  .wide-step .step-icon {
    margin-bottom: 18px;
  }

  .option-card p {
    min-height: auto;
  }
}

@media (max-width: 600px) {
  .brand-subtitle {
    display: none;
  }

  .hero-text {
    font-size: 0.98rem;
  }

  .hero-actions,
  .bottom-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-actions .v-btn,
  .bottom-actions .v-btn {
    width: 100%;
  }

  .hero-slider {
    margin-top: 28px;
  }

  .slider-text {
    font-size: 0.9rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .store-buttons {
    flex-direction: column;
  }

  .store-btn {
    width: 100%;
    justify-content: center;
  }

  .phone-preview {
    width: 270px;
    min-height: 560px;
  }
}
</style>