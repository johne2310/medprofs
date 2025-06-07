<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="headerColorClass">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Fast Profiles
        </q-toolbar-title>

        <div>v0.0.1</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Navigation
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Dashboard',
    caption: 'Home screen',
    icon: 'dashboard',
    to: '/dashboard'
  },
  {
    title: 'Patient Selection',
    caption: 'Select or add a patient',
    icon: 'people',
    to: '/patients'
  },
  {
    title: 'Medication Profiles',
    caption: 'Create and manage profiles',
    icon: 'medication',
    to: '/profiles'
  },
  {
    title: 'Favorites',
    caption: 'Manage common drugs',
    icon: 'favorite',
    to: '/favorites'
  },
  {
    title: 'Settings',
    caption: 'Application settings',
    icon: 'settings',
    to: '/settings'
  },
  {
    title: 'Logout',
    caption: 'Sign out of application',
    icon: 'logout',
    to: '/logout'
  }
]

const leftDrawerOpen = ref(false)
const route = useRoute()

const headerColorClass = computed(() => {
  // Blue for Dashboard and Profiles
  if (route.path.startsWith('/dashboard') || route.path.startsWith('/profiles')) {
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

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
