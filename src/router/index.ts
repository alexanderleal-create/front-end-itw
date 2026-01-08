import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores';

/**
 * layout: 'auth' → sin sidebar
 * layout: 'app'  → con sidebar
 */

const routes = [
    // ================= PANEL PRINCIPAL =================
    {
        path: '/',
        redirect: '/analytics',
        meta: { requiresAuth: true },
    },

    {
        path: '/analytics',
        component: () => import('@/views/analytics.vue'),
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    // ================= EMPLEADOS =================

    /**
     * 📋 TABLA DE EMPLEADOS
     * 👉 src/views/users/employees-table.vue
     * 👉 SE MUESTRA DENTRO DEL PANEL
     */
    {
        path: '/users/employees',
        component: () => import('@/views/users/employees-table.vue'),
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    /**
     * 👤 ALTA DE EMPLEADOS (INTERNA)
     */
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
        meta: { layout: 'auth' },
    },

    {
        path: '/auth/boxed-password-reset',
        component: () => import('@/views/auth/boxed-password-reset.vue'),
        meta: { layout: 'auth' },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    const store = useAppStore();
    const token = sessionStorage.getItem('token');

    // 🧱 Layout dinámico
    store.setMainLayout(to.meta?.layout === 'auth' ? 'auth' : 'app');

    // 🔓 Recuperación pública siempre permitida
    if (to.path === '/auth/boxed-password-reset') {
        next();
        return;
    }

    // 🔐 Rutas protegidas
    if (to.meta?.requiresAuth && !token) {
        next('/auth/boxed-signin');
        return;
    }

    // ⛔ Usuario logueado no vuelve al login
    if (token && to.path === '/auth/boxed-signin') {
        next('/analytics');
        return;
    }

    next();
});

export default router;
