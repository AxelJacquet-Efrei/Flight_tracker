<script setup>
import { supabase } from './lib/supabase'
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'

const user = ref(null)

onMounted(() => {
  supabase.auth.getUser().then(({ data }) => {
    user.value = data.user
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <Header />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>