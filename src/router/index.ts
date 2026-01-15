import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores';
import api from '@/api/axios/axios';

const routes = [
    {
        path: '/',
        redirect: '/auth/boxed-signin',
        meta: { requiresAuth: false },
    },

    {
        path: '/dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    {
        path: '/users/employees',
        component: () => import('@/views/users/employees-table.vue'),
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    {
        path: '/auth/boxed-signup',
        component: () => import('@/views/auth/boxed-signup.vue'),
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    {
        path: '/auth/cover-password-reset',
        component: () => import('@/views/auth/cover-password-reset.vue'),
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    {
        path: '/auth/boxed-signin',
        component: () => import('@/views/auth/boxed-signin.vue'),
        meta: { 
            layout: 'auth',
            requiresAuth: false 
        },
    },

    {
        path: '/auth/boxed-password-reset',
        component: () => import('@/views/auth/boxed-password-reset.vue'),
        meta: { 
            layout: 'auth',
            requiresAuth: false 
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const store = useAppStore();
    
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
        return;
    }

    next();
});

export default router;
