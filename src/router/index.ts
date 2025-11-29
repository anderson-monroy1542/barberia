import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '@/views/Tabs.vue';
import User from '@/interface/User'; // Importamos la interfaz

const routes: Array<RouteRecordRaw> = [
  
  { path: '/', redirect: '/login' },

  // --- Rutas Públicas ---
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
  
  // --- Rutas Protegidas ---

  //roles: 1. Admin, 2. Barbero, 3. Cliente
  {
    // Ruta para la reseña
    path: '/resena/:id',
    name: 'resena',
    component: () => import('@/views/Cliente/Resenas.vue'),
    meta: { roles: [3] } 
  },
  {
    path: '/Tabs',
    component: Tabs,
    children: [
      // Ruta admin
      {
        path: 'gestioncitas', // pantalla inicial del Admin
        component: () => import('@/views/Admin/Citas.vue'),
        meta: { roles: [1] } // Solo Admin
      },
      {
      path: 'gestionresenas', 
      component: () => import('@/views/Admin/ResenasAdmin.vue'),
      meta: { roles: [1] }
      },
      
      
      {
        path: 'barberocitas', // pantalla inicial del Barbero
        component: () => import('@/views/Barbero/Citas.vue'),
        meta: { roles: [2] } 
      },
      // rutas pal cliente
      {
        path: 'inicio', // pantalla incial del Cliente
        component: () => import('@/views/inicio.vue'),
        meta: { roles: [3] } 
      },
      {
        path: 'agendar',
        component: () => import('@/views/Cliente/Agendar.vue'),
        meta: { roles: [3] } 
      },
      // pantallas pa todos
      {
        path: 'servicios',
        component: () => import('@/views/Servicios.vue'),
        meta: { roles: [1, 2, 3] }
      },
      {
        path: 'horarios',
        component: () => import('@/views/Horarios.vue'),
        meta: { roles: [1, 2, 3] }
      },
      {
        path: 'cuenta',
        component: () => import('@/views/Cuenta.vue'),
        meta: { roles: [1, 2, 3] } 
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// logica de navegacion por roles
router.beforeEach((to, from, next) => {
  
  //estas rutas no necesitan roles
  const publicPages = ['/login', '/registro'];
  const authRequired = !publicPages.includes(to.path.toLowerCase());

  // Revisando si el usuario ya está logueado
  const loggedIn = localStorage.getItem('user');
  
  let user: User | null = null;
  if (loggedIn) {
    try {
      user = JSON.parse(loggedIn) as User;
    } catch (e) {
      // Si hay un error en localStorage lo borro y lo mando al login
      localStorage.removeItem('user');
      return next('/login');
    }
  }

  // Logica de autorizacion segun el rol del usuario

  //si quiere ir a una ruta protegida pero no ha iniciado sesion
  if (authRequired && !user) {
    return next('/login');
  }

  //el usuario ha iniciado sesion pero quiere ir a una ruta publica
  if (!authRequired && user) {
    // se redirige al inicio de ese usuario segun su rol
    if (user.Id_rol === 1) return next('/Tabs/gestioncitas');
    if (user.Id_rol === 2) return next('/Tabs/barberocitas');
    if (user.Id_rol === 3) return next('/Tabs/inicio');
    return next('/Tabs/cuenta');
  }

  // el suario logueado y quiere ir a una ruta protegida
  if (authRequired && user) {
    // obtengo los roles permitidos en la ruta
    const requiredRoles = to.meta.roles as number[] | undefined;

    // Si la ruta define roles y el rol del usuario no está ahi
    if (requiredRoles && !requiredRoles.includes(user.Id_rol)) {
      
      // si no tiene permiso lo mandp  a su inicio segun el rol
      if (user.Id_rol === 1) return next('/Tabs/gestioncitas');
      if (user.Id_rol === 2) return next('/Tabs/barberocitas');
      if (user.Id_rol === 3) return next('/Tabs/inicio');
    
      return next('/login'); 
    }
  }

  // si no cumple ninguna regla lo dejo pasar
  next();
});


export default router;