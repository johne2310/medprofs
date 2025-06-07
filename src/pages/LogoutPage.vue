<template>
  <q-page class="flex flex-center">
    <q-card class="text-center q-pa-lg">
      <q-circular-progress
        indeterminate
        size="50px"
        color="primary"
        class="q-mb-md"
      />
      <div class="text-h6">Logging out...</div>
      <div class="text-caption q-mt-sm">You will be redirected to the login page.</div>
      
      <q-btn
        flat
        color="primary"
        label="Return to Login"
        class="q-mt-lg"
        to="/login"
      />
    </q-card>
  </q-page>
</template>

<script setup>
// This is just a UI scaffold, no actual logout logic
// In a real implementation, this would handle the logout process and redirect
</script>