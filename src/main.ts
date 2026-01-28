import { createApp } from 'vue';
import App from '@/App.vue';


const app = createApp(App);

// ============================
// 🔹 PINIA
// ============================
import { createPinia } from 'pinia';
const pinia = createPinia();
app.use(pinia);

// ============================
// 🔹 ROUTER
// ============================
import router from '@/router';
app.use(router);

// ============================
// 🔹 CSS PRINCIPAL
// ============================
import '@/assets/css/app.css';

// ============================
// 🔹 PERFECT SCROLLBAR
// ============================
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
app.use(PerfectScrollbarPlugin);

// ============================
// 🔹 VUE META / HEAD
// ============================
import { createHead } from '@vueuse/head';
const head = createHead();
app.use(head);

// ============================
// 🔹 APP SETTINGS
// ============================
import appSetting from '@/app-setting';
appSetting.init();

// ============================
// 🔹 I18N
// ============================
import i18n from '@/i18n';
app.use(i18n);

// ============================
// 🔹 TIPPY (TOOLTIPS)
// ============================
import { TippyPlugin } from 'tippy.vue';
app.use(TippyPlugin);

// ============================
// 🔹 INPUT MASK
// ============================
import { vMaska } from 'maska/vue';
app.directive('maska', vMaska);

// ============================
// 🔹 MARKDOWN EDITOR
// ============================
import VueEasymde from 'vue3-easymde';
import 'easymde/dist/easymde.min.css';
app.use(VueEasymde);

// ============================
// 🔹 POPPER
// ============================
import Popper from 'vue3-popper';
app.component('Popper', Popper);

// ============================
// 🔹 JSON TO EXCEL
// ============================
import vue3JsonExcel from 'vue3-json-excel';
app.use(vue3JsonExcel);

// ============================
// 🚀 MOUNT
// ============================
app.mount('#app');
