<template>
    <header class="z-40">
        <div class="shadow-sm">
            <div class="relative !bg-white dark:!bg-[#2B2B2B] flex items-center px-5 py-2.5 transition-colors duration-300">

                <div class="flex items-center gap-3">
                    <button
                        class="lg:hidden p-2 rounded-full !bg-gray-100 dark:!bg-[#3A3A3A] hover:!text-primary transition-colors"
                        @click="store.toggleSidebar()"
                    >
                        <IconMenu class="w-5 h-5 !text-gray-700 dark:!text-gray-300" />
                    </button>

                    <router-link to="/dashboard" class="flex items-center">
                <img 
                src="/assets/images/logo.png" 
                class="w-8 
                dark:brightness-150 dark:contrast-125 
                dark:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]" 
                alt="ITW Logo"
                />
                        <span class="ml-2 text-xl font-semibold !text-black dark:!text-white">
                            AUTOMATION ITW
                        </span>
                    </router-link>
                </div>

                <div class="ml-auto flex items-center gap-3">

                    <!-- Theme Toggle -->
                    <button
                        v-if="store.theme === 'light'"
                        @click="store.toggleTheme('dark')"
                        class="p-2 rounded-full !bg-gray-100 dark:!bg-[#3A3A3A] hover:!text-primary transition-colors"
                    >
                        <IconSun class="!text-gray-700 dark:!text-yellow-400" />
                    </button>

                    <button
                        v-else-if="store.theme === 'dark'"
                        @click="store.toggleTheme('system')"
                        class="p-2 rounded-full !bg-gray-100 dark:!bg-[#3A3A3A] hover:!text-primary transition-colors"
                    >
                        <IconMoon class="!text-gray-700 dark:!text-blue-400" />
                    </button>

                    <button
                        v-else
                        @click="store.toggleTheme('light')"
                        class="p-2 rounded-full !bg-gray-100 dark:!bg-[#3A3A3A] hover:!text-primary transition-colors"
                    >
                        <IconLaptop class="!text-gray-700 dark:!text-gray-300" />
                    </button>

                    <!-- User Profile Dropdown -->
                    <Popper placement="bottom-end" offsetDistance="8">
                        <button class="flex items-center gap-2">
                            <img
                                src="/assets/images/user-profile.jpeg"
                                class="w-9 h-9 rounded-full object-cover ring-2 !ring-gray-200 dark:!ring-[#404040]"
                                alt="User Profile"
                            />
                        </button>

                        <template #content="{ close }">
                            <ul class="w-44 text-sm font-semibold !text-gray-700 dark:!text-white !bg-white dark:!bg-[#323232] rounded shadow-lg">

                                <li class="border-t !border-gray-200 dark:!border-[#404040]">
                                    <button
                                        class="flex items-center px-4 py-2 !text-danger w-full hover:!bg-gray-100 dark:hover:!bg-[#3D3D3D] transition-colors"
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

    // Limpiar datos del frontend
    sessionStorage.removeItem('user');
    localStorage.removeItem('token_exp');

    // Cambiar layout a auth
    store.setMainLayout('auth');

    // Redirigir al login
    await router.replace('/auth/boxed-signin');
};
</script>
