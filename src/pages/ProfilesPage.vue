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
        <q-icon color="grey-5" name="person_search" size="4rem" />
        <div class="text-h6 q-mt-md">No Patient Selected</div>
        <div class="q-mt-sm">
          <q-btn color="primary" icon="people" label="Select a Patient" to="/patients" />
        </div>
      </q-card>

      <template v-else>
        <!-- Patient Info -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="row items-center">
              <div class="col-12 col-md-6">
                <div class="text-h6">
                  Patient: {{ currentPatient.first_name }} {{ currentPatient.last_name }}
                </div>
                <div class="text-caption">
                  DOB: {{ formatDate(currentPatient.date_of_birth) }}
                  <span v-if="currentPatient.medicare_number"
                    >| Medicare: {{ currentPatient.medicare_number }}</span
                  >
                </div>
              </div>
              <div class="col-12 col-md-6 text-right">
                <q-btn color="primary" flat icon="people" label="Change Patient" to="/patients" />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Favorites/Common Drugs -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Favorite Drugs</div>
            <div class="text-caption q-mb-md">Click to add to profile</div>

            <!-- Alphabet Filter -->
            <div class="q-mb-md">
              <div class="text-subtitle1 q-mb-sm">Filter by first letter:</div>
              <div class="row q-gutter-sm wrap">
                <q-btn
                  v-for="letter in alphabet"
                  :key="letter"
                  :color="selectedLetter === letter ? 'primary' : 'grey-3'"
                  :label="letter"
                  :text-color="selectedLetter === letter ? 'white' : 'black'"
                  class="q-px-md q-py-sm"
                  size="md"
                  style="min-width: 40px"
                  @click="filterByLetter(letter)"
                />
                <q-btn
                  :color="selectedLetter === null ? 'primary' : 'grey-3'"
                  :text-color="selectedLetter === null ? 'white' : 'black'"
                  class="q-px-md q-py-sm"
                  label="All"
                  size="md"
                  style="min-width: 50px"
                  @click="filterByLetter(null)"
                />
              </div>
            </div>

            <div v-if="profilesStore.commonDrugs.length === 0" class="text-center q-pa-md">
              <q-icon color="grey-5" name="medication" size="2rem" />
              <div class="text-grey-7 q-mt-sm">No favorite drugs found</div>
              <q-btn
                class="q-mt-sm"
                color="primary"
                flat
                label="Load Favorites"
                @click="loadCommonDrugs"
              />
            </div>

            <div v-else class="row q-col-gutter-sm">
              <div
                v-for="drug in filteredCommonDrugs"
                :key="drug.id"
                class="col-6 col-sm-4 col-md-3 col-lg-2"
              >
                <q-btn
                  class="full-width q-py-sm drug-btn"
                  color="primary"
                  outline
                  @click="addDrugToProfile(drug)"
                >
                  <div class="text-left drug-content">
                    <div class="drug-name">{{ drug.generic_name }}</div>
                    <div v-if="drug.strength" class="text-caption">{{ drug.strength }}</div>
                    <div v-if="drug.form" class="text-caption">{{ drug.form }}</div>
                    <div v-if="drug.dose || drug.frequency" class="text-caption">
                      <span v-if="drug.dose">{{ drug.dose }}</span>
                      <span v-if="drug.dose && drug.frequency"> - </span>
                      <span v-if="drug.frequency">{{ drug.frequency }}</span>
                    </div>
                  </div>
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
                    <span v-if="profile.pharmacist_authorizing">
                      | Authorized by: {{ profile.pharmacist_authorizing }}</span
                    >
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn color="primary" flat icon="edit" round />
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
              <q-badge class="q-ml-sm" color="primary"
                >{{ profilesStore.currentProfile.status }}
              </q-badge>
            </div>

            <q-table :columns="columns" :rows="medications" class="q-mt-md" row-key="id">
              <template v-slot:no-data>
                <div class="full-width text-center q-pa-md">
                  No medications added yet. Add from favorites above or use the "Add Medication"
                  button.
                </div>
              </template>

              <template v-slot:body-cell-drug="props">
                <q-td :props="props">
                  <div>
                    <div class="text-weight-medium">{{ props.row.drug }}</div>
                    <div v-if="props.row.strength || props.row.form" class="text-caption">
                      <span v-if="props.row.strength">{{ props.row.strength }}</span>
                      <span v-if="props.row.strength && props.row.form"> - </span>
                      <span v-if="props.row.form">{{ props.row.form }}</span>
                    </div>
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    color="primary"
                    flat
                    icon="edit"
                    round
                    size="sm"
                    @click="editMedication(props.row)"
                  />
                  <q-btn
                    color="negative"
                    flat
                    icon="delete"
                    round
                    size="sm"
                    @click="confirmDeleteMedication(props.row)"
                  />
                </q-td>
              </template>
            </q-table>

            <div class="row justify-between q-mt-md">
              <q-btn color="primary" icon="add" label="Add Medication" @click="addMedication" />
              <div>
                <q-btn class="q-mr-sm" color="grey" label="Save Draft" outline @click="saveDraft" />
                <q-btn color="positive" label="Finalize & Share" @click="finalizeProfile" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </div>
    <!-- Edit Medication Dialog -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Edit Medication</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="editedMedication.drug" dense label="Drug Name" outlined />

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="editedMedication.strength"
                class="q-mt-sm"
                dense
                label="Strength"
                outlined
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="editedMedication.form"
                class="q-mt-sm"
                dense
                label="Form"
                outlined
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="editedMedication.dose"
                class="q-mt-sm"
                dense
                label="Dose"
                outlined
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="editedMedication.frequency"
                class="q-mt-sm"
                dense
                label="Frequency"
                outlined
              />
            </div>
          </div>

          <q-select
            v-model="editedMedication.status"
            :options="['Current', 'Updated', 'Ceased']"
            class="q-mt-sm"
            dense
            label="Status"
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup color="primary" flat label="Cancel" @click="cancelEdit" />
          <q-btn color="primary" flat label="Save" @click="saveMedicationEdit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { usePatientStore } from 'src/stores/patient-store'
