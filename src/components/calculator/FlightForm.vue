<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div v-if="apiError" class="error-bubble">
      {{ apiError }}
    </div>

    <div>
      <label class="block font-medium mb-1">Departure Airport</label>
      <input
        v-model="form.from"
        class="input"
        placeholder="e.g. LHR, JFK"
      />
      <div class="text-xs text-gray-500">Airport code or city name</div>
      <span class="text-xs text-red-500">{{ errors.from }}</span>
    </div>

    <div>
      <label class="block font-medium mb-1">Arrival Airport</label>
      <input
        v-model="form.to"
        class="input"
        placeholder="e.g. CDG, LAX"
      />
      <div class="text-xs text-gray-500">Airport code or city name</div>
      <span class="text-xs text-red-500">{{ errors.to }}</span>
    </div>

    <div>
      <label class="block font-medium mb-1">Number of Passengers</label>
      <input
        type="number"
        min="1"
        v-model.number="form.passengers"
        class="input"
      />
      <span class="text-xs text-red-500">{{ errors.passengers }}</span>
    </div>

    <div>
      <label class="block font-medium mb-1">Travel Class</label>
      <select v-model="form.class" class="input">
        <option value="economy">Economy</option>
        <option value="business">Business</option>
        <option value="first">First Class</option>
      </select>
      <div class="text-xs text-gray-500">The class of travel affects emissions</div>
      <span class="text-xs text-red-500">{{ errors.class }}</span>
    </div>

    <button type="submit" class="btn" :disabled="loading">
      {{ loading ? "Calculating..." : "Calculate Emissions" }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { ApiError } from '../../lib/climatiq.js'
import { calculateFlightEmissions } from '../../lib/climatiq.js'

const emit = defineEmits(['result'])

const form = reactive({
  from: '',
  to: '',
  passengers: 1,
  class: 'economy'
})

const errors = reactive({
  from: '',
  to: '',
  passengers: '',
  class: ''
})

const apiError = ref('')
const loading = ref(false)

const schema = z.object({
  from: z.string().min(3, 'Please enter at least 3 characters'),
  to: z.string().min(3, 'Please enter at least 3 characters'),
  passengers: z.coerce.number().int().positive('At least 1 passenger'),
  class: z.enum(['economy', 'business', 'first'])
})

async function onSubmit() {
  apiError.value = ''
  Object.keys(errors).forEach(k => errors[k] = '')

  const result = schema.safeParse(form)
  if (!result.success) {
    result.error.errors.forEach(e => {
      const f = e.path[0]
      if (f in errors) errors[f] = e.message
    })
    return
  }

  loading.value = true
  try {
    const api = await calculateFlightEmissions(
      form.from,
      form.to,
      form.passengers,
      form.class
    )

    const wrapped = {
      activity_type: 'flight',
      co2e_kg: api.co2e,
      co2e_unit: api.co2e_unit,
      activity_data: {
        origin: form.from,
        destination: form.to,
        passengers: form.passengers,
        travel_class: form.class,
        breakdown: {
          legs: api.legs,
          wtt_legs: api.wtt_legs
        }
      },
      raw_responses: api
    }

    emit('result', wrapped)
  } catch (e) {
    console.error(e)
    // Tenter d'identifier l'aéroport inconnu ou invalide
    const detail = e.details || ''
    const match = detail.match(/airport code "?(\w{3})"?/i)
    if (match) {
      const code = match[1].toUpperCase()
      if (form.from.toUpperCase() === code) {
        errors.from = `Code d'aéroport invalide : ${code}`
      }
      if (form.to.toUpperCase() === code) {
        errors.to = `Code d'aéroport invalide : ${code}`
      }
    }
    // Si toujours aucun champ marqué, erreur générique
    if (!errors.from && !errors.to) {
      apiError.value = 'Vérifier les aéroports saisis'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  margin: 0.5rem 0;
}
.btn {
  background-color: #22c55e;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background 0.15s;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
  .error-bubble {
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    color: #b91c1c;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    font-weight: 500;
    max-width: 100%;
    overflow-wrap: break-word;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .error-bubble:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }
  .btn {
    background-color: #22c55e;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: background 0.15s, transform 0.1s;
  }
  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  .btn:active:not(:disabled) {
    transform: translateY(0);
  }
  /* si le chiffre de consommation est trop grand, on fait "overflow" visuel */
  .result-bubble {
    background: #f0fdf4;
    color: #166534;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    white-space: nowrap;
    overflow: visible;
  }
</style>
