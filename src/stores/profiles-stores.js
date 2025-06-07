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
        .select('*, profile_access_links!profile_id(*)')
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

    console.log('Fetching profile by ID:', profileId)

    try {
      const { data, error: fetchError } = await supabase
        .from('patient_profiles')
        .select('*, profile_access_links!profile_id(*)')
        .eq('id', profileId)
        .single()

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError)
        throw fetchError
      }

      console.log('Fetched profile data:', data)

      if (!data) {
        console.warn('No profile found with ID:', profileId)
        return null
      }

      // Ensure profile_data exists
      if (!data.profile_data) {
        console.log('Profile has no profile_data, initializing it')
        data.profile_data = { medications: [] }

        // Update the profile in the database
        await updateProfile(profileId, {
          profile_data: data.profile_data
        })
      } 
      // Ensure medications exists and is an array
      else if (!data.profile_data.medications) {
        console.log('Profile has no medications array, initializing it')
        data.profile_data.medications = []

        // Update the profile in the database
        await updateProfile(profileId, {
          profile_data: {
            ...data.profile_data,
            medications: []
          }
        })
      }
      // Ensure medications is an array
      else if (!Array.isArray(data.profile_data.medications)) {
        console.warn('Profile medications is not an array, converting it')
        data.profile_data.medications = []

        // Update the profile in the database
        await updateProfile(profileId, {
          profile_data: {
            ...data.profile_data,
            medications: []
          }
        })
      }

      // Set the current profile using our enhanced setCurrentProfile function
      setCurrentProfile(data)

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

    console.log('Updating profile:', profileId, 'with data:', profileData)

    try {
      // Ensure we're not overwriting the entire profile_data if only updating a part
      if (profileData.profile_data && currentProfile.value && currentProfile.value.profile_data) {
        console.log('Merging profile_data with existing data')
        profileData.profile_data = {
          ...currentProfile.value.profile_data,
          ...profileData.profile_data
        }

        // Ensure medications is always an array
        if (profileData.profile_data.medications === undefined) {
          profileData.profile_data.medications = currentProfile.value.profile_data.medications || []
        }

        console.log('Merged profile_data:', profileData.profile_data)
      }

      const { data, error: updateError } = await supabase
        .from('patient_profiles')
        .update(profileData)
        .eq('id', profileId)
        .select()

      if (updateError) {
        console.error('Supabase update error:', updateError)
        throw updateError
      }

      console.log('Update response data:', data)

      // Update the profile in the list if it exists
      if (data && data.length > 0) {
        const index = profiles.value.findIndex((p) => p.id === profileId)
        if (index !== -1) {
          console.log('Updating profile in profiles list at index:', index)
          profiles.value[index] = data[0]
        } else {
          console.log('Profile not found in profiles list')
        }

        // Update current profile if it's the one being edited
        if (currentProfile.value && currentProfile.value.id === profileId) {
          console.log('Updating currentProfile with new data')
          // Create a new object to ensure reactivity
          currentProfile.value = { ...data[0] }

          // Ensure profile_data and medications exist
          if (!currentProfile.value.profile_data) {
            currentProfile.value.profile_data = { medications: [] }
          } else if (!currentProfile.value.profile_data.medications) {
            currentProfile.value.profile_data.medications = []
          }

          console.log('Updated currentProfile:', currentProfile.value)
        }
      } else {
        console.warn('No data returned from update operation')
      }

      return data && data.length > 0 ? data[0] : null
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
      profiles.value = profiles.value.filter((p) => p.id !== profileId)

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
      const uniqueHash =
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      // Calculate expiry time
      const expiryTime = new Date()
      expiryTime.setHours(expiryTime.getHours() + expiryHours)

      // Create the link
      const { data, error: createError } = await supabase
        .from('profile_access_links')
        .insert([
          {
            profile_id: profileId,
            unique_hash: uniqueHash,
            expiry_time: expiryTime.toISOString(),
            is_active: true,
          },
        ])
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
      console.log('common drugs: ', data)

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
    console.log('Setting current profile:', profile)

    if (!profile) {
      console.warn('Attempted to set null or undefined profile')
      currentProfile.value = null
      return
    }

    // Create a new object to ensure reactivity
    const newProfile = { ...profile }

    // Ensure profile_data exists
    if (!newProfile.profile_data) {
      console.log('Profile has no profile_data, initializing it')
      newProfile.profile_data = { medications: [] }
    } 
    // Ensure medications exists and is an array
    else if (!newProfile.profile_data.medications) {
      console.log('Profile has no medications array, initializing it')
      newProfile.profile_data.medications = []
    } 
    // Ensure medications is an array
    else if (!Array.isArray(newProfile.profile_data.medications)) {
      console.warn('Profile medications is not an array, converting it')
      newProfile.profile_data.medications = []
    }

    console.log('Setting currentProfile with validated data:', newProfile)
    currentProfile.value = newProfile
  }

  // Clear current profile
  function clearCurrentProfile() {
    console.log('Clearing current profile')
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
    clearCurrentProfile,
  }
})
