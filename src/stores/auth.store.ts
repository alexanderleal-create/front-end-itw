import { defineStore } from 'pinia';
import api from '@/api/axios/axios';

// ==========================
// TIMERS NO REACTIVOS
// ==========================
let alertTimeout: ReturnType<typeof setTimeout> | null = null;
let expireTimeout: ReturnType<typeof setTimeout> | null = null;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null as string | null, // SOLO MEMORIA
        showAlertExpire: false,
        canRefresh: false,
        tokenExpired: false,
    }),

    actions: {
        // ==========================
        // SETUP WATCHER EXPIRACIÓN
        // ==========================
        setupTokenExpirationWatcher() {
            this.clearTimers();

            const exp = localStorage.getItem('token_exp');
            if (!exp) return;

            const expMs = Number(exp) * 1000;
            const now = Date.now();
            const remainingMs = expMs - now;

            if (remainingMs <= 0) {
                this.forceLogout();
                return;
            }

            alertTimeout = setTimeout(
                () => {
                    this.showAlertExpire = true;
                    this.canRefresh = true;
                },
                Math.max(remainingMs - 60_000, 0),
            );

            expireTimeout = setTimeout(() => {
                this.forceLogout();
            }, remainingMs);
        },

        // ==========================
        // REFRESH TOKEN
        // ==========================
        async refreshToken() {
            try {
                const response = await api.post('/itwframe/token/refresh/');
                const newAccessToken = response.data.access;

                const decoded = JSON.parse(atob(newAccessToken.split('.')[1]));

                this.accessToken = newAccessToken;
                localStorage.setItem('token_exp', decoded.exp.toString());


                this.showAlertExpire = false;
                this.canRefresh = false;
                this.tokenExpired = false;

                this.setupTokenExpirationWatcher();
            } catch (error) {
                this.forceLogout();
            }
        },

        async forceLogout() {
            this.clearTimers();

            try {
                await api.post('/itwframe/logout/');
            } catch (_) {
            }

            this.accessToken = null;
            localStorage.removeItem('token_exp');
            sessionStorage.clear();

            this.showAlertExpire = false;
            this.canRefresh = false;
            this.tokenExpired = true;
        },

        // ==========================
        // LIMPIEZA TIMERS
        // ==========================
        clearTimers() {
            if (alertTimeout) {
                clearTimeout(alertTimeout);
                alertTimeout = null;
            }

            if (expireTimeout) {
                clearTimeout(expireTimeout);
                expireTimeout = null;
            }
        },
    },
});
