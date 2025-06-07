<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Drug List</div>

    <!-- Loading State -->
    <div v-if="profilesStore.loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Loading drugs...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="profilesStore.error" class="text-negative q-pa-md">
      {{ profilesStore.error }}
    </div>

    <div v-else>
      <!-- Search and Filter Bar -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input 
                v-model="searchTerm" 
                outlined 
                label="Search drugs" 
                placeholder="Enter generic or brand name"
                @keyup.enter="searchDrugs"
              >
                <template v-slot:append>
                  <q-icon name="search" clickable @click="searchDrugs" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="filterOption"
                :options="filterOptions"
                outlined
                label="Filter"
                @update:model-value="applyFilter"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Alphabet Filter -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Filter by first letter:</div>
          <div class="row q-gutter-sm wrap">
            <q-btn 
              v-for="letter in alphabet" 
              :key="letter" 
              :color="selectedLetter === letter ? 'primary' : 'grey-3'" 
              :text-color="selectedLetter === letter ? 'white' : 'black'"
              :label="letter" 
              size="md" 
              @click="filterByLetter(letter)" 
              class="q-px-md q-py-sm"
              style="min-width: 40px"
            />
            <q-btn 
              :color="selectedLetter === null ? 'primary' : 'grey-3'" 
              :text-color="selectedLetter === null ? 'white' : 'black'"
              label="All" 
              size="md" 
              @click="filterByLetter(null)" 
              class="q-px-md q-py-sm"
              style="min-width: 50px"
            />
          </div>
        </q-card-section>
      </q-card>

      <!-- Drug List Table -->
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <span v-if="searchTerm">Search Results</span>
            <span v-else-if="selectedLetter">Drugs starting with '{{ selectedLetter }}'</span>
            <span v-else-if="filterOption.value === 'common'">Common Drugs</span>
            <span v-else>All Drugs</span>
            <q-badge color="primary" class="q-ml-sm">{{ displayedDrugs.length }}</q-badge>
          </div>

          <q-table
            :rows="displayedDrugs"
            :columns="columns"
            row-key="id"
            :pagination="pagination"
            :loading="profilesStore.loading"
          >
            <template v-slot:body-cell-common_drug="props">
              <q-td :props="props">
                <q-icon v-if="props.value" name="check" color="positive" />
                <q-icon v-else name="close" color="negative" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfilesStore } from 'src/stores/profiles-stores'

const profilesStore = useProfilesStore()
const searchTerm = ref('')
const searchResults = ref([])
const filterOption = ref({ label: 'All Drugs', value: 'all' })
const filterOptions = [
  { label: 'All Drugs', value: 'all' },
  { label: 'Common Drugs', value: 'common' }
]

// Alphabet filter
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const selectedLetter = ref(null)

// Table columns
const columns = [
  { name: 'generic_name', label: 'Generic Name', field: 'generic_name', sortable: true, align: 'left' },
  { name: 'brand_name', label: 'Brand Name', field: 'brand_name', sortable: true, align: 'left' },
  { name: 'form', label: 'Form', field: 'form', sortable: true, align: 'left' },
  { name: 'strength', label: 'Strength', field: 'strength', sortable: true, align: 'left' },
  { name: 'common_drug', label: 'Common', field: 'common_drug', sortable: true, align: 'center' }
]

// Pagination settings
const pagination = ref({
  sortBy: 'generic_name',
  descending: false,
  page: 1,
  rowsPerPage: 15
})

// Computed property to get the displayed drugs based on search, filter, and alphabet filter
const displayedDrugs = computed(() => {
  let result = [];

  // First, determine the base set of drugs based on search and common filter
  if (searchResults.value.length > 0) {
    result = searchResults.value;
  } else if (filterOption.value.value === 'common') {
    result = profilesStore.commonDrugs;
  } else {
    result = profilesStore.drugs;
  }

  // Then apply alphabet filter if a letter is selected
  if (selectedLetter.value) {
    return result.filter(drug => 
      drug.generic_name.toUpperCase().startsWith(selectedLetter.value)
    );
  }

  return result;
})

// Search drugs
async function searchDrugs() {
  // Reset letter filter when searching
  selectedLetter.value = null

  if (searchTerm.value.trim()) {
    searchResults.value = await profilesStore.searchDrugs(searchTerm.value.trim())
  } else {
    searchResults.value = []
    await applyFilter()
  }
}

// Apply filter
async function applyFilter() {
  // Reset search results and letter filter when changing filter option
  searchResults.value = []
  selectedLetter.value = null

  if (filterOption.value.value === 'common') {
    await profilesStore.fetchCommonDrugs()
  } else {
    await profilesStore.fetchDrugs()
  }
}

// Filter by letter
function filterByLetter(letter) {
  selectedLetter.value = letter

  // Reset search if active
  if (searchResults.value.length > 0) {
    searchResults.value = []
    searchTerm.value = ''
  }

  // Reset to page 1 when changing filters
  pagination.value.page = 1
}

// Initialize data when component mounts
onMounted(async () => {
  await profilesStore.fetchDrugs()
})
</script>
