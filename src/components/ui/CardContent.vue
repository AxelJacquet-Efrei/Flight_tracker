<template>
    <div
      ref="contentRef"
      :class="['p-6 pt-0', $attrs.class]"
      v-bind="attrsWithoutClass"
    >
      <slot />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, useAttrs } from 'vue'
  const contentRef = ref(null)
  const attrs = useAttrs()
  const attrsWithoutClass = computed(() => {
    const { class: _class, ...rest } = attrs
    return rest
  })
  </script>
  