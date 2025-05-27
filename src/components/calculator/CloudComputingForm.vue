<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Header -->
    <div class="mb-6 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-800">
      <div class="font-bold">Cloud Emissions Calculator</div>
      <div class="text-sm">Calculate the carbon footprint of your cloud computing resources</div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- CPU Hours -->
      <div class="space-y-2">
        <label class="flex items-center gap-1 text-green-800 text-sm font-medium">
          CPU Hours
        </label>
        <input
          type="number"
          step="0.1"
          min="0.1"
          v-model.number="form.cpu_hours"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter CPU hours"
        />
        <div class="text-xs text-green-600">Number of vCPU hours used</div>
        <div v-if="errors.cpu_hours" class="text-red-500 text-xs">{{ errors.cpu_hours }}</div>
      </div>

      <!-- Memory GB -->
      <div class="space-y-2">
        <label class="flex items-center gap-1 text-green-800 text-sm font-medium">
          Memory (GB)
        </label>
        <input
          type="number"
          step="0.1"
          min="0.1"
          v-model.number="form.memory_gb"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter memory in GB"
        />
        <div class="text-xs text-green-600">Amount of memory in GB</div>
        <div v-if="errors.memory_gb" class="text-red-500 text-xs">{{ errors.memory_gb }}</div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Storage GB -->
      <div class="space-y-2">
        <label class="flex items-center gap-1 text-green-800 text-sm font-medium">
          Storage (GB)
        </label>
        <input
          type="number"
          step="0.1"
          min="0.1"
          v-model.number="form.storage_gb"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter storage in GB"
        />
        <div class="text-xs text-green-600">Amount of storage in GB</div>
        <div v-if="errors.storage_gb" class="text-red-500 text-xs">{{ errors.storage_gb }}</div>
      </div>

      <!-- Provider -->
      <div class="space-y-2">
        <label class="flex items-center gap-1 text-green-800 text-sm font-medium">
          Cloud Provider
        </label>
        <select
          v-model="form.provider"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="aws">AWS</option>
          <option value="gcp">Google Cloud</option>
          <option value="azure">Microsoft Azure</option>
        </select>
        <div class="text-xs text-green-600">Your cloud service provider</div>
        <div v-if="errors.provider" class="text-red-500 text-xs">{{ errors.provider }}</div>
      </div>
    </div>

    <!-- Region -->
    <div class="space-y-2">
      <label class="flex items-center gap-1 text-green-800 text-sm font-medium">Region</label>
      <select
        v-model="form.region"
        required
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="us-east-1">US East (N. Virginia)</option>
        <option value="us-west-1">US West (N. California)</option>
        <option value="eu-west-1">EU (Ireland)</option>
        <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
      </select>
      <div class="text-xs text-green-600">
        The data center region (greener regions have lower emissions)
      </div>
      <div v-if="errors.region" class="text-red-500 text-xs">{{ errors.region }}</div>
    </div>

    <!-- Submit -->
    <div class="pt-2">
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <template v-if="loading">
          <span class="flex items-center justify-center gap-2">
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block"></span>
            Calculating...
          </span>
        </template>
        <template v-else>
          Calculate Emissions
        </template>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from "vue"
const emit = defineEmits(['result'])

const loading = ref(false)
const form = reactive({
  cpu_hours: 1,
  memory_gb: 1,
  storage_gb: 1,
  provider: "aws",
  region: "us-east-1",
})
const errors = reactive({})

function validate() {
  errors.cpu_hours = form.cpu_hours > 0 ? "" : "CPU hours must be positive"
  errors.memory_gb = form.memory_gb > 0 ? "" : "Memory must be positive"
  errors.storage_gb = form.storage_gb > 0 ? "" : "Storage must be positive"
  errors.provider = form.provider ? "" : "Select a provider"
  errors.region = form.region ? "" : "Select a region"
  return !Object.values(errors).some(e => e)
}

async function onSubmit() {
  if (!validate()) return
  
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const baseEmission = (form.cpu_hours * 0.5) + (form.memory_gb * 0.2) + (form.storage_gb * 0.1)
    
    const providerMultipliers = {
      aws: 1.0,
      gcp: 0.8,
      azure: 0.9
    }
    
    const regionMultipliers = {
      'us-east-1': 1.2,
      'us-west-1': 0.9,
      'eu-west-1': 0.7,
      'ap-southeast-1': 1.1
    }
    
    const finalEmission = baseEmission * 
      providerMultipliers[form.provider] * 
      regionMultipliers[form.region]
    
    const result = {
      activity_type: 'cloud_computing',
      co2e_kg: finalEmission,
      activity_data: {
        provider: form.provider,
        region: form.region,
        cpu_hours: form.cpu_hours,
        memory_gb: form.memory_gb,
        storage_gb: form.storage_gb
      }
    }
    
    emit('result', result)
  } catch (error) {
    console.error("Error calculating emissions:", error)
  } finally {
    loading.value = false
  }
}
</script>