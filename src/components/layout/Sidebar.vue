<template>
  <nav
    class="sidebar fixed top-0 bottom-0 z-50 h-full
           transition-all duration-300
           shadow-[5px_0_25px_0_rgba(94,92,154,0.1)]"
    :class="collapsed ? 'w-[80px]' : 'w-[260px]'"
  >
    <div
      class="h-full flex flex-col
             bg-white dark:bg-[#0e1726]
             text-black dark:text-white-dark
             transition-colors duration-300"
    >

      <!-- HEADER -->
      <div class="flex items-center px-4 py-3">
        <router-link
          to="/dashboard"
          class="flex items-center gap-2 overflow-hidden"
        >
          <img src="/assets/images/logo.png" class="w-8 flex-none" />

          <span
            v-if="!collapsed"
            class="text-xl font-semibold whitespace-nowrap"
          >
            ITW
          </span>
        </router-link>

        <button
          class="ml-auto w-8 h-8 rounded-full flex items-center justify-center
                 hover:bg-gray-200 dark:hover:bg-white/10
                 transition-colors"
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

          <!-- DASHBOARD -->
          <li>
            <router-link
              to="/dashboard"
              class="flex items-center gap-3 px-3 py-2 rounded-md
                     hover:bg-gray-100 dark:hover:bg-[#1a233a]
                     transition-colors"
            >
              <IconMenuDashboard />
              <span v-if="!collapsed">Panel principal</span>
            </router-link>
          </li>

          <!-- ================= USUARIOS ================= -->
          <li v-if="!isTester">
            <button
              class="w-full flex items-center gap-3 px-3 py-2 rounded-md
                     hover:bg-gray-100 dark:hover:bg-[#1a233a]"
              @click="toggleEmployees"
            >
              <IconMenuUsers />
              <span v-if="!collapsed" class="flex-1 text-left">
                Usuarios
              </span>

              <IconCaretsDown
                v-if="!collapsed"
                :class="{ 'rotate-180': employeesOpen }"
              />
            </button>

            <ul
              v-if="employeesOpen && !collapsed"
              class="ml-8 mt-1 space-y-1 text-sm"
            >

              <!-- ALTA USUARIO -->
              <li v-if="isSuperUser || isAdmin">
                <router-link
                  to="/users/create"
                  class="block px-3 py-2 rounded-md
                         hover:bg-gray-100 dark:hover:bg-[#1a233a]"
                >
                  Alta de usuarios
                </router-link>
              </li>

              <!-- TABLA USUARIOS -->
              <li>
                <router-link
                  to="/users/employees"
                  class="block px-3 py-2 rounded-md
                         hover:bg-gray-100 dark:hover:bg-[#1a233a]"
                >
                  Tabla de usuarios
                </router-link>
              </li>

              <!-- ROLES -->
              <li v-if="isSuperUser || isAdmin">
                <router-link
                  to="/users/roles"
                  class="block px-3 py-2 rounded-md
                         hover:bg-gray-100 dark:hover:bg-[#1a233a]"
                >
                  Roles y permisos
                </router-link>
              </li>

            </ul>
          </li>

          <li v-if="!isTester">
            <button
              class="w-full flex items-center gap-3 px-3 py-2 rounded-md
                     hover:bg-gray-100 dark:hover:bg-[#1a233a]"
              @click="toggleProjects"
            >
              <IconMenuScrumboard />

              <span v-if="!collapsed" class="flex-1 text-left">
                Proyectos
              </span>

              <IconCaretsDown
                v-if="!collapsed"
                :class="{ 'rotate-180': projectsOpen }"
              />
            </button>

            <ul
              v-if="projectsOpen && !collapsed"
              class="ml-8 mt-1 space-y-1 text-sm"
            >

              <!-- TABLA PROYECTOS -->
              <li>
                <router-link
                  to="/project"
                  class="block px-3 py-2 rounded-md
                         hover:bg-gray-100 dark:hover:bg-[#1a233a]"
                >
                  Tabla de proyectos
                </router-link>
              </li>

              <!-- CREAR PROYECTO -->
              <li v-if="isSuperUser || isAdmin">
                <router-link
                  to="/project/create"
                  class="block px-3 py-2 rounded-md
                         hover:bg-gray-100 dark:hover:bg-[#1a233a]"
                >
                  Crear proyecto
                </router-link>
              </li>

            </ul>
          </li>

          <!-- ================= EQUIPOS ================= -->
          <li v-if="!isTester">
            <button
              class="w-full flex items-center gap-3 px-3 py-2 rounded-md
                     hover:bg-gray-100 dark:hover:bg-[#1a233a]"
              @click="toggleTeams"
            >
              <IconUsersGroup />

              <span v-if="!collapsed" class="flex-1 text-left">
                Equipos
              </span>

              <IconCaretsDown
                v-if="!collapsed"
                :class="{ 'rotate-180': teamsOpen }"
              />
            </button>

            <ul
              v-if="teamsOpen && !collapsed"
              class="ml-8 mt-1 space-y-1 text-sm"
            >

              <!-- CONSULTAR EQUIPOS -->
              <li v-if="isSuperUser || isAdmin || isOwner">
                <router-link
                  to="/teams"
                  class="block px-3 py-2 rounded-md
                         hover:bg-gray-100 dark:hover:bg-[#1a233a]"
                >
                  Gestión de equipos
                </router-link>
              </li>

            </ul>
          </li>

          <!-- UNIDADES DE NEGOCIO -->
          <li v-if="isSuperUser">
            <router-link
              to="/users/unidades-negocio"
              class="flex items-center gap-3 px-3 py-2 rounded-md
                     hover:bg-gray-100 dark:hover:bg-[#1a233a]"
            >
              <IconMenuBuilding />
              <span v-if="!collapsed">Unidades de negocio</span>
            </router-link>
          </li>


          <li v-if="isSuperUser || isAdmin">
            <router-link
              to="/users/password-reset"
              class="flex items-center gap-3 px-3 py-2 rounded-md
                     hover:bg-gray-100 dark:hover:bg-[#1a233a]"
            >
              <IconMenuLock />

              <span v-if="!collapsed">
                Desbloqueo y Recuperación
              </span>
            </router-link>
          </li>

        </ul>
      </perfect-scrollbar>
    </div>
  </nav>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import api from "@/api/axios/axios"

import IconCaretsDown from '@/components/icon/icon-carets-down.vue'
import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard.vue'
import IconMenuUsers from '@/components/icon/menu/icon-menu-users.vue'
import IconMenuLock from '@/components/icon/menu/icon-menu-authentication.vue'
import IconMenuScrumboard from '@/components/icon/menu/icon-menu-scrumboard.vue'
import IconUsersGroup from '@/components/icon/icon-users-group.vue'
import IconMenuBuilding from '@/components/icon/menu/icon-menu-building.vue'

const collapsed = ref(false)

const employeesOpen = ref(false)
const projectsOpen = ref(false)
const teamsOpen = ref(false)

const role = ref("")

const isSuperUser = ref(false)
const isAdmin = ref(false)
const isOwner = ref(false)
const isTester = ref(false)

const setRolePermissions = (roleName:string) => {

  role.value = roleName

  isSuperUser.value = roleName === "Superuser"
  isAdmin.value = roleName === "Administrador"
  isOwner.value = roleName === "Owner"
  isTester.value = roleName === "Tester"

}
const toggleCollapse = () => {

  collapsed.value = !collapsed.value

  employeesOpen.value = false
  projectsOpen.value = false
  teamsOpen.value = false

}

const toggleEmployees = () => {

  if (!collapsed.value) {

    employeesOpen.value = !employeesOpen.value
    projectsOpen.value = false
    teamsOpen.value = false

  }

}

const toggleProjects = () => {

  if (!collapsed.value) {

    projectsOpen.value = !projectsOpen.value
    employeesOpen.value = false
    teamsOpen.value = false

  }

}

const toggleTeams = () => {

  if (!collapsed.value) {

    teamsOpen.value = !teamsOpen.value
    employeesOpen.value = false
    projectsOpen.value = false

  }

}

onMounted(async () => {

  const tokenExp = localStorage.getItem("token_exp")

  if (!tokenExp) return

  try {

    const res = await api.get("/itwframe/auth/me/")

    const data = res.data

    role.value = data.role || ""

    if (data.is_superuser) {

      isSuperUser.value = true
      isAdmin.value = true
      isOwner.value = true
      isTester.value = false

    } else {

      isSuperUser.value = false
      isAdmin.value = role.value === "Administrador"
      isOwner.value = role.value === "Owner"
      isTester.value = role.value === "Tester"

    }


  } catch (error:any) {

    if (error.response?.status === 401) {
      console.warn("Usuario no autenticado")
    }

  }

})

</script>