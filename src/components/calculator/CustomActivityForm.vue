<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Header -->
    <div class="mb-6 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-800">
      <div class="font-bold">Custom Activity Calculator</div>
      <div class="text-sm">Calculate emissions for any activity using Climatiq API</div>
    </div>

    <!-- Search Section -->
    <div class="space-y-4">
      <div>
        <label class="block text-green-800 text-sm font-medium mb-2">Search Activity</label>
        <div class="flex gap-2">
          <input v-model="searchQuery" @input="debouncedSearch" @keyup.enter="searchEmissionFactors"
            class="input flex-1" placeholder="Try: electricity, fuel, waste, transport..." />
          <button type="button" @click="searchEmissionFactors" :disabled="loadingSearch || !searchQuery.trim()"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loadingSearch ? 'Searching...' : 'Search' }}
          </button>
        </div>
        <div class="text-xs text-green-600 mt-1">
          Search for emission factors in the Climatiq database
        </div>
      </div>

      <!-- Search Filters -->
      <div class="space-y-4">
        <!-- Catégorie principale -->
        <div class="flex flex-wrap gap-3">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs text-green-800 font-medium mb-1">Category</label>
            <select v-model="searchFilters.category" @change="handleCategoryChange" 
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">All Categories</option>
              <option value="electricity">Electricity</option>
              <option value="fuel">Fuel</option>
              <option value="heat_and_steam">Heat & Steam</option>
              <option value="waste">Waste</option>
            </select>
          </div>

          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs text-green-800 font-medium mb-1">Region</label>
            <select v-model="searchFilters.region" @change="searchEmissionFactors"
              class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">All Regions</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
          </div>

          <div class="flex items-end">
            <button type="button" @click="clearFilters"
              class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Filtres dynamiques -->
        <div v-if="shouldShowFilters" class="flex flex-wrap gap-3">
          <!-- Filtres pour Fuel -->
          <template v-if="isFuelCategory">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs text-green-800 font-medium mb-1">Fuel Type</label>
              <select v-model="searchFilters.fuelType" @change="searchEmissionFactors"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Fuel Types</option>
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="aviation">Aviation Fuel</option>
              </select>
            </div>
          </template>

          <!-- Filtres pour Electricity -->
          <template v-if="isElectricityCategory">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs text-green-800 font-medium mb-1">Source Type</label>
              <select v-model="searchFilters.sourceType" @change="searchEmissionFactors"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Sources</option>
                <option value="grid">Grid Mix</option>
                <option value="renewable">Renewable</option>
                <option value="nuclear">Nuclear</option>
                <option value="coal">Coal</option>
              </select>
            </div>
          </template>

          <!-- Filtres pour Heat & Steam -->
          <template v-if="isHeatAndSteamCategory">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs text-green-800 font-medium mb-1">Heat Type</label>
              <select v-model="searchFilters.heatType" @change="searchEmissionFactors"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Types</option>
                <option value="district">District Heating</option>
              </select>
            </div>
          </template>

          <!-- Filtres pour Waste -->
          <template v-if="isWasteCategory">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs text-green-800 font-medium mb-1">Waste Type</label>
              <select v-model="searchFilters.wasteType" @change="searchEmissionFactors"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Waste Types</option>
                <option v-for="type in availableWasteTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs text-green-800 font-medium mb-1">Treatment Method</label>
              <select v-model="searchFilters.wasteTreatment" @change="searchEmissionFactors"
                class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">All Methods</option>
                <option v-for="method in availableWasteMethods" :key="method.value" :value="method.value">
                  {{ method.label }}
                </option>
              </select>
            </div>
          </template>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="space-y-2">
        <label class="block text-green-800 text-sm font-medium">
          Available Emission Factors ({{ searchResults.length }} results)
        </label>
        <div class="max-h-60 overflow-y-auto border border-gray-200 rounded">
          <div v-for="(factor, index) in searchResults" :key="`${factor.activity_id}-${index}`"
            @click="selectEmissionFactor(factor)"
            class="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            :class="{ 'bg-green-100 border-green-300': selectedFactor?.activity_id === factor.activity_id }">
            <div class="font-medium text-sm text-gray-800">{{ factor.name }}</div>
            <div class="text-xs text-gray-600 mt-1">
              <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">{{ factor.category }}</span>
              <span class="text-gray-500">{{ factor.source }}</span>
            </div>
            <div class="text-xs text-green-600 mt-1">
              Unit: {{ factor.unit_type }} • Region: {{ factor.region || 'Global' }}
              <span v-if="factor.year" class="ml-2">• Year: {{ factor.year }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-else-if="searchQuery.trim() && !loadingSearch && searchPerformed" class="text-center py-8 text-gray-500">
        <svg class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
          </path>
        </svg>
        <p>No emission factors found for "{{ searchQuery }}"</p>
        <p class="text-sm mt-1">Try different keywords or adjust your filters</p>
      </div>

      <!-- Selected Factor Info -->
      <div v-if="selectedFactor" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="font-medium text-blue-800">Selected: {{ selectedFactor.name }}</div>
            <div class="text-sm text-blue-600 mt-1">
              <div>Category: {{ selectedFactor.category }}</div>
              <div>Unit required: {{ selectedFactor.unit_type }}</div>
              <div v-if="selectedFactor.region">Region: {{ selectedFactor.region }}</div>
              <div v-if="selectedFactor.year">Year: {{ selectedFactor.year }}</div>
              <div class="text-xs text-blue-500 mt-2">{{ selectedFactor.description || 'No description available' }}
              </div>
            </div>
          </div>
          <button type="button" @click="clearSelection" class="ml-4 text-blue-400 hover:text-blue-600">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Le reste du template reste identique -->
    <!-- Activity Details Form -->
    <div v-if="selectedFactor" class="space-y-4 p-4 border-2 border-green-200 rounded-lg bg-green-50/30">
      <h3 class="font-medium text-green-800">Activity Details</h3>

      <!-- Activity Name -->
      <div>
        <label class="block text-green-800 text-sm font-medium mb-2">Activity Name</label>
        <input v-model="form.name" class="input" placeholder="Give this calculation a name..." />
        <div class="text-xs text-green-600 mt-1">Custom name for this emission calculation</div>
        <span class="text-xs text-red-500">{{ errors.name }}</span>
      </div>

      <!-- Value Input -->
      <div>
        <label class="block text-green-800 text-sm font-medium mb-2">
          Amount ({{ getUnitLabel(selectedFactor.unit_type) }})
        </label>
        <input type="number" step="0.01" min="0" v-model.number="form.value" class="input"
          :placeholder="`Enter amount in ${getUnitLabel(selectedFactor.unit_type)}`" />
        <div class="text-xs text-green-600 mt-1">
          {{ getUnitDescription(selectedFactor.unit_type) }}
        </div>
        <span class="text-xs text-red-500">{{ errors.value }}</span>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <div class="flex items-center gap-2">
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd" />
        </svg>
        <span class="font-medium">Error:</span> {{ errorMessage }}
      </div>
    </div>

    <!-- Submit Button -->
    <button type="submit"
      class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="loading || !selectedFactor">
      <template v-if="loading">
        <span class="flex items-center justify-center gap-2">
          <span
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block"></span>
          Calculating with Climatiq API...
        </span>
      </template>
      <template v-else-if="!selectedFactor">
        Search and select an emission factor first
      </template>
      <template v-else>
        Calculate Emissions
      </template>
    </button>
  </form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { z } from 'zod'
import {
  searchEmissionFactors as apiSearchEmissionFactors,
  calculateCustomEmissions,
  getEmissionFactorById,
  createCustomMapping
} from '../../lib/climatiq.js'

const emit = defineEmits(['result'])

const form = reactive({
  name: '',
  value: 1
})

const errors = reactive({
  name: '',
  value: '',
  factor: '',
  submit: ''
})

const searchFilters = ref({
  results_per_page: 50,
  page: 1,
  data_version: '22',
  category: '',
  region: '',
  // Filtres spécifiques pour Fuel
  fuelType: '',
  // Filtres spécifiques pour Electricity
  sourceType: '',
  // Filtres spécifiques pour Heat & Steam
  heatType: '',
  // Filtre commun
  calculationMethod: '',
  // Filtres spécifiques pour Waste
  wasteType: '',
  wasteTreatment: ''
})

const loading = ref(false)
const loadingSearch = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const searchResults = ref([])
const selectedFactor = ref(null)
const searchPerformed = ref(false)

// Validation schema
const schema = z.object({
  name: z.string().min(1, 'Please enter an activity name'),
  value: z.coerce.number().positive('Please enter a positive number')
})

// Clear search filters
function clearFilters() {
  searchFilters.value.category = ''
  searchFilters.value.region = ''
  searchFilters.value.fuelType = ''
  searchFilters.value.sourceType = ''
  searchFilters.value.heatType = ''
  searchFilters.value.calculationMethod = ''
  searchFilters.value.wasteType = ''
  searchFilters.value.wasteTreatment = ''
  if (searchQuery.value.trim()) {
    searchEmissionFactors()
  }
}

// Debounced search function
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim().length > 2) {
      searchEmissionFactors()
    }
  }, 500)
}

