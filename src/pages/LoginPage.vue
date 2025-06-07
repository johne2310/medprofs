<template>
  <q-page class="flex flex-center">
    <q-card class="login-card">
      <q-card-section class="text-center">
        <div class="text-h4 q-mb-md">Fast Profiles</div>
        <div class="text-subtitle1 q-mb-xl">Login to your account</div>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input
            outlined
            label="Email"
            type="email"
          />

          <q-input
            outlined
            label="Password"
            type="password"
          />

          <div class="q-mt-lg">
            <q-btn
              color="primary"
              label="Login"
              class="full-width"
              to="/dashboard"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
// This is just a UI scaffold, no actual authentication logic
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}
</style>
