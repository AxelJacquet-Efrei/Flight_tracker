<template>
    <button
      class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
      :class="[className, isActive ? 'bg-background text-foreground shadow-sm' : '']"
      :aria-selected="isActive"
      role="tab"
      type="button"
      @click="$emit('activate')"
      :disabled="disabled"
    >
      <slot />
    </button>
  </template>
  
  <script setup>
  import { computed } from "vue";
  const props = defineProps(['className', 'value', 'modelValue', 'disabled'])
  const isActive = computed(() => props.value === props.modelValue)
  </script>
  