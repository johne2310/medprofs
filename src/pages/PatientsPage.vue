<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Patient Selection</div>
    
    <!-- Search Bar -->
    <q-card class="q-mb-md">
      <q-card-section>
        <q-input 
          outlined 
          label="Search patients" 
          placeholder="Enter name, Medicare number, or DOB"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        
        <div class="row justify-end">
          <q-btn color="primary" label="Add New Patient" icon="add" to="/patients/new" />
        </div>
      </q-card-section>
    </q-card>
    
    <!-- Patient List -->
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-md">Recent Patients</div>
        
        <q-list bordered separator>
          <q-item v-for="i in 5" :key="i" clickable to="/profiles">
            <q-item-section>
              <q-item-label>Patient Name {{ i }}</q-item-label>
              <q-item-label caption>DOB: 01/01/19{{ 50 + i }} | Medicare: 123456789{{ i }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round icon="arrow_forward" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
// This is just a UI scaffold, no actual data or logic
</script>