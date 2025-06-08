<template>
  <q-layout view="hHh Lpr lFf">
    <q-header :class="headerColorClass">
      <q-toolbar>
        <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleLeftDrawer" />

        <q-toolbar-title> Fast Profiles</q-toolbar-title>

        <div class="q-mr-md">ver: {{ packageInfo.version }}</div>
        <div v-if="authStore.user" class="q-mr-sm">
          <q-icon name="person" size="sm"></q-icon>
          {{ authStore.user.email }}
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered show-if-above>
      <q-list>
        <q-item-label header> Navigation</q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import packageInfo from '../../package.json'
import { useRoute, useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'
import { useAuthStore } from 'src/stores/auth-store'

const authStore = useAuthStore()
const router = useRouter()

// Initialize auth store when component mounts
onMounted(async () => {
  await authStore.init()

  // Redirect to login if not authenticated
  if (!authStore.isLoggedIn) {
    await router.push('/login')
  }
})

const linksList = [
  {
    title: 'Dashboard',
    caption: 'Home screen',
    icon: 'dashboard',
    to: '/dashboard',
  },
  {
    title: 'Patient Selection',
    caption: 'Select or add a patient',
    icon: 'people',
    to: '/patients',
  },
  {
    title: 'Medication Profiles',
    caption: 'Create and manage profiles',
    icon: 'medication',
    to: '/profiles',
  },
  {
    title: 'Drug List',
    caption: 'View all available drugs',
    icon: 'fa-solid fa-pills',
    to: '/drugs',
  },
  {
    title: 'Favorites',
    caption: 'Manage common drugs',
    icon: 'favorite',
    to: '/favorites',
  },
  {
    title: 'Settings',
    caption: 'Application settings',
    icon: 'settings',
    to: '/settings',
  },
  {
    title: 'Logout',
    caption: 'Sign out of application',
    icon: 'logout',
    to: '/logout',
  },
]

const leftDrawerOpen = ref(false)
const route = useRoute()

const headerColorClass = computed(() => {
  // Blue for Dashboard, Profiles, and Drugs
  if (
    route.path.startsWith('/dashboard') ||
    route.path.startsWith('/profiles') ||
    route.path.startsWith('/drugs')
  ) {
    return 'bg-blue'
  }
  // Grey for Patients and Settings
  else if (route.path.startsWith('/patients') || route.path.startsWith('/settings')) {
    return 'bg-grey-8'
  }
  // Orange for Favorites and Logout
  else if (route.path.startsWith('/favorites') || route.path.startsWith('/logout')) {
    return 'bg-orange'
  }
  // Default to blue
  return 'bg-blue'
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
