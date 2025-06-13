<template>
  <div
    class="eco-card overflow-hidden border-green-200 rounded-lg border bg-card text-card-foreground shadow-sm"
  >
    <div class="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>

    <div class="bg-gradient-to-r from-green-50 to-green-100 pb-4 p-6">
      <div
        class="flex items-center gap-2 text-green-800 text-2xl font-semibold leading-none tracking-tight"
      >
        Emission Result
      </div>
      <div class="text-green-700 text-sm">
        Carbon footprint for {{ formatActivityType(emission.activity_type) }}
      </div>
    </div>

    <div class="space-y-6 pt-6 p-6">
      <!-- Meter -->
      <div class="flex flex-col items-center justify-center">
        <div class="mb-2 flex items-center justify-center">
          <div class="relative">
            <div
              class="absolute inset-0 animate-ping rounded-full opacity-50"
              :class="circleProps.pingBg"
            ></div>
            <!-- Dynamic circle size and color based on impact -->
            <div
              class="relative flex items-center justify-center rounded-full shadow-md text-white"
              :class="circleProps.bgClass"
              :style="{ width: circleProps.diameter, height: circleProps.diameter }"
            >
              <span
                class="text-center font-bold leading-tight break-words px-2"
                :class="circleProps.fontSize"
              >
                {{ emission.co2e_kg.toFixed(1) }}
              </span>
            </div>
          </div>
        </div>
        <div class="text-center">
          <div class="text-sm font-medium text-gray-500">kg CO₂ equivalent</div>
          <div
            class="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            :class="[impact.bg, impact.color]"
          >
            {{ impact.level }} Impact
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="space-y-2">
        <h3 class="font-medium text-green-800">Activity Details</h3>
        <div class="rounded-md bg-green-50 p-4 text-green-800">
          <template v-if="emission.activity_type === 'custom_activity'">
            <div class="grid gap-2">
              <div>
                <span class="font-medium">Name:</span>
                {{ emission.activity_data.name }}
              </div>
              <div>
                <span class="font-medium">Value:</span>
                {{ emission.activity_data.value }} {{ emission.activity_data.unit }}
              </div>
              <div>
                <span class="font-medium">Emission Factor:</span>
                {{ emission.activity_data.emission_factor.name }}
              </div>
              <div>
                <span class="font-medium">Category:</span>
                {{ emission.activity_data.emission_factor.category }}
              </div>
              <div v-if="emission.activity_data.emission_factor.region">
                <span class="font-medium">Region:</span>
                {{ emission.activity_data.emission_factor.region }}
              </div>
              <div v-if="emission.activity_data.emission_factor.source">
                <span class="font-medium">Source:</span>
                {{ emission.activity_data.emission_factor.source }}
              </div>
            </div>
          </template>
          <template v-else>
            <!-- Existing details for other activity types -->
          </template>
        </div>
      </div>

      <!-- Environmental Impact -->
      <div class="rounded-md border border-green-200 p-4">
        <h4 class="mb-2 font-medium text-green-800">Environmental Impact</h4>
        <p class="text-sm text-gray-600">
          This is equivalent to
          {{ (emission.co2e_kg / 8.9).toFixed(2) }} trees needed to absorb this
          CO₂ for one year.
        </p>
      </div>
    </div>

    <!-- Save as favorite -->
    <div class="flex flex-col space-y-4 border-t border-green-100 bg-green-50/50 p-4">
      <div class="grid w-full gap-2">
        <label for="favorite-name" class="text-green-800">
          Save as favorite
        </label>
        <div class="flex gap-2">
          <input
            id="favorite-name"
            placeholder="Enter a name for this result"
            v-model="favoriteName"
            class="border-green-200 focus:border-green-500 focus:ring-green-500 px-2 py-1 rounded"
          />
          <button
            @click="handleSaveAsFavorite"
            :disabled="isSaving"
            class="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1 rounded font-medium transition-transform active:translate-y-0 hover:-translate-y-0.5"
          >
            <span
              v-if="isSaving"
              class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></span>
            <span v-else>Save</span>
          </button>
        </div>
        <div
          v-if="!isAuthenticated"
          class="mt-1 flex items-center gap-1 text-xs text-amber-600"
        >
          <span>⚠️</span>
          <span>Sign in to save your results</span>
        </div>
        <div
          v-if="toastMsg"
          :class="toastVariant === 'success' ? 'text-green-600' : 'text-red-600'"
          class="text-xs mt-1"
        >
          {{ toastMsg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ emission: { type: Object, required: true } })

// Compute size and color for circle using same thresholds as impact
const impact = computed(() => {
  const v = props.emission.co2e_kg
  if (v < 10) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100', diameter: '6rem', pingBg: 'bg-green-200', fontSize: 'text-xl', bgClass: 'bg-green-500' }
  if (v < 100) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100', diameter: '8rem', pingBg: 'bg-yellow-200', fontSize: 'text-2xl', bgClass: 'bg-yellow-500' }
  return { level: 'High', color: 'text-red-600', bg: 'bg-red-100', diameter: '10rem', pingBg: 'bg-red-200', fontSize: 'text-3xl', bgClass: 'bg-red-500' }
})

// Expose circleProps same as impact
const circleProps = computed(() => ({
  diameter: impact.value.diameter,
  bgClass: impact.value.bgClass,
  pingBg: impact.value.pingBg,
  fontSize: impact.value.fontSize
}))

function formatActivityType(type) {
  return type ? type.split(/[_-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : ''
}

// Favorites logic
const isAuthenticated = ref(true)
const toastMsg = ref('')
const toastVariant = ref('success')
const favoriteName = ref('')
const isSaving = ref(false)

function showToast(msg, variant = 'success') {
  toastMsg.value = msg
  toastVariant.value = variant
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

async function handleSaveAsFavorite() {
  if (!isAuthenticated.value) return showToast('Please sign in to save favorites', 'error')
  if (!favoriteName.value.trim()) return showToast('Please enter a name for this favorite', 'error')
  isSaving.value = true
  try {
    await new Promise(r => setTimeout(r, 1200))
    showToast('Saved to favorites', 'success')
    favoriteName.value = ''
  } catch {
    showToast('Failed to save to favorites', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
/* All styling via Tailwind classes */
</style>