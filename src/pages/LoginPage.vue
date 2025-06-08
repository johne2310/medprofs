<template>
  <q-page class="flex flex-center">
    <q-card class="login-card">
      <q-card-section class="text-center">
        <div class="text-h4 q-mb-md">Fast Profiles</div>
        <div class="text-subtitle1 q-mb-xl">Login to your account</div>
      </q-card-section>

      <q-card-section>
        <q-form ref="loginForm" class="q-gutter-md" @submit.prevent="handleLogin">
          <q-input
            v-model="email"
            :rules="[
              (val) => !!val || 'Email is required',
              (val) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
                'Please enter a valid email',
            ]"
            label="Email"
            lazy-rules
            outlined
            type="email"
          />

          <q-input
            v-model="password"
            :rules="[(val) => !!val || 'Password is required']"
            label="Password"
            lazy-rules
            outlined
            type="password"
          />

          <div v-if="authStore.error" class="text-negative q-mb-md">
            {{ authStore.error }}
          </div>

          <div class="q-mt-lg">
            <q-btn
              :loading="authStore.loading"
              class="full-width"
              color="primary"
              label="Login"
              type="submit"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
import { useToaster } from 'src/composables/useToast.js'

const authStore = useAuthStore()
const { showSuccess, showError } = useToaster()
const loginForm = ref(null)

const email = ref('')
const password = ref('')

async function handleLogin() {
  // Validate form
  const isValid = await loginForm.value.validate()
  if (!isValid) {
    return
  }

  // Attempt login
  let result = await authStore.login(email.value, password.value)

  const { success, error } = result

  //show success or error messages for login result
  if (success) {
    showSuccess('You have been logged in.')
  } else if (error) {
    showError('Failed to login:', error)
  }
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}
</style>
