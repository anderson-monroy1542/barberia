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
  {
    // Ruta para que un cliente (rol 3) deje una reseña
    path: '/resena/:id',
    name: 'resena',
    component: () => import('@/views/Cliente/Resenas.vue'),
    meta: { roles: [3] } // Solo Clientes
  },
  {
    path: '/Tabs',
    component: Tabs,
    children: [
      // --- Ruta Admin (Rol 1) ---
      {
        path: 'gestioncitas', // "Inicio" del Admin
        component: () => import('@/views/Admin/Citas.vue'),
        meta: { roles: [1] } // Solo Admin
      },
      // --- Ruta Barbero (Rol 2) ---
      {
        path: 'barberocitas', // "Inicio" del Barbero
        component: () => import('@/views/Barbero/Citas.vue'),
        meta: { roles: [2] } // Solo Barbero
      },
      // --- Rutas Cliente (Rol 3) ---
      {
        path: 'inicio', // "Inicio" del Cliente
        component: () => import('@/views/inicio.vue'),
        meta: { roles: [3] } // Solo Cliente
      },
      {
        path: 'agendar',
        component: () => import('@/views/Cliente/Agendar.vue'),
        meta: { roles: [3] } // Solo Cliente
      },
      // --- Rutas Generales (Todos los roles) ---
      {
        path: 'servicios',
        component: () => import('@/views/Servicios.vue'),
        meta: { roles: [1, 2, 3] } // Todos pueden ver
      },
      {
        path: '/horarios',
        component: () => import('@/views/Horarios.vue'),
        meta: { roles: [1, 2, 3] } // Todos pueden ver
      },
      {
        path: 'cuenta',
        component: () => import('@/views/Cuenta.vue'),
        meta: { roles: [1, 2, 3] } // Todos pueden ver
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// --- GUARDIA DE NAVEGACIÓN MEJORADO CON ROLES ---
router.beforeEach((to, from, next) => {
  
  // 1. Definimos las únicas rutas que NO necesitan login
  //    Usamos toLowerCase() para evitar errores de mayúsculas/minúsculas
  const publicPages = ['/login', '/registro'];
  const authRequired = !publicPages.includes(to.path.toLowerCase());

  // 2. Revisamos si el usuario ya inició sesión
  const loggedIn = localStorage.getItem('user');
  
  let user: User | null = null;
  if (loggedIn) {
    try {
      user = JSON.parse(loggedIn) as User;
    } catch (e) {
      // Si hay un error en localStorage, lo borramos y mandamos al login
      localStorage.removeItem('user');
      return next('/login');
    }
  }

  // --- Lógica de decisión ---

  // CASO 1: El usuario quiere ir a una RUTA PROTEGIDA
  //         PERO NO ha iniciado sesión (no hay 'user' en localStorage).
  if (authRequired && !user) {
    return next('/login');
  }

  // CASO 2: El usuario quiere ir a una RUTA PÚBLICA (Login/Registro)
  //         PERO YA ha iniciado sesión.
  if (!authRequired && user) {
    // Lo redirigimos a su "Inicio" correcto
    if (user.Id_rol === 1) return next('/Tabs/gestioncitas');
    if (user.Id_rol === 2) return next('/Tabs/barberocitas');
    if (user.Id_rol === 3) return next('/Tabs/inicio');
    // Fallback por si acaso
    return next('/Tabs/cuenta');
  }

  // CASO 3: (EL MÁS IMPORTANTE)
  // El usuario ESTÁ logueado y va a una RUTA PROTEGIDA.
  // Debemos CHEQUEAR SU ROL.
  if (authRequired && user) {
    // Obtenemos los roles que SÍ tienen permiso para esta ruta
    const requiredRoles = to.meta.roles as number[] | undefined;

    // Si la ruta define roles y el rol del usuario NO está incluido...
    if (requiredRoles && !requiredRoles.includes(user.Id_rol)) {
      
      // No tiene permiso. Lo mandamos a su "Inicio" por defecto.
      if (user.Id_rol === 1) return next('/Tabs/gestioncitas');
      if (user.Id_rol === 2) return next('/Tabs/barberocitas');
      if (user.Id_rol === 3) return next('/Tabs/inicio');
      
      // Fallback si su rol no tiene inicio (ej. rol 0)
      return next('/login'); 
    }
  }

  // CASO 4: Si ninguna regla lo detuvo, dejamos que pase.
  // (Ej: Usuario logueado yendo a una ruta que SÍ le pertenece)
  // (Ej: Usuario no logueado yendo a /login)
  next();
});


export default router;