<template>
  <div class="admin-page">
    <!-- APP BAR -->
    <v-app-bar app dark elevate-on-scroll class="admin-app-bar" height="64">
      <v-btn icon class="hidden-md-and-up mr-2" @click="drawer = !drawer">
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
        <v-menu offset-y left transition="slide-y-transition" min-width="360" max-height="480">
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
            <v-list-item v-for="(note, i) in notifications" :key="i" class="notification-item">
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

        <v-menu offset-y left transition="slide-y-transition" min-width="280">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text class="user-btn hidden-xs-only" v-bind="attrs" v-on="on">
              <v-avatar size="32" color="cyan darken-3" class="mr-3">
                <span class="white--text text-caption font-weight-bold">AD</span>
              </v-avatar>
              <div class="user-info hidden-sm-and-down text-left">
                <div class="user-name">{{ adminName }}</div>
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
              <div class="user-menu-name">{{ adminName }}</div>
              <div class="user-menu-email">{{ adminEmail || "admin@yayalink.com" }}</div>
            </div>
            <v-divider dark class="my-2"></v-divider>
            <v-list-item link class="menu-item" @click="logout">
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
    <v-navigation-drawer v-model="drawer" app dark temporary class="admin-drawer" width="280">
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
          <v-chip v-if="item.count" x-small :color="tab === i ? 'cyan darken-3' : 'grey darken-2'" dark class="ml-2">
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
            <v-btn
              v-if="tab === 0"
              rounded
              color="cyan accent-2"
              dark
              class="action-btn"
              style="color:#0E1018"
              @click="openCreateDialog('candidate')"
            >
              <v-icon left size="18">mdi-plus</v-icon>
              Add Candidate
            </v-btn>

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
              Refresh
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
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- SEARCH & FILTERS -->
        <div class="control-bar" v-if="tab !== 4 && tab !== 5">
          <div class="search-box">
            <v-icon class="search-icon" size="20">mdi-magnify</v-icon>
            <input
              v-model="search"
              type="text"
              placeholder="Search across the current tab..."
              @keyup.enter="applySearch"
            />
            <button v-if="search" class="search-clear" @click="clearSearch">
              <v-icon size="16">mdi-close</v-icon>
            </button>
            <button class="search-btn" @click="applySearch" :disabled="searchLoading">
              <v-icon size="18" v-if="!searchLoading">mdi-arrow-right</v-icon>
              <v-progress-circular v-else size="18" width="2" color="white" indeterminate />
            </button>
          </div>

          <v-chip-group
            v-if="tab === 0"
            v-model="statusFilter"
            active-class="active-filter"
            dark
            class="filter-pills"
            mandatory
          >
            <v-chip outlined small>All</v-chip>
            <v-chip outlined small>Available</v-chip>
            <v-chip outlined small>Unavailable</v-chip>
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
          @change="onTabChange"
        >
          <v-tab>
            <span class="tab-inner">
              <v-icon size="18" left>mdi-account-group</v-icon>
              Candidates
              <span class="tab-badge" v-if="pagination.candidates.total">{{ pagination.candidates.total }}</span>
            </span>
          </v-tab>
          <v-tab>
            <span class="tab-inner">
              <v-icon size="18" left>mdi-account-tie</v-icon>
              Employers
              <span class="tab-badge orange" v-if="pagination.employers.total">{{ pagination.employers.total }}</span>
            </span>
          </v-tab>
          <v-tab>
            <span class="tab-inner">
              <v-icon size="18" left>mdi-office-building</v-icon>
              Bureaus
              <span class="tab-badge purple" v-if="pagination.bureaus.total">{{ pagination.bureaus.total }}</span>
            </span>
          </v-tab>
          <v-tab>
            <span class="tab-inner">
              <v-icon size="18" left>mdi-credit-card</v-icon>
              Payments
              <span class="tab-badge green" v-if="pagination.payments.total">{{ pagination.payments.total }}</span>
            </span>
          </v-tab>
          <v-tab>
            <span class="tab-inner">
              <v-icon size="18" left>mdi-chart-line</v-icon>
              Analytics
            </span>
          </v-tab>
          <v-tab>
            <span class="tab-inner">
              <v-icon size="18" left>mdi-cog</v-icon>
              Settings
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
                    :loading="tableLoading[section.key]"
                    :server-items-length="section.total"
                    :options.sync="tableOptions[section.key]"
                    :footer-props="footerProps"
                    loading-text="Loading data..."
                    no-data-text="No records found"
                    @update:options="(opts) => onOptionsChange(section.key, opts)"
                  >
                    <!-- CANDIDATES -->
                    <template v-if="idx === 0" v-slot:item.candidate_name="{ item }">
                      <div class="user-cell">
                        <div class="avatar" :style="{ background: stringToColor(item.candidate_name || '') }">
                          {{ getInitials(item.candidate_name) }}
                        </div>
                        <div class="user-info">
                          <div class="name">{{ item.candidate_name || "Unnamed" }}</div>
                          <div class="meta">{{ item.ward }} • {{ item.bureau_name }}</div>
                        </div>
                      </div>
                    </template>

                    <template v-if="idx === 0" v-slot:item.mobile_no="{ item }">
                      <span class="mono-text">{{ item.mobile_no }}</span>
                    </template>

                    <template v-if="idx === 0" v-slot:item.status="{ item }">
                      <span class="status-badge" :class="(item.status || '').toLowerCase()">
                        <span class="dot"></span>
                        {{ item.status }}
                      </span>
                    </template>

                    <template v-if="idx === 0" v-slot:item.actions="{ item }">
                      <div class="row-actions">
                        <button class="icon-btn view" @click="openDetail('candidate', item)" title="View">
                          <v-icon size="18">mdi-eye-outline</v-icon>
                        </button>
                        <button class="icon-btn edit" @click="openEditDialog('candidate', item)" title="Edit">
                          <v-icon size="18">mdi-pencil-outline</v-icon>
                        </button>
                        <button class="icon-btn danger" @click="confirmDelete('candidate', item)" title="Delete">
                          <v-icon size="18">mdi-delete</v-icon>
                        </button>
                      </div>
                    </template>

                    <!-- EMPLOYERS -->
                    <template v-if="idx === 1" v-slot:item.name="{ item }">
                      <div class="user-cell">
                        <div class="avatar orange">{{ getInitials(item.name) }}</div>
                        <div class="user-info">
                          <div class="name">
                            {{ item.name }}
                            <v-icon v-if="item.is_suspended" small color="red">mdi-cancel</v-icon>
                          </div>
                          <div class="meta">{{ item.email }}</div>
                        </div>
                      </div>
                    </template>

                    <template v-if="idx === 1" v-slot:item.phone_no="{ item }">
                      <span class="mono-text">{{ item.phone_no }}</span>
                    </template>

                    <template v-if="idx === 1" v-slot:item.actions="{ item }">
                      <div class="row-actions">
                        <v-btn icon class="icon-btn view" @click="openDetail('employer', item)" title="View">
                          <v-icon size="18">mdi-eye-outline</v-icon>
                        </v-btn>
                        <v-btn icon class="icon-btn edit" @click="openEditDialog('employer', item)" title="Edit">
                          <v-icon size="18">mdi-pencil-outline</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          class="icon-btn"
                          :class="item.is_suspended ? 'success' : 'warn'"
                          @click="openSuspendDialog('employer', item)"
                          :title="item.is_suspended ? 'Reinstate' : 'Suspend'"
                        >
                          <v-icon size="18">
                            {{ item.is_suspended ? 'mdi-account-check-outline' : 'mdi-account-cancel-outline' }}
                          </v-icon>
                        </v-btn>
                        <v-btn icon class="icon-btn danger" @click="confirmDelete('employer', item)" title="Delete">
                          <v-icon size="18">mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </template>

                    <!-- BUREAUS -->
                    <template v-if="idx === 2" v-slot:item.bureau_name="{ item }">
                      <div class="user-cell">
                        <div class="avatar purple">{{ getInitials(item.bureau_name) }}</div>
                        <div class="user-info">
                          <div class="name">
                            {{ item.bureau_name }}
                            <v-icon v-if="item.is_suspended" small color="red">mdi-cancel</v-icon>
                          </div>
                          <div class="meta">{{ item.email }}</div>
                        </div>
                      </div>
                    </template>

                    <template v-if="idx === 2" v-slot:item.phone_no="{ item }">
                      <span class="mono-text">{{ item.phone_no }}</span>
                    </template>

                    <template v-if="idx === 2" v-slot:item.actions="{ item }">
                      <div class="row-actions">
                        <v-btn icon class="icon-btn view" @click="openDetail('bureau', item)" title="View">
                          <v-icon size="18">mdi-eye-outline</v-icon>
                        </v-btn>
                        <v-btn icon class="icon-btn edit" @click="openEditDialog('bureau', item)" title="Edit">
                          <v-icon size="18">mdi-pencil-outline</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          class="icon-btn"
                          :class="item.is_suspended ? 'success' : 'warn'"
                          @click="openSuspendDialog('bureau', item)"
                          :title="item.is_suspended ? 'Reinstate' : 'Suspend'"
                        >
                          <v-icon size="18">
                            {{ item.is_suspended ? 'mdi-account-check-outline' : 'mdi-account-cancel-outline' }}
                          </v-icon>
                        </v-btn>
                        <v-btn icon class="icon-btn danger" @click="confirmDelete('bureau', item)" title="Delete">
                          <v-icon size="18">mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </template>

                    <!-- PAYMENTS -->
                    <template v-if="idx === 3" v-slot:item.amount="{ item }">
                      <span class="amount-text">KES {{ formatMoney(item.amount) }}</span>
                    </template>

                    <template v-if="idx === 3" v-slot:item.plan_days="{ item }">
                      <span class="mono-text">{{ item.plan_days ? item.plan_days + " days" : "-" }}</span>
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

                    <template v-if="idx === 3" v-slot:item.uid="{ item }">
                      <span class="mono-text">{{ item.uid }}</span>
                    </template>
                  </v-data-table>
                </div>
              </div>
            </transition>
          </v-tab-item>

          <!-- ANALYTICS TAB (index 4) -->
          <v-tab-item>
            <div class="data-panel" v-if="tab === 4">
              <div class="panel-header">
                <div class="panel-title">
                  <v-icon color="cyan accent-2" size="22" class="mr-3">mdi-chart-line</v-icon>
                  <span>Advanced Analytics</span>
                </div>
                <v-btn
                  icon
                  small
                  dark
                  color="grey lighten-1"
                  :loading="analyticsLoading"
                  @click="fetchAnalytics"
                >
                  <v-icon size="18">mdi-refresh</v-icon>
                </v-btn>
              </div>

              <div v-if="analyticsLoading && !analyticsLoaded" class="analytics-loading">
                <v-progress-circular indeterminate color="cyan accent-2" size="42" />
                <p>Loading analytics...</p>
              </div>

              <template v-else>
                <!-- KPI ROW -->
                <v-row dense class="analytics-kpis">
                  <v-col cols="12" sm="6" md="3">
                    <div class="kpi-card">
                      <div class="kpi-icon cyan">
                        <v-icon color="black" size="20">mdi-percent-outline</v-icon>
                      </div>
                      <div class="kpi-body">
                        <div class="kpi-label">Conversion Rate</div>
                        <div class="kpi-value">{{ advancedStats.conversion_rate || 0 }}%</div>
                        <div class="kpi-sub">
                          {{ advancedStats.paying_users || 0 }} of {{ advancedStats.total_users || 0 }} paid
                        </div>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <div class="kpi-card">
                      <div class="kpi-icon red">
                        <v-icon color="white" size="20">mdi-account-off-outline</v-icon>
                      </div>
                      <div class="kpi-body">
                        <div class="kpi-label">Churn Rate</div>
                        <div class="kpi-value">{{ advancedStats.churn_rate || 0 }}%</div>
                        <div class="kpi-sub">
                          {{ (advancedStats.churned_employers || 0) + (advancedStats.churned_bureaus || 0) }} lapsed
                        </div>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <div class="kpi-card">
                      <div class="kpi-icon green">
                        <v-icon color="black" size="20">mdi-cash-multiple</v-icon>
                      </div>
                      <div class="kpi-body">
                        <div class="kpi-label">ARPU</div>
                        <div class="kpi-value">
                          KES {{ formatMoney(Math.round(advancedStats.arpu || 0)) }}
                        </div>
                        <div class="kpi-sub">Per paying user</div>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <div class="kpi-card">
                      <div class="kpi-icon purple">
                        <v-icon color="white" size="20">mdi-account-check-outline</v-icon>
                      </div>
                      <div class="kpi-body">
                        <div class="kpi-label">Selection Rate</div>
                        <div class="kpi-value">{{ advancedStats.selection_rate || 0 }}%</div>
                        <div class="kpi-sub">
                          {{ advancedStats.selected_candidates || 0 }} of {{ advancedStats.total_candidates || 0 }} picked
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <!-- REVENUE CHART -->
                <div class="chart-card">
                  <div class="chart-title">
                    <v-icon small color="cyan accent-2" left>mdi-cash-multiple</v-icon>
                    Revenue — Last 30 Days
                  </div>
                  <apexchart
                    v-if="revenueRaw.length"
                    type="area"
                    height="280"
                    :options="revenueChartOptions"
                    :series="revenueSeries"
                  />
                  <div v-else class="chart-empty">No revenue data yet</div>
                </div>

                <!-- SIGNUPS CHART -->
                <div class="chart-card">
                  <div class="chart-title">
                    <v-icon small color="cyan accent-2" left>mdi-account-plus</v-icon>
                    Signups — Last 30 Days
                  </div>
                  <apexchart
                    v-if="signupRaw.length"
                    type="line"
                    height="280"
                    :options="signupChartOptions"
                    :series="signupSeries"
                  />
                  <div v-else class="chart-empty">No signups yet</div>
                </div>

                <!-- TWO COLUMN: Revenue by type + Top counties -->
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="chart-card">
                      <div class="chart-title">
                        <v-icon small color="cyan accent-2" left>mdi-chart-donut</v-icon>
                        Revenue by User Type
                      </div>
                      <apexchart
                        v-if="revenueByType.series.length"
                        type="donut"
                        height="280"
                        :options="donutOptions"
                        :series="revenueByType.series"
                      />
                      <div v-else class="chart-empty">No payments yet</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="chart-card">
                      <div class="chart-title">
                        <v-icon small color="cyan accent-2" left>mdi-map-marker-multiple</v-icon>
                        Top Counties
                      </div>
                      <apexchart
                        v-if="topCounties.series.length"
                        type="bar"
                        height="280"
                        :options="countyChartOptions"
                        :series="topCounties.series"
                      />
                      <div v-else class="chart-empty">No candidate data yet</div>
                    </div>
                  </v-col>
                </v-row>

                <!-- REVENUE BY PLAN -->
                <div class="chart-card">
                  <div class="chart-title">
                    <v-icon small color="cyan accent-2" left>mdi-credit-card-multiple</v-icon>
                    Revenue by Plan
                  </div>
                  <apexchart
                    v-if="revenueByPlan.series.length"
                    type="bar"
                    height="260"
                    :options="planChartOptions"
                    :series="revenueByPlan.series"
                  />
                  <div v-else class="chart-empty">No plan data yet</div>
                </div>

                <!-- TOP BUREAUS LEADERBOARD -->
                <div class="leaderboard-card">
                  <div class="chart-title">
                    <v-icon small color="cyan accent-2" left>mdi-trophy-outline</v-icon>
                    Top Bureaus
                  </div>

                  <div v-if="topBureaus.length === 0" class="chart-empty">No data yet</div>
                  <v-simple-table v-else dark class="leaderboard-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Bureau</th>
                        <th>County</th>
                        <th class="text-right">Candidates</th>
                        <th class="text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(b, i) in topBureaus" :key="b.user_id">
                        <td class="rank-col">{{ i + 1 }}</td>
                        <td>
                          <div class="lb-name">
                            <div class="avatar purple">{{ getInitials(b.bureau_name) }}</div>
                            <span>{{ b.bureau_name }}</span>
                          </div>
                        </td>
                        <td>{{ b.county || "-" }}</td>
                        <td class="text-right">{{ b.candidate_count || 0 }}</td>
                        <td class="text-right mono-text">
                          KES {{ formatMoney(b.revenue || 0) }}
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </div>
              </template>
            </div>
          </v-tab-item>

          <!-- SETTINGS TAB (index 5) -->
          <v-tab-item>
            <div class="data-panel" v-if="tab === 5">
              <div class="panel-header">
                <div class="panel-title">
                  <v-icon color="cyan accent-2" size="22" class="mr-3">mdi-cog</v-icon>
                  <span>Platform Settings</span>
                </div>
                <v-btn
                  icon
                  small
                  dark
                  color="grey lighten-1"
                  :loading="settingsLoading"
                  @click="fetchSettings"
                >
                  <v-icon size="18">mdi-refresh</v-icon>
                </v-btn>
              </div>

              <div v-if="settingsLoading && !settingsLoaded" class="settings-loading">
                <v-progress-circular indeterminate color="cyan accent-2" size="42" />
                <p>Loading settings...</p>
              </div>

              <template v-else>
                <!-- EMPLOYER PLANS -->
                <div class="settings-section">
                  <div class="settings-section-head">
                    <div class="settings-section-icon orange">
                      <v-icon color="white">mdi-account-tie</v-icon>
                    </div>
                    <div>
                      <h3>Employer Subscription Plans</h3>
                      <p>Set the price for each employer plan. Changes apply to new payments immediately.</p>
                    </div>
                  </div>

                  <v-row dense>
                    <v-col
                      v-for="days in planDays.EMPLOYER"
                      :key="`emp-${days}`"
                      cols="12"
                      sm="4"
                    >
                      <div class="settings-field">
                        <label class="form-label">{{ days }}-Day Plan</label>
                        <v-text-field
                          v-model.number="settings.employer[days]"
                          type="number"
                          outlined
                          dense
                          hide-details
                          prefix="KES"
                          :disabled="settingsSaving"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <!-- BUREAU PLANS -->
                <div class="settings-section">
                  <div class="settings-section-head">
                    <div class="settings-section-icon purple">
                      <v-icon color="white">mdi-office-building</v-icon>
                    </div>
                    <div>
                      <h3>Bureau Subscription Plans</h3>
                      <p>Bureaus currently only have a monthly plan.</p>
                    </div>
                  </div>

                  <v-row dense>
                    <v-col
                      v-for="days in planDays.BUREAU"
                      :key="`bur-${days}`"
                      cols="12"
                      sm="4"
                    >
                      <div class="settings-field">
                        <label class="form-label">{{ days }}-Day Plan (Monthly)</label>
                        <v-text-field
                          v-model.number="settings.bureau[days]"
                          type="number"
                          outlined
                          dense
                          hide-details
                          prefix="KES"
                          :disabled="settingsSaving"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <!-- ACTIONS -->
                <div class="settings-actions">
                  <v-btn
                    text
                    dark
                    color="grey lighten-1"
                    :disabled="settingsSaving"
                    @click="fetchSettings"
                  >
                    Reset
                  </v-btn>
                  <v-spacer />
                  <v-btn
                    rounded
                    color="cyan accent-2"
                    dark
                    style="color:#0E1018"
                    :loading="settingsSaving"
                    @click="saveSettings"
                  >
                    <v-icon left size="18">mdi-content-save-outline</v-icon>
                    Save Settings
                  </v-btn>
                </div>
              </template>
            </div>
          </v-tab-item>
        </v-tabs-items>

        <!-- CREATE / EDIT DIALOG -->
        <v-dialog v-model="formDialog" max-width="720" persistent>
          <v-card class="glass-dialog form-card">
            <div class="dialog-top">
              <div class="dialog-top-left">
                <div class="dialog-icon" :class="formType">
                  <v-icon color="white" size="22">
                    {{ formMode === 'create' ? 'mdi-plus' : 'mdi-pencil' }}
                  </v-icon>
                </div>
                <div>
                  <h2 class="dialog-title">
                    {{ formMode === 'create' ? 'Add' : 'Edit' }} {{ formTypeLabel }}
                  </h2>
                  <p class="dialog-sub">
                    {{ formMode === 'create'
                      ? `Create a new ${formType} record.`
                      : `Update ${formType} details below.` }}
                  </p>
                </div>
              </div>
              <v-btn icon @click="closeFormDialog" :disabled="formSaving">
                <v-icon color="white">mdi-close</v-icon>
              </v-btn>
            </div>

            <div class="form-body">
              <!-- CANDIDATE FORM -->
              <v-row v-if="formType === 'candidate'" dense>
                <v-col v-if="formMode === 'create'" cols="12">
                  <label class="form-label">Bureau <span class="req">*</span></label>
                  <v-select
                    v-model="form.user_id"
                    :items="bureauOptions"
                    item-text="label"
                    item-value="value"
                    outlined
                    dense
                    hide-details
                    placeholder="Select the bureau this candidate belongs to"
                    :loading="bureausForSelect.length === 0"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="form-label">Full Name <span class="req">*</span></label>
                  <v-text-field v-model="form.candidate_name" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Phone <span class="req">*</span></label>
                  <v-text-field v-model="form.mobile_no" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Gender <span class="req">*</span></label>
                  <v-select v-model="form.gender" :items="['Female', 'Male']" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Date of Birth</label>
                  <v-text-field v-model="form.dob" type="date" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">County <span class="req">*</span></label>
                  <v-text-field v-model="form.county" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Ward</label>
                  <v-text-field v-model="form.ward" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Village</label>
                  <v-text-field v-model="form.village" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Next of Kin</label>
                  <v-text-field v-model="form.next_of_kin" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Next of Kin Phone</label>
                  <v-text-field v-model="form.kin_phone_no" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Experience (years)</label>
                  <v-text-field v-model="form.experience" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Salary</label>
                  <v-text-field v-model="form.salary" type="number" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Salary Period</label>
                  <v-select
                    v-model="form.salary_period"
                    :items="['Daily', 'Weekly', 'Monthly']"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Status</label>
                  <v-select
                    v-model="form.status"
                    :items="['Available', 'Unavailable']"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
              </v-row>

              <!-- EMPLOYER FORM -->
              <v-row v-if="formType === 'employer'" dense>
                <v-col cols="12" sm="6">
                  <label class="form-label">Name</label>
                  <v-text-field v-model="form.name" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Email</label>
                  <v-text-field v-model="form.email" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Phone</label>
                  <v-text-field v-model="form.phone_no" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">County</label>
                  <v-text-field v-model="form.county" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">City</label>
                  <v-text-field v-model="form.city" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Street</label>
                  <v-text-field v-model="form.street_name" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Access Expires At</label>
                  <v-text-field v-model="form.access_expires_at" type="date" outlined dense hide-details />
                </v-col>
              </v-row>

              <!-- BUREAU FORM -->
              <v-row v-if="formType === 'bureau'" dense>
                <v-col cols="12" sm="6">
                  <label class="form-label">Bureau Name</label>
                  <v-text-field v-model="form.bureau_name" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Contact Name</label>
                  <v-text-field v-model="form.name" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Email</label>
                  <v-text-field v-model="form.email" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Phone</label>
                  <v-text-field v-model="form.phone_no" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">County</label>
                  <v-text-field v-model="form.county" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">City</label>
                  <v-text-field v-model="form.city" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Trial Ends At</label>
                  <v-text-field v-model="form.trial_ends_at" type="date" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Access Expires At</label>
                  <v-text-field v-model="form.access_expires_at" type="date" outlined dense hide-details />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">Subscription Status</label>
                  <v-select
                    v-model="form.subscription_status"
                    :items="['TRIAL', 'ACTIVE', 'GRACE', 'EXPIRED']"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="form-label">User State</label>
                  <v-text-field v-model="form.user_state" outlined dense hide-details />
                </v-col>
              </v-row>
            </div>

            <div class="form-actions">
              <v-btn text dark color="grey lighten-1" :disabled="formSaving" @click="closeFormDialog">
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn
                rounded
                color="cyan accent-2"
                dark
                style="color:#0E1018"
                :loading="formSaving"
                @click="submitForm"
              >
                {{ formMode === 'create' ? 'Create' : 'Save Changes' }}
              </v-btn>
            </div>
          </v-card>
        </v-dialog>

        <!-- SUSPEND DIALOG -->
        <v-dialog v-model="suspendDialog" max-width="460" persistent>
          <v-card class="glass-dialog form-card">
            <div class="dialog-top">
              <div class="dialog-top-left">
                <div class="dialog-icon warn">
                  <v-icon color="white" size="22">mdi-alert</v-icon>
                </div>
                <div>
                  <h2 class="dialog-title">
                    {{ suspendForm.suspended ? 'Reinstate' : 'Suspend' }} {{ suspendType }}
                  </h2>
                  <p class="dialog-sub">
                    {{ suspendForm.suspended
                      ? 'Restore access for this account.'
                      : 'Block this account from accessing the platform.' }}
                  </p>
                </div>
              </div>
              <v-btn icon @click="suspendDialog = false" :disabled="suspendSaving">
                <v-icon color="white">mdi-close</v-icon>
              </v-btn>
            </div>

            <div class="form-body">
              <label class="form-label">
                Reason {{ suspendForm.suspended ? '(optional)' : '(required)' }}
              </label>
              <v-textarea
                v-model="suspendForm.reason"
                outlined
                dense
                rows="3"
                hide-details
                placeholder="e.g. Repeated payment failures"
              />
            </div>

            <div class="form-actions">
              <v-btn text dark color="grey lighten-1" :disabled="suspendSaving" @click="suspendDialog = false">
                Cancel
              </v-btn>
              <v-spacer />
              <v-btn
                rounded
                :color="suspendForm.suspended ? 'green accent-3' : 'red darken-2'"
                dark
                :loading="suspendSaving"
                @click="submitSuspend"
              >
                {{ suspendForm.suspended ? 'Reinstate' : 'Suspend' }}
              </v-btn>
            </div>
          </v-card>
        </v-dialog>

        <!-- DETAIL DIALOG -->
        <v-dialog v-model="detailDialog" max-width="720" scrollable>
          <v-card class="glass-dialog detail-card">
            <div class="dialog-top">
              <div class="dialog-top-left">
                <div class="dialog-icon" :class="detailType">
                  <v-icon color="white" size="22">
                    {{ detailType === 'candidate' ? 'mdi-account' : detailType === 'employer' ? 'mdi-account-tie' : 'mdi-office-building' }}
                  </v-icon>
                </div>
                <div>
                  <h2 class="dialog-title">{{ detailTypeLabel }} Details</h2>
                  <p class="dialog-sub">Full record and related activity</p>
                </div>
              </div>
              <v-btn icon @click="detailDialog = false">
                <v-icon color="white">mdi-close</v-icon>
              </v-btn>
            </div>

            <div class="detail-body">
              <div v-if="detailLoading" class="detail-loading">
                <v-progress-circular indeterminate color="cyan accent-2" size="42" />
              </div>

              <template v-else-if="detail">
                <!-- CANDIDATE -->
                <template v-if="detailType === 'candidate'">
                  <div class="detail-hero">
                    <div class="detail-avatar" :style="{ background: stringToColor(detail.candidate_name || '') }">
                      {{ getInitials(detail.candidate_name) }}
                    </div>
                    <div>
                      <h3>{{ detail.candidate_name }}</h3>
                      <p>{{ detail.gender }} • {{ detail.age }} yrs • {{ detail.county }}</p>
                    </div>
                  </div>

                  <div class="detail-grid">
                    <div class="detail-item"><span>Phone</span><strong>{{ detail.mobile_no || "-" }}</strong></div>
                    <div class="detail-item"><span>Ward</span><strong>{{ detail.ward || "-" }}</strong></div>
                    <div class="detail-item"><span>Village</span><strong>{{ detail.village || "-" }}</strong></div>
                    <div class="detail-item"><span>Bureau</span><strong>{{ detail.bureau_name || "-" }}</strong></div>
                    <div class="detail-item"><span>Experience</span><strong>{{ detail.experience || 0 }} yrs</strong></div>
                    <div class="detail-item"><span>Salary</span><strong>KES {{ formatMoney(detail.salary) }}</strong></div>
                    <div class="detail-item"><span>Status</span><strong>{{ detail.status || "-" }}</strong></div>
                    <div class="detail-item"><span>Created</span><strong>{{ formatDate(detail.created_at) }}</strong></div>
                  </div>
                </template>

                <!-- EMPLOYER -->
                <template v-else-if="detailType === 'employer'">
                  <div class="detail-hero">
                    <div class="detail-avatar orange">{{ getInitials(detail.name) }}</div>
                    <div>
                      <h3>{{ detail.name }}</h3>
                      <p>{{ detail.email || "-" }}</p>
                    </div>
                  </div>

                  <div class="detail-grid">
                    <div class="detail-item"><span>Phone</span><strong>{{ detail.phone_no || "-" }}</strong></div>
                    <div class="detail-item"><span>County</span><strong>{{ detail.county || "-" }}</strong></div>
                    <div class="detail-item"><span>City</span><strong>{{ detail.city || "-" }}</strong></div>
                    <div class="detail-item"><span>Access Expires</span><strong>{{ formatDate(detail.access_expires_at) }}</strong></div>
                    <div class="detail-item"><span>Suspended</span><strong>{{ detail.is_suspended ? "Yes" : "No" }}</strong></div>
                    <div class="detail-item"><span>Joined</span><strong>{{ formatDate(detail.created_at) }}</strong></div>
                  </div>

                  <h4 class="detail-subhead">Payments ({{ detailPayments.length }})</h4>
                  <div v-if="detailPayments.length === 0" class="detail-empty">No payments yet.</div>
                  <div v-else class="detail-list">
                    <div v-for="p in detailPayments" :key="p.id" class="detail-row">
                      <div>
                        <div class="row-primary">{{ p.mpesa_receipt }}</div>
                        <div class="row-sub">
                          {{ formatDate(p.created_at) }}
                          <template v-if="p.plan_days"> • {{ p.plan_days }} days</template>
                        </div>
                      </div>
                      <div class="row-amount">KES {{ formatMoney(p.amount) }}</div>
                    </div>
                  </div>

                  <h4 class="detail-subhead">Selected Candidates ({{ detailCandidates.length }})</h4>
                  <div v-if="detailCandidates.length === 0" class="detail-empty">No candidates selected.</div>
                  <div v-else class="detail-list">
                    <div v-for="c in detailCandidates" :key="c.candidate_id" class="detail-row">
                      <div>
                        <div class="row-primary">{{ c.candidate_name }}</div>
                        <div class="row-sub">{{ c.county }} • {{ formatDate(c.date_selected) }}</div>
                      </div>
                      <span class="status-badge" :class="(c.status || '').toLowerCase()">
                        <span class="dot"></span>{{ c.status }}
                      </span>
                    </div>
                  </div>
                </template>

                <!-- BUREAU -->
                <template v-else-if="detailType === 'bureau'">
                  <div class="detail-hero">
                    <div class="detail-avatar purple">{{ getInitials(detail.bureau_name) }}</div>
                    <div>
                      <h3>{{ detail.bureau_name }}</h3>
                      <p>{{ detail.name || "-" }}</p>
                    </div>
                  </div>

                  <div class="detail-grid">
                    <div class="detail-item"><span>Phone</span><strong>{{ detail.phone_no || "-" }}</strong></div>
                    <div class="detail-item"><span>Email</span><strong>{{ detail.email || "-" }}</strong></div>
                    <div class="detail-item"><span>County</span><strong>{{ detail.county || "-" }}</strong></div>
                    <div class="detail-item"><span>City</span><strong>{{ detail.city || "-" }}</strong></div>
                    <div class="detail-item"><span>Trial Ends</span><strong>{{ formatDate(detail.trial_ends_at) }}</strong></div>
                    <div class="detail-item"><span>Access Expires</span><strong>{{ formatDate(detail.access_expires_at) }}</strong></div>
                    <div class="detail-item"><span>Status</span><strong>{{ detail.subscription_status || detail.user_state || "-" }}</strong></div>
                    <div class="detail-item"><span>Suspended</span><strong>{{ detail.is_suspended ? "Yes" : "No" }}</strong></div>
                  </div>

                  <h4 class="detail-subhead">Candidates ({{ detailCandidates.length }})</h4>
                  <div v-if="detailCandidates.length === 0" class="detail-empty">No candidates.</div>
                  <div v-else class="detail-list">
                    <div v-for="c in detailCandidates" :key="c.candidate_id" class="detail-row">
                      <div>
                        <div class="row-primary">{{ c.candidate_name }}</div>
                        <div class="row-sub">{{ c.county }} • {{ c.working_status }}</div>
                      </div>
                      <span class="status-badge" :class="(c.status || '').toLowerCase()">
                        <span class="dot"></span>{{ c.status }}
                      </span>
                    </div>
                  </div>

                  <h4 class="detail-subhead">Payments ({{ detailPayments.length }})</h4>
                  <div v-if="detailPayments.length === 0" class="detail-empty">No payments yet.</div>
                  <div v-else class="detail-list">
                    <div v-for="p in detailPayments" :key="p.id" class="detail-row">
                      <div>
                        <div class="row-primary">{{ p.mpesa_receipt }}</div>
                        <div class="row-sub">
                          {{ formatDate(p.created_at) }}
                          <template v-if="p.plan_days"> • {{ p.plan_days }} days</template>
                        </div>
                      </div>
                      <div class="row-amount">KES {{ formatMoney(p.amount) }}</div>
                    </div>
                  </div>
                </template>
              </template>
            </div>

            <div class="form-actions">
              <v-btn text dark color="grey lighten-1" @click="detailDialog = false">
                Close
              </v-btn>
            </div>
          </v-card>
        </v-dialog>

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
import axios from "axios";

