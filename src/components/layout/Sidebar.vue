<template>
  <div :class="{ 'dark text-white-dark': store.semidark }">
    <nav
      class="sidebar fixed top-0 bottom-0 z-50 h-full
             shadow-[5px_0_25px_0_rgba(94,92,154,0.1)]
             transition-all duration-300"
      :class="collapsed ? 'w-[80px]' : 'w-[260px]'"
    >
      <div class="bg-white dark:bg-[#0e1726] h-full flex flex-col">

        <!-- HEADER -->
        <div class="flex items-center px-4 py-3">
          <router-link to="/dashboard" class="flex items-center gap-2 overflow-hidden">
            <img src="/assets/images/logo.png" class="w-8 flex-none" />

            <span
              v-if="!collapsed"
              class="text-xl font-semibold dark:text-white-light whitespace-nowrap"
            >
              ITW
            </span>
          </router-link>

          <button
            class="ml-auto w-8 h-8 rounded-full flex items-center justify-center
                   hover:bg-gray-500/10 dark:hover:bg-dark-light/10"
            @click="toggleCollapse"
          >
            <IconCaretsDown
              class="transition-transform"
              :class="{ 'rotate-180': collapsed }"
            />
          </button>
        </div>

        <!-- MENU -->
        <perfect-scrollbar class="flex-1">
          <ul class="p-3 space-y-1 font-semibold">

            <!-- PANEL PRINCIPAL -->
            <li>
              <router-link
                to="/dashboard"
                class="nav-link flex items-center gap-3 px-3 py-2 rounded-md
                       hover:bg-gray-100 dark:hover:bg-[#1a233a]"
              >
                <IconMenuDashboard class="shrink-0" />
                <span v-if="!collapsed">Panel principal</span>
              </router-link>
            </li>
            <!-- SUBMENÚ EMPLEADOS -->
            <li>
              <button
                type="button"
                class="nav-link w-full flex items-center gap-3 px-3 py-2 rounded-md
                      hover:bg-gray-100 dark:hover:bg-[#1a233a]"
                @click="toggleEmployees"
              >
                <IconMenuUsers class="shrink-0" />

                <span v-if="!collapsed" class="flex-1 text-left">
                  Usuarios
                </span>

                <IconCaretsDown
                  v-if="!collapsed"
                  class="transition-transform"
                  :class="{ 'rotate-180': employeesOpen }"
                />
              </button>

              <!-- SUB OPCIONES -->
              <ul
                v-if="employeesOpen && !collapsed"
                class="ml-8 mt-1 space-y-1 text-sm"
              >
                <!-- ALTA -->
                <li>
                 <router-link to="/users/create"
                    class="block px-3 py-2 rounded-md
                          hover:bg-gray-100 dark:hover:bg-[#1a233a]"
                  >
                    Alta de usuarios
                  </router-link>
                </li>

                <!-- TABLA -->
                <li>
                  <router-link
                    to="/users/employees"
                    class="block px-3 py-2 rounded-md
                          hover:bg-gray-100 dark:hover:bg-[#1a233a]"
                  >
                    Tabla de Usuarios
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- RECUPERACIÓN DE CONTRASEÑAS -->
            <li>
              <router-link to="/users/password-reset" 
                class="nav-link flex items-center gap-3 px-3 py-2 rounded-md
                      hover:bg-gray-100 dark:hover:bg-[#1a233a]"
              >
                <IconMenuLock class="shrink-0" />
                <span v-if="!collapsed">Recuperación de contraseña</span>
              </router-link>
            </li>

          </ul>
        </perfect-scrollbar>
      </div>
    </nav>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '@/stores';

import IconCaretsDown from '@/components/icon/icon-carets-down.vue';
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard.vue';
import IconMenuUsers from '@/components/icon/menu/icon-menu-users.vue';
import IconMenuLock from '@/components/icon/menu/icon-menu-authentication.vue';

const store = useAppStore();

const collapsed = ref(false);
const employeesOpen = ref(false);

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
  employeesOpen.value = false;
};

const toggleEmployees = () => {
  if (!collapsed.value) {
    employeesOpen.value = !employeesOpen.value;
  }
};
</script>
