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
                label="Search drugs"
                outlined
                placeholder="Enter generic or brand name"
                @keyup.enter="searchDrugs"
              >
                <template v-slot:append>
                  <q-icon clickable name="search" @click="searchDrugs" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="filterOption"
                :options="filterOptions"
                label="Filter"
                outlined
                @update:model-value="applyFilter"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Drug List Table -->
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">
            <span v-if="searchTerm">Search Results</span>
            <span v-else-if="filterOption.value === 'common'">Common Drugs</span>
            <span v-else>All Drugs</span>
            <q-badge class="q-ml-sm" color="primary">{{ displayedDrugs.length }} </q-badge>
          </div>

          <q-table
            :columns="columns"
            :loading="profilesStore.loading"
            :pagination="pagination"
            :rows="displayedDrugs"
            row-key="id"
          >
            <template v-slot:body-cell-common_drug="props">
              <q-td :props="props">
                <q-icon v-if="props.value" color="positive" name="check" />
                <q-icon v-else color="negative" name="close" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useProfilesStore } from 'src/stores/profiles-stores'

const profilesStore = useProfilesStore()
const searchTerm = ref('')
const searchResults = ref([])
const filterOption = ref({ label: 'All Drugs', value: 'all' })
const filterOptions = [
  { label: 'All Drugs', value: 'all' },
  { label: 'Common Drugs', value: 'common' },
]

// Table columns
const columns = [
  {
    name: 'generic_name',
    label: 'Generic Name',
    field: 'generic_name',
    sortable: true,
    align: 'left',
  },
  { name: 'brand_name', label: 'Brand Name', field: 'brand_name', sortable: true, align: 'left' },
  { name: 'form', label: 'Form', field: 'form', sortable: true, align: 'left' },
  { name: 'strength', label: 'Strength', field: 'strength', sortable: true, align: 'left' },
  { name: 'common_drug', label: 'Common', field: 'common_drug', sortable: true, align: 'center' },
]

// Pagination settings
const pagination = ref({
  sortBy: 'generic_name',
  descending: false,
  page: 1,
  rowsPerPage: 15,
})

// Computed property to get the displayed drugs based on search and filter
const displayedDrugs = computed(() => {
  if (searchResults.value.length > 0) {
    return searchResults.value
  }

  if (filterOption.value.value === 'common') {
    return profilesStore.commonDrugs
  }

  return profilesStore.drugs
})

// Search drugs
async function searchDrugs() {
  if (searchTerm.value.trim()) {
    searchResults.value = await profilesStore.searchDrugs(searchTerm.value.trim())
  } else {
    searchResults.value = []
    await applyFilter()
  }
}

// Apply filter
async function applyFilter() {
  searchResults.value = []

  if (filterOption.value.value === 'common') {
    await profilesStore.fetchCommonDrugs()
  } else {
    await profilesStore.fetchDrugs()
  }
}

// Initialize data when component mounts
onMounted(async () => {
  await profilesStore.fetchDrugs()
})
</script>
