<template>
  <div>
    <nav
      class="sidebar fixed top-0 bottom-0 z-50 h-full
             shadow-[5px_0_25px_0_rgba(94,92,154,0.1)]
             transition-all duration-300
             !bg-white dark:!bg-[#2B2B2B]"
      :class="collapsed ? 'w-[80px]' : 'w-[260px]'"
    >
      <div class="h-full flex flex-col">

        <!-- HEADER -->
        <div class="flex items-center px-4 py-3 border-b !border-gray-200 dark:!border-[#404040]">
          <router-link to="/dashboard" class="flex items-center gap-2 overflow-hidden">
            <img 
          src="/assets/images/logo.png" 
          class="w-8 flex-none 
          dark:brightness-150 dark:contrast-125 
         dark:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]" 
        alt="ITW"
        />

            <span
              v-if="!collapsed"
              class="text-xl font-semibold !text-black dark:!text-white whitespace-nowrap transition-opacity duration-300"
            >
              ITW
            </span>
          </router-link>

          <button
            class="ml-auto w-8 h-8 rounded-full flex items-center justify-center
                   hover:!bg-gray-100 dark:hover:!bg-[#3A3A3A] transition-colors"
            @click="toggleCollapse"
          >
            <IconCaretsDown
              class="transition-transform !text-gray-600 dark:!text-gray-300"
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
                       !text-gray-700 dark:!text-[#E0E0E0]
                       hover:!bg-gray-100 dark:hover:!bg-[#3A3A3A] 
                       hover:!text-black dark:hover:!text-white
                       transition-colors"
                :class="{
                  '!bg-gray-100 dark:!bg-[#3A3A3A] !text-black dark:!text-white': 
                  $route.path === '/dashboard'
                }"
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
                       !text-gray-700 dark:!text-[#E0E0E0]
                       hover:!bg-gray-100 dark:hover:!bg-[#3A3A3A]
                       hover:!text-black dark:hover:!text-white
                       transition-colors"
                :class="{
                  '!bg-gray-100 dark:!bg-[#3A3A3A] !text-black dark:!text-white': 
                  employeesOpen
                }"
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
                  <router-link 
                    to="/users/create"
                    class="flex items-center gap-2 px-3 py-2 rounded-md
                           !text-gray-600 dark:!text-[#C0C0C0]
                           hover:!bg-gray-50 dark:hover:!bg-[#383838]
                           hover:!text-primary dark:hover:!text-primary
                           transition-colors
                           before:h-0.5 before:w-2 before:rounded 
                           before:!bg-gray-300 dark:before:!bg-[#666666] 
                           hover:before:!bg-primary"
                    :class="{
                      '!text-primary before:!bg-primary': 
                      $route.path === '/users/create'
                    }"
                  >
                    Alta de usuarios
                  </router-link>
                </li>

                <!-- TABLA -->
                <li>
                  <router-link
                    to="/users/employees"
                    class="flex items-center gap-2 px-3 py-2 rounded-md
                           !text-gray-600 dark:!text-[#C0C0C0]
                           hover:!bg-gray-50 dark:hover:!bg-[#383838]
                           hover:!text-primary dark:hover:!text-primary
                           transition-colors
                           before:h-0.5 before:w-2 before:rounded 
                           before:!bg-gray-300 dark:before:!bg-[#666666] 
                           hover:before:!bg-primary"
                    :class="{
                      '!text-primary before:!bg-primary': 
                      $route.path === '/users/employees'
                    }"
                  >
                    Tabla de Usuarios
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- RECUPERACIÓN DE CONTRASEÑAS -->
            <li>
              <router-link 
                to="/users/password-reset" 
                class="nav-link flex items-center gap-3 px-3 py-2 rounded-md
                       !text-gray-700 dark:!text-[#E0E0E0]
                       hover:!bg-gray-100 dark:hover:!bg-[#3A3A3A]
                       hover:!text-black dark:hover:!text-white
                       transition-colors"
                :class="{
                  '!bg-gray-100 dark:!bg-[#3A3A3A] !text-black dark:!text-white': 
                  $route.path === '/users/password-reset'
                }"
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
