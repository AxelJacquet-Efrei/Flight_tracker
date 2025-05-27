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
            <input
              v-model="searchQuery"
              @input="debouncedSearch"
              @keyup.enter="searchEmissionFactors"
              class="input flex-1"
              placeholder="e.g. electricity, fuel, waste, paper production..."
            />
            <button 
              type="button" 
              @click="searchEmissionFactors"
              :disabled="loadingSearch || !searchQuery.trim()"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loadingSearch ? 'Searching...' : 'Search' }}
            </button>
          </div>
          <div class="text-xs text-green-600 mt-1">
            Search for emission factors in the Climatiq database. Try keywords like "electricity", "fuel", "waste", "transport"
          </div>
        </div>
  
        <!-- Search Filters (optional) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <select v-model="searchFilters.category" @change="searchEmissionFactors" class="input text-xs">
            <option value="">All Categories</option>
            <option value="electricity">Electricity</option>
            <option value="fuel">Fuel</option>
            <option value="transport">Transport</option>
            <option value="waste">Waste</option>
            <option value="materials">Materials</option>
          </select>
          <select v-model="searchFilters.region" @change="searchEmissionFactors" class="input text-xs">
            <option value="">All Regions</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
          </select>
          <select v-model="searchFilters.year" @change="searchEmissionFactors" class="input text-xs">
            <option value="">Any Year</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <button 
            type="button" 
            @click="clearFilters" 
            class="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
  
        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="space-y-2">
          <label class="block text-green-800 text-sm font-medium">
            Available Emission Factors ({{ searchResults.length }} results)
          </label>
          <div class="max-h-60 overflow-y-auto border border-gray-200 rounded">
            <div 
              v-for="factor in searchResults" 
              :key="factor.activity_id"
              @click="selectEmissionFactor(factor)"
              class="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              :class="{ 'bg-green-100 border-green-300': selectedFactor?.activity_id === factor.activity_id }"
            >
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
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
                <div class="text-xs text-blue-500 mt-2">{{ selectedFactor.description || 'No description available' }}</div>
              </div>
            </div>
            <button 
              type="button"
              @click="clearSelection"
              class="ml-4 text-blue-400 hover:text-blue-600"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
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
          <input
            v-model="form.name"
            class="input"
            placeholder="Give this calculation a name..."
          />
          <div class="text-xs text-green-600 mt-1">Custom name for this emission calculation</div>
          <span class="text-xs text-red-500">{{ errors.name }}</span>
        </div>
  
        <!-- Value Input -->
        <div>
          <label class="block text-green-800 text-sm font-medium mb-2">
            Amount ({{ selectedFactor.unit_type }})
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            v-model.number="form.value"
            class="input"
            :placeholder="`Enter amount in ${selectedFactor.unit_type}`"
          />
          <div class="text-xs text-green-600 mt-1">
            The quantity of {{ selectedFactor.name.toLowerCase() }} to calculate emissions for
          </div>
          <span class="text-xs text-red-500">{{ errors.value }}</span>
        </div>
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
  
      <!-- Submit Button -->
      <button 
        type="submit" 
        class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
        :disabled="loading || !selectedFactor"
      >
        <template v-if="loading">
          <span class="flex items-center justify-center gap-2">
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block"></span>
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
  import { reactive, ref } from 'vue'
  import { z } from 'zod'
  import { 
    searchEmissionFactors as apiSearchEmissionFactors,
    calculateCustomEmissions,
    getEmissionFactorById
  } from '../../lib/climatiq.js'
  
  const emit = defineEmits(['result'])
  
  const form = reactive({
    name: '',
    value: 1
  })
  
  const errors = reactive({
    name: '',
    value: ''
  })
  
  const searchFilters = reactive({
    category: '',
    region: '',
    year: ''
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
    searchFilters.category = ''
    searchFilters.region = ''
    searchFilters.year = ''
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
  
  // Search for emission factors
  async function searchEmissionFactors() {
    if (!searchQuery.value.trim()) return
    
    loadingSearch.value = true
    errorMessage.value = ''
    
    try {
      // Construire les filtres en excluant les valeurs vides
      const filters = {
        results_per_page: 50,
        page: 1
      }
      
      // Ajouter les filtres seulement s'ils ont une valeur
      if (searchFilters.category) filters.category = searchFilters.category
      if (searchFilters.region) filters.region = searchFilters.region
      if (searchFilters.year) filters.year = searchFilters.year
      
      const results = await apiSearchEmissionFactors(searchQuery.value.trim(), filters)
      
      searchResults.value = results.results || []
      searchPerformed.value = true
      
      if (searchResults.value.length === 0) {
        console.log('No results found for:', searchQuery.value, 'with filters:', filters)
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
    selectedFactor.value = null
    form.name = ''
    form.value = 1
  }
  
  async function onSubmit() {
    // Reset errors
    Object.keys(errors).forEach(key => errors[key] = '')
    errorMessage.value = ''
    
    // Check if factor is selected
    if (!selectedFactor.value) {
      errorMessage.value = 'Please search and select an emission factor first'
      return
    }
    
    // Validate form
    const result = schema.safeParse(form)
    if (!result.success) {
      result.error.errors.forEach(err => {
        if (err.path[0] && errors[err.path[0]] !== undefined) {
          errors[err.path[0]] = err.message
        }
      })
      return
    }
  
    loading.value = true
    
    try {
      // Prepare parameters object based on the unit type
      const parameters = {
        [selectedFactor.value.unit_type]: form.value
      }
      
      // Call Climatiq API
      const apiResult = await calculateCustomEmissions(
        selectedFactor.value.activity_id,
        parameters,
        selectedFactor.value.data_version || 'latest'
      )
  
      // Format result for the parent component
      const result = {
        activity_type: 'custom_activity',
        co2e_kg: apiResult.co2e,
        activity_data: {
          name: form.name,
          value: form.value,
          unit: selectedFactor.value.unit_type,
          emission_factor: {
            id: selectedFactor.value.activity_id,
            name: selectedFactor.value.name,
            category: selectedFactor.value.category,
            source: selectedFactor.value.source,
            region: selectedFactor.value.region,
            data_version: selectedFactor.value.data_version
          },
          co2e_unit: apiResult.co2e_unit,
          constituent_gases: apiResult.constituent_gases
        },
        raw_response: apiResult
      }
  
      emit('result', result)
  
      // Reset form after successful submission
      form.name = ''
      form.value = 1
      selectedFactor.value = null
      searchQuery.value = ''
      searchResults.value = []
      searchPerformed.value = false
  
    } catch (error) {
      console.error('Error calculating emissions:', error)
      errorMessage.value = `Failed to calculate emissions: ${error.message}`
    } finally {
      loading.value = false
    }
  }
  </script>