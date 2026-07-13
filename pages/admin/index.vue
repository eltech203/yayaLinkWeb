<<template>
  <div class="admin-page">
    <!-- APP BAR -->
    <v-app-bar
      app
      dark
      elevate-on-scroll
      class="admin-app-bar"
      height="64"
    >
      <v-btn
        icon
        class="hidden-md-and-up mr-2"
        @click="drawer = !drawer"
      >
        <v-icon color="white">mdi-menu</v-icon>
      </v-btn>

      <div class="app-bar-brand">
        <div class="app-bar-logo">
          <v-icon color="cyan accent-2" size="24">mdi-shield-account</v-icon>
        </div>
        <div class="app-bar-titles hidden-sm-and-down">
          <div class="app-bar-title">YayaLink</div>
          <div class="app-bar-subtitle">Admin Portal</div>
        </div>
      </div>

      <v-spacer></v-spacer>

      <v-text-field
        v-model="quickSearch"
        dense
        hide-details
        rounded
        filled
        dark
        placeholder="Quick search..."
        prepend-inner-icon="mdi-magnify"
        class="app-bar-search hidden-sm-and-down mx-4"
        @keyup.enter="handleQuickSearch"
      ></v-text-field>

      <v-spacer></v-spacer>

      <div class="app-bar-actions">
        <v-menu
          offset-y
          left
          transition="slide-y-transition"
          min-width="360"
          max-height="480"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon class="action-btn" v-bind="attrs" v-on="on">
              <v-badge
                :content="notifications.length"
                :value="notifications.length > 0"
                color="red accent-3"
                overlap
                dot
              >
                <v-icon color="white" size="22">mdi-bell-outline</v-icon>
              </v-badge>
            </v-btn>
          </template>

          <v-list dark class="notification-list">
            <v-subheader class="notification-header">
              <span>Notifications</span>
              <v-btn text x-small color="cyan accent-2" @click="notifications = []">
                Clear all
              </v-btn>
            </v-subheader>
            <v-divider dark></v-divider>
            <v-list-item v-if="notifications.length === 0" class="notification-empty">
              <v-list-item-content>
                <v-list-item-title class="grey--text text--lighten-1 text-center">
                  No new notifications
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="(note, i) in notifications"
              :key="i"
              class="notification-item"
            >
              <v-list-item-avatar size="36" :color="note.color" class="notification-avatar">
                <v-icon size="18" dark>{{ note.icon }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="white--text text-body-2">{{ note.title }}</v-list-item-title>
                <v-list-item-subtitle class="grey--text text--lighten-1 text-caption">
                  {{ note.time }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>

        <div class="action-divider hidden-sm-and-down"></div>

        <v-menu
          offset-y
          left
          transition="slide-y-transition"
          min-width="280"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn text class="user-btn hidden-xs-only" v-bind="attrs" v-on="on">
              <v-avatar size="32" color="cyan darken-3" class="mr-3">
                <span class="white--text text-caption font-weight-bold">AD</span>
              </v-avatar>
              <div class="user-info hidden-sm-and-down text-left">
                <div class="user-name">Admin User</div>
                <div class="user-role">Super Admin</div>
              </div>
              <v-icon right size="18">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list dark class="user-menu">
            <div class="user-menu-header">
              <v-avatar size="48" color="cyan darken-3" class="mb-3">
                <span class="white--text text-h6 font-weight-bold">AD</span>
              </v-avatar>
              <div class="user-menu-name">Admin User</div>
              <div class="user-menu-email">admin@yayalink.com</div>
            </div>
            <v-divider dark class="my-2"></v-divider>
            <v-list-item link class="menu-item">
              <v-list-item-icon>
                <v-icon size="20">mdi-account-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Profile Settings</v-list-item-title>
            </v-list-item>
            <v-list-item link class="menu-item">
              <v-list-item-icon>
                <v-icon size="20">mdi-shield-key</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Change Password</v-list-item-title>
            </v-list-item>
            <v-divider dark class="my-2"></v-divider>
            <v-list-item link class="menu-item logout" @click="logout">
              <v-list-item-icon>
                <v-icon size="20" color="red lighten-1">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="red--text text--lighten-1">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- NAVIGATION DRAWER (Mobile) -->
    <v-navigation-drawer
      v-model="drawer"
      app
      dark
      temporary
      class="admin-drawer"
      width="280"
    >
      <div class="drawer-header">
        <div class="drawer-brand">
          <v-icon color="cyan accent-2" size="28" class="mr-3">mdi-shield-account</v-icon>
          <div>
            <div class="drawer-title">YayaLink</div>
            <div class="drawer-subtitle">Admin Portal</div>
          </div>
        </div>
      </div>
      <v-divider dark></v-divider>
      <v-list nav dense class="drawer-list">
        <v-list-item
          v-for="(item, i) in navItems"
          :key="i"
          link
          :class="{ 'active-nav': tab === i }"
          @click="tab = i; drawer = false"
        >
          <v-list-item-icon>
            <v-icon :color="tab === i ? 'cyan accent-2' : 'grey lighten-1'">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title :class="tab === i ? 'cyan--text text--accent-2' : 'grey--text text--lighten-1'">
            {{ item.title }}
          </v-list-item-title>
          <v-chip
            v-if="item.count"
            x-small
            :color="tab === i ? 'cyan darken-3' : 'grey darken-2'"
            dark
            class="ml-2"
          >
            {{ item.count }}
          </v-chip>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- AMBIENT BACKGROUND -->
    <div class="ambient-glow cyan"></div>
    <div class="ambient-glow purple"></div>
    <div class="ambient-glow pink"></div>

    <!-- MAIN CONTENT -->
    <v-main class="admin-main">
      <div class="page-content">
        <!-- TOP BAR -->
        <div class="top-bar">
          <div class="brand">
            <div class="brand-icon">
              <v-icon color="black" size="26">mdi-shield-account</v-icon>
            </div>
            <div>
              <h1 class="page-title">YayaLink Admin</h1>
              <p class="page-subtitle">Platform overview & management</p>
            </div>
          </div>

          <div class="top-actions">
            <!-- <v-btn
              rounded
              outlined
              color="cyan accent-2"
              dark
              class="mr-3 hidden-sm-and-down action-btn"
              @click="exportData"
              :loading="exporting"
            >
              <v-icon left size="18">mdi-download</v-icon>
              Export CSV
            </v-btn> -->

            <v-btn
              rounded
              color="cyan accent-2"
              dark
              class="action-btn primary"
              @click="refreshAll"
              style="color:#0E1018"
              :loading="loading"
            >
              <v-icon left size="18">mdi-refresh</v-icon>
              
            </v-btn>
          </div>
        </div>

        <!-- STATS GRID -->
        <v-row class="stats-row">
          <v-col cols="6" lg="2" md="4">
            <div class="stat-card" v-ripple>
              <div class="stat-glow cyan"></div>
              <div class="stat-content">
                <div class="stat-icon-wrap cyan">
                  <v-icon color="cyan accent-2" size="24">mdi-account-group</v-icon>
                </div>
                <div class="stat-details">
                  <span class="stat-value">{{ formatNumber(dashboard.total_candidates) }}</span>
                  <span class="stat-label">Candidates</span>
                  <div class="stat-mini-trend up" v-if="dashboard.candidates_trend">
                    <v-icon size="12">mdi-trending-up</v-icon>
                    +{{ dashboard.candidates_trend }}%
                  </div>
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="6" lg="2" md="4">
            <div class="stat-card" v-ripple>
              <div class="stat-glow green"></div>
              <div class="stat-content">
                <div class="stat-icon-wrap green">
                  <v-icon color="green accent-3" size="24">mdi-check-circle</v-icon>
                </div>
                <div class="stat-details">
                  <span class="stat-value">{{ formatNumber(dashboard.available_candidates) }}</span>
                  <span class="stat-label">Available</span>
                  <div class="stat-mini-trend up" v-if="dashboard.available_ratio">
                    <v-icon size="12">mdi-pulse</v-icon>
                    {{ dashboard.available_ratio }}% rate
                  </div>
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="6" lg="2" md="4">
            <div class="stat-card" v-ripple>
              <div class="stat-glow orange"></div>
              <div class="stat-content">
                <div class="stat-icon-wrap orange">
                  <v-icon color="orange accent-3" size="24">mdi-account-tie</v-icon>
                </div>
                <div class="stat-details">
                  <span class="stat-value">{{ formatNumber(dashboard.total_employers) }}</span>
                  <span class="stat-label">Employers</span>
                  <div class="stat-mini-trend up" v-if="dashboard.employers_trend">
                    <v-icon size="12">mdi-trending-up</v-icon>
                    +{{ dashboard.employers_trend }}%
                  </div>
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="6" lg="2" md="4">
            <div class="stat-card" v-ripple>
              <div class="stat-glow purple"></div>
              <div class="stat-content">
                <div class="stat-icon-wrap purple">
                  <v-icon color="purple accent-2" size="24">mdi-office-building</v-icon>
                </div>
                <div class="stat-details">
                  <span class="stat-value">{{ formatNumber(dashboard.total_bureaus) }}</span>
                  <span class="stat-label">Bureaus</span>
                  <div class="stat-mini-trend up" v-if="dashboard.bureaus_trend">
                    <v-icon size="12">mdi-trending-up</v-icon>
                    +{{ dashboard.bureaus_trend }}%
                  </div>
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="6" lg="2" md="4">
            <div class="stat-card" v-ripple>
              <div class="stat-glow pink"></div>
              <div class="stat-content">
                <div class="stat-icon-wrap pink">
                  <v-icon color="pink accent-2" size="24">mdi-cash-multiple</v-icon>
                </div>
                <div class="stat-details">
                  <span class="stat-value">KES {{ formatMoney(dashboard.total_revenue) }}</span>
                  <span class="stat-label">Total Revenue</span>
                  <div class="stat-mini-trend up" v-if="dashboard.revenue_trend">
                    <v-icon size="12">mdi-trending-up</v-icon>
                    +{{ dashboard.revenue_trend }}%
                  </div>
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="6" lg="2" md="4">
            <div class="stat-card" v-ripple>
              <div class="stat-glow yellow"></div>
              <div class="stat-content">
                <div class="stat-icon-wrap yellow">
                  <v-icon color="yellow accent-2" size="24">mdi-calendar-clock</v-icon>
                </div>
                <div class="stat-details">
                  <span class="stat-value">KES {{ formatMoney(dashboard.monthly_revenue) }}</span>
                  <span class="stat-label">This Month</span>
                  <div class="stat-mini-trend" :class="dashboard.monthly_trend >= 0 ? 'up' : 'down'" v-if="dashboard.monthly_trend">
                    <v-icon size="12">{{ dashboard.monthly_trend >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
                    {{ dashboard.monthly_trend >= 0 ? '+' : '' }}{{ dashboard.monthly_trend }}%
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- SEARCH & FILTERS -->
        <div class="control-bar">
          <div class="search-box">
            <v-icon class="search-icon" size="20">mdi-magnify</v-icon>
            <input 
              v-model="search" 
              type="text" 
              placeholder="Search candidates by name, phone, county..." 
              @keyup.enter="searchCandidates"
            />
            <button v-if="search" class="search-clear" @click="clearSearch">
              <v-icon size="16">mdi-close</v-icon>
            </button>
            <button class="search-btn" @click="searchCandidates" :disabled="searchLoading">
              <v-icon size="18" v-if="!searchLoading">mdi-arrow-right</v-icon>
              <v-progress-circular v-else size="18" width="2" color="white" indeterminate />
            </button>
          </div>

          <v-chip-group
            v-model="statusFilter"
            active-class="active-filter"
            dark
            class="filter-pills"
            v-show="tab === 0"
            mandatory
          >
            <v-chip outlined small>All</v-chip>
            <v-chip outlined small>Available</v-chip>
            <v-chip outlined small>Placed</v-chip>
            <v-chip outlined small>Inactive</v-chip>
          </v-chip-group>
        </div>

        <!-- TABS -->
        <v-tabs
          v-model="tab"
          background-color="transparent"
          color="cyan accent-2"
          dark
          class="modern-tabs"
          show-arrows
          height="48"
        >
          <v-tab>
            <span class="tab-inner">
              <v-icon size="18" left>mdi-account-group</v-icon>
              Candidates
              <span class="tab-badge" v-if="candidates.length">{{ candidates.length }}</span>
            </span>
          </v-tab>
          <v-tab>
            <span class="tab-inner">
              <v-icon size="18" left>mdi-account-tie</v-icon>
              Employers
              <span class="tab-badge orange" v-if="employers.length">{{ employers.length }}</span>
            </span>
          </v-tab>
          <v-tab>
            <span class="tab-inner">
              <v-icon size="18" left>mdi-office-building</v-icon>
              Bureaus
              <span class="tab-badge purple" v-if="bureaus.length">{{ bureaus.length }}</span>
            </span>
          </v-tab>
          <v-tab>
            <span class="tab-inner">
              <v-icon size="18" left>mdi-credit-card</v-icon>
              Payments
              <span class="tab-badge green" v-if="payments.length">{{ payments.length }}</span>
            </span>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" class="transparent-tabs" style="background: #0E1018;">
          <v-tab-item v-for="(section, idx) in sections" :key="idx">
            <transition name="fade-slide" mode="out-in">
              <div class="data-panel" v-if="tab === idx">
                <div class="panel-header">
                  <div class="panel-title">
                    <v-icon :color="section.color" size="22" class="mr-3">{{ section.icon }}</v-icon>
                    <span>{{ section.title }}</span>
                  </div>
                  <v-btn icon small dark color="grey lighten-1" @click="section.refresh">
                    <v-icon size="18">mdi-refresh</v-icon>
                  </v-btn>
                </div>

                <div class="table-container">
                  <v-data-table
                  dark
                    :headers="section.headers"
                    :items="section.items"
                    class="modern-table"
                    :loading="tableLoading"
                    :items-per-page="10"
                    :footer-props="footerProps"
                    loading-text="Loading data..."
                    no-data-text="No records found"
                  >
                    <template v-if="idx === 0" v-slot:item.candidate_name="{ item }">
                      <div class="user-cell">
                        <div class="avatar" :style="{ background: stringToColor(item.candidate_name) }">
                          {{ getInitials(item.candidate_name) }}
                        </div>
                        <div class="user-info">
                          <div class="name">{{ item.candidate_name }}</div>
                          <div class="meta">{{ item.ward }} • {{ item.bureau_name }}</div>
                        </div>
                      </div>
                    </template>

                    <template v-if="idx === 0" v-slot:item.mobile_no="{ item }">
                      <span class="mono-text">{{ item.mobile_no }}</span>
                    </template>

                    <template v-if="idx === 0" v-slot:item.status="{ item }">
                      <span class="status-badge" :class="item.status?.toLowerCase()">
                        <span class="dot"></span>
                        {{ item.status }}
                      </span>
                    </template>

                    <template v-if="idx === 0" v-slot:item.actions="{ item }">
                      <button class="icon-btn danger" @click="confirmDelete('candidate', item)">
                        <v-icon size="18">mdi-delete</v-icon>
                      </button>
                    </template>

                    <template v-if="idx === 1" v-slot:item.name="{ item }">
                      <div class="user-cell">
                        <div class="avatar orange">{{ getInitials(item.name) }}</div>
                        <div class="user-info">
                          <div class="name">{{ item.name }}</div>
                        </div>
                      </div>
                    </template>

                    <template v-if="idx === 1" v-slot:item.phone_no="{ item }">
                      <span class="mono-text">{{ item.phone_no }}</span>
                    </template>

                    <template v-if="idx === 1" v-slot:item.actions="{ item }">
                      <button class="icon-btn danger" @click="confirmDelete('employer', item)">
                        <v-icon size="18">mdi-delete</v-icon>
                      </button>
                    </template>

                    <template v-if="idx === 2" v-slot:item.bureau_name="{ item }">
                      <div class="user-cell">
                        <div class="avatar purple">{{ getInitials(item.bureau_name) }}</div>
                        <div class="user-info">
                          <div class="name">{{ item.bureau_name }}</div>
                        </div>
                      </div>
                    </template>

                    <template v-if="idx === 2" v-slot:item.phone_no="{ item }">
                      <span class="mono-text">{{ item.phone_no }}</span>
                    </template>

                    <template v-if="idx === 2" v-slot:item.actions="{ item }">
                      <button class="icon-btn danger" @click="confirmDelete('bureau', item)">
                        <v-icon size="18">mdi-delete</v-icon>
                      </button>
                    </template>

                    <template v-if="idx === 3" v-slot:item.amount="{ item }">
                      <span class="amount-text">KES {{ formatMoney(item.amount) }}</span>
                    </template>

                    <template v-if="idx === 3" v-slot:item.created_at="{ item }">
                      <span class="date-badge">
                        <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                        {{ formatDate(item.created_at) }}
                      </span>
                    </template>

                    <template v-if="idx === 3" v-slot:item.mpesa_receipt="{ item }">
                      <div class="receipt-cell">
                        <v-icon size="16" color="green accent-3" class="mr-2">mdi-check-circle</v-icon>
                        <span class="mono-text">{{ item.mpesa_receipt }}</span>
                      </div>
                    </template>

                    <template v-if="idx === 3" v-slot:item.phone_no="{ item }">
                      <span class="mono-text">{{ item.phone_no }}</span>
                    </template>
                  </v-data-table>
                </div>
              </div>
            </transition>
          </v-tab-item>
        </v-tabs-items>

        <!-- DELETE DIALOG -->
        <v-dialog v-model="deleteDialog" max-width="440" persistent content-class="glass-dialog">
          <v-card dark class="delete-card">
            <div class="delete-icon-wrap">
              <v-icon size="40" color="red lighten-1">mdi-delete-circle</v-icon>
            </div>
            <v-card-title class="delete-title">Delete {{ deleteType }}</v-card-title>
            <v-card-text class="delete-text">
              Are you sure you want to permanently delete 
              <strong class="white--text">{{ deleteTargetName }}</strong>? 
              This action cannot be reversed.
            </v-card-text>
            <v-card-actions class="delete-actions">
              <v-btn text dark color="grey lighten-1" @click="deleteDialog = false" class="px-6">Cancel</v-btn>
              <v-btn dark color="red darken-1" @click="executeDelete" :loading="deleteLoading" class="px-6" rounded>
                <v-icon left size="18">mdi-delete</v-icon>
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- SNACKBAR -->
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="4000"
          top
          right
          rounded="lg"
          elevation="16"
          min-width="320"
        >
          <div class="snack-content">
            <div class="snack-icon" :class="snackbar.color">
              <v-icon color="white" size="20">{{ snackbar.icon }}</v-icon>
            </div>
            <span class="font-weight-medium">{{ snackbar.message }}</span>
          </div>
        </v-snackbar>
      </div>
    </v-main>
  </div>
</template>

<script>
const API_BASE = "https://yayalinkserver-production-cc96.up.railway.app";
import axios from "axios";

export default {
  name: "AdminDashboard",

  data() {
    return {
      drawer: false,
      quickSearch: "",
      tab: 0,
      search: "",
      statusFilter: 0,
      loading: false,
      tableLoading: false,
      searchLoading: false,
      exporting: false,
      deleteDialog: false,
      deleteLoading: false,
      deleteTarget: null,
      deleteType: null,

      notifications: [
        { title: "New candidate registered", time: "2 min ago", icon: "mdi-account-plus", color: "cyan" },
        { title: "Payment received KES 5,000", time: "15 min ago", icon: "mdi-cash-check", color: "green" },
        { title: "Bureau approval pending", time: "1 hr ago", icon: "mdi-office-building", color: "orange" }
      ],

      dashboard: {
        total_candidates: 0,
        available_candidates: 0,
        total_employers: 0,
        total_bureaus: 0,
        total_revenue: 0,
        monthly_revenue: 0,
        candidates_trend: 12,
        available_ratio: 78,
        employers_trend: 8,
        bureaus_trend: 5,
        revenue_trend: 24,
        monthly_trend: 15
      },

      candidates: [],
      employers: [],
      bureaus: [],
      payments: [],

      footerProps: {
        itemsPerPageOptions: [5, 10, 25, 50],
        showFirstLastPage: true,
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        prevIcon: 'mdi-chevron-left',
        nextIcon: 'mdi-chevron-right'
      },

      candidateHeaders: [
        { text: "Candidate", value: "candidate_name", width: "25%" },
        { text: "Phone", value: "mobile_no", width: "15%" },
        { text: "County", value: "county", width: "12%" },
        { text: "Ward", value: "ward", width: "12%" },
        { text: "Bureau", value: "bureau_name", width: "15%" },
        { text: "Bureau No", value: "bureau_no", width: "10%" },
        { text: "Status", value: "status", width: "10%", align: "center" },
        { text: "", value: "actions", sortable: false, width: "8%", align: "center" },
      ],

      employerHeaders: [
        { text: "Employer", value: "name", width: "40%" },
        { text: "Phone", value: "phone_no", width: "30%" },
        { text: "County", value: "county", width: "20%" },
        { text: "", value: "actions", sortable: false, width: "10%", align: "center" },
      ],

      bureauHeaders: [
        { text: "Bureau", value: "bureau_name", width: "40%" },
        { text: "Phone", value: "phone_no", width: "30%" },
        { text: "County", value: "county", width: "20%" },
        { text: "", value: "actions", sortable: false, width: "10%", align: "center" },
      ],

      paymentHeaders: [
        { text: "Receipt", value: "mpesa_receipt", width: "25%" },
        { text: "Amount", value: "amount", width: "20%", align: "right" },
        { text: "Phone", value: "phone_no", width: "25%" },
        { text: "Date", value: "created_at", width: "20%" },
      ],

      snackbar: {
        show: false,
        message: "",
        color: "success",
        icon: "mdi-check-circle"
      }
    };
  },

  computed: {
    filteredCandidates() {
      let filtered = this.candidates;
      if (this.statusFilter === 1) filtered = filtered.filter(c => c.status === 'Available');
      if (this.statusFilter === 2) filtered = filtered.filter(c => c.status === 'Placed');
      if (this.statusFilter === 3) filtered = filtered.filter(c => c.status === 'Inactive');
      return filtered;
    },

    sections() {
      return [
        { 
          title: 'Candidates', 
          icon: 'mdi-account-group', 
          color: 'cyan accent-2',
          headers: this.candidateHeaders, 
          items: this.filteredCandidates,
          refresh: this.fetchCandidates 
        },
        { 
          title: 'Employers', 
          icon: 'mdi-account-tie', 
          color: 'orange accent-3',
          headers: this.employerHeaders, 
          items: this.employers,
          refresh: this.fetchEmployers 
        },
        { 
          title: 'Bureaus', 
          icon: 'mdi-office-building', 
          color: 'purple accent-2',
          headers: this.bureauHeaders, 
          items: this.bureaus,
          refresh: this.fetchBureaus 
        },
        { 
          title: 'Payments', 
          icon: 'mdi-credit-card', 
          color: 'green accent-3',
          headers: this.paymentHeaders, 
          items: this.payments,
          refresh: this.fetchPayments 
        }
      ];
    },

    navItems() {
      return [
        { title: "Candidates", icon: "mdi-account-group", count: this.candidates.length },
        { title: "Employers", icon: "mdi-account-tie", count: this.employers.length },
        { title: "Bureaus", icon: "mdi-office-building", count: this.bureaus.length },
        { title: "Payments", icon: "mdi-credit-card", count: this.payments.length }
      ];
    },

    deleteTargetName() {
      if (!this.deleteTarget) return '';
      return this.deleteTarget.candidate_name || this.deleteTarget.name || this.deleteTarget.bureau_name || 'Unknown';
    }
  },

  mounted() {
    this.refreshAll();
  },

  methods: {
    formatMoney(value) {
      if (!value) return "0";
      return Number(value).toLocaleString();
    },

    formatNumber(value) {
      if (!value) return "0";
      if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
      if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
      return value.toString();
    },

    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    },

    getInitials(name) {
      if (!name) return '?';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },

    stringToColor(str) {
      const colors = ['#00BCD4', '#4CAF50', '#FF9800', '#9C27B0', '#E91E63', '#3F51B5', '#009688'];
      let hash = 0;
      for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
      return colors[Math.abs(hash) % colors.length];
    },

    showSnackbar(message, color = 'success', icon = 'mdi-check-circle') {
      this.snackbar = { show: true, message, color, icon };
    },

    async refreshAll() {
      this.loading = true;
      await Promise.all([
        this.fetchDashboard(),
        this.fetchCandidates(),
        this.fetchEmployers(),
        this.fetchBureaus(),
        this.fetchPayments()
      ]);
      this.loading = false;
      this.showSnackbar('Dashboard refreshed');
    },

    async fetchDashboard() {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/dashboard`);
        this.dashboard = { ...this.dashboard, ...res.data };
      } catch (error) {
        this.showSnackbar('Failed to load dashboard', 'error', 'mdi-alert');
        console.error(error);
      }
    },

    async fetchCandidates() {
      this.tableLoading = true;
      try {
        const res = await axios.get(`${API_BASE}/api/admin/candidates`);
        this.candidates = res.data;
      } catch (error) {
        this.showSnackbar('Failed to load candidates', 'error', 'mdi-alert');
        console.error(error);
      } finally {
        this.tableLoading = false;
      }
    },

    async fetchEmployers() {
      this.tableLoading = true;
      try {
        const res = await axios.get(`${API_BASE}/api/admin/employers`);
        this.employers = res.data;
      } catch (error) {
        this.showSnackbar('Failed to load employers', 'error', 'mdi-alert');
        console.error(error);
      } finally {
        this.tableLoading = false;
      }
    },

    async fetchBureaus() {
      this.tableLoading = true;
      try {
        const res = await axios.get(`${API_BASE}/api/admin/bureaus`);
        this.bureaus = res.data;
      } catch (error) {
        this.showSnackbar('Failed to load bureaus', 'error', 'mdi-alert');
        console.error(error);
      } finally {
        this.tableLoading = false;
      }
    },

    async fetchPayments() {
      this.tableLoading = true;
      try {
        const res = await axios.get(`${API_BASE}/api/admin/payments`);
        this.payments = res.data;
      } catch (error) {
        this.showSnackbar('Failed to load payments', 'error', 'mdi-alert');
        console.error(error);
      } finally {
        this.tableLoading = false;
      }
    },

    async searchCandidates() {
      if (!this.search.trim()) {
        this.fetchCandidates();
        return;
      }
      this.searchLoading = true;
      try {
        const res = await axios.get(`${API_BASE}/api/admin/search/candidates?keyword=${this.search}`);
        this.candidates = res.data;
        this.showSnackbar(`Found ${res.data.length} results`, 'info', 'mdi-magnify');
      } catch (error) {
        this.showSnackbar('Search failed', 'error', 'mdi-alert');
        console.error(error);
      } finally {
        this.searchLoading = false;
      }
    },

    clearSearch() {
      this.search = "";
      this.fetchCandidates();
    },

    confirmDelete(type, item) {
      this.deleteType = type;
      this.deleteTarget = item;
      this.deleteDialog = true;
    },

    async executeDelete() {
      this.deleteLoading = true;
      try {
        let endpoint = '';
        if (this.deleteType === 'candidate') endpoint = `/api/admin/candidate/${this.deleteTarget.candidate_id}`;
        else if (this.deleteType === 'employer') endpoint = `/api/admin/employer/${this.deleteTarget.uid}`;
        else if (this.deleteType === 'bureau') endpoint = `/api/admin/bureau/${this.deleteTarget.user_id}`;

        await axios.delete(`${API_BASE}${endpoint}`);
        this.showSnackbar('Deleted successfully', 'success', 'mdi-delete');
        
        if (this.deleteType === 'candidate') this.fetchCandidates();
        else if (this.deleteType === 'employer') this.fetchEmployers();
        else if (this.deleteType === 'bureau') this.fetchBureaus();
        
        this.fetchDashboard();
      } catch (error) {
        this.showSnackbar('Delete failed', 'error', 'mdi-alert');
        console.error(error);
      } finally {
        this.deleteLoading = false;
        this.deleteDialog = false;
        this.deleteTarget = null;
      }
    },

    async exportData() {
      this.exporting = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.showSnackbar('Export ready', 'success', 'mdi-download');
      } catch (error) {
        this.showSnackbar('Export failed', 'error', 'mdi-alert');
      } finally {
        this.exporting = false;
      }
    },

    handleQuickSearch() {
      if (this.quickSearch.trim()) {
        this.search = this.quickSearch;
        this.searchCandidates();
      }
    },

    logout() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
/* ===== APP BAR ===== */
.admin-app-bar {
  background: #0E1018 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}

.app-bar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-bar-logo {
  width: 40px;
  height: 40px;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
}

.app-bar-titles {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.app-bar-title {
  color: #fff;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.3px;
}

.app-bar-subtitle {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  font-weight: 500;
}

.app-bar-search {
  max-width: 280px;
}

.app-bar-search ::v-deep .v-input__slot {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  min-height: 40px !important;
}

.app-bar-search ::v-deep input {
  color: #fff !important;
  font-size: 0.85rem;
}

.app-bar-search ::v-deep .v-icon {
  color: rgba(255, 255, 255, 0.3) !important;
}

.app-bar-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.action-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 8px;
}

.user-btn {
  text-transform: none;
  letter-spacing: 0;
  padding: 0 8px 0 12px;
  height: 44px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.user-info {
  line-height: 1.2;
}

.user-name {
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
}

.user-role {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== NOTIFICATIONS ===== */
.notification-list {
  background: #1A1B2B !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
}

.notification-empty {
  padding: 24px 16px;
}

.notification-item {
  padding: 12px 16px;
  transition: all 0.2s ease;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.notification-avatar {
  border-radius: 10px;
}

/* ===== USER MENU ===== */
.user-menu {
  background: #1A1B2B !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
}

.user-menu-header {
  padding: 24px 16px 16px;
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
}

.user-menu-name {
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
}

.user-menu-email {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  margin-top: 4px;
}

.menu-item {
  min-height: 44px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.menu-item.logout:hover {
  background: rgba(255, 82, 82, 0.05);
}

/* ===== DRAWER ===== */
.admin-drawer {
  background: #0E1018 !important;
  border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.drawer-header {
  padding: 24px 20px;
}

.drawer-brand {
  display: flex;
  align-items: center;
}

.drawer-title {
  color: #fff;
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: -0.3px;
}

.drawer-subtitle {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
}

.drawer-list {
  padding: 12px;
}

.drawer-list .v-list-item {
  border-radius: 12px;
  margin-bottom: 4px;
  min-height: 48px;
  transition: all 0.3s ease;
}

.drawer-list .v-list-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.drawer-list .v-list-item.active-nav {
  background: rgba(0, 255, 255, 0.08);
}

/* ===== MAIN ===== */
.admin-main {
  background: #08090F;
}

.page-content {
  padding: 32px;
}

/* ===== BASE ===== */
.admin-page {
  min-height: 100vh;
  background: #08090F;
  color: #E2E8F0;
  position: relative;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* ===== AMBIENT BACKGROUND ===== */
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

/* ===== TOP BAR ===== */
.top-bar {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-icon {
  width: 44px;
  height: 44px;
  background: #00FFFF;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.25);
}

.page-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 2px;
  letter-spacing: -0.5px;
  color: #fff;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
  margin: 0;
  font-weight: 500;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.action-btn.primary {
  box-shadow: 0 4px 20px rgba(0, 255, 255, 0.25);
}

.action-btn.primary:hover {
  box-shadow: 0 6px 30px rgba(0, 255, 255, 0.4);
  transform: translateY(-1px);
}

/* ===== STATS ===== */
.stats-row {
  position: relative;
  z-index: 1;
  margin-bottom: 8px;
}

.stat-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.stat-glow {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.stat-glow.cyan { background: rgba(0, 255, 255, 0.4); }
.stat-glow.green { background: rgba(105, 240, 174, 0.4); }
.stat-glow.orange { background: rgba(255, 193, 7, 0.4); }
.stat-glow.purple { background: rgba(206, 147, 216, 0.4); }
.stat-glow.pink { background: rgba(255, 107, 157, 0.4); }
.stat-glow.yellow { background: rgba(255, 235, 59, 0.4); }

.stat-card:hover .stat-glow {
  opacity: 1;
}

.stat-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
}

.stat-icon-wrap.cyan { box-shadow: 0 0 20px rgba(0, 255, 255, 0.15); }
.stat-icon-wrap.green { box-shadow: 0 0 20px rgba(105, 240, 174, 0.15); }
.stat-icon-wrap.orange { box-shadow: 0 0 20px rgba(255, 193, 7, 0.15); }
.stat-icon-wrap.purple { box-shadow: 0 0 20px rgba(206, 147, 216, 0.15); }
.stat-icon-wrap.pink { box-shadow: 0 0 20px rgba(255, 107, 157, 0.15); }
.stat-icon-wrap.yellow { box-shadow: 0 0 20px rgba(255, 235, 59, 0.15); }

.stat-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 4px;
  font-weight: 500;
}

.stat-mini-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 0.7rem;
  font-weight: 600;
}

.stat-mini-trend.up { color: #69F0AE; }
.stat-mini-trend.down { color: #FF5252; }

/* ===== CONTROL BAR ===== */
.control-bar {
  position: relative;
  z-index: 1;
  margin: 32px 0 24px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 4px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 0 4px rgba(0, 255, 255, 0.05);
}

.search-icon {
  color: rgba(255, 255, 255, 0.3);
  margin-left: 12px;
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  padding: 10px 12px;
  font-size: 0.9rem;
  font-family: inherit;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.search-clear {
  color: rgba(255, 255, 255, 0.4);
  padding: 4px;
  margin-right: 4px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
  background: transparent;
  border: none;
}

.search-clear:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.search-btn {
  background: #00FFFF;
  color: #000;
  border: none;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover:not(:disabled) {
  background: #00E5FF;
  box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
  transform: scale(1.05);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.filter-pills {
  margin-top: 16px;
}

.filter-pills ::v-deep .v-chip {
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.5) !important;
  font-weight: 500;
  transition: all 0.3s ease;
}

.filter-pills ::v-deep .v-chip.active-filter {
  background: rgba(0, 255, 255, 0.1) !important;
  border-color: rgba(0, 255, 255, 0.3) !important;
  color: #00FFFF !important;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
}

/* ===== TABS ===== */
.modern-tabs {
  position: relative;
  z-index: 1;
}

.modern-tabs ::v-deep .v-tabs-bar {
  background: transparent !important;
}

.modern-tabs ::v-deep .v-tab {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
  font-size: 0.9rem;
  padding: 0 8px;
  color: rgba(255, 255, 255, 0.4) !important;
  transition: all 0.3s ease;
}

.modern-tabs ::v-deep .v-tab--active {
  color: #00FFFF !important;
}

.tab-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-badge {
  background: rgba(0, 255, 255, 0.15);
  color: #00FFFF;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-left: 4px;
}

.tab-badge.orange { background: rgba(255, 193, 7, 0.15); color: #FFC107; }
.tab-badge.purple { background: rgba(206, 147, 216, 0.15); color: #CE93D8; }
.tab-badge.green { background: rgba(105, 240, 174, 0.15); color: #69F0AE; }

/* ===== DATA PANEL ===== */
.data-panel {
  position: relative;
  z-index: 1;
  margin-top: 16px;
  background: #0E1018;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.panel-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  color: #fff;
}

/* ===== TABLE CONTAINER ===== */
.table-container {
  background: #0A0C14;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

/* ===== TABLE ===== */
.modern-table {
  background: #0A0C14 !important;
  color: #E2E8F0 !important;
}

.modern-table ::v-deep .v-data-table__wrapper {
  background: #0A0C14;
}

.modern-table ::v-deep .v-data-table-header {
  background: #0F111A !important;
}

.modern-table ::v-deep th {
  font-size: 0.7rem !important;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.4) !important;
  font-weight: 700 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  height: 48px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  background: #0F111A !important;
}

.modern-table ::v-deep td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  height: 64px !important;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85) !important;
  background: #0A0C14 !important;
}

.modern-table ::v-deep tr:hover td {
  background: #12141F !important;
}

.modern-table ::v-deep .v-data-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
  margin-top: 0;
  padding: 8px 16px;
  background: #0F111A !important;
  color: rgba(255, 255, 255, 0.5) !important;
}

.modern-table ::v-deep .v-data-footer__select {
  color: rgba(255, 255, 255, 0.5) !important;
}

.modern-table ::v-deep .v-data-footer__icons-before .v-btn,
.modern-table ::v-deep .v-data-footer__icons-after .v-btn {
  color: rgba(255, 255, 255, 0.4) !important;
}

.modern-table ::v-deep .v-data-footer__pagination {
  color: rgba(255, 255, 255, 0.6) !important;
  font-weight: 600;
}

/* Loading state */
.modern-table ::v-deep .v-data-table__progress .v-progress-linear {
  background: rgba(0, 255, 255, 0.05) !important;
}

.modern-table ::v-deep .v-data-table__progress .v-progress-linear__indeterminate {
  background: #00FFFF !important;
}

/* ===== TABLE CELLS ===== */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.avatar.orange { background: linear-gradient(135deg, #FF9800, #F57C00); }
.avatar.purple { background: linear-gradient(135deg, #AB47BC, #7B1FA2); }

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name {
  font-weight: 600;
  color: #fff !important;
  font-size: 0.9rem;
}

.meta {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35) !important;
  margin-top: 2px;
}

.mono-text {
  font-family: 'SF Mono', 'Courier New', Consolas, monospace;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6) !important;
  letter-spacing: 0.5px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border: 1px solid transparent;
}

.status-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.available {
  background: rgba(105, 240, 174, 0.1);
  border-color: rgba(105, 240, 174, 0.2);
  color: #69F0AE !important;
}

.status-badge.available .dot { background: #69F0AE; box-shadow: 0 0 8px #69F0AE; }

.status-badge.placed {
  background: rgba(66, 165, 245, 0.1);
  border-color: rgba(66, 165, 245, 0.2);
  color: #42A5F5 !important;
}

.status-badge.placed .dot { background: #42A5F5; box-shadow: 0 0 8px #42A5F5; }

.status-badge.inactive {
  background: rgba(158, 158, 158, 0.1);
  border-color: rgba(158, 158, 158, 0.2);
  color: #9E9E9E !important;
}

.status-badge.inactive .dot { background: #9E9E9E; }

.status-badge.pending {
  background: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 0.2);
  color: #FFC107 !important;
}

.status-badge.pending .dot { background: #FFC107; box-shadow: 0 0 8px #FFC107; }

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: rgba(255, 82, 82, 0.1);
  color: #FF5252;
}

.icon-btn.danger:hover {
  box-shadow: 0 0 15px rgba(255, 82, 82, 0.2);
}

.amount-text {
  color: #69F0AE !important;
  font-weight: 700;
  font-size: 0.95rem;
}

.date-badge {
  display: inline-flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.4) !important;
  font-size: 0.8rem;
}

.receipt-cell {
  display: flex;
  align-items: center;
}

/* ===== DIALOG ===== */
.glass-dialog {
  border-radius: 24px !important;
  overflow: hidden;
}

.delete-card {
  background: linear-gradient(180deg, #1a1b2e 0%, #12131f 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 32px 24px 24px;
  text-align: center;
}

.delete-icon-wrap {
  width: 72px;
  height: 72px;
  background: rgba(255, 82, 82, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 0 30px rgba(255, 82, 82, 0.15);
}

.delete-title {
  justify-content: center;
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  color: #fff !important;
  padding-bottom: 8px !important;
}

.delete-text {
  color: rgba(255, 255, 255, 0.5) !important;
  font-size: 0.95rem !important;
  line-height: 1.6 !important;
  text-align: center;
  padding-bottom: 24px !important;
}

.delete-actions {
  justify-content: center;
  gap: 12px;
  padding-top: 0 !important;
}

/* ===== SNACKBAR ===== */
.snack-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.snack-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.snack-icon.success { background: rgba(105, 240, 174, 0.2); }
.snack-icon.error { background: rgba(255, 82, 82, 0.2); }
.snack-icon.info { background: rgba(66, 165, 245, 0.2); }

/* ===== TRANSITIONS ===== */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .page-content {
    padding: 20px 16px;
  }

  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .top-actions {
    width: 100%;
  }

  .top-actions .v-btn {
    flex: 1;
  }

  .search-box {
    max-width: 100%;
  }

  .data-panel {
    padding: 20px 16px;
    border-radius: 20px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon-wrap {
    width: 38px;
    height: 38px;
  }

  .stat-value {
    font-size: 1.1rem;
  }
}
</style>