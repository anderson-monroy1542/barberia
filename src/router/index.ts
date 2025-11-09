import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';



// Importa Tabs
import Tabs from '@/views/Tabs.vue';


const routes: Array<RouteRecordRaw> = [
  // Ruta Padre
  {
    path: '/',
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
      }
      ,
      {
        path: 'citas',
        component: () => import('@/views/Citas.vue')
      }
    ]
  }
  
  // Aquí se ponen otras rutas que no lleven el menú
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;