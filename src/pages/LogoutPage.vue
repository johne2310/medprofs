<template>
  <q-page class="flex flex-center">
    <q-card class="text-center q-pa-lg">
      <q-circular-progress class="q-mb-md" color="primary" indeterminate size="50px" />
      <div class="text-h6">Logging out...</div>
      <div class="text-caption q-mt-sm">You will be redirected to the login page.</div>

      <q-btn class="q-mt-lg" color="primary" flat label="Return to Login" to="/login" />
    </q-card>
  </q-page>
</template>

<script setup>
// This is just a UI scaffold, no actual logout logic
// In a real implementation, this would handle the logout process and redirect
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
import { useToaster } from 'src/composables/useToast.js'

const useAuth = useAuthStore()
const { showSuccess, showError } = useToaster()

onMounted(() => {
  let result = useAuth.logout()

  const { success, error } = result

  if (success) {
    showSuccess('You have been logged out.')
  } else if (error) {
    showError('An error occurred while logging out.')
  }
})
</script>
