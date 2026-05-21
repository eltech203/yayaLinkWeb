<template>
<v-app dark class="" style="background-color: #1A1B2B;">

  

    <v-main>
        <Nuxt />
    </v-main>

    <v-footer class="app-footer" dark :absolute="!fixed" app>
  <div class="footer-content">
    <div class="footer-brand">
      <div class="footer-logo">
        <v-icon color="cyan accent-2" size="18" class="mr-2">mdi-shield-account</v-icon>
        <span class="brand-name">YayaLink</span>
      </div>
      <span class="footer-divider">|</span>
      <span class="footer-copy">&copy; {{ new Date().getFullYear() }}</span>
    </div>
    
    <div class="footer-meta">
      
      <span class="footer-version">v2.0</span>
    </div>
  </div>
</v-footer>
</v-app>
</template>

<script>
export default {
    name: 'DefaultLayout',
    data() {
        return {
            clipped: false,
            auth_state: false,
            drawer: false,
            fixed: false,
            items: [{
                    icon: 'mdi-account',
                    title: 'Account',
                    to: '/'
                },
                {
                    icon: 'mdi-wallet',
                    title: 'Wallet',
                    to: '/inspire'
                }
            ],
            miniVariant: false,
            right: true,
            rightDrawer: false,
            title: ''
        }
    },
    methods: {
        logout() {
            this.$fire.auth.signOut();
            window.location.reload(true);
        },

    },
}
</script>

<style>


* {
    font-family: "Quicksand", sans-serif;
    scroll-behavior: smooth;
    overflow: hidden;

}


.app-footer {
  background: #0E1018 !important;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0 32px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  width: 100%;
  max-width: 1400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo {
  display: flex;
  align-items: center;
}

.brand-name {
  color: #00FFFF;
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: -0.3px;
}

.footer-divider {
  color: rgba(255, 255, 255, 0.15);
  font-weight: 300;
}

.footer-copy {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.85rem;
  font-weight: 500;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-tag {
  background: rgba(0, 255, 255, 0.08);
  color: rgba(0, 255, 255, 0.7);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1px solid rgba(0, 255, 255, 0.1);
}

.footer-version {
  color: rgba(255, 255, 255, 0.25);
  font-size: 0.75rem;
  font-family: 'SF Mono', monospace;
}

@media (max-width: 768px) {
  .app-footer {
    padding: 0 16px;
    height: auto;
    min-height: 56px;
  }

  .footer-content {
    flex-direction: column;
    gap: 8px;
    padding: 12px 0;
  }

  .footer-meta {
    gap: 8px;
  }
}
</style>
