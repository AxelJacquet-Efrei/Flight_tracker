<template>
    <form @submit.prevent="onSubmit" class="space-y-6">
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
  
  const calculateFlightEmissions = async (data) => {
    return new Promise((resolve) => setTimeout(() => resolve({ emissions: 123, ...data }), 1000))
  }
  
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
  
  const loading = ref(false)
  
  const schema = z.object({
    from: z.string().min(3, 'Please enter at least 3 characters'),
    to: z.string().min(3, 'Please enter at least 3 characters'),
    passengers: z.coerce.number().int().positive('At least 1 passenger'),
    class: z.enum(['economy', 'business', 'first'])
  })
  
  async function onSubmit() {
    Object.keys(errors).forEach(key => errors[key] = '')
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
      const emissions = await calculateFlightEmissions({ ...form })
      emit('result', emissions)
    } catch (e) {
      alert('Error calculating emissions')
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
    margin-top: 2px;
    margin-bottom: 2px;
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
  </style>
  