import { defineStore } from 'pinia'
import { ref } from 'vue'
import supabase from 'src/config/supabase'

export const usePatientStore = defineStore('patient', () => {
  const patients = ref([])
  const currentPatient = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Get all patients
  async function fetchPatients() {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .order('last_name', { ascending: true })
      
      if (fetchError) {
        throw fetchError
      }
      
      patients.value = data || []
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch patients'
      console.error('Fetch patients error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Get patient by ID
  async function fetchPatientById(id) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()
      
      if (fetchError) {
        throw fetchError
      }
      
      currentPatient.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch patient'
      console.error('Fetch patient error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Search patients by name, medicare number, or DOB
  async function searchPatients(searchTerm) {
    loading.value = true
    error.value = null
    
    try {
      let query = supabase
        .from('patients')
        .select('*')
      
      // If searchTerm is a date string, search by DOB
      if (searchTerm.match(/^\d{4}-\d{2}-\d{2}$/)) {
        query = query.eq('date_of_birth', searchTerm)
      } 
      // If searchTerm is numeric, search by medicare number
      else if (searchTerm.match(/^\d+$/)) {
        query = query.ilike('medicare_number', `%${searchTerm}%`)
      } 
      // Otherwise search by name
      else {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
      }
      
      const { data, error: searchError } = await query.order('last_name', { ascending: true })
      
      if (searchError) {
        throw searchError
      }
      
      patients.value = data || []
      return data
    } catch (err) {
      error.value = err.message || 'Failed to search patients'
      console.error('Search patients error:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Create new patient
  async function createPatient(patientData) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: createError } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
      
      if (createError) {
        throw createError
      }
      
      // Add the new patient to the list if it exists
      if (data && data.length > 0) {
        patients.value.push(data[0])
        currentPatient.value = data[0]
      }
      
      return data ? data[0] : null
    } catch (err) {
      error.value = err.message || 'Failed to create patient'
      console.error('Create patient error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update patient
  async function updatePatient(id, patientData) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: updateError } = await supabase
        .from('patients')
        .update(patientData)
        .eq('id', id)
        .select()
      
      if (updateError) {
        throw updateError
      }
      
      // Update the patient in the list if it exists
      if (data && data.length > 0) {
        const index = patients.value.findIndex(p => p.id === id)
        if (index !== -1) {
          patients.value[index] = data[0]
        }
        
        // Update current patient if it's the one being edited
        if (currentPatient.value && currentPatient.value.id === id) {
          currentPatient.value = data[0]
        }
      }
      
      return data ? data[0] : null
    } catch (err) {
      error.value = err.message || 'Failed to update patient'
      console.error('Update patient error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete patient
  async function deletePatient(id) {
    loading.value = true
    error.value = null
    
    try {
      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', id)
      
      if (deleteError) {
        throw deleteError
      }
      
      // Remove the patient from the list
      patients.value = patients.value.filter(p => p.id !== id)
      
      // Clear current patient if it's the one being deleted
      if (currentPatient.value && currentPatient.value.id === id) {
        currentPatient.value = null
      }
      
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete patient'
      console.error('Delete patient error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Set current patient
  function setCurrentPatient(patient) {
    currentPatient.value = patient
  }

  // Clear current patient
  function clearCurrentPatient() {
    currentPatient.value = null
  }

  return {
    patients,
    currentPatient,
    loading,
    error,
    fetchPatients,
    fetchPatientById,
    searchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    setCurrentPatient,
    clearCurrentPatient
  }
})