// Dans la partie script, garder uniquement les refs et fonctions pour Waste
const availableWasteTypes = ref([])
const availableWasteMethods = ref([])

// Fonction pour extraire les types de déchets uniques des résultats
function extractWasteTypes(results) {
  const types = new Set()
  results.forEach(result => {
    if (result.activity_id && result.activity_id.includes('waste-type_')) {
      const type = result.activity_id.split('waste-type_')[1]
      if (type) {
        types.add({
          value: type,
          label: type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        })
      }
    }
  })
  return Array.from(types)
}

// Fonction pour extraire les méthodes de traitement uniques des résultats
function extractWasteMethods(results) {
  const methods = new Set()
  results.forEach(result => {
    if (result.activity_id && result.activity_id.includes('waste-treatment_')) {
      const method = result.activity_id.split('waste-treatment_')[1]
      if (method) {
        methods.add({
          value: method,
          label: method.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        })
      }
    }
  })
  return Array.from(methods)
}

// Mettre à jour la fonction searchEmissionFactors
async function searchEmissionFactors() {
  if (!searchQuery.value.trim() && !['fuel', 'electricity', 'heat_and_steam', 'waste'].includes(searchFilters.value.category)) return

  loadingSearch.value = true
  errorMessage.value = ''

  try {
    const filters = {
      results_per_page: 50,
      page: 1,
      data_version: '22'
    }

    // Détection automatique de la catégorie basée sur la recherche
    const searchLower = searchQuery.value.toLowerCase()
    if (!searchFilters.value.category) {
      if (searchLower.includes('fuel')) {
        searchFilters.value.category = 'fuel'
      } else if (searchLower.includes('electricity')) {
        searchFilters.value.category = 'electricity'
      } else if (searchLower.includes('heat') || searchLower.includes('steam')) {
        searchFilters.value.category = 'heat_and_steam'
      } else if (searchLower.includes('waste')) {
        searchFilters.value.category = 'waste'
      }
    }

    // Gestion des filtres par catégorie
    if (searchFilters.value.category) {
      switch (searchFilters.value.category) {
        case 'fuel':
          if (searchFilters.value.fuelType) {
            searchQuery.value = `${searchFilters.value.fuelType} fuel`
          } else if (!searchLower.includes('fuel')) {
            searchQuery.value = 'fuel'
          }
          break
        case 'electricity':
          if (searchFilters.value.sourceType) {
            searchQuery.value = `${searchFilters.value.sourceType} electricity`
          } else if (!searchLower.includes('electricity')) {
            searchQuery.value = 'electricity'
          }
          break
        case 'heat_and_steam':
          filters.category = 'Heat and Steam'
          if (searchFilters.value.heatType) {
            filters.activity_id = `heat_and_steam-type_${searchFilters.value.heatType}`
          }
          break
        case 'waste':
          if (searchFilters.value.wasteType) {
            searchQuery.value = `${searchFilters.value.wasteType} waste`
          } else if (searchFilters.value.wasteTreatment) {
            searchQuery.value = `${searchFilters.value.wasteTreatment} waste treatment`
          } else if (!searchLower.includes('waste')) {
            searchQuery.value = 'waste'
          }
          break
        default:
          filters.category = searchFilters.value.category
      }
    }

    // Ajout des filtres communs
    if (searchFilters.value.region) filters.region = searchFilters.value.region
    if (searchFilters.value.calculationMethod) filters.calculation_method = searchFilters.value.calculationMethod

    console.log('Searching with query:', searchQuery.value.trim(), 'and filters:', filters)

    const results = await apiSearchEmissionFactors(searchQuery.value.trim(), filters)

    if (!results || !results.results) {
      throw new Error('Invalid response format from API')
    }

    // Mettre à jour les filtres disponibles pour les déchets
    if (searchFilters.value.category === 'waste') {
      availableWasteTypes.value = extractWasteTypes(results.results)
      availableWasteMethods.value = extractWasteMethods(results.results)
    }

    // Filtrage supplémentaire des résultats si nécessaire
    let filteredResults = results.results

    if (searchFilters.value.category === 'fuel' && searchFilters.value.fuelType) {
      const fuelType = searchFilters.value.fuelType.toLowerCase()
      filteredResults = filteredResults.filter(result => 
        result.name.toLowerCase().includes(fuelType) ||
        (result.activity_id && result.activity_id.toLowerCase().includes(fuelType))
      )
    }

    if (searchFilters.value.category === 'electricity' && searchFilters.value.sourceType) {
      const sourceType = searchFilters.value.sourceType.toLowerCase()
      filteredResults = filteredResults.filter(result => 
        result.name.toLowerCase().includes(sourceType) ||
        (result.activity_id && result.activity_id.toLowerCase().includes(sourceType))
      )
    }

    if (searchFilters.value.category === 'waste') {
      if (searchFilters.value.wasteType) {
        const wasteType = searchFilters.value.wasteType.toLowerCase()
        filteredResults = filteredResults.filter(result => 
          result.name.toLowerCase().includes(wasteType) ||
          (result.activity_id && result.activity_id.toLowerCase().includes(wasteType))
        )
      }
      if (searchFilters.value.wasteTreatment) {
        const treatment = searchFilters.value.wasteTreatment.toLowerCase()
        filteredResults = filteredResults.filter(result => 
          result.name.toLowerCase().includes(treatment) ||
          (result.activity_id && result.activity_id.toLowerCase().includes(treatment))
        )
      }
    }

    searchResults.value = filteredResults
    searchPerformed.value = true

    if (searchResults.value.length === 0) {
      console.log('No results found for:', searchQuery.value, 'with filters:', filters)
      errorMessage.value = 'No results found. Try adjusting your search criteria.'
    }
  } catch (error) {
    console.error('Search error:', error)
    errorMessage.value = `Search failed: ${error.message}`
    searchResults.value = []
  } finally {
    loadingSearch.value = false
  }
}

