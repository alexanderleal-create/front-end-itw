import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores';
<<<<<<< HEAD
import api from '@/api/axios/axios';

const routes = [
    {
        path: '/',
        redirect: '/auth/boxed-signin',
        meta: { requiresAuth: false },
=======

import Dashboard from '@/views/dashboard.vue';
import Login from '@/views/auth/boxed-signin.vue';

const routes = [
    // ================= ROOT =================
    {
        path: '/',
        redirect: '/dashboard',
>>>>>>> e76c674 (Correcciones Cokies)
    },

    // ================= DASHBOARD =================
    {
        path: '/dashboard',
<<<<<<< HEAD
        component: () => import('@/views/dashboard.vue'),
=======
        name: 'dashboard',
        component: Dashboard,
>>>>>>> e76c674 (Correcciones Cokies)
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

<<<<<<< HEAD
=======
    // ================= REDIRECT LEGACY =================
    {
        path: '/analytics',
        redirect: '/dashboard',
    },

    // ================= USERS =================
>>>>>>> e76c674 (Correcciones Cokies)
    {
        path: '/users/employees',
        name: 'users-employees',
        component: () => import('@/views/users/employees-table.vue'),
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    {
        path: '/users/create',
        name: 'users-create',
        component: () => import('@/views/auth/boxed-signup.vue'),
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    {
        path: '/users/password-reset',
        name: 'users-password-reset',
        component: () => import('@/views/auth/cover-password-reset.vue'),
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    // ================= AUTH =================
    {
        path: '/auth/boxed-signin',
<<<<<<< HEAD
        component: () => import('@/views/auth/boxed-signin.vue'),
        meta: { 
            layout: 'auth',
            requiresAuth: false 
=======
        name: 'login',
        component: Login,
        meta: {
            layout: 'auth',
>>>>>>> e76c674 (Correcciones Cokies)
        },
    },

    {
        path: '/auth/boxed-password-reset',
        component: () => import('@/views/auth/boxed-password-reset.vue'),
<<<<<<< HEAD
        meta: { 
            layout: 'auth',
            requiresAuth: false 
=======
        meta: {
            layout: 'auth',
>>>>>>> e76c674 (Correcciones Cokies)
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const store = useAppStore();
<<<<<<< HEAD
    
    // Configurar layout
    const targetLayout = to.meta?.layout === 'auth' ? 'auth' : 'app';
    store.setMainLayout(targetLayout);

    // Rutas públicas
    const publicRoutes = ['/auth/boxed-signin', '/auth/boxed-password-reset'];
    
    if (publicRoutes.includes(to.path)) {
        // Si intenta ir al login pero ya está autenticado
        if (to.path === '/auth/boxed-signin') {
            try {
                //  Validar con el backend si tiene cookies válidas
                await api.get('protected/');
                // Ya está autenticado, redirigir al dashboard
                next('/dashboard');
                return;
            } catch {
                // No autenticado, permitir acceso al login
                next();
                return;
            }
        }
        
        next();
        return;
    }

    // Rutas protegidas
    if (to.meta?.requiresAuth) {
        try {
            // Llamar al endpoint protegido para validar autenticación
            await api.get('protected/');
            
            // Usuario autenticado, permitir acceso
            next();
        } catch (error) {
            // No autenticado o token expirado
            sessionStorage.removeItem('user');
            localStorage.removeItem('token_exp');
            store.setMainLayout('auth');
            next('/auth/boxed-signin');
        }
=======

    // Forzar layout
    store.setMainLayout(to.meta?.layout === 'auth' ? 'auth' : 'app');

    const tokenExp = localStorage.getItem('token_exp');

    // Rutas protegidas
    if (to.meta?.requiresAuth) {
        if (!tokenExp) {
            next('/auth/boxed-signin');
            return;
        }

        const expDate = new Date(tokenExp);
        const now = new Date();

        if (now > expDate) {
            localStorage.removeItem('token_exp');
            next('/auth/boxed-signin');
            return;
        }
    }

    // Evitar volver al login si ya está logueado
    if (tokenExp && to.path === '/auth/boxed-signin') {
        next('/dashboard');
>>>>>>> e76c674 (Correcciones Cokies)
        return;
    }

    next();
});

export default router;
