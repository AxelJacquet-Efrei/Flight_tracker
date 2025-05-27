<template>
    <header class="relative z-10 border-b border-green-200 bg-white/80 backdrop-blur-md">
      <div class="absolute inset-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-2 text-xl font-bold">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md">
              <!-- Leaf icon SVG -->
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 21C6.614 17.308 11.038 14.36 16.553 13.176A9.008 9.008 0 0 1 3 12c0-4.418 3.582-8 8-8s8 3.582 8 8c0 5.627-4.373 9-10 9-.684 0-1.352-.05-2-.143z"/>
              </svg>
            </div>
            <span class="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">EcoCalc</span>
          </router-link>
  
          <!-- Desktop Navigation -->
          <nav class="hidden items-center gap-6 md:flex">
            <router-link
              to="/calculator"
              class="relative font-medium text-gray-700 transition-colors hover:text-green-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-500 after:transition-all hover:after:w-full"
            >Calculator</router-link>
            <router-link
              to="/comparisons"
              class="relative font-medium text-gray-700 transition-colors hover:text-green-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-500 after:transition-all hover:after:w-full"
            >Comparisons</router-link>
            <router-link
              to="/favorites"
              class="relative font-medium text-gray-700 transition-colors hover:text-green-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-500 after:transition-all hover:after:w-full"
            >Favorites</router-link>
  
            <template v-if="loading">
              <button disabled class="h-9 w-9 rounded-full p-0 flex items-center justify-center">
                <div class="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
              </button>
            </template>
            <template v-else>
              <!-- User Menu for Desktop -->
              <div v-if="user" class="relative">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center gap-2 rounded-full bg-green-50 p-2 hover:bg-green-100 transition-colors"
                >
                  <div class="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-medium">
                    {{ getUserInitials(user) }}
                  </div>
                  <span class="hidden sm:block font-medium text-gray-700">{{ getUserName(user) }}</span>
                  <svg class="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <!-- Dropdown Menu -->
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                  @click.stop
                >
                  <div class="py-1">
                    <div class="px-4 py-2 text-sm text-gray-700 border-b">
                      <div class="font-medium">{{ getUserName(user) }}</div>
                      <div class="text-gray-500">{{ user.email }}</div>
                    </div>
                    <button
                      @click="signOut"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
              <button
                v-else
                @click="signIn"
                class="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 px-4 py-2 rounded font-medium"
              >
                Sign In
              </button>
            </template>
          </nav>
  
          <!-- Mobile Menu Button -->
          <button
            class="flex h-10 w-10 items-center justify-center rounded-md text-gray-700 md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <span v-if="mobileMenuOpen">
              <!-- X icon SVG -->
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </span>
            <span v-else>
              <!-- Menu icon SVG -->
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16"/>
              </svg>
            </span>
          </button>
        </div>
  
        <!-- Mobile Navigation -->
        <nav v-if="mobileMenuOpen" class="mt-4 flex flex-col space-y-4 pb-4 md:hidden">
          <router-link
            to="/calculator"
            class="rounded-md px-4 py-2 font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
            @click="mobileMenuOpen = false"
          >Calculator</router-link>
          <router-link
            to="/comparisons"
            class="rounded-md px-4 py-2 font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
            @click="mobileMenuOpen = false"
          >Comparisons</router-link>
          <router-link
            to="/favorites"
            class="rounded-md px-4 py-2 font-medium text-gray-700 hover:bg-green-50 hover:text-green-600"
            @click="mobileMenuOpen = false"
          >Favorites</router-link>
          
          <template v-if="loading">
            <div class="flex h-10 items-center px-4">
              <div class="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
            </div>
          </template>
          <template v-else>
            <div
              v-if="user"
              class="flex items-center justify-between rounded-md px-4 py-2 bg-green-50"
            >
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-medium">
                  {{ getUserInitials(user) }}
                </div>
                <div>
                  <div class="font-medium text-gray-700">{{ getUserName(user) }}</div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </div>
              </div>
              <button
                @click="signOut"
                class="text-sm text-red-600 hover:bg-red-50 hover:text-red-700 px-2 py-1 rounded"
              >
                Sign Out
              </button>
            </div>
            <button
              v-else
              @click="signIn"
              class="mx-4 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 px-4 py-2 rounded font-medium"
            >
              Sign In
            </button>
          </template>
        </nav>
      </div>
  
      <!-- Overlay pour fermer le menu utilisateur -->
      <div
        v-if="showUserMenu"
        class="fixed inset-0 z-40"
        @click="showUserMenu = false"
      ></div>
    </header>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { supabase } from '../lib/supabase'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const user = ref(null)
  const loading = ref(true)
  const mobileMenuOpen = ref(false)
  const showUserMenu = ref(false)
  
  // Helper functions
  const getUserName = (user) => {
    return user?.user_metadata?.full_name || 
           user?.user_metadata?.name || 
           user?.email?.split('@')[0] || 
           'User'
  }
  
  const getUserInitials = (user) => {
    const name = getUserName(user)
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }
  
  const signIn = () => {
    router.push('/auth')
  }
  
  const signOut = async () => {
    try {
      loading.value = true
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      user.value = null
      showUserMenu.value = false
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      loading.value = false
    }
  }
  
  // Close mobile menu on route change
  const closeMenus = () => {
    mobileMenuOpen.value = false
    showUserMenu.value = false
  }
  
  onMounted(async () => {
    try {
      const { data } = await supabase.auth.getUser()
      user.value = data.user
    } catch (error) {
      console.error('Error getting user:', error)
    } finally {
      loading.value = false
    }
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      loading.value = false
    })
  
    // Cleanup subscription on unmount
    onUnmounted(() => {
      subscription?.unsubscribe()
    })
  })
  
  // Close menus when clicking outside or on route change
  router.afterEach(closeMenus)
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