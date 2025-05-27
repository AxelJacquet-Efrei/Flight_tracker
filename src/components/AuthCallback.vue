<template>
    <div class="flex justify-center items-center min-h-[80vh]">
      <div class="text-center">
        <div class="h-16 w-16 mx-auto mb-4">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
        </div>
        <h2 class="text-xl font-semibold mb-2">Completing sign in...</h2>
        <p class="text-muted-foreground">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { supabase } from '../lib/supabase'
  
  const router = useRouter()
  const route = useRoute()
  
  onMounted(async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
        router.push('/auth?error=' + encodeURIComponent(error.message))
        return
      }
      
      if (data.session) {
        // Récupérer la route de redirection depuis les paramètres de l'URL
        const redirectTo = route.query.redirect || '/calculator'
        router.push(redirectTo)
      } else {
        router.push('/auth')
      }
    } catch (err) {
      console.error('Callback handling error:', err)
      router.push('/auth?error=' + encodeURIComponent('Authentication failed'))
    }
  })
  </script>
  