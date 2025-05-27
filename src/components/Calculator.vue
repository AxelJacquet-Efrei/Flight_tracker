<template>
    <div class="relative space-y-8 py-6">
      <!-- Background Elements -->
      <div class="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-green-200 opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-green-300 opacity-20 blur-3xl"></div>
  
      <div class="relative z-10 space-y-2">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h1 class="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-3xl font-bold text-transparent">
            Carbon Emissions Calculator
          </h1>
        </div>
        <p class="text-gray-600">
          Calculate the CO₂ emissions for different activities and track your carbon footprint
        </p>
      </div>
  
      <div class="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-3 mb-4 bg-green-50 p-1">
            <TabsTrigger 
              value="cloud" 
              :modelValue="activeTab"
              @activate="activeTab = 'cloud'"
              class="flex items-center gap-2" 
              :class="triggerClass('cloud')"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
              </svg>
              <span class="hidden sm:inline">Cloud</span>
            </TabsTrigger>
            <TabsTrigger 
              value="flight" 
              :modelValue="activeTab"
              @activate="activeTab = 'flight'"
              class="flex items-center gap-2" 
              :class="triggerClass('flight')"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              <span class="hidden sm:inline">Flights</span>
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              :modelValue="activeTab"
              @activate="activeTab = 'custom'"
              class="flex items-center gap-2" 
              :class="triggerClass('custom')"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              <span class="hidden sm:inline">Custom</span>
            </TabsTrigger>
          </TabsList>
          <Card class="eco-card border-green-200">
            <CardContent class="pt-6">
              <TabsContent value="cloud" :modelValue="activeTab">
                <CloudComputingForm @result="setResult" />
              </TabsContent>
              <TabsContent value="flight" :modelValue="activeTab">
                <FlightForm @result="setResult" />
              </TabsContent>
              <TabsContent value="custom" :modelValue="activeTab">
                <CustomActivityForm @result="setResult" />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
  
        <div v-if="result">
          <EmissionResult :emission="result" />
        </div>
        <div v-else class="flex h-full items-center justify-center rounded-xl border border-dashed border-green-300 bg-green-50/50 p-8 text-center">
          <div class="max-w-sm">
            <div class="mx-auto mb-4 flex justify-center">
              <svg class="h-16 w-16 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="mb-2 text-xl font-medium text-green-800">Calculate Your Emissions</h3>
            <p class="text-green-600">
              Fill out one of the forms to see your carbon footprint calculation results here.
            </p>
          </div>
        </div>
      </div>
  
      <!-- Environmental Tips -->
      <div class="relative z-10 mt-12 rounded-xl border border-green-200 bg-green-50/80 p-6">
        <h3 class="mb-4 text-xl font-medium text-green-800">Tips to Reduce Your Carbon Footprint</h3>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-lg bg-white p-4 shadow-sm">
            <div class="mb-2 text-green-600 font-medium">Use Renewable Energy</div>
            <p class="text-sm text-gray-600">
              Switch to renewable energy sources like solar or wind power for your home and office.
            </p>
          </div>
          <div class="rounded-lg bg-white p-4 shadow-sm">
            <div class="mb-2 text-green-600 font-medium">Reduce Air Travel</div>
            <p class="text-sm text-gray-600">
              Consider alternatives like video conferencing or train travel when possible.
            </p>
          </div>
          <div class="rounded-lg bg-white p-4 shadow-sm">
            <div class="mb-2 text-green-600 font-medium">Optimize Cloud Usage</div>
            <p class="text-sm text-gray-600">
              Choose green data centers and optimize your cloud resources to minimize waste.
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Tabs from './ui/Tabs.vue'
  import TabsList from './ui/TabsList.vue'
  import TabsTrigger from './ui/TabsTrigger.vue'
  import TabsContent from './ui/TabsContent.vue'
  import Card from './ui/Card.vue'
  import CardContent from './ui/CardContent.vue'
//   import CloudComputingForm from './calculator/CloudComputingForm.vue'
//   import FlightForm from './calculator/FlightForm.vue'
//   import CustomActivityForm from './calculator/CustomActivityForm.vue'
//   import EmissionResult from './calculator/EmissionResult.vue'
  
  const result = ref(null)
  const activeTab = ref('cloud')
  
  const setResult = (val) => {
    result.value = val
  }
  
  function triggerClass(value) {
    return activeTab.value === value
      ? 'bg-white text-green-700 shadow-md'
      : ''
  }
  </script>