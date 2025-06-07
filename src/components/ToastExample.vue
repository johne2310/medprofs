<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-btn color="positive" label="Success Toast" @click="showSuccessToast" />
      <q-btn color="negative" label="Error Toast" @click="showErrorToast" />
      <q-btn color="info" label="Info Toast" @click="showInfoToast" />
      <q-btn color="warning" label="Warning Toast" @click="showWarningToast" />
      <q-btn color="primary" label="Custom Toast" @click="showCustomToast" />
      <q-btn color="dark" label="Dismiss All" @click="dismissAllToasts" />
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'src/composables/useToast'

// Initialize the showMessage composable
const showMessage = useToast()

// Example functions to demonstrate different showMessage types
function showSuccessToast() {
  showMessage.success('Operation completed successfully!', {
    timeout: 3000,
    position: 'bottom-right'
  })
}

function showErrorToast() {
  showMessage.error('An error occurred. Please try again.')
}

function showInfoToast() {
  showMessage.info('This is an informational message.')
}

function showWarningToast() {
  showMessage.warning('Warning: This action cannot be undone.')
}

function showCustomToast() {
  showMessage.custom({
    message: 'Custom showMessage with actions',
    color: 'purple',
    icon: 'notifications',
    position: 'bottom-right',
    timeout: 5000,
    actions: [
      { label: 'Dismiss', color: 'white' },
      { label: 'View', color: 'yellow', handler: () => console.log('View clicked') }
    ]
  })
}

function dismissAllToasts() {
  showMessage.dismissAll()
}
</script>