import { useProfilesStore } from 'src/stores/profiles-stores'
import { useAuthStore } from 'src/stores/auth-store'
import { useToaster } from 'src/composables/useToast.js'
import { useQuasar } from 'quasar'

const patientStore = usePatientStore()
const profilesStore = useProfilesStore()
const authStore = useAuthStore()
const { showSuccess, showError } = useToaster()
const $q = useQuasar()

// Alphabet filter
const alphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]
const selectedLetter = ref(null)

// Edit medication dialog
const editDialog = ref(false)
const editedMedication = ref({
  id: '',
  drug_id: '',
  drug: '',
  brand: '',
  strength: '',
  form: '',
  dose: '',
  frequency: '',
  status: 'Current',
})
const originalMedication = ref(null)

// Get current patient from store
const currentPatient = computed(() => patientStore.currentPatient)

// Filter common drugs by selected letter
const filteredCommonDrugs = computed(() => {
  if (selectedLetter.value) {
    return profilesStore.commonDrugs.filter((drug) =>
      drug.generic_name.toUpperCase().startsWith(selectedLetter.value),
    )
  }
  return profilesStore.commonDrugs
})

// Filter by letter
function filterByLetter(letter) {
  selectedLetter.value = letter
}

// Table columns
const columns = [
  { name: 'drug', label: 'Drug', field: 'drug', align: 'left' },
  { name: 'dose', label: 'Dose', field: 'dose', align: 'left' },
  { name: 'frequency', label: 'Directions', field: 'frequency', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

// Get medications from current profile, sorted by status (Updated, Current, Ceased)
const medications = computed(() => {
  if (!profilesStore.currentProfile || !profilesStore.currentProfile.profile_data) {
    return []
  }

  const meds = profilesStore.currentProfile.profile_data.medications || []

  // Sort by status: Updated first, then Current, then Ceased
  return [...meds].sort((a, b) => {
    const statusOrder = {
      'Updated': 1,
      'Current': 2,
      'Ceased': 3
    }

    const statusA = statusOrder[a.status] || 999 // Default high value for unknown statuses
    const statusB = statusOrder[b.status] || 999

    return statusA - statusB
  })
})

// Format date from ISO to local format with time in 12-hour format
function formatDate(isoDate) {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// Load common drugs
async function loadCommonDrugs() {
  selectedLetter.value = null
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
  const existingDrugIndex = currentMedications.findIndex((med) => med.drug_id === drug.id)

  if (existingDrugIndex >= 0) {
    // Drug already exists, show notification
    console.log('drug already exists')
    showSuccess(`${drug.generic_name} ${drug.strength} is already in this profile`)
    // $q.notify({
    //   color: 'warning',
    //   message: `${drug.generic_name} is already in this profile`,
    //   icon: 'warning'
    // })
    return
  }

  // Add new drug to medications
  const newMedication = {
    id: Date.now().toString(), // Generate a temporary ID
    drug_id: drug.id,
    drug: drug.generic_name,
    brand: drug.brand_name || '',
    strength: drug.strength,
    form: drug.form,
    dose: drug.dose,
    frequency: drug.frequency,
    status: 'Current',
  }

  // Update profile data
  const updatedProfileData = {
    ...profilesStore.currentProfile.profile_data,
    medications: [...currentMedications, newMedication],
  }

  // Save to database
  await profilesStore.updateProfile(profilesStore.currentProfile.id, {
    profile_data: updatedProfileData,
  })

  // Show success notification
  showSuccess(`Added ${drug.generic_name} ${drug.strength} to profile`)
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
      medications: [],
    },
  }

  await profilesStore.createProfile(newProfile)
}

// Add medication to profile
function addMedication() {
  // Implementation would depend on the profile data structure
  console.log('Adding medication to profile')
}

// Confirm delete medication
function confirmDeleteMedication(medication) {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to remove ${medication.drug} from this profile?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteMedication(medication)
  })
}

