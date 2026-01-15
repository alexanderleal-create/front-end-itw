import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores';

import Dashboard from '@/views/dashboard.vue';
import Login from '@/views/auth/boxed-signin.vue';

const routes = [
    // ================= ROOT =================
    {
        path: '/',
        redirect: '/dashboard',
    },

    // ================= DASHBOARD =================
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    // ================= REDIRECT LEGACY =================
    {
        path: '/analytics',
        redirect: '/dashboard',
    },

    // ================= USERS =================
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
        name: 'login',
        component: Login,
        meta: {
            layout: 'auth',
        },
    },

    {
        path: '/auth/boxed-password-reset',
        component: () => import('@/views/auth/boxed-password-reset.vue'),
        meta: {
            layout: 'auth',
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const store = useAppStore();

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
        return;
    }

    next();
});

export default router;
