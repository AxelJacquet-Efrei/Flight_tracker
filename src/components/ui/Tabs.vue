<template>
    <div>
      <slot />
    </div>
  </template>
  
  <script setup>
  defineProps({
    modelValue: String
  })
  defineEmits(['update:modelValue'])
  </script>
  