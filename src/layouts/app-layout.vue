<template>
  <!-- BEGIN MAIN CONTAINER -->
  <div class="relative">

    <!-- Sidebar overlay -->
    <div
      class="fixed inset-0 bg-black/60 z-50 lg:hidden"
      :class="{ hidden: !store.sidebar }"
      @click="store.toggleSidebar()"
    ></div>

    <!-- Screen Loader -->
    <div
      v-show="store.isShowMainLoader"
      class="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated"
    >
      <svg width="64" height="64" viewBox="0 0 135 135" fill="#4361ee">
        <path
          d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z"
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
      </svg>
    </div>

    <!-- Back to top -->
    <div class="fixed bottom-6 ltr:right-6 rtl:left-6 z-50">
      <button
        v-if="showTopButton"
        class="btn btn-outline-primary rounded-full p-2 bg-[#fafafa] dark:bg-[#060818]"
        @click="goToTop"
      >
        ↑
      </button>
    </div>

    <!-- Settings -->
    <Setting />

    <!-- Layout -->
    <div
      class="main-container min-h-screen text-black dark:text-white-dark"
      :class="[store.navbar]"
    >
      <Sidebar />

      <div class="main-content flex flex-col min-h-screen">
        <Header />

        <div class="p-6 animation">
          <router-view></router-view>
        </div>

        <Footer />
      </div>
    </div>

<transition name="fade">
  <div
    v-if="auth.showAlertExpire"
    class="fixed inset-0 z-50 flex items-center justify-center px-4"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

    <!-- Modal -->
    <div
      class="relative z-10 w-full max-w-md
             rounded-2xl
             bg-white dark:bg-[#0e1726]
             shadow-2xl
             border border-gray-100 dark:border-white/10
             overflow-hidden"
    >
      <!-- Header -->
      <div
        class="px-6 py-4 flex items-center gap-3
               bg-gradient-to-r from-amber-500 to-orange-500
               text-white"
      >
        <span class="text-xl">⚠</span>
        <div class="flex flex-col">
          <span class="text-lg font-semibold leading-tight">
            Sesión a punto de expirar
          </span>
          <span class="text-xs opacity-90">
            Por motivos de seguridad
          </span>
        </div>
      </div>

      <div class="px-6 py-6 space-y-4 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Tu sesión se cerrará automáticamente si no realizas ninguna acción.
        </p>

        <div class="flex justify-center py-2">
          <div class="relative w-28 h-28">
            <svg class="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45"
                class="stroke-gray-200 dark:stroke-gray-700"
                stroke-width="8"
                fill="transparent"
              />

              <circle
                cx="50%"
                cy="50%"
                r="45"
                :class="progressColor"
                stroke-width="8"
                fill="transparent"
                stroke-linecap="round"
                :stroke-dasharray="circleDash.circumference"
                :stroke-dashoffset="circleDash.offset"
                class="transition-all duration-1000 ease-linear"
              />
            </svg>

            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span
                class="text-3xl font-bold tracking-tight"
                :class="
                  countdown <= 10
                    ? 'text-red-500 animate-pulse'
                    : 'text-gray-800 dark:text-white'
                "
              >
                {{ countdown }}
              </span>
              <span class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                segundos
              </span>
            </div>
          </div>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400">
          Puedes extender tu sesión para continuar trabajando sin interrupciones.
        </p>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-4 flex justify-end
               bg-gray-50 dark:bg-[#060818]
               border-t border-gray-100 dark:border-white/10"
      >
        <button
          v-if="auth.canRefresh"
          class="px-6 py-2.5 rounded-xl font-semibold text-white
                 bg-gradient-to-r from-indigo-500 to-blue-600
                 hover:from-blue-600 hover:to-indigo-500
                 transition-all duration-300
                 shadow-lg shadow-indigo-500/30
                 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          @click="() => {
            stopCountdown();
            auth.refreshToken();
          }"
        >
          Extender sesión
        </button>
      </div>
    </div>
  </div>
</transition>
    <!-- END MAIN CONTAINER -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';

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
const handleScroll = () => {
    showTopButton.value =
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50;
};

const countdown = ref(60);
let countdownInterval: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
    stopCountdown();
    countdown.value = 60;

    countdownInterval = setInterval(() => {
        countdown.value--;

        if (countdown.value <= 0) {
            stopCountdown();
            auth.forceLogout();
        }
    }, 1000);
};

const stopCountdown = () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
};

watch(
    () => auth.showAlertExpire,
    (visible) => {
        if (visible) startCountdown();
        else stopCountdown();
    }
);

watch(
    () => auth.tokenExpired,
    (expired) => {
        if (!expired) return;
        router.replace('/auth/boxed-signin');
    }
);

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    store.toggleMainLoader();

    if (localStorage.getItem('token_exp')) {
        auth.setupTokenExpirationWatcher();
    }
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    stopCountdown();
});


const TOTAL_TIME = 60;

const progress = computed(() => {
    return Math.max((countdown.value / TOTAL_TIME) * 100, 0);
});

const circleDash = computed(() => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    return {
        circumference,
        offset: circumference - (progress.value / 100) * circumference,
    };
});

const progressColor = computed(() => {
    if (countdown.value <= 10) return 'stroke-red-500';
    if (countdown.value <= 25) return 'stroke-yellow-400';
    return 'stroke-green-500';
});

const goToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};
</script>

