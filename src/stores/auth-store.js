import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
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
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        throw sessionError
      }

      if (session) {
        console.log('session from init: ', session)
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
  const login = async (email, password) => {
    loading.value = true
    error.value = null

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      throw loginError
    }

    user.value = data.user
    console.log('user: ', user.value)

    // Load drugs after successful login
    const profilesStore = useProfilesStore()
    await profilesStore.fetchDrugs()
    await profilesStore.fetchCommonDrugs()

    await router.push('/dashboard')
    loading.value = false
    console.log('user details: ', data.user)
    return { data, success: true, error: null }
    // return data
  }

  // Register new user
  const register = async (email, password) => {
    loading.value = true
    error.value = null

    const { data, error: registerError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (registerError) {
      console.error('Registration error:', registerError)
      throw registerError
    }

    loading.value = false
    return { data, success: true, error: null }
    // return data
  }

  // Logout user
  const logout = async () => {
    loading.value = true
    error.value = null

    const { error: logoutError } = await supabase.auth.signOut()

    if (logoutError) {
      console.error('Logout error:', logoutError)
      return { success: false, error: logoutError }
    }
    // if successful logout
    user.value = null
    await router.push('/login')
    loading.value = false
    return { success: true, error: null }
  }

  // Reset password
  const resetPassword = async (email) => {
    loading.value = true
    error.value = null

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)

    if (resetError) {
      console.error('Password reset error:', resetError)
      throw resetError
    }

    loading.value = false
    return { success: true, error: null }
  }

  // Update user password
  async function updatePassword(password) {
    loading.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
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
    updatePassword,
  }
})
