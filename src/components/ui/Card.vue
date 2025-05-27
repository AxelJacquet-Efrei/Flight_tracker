<template>
    <div
      ref="cardRef"
      :class="['rounded-lg border bg-card text-card-foreground shadow-sm', $attrs.class]"
      v-bind="attrsWithoutClass"
    >
      <slot />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, useAttrs } from 'vue'
  const cardRef = ref(null)
  const attrs = useAttrs()
  
  const attrsWithoutClass = computed(() => {
    const { class: _class, ...rest } = attrs
    return rest
  })
  </script>
  