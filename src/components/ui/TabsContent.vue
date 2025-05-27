<template>
    <div
      v-show="modelValue === value"
      class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      :class="className"
      role="tabpanel"
    >
      <slot />
    </div>
  </template>
  
  <script setup>
  const props = defineProps(['className', 'value', 'modelValue'])
  </script>
  