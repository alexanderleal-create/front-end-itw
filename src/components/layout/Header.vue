<template>
    <header class="z-40">
        <div class="shadow-sm">
            <div class="relative bg-white dark:bg-[#0e1726] flex items-center px-5 py-2.5">

                <div class="flex items-center gap-3">
                    <button
                        class="lg:hidden p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary"
                        @click="store.toggleSidebar()"
                    >
                        <IconMenu class="w-5 h-5" />
                    </button>

                    <router-link to="/dashboard" class="flex items-center">
                        <img src="/assets/images/logo.png" class="w-8" />
                        <span class="ml-2 text-xl font-semibold dark:text-white">
                            AUTOMATION ITW
                        </span>
                    </router-link>
                </div>

                <div class="ml-auto flex items-center gap-3">

                    <button
                        v-if="store.theme === 'light'"
                        @click="store.toggleTheme('dark')"
                        class="p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary"
                    >
                        <IconSun />
                    </button>

                    <button
                        v-else-if="store.theme === 'dark'"
                        @click="store.toggleTheme('system')"
                        class="p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary"
                    >
                        <IconMoon />
                    </button>

                    <button
                        v-else
                        @click="store.toggleTheme('light')"
                        class="p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary"
                    >
                        <IconLaptop />
                    </button>

                    <Popper placement="bottom-end" offsetDistance="8">
                        <button class="flex items-center gap-2">
                            <img
                                src="/assets/images/user-profile.jpeg"
                                class="w-9 h-9 rounded-full object-cover"
                            />
                        </button>

                        <template #content="{ close }">
                            <ul class="w-44 text-sm font-semibold dark:text-white-dark bg-white dark:bg-[#1b2e4b] rounded shadow">

                                <li class="border-t border-gray-200 dark:border-white/10">
                                    <button
                                        class="flex items-center px-4 py-2 text-danger w-full hover:bg-gray-100 dark:hover:bg-white/5"
                                        @click="handleLogout(close)"
                                    >
                                        <IconLogout class="w-4 h-4 mr-2 rotate-90" />
                                        Salir
                                    </button>
                                </li>

                            </ul>
                        </template>
                    </Popper>

                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores';
import api from '@/api/axios/axios';

import IconMenu from '@/components/icon/icon-menu.vue';
import IconSun from '@/components/icon/icon-sun.vue';
import IconMoon from '@/components/icon/icon-moon.vue';
import IconLaptop from '@/components/icon/icon-laptop.vue';
import IconLogout from '@/components/icon/icon-logout.vue';

const store = useAppStore();
const router = useRouter();

const handleLogout = async (close: Function) => {
    close();

    try {

        await api.post('/itwframe/logout/');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }

    sessionStorage.removeItem('user');
    localStorage.removeItem('token_exp');

    // Limpiar datos del frontend
    sessionStorage.removeItem('user');
    localStorage.removeItem('token_exp');

    // Cambiar layout a auth
    store.setMainLayout('auth');

    // Redirigir al login
    await router.replace('/auth/boxed-signin');
};
</script>
