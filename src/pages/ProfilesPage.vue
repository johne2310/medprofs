<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Medication Profile</div>

    <!-- Loading State -->
    <div v-if="patientStore.loading || profilesStore.loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Loading data...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="patientStore.error || profilesStore.error" class="text-negative q-pa-md">
      <div v-if="patientStore.error">{{ patientStore.error }}</div>
      <div v-if="profilesStore.error">{{ profilesStore.error }}</div>
    </div>

    <div v-else>
      <!-- No Patient Selected -->
      <q-card v-if="!currentPatient" class="q-pa-md text-center">
        <q-icon name="person_search" size="4rem" color="grey-5" />
        <div class="text-h6 q-mt-md">No Patient Selected</div>
        <div class="q-mt-sm">
          <q-btn color="primary" label="Select a Patient" icon="people" to="/patients" />
        </div>
      </q-card>

      <template v-else>
        <!-- Patient Info -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="row items-center">
              <div class="col-12 col-md-6">
                <div class="text-h6">Patient: {{ currentPatient.first_name }} {{ currentPatient.last_name }}</div>
                <div class="text-caption">
                  DOB: {{ formatDate(currentPatient.date_of_birth) }}
                  <span v-if="currentPatient.medicare_number">| Medicare: {{ currentPatient.medicare_number }}</span>
                </div>
              </div>
              <div class="col-12 col-md-6 text-right">
                <q-btn flat color="primary" label="Change Patient" icon="people" to="/patients" />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Favorites/Common Drugs -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Favorite Drugs</div>
            <div class="text-caption q-mb-md">Click to add to profile</div>

            <div v-if="profilesStore.commonDrugs.length === 0" class="text-center q-pa-md">
              <q-icon name="medication" size="2rem" color="grey-5" />
              <div class="text-grey-7 q-mt-sm">No favorite drugs found</div>
              <q-btn flat color="primary" label="Load Favorites" @click="loadCommonDrugs" class="q-mt-sm" />
            </div>

            <div v-else class="row q-col-gutter-sm">
              <div 
                class="col-6 col-sm-4 col-md-3 col-lg-2" 
                v-for="drug in profilesStore.commonDrugs" 
                :key="drug.id"
              >
                <q-btn outline color="primary" class="full-width q-py-sm" @click="addDrugToProfile(drug)">
                  {{ drug.generic_name }}
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Profiles List -->
        <q-card v-if="profilesStore.profiles.length > 0" class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Patient Profiles</div>

            <q-list bordered separator>
              <q-item 
                v-for="profile in profilesStore.profiles" 
                :key="profile.id" 
                clickable 
                @click="selectProfile(profile)"
              >
                <q-item-section>
                  <q-item-label>
                    Profile created on {{ formatDate(profile.created_at) }}
                  </q-item-label>
                  <q-item-label caption>
                    Status: {{ profile.status }}
                    <span v-if="profile.pharmacist_authorizing"> | Authorized by: {{ profile.pharmacist_authorizing }}</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round icon="edit" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Create New Profile Button -->
        <div class="q-mb-md">
          <q-btn color="primary" icon="add" label="Create New Profile" @click="createNewProfile" />
        </div>

        <!-- Current Profile (if selected) -->
        <q-card v-if="profilesStore.currentProfile">
          <q-card-section>
            <div class="text-h6">
              Medication Profile
              <q-badge color="primary" class="q-ml-sm">{{ profilesStore.currentProfile.status }}</q-badge>
            </div>

            <q-table
              :rows="medications"
              :columns="columns"
              row-key="id"
              class="q-mt-md"
            >
              <template v-slot:no-data>
                <div class="full-width text-center q-pa-md">
                  No medications added yet. Add from favorites above or use the "Add Medication" button.
                </div>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat round icon="edit" size="sm" color="primary" />
                  <q-btn flat round icon="delete" size="sm" color="negative" />
                </q-td>
              </template>
            </q-table>

            <div class="row justify-between q-mt-md">
              <q-btn color="primary" icon="add" label="Add Medication" @click="addMedication" />
              <div>
                <q-btn outline color="grey" label="Save Draft" class="q-mr-sm" @click="saveDraft" />
                <q-btn color="positive" label="Finalize & Share" @click="finalizeProfile" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { usePatientStore } from 'src/stores/patient-store'
