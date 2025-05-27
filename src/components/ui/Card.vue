<template>
    <div :class="['rounded-lg border bg-card text-card-foreground shadow-sm', className]">
      <!-- Header Slot -->
      <div v-if="$slots.header" class="flex flex-col space-y-1.5 p-6">
        <slot name="header" />
      </div>
  
      <!-- Title + Description Slot (optionnel, à mettre dans le header si tu veux) -->
      <!--
      <div v-if="$slots.title" class="text-2xl font-semibold leading-none tracking-tight">
        <slot name="title" />
      </div>
      <div v-if="$slots.description" class="text-sm text-muted-foreground">
        <slot name="description" />
      </div>
      -->
  
      <!-- Content Slot -->
      <div v-if="$slots.content" class="p-6 pt-0">
        <slot name="content" />
      </div>
  
      <!-- Footer Slot -->
      <div v-if="$slots.footer" class="flex items-center p-6 pt-0">
        <slot name="footer" />
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps(['className'])
  </script>
  