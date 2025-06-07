<template>
  <q-page class="flex flex-center">
    <q-card class="login-card">
      <q-card-section class="text-center">
        <div class="text-h4 q-mb-md">Fast Profiles</div>
        <div class="text-subtitle1 q-mb-xl">Login to your account</div>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="handleLogin" ref="loginForm">
          <q-input
            v-model="email"
            outlined
            label="Email"
            type="email"
            :rules="[
              val => !!val || 'Email is required',
              val => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Please enter a valid email'
            ]"
            lazy-rules
          />

          <q-input
            v-model="password"
            outlined
            label="Password"
            type="password"
            :rules="[val => !!val || 'Password is required']"
            lazy-rules
          />

          <div v-if="authStore.error" class="text-negative q-mb-md">
            {{ authStore.error }}
          </div>

          <div class="q-mt-lg">
            <q-btn
              type="submit"
              color="primary"
              label="Login"
              class="full-width"
              :loading="authStore.loading"
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
import { useQuasar } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()
const loginForm = ref(null)

const email = ref('')
const password = ref('')

async function handleLogin() {
  try {
    // Validate form
    const isValid = await loginForm.value.validate()
    if (!isValid) {
      return
    }

    // Attempt login
    await authStore.login(email.value, password.value)

    // Show success notification
    $q.notify({
      color: 'positive',
      message: 'Login successful',
      icon: 'check'
    })
} catch (err) {
    console.error('Failed to login:', err)
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
