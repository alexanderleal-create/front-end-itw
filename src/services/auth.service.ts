import type { Router } from 'vue-router';
import { useAppStore } from '@/stores';

export const logout = async (router: Router) => {
    const store = useAppStore();

    // 🔥 LIMPIAR TODO
    localStorage.clear();
    sessionStorage.clear();

    // 🔥 FORZAR LAYOUT AUTH
    store.setMainLayout('auth');

    // 🔥 REDIRECCIÓN LIMPIA
    await router.replace('/auth/boxed-signin');
};
