import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores';
import dashboard from '@/views/dashboard.vue';
import login from '@/views/auth/boxed-signin.vue';

const routes = [
    // ================= PANEL PRINCIPAL =================
    {
        path: '/',
        redirect: '/dashboard',
        meta: { requiresAuth: true },
    },

    {
        path: '/dashboard',
        component: dashboard,
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    // ================= EMPLEADOS =================

    {
        path: '/users/employees',
        component: () => import('@/views/users/employees-table.vue'),
        meta: {
            requiresAuth: true,
            layout: 'app',
        },
    },

    /**
     * ALTA DE EMPLEADOS
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
        component: login,
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

    store.setMainLayout(to.meta?.layout === 'auth' ? 'auth' : 'app');

    if (to.path === '/auth/boxed-password-reset') {
        next();
        return;
    }

    if (to.meta?.requiresAuth && !token) {
        next('/auth/boxed-signin');
        return;
    }

    if (token && to.path === '/auth/boxed-signin') {
        next('/analytics');
        return;
    }

    next();
});

export default router;
