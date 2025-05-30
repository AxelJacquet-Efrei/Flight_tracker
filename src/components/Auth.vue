<template>
  <div class="flex justify-center items-center min-h-[80vh] bg-background">
    <div class="w-full max-w-md rounded-xl shadow-lg p-8 bg-card text-card-foreground">
      <div class="mb-6 text-center">
        <h2 class="text-2xl font-bold mb-2">Sign In</h2>
        <p class="text-muted-foreground">Sign in to calculate and track your carbon emissions</p>
        <div v-if="redirectRoute" class="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
          You need to sign in to access this page
        </div>
      </div>
      
      <!-- Error message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {{ error }}
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="mb-4 text-center">
        <div class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
        <span class="ml-2 text-sm text-muted-foreground">Redirecting...</span>
      </div>
      
      <div class="space-y-4">
        <button
          class="w-full flex items-center justify-center gap-2 border border-input rounded-lg px-4 py-2 bg-background hover:bg-accent transition text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          @click="signInWithProvider('google')"
          :disabled="loading"
        >
          <!-- Google Icon -->
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
        
        <button
          class="w-full flex items-center justify-center gap-2 border border-input rounded-lg px-4 py-2 bg-background hover:bg-accent transition text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          @click="signInWithProvider('azure')"
          :disabled="loading"
        >
          <!-- Microsoft Icon -->
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#F25022" d="M1 1h10v10H1z"/>
            <path fill="#00A4EF" d="M13 1h10v10H13z"/>
            <path fill="#7FBA00" d="M1 13h10v10H1z"/>
            <path fill="#FFB900" d="M13 13h10v10H13z"/>
          </svg>
          <span>Sign in with Microsoft</span>
        </button>
      </div>
      
      <!-- Back to home link -->
      <div class="mt-6 text-center">
        <router-link 
          to="/" 
          class="text-sm text-green-600 hover:text-green-700 hover:underline"
        >
          ← Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const error = ref('')
const redirectRoute = ref('')

onMounted(() => {
  // Récupérer la route de redirection depuis les paramètres de l'URL
  redirectRoute.value = route.query.redirect || ''
  
  // Vérifier si l'utilisateur est déjà connecté
  checkCurrentUser()
  
  // Écouter les changements d'état d'authentification
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      // Utilisateur connecté, rediriger
      const targetRoute = redirectRoute.value || '/calculator'
      router.push(targetRoute)
    }
  })
})

async function checkCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Utilisateur déjà connecté, rediriger immédiatement
      const targetRoute = redirectRoute.value || '/calculator'
      router.push(targetRoute)
    }
  } catch (err) {
    console.error('Erreur lors de la vérification de l\'utilisateur:', err)
  }
}

const signInWithProvider = async (provider) => {
  try {
    loading.value = true
    error.value = ''
    
    // Construire l'URL de redirection avec la route de destination
    const redirectTo = redirectRoute.value 
      ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectRoute.value)}`
      : `${window.location.origin}/auth/callback`
    
    const { data, error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (authError) {
      throw authError
    }
    
  } catch (err) {
    console.error('Auth error:', err)
    error.value = err.message || 'An error occurred during authentication'
    loading.value = false
  }
}
</script>
