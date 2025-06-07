<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Patient Selection</div>

    <!-- Search Bar -->
    <q-card class="q-mb-md">
      <q-card-section>
        <q-input
          v-model="searchTerm"
          class="q-mb-md"
          label="Search patients"
          outlined
          placeholder="Enter name, Medicare number, or DOB"
          @keyup.enter="searchPatients"
        >
          <template v-slot:append>
            <q-icon clickable name="search" @click="searchPatients" />
          </template>
        </q-input>

        <div class="row justify-end">
          <q-btn color="primary" icon="add" label="Add New Patient" to="/patients/new" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Patient List -->
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <span v-if="searchTerm">Search Results</span>
          <span v-else>Recent Patients</span>
          <q-spinner v-if="patientStore.loading" class="q-ml-sm" color="primary" size="1em" />
        </div>

        <div v-if="patientStore.error" class="text-negative q-mb-md">
          {{ patientStore.error }}
        </div>

        <div
          v-if="patientStore.patients.length === 0 && !patientStore.loading"
          class="text-center q-pa-md"
        >
          <q-icon color="grey-5" name="person_search" size="3rem" />
          <div class="text-grey-7 q-mt-sm">No patients found</div>
        </div>

        <q-list v-else bordered separator>
          <q-item
            v-for="patient in patientStore.patients"
            :key="patient.id"
            clickable
            @click="selectPatient(patient)"
          >
            <q-item-section>
              <q-item-label>{{ patient.first_name }} {{ patient.last_name }}</q-item-label>
              <q-item-label caption>
                DOB: {{ formatDate(patient.date_of_birth) }}
                <span v-if="patient.medicare_number"
                  >| Medicare: {{ patient.medicare_number }}</span
                >
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn color="primary" flat icon="arrow_forward" round />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from 'src/stores/patient-store'

const patientStore = usePatientStore()
const router = useRouter()
const searchTerm = ref('')

// Format date from ISO to local format
function formatDate(isoDate) {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  return date.toLocaleDateString()
}

// Search patients
async function searchPatients() {
  if (searchTerm.value.trim()) {
    await patientStore.searchPatients(searchTerm.value.trim())
  } else {
    await patientStore.fetchPatients()
  }
}

// Select a patient and navigate to profiles
function selectPatient(patient) {
  patientStore.setCurrentPatient(patient)
  router.push('/profiles')
}

// Fetch patients when component mounts
onMounted(async () => {
  await patientStore.fetchPatients()
})
</script>
