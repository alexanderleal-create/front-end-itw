<template>
    <!--  BEGIN MAIN CONTAINER  -->
    <div class="relative">

        <!-- sidebar menu overlay -->
        <div
            class="fixed inset-0 bg-[black]/60 z-50 lg:hidden"
            :class="{ hidden: !store.sidebar }"
            @click="store.toggleSidebar()"
        ></div>

        <!-- screen loader -->
        <div
            v-show="store.isShowMainLoader"
            class="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated"
        >
            <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                <path
                    d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 67 67"
                        to="-360 67 67"
                        dur="2.5s"
                        repeatCount="indefinite"
                    />
                </path>
                <path
                    d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 67 67"
                        to="360 67 67"
                        dur="8s"
                        repeatCount="indefinite"
                    />
                </path>
            </svg>
        </div>

        <!-- BEGIN APP SETTING LAUNCHER -->
        <Setting />
        <!-- END APP SETTING LAUNCHER -->

        <div class="main-container text-black dark:text-white-dark min-h-screen" :class="[store.navbar]">

            <!--  BEGIN SIDEBAR  -->
            <Sidebar />
            <!--  END SIDEBAR  -->

            <div class="main-content flex flex-col min-h-screen">

                <!--  BEGIN TOP NAVBAR  -->
                <Header />
                <!--  END TOP NAVBAR  -->

                <!--  BEGIN CONTENT AREA  -->
                <div class="p-6 animation">
                    <router-view />
                </div>
                <!--  END CONTENT AREA  -->

                <!-- BEGIN FOOTER -->
                <Footer />
                <!-- END FOOTER -->

            </div>
        </div>
    </div>

<v-dialog
    v-model="auth.showAlertExpire"
    max-width="480"
    persistent
    transition="dialog-bottom-transition"
>
    <v-card class="rounded-xl overflow-hidden">

        <!-- HEADER -->
        <v-card-title
            class="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
        >
            <v-icon size="28">mdi-alert-circle-outline</v-icon>
            <span class="text-lg font-semibold">
                Sesión por expirar
            </span>
        </v-card-title>

        <!-- BODY -->
        <v-card-text class="px-6 py-6 text-gray-700 dark:text-gray-300">
            <p class="text-base leading-relaxed">
                Tu sesión está a punto de expirar por seguridad.
            </p>

            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Si no extiendes la sesión, serás redirigido al inicio de sesión automáticamente.
            </p>
        </v-card-text>

        <!-- ACTIONS -->
        <v-card-actions class="px-6 py-4 bg-gray-50 dark:bg-[#0e1726]">
            <v-spacer />

            <v-btn
                v-if="auth.canRefresh"
                color="primary"
                variant="flat"
                class="px-6 font-semibold"
                @click="auth.refreshToken"
            >
                <v-icon start>mdi-refresh</v-icon>
                Extender sesión
            </v-btn>
        </v-card-actions>

    </v-card>
</v-dialog>

</template>



<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import Sidebar from '@/components/layout/Sidebar.vue';
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import Setting from '@/components/ThemeCustomizer.vue';

import appSetting from '@/app-setting';
import { useAppStore } from '@/stores/index';
import { useAuthStore } from '@/stores/auth.store';

const store = useAppStore();
const auth = useAuthStore();
const router = useRouter();

const showTopButton = ref(false);

// ==========================
// SCROLL HANDLER
// ==========================
const handleScroll = () => {
    showTopButton.value =
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50;
};

// ==========================
// MOUNT
// ==========================
onMounted(() => {
    window.addEventListener('scroll', handleScroll);

    const eleanimation = document.querySelector('.animation');
    eleanimation?.addEventListener('animationend', () => {
        appSetting.changeAnimation('remove');
    });

    store.toggleMainLoader();

    // ⚠️ Solo si hay token
    if (localStorage.getItem('token_exp')) {
        auth.setupTokenExpirationWatcher();
    }
});

// ==========================
// UNMOUNT
// ==========================
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

// ==========================
// WATCH → TOKEN EXPIRADO
// ==========================
watch(
    () => auth.tokenExpired,
    (expired) => {
        if (!expired) return;

        console.warn('⛔ Sesión expirada → redirección a login');


        router.replace('/auth/boxed-signin');
    }
);

// ==========================
// GO TOP
// ==========================
const goToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};
</script>
