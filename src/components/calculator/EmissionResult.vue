<template>
    <div class="eco-card overflow-hidden border-green-200 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
      <div class="bg-gradient-to-r from-green-50 to-green-100 pb-4 p-6">
        <div class="flex items-center gap-2 text-green-800 text-2xl font-semibold leading-none tracking-tight">
          <!-- <span class="h-5 w-5 text-green-600">🌱</span> -->
          Emission Result
        </div>
        <div class="text-green-700 text-sm">
          Carbon footprint for {{ formatActivityType(emission.activity_type) }}
        </div>
      </div>
      <div class="space-y-6 pt-6 p-6">
        <div class="flex flex-col items-center justify-center">
          <div class="mb-2 flex items-center justify-center">
            <div class="relative">
              <div class="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-75"></div>
              <div class="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md">
                <span class="text-2xl font-bold">{{ emission.co2e_kg.toFixed(1) }}</span>
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
  
        <div class="space-y-2">
          <h3 class="font-medium text-green-800">Activity Details</h3>
          <div class="rounded-md bg-green-50 p-4 text-green-800">
            <ul v-if="emission.activity_type === 'cloud_computing'" class="space-y-1">
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">Provider:</span> {{ emission.activity_data.provider }}
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">Region:</span> {{ emission.activity_data.region }}
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">CPU Hours:</span> {{ emission.activity_data.cpu_hours }}
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">Memory:</span> {{ emission.activity_data.memory_gb }} GB
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">Storage:</span> {{ emission.activity_data.storage_gb }} GB
              </li>
            </ul>
            <ul v-else-if="emission.activity_type === 'flight'" class="space-y-1">
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">From:</span> {{ emission.activity_data.from }}
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">To:</span> {{ emission.activity_data.to }}
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">Passengers:</span> {{ emission.activity_data.passengers }}
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">Class:</span> {{ emission.activity_data.class }}
              </li>
            </ul>
            <ul v-else-if="emission.activity_type === 'custom'" class="space-y-1">
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">Activity:</span> {{ emission.activity_data.name }}
              </li>
              <li class="flex items-center gap-2">
                <span class="text-green-600">•</span>
                <span class="font-medium">Value:</span>
                {{ emission.activity_data.value }} {{ emission.activity_data.unit }}
              </li>
            </ul>
          </div>
        </div>
  
        <div class="rounded-md border border-green-200 p-4">
          <h4 class="mb-2 font-medium text-green-800">Environmental Impact</h4>
          <p class="text-sm text-gray-600">
            This is equivalent to {{ (emission.co2e_kg / 8.9).toFixed(2) }} trees needed to absorb this CO₂ for one year.
          </p>
        </div>
      </div>
  
      <div class="flex flex-col space-y-4 border-t border-green-100 bg-green-50/50 p-4">
        <div class="grid w-full gap-2">
          <label for="favorite-name" class="text-green-800">Save as favorite</label>
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
              class="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1 rounded font-medium"
            >
              <span v-if="isSaving" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <span v-else>Save</span>
            </button>
          </div>
          <div v-if="!isAuthenticated" class="mt-1 flex items-center gap-1 text-xs text-amber-600">
            <span>⚠️</span>
            <span>Sign in to save your results</span>
          </div>
          <div v-if="toastMsg" :class="toastVariant === 'success' ? 'text-green-600' : 'text-red-600'" class="text-xs mt-1">
            {{ toastMsg }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue"
  
  const props = defineProps({
    emission: { type: Object, required: true }
  })

  const isAuthenticated = ref(true)
  const toastMsg = ref("")
  const toastVariant = ref("success")

  const favoriteName = ref("")
  const isSaving = ref(false)
  
  function showToast(msg, variant = "success") {
    toastMsg.value = msg
    toastVariant.value = variant
    setTimeout(() => { toastMsg.value = "" }, 3000)
  }
  
  async function handleSaveAsFavorite() {
    if (!isAuthenticated.value) {
      showToast("Please sign in to save favorites", "error")
      return
    }
    if (!favoriteName.value.trim()) {
      showToast("Please enter a name for this favorite", "error")
      return
    }
    isSaving.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      showToast("Saved to favorites", "success")
      favoriteName.value = ""
    } catch (e) {
      showToast("Failed to save to favorites", "error")
    } finally {
      isSaving.value = false
    }
  }

  function formatActivityType(type) {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
  
  function getImpactLevel() {
    const value = props.emission.co2e_kg
    if (value < 10) return { level: "Low", color: "text-green-600", bg: "bg-green-100" }
    if (value < 100) return { level: "Medium", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { level: "High", color: "text-red-600", bg: "bg-red-100" }
  }
  const impact = computed(getImpactLevel)
  </script>
  