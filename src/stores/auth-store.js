import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import supabase from 'src/config/supabase'
import { useProfilesStore } from 'src/stores/profiles-stores'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed property to check if user is logged in
  const isLoggedIn = computed(() => !!user.value)

  // Initialize auth state from session
  async function init() {
    loading.value = true
    error.value = null

    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (session) {
        user.value = session.user
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          user.value = session.user
        } else if (event === 'SIGNED_OUT') {
          user.value = null
          router.push('/login')
        }
      })
    } catch (err) {
      error.value = err.message || 'Failed to initialize authentication'
      console.error('Auth initialization error:', err)
    } finally {
      loading.value = false
    }
  }

  // Login with email and password
  async function login(email, password) {
    loading.value = true
    error.value = null

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (loginError) {
        throw loginError
      }

      user.value = data.user

      // Load drugs after successful login
      const profilesStore = useProfilesStore()
      await profilesStore.fetchDrugs()
      await profilesStore.fetchCommonDrugs()

      router.push('/dashboard')
      return data
    } catch (err) {
      error.value = err.message || 'Failed to login'
      console.error('Login error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Register new user
  async function register(email, password) {
    loading.value = true
    error.value = null

    try {
      const { data, error: registerError } = await supabase.auth.signUp({
        email,
        password
      })

      if (registerError) {
        throw registerError
      }

      return data
    } catch (err) {
      error.value = err.message || 'Failed to register'
      console.error('Registration error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout user
  async function logout() {
    loading.value = true
    error.value = null

    try {
      const { error: logoutError } = await supabase.auth.signOut()

      if (logoutError) {
        throw logoutError
      }

      user.value = null
      router.push('/login')
    } catch (err) {
      error.value = err.message || 'Failed to logout'
      console.error('Logout error:', err)
    } finally {
      loading.value = false
    }
  }

  // Reset password
  async function resetPassword(email) {
    loading.value = true
    error.value = null

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)

      if (resetError) {
        throw resetError
      }

      return true
    } catch (err) {
      error.value = err.message || 'Failed to send password reset email'
      console.error('Password reset error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update user password
  async function updatePassword(password) {
    loading.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password
      })

      if (updateError) {
        throw updateError
      }

      return true
    } catch (err) {
      error.value = err.message || 'Failed to update password'
      console.error('Password update error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    init,
    login,
    register,
    logout,
    resetPassword,
    updatePassword
  }
})
