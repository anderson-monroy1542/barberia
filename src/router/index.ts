import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';


import Tabs from '@/views/Tabs.vue';

const routes: Array<RouteRecordRaw> = [
  

  //el login aparece primero
  {
    path: '/',
    redirect: '/login'
  },

  //rutas publicas sin el login
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
  
  // rutas que requieren login
  
  {

    path: '/resena/:id',
    name: 'resena',
    component: () => import('@/views/Cliente/Resenas.vue')
  },
  {
    // ruta padre
    path: '/Tabs',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: 'inicio' //aparece inicio por defecto
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

//funciones que aseguran que se esté logeado para cambiar

router.beforeEach((to, from, next) => {
  //las unicas que no llevan registro
  const publicPages = ['/login', '/Registro'];
  //se revisa si es publica
  const authRequired = !publicPages.includes(to.path);

  //se verifica si ya se inicio sesion
  const loggedIn = localStorage.getItem('user');

  //si quiere entrar a rutas protegidas
  if (authRequired && !loggedIn) {
    //lo mandamos al login
    return next('/login');
  }

  //no puede regresar al login si ya esta logueado
  if (!authRequired && loggedIn) {

    return next('/Tabs/inicio');
  }
  next();
});


export default router;