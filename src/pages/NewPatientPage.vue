<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Add New Patient</div>
    
    <q-card>
      <q-card-section>
        <q-form class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                outlined
                label="First Name"
                required
              />
            </div>
            
            <div class="col-12 col-md-6">
              <q-input
                outlined
                label="Last Name"
                required
              />
            </div>
          </div>
          
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                outlined
                label="Date of Birth"
                mask="##/##/####"
                placeholder="DD/MM/YYYY"
                required
              >
                <template v-slot:append>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>
            
            <div class="col-12 col-md-6">
              <q-input
                outlined
                label="Medicare Number"
                mask="##########"
              />
            </div>
          </div>
          
          <q-input
            outlined
            label="Mobile Phone Number"
            mask="#### ### ###"
          />
          
          <div class="row justify-end q-mt-md">
            <q-btn flat label="Cancel" color="negative" class="q-mr-sm" to="/patients" />
            <q-btn label="Save Patient" color="primary" to="/profiles" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
// This is just a UI scaffold, no actual data or logic
</script>