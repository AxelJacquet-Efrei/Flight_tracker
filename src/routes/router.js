import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth.vue'
import Home from '../components/Home.vue'
import AuthCallback from '../components/AuthCallback.vue'
import Calculator from '../components/Calculator.vue'
import Comparison from '../components/Comparison.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/auth', component: Auth },
  { path: '/auth/callback', component: AuthCallback },
  { 
    path: '/calculator', 
    component: Calculator,
    meta: { requiresAuth: true }
  },
  {
    path: '/comparisons',
    component: Comparison,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error)
        next('/auth?redirect=' + encodeURIComponent(to.fullPath))
        return
      }
      
      if (!user) {
        next('/auth?redirect=' + encodeURIComponent(to.fullPath))
        return
      }
      
      next()
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error)
      next('/auth?redirect=' + encodeURIComponent(to.fullPath))
    }
  } else {
    next()
  }
})

export default router