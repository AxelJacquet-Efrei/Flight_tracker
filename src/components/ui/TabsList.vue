<template>
    <div
      class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
      :class="className"
      role="tablist"
    >
      <slot />
    </div>
  </template>
  
  <script setup>
  const props = defineProps(['className'])
  </script>
  