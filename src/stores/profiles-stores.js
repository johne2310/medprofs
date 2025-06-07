import { defineStore } from 'pinia'
import { ref } from 'vue'
import supabase from 'src/config/supabase'

export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref([])
  const currentProfile = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const drugs = ref([])
  const commonDrugs = ref([])

  // Fetch all profiles for a patient
  async function fetchPatientProfiles(patientId) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('patient_profiles')
        .select('*, profile_access_links(*)')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
      
      if (fetchError) {
        throw fetchError
      }
      
      profiles.value = data || []
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch patient profiles'
      console.error('Fetch patient profiles error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch a specific profile by ID
  async function fetchProfileById(profileId) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('patient_profiles')
        .select('*, profile_access_links(*)')
        .eq('id', profileId)
        .single()
      
      if (fetchError) {
        throw fetchError
      }
      
      currentProfile.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch profile'
      console.error('Fetch profile error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Create a new profile
  async function createProfile(profileData) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: createError } = await supabase
        .from('patient_profiles')
        .insert([profileData])
        .select()
      
      if (createError) {
        throw createError
      }
      
      // Add the new profile to the list if it exists
      if (data && data.length > 0) {
        profiles.value.unshift(data[0])
        currentProfile.value = data[0]
      }
      
      return data ? data[0] : null
    } catch (err) {
      error.value = err.message || 'Failed to create profile'
      console.error('Create profile error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update a profile
  async function updateProfile(profileId, profileData) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: updateError } = await supabase
        .from('patient_profiles')
        .update(profileData)
        .eq('id', profileId)
        .select()
      
      if (updateError) {
        throw updateError
      }
      
      // Update the profile in the list if it exists
      if (data && data.length > 0) {
        const index = profiles.value.findIndex(p => p.id === profileId)
        if (index !== -1) {
          profiles.value[index] = data[0]
        }
        
        // Update current profile if it's the one being edited
        if (currentProfile.value && currentProfile.value.id === profileId) {
          currentProfile.value = data[0]
        }
      }
      
      return data ? data[0] : null
    } catch (err) {
      error.value = err.message || 'Failed to update profile'
      console.error('Update profile error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a profile
  async function deleteProfile(profileId) {
    loading.value = true
    error.value = null
    
    try {
      const { error: deleteError } = await supabase
        .from('patient_profiles')
        .delete()
        .eq('id', profileId)
      
      if (deleteError) {
        throw deleteError
      }
      
      // Remove the profile from the list
      profiles.value = profiles.value.filter(p => p.id !== profileId)
      
      // Clear current profile if it's the one being deleted
      if (currentProfile.value && currentProfile.value.id === profileId) {
        currentProfile.value = null
      }
      
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete profile'
      console.error('Delete profile error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create a shareable link for a profile
  async function createProfileLink(profileId, expiryHours = 24) {
    loading.value = true
    error.value = null
    
    try {
      // Generate a unique hash
      const uniqueHash = Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15)
      
      // Calculate expiry time
      const expiryTime = new Date()
      expiryTime.setHours(expiryTime.getHours() + expiryHours)
      
      // Create the link
      const { data, error: createError } = await supabase
        .from('profile_access_links')
        .insert([{
          profile_id: profileId,
          unique_hash: uniqueHash,
          expiry_time: expiryTime.toISOString(),
          is_active: true
        }])
        .select()
      
      if (createError) {
        throw createError
      }
      
      // Update the profile with the link ID
      if (data && data.length > 0) {
        await updateProfile(profileId, { viewable_link_id: data[0].id })
        
        // Update the current profile if it's the one being shared
        if (currentProfile.value && currentProfile.value.id === profileId) {
          await fetchProfileById(profileId)
        }
      }
      
      return data ? data[0] : null
    } catch (err) {
      error.value = err.message || 'Failed to create profile link'
      console.error('Create profile link error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch all drugs
  async function fetchDrugs() {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('druglist')
        .select('*')
        .order('generic_name', { ascending: true })
      
      if (fetchError) {
        throw fetchError
      }
      
      drugs.value = data || []
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch drugs'
      console.error('Fetch drugs error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch common drugs
  async function fetchCommonDrugs() {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('druglist')
        .select('*')
        .eq('common_drug', true)
        .order('generic_name', { ascending: true })
      
      if (fetchError) {
        throw fetchError
      }
      
      commonDrugs.value = data || []
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch common drugs'
      console.error('Fetch common drugs error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Search drugs
  async function searchDrugs(searchTerm) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: searchError } = await supabase
        .from('druglist')
        .select('*')
        .or(`generic_name.ilike.%${searchTerm}%,brand_name.ilike.%${searchTerm}%`)
        .order('generic_name', { ascending: true })
      
      if (searchError) {
        throw searchError
      }
      
      return data || []
    } catch (err) {
      error.value = err.message || 'Failed to search drugs'
      console.error('Search drugs error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Set current profile
  function setCurrentProfile(profile) {
    currentProfile.value = profile
  }

  // Clear current profile
  function clearCurrentProfile() {
    currentProfile.value = null
  }

  return {
    profiles,
    currentProfile,
    loading,
    error,
    drugs,
    commonDrugs,
    fetchPatientProfiles,
    fetchProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
    createProfileLink,
    fetchDrugs,
    fetchCommonDrugs,
    searchDrugs,
    setCurrentProfile,
    clearCurrentProfile
  }
})