// Delete medication from profile
async function deleteMedication(medication) {
  if (!profilesStore.currentProfile) return

  try {
    // Get current medications
    const currentMedications = profilesStore.currentProfile.profile_data.medications || []

    // Filter out the medication to delete
    const updatedMedications = currentMedications.filter((med) => med.id !== medication.id)

    // Update profile data
    const updatedProfileData = {
      ...profilesStore.currentProfile.profile_data,
      medications: updatedMedications,
    }

    // Save to database
    await profilesStore.updateProfile(profilesStore.currentProfile.id, {
      profile_data: updatedProfileData,
    })

    // Show success notification
    showSuccess(`Removed ${medication.drug} from profile`)
  } catch (error) {
    showError(`Failed to remove medication: ${error.message}`)
    console.error('Delete medication error:', error)
  }
}

// Edit medication
function editMedication(medication) {
  // Store original medication for reference
  originalMedication.value = medication

  // Create a deep copy of the medication to edit
  editedMedication.value = JSON.parse(JSON.stringify(medication))

  // Open the edit dialog
  editDialog.value = true
}

// Cancel edit
function cancelEdit() {
  // Reset edited medication
  editedMedication.value = {
    id: '',
    drug_id: '',
    drug: '',
    brand: '',
    strength: '',
    form: '',
    dose: '',
    frequency: '',
    status: 'Current',
  }

  // Clear original medication reference
  originalMedication.value = null
}

// Save medication edit
async function saveMedicationEdit() {
  if (!profilesStore.currentProfile || !originalMedication.value) return

  try {
    // Get current medications
    const currentMedications = profilesStore.currentProfile.profile_data.medications || []

    // Find the index of the medication being edited
    const medicationIndex = currentMedications.findIndex(
      (med) => med.id === originalMedication.value.id,
    )

    if (medicationIndex === -1) {
      throw new Error('Medication not found in profile')
    }

    // Create updated medications array
    const updatedMedications = [...currentMedications]
    updatedMedications[medicationIndex] = editedMedication.value

    // Update profile data
    const updatedProfileData = {
      ...profilesStore.currentProfile.profile_data,
      medications: updatedMedications,
    }

    // Save to database
    await profilesStore.updateProfile(profilesStore.currentProfile.id, {
      profile_data: updatedProfileData,
    })

    // Close the dialog
    editDialog.value = false

    // Show success notification
    showSuccess(`Updated ${editedMedication.value.drug} in profile`)

    // Reset edited medication
    cancelEdit()
  } catch (error) {
    showError(`Failed to update medication: ${error.message}`)
    console.error('Update medication error:', error)
  }
}

// Save draft
async function saveDraft() {
  if (!profilesStore.currentProfile) return

  await profilesStore.updateProfile(profilesStore.currentProfile.id, {
    status: 'Draft',
  })
}

// Finalize profile
async function finalizeProfile() {
  if (!profilesStore.currentProfile) return

  await profilesStore.updateProfile(profilesStore.currentProfile.id, {
    status: 'Released',
  })
}

// Watch for changes in current patient
watch(
  () => currentPatient.value,
  async (newPatient) => {
    if (newPatient) {
      await profilesStore.fetchPatientProfiles(newPatient.id)
    } else {
      profilesStore.profiles.value = []
      profilesStore.clearCurrentProfile()
    }
  },
)

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

<style>
.drug-btn {
  height: 90px; /* Reduced height for better screen real estate */
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 8px 8px 4px 8px; /* Reduced bottom padding */
}

.drug-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: flex-start; /* Align content to top */
  margin-bottom: 0; /* Ensure no extra margin at bottom */
}

.drug-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Ensure text captions don't overflow */
.drug-content .text-caption {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
