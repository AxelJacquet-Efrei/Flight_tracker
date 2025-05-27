import { createRouter, createWebHistory } from 'vue-router'
import Auth from './components/Auth.vue'
import Home from './components/Home.vue'
import AuthCallback from './components/AuthCallback.vue'
import Calculator from './components/Calculator.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/auth', component: Auth },
  { path: '/auth/callback', component: AuthCallback },
  { path: '/calculator', component: Calculator },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 