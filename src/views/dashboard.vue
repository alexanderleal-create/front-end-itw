<template>
  <div class="p-6">

    <!-- BIENVENIDA -->
    <div class="mb-6">
      <h1 class="text-2xl font-extrabold text-primary uppercase">
        Bienvenido
      </h1>

      <p class="text-sm text-gray-500">
        Panel general del sistema ITW
      </p>
    </div>

    <!-- CARDS KPI -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

      <!-- USUARIOS -->
      <div class="bg-white dark:bg-[#0e1726] shadow rounded-md p-5">
        <p class="text-sm text-gray-500">Usuarios</p>
        <p class="text-3xl font-bold text-primary mt-1">
          {{ stats.users }}
        </p>
      </div>

      <!-- PROYECTOS -->
      <div class="bg-white dark:bg-[#0e1726] shadow rounded-md p-5">
        <p class="text-sm text-gray-500">Proyectos</p>
        <p class="text-3xl font-bold text-primary mt-1">
          {{ stats.projects }}
        </p>
      </div>

      <!-- EQUIPOS -->
      <div class="bg-white dark:bg-[#0e1726] shadow rounded-md p-5">
        <p class="text-sm text-gray-500">Equipos</p>
        <p class="text-3xl font-bold text-primary mt-1">
          {{ stats.teams }}
        </p>
      </div>

    </div>

    <!-- ACCESOS RAPIDOS -->
    <div class="mb-8">

      <h2 class="text-lg font-bold text-primary mb-3">
        Accesos rápidos
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">

        <router-link
          to="/users/create"
          class="btn btn-primary text-center"
        >
          Crear usuario
        </router-link>

        <router-link
          to="/project/create"
          class="btn btn-primary text-center"
        >
          Crear proyecto
        </router-link>

        <router-link
          to="/teams/create"
          class="btn btn-primary text-center"
        >
          Crear equipo
        </router-link>

      </div>

    </div>

    <!-- ULTIMOS USUARIOS -->
    <div class="bg-white dark:bg-[#0e1726] rounded-md shadow p-5">

      <h2 class="text-lg font-bold text-primary mb-4">
        Últimos usuarios registrados
      </h2>

      <div class="overflow-x-auto">

        <table class="w-full text-sm">

          <thead>
            <tr class="border-b text-left">
              <th class="p-3">Usuario</th>
              <th class="p-3">Email</th>
              <th class="p-3">Estado</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b"
            >
              <td class="p-3">
                {{ user.username }}
              </td>

              <td class="p-3">
                {{ user.email }}
              </td>

              <td class="p-3">

                <span
                  v-if="user.is_active"
                  class="badge-outline-success"
                >
                  Activo
                </span>

                <span
                  v-else
                  class="badge-outline-danger"
                >
                  Inactivo
                </span>

              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>

import { ref, onMounted } from "vue"
import api from "@/api/axios/axios"
import { useAppStore } from "@/stores/index"
import { useMeta } from "@/composables/use-meta"

useMeta({ title: "Dashboard" })

const store = useAppStore()

interface User {
  id: number
  username: string
  email: string
  is_active: boolean
}

const stats = ref({
  users: 0,
  projects: 0,
  teams: 0,
  platforms: 0
})

const users = ref<User[]>([])

const loadDashboard = async () => {

  try {

    // usuarios
    const resUsers = await api.get("itwframe/manage-users/")

    users.value = resUsers.data.results.slice(0,5)
    stats.value.users = resUsers.data.count

    // proyectos
    const resProjects = await api.get("itwframe/manage-project/")
    stats.value.projects = resProjects.data.length

    // equipos
    const resTeams = await api.get("itwframe/teams/")
    stats.value.teams = resTeams.data.length

    // plataformas
    const resPlatforms = await api.get("itwframe/manage-plataforma/")
    stats.value.platforms = resPlatforms.data.length

  } catch (error) {

    console.error("Error cargando dashboard:", error)

  }

}

onMounted(() => {
  loadDashboard()
})

</script>