<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Manage Favorite Drugs</div>
    
    <!-- Search Bar -->
    <q-card class="q-mb-md">
      <q-card-section>
        <q-input 
          outlined 
          label="Search drug database" 
          placeholder="Enter drug name"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
    
    <!-- Drug List -->
    <q-card>
      <q-card-section>
        <q-tabs
          v-model="activeTab"
          class="text-primary"
        >
          <q-tab name="all" label="All Drugs" />
          <q-tab name="favorites" label="Favorites" />
        </q-tabs>
        
        <q-separator />
        
        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="all">
            <q-list bordered separator>
              <q-item v-for="i in 10" :key="i">
                <q-item-section>
                  <q-item-label>Drug Name {{ i }}</q-item-label>
                  <q-item-label caption>Generic name, common dosages</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle color="primary" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
          
          <q-tab-panel name="favorites">
            <q-list bordered separator>
              <q-item v-for="i in 5" :key="i">
                <q-item-section>
                  <q-item-label>Favorite Drug {{ i }}</q-item-label>
                  <q-item-label caption>Generic name, common dosages</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-toggle color="primary" :model-value="true" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('all')
// This is just a UI scaffold, no actual data or logic
</script>