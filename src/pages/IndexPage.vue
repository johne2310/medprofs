<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Dashboard</div>

    <div class="row q-col-gutter-md">
      <!-- Quick Stats -->
      <div class="col-12 col-md-4">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Recent Profiles</div>
            <div class="text-h3 q-mt-sm">0</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Favorite Drugs</div>
            <div class="text-h3 q-mt-sm">0</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">Patients</div>
            <div class="text-h3 q-mt-sm">0</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="text-h5 q-mt-lg q-mb-md">Quick Actions</div>
    <div class="row q-col-gutter-md">
      <div class="col-6 col-md-3">
        <q-card class="action-card" clickable to="/patients">
          <q-card-section class="text-center">
            <q-icon name="people" size="3rem" color="primary" />
            <div class="text-subtitle1 q-mt-sm">Select Patient</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card class="action-card" clickable to="/profiles">
          <q-card-section class="text-center">
            <q-icon name="medication" size="3rem" color="primary" />
            <div class="text-subtitle1 q-mt-sm">New Profile</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card class="action-card" clickable to="/favorites">
          <q-card-section class="text-center">
            <q-icon name="favorite" size="3rem" color="primary" />
            <div class="text-subtitle1 q-mt-sm">Manage Favorites</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-6 col-md-3">
        <q-card class="action-card" clickable to="/settings">
          <q-card-section class="text-center">
            <q-icon name="settings" size="3rem" color="primary" />
            <div class="text-subtitle1 q-mt-sm">Settings</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// This is just a UI scaffold, no actual data or logic
</script>

<style scoped>
.dashboard-card, .action-card {
  height: 100%;
}

.action-card {
  transition: transform 0.2s;
}

.action-card:hover {
  transform: translateY(-5px);
}
</style>
