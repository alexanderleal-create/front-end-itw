<template>
    <div>
        <ul class="flex space-x-2 rtl:space-x-reverse">
            <li>
                <a href="javascript:;" class="text-primary hover:underline">Dashboard</a>
            </li> 
        </ul>
        
    </div>
</template>
<script lang="ts" setup>
    import { useAppStore } from '@/stores/index';
    import { useMeta } from '@/composables/use-meta';

    useMeta({ title: 'Dashboard' });
    const store = useAppStore();
</script>
