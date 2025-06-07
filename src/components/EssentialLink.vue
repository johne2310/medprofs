<template>
  <q-item
    clickable
    :tag="props.to ? 'router-link' : 'a'"
    :target="props.to ? undefined : '_blank'"
    :to="props.to"
    :href="props.to ? undefined : props.link"
  >
    <q-item-section
      v-if="props.icon"
      avatar
    >
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: '#'
  },

  to: {
    type: String,
    default: ''
  },

  icon: {
    type: String,
    default: ''
  }
})
</script>
