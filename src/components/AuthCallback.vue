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
  import { useRouter } from 'vue-router'
  import { supabase } from '../lib/supabase'
  
  const router = useRouter()
  
  onMounted(async () => {
    try {
      // Handle the OAuth callback
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
        router.push('/auth?error=' + encodeURIComponent(error.message))
        return
      }
      
      if (data.session) {
        // User is authenticated, redirect to dashboard/calculator
        router.push('/calculator')
      } else {
        // No session, redirect back to auth
        router.push('/auth')
      }
    } catch (err) {
      console.error('Callback handling error:', err)
      router.push('/auth?error=' + encodeURIComponent('Authentication failed'))
    }
  })
  </script>