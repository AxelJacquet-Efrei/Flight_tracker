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

      <!-- CPU Count -->
      <div class="space-y-2">
        <label class="flex items-center gap-1 text-green-800 text-sm font-medium">
          vCPU Count
        </label>
        <input
          type="number"
          step="1"
          min="1"
          v-model.number="form.cpu_count"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Number of vCPUs"
        />
        <div class="text-xs text-green-600">Number of virtual CPUs allocated</div>
        <div v-if="errors.cpu_count" class="text-red-500 text-xs">{{ errors.cpu_count }}</div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Provider -->
      <div class="space-y-2">
        <label class="flex items-center gap-1 text-green-800 text-sm font-medium">
          Cloud Provider
        </label>
        <select
          v-model="form.provider"
          @change="onProviderChange"
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

      <!-- Region -->
      <div class="space-y-2">
        <label class="flex items-center gap-1 text-green-800 text-sm font-medium">
          Region
          <span v-if="loadingRegions" class="h-3 w-3 animate-spin rounded-full border border-green-600 border-t-transparent ml-1"></span>
        </label>
        <select
          v-model="form.region"
          :disabled="loadingRegions || availableRegions.length === 0"
          required
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" disabled>
            {{ loadingRegions ? 'Loading regions...' : 'Select a region' }}
          </option>
          <option 
            v-for="region in availableRegions" 
            :key="region.id" 
            :value="region.id"
          >
            {{ region.name }}
          </option>
        </select>
        <div class="text-xs text-green-600">
          The data center region (greener regions have lower emissions)
        </div>
        <div v-if="errors.region" class="text-red-500 text-xs">{{ errors.region }}</div>
      </div>
    </div>

    <!-- Storage Type -->
    <div class="space-y-2">
      <label class="flex items-center gap-1 text-green-800 text-sm font-medium">Storage Type</label>
      <select
        v-model="form.storage_type"
        required
        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="ssd">SSD (Solid State Drive)</option>
        <option value="hdd">HDD (Hard Disk Drive)</option>
      </select>
      <div class="text-xs text-green-600">Type of storage technology used</div>
      <div v-if="errors.storage_type" class="text-red-500 text-xs">{{ errors.storage_type }}</div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium">Error:</span> {{ errorMessage }}
      </div>
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
            Calculating with Climatiq API...
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
import { ref, reactive, onMounted } from "vue"
import { 
  calculateCpuEmissions, 
  calculateMemoryEmissions, 
  calculateStorageEmissions,
  getCloudRegions
} from "../../lib/climatiq.js"

const emit = defineEmits(['result'])

const loading = ref(false)
const loadingRegions = ref(false)
const errorMessage = ref('')
const availableRegions = ref([])

const form = reactive({
  cpu_hours: 1,
  memory_gb: 1,
  storage_gb: 1,
  cpu_count: 1,
  provider: "aws",
  region: "",
  storage_type: "ssd"
})

const errors = reactive({})

async function loadRegions(provider) {
  loadingRegions.value = true
  form.region = ""
  
  try {
    availableRegions.value = await getCloudRegions(provider)
    if (availableRegions.value.length > 0) {
      form.region = availableRegions.value[0].id
    }
  } catch (error) {
    console.error(`Erreur lors du chargement des régions pour ${provider}:`, error)
    errorMessage.value = `Failed to load regions for ${provider}`
  } finally {
    loadingRegions.value = false
  }
}

async function onProviderChange() {
  await loadRegions(form.provider)
}

function validate() {
  errors.cpu_hours = form.cpu_hours > 0 ? "" : "CPU hours must be positive"
  errors.memory_gb = form.memory_gb > 0 ? "" : "Memory must be positive"
  errors.storage_gb = form.storage_gb > 0 ? "" : "Storage must be positive"
  errors.cpu_count = form.cpu_count > 0 ? "" : "CPU count must be positive"
  errors.provider = form.provider ? "" : "Select a provider"
  errors.region = form.region ? "" : "Select a region"
  errors.storage_type = form.storage_type ? "" : "Select a storage type"
  return !Object.values(errors).some(e => e)
}

async function onSubmit() {
  if (!validate()) return
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const [cpuResult, memoryResult, storageResult] = await Promise.all([
      calculateCpuEmissions(
        form.provider,
        form.region,
        form.cpu_count,
        form.cpu_hours,
        0.5,
        new Date().getFullYear()
      ),
      
      calculateMemoryEmissions(
        form.provider,
        form.region,
        form.memory_gb * 1024,
        form.cpu_hours,
        "MB",
        "hour",
        new Date().getFullYear()
      ),
      
      calculateStorageEmissions(
        form.provider,
        form.region,
        form.storage_type,
        form.storage_gb * 1024,
        form.cpu_hours,
        "MB",
        "hour",
        new Date().getFullYear()
      )
    ])

    const totalEmissions = 
      cpuResult.co2e + 
      memoryResult.co2e + 
      storageResult.co2e

    const result = {
      activity_type: 'cloud_computing',
      co2e_kg: totalEmissions,
      activity_data: {
        provider: form.provider,
        region: form.region,
        cpu_hours: form.cpu_hours,
        cpu_count: form.cpu_count,
        memory_gb: form.memory_gb,
        storage_gb: form.storage_gb,
        storage_type: form.storage_type,
        breakdown: {
          cpu_emissions: cpuResult.co2e,
          memory_emissions: memoryResult.co2e,
          storage_emissions: storageResult.co2e
        }
      },
      raw_responses: {
        cpu: cpuResult,
        memory: memoryResult,
        storage: storageResult
      }
    }
    
    emit('result', result)
    
  } catch (error) {
    console.error("Error calculating emissions:", error)
    errorMessage.value = `Failed to calculate emissions: ${error.message}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRegions(form.provider)
})
</script>