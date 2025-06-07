<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Settings</div>

    <!-- Loading State -->
    <div v-if="settingsStore.loading || authStore.loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Loading settings...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="settingsStore.error || authStore.error" class="text-negative q-pa-md">
      <div v-if="settingsStore.error">{{ settingsStore.error }}</div>
      <div v-if="authStore.error">{{ authStore.error }}</div>
    </div>

    <q-card v-else>
      <q-tabs
        v-model="activeTab"
        class="text-primary"
      >
        <q-tab name="account" label="Account" icon="person" />
        <q-tab name="appearance" label="Appearance" icon="palette" />
        <q-tab name="notifications" label="Notifications" icon="notifications" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <!-- Account Settings -->
        <q-tab-panel name="account">
          <div class="text-h6 q-mb-md">Account Settings</div>

          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Email</q-item-label>
                <q-input 
                  v-model="userEmail" 
                  dense 
                  outlined 
                  type="email" 
                  readonly
                />
                <q-item-label caption>Email cannot be changed</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>Change Password</q-item-label>
                <q-input 
                  v-model="currentPassword" 
                  dense 
                  outlined 
                  type="password" 
                  label="Current Password" 
                  class="q-mb-sm" 
                />
                <q-input 
                  v-model="newPassword" 
                  dense 
                  outlined 
                  type="password" 
                  label="New Password" 
                  class="q-mb-sm"
                  :rules="[val => val.length >= 8 || 'Password must be at least 8 characters']"
                />
                <q-input 
                  v-model="confirmPassword" 
                  dense 
                  outlined 
                  type="password" 
                  label="Confirm New Password"
                  :rules="[val => val === newPassword || 'Passwords do not match']"
                />
                <div class="q-mt-sm">
                  <q-btn 
                    label="Update Password" 
                    color="primary" 
                    :disable="!canUpdatePassword"
                    @click="updatePassword"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <!-- Appearance Settings -->
        <q-tab-panel name="appearance">
          <div class="text-h6 q-mb-md">Appearance Settings</div>

          <q-list>
            <q-item tag="label">
              <q-item-section>
                <q-item-label>Dark Mode</q-item-label>
                <q-item-label caption>Enable dark mode for the application</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle 
                  v-model="darkMode" 
                  color="primary"
                  @update:model-value="saveAppearanceSettings"
                />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label>Font Size</q-item-label>
                <q-slider
                  v-model="fontSize"
                  :min="12"
                  :max="20"
                  :step="1"
                  label
                  label-always
                  color="primary"
                  @update:model-value="saveAppearanceSettings"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <!-- Notification Settings -->
        <q-tab-panel name="notifications">
          <div class="text-h6 q-mb-md">Notification Settings</div>

          <q-list>
            <q-item tag="label">
              <q-item-section>
                <q-item-label>Email Notifications</q-item-label>
                <q-item-label caption>Receive notifications via email</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle 
                  v-model="emailNotifications" 
                  color="primary"
                  @update:model-value="saveNotificationSettings"
                />
              </q-item-section>
            </q-item>

            <q-item tag="label">
              <q-item-section>
                <q-item-label>SMS Notifications</q-item-label>
                <q-item-label caption>Receive notifications via SMS</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle 
                  v-model="smsNotifications" 
                  color="primary"
                  @update:model-value="saveNotificationSettings"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>

      <q-card-actions align="right">
        <q-btn flat label="Reset to Defaults" color="grey" @click="resetSettings" />
        <q-btn label="Save All Changes" color="primary" @click="saveAllSettings" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from 'src/stores/settings-store'
import { useAuthStore } from 'src/stores/auth-store'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const settingsStore = useSettingsStore()
const authStore = useAuthStore()

// Tab state
const activeTab = ref('account')

// Account settings
const userEmail = computed(() => authStore.user?.email || '')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Appearance settings
const darkMode = ref(false)
const fontSize = ref(14)

// Notification settings
const emailNotifications = ref(false)
const smsNotifications = ref(false)

// Computed property to check if password can be updated
const canUpdatePassword = computed(() => {
  return currentPassword.value && 
         newPassword.value && 
         confirmPassword.value && 
         newPassword.value === confirmPassword.value &&
         newPassword.value.length >= 8
})

// Load settings from store
async function loadSettings() {
  try {
    // Load appearance settings
    const appearanceSettings = await settingsStore.getSetting('appearance')
    if (appearanceSettings) {
      darkMode.value = appearanceSettings.darkMode || false
      fontSize.value = appearanceSettings.fontSize || 14
    }

    // Load notification settings
    const notificationSettings = await settingsStore.getSetting('notifications')
    if (notificationSettings) {
      emailNotifications.value = notificationSettings.email || false
      smsNotifications.value = notificationSettings.sms || false
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to load settings',
      icon: 'error'
    })
  }
}

// Save appearance settings
async function saveAppearanceSettings() {
  try {
    await settingsStore.saveSetting('appearance', {
      darkMode: darkMode.value,
      fontSize: fontSize.value
    })

    $q.notify({
      color: 'positive',
      message: 'Appearance settings saved',
      icon: 'check'
    })
  } catch (error) {
    console.error('Failed to save appearance settings:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to save appearance settings',
      icon: 'error'
    })
  }
}

// Save notification settings
async function saveNotificationSettings() {
  try {
    await settingsStore.saveSetting('notifications', {
      email: emailNotifications.value,
      sms: smsNotifications.value
    })

    $q.notify({
      color: 'positive',
      message: 'Notification settings saved',
      icon: 'check'
    })
  } catch (error) {
    console.error('Failed to save notification settings:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to save notification settings',
      icon: 'error'
    })
  }
}

// Update password
async function updatePassword() {
  try {
    await authStore.updatePassword(newPassword.value)

    // Clear password fields
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    $q.notify({
      color: 'positive',
      message: 'Password updated successfully',
      icon: 'check'
    })
  } catch (error) {
    console.error('Failed to update password:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to update password: ' + error.message,
      icon: 'error'
    })
  }
}

// Reset settings to defaults
async function resetSettings() {
  try {
    // Reset appearance settings
    darkMode.value = false
    fontSize.value = 14
    await saveAppearanceSettings()

    // Reset notification settings
    emailNotifications.value = false
    smsNotifications.value = false
    await saveNotificationSettings()

    $q.notify({
      color: 'positive',
      message: 'Settings reset to defaults',
      icon: 'check'
    })
  } catch (error) {
    console.error('Failed to reset settings:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to reset settings',
      icon: 'error'
    })
  }
}

// Save all settings
async function saveAllSettings() {
  try {
    await saveAppearanceSettings()
    await saveNotificationSettings()

    $q.notify({
      color: 'positive',
      message: 'All settings saved successfully',
      icon: 'check'
    })
  } catch (error) {
    console.error('Failed to save all settings:', error)
    $q.notify({
      color: 'negative',
      message: 'Failed to save all settings',
      icon: 'error'
    })
  }
}

// Load settings when component mounts
onMounted(async () => {
  await loadSettings()
})
</script>
