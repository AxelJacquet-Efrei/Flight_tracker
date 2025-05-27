<template>
  <div class="relative">
    <!-- Background Elements -->
    <EcoBackground />
    <div class="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-green-200 opacity-20 blur-3xl"></div>
    <div class="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-green-300 opacity-20 blur-3xl"></div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center min-h-[80vh]">
      <div class="h-16 w-16 relative">
        <div class="absolute inset-0 rounded-full border-4 border-green-200 opacity-25"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-green-500 animate-spin"></div>
      </div>
    </div>

    <!-- Hero Section -->
    <div v-else class="relative z-10 flex min-h-[85vh] flex-col items-center justify-center py-12 text-center">
      <div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg">
      </div>

      <h1 class="mb-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl">
        Carbon Emissions Calculator
      </h1>

      <p class="mb-8 max-w-2xl text-xl text-muted-foreground">
        Calculate, track, and reduce your carbon footprint for a greener, more sustainable future.
      </p>

      <div class="flex flex-wrap gap-4 justify-center">
        <button
          v-if="!user"
          @click="$router.push('/auth')"
          class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-6 px-8 rounded-md transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          <span>Get Started</span>
        </button>
        <button
          v-else
          @click="$router.push('/calculator')"
          class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-6 px-8 rounded-md transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          <span>Go to Calculator</span>
        </button>
        <button
          @click="$router.push('/about')"
          class="border border-green-500 text-green-700 hover:bg-green-50 py-6 px-8 rounded-md transition-all"
        >
          Learn More
        </button>
      </div>

      <!-- Animated Illustrations -->
      <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div class="eco-card rounded-xl bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="flex justify-center mb-4">
          </div>
          <h3 class="mb-2 text-xl font-bold text-card-foreground">Reduce Carbon</h3>
          <p class="text-muted-foreground">
            Understand and reduce your carbon footprint with our detailed emissions calculator.
          </p>
        </div>

        <div class="eco-card rounded-xl bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="flex justify-center mb-4">
          </div>
          <h3 class="mb-2 text-xl font-bold text-card-foreground">Renewable Energy</h3>
          <p class="text-muted-foreground">
            Learn how switching to renewable energy sources can dramatically reduce emissions.
          </p>
        </div>

        <div class="eco-card rounded-xl bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="flex justify-center mb-4">
          </div>
          <h3 class="mb-2 text-xl font-bold text-card-foreground">Sustainable Growth</h3>
          <p class="text-muted-foreground">
            Track your progress over time and watch your positive environmental impact grow.
          </p>
        </div>

        <div class="eco-card rounded-xl bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div class="flex justify-center mb-4">
          </div>
          <h3 class="mb-2 text-xl font-bold text-card-foreground">Clean Technology</h3>
          <p class="text-muted-foreground">
            Discover how clean technologies can help you reduce your environmental impact.
          </p>
        </div>
      </div>

      <!-- Environmental Impact Statement -->
      <div class="mt-16 max-w-3xl rounded-xl bg-gradient-to-r from-green-50 to-green-100 p-6 border border-green-200">
        <p class="italic text-green-800">
          "Understanding your carbon footprint is the first step toward making meaningful changes for our planet's
          future."
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
    
    if (user.value) {
      router.push('/calculator')
    }
  } catch (error) {
    console.error('Error getting user:', error)
  } finally {
    loading.value = false
  }
  
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
    if (session?.user) {
      router.push('/calculator')
    }
  })
})
</script>

<style scoped>
.eco-card {
  backdrop-filter: blur(10px);
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.eco-card:hover {
  animation: float 2s ease-in-out infinite;
}
</style>