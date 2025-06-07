// import { ref } from 'vue'
import { useQuasar } from 'quasar'

export function useToaster() {
  const $q = useQuasar()

  const showNotification = (message, type = 'success') => {
    let color = ''
    let icon = ''

    if (type === 'success') {
      color = 'positive' // Quasar's default success color
      icon = 'check_circle'
    } else if (type === 'error') {
      color = 'negative' // Quasar's default error color
      icon = 'error'
    } else if (type === 'warning') {
      color = 'warning' // Quasar's default warning color
      icon = 'warning'
    } else if (type === 'info') {
      color = 'info' // Quasar's default info color
      icon = 'info'
    } else {
      color = 'grey-8' // Default for unknown types
      icon = 'info'
    }

    // Check if $q is defined and has notify function
    if ($q && typeof $q.notify === 'function') {
      $q.notify({
        message: message,
        color: color,
        icon: icon,
        position: 'bottom-right', // Or 'top', 'bottom-left', etc.
        timeout: 3000, // Duration in ms
        actions: [
          {
            label: 'Dismiss',
            color: 'white',
            handler: () => {
              /* ... */
            },
          },
        ],
      })
    } else {
      // Fallback if $q.notify is not available
      console.warn('Quasar notify is not available, using console instead:', message)
      if (type === 'error') {
        console.error(message)
      } else {
        console.log(message)
      }
    }
  }

  const showSuccess = (message) => {
    showNotification(message, 'success')
  }

  const showError = (message) => {
    showNotification(message, 'error')
  }

  const showWarning = (message) => {
    showNotification(message, 'warning')
  }

  const showInfo = (message) => {
    showNotification(message, 'info')
  }

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
