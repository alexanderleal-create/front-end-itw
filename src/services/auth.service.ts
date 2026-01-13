import type { Router } from 'vue-router';
import { useAppStore } from '@/stores';

export const logout = async (router: Router) => {
    const store = useAppStore();

    localStorage.clear();
    sessionStorage.clear();

    store.setMainLayout('auth');

    await router.replace('/auth/boxed-signin');
};