// Select an emission factor from search results
function selectEmissionFactor(factor) {
  console.log('Selecting factor:', factor)
  selectedFactor.value = factor

  // Auto-fill the name if empty
  if (!form.name.trim()) {
    form.name = `${factor.name} Calculation`
  }

  // Reset form value
  form.value = 1

  // Clear previous errors
  Object.keys(errors).forEach(key => errors[key] = '')
}

// Clear selected factor
function clearSelection() {
  console.log('Clearing selection')
  selectedFactor.value = null
  form.name = ''
  form.value = 1
  Object.keys(errors).forEach(key => errors[key] = '')
}

async function onSubmit(e) {
  e.preventDefault()
  loading.value = true
  errorMessage.value = ''

  try {
    // Validation
    if (!selectedFactor.value) {
      throw new Error('Please select an emission factor')
    }
    if (!form.name.trim()) {
      errors.name = 'Please enter an activity name'
      return
    }
    if (!form.value || form.value <= 0) {
      errors.value = 'Please enter a valid amount'
      return
    }

    // Préparer les paramètres selon unit_type
    let parameters = {}
    const unitType = selectedFactor.value.unit_type.toLowerCase()

    switch (unitType) {
      case 'energy':
        parameters = { energy: form.value, energy_unit: 'kWh' }
        break
      case 'volume':
        parameters = { volume: form.value, volume_unit: 'l' }
        break
      case 'weight':
        parameters = { weight: form.value, weight_unit: 'kg' }
        break
      case 'distance':
        parameters = { distance: form.value, distance_unit: 'km' }
        break
      case 'number':
        parameters = { number: form.value }
        break
      default:
        parameters = { [unitType]: form.value }
    }

    // Créer d'abord le mapping
    const mappingPayload = {
      label: form.name,
      activity_id: selectedFactor.value.activity_id,
      data_version: '22',
      ...(selectedFactor.value.region && selectedFactor.value.region !== 'GLOBAL'
        ? { region: selectedFactor.value.region } : {})
    }

    console.log('📝 Creating mapping with payload:', mappingPayload)
    const mapping = await createCustomMapping(mappingPayload)
    console.log('✅ Mapping created:', mapping)

    // Maintenant faire l'estimation avec le mapping créé
    const estimatePayload = {
      custom_mapping: {
        label: form.name,
        data_version: '22',
        ...(selectedFactor.value.region && selectedFactor.value.region !== 'GLOBAL'
          ? { region: selectedFactor.value.region } : {})
      },
      parameters
    }

    console.log('⚙️ Estimating emissions with payload:', estimatePayload)
    const result = await calculateCustomEmissions(
      form.name,
      parameters,
      {
        dataVersion: '22',
        ...(selectedFactor.value.region && selectedFactor.value.region !== 'GLOBAL'
          ? { region: selectedFactor.value.region } : {}),
        regionFallback: true,
        year: selectedFactor.value.year
      }
    )

    console.log('✅ Calculation result:', result)

    // Émission de l'événement avec le résultat formaté
    emit('result', {
      activity_type: 'custom_activity',
      co2e_kg: result.co2e,
      activity_data: {
        name: form.name,
        value: form.value,
        unit: getUnitLabel(selectedFactor.value.unit_type),
        emission_factor: {
          name: selectedFactor.value.name,
          category: selectedFactor.value.category,
          region: selectedFactor.value.region || 'Global',
          source: selectedFactor.value.source,
          data_version: selectedFactor.value.data_version
        }
      },
      raw_response: result
    })

    // Réinitialisation du formulaire
    form.name = ''
    form.value = 1
    selectedFactor.value = null
    searchResults.value = []

  } catch (err) {
    console.error('❌ Error submitting form:', err.details || err)
    if (err.details?.valid_values?.unit_type) {
      errorMessage.value = `Unité invalide. Valeurs acceptées : ${err.details.valid_values.unit_type.join(', ')}`
    } else {
      errorMessage.value = err.message
    }
  } finally {
    loading.value = false
  }
}

