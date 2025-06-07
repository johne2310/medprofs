import { defineStore } from 'pinia'
import { ref } from 'vue'
import supabase from 'src/config/supabase'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({})
  const loading = ref(false)
  const error = ref(null)

  // Fetch all settings
  async function fetchSettings() {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('app_settings')
        .select('*')
      
      if (fetchError) {
        throw fetchError
      }
      
      // Convert array of settings to an object for easier access
      const settingsObj = {}
      if (data) {
        data.forEach(setting => {
          settingsObj[setting.setting_key] = setting.setting_value
        })
      }
      
      settings.value = settingsObj
      return settingsObj
    } catch (err) {
      error.value = err.message || 'Failed to fetch settings'
      console.error('Fetch settings error:', err)
      return {}
    } finally {
      loading.value = false
    }
  }

  // Get a specific setting by key
  async function getSetting(key) {
    // If we already have the setting in our store, return it
    if (settings.value[key]) {
      return settings.value[key]
    }
    
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', key)
        .single()
      
      if (fetchError) {
        throw fetchError
      }
      
      if (data) {
        // Update the settings object with the new setting
        settings.value[key] = data.setting_value
        return data.setting_value
      }
      
      return null
    } catch (err) {
      error.value = err.message || `Failed to fetch setting: ${key}`
      console.error(`Fetch setting error for ${key}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Save a setting
  async function saveSetting(key, value) {
    loading.value = true
    error.value = null
    
    try {
      // Check if the setting already exists
      const { data: existingData, error: checkError } = await supabase
        .from('app_settings')
        .select('id')
        .eq('setting_key', key)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw checkError
      }
      
      let result
      
      // If setting exists, update it
      if (existingData) {
        const { data, error: updateError } = await supabase
          .from('app_settings')
          .update({ setting_value: value })
          .eq('setting_key', key)
          .select()
        
        if (updateError) {
          throw updateError
        }
        
        result = data ? data[0] : null
      } 
      // If setting doesn't exist, create it
      else {
        const { data, error: insertError } = await supabase
          .from('app_settings')
          .insert([{ setting_key: key, setting_value: value }])
          .select()
        
        if (insertError) {
          throw insertError
        }
        
        result = data ? data[0] : null
      }
      
      // Update the settings object with the new value
      if (result) {
        settings.value[key] = result.setting_value
      }
      
      return result ? result.setting_value : null
    } catch (err) {
      error.value = err.message || `Failed to save setting: ${key}`
      console.error(`Save setting error for ${key}:`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a setting
  async function deleteSetting(key) {
    loading.value = true
    error.value = null
    
    try {
      const { error: deleteError } = await supabase
        .from('app_settings')
        .delete()
        .eq('setting_key', key)
      
      if (deleteError) {
        throw deleteError
      }
      
      // Remove the setting from our store
      if (settings.value[key]) {
        delete settings.value[key]
      }
      
      return true
    } catch (err) {
      error.value = err.message || `Failed to delete setting: ${key}`
      console.error(`Delete setting error for ${key}:`, err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    settings,
    loading,
    error,
    fetchSettings,
    getSetting,
    saveSetting,
    deleteSetting
  }
})