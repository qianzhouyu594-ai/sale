import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../components/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../components/Register.vue'),
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../components/MyPrompt.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../components/Dashboard.vue'),
    },
    {
      path: '/configlabel',
      name: 'configlabel',
      component: () => import('../components/Configlabel.vue'),
    },
    {
      path: '/manageaccount',
      name: 'manageaccount',
      component: () => import('../components/Manageaccount.vue'),
    },
    {
      path: '/script-config',
      name: 'scriptConfig',
      component: () => import('../components/Scriptconfig.vue'),
    },
    {
      path: '/create-account',
      name: 'createAccount',
      // @ts-ignore
      component: () => import('../components/CreateAccount.vue'),
    },
  ],
})

export default router
