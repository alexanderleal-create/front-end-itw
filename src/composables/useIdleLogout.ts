import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '@/services/auth.service';

const IDLE_TIME = 500_000; // 1 minuto

export function useIdleLogout() {
    const router = useRouter();
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => logout(router), IDLE_TIME);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    onMounted(() => {
        events.forEach((e) => window.addEventListener(e, resetTimer));
        resetTimer();
    });

    onUnmounted(() => {
        events.forEach((e) => window.removeEventListener(e, resetTimer));
        clearTimeout(timer);
    });
}
