<template>
    <form @submit.prevent="onSubmit" class="space-y-6">
      <div>
        <label class="block font-medium mb-1">Activity Name</label>
        <input
          v-model="form.name"
          class="input"
          placeholder="e.g. Car Travel, Electricity Usage"
        />
        <div class="text-xs text-gray-500">Name of the activity you want to calculate emissions for</div>
        <span class="text-xs text-red-500">{{ errors.name }}</span>
      </div>
  
      <div>
        <label class="block font-medium mb-1">Value</label>
        <input
          type="number"
          step="0.01"
          v-model.number="form.value"
          class="input"
        />
        <div class="text-xs text-gray-500">The amount of the activity</div>
        <span class="text-xs text-red-500">{{ errors.value }}</span>
      </div>
  
      <div>
        <label class="block font-medium mb-1">Unit</label>
        <select v-model="form.unit" class="input">
          <option value="kg">Kilograms (kg)</option>
          <option value="km">Kilometers (km)</option>
          <option value="kwh">Kilowatt Hours (kWh)</option>
          <option value="l">Liters (L)</option>
        </select>
        <div class="text-xs text-gray-500">The unit of measurement</div>
        <span class="text-xs text-red-500">{{ errors.unit }}</span>
      </div>
  
      <button type="submit" class="btn" :disabled="loading">
        {{ loading ? "Calculating..." : "Calculate Emissions" }}
      </button>
    </form>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import { z } from 'zod'
  
  const calculateCustomEmissions = async (data) => {
    return new Promise((resolve) => setTimeout(() => resolve({ emissions: 42, ...data }), 1000))
  }
  
  const emit = defineEmits(['result'])
  
  const form = reactive({
    name: '',
    value: 1,
    unit: 'kg'
  })
  
  const errors = reactive({
    name: '',
    value: '',
    unit: ''
  })
  
  const loading = ref(false)
  
  const schema = z.object({
    name: z.string().min(1, 'Please enter an activity name'),
    value: z.coerce.number().positive('Please enter a positive number'),
    unit: z.string().min(1, 'Please select a unit')
  })
  
  async function onSubmit() {
    Object.keys(errors).forEach(key => errors[key] = '') // reset
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
      const emissions = await calculateCustomEmissions({ ...form })
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
  