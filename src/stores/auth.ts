import { defineStore } from 'pinia';
import router from '@/router';


export const useAuthStore = defineStore('auth', {
    state: () => ({
        showAlertExpire: false,
        canRefresh: false,
        tokenTimer: null as any,
    }),

    actions: {
        /* ===============================
       WATCHER EXPIRACIÓN TOKEN
    =============================== */
        setupTokenExpirationWatcher() {
            const exp = localStorage.getItem('token_exp');
            if (!exp) return;

            const expTime = Number(exp) * 1000;
            const now = Date.now();
            const timeLeft = expTime - now;
            const refreshTime = timeLeft - 60_000;

            if (refreshTime <= 0) {
                this.refreshToken();
                return;
            }

            if (this.tokenTimer) clearTimeout(this.tokenTimer);

            this.tokenTimer = setTimeout(() => {
                this.showAlertExpire = true;
                this.canRefresh = true;
                this.refreshToken();
            }, refreshTime);
        },

        /* ===============================
       REFRESH TOKEN
    =============================== */
        async refreshToken() {
            try {
                const response = await api.post('login/token/refresh/');
                const newAccessToken = response.data.access;

                localStorage.setItem('access_token', newAccessToken);

                const decoded = JSON.parse(atob(newAccessToken.split('.')[1]));
                localStorage.setItem('token_exp', decoded.exp);

                this.showAlertExpire = false;
                this.canRefresh = false;

                this.setupTokenExpirationWatcher();
            } catch (error) {
                console.error('Refresh token inválido', error);
                this.logout();
            }
        },


        logout() {
            localStorage.clear();
            router.replace('/index');
        },
    },
});
