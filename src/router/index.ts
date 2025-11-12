import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';



// Importa Tabs
import Tabs from '@/views/Tabs.vue';



const routes: Array<RouteRecordRaw> = [
  {
        path: '/resena',
        name: 'resena',
        component: () => import('@/views/Cliente/Resenas.vue')
  },
  // Ruta Padre
    // Ruta de Login
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/Registro',
    name: 'Registro',
    component: () => import('@/views/Registro.vue')
  },
  {
    path: '/Tabs',
    component: Tabs,
    //rutas hijas
    children: [
      {
        path: '',
        redirect: 'inicio' // Si entran a "/", redirige a "/inicio"
      },
      {
        path: 'inicio',
        component: () => import('@/views/inicio.vue')
      },
      {
        path: 'agendar',
        component: () => import('@/views/Agendar.vue')
      },
      {
        path: 'servicios',
        component: () => import('@/views/Servicios.vue')
      },
      {
        path: 'horarios',
        component: () => import('@/views/Horarios.vue')
      },
      {
        path: 'cuenta',
        component: () => import('@/views/Cuenta.vue')
      },
      
    ]
  }
  

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;