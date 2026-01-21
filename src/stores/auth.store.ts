import { defineStore } from 'pinia';
import api from '@/api/axios/axios';

// Timers no reactivos
let alertTimeout: ReturnType<typeof setTimeout> | null = null;
let expireTimeout: ReturnType<typeof setTimeout> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null as string | null,
        showAlertExpire: false,
        canRefresh: false,
        tokenExpired: false,
        timeRemaining: 0,
    }),

    getters: {
        // Tiempo restante formateado (ej: "0:45")
        getRemainingFormatted(): string {
            const mins = Math.floor(this.timeRemaining / 60);
            const secs = this.timeRemaining % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },
        
        // Porcentaje de progreso (0-100) basado en 60 segundos
        getProgressPercentage(): number {
            return Math.max(0, Math.min(100, (this.timeRemaining / 60) * 100));
        }
    },

    actions: {
        // REFRESH TOKEN
        async refreshToken() {
            try {
                const response = await api.post('/itwframe/token/refresh/');
                const newAccessToken = response.data.access;

                const decodedToken = JSON.parse(atob(newAccessToken.split('.')[1]));

                this.accessToken = newAccessToken;
                localStorage.setItem('token_exp', String(decodedToken.exp));

                this.showAlertExpire = false;
                this.canRefresh = false;
                this.tokenExpired = false;
                this.timeRemaining = 0;

                this.setupTokenExpirationWatcher();
            } catch (error) {
                this.handleTokenExpired();
            }
        },

        // ACTUALIZAR TIEMPO RESTANTE
        updateTimeRemaining() {
            const exp = localStorage.getItem('token_exp');
            if (!exp) {
                this.timeRemaining = 0;
                return;
            }

            const expMs = Number(exp) * 1000;
            const remainingMs = Math.max(0, expMs - Date.now());
            this.timeRemaining = Math.floor(remainingMs / 1000);
        },

        // WATCHER EXPIRACIÓN
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

            // Actualizar contador cada segundo
            countdownInterval = setInterval(() => {
                this.updateTimeRemaining();
                
                if (this.timeRemaining <= 0) {
                    clearInterval(countdownInterval!);
                }
            }, 1000);

            // Alerta 1 minuto (60000 ms) antes de expirar
            alertTimeout = setTimeout(
                () => {
                    this.showAlertExpire = true;
                    this.canRefresh = true;
                    this.updateTimeRemaining();
                },
                Math.max(remainingMs - 60000, 0),
            );

            expireTimeout = setTimeout(() => {
                this.handleTokenExpired();
            }, remainingMs);
        },

        // EXPIRACIÓN FINAL
        handleTokenExpired() {
            this.clearTimers();

            this.accessToken = null;
            localStorage.removeItem('token_exp');

            this.showAlertExpire = false;
            this.canRefresh = false;
            this.tokenExpired = true;
            this.timeRemaining = 0;
        },

        // LIMPIEZA TIMERS
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