// Fonction pour obtenir le label d'unité approprié
function getUnitLabel(unitType) {
  switch (unitType?.toLowerCase()) {
    case 'energy':
      return 'kWh'
    case 'volume':
      return 'liters'
    case 'weight':
      return 'kg'
    case 'distance':
      return 'km'
    default:
      return unitType || 'units'
  }
}

// Fonction pour obtenir la description de l'unité
function getUnitDescription(unitType) {
  switch (unitType?.toLowerCase()) {
    case 'energy':
      return 'The amount of energy consumption in kilowatt-hours (kWh)'
    case 'volume':
      return 'The volume in liters (L)'
    case 'weight':
      return 'The weight in kilograms (kg)'
    case 'distance':
      return 'The distance in kilometers (km)'
    default:
      return `The quantity of ${selectedFactor.value?.name?.toLowerCase() || 'activity'} to calculate emissions for`
  }
}

// Mettre à jour la fonction handleCategoryChange
function handleCategoryChange() {
  // Réinitialiser les filtres spécifiques à la catégorie
  searchFilters.value.fuelType = ''
  searchFilters.value.sourceType = ''
  searchFilters.value.heatType = ''
  searchFilters.value.wasteType = ''
  searchFilters.value.wasteTreatment = ''
  
  // Réinitialiser la requête de recherche
  searchQuery.value = ''
  
  // Lancer une nouvelle recherche avec la catégorie sélectionnée
  if (searchFilters.value.category) {
    searchEmissionFactors()
  }
}

// Dans la partie script, ajouter les computed properties et mettre à jour la logique
const isFuelCategory = computed(() => {
  return searchFilters.value.category === 'fuel' || 
         searchQuery.value.toLowerCase().includes('fuel')
})

const isElectricityCategory = computed(() => {
  return searchFilters.value.category === 'electricity' || 
         searchQuery.value.toLowerCase().includes('electricity')
})

const isHeatAndSteamCategory = computed(() => {
  return searchFilters.value.category === 'heat_and_steam' || 
         searchQuery.value.toLowerCase().includes('heat') ||
         searchQuery.value.toLowerCase().includes('steam')
})

const isWasteCategory = computed(() => {
  return searchFilters.value.category === 'waste' || 
         searchQuery.value.toLowerCase().includes('waste')
})

const shouldShowFilters = computed(() => {
  return isFuelCategory.value || isElectricityCategory.value || isHeatAndSteamCategory.value || isWasteCategory.value
})
</script>