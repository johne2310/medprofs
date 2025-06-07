<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Settings</div>
    
    <q-card>
      <q-tabs
        v-model="activeTab"
        class="text-primary"
      >
        <q-tab name="account" label="Account" icon="person" />
        <q-tab name="appearance" label="Appearance" icon="palette" />
        <q-tab name="notifications" label="Notifications" icon="notifications" />
      </q-tabs>
      
      <q-separator />
      
      <q-tab-panels v-model="activeTab" animated>
        <!-- Account Settings -->
        <q-tab-panel name="account">
          <div class="text-h6 q-mb-md">Account Settings</div>
          
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Name</q-item-label>
                <q-input dense outlined />
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section>
                <q-item-label>Email</q-item-label>
                <q-input dense outlined type="email" />
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section>
                <q-item-label>Change Password</q-item-label>
                <q-input dense outlined type="password" label="Current Password" class="q-mb-sm" />
                <q-input dense outlined type="password" label="New Password" class="q-mb-sm" />
                <q-input dense outlined type="password" label="Confirm New Password" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
        
        <!-- Appearance Settings -->
        <q-tab-panel name="appearance">
          <div class="text-h6 q-mb-md">Appearance Settings</div>
          
          <q-list>
            <q-item tag="label">
              <q-item-section>
                <q-item-label>Dark Mode</q-item-label>
                <q-item-label caption>Enable dark mode for the application</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle color="primary" />
              </q-item-section>
            </q-item>
            
            <q-item>
              <q-item-section>
                <q-item-label>Font Size</q-item-label>
                <q-slider
                  v-model="fontSize"
                  :min="12"
                  :max="20"
                  :step="1"
                  label
                  label-always
                  color="primary"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
        
        <!-- Notification Settings -->
        <q-tab-panel name="notifications">
          <div class="text-h6 q-mb-md">Notification Settings</div>
          
          <q-list>
            <q-item tag="label">
              <q-item-section>
                <q-item-label>Email Notifications</q-item-label>
                <q-item-label caption>Receive notifications via email</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle color="primary" />
              </q-item-section>
            </q-item>
            
            <q-item tag="label">
              <q-item-section>
                <q-item-label>SMS Notifications</q-item-label>
                <q-item-label caption>Receive notifications via SMS</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle color="primary" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
      
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" />
        <q-btn label="Save Changes" color="primary" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('account')
const fontSize = ref(14)
// This is just a UI scaffold, no actual data or logic
</script>