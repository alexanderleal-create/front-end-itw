<template>
    <div
        class="main-section antialiased relative font-nunito text-sm font-normal"
        :class="[store.sidebar ? 'toggle-sidebar' : '', store.menu, store.layout, store.rtlClass]"
    >
        
        <component :is="mainLayout" :key="store.mainLayout"></component>
    </div>
</template>

<script lang="ts" setup>
<<<<<<< HEAD
    import { computed, watch } from 'vue';
=======
import { computed } from 'vue';
>>>>>>> e76c674 (Correcciones Cokies)

import appLayout from '@/layouts/app-layout.vue';
import authLayout from '@/layouts/auth-layout.vue';

import { useAppStore } from '@/stores/index';
import { useMeta } from '@/composables/use-meta';

<<<<<<< HEAD
    const store = useAppStore();

    // ✅ Solo activar idle logout cuando esté en layout 'app'
    watch(
        () => store.mainLayout,
        (newLayout) => {
            if (newLayout === 'app') {
                useIdleLogout();
            }
        },
        { immediate: true }
    );

    useMeta({ title: 'Sales Admin' });
=======
const store = useAppStore();

// meta
useMeta({ title: 'Front-end' });
>>>>>>> e76c674 (Correcciones Cokies)

const mainLayout = computed(() => {
    return store.mainLayout === 'auth' ? authLayout : appLayout;
});
</script>
