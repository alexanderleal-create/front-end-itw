import { defineStore } from 'pinia';
import api from '@/api/axios/axios';

// Timers no reactivos
let alertTimeout: ReturnType<typeof setTimeout> | null = null;
let expireTimeout: ReturnType<typeof setTimeout> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null as string | null, // 👈 SOLO EN MEMORIA
        showAlertExpire: false,
        canRefresh: false,
        tokenExpired: false,
    }),

    actions: {
        // ==========================
        // REFRESH TOKEN
        // ==========================
        async refreshToken() {
            try {
                const response = await api.post('/itwframe/token/refresh/');
                const newAccessToken = response.data.access;

                const decodedToken = JSON.parse(atob(newAccessToken.split('.')[1]));

                // ✅ access token SOLO en memoria
                this.accessToken = newAccessToken;

                // ✅ solo expiración en localStorage
                localStorage.setItem('token_exp', String(decodedToken.exp));

                this.showAlertExpire = false;
                this.canRefresh = false;
                this.tokenExpired = false;

                this.setupTokenExpirationWatcher();
            } catch (error) {
                this.handleTokenExpired();
            }
        },

        // ==========================
        // WATCHER EXPIRACIÓN
        // ==========================
        setupTokenExpirationWatcher() {
            const exp = localStorage.getItem('token_exp');
            if (!exp) return;

            this.clearTimers();

            const expMs = Number(exp) * 1000;
            const remainingMs = expMs - Date.now();

            if (remainingMs <= 0) {
                this.handleTokenExpired();
                return;
            }

            countdownInterval = setInterval(() => {
                const left = expMs - Date.now();
                if (left <= 0) clearInterval(countdownInterval!);
            }, 60000);

            alertTimeout = setTimeout(
                () => {
                    this.showAlertExpire = true;
                    this.canRefresh = true;
                },
                Math.max(remainingMs - 60000, 0),
            );

            expireTimeout = setTimeout(() => {
                this.handleTokenExpired();
            }, remainingMs);
        },

        // ==========================
        // EXPIRACIÓN FINAL
        // ==========================
        handleTokenExpired() {
            this.clearTimers();

            // ❌ NO localStorage para access token
            this.accessToken = null;
            localStorage.removeItem('token_exp');

            this.showAlertExpire = false;
            this.canRefresh = false;
            this.tokenExpired = true;
        },

        // ==========================
        // LIMPIEZA TIMERS
        // ==========================
        clearTimers() {
            if (alertTimeout) clearTimeout(alertTimeout);
            if (expireTimeout) clearTimeout(expireTimeout);
            if (countdownInterval) clearInterval(countdownInterval);

            alertTimeout = null;
            expireTimeout = null;
            countdownInterval = null;
        },
    },
});