const API_BASE = "https://yayalinkserver-production-b920.up.railway.app";

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
      searchLoading: false,
      deleteDialog: false,
      deleteLoading: false,
      deleteTarget: null,
      deleteType: null,

      adminUid: null,
      adminName: "Admin",
      adminEmail: "",

      notifications: [],

      dashboard: {
        total_candidates: 0,
        available_candidates: 0,
        selected_candidates: 0,
        total_employers: 0,
        total_bureaus: 0,
        total_revenue: 0,
        monthly_revenue: 0,
        suspended_employers: 0,
        suspended_bureaus: 0,
        active_bureaus: 0,
      },

      candidates: [],
      employers: [],
      bureaus: [],
      payments: [],
      bureausForSelect: [],

      pagination: {
        candidates: { page: 1, limit: 10, total: 0 },
        employers:  { page: 1, limit: 10, total: 0 },
        bureaus:    { page: 1, limit: 10, total: 0 },
        payments:   { page: 1, limit: 10, total: 0 },
      },

      tableOptions: {
        candidates: { page: 1, itemsPerPage: 10 },
        employers:  { page: 1, itemsPerPage: 10 },
        bureaus:    { page: 1, itemsPerPage: 10 },
        payments:   { page: 1, itemsPerPage: 10 },
      },

      tableReady: {
        candidates: false,
        employers: false,
        bureaus: false,
        payments: false,
      },

      tableLoading: {
        candidates: false,
        employers: false,
        bureaus: false,
        payments: false,
      },

      formDialog: false,
      formMode: "create",
      formType: null,
      formSaving: false,
      form: {},
      editingKey: null,

      suspendDialog: false,
      suspendType: null,
      suspendSaving: false,
      suspendForm: { suspended: false, reason: "" },
      suspendTarget: null,

      detailDialog: false,
      detailLoading: false,
      detailType: null,
      detail: null,
      detailPayments: [],
      detailCandidates: [],

      /* ─── SETTINGS ─── */
      settings: {
        employer: {},
        bureau: {},
      },
      settingsLoading: false,
      settingsSaving: false,
      settingsLoaded: false,
      planDays: {
        EMPLOYER: [3, 7, 30],
        BUREAU: [30],
      },

      /* ─── ANALYTICS ─── */
      analyticsLoading: false,
      analyticsLoaded: false,

      advancedStats: {
        conversion_rate: 0,
        churn_rate: 0,
        arpu: 0,
        selection_rate: 0,
        total_users: 0,
        paying_users: 0,
        total_candidates: 0,
        selected_candidates: 0,
        churned_employers: 0,
        churned_bureaus: 0,
      },

      revenueRaw: [],
      signupRaw: [],
      revenueByType: { labels: [], series: [] },
      revenueByPlan: { labels: [], series: [] },
      topCounties: { labels: [], series: [] },
      topBureaus: [],

      revenueChartOptions: {
        chart: {
          toolbar: { show: false },
          background: "transparent",
          foreColor: "rgba(255,255,255,0.7)",
        },
        stroke: { curve: "smooth", width: 2 },
        fill: {
          type: "gradient",
          gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] },
        },
        colors: ["#00FFFF"],
        dataLabels: { enabled: false },
        grid: { borderColor: "rgba(255,255,255,0.06)", strokeDashArray: 3 },
        xaxis: { categories: [], labels: { style: { fontSize: "10px" } } },
        yaxis: { labels: { formatter: (v) => `KES ${Number(v).toLocaleString()}` } },
        tooltip: { theme: "dark" },
      },

      signupChartOptions: {
        chart: {
          toolbar: { show: false },
          background: "transparent",
          foreColor: "rgba(255,255,255,0.7)",
        },
        stroke: { curve: "smooth", width: 2 },
        colors: ["#00FFFF", "#AB47BC"],
        dataLabels: { enabled: false },
        grid: { borderColor: "rgba(255,255,255,0.06)", strokeDashArray: 3 },
        xaxis: { categories: [], labels: { style: { fontSize: "10px" } } },
        legend: { position: "top", horizontalAlign: "right" },
        tooltip: { theme: "dark" },
      },

      donutOptions: {
        chart: { background: "transparent", foreColor: "rgba(255,255,255,0.7)" },
        labels: [],
        colors: ["#00FFFF", "#AB47BC"],
        legend: { position: "bottom" },
        stroke: { colors: ["#0E1018"] },
        tooltip: { theme: "dark" },
      },

      countyChartOptions: {
        chart: {
          toolbar: { show: false },
          background: "transparent",
          foreColor: "rgba(255,255,255,0.7)",
        },
        plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
        colors: ["#00FFFF"],
        dataLabels: { enabled: false },
        grid: { borderColor: "rgba(255,255,255,0.06)", strokeDashArray: 3 },
        xaxis: { categories: [] },
        tooltip: { theme: "dark" },
      },

      planChartOptions: {
        chart: {
          toolbar: { show: false },
          background: "transparent",
          foreColor: "rgba(255,255,255,0.7)",
        },
        plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
        colors: ["#69F0AE"],
        dataLabels: { enabled: false },
        grid: { borderColor: "rgba(255,255,255,0.06)", strokeDashArray: 3 },
        xaxis: { categories: [] },
        yaxis: { labels: { formatter: (v) => `KES ${Number(v).toLocaleString()}` } },
        tooltip: { theme: "dark" },
      },

      footerProps: {
        itemsPerPageOptions: [5, 10, 25, 50],
        showFirstLastPage: true,
        firstIcon: "mdi-arrow-collapse-left",
        lastIcon: "mdi-arrow-collapse-right",
        prevIcon: "mdi-chevron-left",
        nextIcon: "mdi-chevron-right",
      },

      candidateHeaders: [
        { text: "Candidate", value: "candidate_name", width: "25%" },
        { text: "Phone", value: "mobile_no", width: "15%" },
        { text: "County", value: "county", width: "12%" },
        { text: "Ward", value: "ward", width: "12%" },
        { text: "Bureau", value: "bureau_name", width: "15%" },
        { text: "Status", value: "status", width: "10%", align: "center" },
        { text: "", value: "actions", sortable: false, width: "15%", align: "center" },
      ],

      employerHeaders: [
        { text: "Employer", value: "name", width: "35%" },
        { text: "Phone", value: "phone_no", width: "20%" },
        { text: "County", value: "county", width: "15%" },
        { text: "", value: "actions", sortable: false, width: "30%", align: "center" },
      ],

      bureauHeaders: [
        { text: "Bureau", value: "bureau_name", width: "35%" },
        { text: "Phone", value: "phone_no", width: "20%" },
        { text: "County", value: "county", width: "15%" },
        { text: "", value: "actions", sortable: false, width: "30%", align: "center" },
      ],

      paymentHeaders: [
        { text: "Receipt", value: "mpesa_receipt", width: "22%" },
        { text: "Amount", value: "amount", width: "18%", align: "right" },
        { text: "Plan", value: "plan_days", width: "12%", align: "center" },
        { text: "User", value: "uid", width: "22%" },
        { text: "Type", value: "user_type", width: "11%" },
        { text: "Date", value: "created_at", width: "15%" },
      ],

      snackbar: {
        show: false,
        message: "",
        color: "success",
        icon: "mdi-check-circle",
      },
    };
  },

  computed: {
    filteredCandidates() {
      let filtered = this.candidates;
      if (this.statusFilter === 1) filtered = filtered.filter((c) => c.status === "Available");
      if (this.statusFilter === 2) filtered = filtered.filter((c) => c.status === "Unavailable");
      return filtered;
    },

    sections() {
      return [
        {
          key: "candidates",
          title: "Candidates",
          icon: "mdi-account-group",
          color: "cyan accent-2",
          headers: this.candidateHeaders,
          items: this.filteredCandidates,
          total: this.pagination.candidates.total,
          refresh: this.fetchCandidates,
        },
        {
          key: "employers",
          title: "Employers",
          icon: "mdi-account-tie",
          color: "orange accent-3",
          headers: this.employerHeaders,
          items: this.employers,
          total: this.pagination.employers.total,
          refresh: this.fetchEmployers,
        },
        {
          key: "bureaus",
          title: "Bureaus",
          icon: "mdi-office-building",
          color: "purple accent-2",
          headers: this.bureauHeaders,
          items: this.bureaus,
          total: this.pagination.bureaus.total,
          refresh: this.fetchBureaus,
        },
        {
          key: "payments",
          title: "Payments",
          icon: "mdi-credit-card",
          color: "green accent-3",
          headers: this.paymentHeaders,
          items: this.payments,
          total: this.pagination.payments.total,
          refresh: this.fetchPayments,
        },
      ];
    },

    navItems() {
      return [
        { title: "Candidates", icon: "mdi-account-group",   count: this.pagination.candidates.total },
        { title: "Employers",  icon: "mdi-account-tie",     count: this.pagination.employers.total },
        { title: "Bureaus",    icon: "mdi-office-building", count: this.pagination.bureaus.total },
        { title: "Payments",   icon: "mdi-credit-card",     count: this.pagination.payments.total },
        { title: "Analytics",  icon: "mdi-chart-line",      count: 0 },
        { title: "Settings",   icon: "mdi-cog",             count: 0 },
      ];
    },

    deleteTargetName() {
      if (!this.deleteTarget) return "";
      return (
        this.deleteTarget.candidate_name ||
        this.deleteTarget.name ||
        this.deleteTarget.bureau_name ||
        "Unknown"
      );
    },

    formTypeLabel() {
      if (this.formType === "candidate") return "Candidate";
      if (this.formType === "employer") return "Employer";
      if (this.formType === "bureau") return "Bureau";
      return "";
    },

    detailTypeLabel() {
      if (this.detailType === "candidate") return "Candidate";
      if (this.detailType === "employer") return "Employer";
      if (this.detailType === "bureau") return "Bureau";
      return "";
    },

    bureauOptions() {
      return this.bureausForSelect.map((b) => ({
        label: `${b.bureau_name} — ${b.county || "N/A"}`,
        value: b.user_id,
      }));
    },

    revenueSeries() {
      if (!this.revenueRaw.length) return [];
      return [{
        name: "Revenue",
        data: this.revenueRaw.map((r) => r.total),
      }];
    },

    signupSeries() {
      if (!this.signupRaw.length) return [];
      return [
        { name: "Employers", data: this.signupRaw.map((r) => r.employers) },
        { name: "Bureaus",   data: this.signupRaw.map((r) => r.bureaus) },
      ];
    },
  },

  async mounted() {
    if (this.$fire && this.$fire.auth) {
      await new Promise((resolve) => {
        if (this.$fire.auth.currentUser) return resolve();
        const unsub = this.$fire.auth.onAuthStateChanged(() => {
          unsub();
          resolve();
        });
      });
    }

    this.setupAxios();
    this.resolveAdminIdentity();

    await this.refreshAll();
  },

  methods: {
    setupAxios() {
      axios.interceptors.request.use((config) => {
        if (this.adminUid) {
          config.headers["x-admin-uid"] = this.adminUid;
        }
        return config;
      });
    },

    resolveAdminIdentity() {
      if (this.$fire && this.$fire.auth && this.$fire.auth.currentUser) {
        const user = this.$fire.auth.currentUser;
        this.adminUid = user.uid;
        this.adminEmail = user.email || "";
        this.adminName =
          user.displayName ||
          (user.email ? user.email.split("@")[0] : "Admin");
      }
    },

    async onOptionsChange(key, opts) {
      const oldPage = this.pagination[key].page;
      const oldLimit = this.pagination[key].limit;

      this.pagination[key].page = opts.page;
      this.pagination[key].limit = opts.itemsPerPage;

      if (!this.tableReady[key]) {
        this.tableReady[key] = true;
        return;
      }

      if (oldPage === opts.page && oldLimit === opts.itemsPerPage) return;

      const fetchers = {
        candidates: this.fetchCandidates,
        employers: this.fetchEmployers,
        bureaus: this.fetchBureaus,
        payments: this.fetchPayments,
      };

      if (fetchers[key]) await fetchers[key]();
    },

    onTabChange(newTab) {
      const keys = ["candidates", "employers", "bureaus", "payments"];
      const key = keys[newTab];

      if (key && !this[`${key}`].length) {
        this.sections[newTab].refresh();
      }

      // Analytics tab is index 4
      if (newTab === 4 && !this.analyticsLoaded) {
        this.fetchAnalytics();
      }

      // Settings tab is index 5
      if (newTab === 5 && !this.settingsLoaded) {
        this.fetchSettings();
      }
    },

    formatMoney(value) {
      if (!value) return "0";
      return Number(value).toLocaleString();
    },

    formatNumber(value) {
      if (!value) return "0";
      if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
      if (value >= 1000) return (value / 1000).toFixed(1) + "K";
      return value.toString();
    },

    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },

    formatDateInput(value) {
      if (!value) return "";
      try {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      } catch {
        return "";
      }
    },

    getInitials(name) {
      if (!name) return "?";
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    },

    stringToColor(str) {
      const colors = ["#00BCD4", "#4CAF50", "#FF9800", "#9C27B0", "#E91E63", "#3F51B5", "#009688"];
      let hash = 0;
      for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
      return colors[Math.abs(hash) % colors.length];
    },

    showSnackbar(message, color = "success", icon = "mdi-check-circle") {
      this.snackbar = { show: true, message, color, icon };
    },

    async refreshAll() {
      this.loading = true;
      await Promise.all([
        this.fetchDashboard(),
        this.fetchCandidates(),
        this.fetchEmployers(),
        this.fetchBureaus(),
        this.fetchPayments(),
        this.fetchBureausForSelect(),
      ]);
      this.loading = false;
      this.showSnackbar("Dashboard refreshed");
    },

    async fetchDashboard() {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/dashboard/summary`);
        const data = res.data && res.data.data ? res.data.data : res.data;
        this.dashboard = { ...this.dashboard, ...data };
      } catch (error) {
        this.showSnackbar("Failed to load dashboard", "error", "mdi-alert");
        console.error("fetchDashboard", error);
      }
    },

    async fetchBureausForSelect() {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/bureaus`, {
          params: { page: 1, limit: 100 },
        });
        const body = res.data;
        this.bureausForSelect = Array.isArray(body) ? body : (body.data || []);
      } catch (error) {
        console.error("fetchBureausForSelect", error);
      }
    },

    async fetchCandidates() {
      this.tableLoading.candidates = true;
      try {
        const { page, limit } = this.pagination.candidates;
        const res = await axios.get(`${API_BASE}/api/admin/candidates`, {
          params: {
            page,
            limit,
            search: this.search || undefined,
            status: this.statusFilter === 1 ? "Available" : this.statusFilter === 2 ? "Unavailable" : undefined,
          },
        });

        const body = res.data;
        if (Array.isArray(body)) {
          this.candidates = body;
          this.pagination.candidates.total = body.length;
        } else {
          this.candidates = body.data || [];
          this.pagination.candidates.total = body.pagination?.total || 0;
        }
      } catch (error) {
        this.showSnackbar("Failed to load candidates", "error", "mdi-alert");
        console.error("fetchCandidates", error);
      } finally {
        this.tableLoading.candidates = false;
      }
    },

    async fetchEmployers() {
      this.tableLoading.employers = true;
      try {
        const { page, limit } = this.pagination.employers;
        const res = await axios.get(`${API_BASE}/api/admin/employers`, {
          params: { page, limit, search: this.search || undefined },
        });

        const body = res.data;
        if (Array.isArray(body)) {
          this.employers = body;
          this.pagination.employers.total = body.length;
        } else {
          this.employers = body.data || [];
          this.pagination.employers.total = body.pagination?.total || 0;
        }
      } catch (error) {
        this.showSnackbar("Failed to load employers", "error", "mdi-alert");
        console.error("fetchEmployers", error);
      } finally {
        this.tableLoading.employers = false;
      }
    },

    async fetchBureaus() {
      this.tableLoading.bureaus = true;
      try {
        const { page, limit } = this.pagination.bureaus;
        const res = await axios.get(`${API_BASE}/api/admin/bureaus`, {
          params: { page, limit, search: this.search || undefined },
        });

        const body = res.data;
        if (Array.isArray(body)) {
          this.bureaus = body;
          this.pagination.bureaus.total = body.length;
        } else {
          this.bureaus = body.data || [];
          this.pagination.bureaus.total = body.pagination?.total || 0;
        }
      } catch (error) {
        this.showSnackbar("Failed to load bureaus", "error", "mdi-alert");
        console.error("fetchBureaus", error);
      } finally {
        this.tableLoading.bureaus = false;
      }
    },

    async fetchPayments() {
      this.tableLoading.payments = true;
      try {
        const { page, limit } = this.pagination.payments;
        const res = await axios.get(`${API_BASE}/api/admin/payments`, {
          params: { page, limit, search: this.search || undefined },
        });

        const body = res.data;
        if (Array.isArray(body)) {
          this.payments = body;
          this.pagination.payments.total = body.length;
        } else {
          this.payments = body.data || [];
          this.pagination.payments.total = body.pagination?.total || 0;
        }
      } catch (error) {
        this.showSnackbar("Failed to load payments", "error", "mdi-alert");
        console.error("fetchPayments", error);
      } finally {
        this.tableLoading.payments = false;
      }
    },

    async applySearch() {
      this.searchLoading = true;
      this.pagination.candidates.page = 1;
      this.pagination.employers.page = 1;
      this.pagination.bureaus.page = 1;
      this.pagination.payments.page = 1;
      this.tableOptions.candidates.page = 1;
      this.tableOptions.employers.page = 1;
      this.tableOptions.bureaus.page = 1;
      this.tableOptions.payments.page = 1;

      try {
        if (this.tab === 0) await this.fetchCandidates();
        else if (this.tab === 1) await this.fetchEmployers();
        else if (this.tab === 2) await this.fetchBureaus();
        else if (this.tab === 3) await this.fetchPayments();
      } finally {
        this.searchLoading = false;
      }
    },

    clearSearch() {
      this.search = "";
      this.applySearch();
    },

    handleQuickSearch() {
      if (this.quickSearch.trim()) {
        this.search = this.quickSearch;
        this.applySearch();
      }
    },

    /* ─── ANALYTICS ─── */
    async fetchAnalytics() {
      this.analyticsLoading = true;
      try {
        const [
          advancedRes,
          revenueRes,
          signupRes,
          byTypeRes,
          byPlanRes,
          topCountiesRes,
          topBureausRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/analytics/advanced-stats`),
          axios.get(`${API_BASE}/api/admin/dashboard/revenue-chart`),
          axios.get(`${API_BASE}/api/admin/dashboard/signups-chart`),
          axios.get(`${API_BASE}/api/admin/analytics/revenue-by-type`),
          axios.get(`${API_BASE}/api/admin/analytics/revenue-by-plan`),
          axios.get(`${API_BASE}/api/admin/dashboard/top-counties`),
          axios.get(`${API_BASE}/api/admin/analytics/top-bureaus`),
        ]);

        // KPI cards
        this.advancedStats = advancedRes.data || {};

        // Revenue chart
        const revenueData = revenueRes.data?.series || [];
        this.revenueRaw = revenueData;
        this.revenueChartOptions = {
          ...this.revenueChartOptions,
          xaxis: {
            ...this.revenueChartOptions.xaxis,
            categories: revenueData.map((r) => r.day.slice(5)),
          },
        };

        // Signups chart
        const signupData = signupRes.data?.series || [];
        this.signupRaw = signupData;
        this.signupChartOptions = {
          ...this.signupChartOptions,
          xaxis: {
            ...this.signupChartOptions.xaxis,
            categories: signupData.map((r) => r.day.slice(5)),
          },
        };

        // Revenue by user type
        const typeRows = byTypeRes.data?.data || [];
        const typeLabels = typeRows.map((r) => r.user_type);
        const typeValues = typeRows.map((r) => Number(r.total));
        this.revenueByType = { labels: typeLabels, series: typeValues };
        this.donutOptions = { ...this.donutOptions, labels: typeLabels };

        // Revenue by plan
        const planRows = byPlanRes.data?.data || [];
        const planLabels = planRows.map((r) => `${r.plan_days} days`);
        const planValues = planRows.map((r) => Number(r.total));
        this.revenueByPlan = { labels: planLabels, series: planValues };
        this.planChartOptions = {
          ...this.planChartOptions,
          xaxis: { categories: planLabels },
        };

        // Top counties
        const countiesRows = topCountiesRes.data?.counties || [];
        const countyLabels = countiesRows.map((r) => r.county);
        const countyValues = countiesRows.map((r) => Number(r.total));
        this.topCounties = { labels: countyLabels, series: countyValues };
        this.countyChartOptions = {
          ...this.countyChartOptions,
          xaxis: { categories: countyLabels },
        };

        // Top bureaus
        this.topBureaus = topBureausRes.data?.data || [];

        this.analyticsLoaded = true;
      } catch (err) {
        console.error("fetchAnalytics error:", err);
        this.showSnackbar("Failed to load analytics", "error", "mdi-alert");
      } finally {
        this.analyticsLoading = false;
      }
    },

    /* ─── SETTINGS ─── */
    async fetchSettings() {
      this.settingsLoading = true;
      try {
        const res = await axios.get(`${API_BASE}/api/admin/settings`);

        const body = res.data || {};
        const incoming = body.settings || {};

        this.settings = {
          employer: { ...(incoming.employer || {}) },
          bureau: { ...(incoming.bureau || {}) },
        };

        if (body.plans) {
          this.planDays = {
            EMPLOYER: body.plans.EMPLOYER || [3, 7, 30],
            BUREAU: body.plans.BUREAU || [30],
          };
        }

        this.settingsLoaded = true;
      } catch (err) {
        console.error("fetchSettings error:", err);
        this.showSnackbar("Failed to load settings", "error", "mdi-alert");
      } finally {
        this.settingsLoading = false;
      }
    },

    async saveSettings() {
      this.settingsSaving = true;
      try {
        const payload = {
          employer: this.settings.employer,
          bureau: this.settings.bureau,
        };

        const res = await axios.put(`${API_BASE}/api/admin/settings`, payload);

        if (res.status === 200) {
          this.showSnackbar(
            res.data.message || "Settings saved",
            "success",
            "mdi-check-circle"
          );
          await this.fetchSettings();
        }
      } catch (err) {
        console.error("saveSettings error:", err);
        const msg =
          err.response && err.response.data
            ? err.response.data.message || "Failed to save settings"
            : "Failed to save settings";
        this.showSnackbar(msg, "error", "mdi-alert");
      } finally {
        this.settingsSaving = false;
      }
    },

    /* ─── CREATE / EDIT ─── */
    openCreateDialog(type) {
      this.formType = type;
      this.formMode = "create";
      this.editingKey = null;

      if (type === "candidate") {
        this.form = {
          user_id: "",
          candidate_name: "",
          gender: "Female",
          dob: "",
          mobile_no: "",
          kin_phone_no: "",
          next_of_kin: "",
          village: "",
          ward: "",
          county: "",
          experience: "",
          salary: "",
          salary_period: "Monthly",
          status: "Available",
          working_status: "available",
        };
      } else {
        this.form = {};
      }

      this.formDialog = true;
    },

    openEditDialog(type, item) {
      this.formType = type;
      this.formMode = "edit";

      if (type === "candidate") {
        this.editingKey = item.candidate_id;
        this.form = {
          candidate_name: item.candidate_name || "",
          gender: item.gender || "Female",
          dob: this.formatDateInput(item.dob),
          mobile_no: item.mobile_no || "",
          kin_phone_no: item.kin_phone_no || "",
          next_of_kin: item.next_of_kin || "",
          village: item.village || "",
          ward: item.ward || "",
          county: item.county || "",
          experience: item.experience || "",
          salary: item.salary || "",
          salary_period: item.salary_period || "Monthly",
          status: item.status || "Available",
          working_status: item.working_status || "available",
        };
      } else if (type === "employer") {
        this.editingKey = item.uid;
        this.form = {
          name: item.name || "",
          email: item.email || "",
          phone_no: item.phone_no || "",
          county: item.county || "",
          city: item.city || "",
          street_name: item.street_name || "",
          access_expires_at: this.formatDateInput(item.access_expires_at),
        };
      } else if (type === "bureau") {
        this.editingKey = item.user_id;
        this.form = {
          bureau_name: item.bureau_name || "",
          name: item.name || "",
          email: item.email || "",
          phone_no: item.phone_no || "",
          county: item.county || "",
          city: item.city || "",
          trial_ends_at: this.formatDateInput(item.trial_ends_at),
          access_expires_at: this.formatDateInput(item.access_expires_at),
          subscription_status: item.subscription_status || "TRIAL",
          user_state: item.user_state || "",
        };
      }

      this.formDialog = true;
    },

    closeFormDialog() {
      if (this.formSaving) return;
      this.formDialog = false;
      this.form = {};
      this.formType = null;
      this.formMode = "create";
      this.editingKey = null;
    },

    async submitForm() {
      if (this.formSaving) return;

      if (this.formType === "candidate" && this.formMode === "create") {
        if (!this.form.user_id) return this.showSnackbar("Select a bureau", "error", "mdi-alert");
        if (!this.form.candidate_name) return this.showSnackbar("Enter full name", "error", "mdi-alert");
        if (!this.form.mobile_no) return this.showSnackbar("Enter phone number", "error", "mdi-alert");
        if (!this.form.county) return this.showSnackbar("Enter county", "error", "mdi-alert");
      }

      this.formSaving = true;

      try {
        let endpoint;
        let method = "post";

        if (this.formType === "candidate" && this.formMode === "create") {
          endpoint = `/api/admin/candidates`;
          method = "post";
        } else if (this.formType === "candidate") {
          endpoint = `/api/admin/candidates/${this.editingKey}`;
          method = "put";
        } else if (this.formType === "employer") {
          endpoint = `/api/admin/employers/${this.editingKey}`;
          method = "put";
        } else if (this.formType === "bureau") {
          endpoint = `/api/admin/bureaus/${this.editingKey}`;
          method = "put";
        }

        const res = await axios[method](`${API_BASE}${endpoint}`, this.form);

        if (res.status === 200 || res.status === 201) {
          this.showSnackbar(
            this.formMode === "create" ? "Created successfully" : "Updated successfully",
            "success",
            "mdi-check-circle"
          );

          const type = this.formType;

          this.closeFormDialog();

          if (type === "candidate") this.fetchCandidates();
          else if (type === "employer") this.fetchEmployers();
          else if (type === "bureau") this.fetchBureaus();

          this.fetchDashboard();
          this.fetchBureausForSelect();
        }
      } catch (error) {
        const msg =
          error.response && error.response.data
            ? error.response.data.message || "Operation failed"
            : "Operation failed";
        this.showSnackbar(msg, "error", "mdi-alert");
        console.error("submitForm", error);
      } finally {
        this.formSaving = false;
      }
    },

    openSuspendDialog(type, item) {
      this.suspendType = type;
      this.suspendTarget = item;
      this.suspendForm = {
        suspended: !item.is_suspended,
        reason: "",
      };
      this.suspendDialog = true;
    },

    async submitSuspend() {
      if (this.suspendSaving) return;

      if (this.suspendForm.suspended && !this.suspendForm.reason.trim()) {
        return this.showSnackbar("Reason is required", "error", "mdi-alert");
      }

      this.suspendSaving = true;

      try {
        let endpoint;
        if (this.suspendType === "employer") {
          endpoint = `/api/admin/employers/${this.suspendTarget.uid}/suspend`;
        } else if (this.suspendType === "bureau") {
          endpoint = `/api/admin/bureaus/${this.suspendTarget.user_id}/suspend`;
        }

        const res = await axios.post(`${API_BASE}${endpoint}`, {
          suspended: this.suspendForm.suspended,
          reason: this.suspendForm.reason,
        });

        if (res.status === 200) {
          this.showSnackbar(res.data.message || "Success", "success", "mdi-check-circle");

          const type = this.suspendType;
          this.suspendDialog = false;
          this.suspendTarget = null;

          if (type === "employer") this.fetchEmployers();
          else if (type === "bureau") this.fetchBureaus();

          this.fetchDashboard();
        }
      } catch (error) {
        const msg =
          error.response && error.response.data
            ? error.response.data.message || "Suspend failed"
            : "Suspend failed";
        this.showSnackbar(msg, "error", "mdi-alert");
        console.error("submitSuspend", error);
      } finally {
        this.suspendSaving = false;
      }
    },

    async openDetail(type, item) {
      this.detailType = type;
      this.detail = item;
      this.detailPayments = [];
      this.detailCandidates = [];
      this.detailDialog = true;
      this.detailLoading = true;

      try {
        let endpoint;
        if (type === "candidate") endpoint = `/api/admin/candidates/${item.candidate_id}`;
        else if (type === "employer") endpoint = `/api/admin/employers/${item.uid}`;
        else if (type === "bureau") endpoint = `/api/admin/bureaus/${item.user_id}`;

        const res = await axios.get(`${API_BASE}${endpoint}`);

        if (type === "candidate") {
          this.detail = res.data.candidate || item;
        } else if (type === "employer") {
          this.detail = res.data.employer || item;
          this.detailPayments = res.data.payments || [];
          this.detailCandidates = res.data.selected_candidates || [];
        } else if (type === "bureau") {
          this.detail = res.data.bureau || item;
          this.detailPayments = res.data.payments || [];
          this.detailCandidates = res.data.candidates || [];
        }
      } catch (error) {
        console.error("openDetail", error);
        this.showSnackbar("Failed to load details", "error", "mdi-alert");
      } finally {
        this.detailLoading = false;
      }
    },

    confirmDelete(type, item) {
      this.deleteType = type;
      this.deleteTarget = item;
      this.deleteDialog = true;
    },

    async executeDelete() {
      this.deleteLoading = true;
      try {
        let endpoint = "";
        if (this.deleteType === "candidate") endpoint = `/api/admin/candidates/${this.deleteTarget.candidate_id}`;
        else if (this.deleteType === "employer") endpoint = `/api/admin/employers/${this.deleteTarget.uid}`;
        else if (this.deleteType === "bureau") endpoint = `/api/admin/bureaus/${this.deleteTarget.user_id}`;

        await axios.delete(`${API_BASE}${endpoint}`);
        this.showSnackbar("Deleted successfully", "success", "mdi-delete");

        if (this.deleteType === "candidate") this.fetchCandidates();
        else if (this.deleteType === "employer") this.fetchEmployers();
        else if (this.deleteType === "bureau") this.fetchBureaus();

        this.fetchDashboard();
        this.fetchBureausForSelect();
      } catch (error) {
        const msg =
          error.response && error.response.data
            ? error.response.data.message || "Delete failed"
            : "Delete failed";
        this.showSnackbar(msg, "error", "mdi-alert");
        console.error("executeDelete", error);
      } finally {
        this.deleteLoading = false;
        this.deleteDialog = false;
        this.deleteTarget = null;
      }
    },

    logout() {
      if (this.$fire && this.$fire.auth) this.$fire.auth.signOut();
      this.$router.push("/login");
    },
  },

  watch: {
    statusFilter(newVal, oldVal) {
      if (newVal === oldVal) return;
      this.pagination.candidates.page = 1;
      this.tableOptions.candidates.page = 1;
      this.fetchCandidates();
    },
  },
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

.status-badge.unavailable {
  background: rgba(255, 82, 82, 0.1);
  border-color: rgba(255, 82, 82, 0.2);
  color: #FF5252 !important;
}

.status-badge.unavailable .dot { background: #FF5252; box-shadow: 0 0 8px #FF5252; }

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

.icon-btn.danger:hover {
  background: rgba(255, 82, 82, 0.1);
  color: #FF5252;
  box-shadow: 0 0 15px rgba(255, 82, 82, 0.2);
}

.icon-btn.view:hover {
  background: rgba(0, 255, 255, 0.1);
  color: #00FFFF;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
}

.icon-btn.edit:hover {
  background: rgba(255, 193, 7, 0.1);
  color: #FFC107;
  box-shadow: 0 0 15px rgba(255, 193, 7, 0.2);
}

.icon-btn.warn:hover {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
  box-shadow: 0 0 15px rgba(255, 152, 0, 0.2);
}

.icon-btn.success:hover {
  background: rgba(105, 240, 174, 0.1);
  color: #69F0AE;
  box-shadow: 0 0 15px rgba(105, 240, 174, 0.2);
}

.row-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
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

/* ===== FORM DIALOG ===== */
.form-card {
  background: #0E1018 !important;
  color: #E2E8F0 !important;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.dialog-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 22px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.dialog-top-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dialog-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #00FFFF, #00BCD4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialog-icon.candidate { background: linear-gradient(135deg, #00FFFF, #00BCD4); }
.dialog-icon.employer { background: linear-gradient(135deg, #FF9800, #F57C00); }
.dialog-icon.bureau { background: linear-gradient(135deg, #AB47BC, #7B1FA2); }
.dialog-icon.warn { background: linear-gradient(135deg, #FFC107, #FF9800); }

.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
}

.dialog-sub {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.85rem;
}

.form-body {
  padding: 24px;
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}

.form-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-label .req {
  color: #FF5252;
  margin-left: 2px;
}

.form-body ::v-deep .v-input__slot {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.form-body ::v-deep input,
.form-body ::v-deep textarea,
.form-body ::v-deep .v-select__selection {
  color: #fff !important;
  font-weight: 600;
}

.form-body ::v-deep input::placeholder,
.form-body ::v-deep textarea::placeholder {
  color: rgba(255, 255, 255, 0.25) !important;
}

.form-body ::v-deep fieldset {
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.form-actions {
  display: flex;
  align-items: center;
  padding: 18px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

/* ===== DETAIL DIALOG ===== */
.detail-card {
  background: #0E1018 !important;
  color: #E2E8F0 !important;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.detail-body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 24px;
  min-height: 0;
}

.detail-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.detail-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 20px;
}

.detail-avatar {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #fff;
  font-size: 1.1rem;
  flex-shrink: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.detail-avatar.orange { background: linear-gradient(135deg, #FF9800, #F57C00); }
.detail-avatar.purple { background: linear-gradient(135deg, #AB47BC, #7B1FA2); }

.detail-hero h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
}

.detail-hero p {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}

.detail-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.detail-item span {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
  font-weight: 700;
}

.detail-item strong {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  word-break: break-word;
}

.detail-subhead {
  margin: 20px 0 10px;
  font-size: 0.8rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-empty {
  padding: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.85rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.08);
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  gap: 12px;
}

.row-primary {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
}

.row-sub {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  margin-top: 2px;
}

.row-amount {
  color: #69F0AE;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* ===== ANALYTICS PANEL ===== */
.analytics-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 320px;
  color: rgba(255, 255, 255, 0.6);
}

.analytics-kpis {
  margin-bottom: 20px;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  height: 100%;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 255, 255, 0.2);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.kpi-icon {
  width: 46px;
  height: 46px;
  min-width: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon.cyan   { background: linear-gradient(135deg, #00FFFF, #00BCD4); }
.kpi-icon.green  { background: linear-gradient(135deg, #69F0AE, #00E676); }
.kpi-icon.purple { background: linear-gradient(135deg, #AB47BC, #7B1FA2); }
.kpi-icon.red    { background: linear-gradient(135deg, #FF5252, #D32F2F); }

.kpi-body {
  min-width: 0;
}

.kpi-label {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 950;
  color: #fff;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.kpi-sub {
  margin-top: 4px;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
}

.chart-card {
  padding: 22px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 20px;
}

.chart-title {
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.9rem;
  font-weight: 600;
}

.leaderboard-card {
  padding: 22px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.leaderboard-table {
  background: transparent !important;
}

.leaderboard-table ::v-deep th {
  font-size: 0.7rem !important;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.4) !important;
  font-weight: 800 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  padding: 12px 8px !important;
}

.leaderboard-table ::v-deep td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
  padding: 12px 8px !important;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
}

.rank-col {
  font-weight: 950;
  color: #00FFFF !important;
  width: 40px;
}

.lb-name {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #fff;
}

.lb-name .avatar {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  font-size: 0.65rem;
}

/* ===== SETTINGS PANEL ===== */
.settings-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 260px;
  color: rgba(255, 255, 255, 0.6);
}

.settings-section {
  padding: 22px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 20px;
}

.settings-section-head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.settings-section-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.settings-section-icon.orange {
  background: linear-gradient(135deg, #FF9800, #F57C00);
}

.settings-section-icon.purple {
  background: linear-gradient(135deg, #AB47BC, #7B1FA2);
}

.settings-section-head h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #fff;
}

.settings-section-head p {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

.settings-field {
  padding: 4px 0;
}

.settings-actions {
  display: flex;
  align-items: center;
  padding: 20px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 8px;
}

.settings-section ::v-deep .v-input__slot {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.settings-section ::v-deep input {
  color: #fff !important;
  font-weight: 700;
}

.settings-section ::v-deep .v-label {
  color: rgba(255, 255, 255, 0.65) !important;
}

.settings-section ::v-deep fieldset {
  border-color: rgba(255, 255, 255, 0.08) !important;
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

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .row-actions {
    flex-direction: column;
    gap: 2px;
  }

  .form-body {
    padding: 18px;
  }

  .dialog-top {
    padding: 18px;
  }

  .dialog-title {
    font-size: 1.1rem;
  }
}
</style>