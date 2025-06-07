<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Medication Profile</div>
    
    <!-- Patient Info -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row items-center">
          <div class="col-12 col-md-6">
            <div class="text-h6">Patient: John Doe</div>
            <div class="text-caption">DOB: 01/01/1970 | Medicare: 1234567890</div>
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
        
        <div class="row q-col-gutter-sm">
          <div class="col-6 col-sm-4 col-md-3 col-lg-2" v-for="i in 8" :key="i">
            <q-btn outline color="primary" class="full-width q-py-sm">
              Drug {{ i }}
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
    
    <!-- Profile Table -->
    <q-card>
      <q-card-section>
        <div class="text-h6">Medication Profile</div>
        
        <q-table
          :rows="[]"
          :columns="[
            { name: 'drug', label: 'Drug', field: 'drug', align: 'left' },
            { name: 'dose', label: 'Dose', field: 'dose', align: 'left' },
            { name: 'frequency', label: 'Frequency', field: 'frequency', align: 'left' },
            { name: 'status', label: 'Status', field: 'status', align: 'left' },
            { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
          ]"
          row-key="id"
          class="q-mt-md"
        >
          <template v-slot:no-data>
            <div class="full-width text-center q-pa-md">
              No medications added yet. Add from favorites above or use the "Add Medication" button.
            </div>
          </template>
        </q-table>
        
        <div class="row justify-between q-mt-md">
          <q-btn color="primary" icon="add" label="Add Medication" />
          <div>
            <q-btn outline color="grey" label="Save Draft" class="q-mr-sm" />
            <q-btn color="positive" label="Finalize & Share" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
// This is just a UI scaffold, no actual data or logic
</script>