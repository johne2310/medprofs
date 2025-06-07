import { Notify } from 'quasar'

/**
 * Composable for showing toast notifications
 * @returns {Object} Toast methods
 */
export function useToast() {
  /**
   * Show a success toast message
   * @param {string} message - The message to display
   * @param {Object} options - Additional options for the toast
   */
  const success = (message, options = {}) => {
    Notify.create({
      type: 'positive',
      color: 'positive',
      message,
      icon: 'check_circle',
      position: 'bottom-right',
      timeout: 3000,
      ...options
    })
  }

  /**
   * Show an error toast message
   * @param {string} message - The message to display
   * @param {Object} options - Additional options for the toast
   */
  const error = (message, options = {}) => {
    Notify.create({
      type: 'negative',
      color: 'negative',
      message,
      icon: 'error',
      position: 'bottom-right',
      timeout: 5000,
      ...options
    })
  }

  /**
   * Show an info toast message
   * @param {string} message - The message to display
   * @param {Object} options - Additional options for the toast
   */
  const info = (message, options = {}) => {
    Notify.create({
      type: 'info',
      color: 'info',
      message,
      icon: 'info',
      position: 'top',
      timeout: 3000,
      ...options
    })
  }

  /**
   * Show a warning toast message
   * @param {string} message - The message to display
   * @param {Object} options - Additional options for the toast
   */
  const warning = (message, options = {}) => {
    Notify.create({
      type: 'warning',
      color: 'warning',
      message,
      icon: 'warning',
      position: 'top',
      timeout: 4000,
      ...options
    })
  }

  /**
   * Show a custom toast message
   * @param {Object} options - Options for the toast
   */
  const custom = (options) => {
    Notify.create(options)
  }

  /**
   * Dismiss all currently displayed toasts
   */
  const dismissAll = () => {
    Notify.dismissAll()
  }

  return {
    success,
    error,
    info,
    warning,
    custom,
    dismissAll
  }
}