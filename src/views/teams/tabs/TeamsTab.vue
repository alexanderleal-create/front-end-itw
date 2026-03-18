<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="flex items-center justify-between">

      <!-- BOTON CREAR -->
      <button
        v-if="isAdmin"
        class="btn btn-primary"
        @click="openCreate"
      >
        + Nuevo equipo
      </button>

    </div>

    <!-- TABLA -->
    <div class="rounded-md bg-white shadow dark:bg-[#0e1726]">

      <table class="w-full text-sm">

        <thead class="bg-gray-50 dark:bg-[#1a233a]">
          <tr>
            <th class="p-3 text-left">Equipo</th>
            <th class="p-3 text-center">Líder</th>
            <th class="p-3 text-center">Proyecto</th>
            <th class="p-3 text-center w-32">Acciones</th>
          </tr>
        </thead>

        <tbody>

          <tr
            v-for="team in filteredTeams"
            :key="team.id"
            class="border-b hover:bg-gray-50 dark:hover:bg-[#1a233a]"
          >

            <!-- EQUIPO -->
            <td class="p-3 font-semibold">
              {{ team.nombre_team }}
            </td>

            <!-- LIDER -->
            <td class="p-3 text-center">

              <span
                v-if="team.lider"
                class="badge badge-outline-success"
              >
                {{ team.lider }}
              </span>

              <span
                v-else
                class="badge badge-outline-warning"
              >
                Sin líder
              </span>

            </td>

            <!-- PROYECTO -->
            <td class="p-3 text-center">

              <span
                v-if="team.proyecto"
                class="badge badge-outline-primary"
              >
                {{ team.proyecto }}
              </span>

              <span
                v-else
                class="badge badge-outline-secondary"
              >
                Sin proyecto
              </span>

            </td>

            <!-- ACCIONES -->
            <td class="p-3 text-center">

              <button
                v-if="isAdmin"
                class="btn btn-outline-danger btn-sm"
                @click="deleteTeam(team)"
              >
                Eliminar
              </button>

              <span
                v-else
                class="text-xs text-gray-400"
              >
                —
              </span>

            </td>

          </tr>

          <!-- ESTADO VACIO -->
          <tr v-if="filteredTeams.length === 0">

            <td colspan="4" class="p-10 text-center text-gray-400">

              <div class="flex flex-col items-center gap-2">

                <div class="text-3xl">👥</div>

                <p>No hay equipos registrados</p>

              </div>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

    <!-- MODAL CREAR -->
    <div
      v-if="createOpen"
      class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      @click.self="closeCreate"
    >

      <div class="bg-white dark:bg-[#0e1726] rounded-xl shadow-xl w-[450px] p-6">

        <div class="flex justify-between items-center mb-6">

          <h2 class="text-lg font-bold">
            Crear Equipo
          </h2>

          <button
            class="btn btn-outline-danger btn-sm"
            @click="closeCreate"
          >
            Cerrar
          </button>

        </div>

        <div class="mb-4">

          <label class="text-sm mb-1 block">
            Nombre del equipo
          </label>

          <input
            v-model="team.nombre_team"
            class="form-input w-full"
            placeholder="Equipo Automatización"
          />

        </div>

        <button
          class="btn btn-primary w-full"
          :disabled="loading"
          @click="createTeam"
        >
          {{ loading ? "Creando..." : "Crear equipo" }}
        </button>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from "vue"
import api from "@/api/axios/axios"
import Swal from "sweetalert2"

const teams = ref<any[]>([])
const search = ref("")
const loading = ref(false)

const createOpen = ref(false)

const team = ref({
  nombre_team: ""
})

const isAdmin = ref(false)
const isOwner = ref(false)
const canViewTeams = ref(false)


// ========================
// NORMALIZAR ROL
// ========================

function normalizeRole(role:any){

  return String(role || "")
    .trim()
    .toLowerCase()

}


// ========================
// BUSCADOR
// ========================

const filteredTeams = computed(() => {

  return teams.value.filter(t =>
    t.nombre_team
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )

})


// ========================
// MODAL
// ========================

const openCreate = () => {

  if(!isAdmin.value) return

  createOpen.value = true

}

const closeCreate = () => {

  createOpen.value = false
  team.value.nombre_team = ""

}


// ========================
// CARGAR EQUIPOS
// ========================

const loadTeams = async () => {

  if(!canViewTeams.value) return

  const res = await api.get("/itwframe/teams/")

  teams.value = res.data.results

}


// ========================
// ROL USUARIO
// ========================

const loadUserRole = async () => {

  const res = await api.get("/itwframe/auth/me/")

  const role = normalizeRole(res.data.role)

  isAdmin.value =
    role === "administrador" ||
    role === "superuser"

  isOwner.value =
    role === "owner"

  canViewTeams.value =
    isAdmin.value ||
    isOwner.value

}


// ========================
// CREAR EQUIPO
// ========================

const createTeam = async () => {

  if (!team.value.nombre_team.trim()) {

    Swal.fire(
      "Campo requerido",
      "Debes ingresar el nombre del equipo",
      "warning"
    )

    return
  }

  try {

    loading.value = true

    await api.post("/itwframe/teams/", {

      action: "create",
      nombre_team: team.value.nombre_team

    })

    await loadTeams()

    closeCreate()

    Swal.fire(
      "Equipo creado",
      "",
      "success"
    )

  } catch {

    Swal.fire(
      "Error",
      "No se pudo crear el equipo",
      "error"
    )

  } finally {

    loading.value = false

  }

}


// ========================
// ELIMINAR EQUIPO
// ========================

const deleteTeam = async (team:any) => {

  if(!isAdmin.value) return

  const confirm = await Swal.fire({

    title: "¿Eliminar equipo?",
    text: team.nombre_team,
    icon: "warning",
    showCancelButton: true

  })

  if (!confirm.isConfirmed) return

  await api.delete(`/itwframe/teams/${team.id}/`)

  await loadTeams()

}


// ========================
// INIT
// ========================

onMounted(async () => {

  await loadUserRole()

  await loadTeams()

})

</script>