import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import * as auth from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guard
router.beforeEach((to, from, next) => {
  if (auth.isExpired()) {
    auth.logout()
    router.push('/login')
  }

  if (to.path === '/login') {
    // If accessing the login page and already logged in, redirect to home page
    if (auth.isLogin()) next({ path: '/' })
    else next()
  } else {
    if (!auth.isLogin()) {
      // If accessing non-login page and session information doesn't exist, meaning not logged in, redirect to login page
      next({ path: '/login' })
    }
    next()
  }
})

export default router
