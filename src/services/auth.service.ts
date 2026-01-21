import type { Router } from 'vue-router';
import { useAppStore } from '@/stores';
import api from '@/api/axios/axios';

export const logout = async (router: Router) => {
    const store = useAppStore();

    localStorage.clear();
    sessionStorage.clear();

    store.setMainLayout('auth');

    await router.replace('/auth/boxed-signin');
};

export const refreshTokenRequest = async () => {
    const response = await api.get('login/token/refresh/');
    return response.data;
};