import { useProfilesStore } from 'src/stores/profiles-stores'
import { useAuthStore } from 'src/stores/auth-store'
import { useQuasar } from 'quasar'

const patientStore = usePatientStore()
const profilesStore = useProfilesStore()
const authStore = useAuthStore()
const $q = useQuasar()

// Get current patient from store
const currentPatient = computed(() => patientStore.currentPatient)

// Table columns
const columns = [
  { name: 'drug', label: 'Drug', field: 'drug', align: 'left' },
  { name: 'dose', label: 'Dose', field: 'dose', align: 'left' },
  { name: 'frequency', label: 'Frequency', field: 'frequency', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

// Get medications from current profile
const medications = computed(() => {
  if (!profilesStore.currentProfile || !profilesStore.currentProfile.profile_data) {
    return []
  }

  return profilesStore.currentProfile.profile_data.medications || []
})

// Format date from ISO to local format
function formatDate(isoDate) {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  return date.toLocaleDateString()
}

// Load common drugs
async function loadCommonDrugs() {
  await profilesStore.fetchCommonDrugs()
}

// Add drug to profile
async function addDrugToProfile(drug) {
  if (!profilesStore.currentProfile) {
    // If no profile is selected, create a new one
    await createNewProfile()
  }

  if (!profilesStore.currentProfile) return

  // Get current medications
  const currentMedications = profilesStore.currentProfile.profile_data.medications || []

  // Check if drug already exists in profile
  const existingDrugIndex = currentMedications.findIndex(med => med.drug_id === drug.id)

  if (existingDrugIndex >= 0) {
    // Drug already exists, show notification
    $q.notify({
      color: 'warning',
      message: `${drug.generic_name} is already in this profile`,
      icon: 'warning'
    })
    return
  }

  // Add new drug to medications
  const newMedication = {
    id: Date.now().toString(), // Generate a temporary ID
    drug_id: drug.id,
    drug: drug.generic_name,
    brand: drug.brand_name || '',
    dose: '',
    frequency: '',
    status: 'Active'
  }

  // Update profile data
  const updatedProfileData = {
    ...profilesStore.currentProfile.profile_data,
    medications: [...currentMedications, newMedication]
  }

  // Save to database
  await profilesStore.updateProfile(profilesStore.currentProfile.id, {
    profile_data: updatedProfileData
  })

  // Show success notification
  $q.notify({
    color: 'positive',
    message: `Added ${drug.generic_name} to profile`,
    icon: 'check'
  })
}

// Select a profile
function selectProfile(profile) {
  profilesStore.setCurrentProfile(profile)
}

// Create new profile
async function createNewProfile() {
  if (!currentPatient.value || !authStore.user) return

  const newProfile = {
    patient_id: currentPatient.value.id,
    created_by: authStore.user.id,
    status: 'Draft',
    profile_data: {
      medications: []
    }
  }

  await profilesStore.createProfile(newProfile)
}

// Add medication to profile
function addMedication() {
  // Implementation would depend on the profile data structure
  console.log('Adding medication to profile')
}

// Save draft
async function saveDraft() {
  if (!profilesStore.currentProfile) return

  await profilesStore.updateProfile(profilesStore.currentProfile.id, {
    status: 'Draft'
  })
}

// Finalize profile
async function finalizeProfile() {
  if (!profilesStore.currentProfile) return

  await profilesStore.updateProfile(profilesStore.currentProfile.id, {
    status: 'Released'
  })
}

// Watch for changes in current patient
watch(() => currentPatient.value, async (newPatient) => {
  if (newPatient) {
    await profilesStore.fetchPatientProfiles(newPatient.id)
  } else {
    profilesStore.profiles.value = []
    profilesStore.clearCurrentProfile()
  }
})

// Initialize data when component mounts
onMounted(async () => {
  // Load common drugs
  await profilesStore.fetchCommonDrugs()

  // If there's a current patient, load their profiles
  if (currentPatient.value) {
    await profilesStore.fetchPatientProfiles(currentPatient.value.id)
  }
})
</script>
