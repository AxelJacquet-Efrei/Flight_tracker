<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 py-20">
      <!-- Pattern overlay -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-green-600/50 to-emerald-500/50"></div>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-green-400/20 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl"></div>
      
      <!-- Content -->
      <div class="container relative mx-auto px-4">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="mb-6 text-5xl font-bold tracking-tight text-white">
            Compare Emissions
          </h1>
          <p class="mb-8 text-xl text-green-50">
            Compare carbon emissions between different activities and understand their environmental impact
          </p>
          <div class="flex justify-center gap-4">
            <div class="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Real-time Comparison</span>
            </div>
            <div class="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Detailed Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <!-- Activity Comparison Form -->
      <div class="mb-12 space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div class="grid gap-8 md:grid-cols-2">
          <!-- First Activity -->
          <div class="group space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:shadow-md">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900">Activity 1</h3>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-green-500"></span>
                <span class="text-sm text-gray-500">Active</span>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                  v-model="activity1.name"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  placeholder="e.g., Paris-New York Flight"
                />
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Type</label>
                <div class="relative">
                  <select
                    v-model="activity1.type"
                    class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="flight">Flight</option>
                    <option value="cpu">CPU Usage</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Flight Parameters -->
              <template v-if="activity1.type === 'flight'">
                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Origin</label>
                    <div class="relative">
                      <input
                        v-model="activity1.parameters.origin"
                        type="text"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        placeholder="e.g., CDG"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Destination</label>
                    <div class="relative">
                      <input
                        v-model="activity1.parameters.destination"
                        type="text"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        placeholder="e.g., JFK"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Passengers</label>
                    <div class="relative">
                      <input
                        v-model.number="activity1.parameters.passengers"
                        type="number"
                        min="1"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Class</label>
                    <div class="relative">
                      <select
                        v-model="activity1.parameters.travelClass"
                        class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      >
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- CPU Parameters -->
              <template v-if="activity1.type === 'cpu'">
                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Provider</label>
                    <div class="relative">
                      <select
                        v-model="activity1.parameters.provider"
                        class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      >
                        <option value="aws">AWS</option>
                        <option value="gcp">Google Cloud</option>
                        <option value="azure">Azure</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Region</label>
                    <div class="relative">
                      <select
                        v-model="activity1.parameters.region"
                        class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      >
                        <option v-for="region in cloudRegions[activity1.parameters.provider]" :key="region.id" :value="region.id">
                          {{ region.name }}
                        </option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">CPU Count</label>
                    <div class="relative">
                      <input
                        v-model.number="activity1.parameters.cpuCount"
                        type="number"
                        min="1"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Duration (hours)</label>
                    <div class="relative">
                      <input
                        v-model.number="activity1.parameters.duration"
                        type="number"
                        min="1"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Second Activity -->
          <div class="group space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:shadow-md">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900">Activity 2</h3>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-green-500"></span>
                <span class="text-sm text-gray-500">Active</span>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input
                  v-model="activity2.name"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  placeholder="e.g., AWS CPU Usage"
                />
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Type</label>
                <div class="relative">
                  <select
                    v-model="activity2.type"
                    class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="flight">Flight</option>
                    <option value="cpu">CPU Usage</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Flight Parameters -->
              <template v-if="activity2.type === 'flight'">
                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Origin</label>
                    <div class="relative">
                      <input
                        v-model="activity2.parameters.origin"
                        type="text"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        placeholder="e.g., CDG"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Destination</label>
                    <div class="relative">
                      <input
                        v-model="activity2.parameters.destination"
                        type="text"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        placeholder="e.g., JFK"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Passengers</label>
                    <div class="relative">
                      <input
                        v-model.number="activity2.parameters.passengers"
                        type="number"
                        min="1"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Class</label>
                    <div class="relative">
                      <select
                        v-model="activity2.parameters.travelClass"
                        class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      >
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- CPU Parameters -->
              <template v-if="activity2.type === 'cpu'">
                <div class="grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Provider</label>
                    <div class="relative">
                      <select
                        v-model="activity2.parameters.provider"
                        class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      >
                        <option value="aws">AWS</option>
                        <option value="gcp">Google Cloud</option>
                        <option value="azure">Azure</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Region</label>
                    <div class="relative">
                      <select
                        v-model="activity2.parameters.region"
                        class="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      >
                        <option v-for="region in cloudRegions[activity2.parameters.provider]" :key="region.id" :value="region.id">
                          {{ region.name }}
                        </option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">CPU Count</label>
                    <div class="relative">
                      <input
                        v-model.number="activity2.parameters.cpuCount"
                        type="number"
                        min="1"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Duration (hours)</label>
                    <div class="relative">
                      <input
                        v-model.number="activity2.parameters.duration"
                        type="number"
                        min="1"
                        class="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Compare Button -->
        <div class="flex justify-center">
          <button
            @click="compare"
            :disabled="isLoading || !isFormValid"
            class="group relative overflow-hidden rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
          >
            <span class="relative z-10 flex items-center gap-2">
              <span v-if="isLoading" class="flex items-center gap-2">
                <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Comparing...
              </span>
              <span v-else>Compare Emissions</span>
            </span>
            <div class="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-if="results.length > 0" class="space-y-12">
        <!-- Bar Chart -->
        <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h2 class="mb-8 text-center text-2xl font-bold text-gray-900">Emissions Comparison</h2>
          <div class="relative mx-auto h-[500px] w-full max-w-4xl">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>

        <!-- Results Cards -->
        <div class="grid gap-8 md:grid-cols-2">
          <div
            v-for="result in results"
            :key="result.name"
            class="group transform rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div class="mb-6 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900">{{ result.name }}</h3>
              <div class="flex items-center gap-2">
                <span class="h-2 w-2 rounded-full" :class="{
                  'bg-green-500': result.co2e < 100,
                  'bg-yellow-500': result.co2e >= 100 && result.co2e < 500,
                  'bg-red-500': result.co2e >= 500
                }"></span>
                <span class="text-sm text-gray-500">Impact Level</span>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Type</span>
                <span class="font-medium text-gray-900">{{ result.type }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">CO₂e</span>
                <span class="font-medium text-gray-900">{{ result.co2e.toFixed(2) }} {{ result.unit }}</span>
              </div>
              <div class="mt-6 rounded-lg bg-green-50 p-4">
                <p class="text-sm text-green-800">
                  This is equivalent to {{ (result.co2e / 8.9).toFixed(2) }} trees needed to absorb this CO₂ for one year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="mt-8 rounded-lg bg-red-50 p-4 text-red-800"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import {
  compareActivitiesEmissions,
  getCloudRegions
} from '../lib/climatiq'

// State
const isLoading = ref(false)
const error = ref('')
const results = ref([])
const chartCanvas = ref(null)
const chart = ref(null)

// Cloud regions
const cloudRegions = ref({
  aws: [],
  gcp: [],
  azure: []
})

// Activity 1
const activity1 = ref({
  name: '',
  type: 'flight',
  parameters: {
    origin: '',
    destination: '',
    passengers: 1,
    travelClass: 'economy',
    provider: 'aws',
    region: '',
    cpuCount: 1,
    duration: 24
  }
})

// Activity 2
const activity2 = ref({
  name: '',
  type: 'cpu',
  parameters: {
    origin: '',
    destination: '',
    passengers: 1,
    travelClass: 'economy',
    provider: 'aws',
    region: '',
    cpuCount: 1,
    duration: 24
  }
})

// Form validation
const isFormValid = computed(() => {
  if (!activity1.value.name || !activity2.value.name) return false

  if (activity1.value.type === 'flight') {
    if (!activity1.value.parameters.origin || !activity1.value.parameters.destination) return false
  } else if (activity1.value.type === 'cpu') {
    if (!activity1.value.parameters.region || !activity1.value.parameters.cpuCount) return false
  }

  if (activity2.value.type === 'flight') {
    if (!activity2.value.parameters.origin || !activity2.value.parameters.destination) return false
  } else if (activity2.value.type === 'cpu') {
    if (!activity2.value.parameters.region || !activity2.value.parameters.cpuCount) return false
  }

  return true
})

// Methods
const compare = async () => {
  isLoading.value = true
  error.value = ''
  results.value = []

  try {
    const activities = [
      {
        name: activity1.value.name,
        type: activity1.value.type,
        parameters: { ...activity1.value.parameters }
      },
      {
        name: activity2.value.name,
        type: activity2.value.type,
        parameters: { ...activity2.value.parameters }
      }
    ]

    results.value = await compareActivitiesEmissions(activities)
    updateChart()
  } catch (err) {
    error.value = err.message || 'An error occurred while comparing emissions'
    console.error('Error comparing emissions:', err)
  } finally {
    isLoading.value = false
  }
}

// Ajoutez cette fonction pour déterminer la couleur en fonction de l'émission
const getEmissionColor = (value, maxValue) => {
  const ratio = value / maxValue
  if (ratio < 0.3) return 'rgba(34, 197, 94, 0.7)' // Vert
  if (ratio < 0.7) return 'rgba(234, 179, 8, 0.7)' // Orange
  return 'rgba(239, 68, 68, 0.7)' // Rouge
}

// Modifiez la fonction updateChart
const updateChart = () => {
  if (!chartCanvas.value) return

  if (chart.value) {
    chart.value.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  const maxEmission = Math.max(...results.value.map(r => r.co2e))

  chart.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: results.value.map(r => r.name),
      datasets: [{
        label: 'CO₂e Emissions',
        data: results.value.map(r => r.co2e),
        backgroundColor: results.value.map(r => getEmissionColor(r.co2e, maxEmission)),
        borderColor: results.value.map(r => getEmissionColor(r.co2e, maxEmission).replace('0.7', '1')),
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 60
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: 'easeOutQuart',
        onProgress: function(animation) {
          const progress = animation.currentStep / animation.numSteps
          const ctx = animation.chart.ctx
          const chartArea = animation.chart.chartArea
          
          // Animation de croissance des barres
          ctx.save()
          ctx.globalCompositeOperation = 'destination-over'
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top)
          ctx.restore()
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Emissions Comparison',
          font: {
            size: 20,
            weight: 'bold'
          },
          padding: {
            top: 20,
            bottom: 30
          }
        },
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 16,
          titleFont: {
            size: 16,
            weight: 'bold'
          },
          bodyFont: {
            size: 14
          },
          callbacks: {
            label: function(context) {
              const value = context.raw
              return `${value.toFixed(2)} kg CO₂e`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'CO₂e (kg)',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 20,
              bottom: 20
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 14
            },
            padding: 10
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: 10
          }
        }
      }
    }
  })
}

// Lifecycle
onMounted(async () => {
  try {
    cloudRegions.value.aws = await getCloudRegions('aws')
    cloudRegions.value.gcp = await getCloudRegions('gcp')
    cloudRegions.value.azure = await getCloudRegions('azure')

    // Set default regions
    if (cloudRegions.value.aws.length > 0) {
      activity1.value.parameters.region = cloudRegions.value.aws[0].id
      activity2.value.parameters.region = cloudRegions.value.aws[0].id
    }
  } catch (err) {
    console.error('Error loading cloud regions:', err)
  }
})

// Ajoutez ce watch après la définition de results
watch(results, () => {
  if (results.value.length > 0) {
    // Petit délai pour s'assurer que le canvas est monté
    setTimeout(() => {
      updateChart()
    }, 100)
  }
}, { deep: true })
</script>

<style scoped>
/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
}

/* Transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hover effects */
.group:hover .group-hover\:shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Focus styles */
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 