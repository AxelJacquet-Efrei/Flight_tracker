import { ref } from 'vue'

const API_KEY = 'YOUR_API_KEY' // Remplacez par votre clé API Climatiq
const BASE_URL = 'https://api.climatiq.io'

// Classe d'erreur personnalisée
class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Fonction utilitaire pour gérer les erreurs de l'API
async function fetchWithError(url, options) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        ...options?.headers
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(data.message || 'Une erreur est survenue', response.status)
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(error.message || 'Erreur de connexion', 500)
  }
}

// État global pour stocker les résultats
const emissionResult = ref(null)
const loading = ref(false)
const error = ref(null)

// Fonction pour créer les mappings personnalisés
async function createCustomMapping(label, unitType) {
  try {
    const response = await fetchWithError(`${BASE_URL}/custom-mappings/v1/labels`, {
      method: 'POST',
      body: JSON.stringify({
        data_version: "0.0",
        labels: [{
          label: label,
          unit_type: [unitType.toLowerCase()]
        }]
      })
    })
    return response
  } catch (err) {
    console.error('Error creating custom mapping:', err)
    throw err
  }
}

// Fonction pour calculer les émissions
export async function calculateEmissions(activityData) {
  loading.value = true
  error.value = null
  
  try {
    console.log('Calculating emissions with data:', activityData)
    
    // Préparer les paramètres selon le type d'unité
    let parameters = {}
    if (activityData.unit_type === 'Energy') {
      parameters = {
        energy: activityData.value,
        energy_unit: 'kWh'  // Toujours utiliser kWh pour l'électricité
      }
    } else if (activityData.unit_type === 'Weight') {
      parameters = {
        weight: activityData.value,
        weight_unit: 'kg'
      }
    } else if (activityData.unit_type === 'Volume') {
      parameters = {
        volume: activityData.value,
        volume_unit: 'l'
      }
    } else if (activityData.unit_type === 'Distance') {
      parameters = {
        distance: activityData.value,
        distance_unit: 'km'
      }
    }

    const requestBody = {
      custom_activity: {
        label: activityData.name,
        data_version: "0.0",
        region: activityData.region || undefined
      },
      parameters: parameters
    }

    console.log('Sending request to API:', requestBody)
    
    const response = await fetchWithError(`${BASE_URL}/custom-mappings/v1/estimate`, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    })

    console.log('API Response:', response)
    
    emissionResult.value = {
      co2e: response.co2e,
      unit: response.co2e_unit,
      activity: activityData.name,
      value: activityData.value,
      unit_type: activityData.unit_type,
      calculation_method: response.co2e_calculation_method,
      emission_factor: response.emission_factor
    }
    
    return emissionResult.value
  } catch (err) {
    console.error('Error calculating emissions:', err)
    error.value = err.message
    throw err
  } finally {
    loading.value = false
  }
}

// Fonction pour rechercher des facteurs d'émission
export async function searchEmissionFactors(query) {
  try {
    const response = await fetchWithError(`${BASE_URL}/search`, {
      method: 'GET',
      params: { query }
    })
    return response.results
  } catch (err) {
    console.error('Error searching emission factors:', err)
    throw err
  }
}

// Exporter l'état global
export { emissionResult, loading, error } 