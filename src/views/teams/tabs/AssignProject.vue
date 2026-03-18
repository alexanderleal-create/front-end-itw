<template>
  <div class="rounded-md bg-white p-6 shadow dark:bg-[#0e1726]">

    <!-- HEADER -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-primary">
        Gestión de proyectos por equipo
      </h2>

      <p class="text-sm text-gray-500">
        Selecciona un equipo para asignar o cambiar su proyecto
      </p>
    </div>


    <!-- CARDS EQUIPOS -->
    <div v-if="teams.length" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

      <button
        v-for="team in teams"
        :key="team.id"
        @click="openModal(team)"
        class="group rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md dark:border-[#25324a] dark:from-[#132038] dark:to-[#0f172a]"
      >

        <div class="font-semibold">
          {{ team.nombre_team }}
        </div>

        <div class="text-xs text-gray-500 mt-1">
          Proyecto:
          <span class="font-medium">
            {{ team.proyecto || "Sin proyecto" }}
          </span>
        </div>

      </button>

    </div>


    <!-- MODAL -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      @click.self="closeModal"
    >

      <div class="w-[700px] rounded-xl bg-white p-6 shadow-xl dark:bg-[#0e1726]">


        <!-- HEADER MODAL -->
        <div class="flex justify-between items-center mb-6">

          <div>
            <h3 class="text-xl font-bold">
              {{ selectedTeam?.nombre_team }}
            </h3>

            <p class="text-sm text-gray-500">
              Gestionar proyecto del equipo
            </p>
          </div>

          <button
            class="btn btn-outline-danger btn-sm"
            @click="closeModal"
          >
            Cerrar
          </button>

        </div>


        <!-- PROYECTO ACTUAL -->
        <div class="mb-6 rounded-md bg-gray-50 p-4 dark:bg-[#1a233a]">

          <div class="text-xs text-gray-500">
            Proyecto actual
          </div>

          <div class="font-semibold text-lg">
            {{ selectedTeam?.proyecto || "Sin proyecto asignado" }}
          </div>

        </div>


        <!-- CAMBIAR PROYECTO -->
        <div class="mb-6">

          <label class="text-sm font-semibold block mb-1">
            Seleccionar proyecto
          </label>

          <select
            v-model="selectedProject"
            class="form-select w-full"
          >

            <option :value="null">
              Selecciona proyecto
            </option>

            <option
              v-for="project in projects"
              :key="project.id"
              :value="project.id"
            >
              {{ project.nombre }}
            </option>

          </select>

        </div>


        <!-- BOTONES -->
        <div class="flex justify-end gap-2">

          <button
            class="btn btn-outline-secondary"
            @click="closeModal"
          >
            Cancelar
          </button>

          <button
            class="btn btn-primary"
            :disabled="loading"
            @click="assignProject"
          >
            {{ loading ? "Guardando..." : "Guardar proyecto" }}
          </button>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup lang="ts">

import { ref, onMounted } from "vue"
import api from "@/api/axios/axios"
import Swal from "sweetalert2"

const teams = ref<any[]>([])
const projects = ref<any[]>([])

const selectedTeam = ref<any>(null)
const selectedProject = ref<number | null>(null)

const modalOpen = ref(false)
const loading = ref(false)


const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  iconColor: "white",
  showConfirmButton: false,
  timer: 3000
})


// ==========================
// CARGAR EQUIPOS
// ==========================

const loadTeams = async () => {

  try {

    const res = await api.get("/itwframe/teams/")
    teams.value = res.data?.results ?? res.data ?? []

  } catch {

    Toast.fire({
      icon: "error",
      title: "No se pudieron cargar los equipos"
    })

  }

}


// ==========================
// CARGAR PROYECTOS
// ==========================

const loadProjects = async () => {

  try {

    const res = await api.get("/itwframe/manage-project/")
    projects.value = res.data?.results ?? []

  } catch {

    Toast.fire({
      icon: "error",
      title: "No se pudieron cargar los proyectos"
    })

  }

}


// ==========================
// ABRIR MODAL
// ==========================

const openModal = (team:any) => {

  selectedTeam.value = team

  selectedProject.value = null

  modalOpen.value = true

}


// ==========================
// CERRAR MODAL
// ==========================

const closeModal = () => {

  modalOpen.value = false
  selectedTeam.value = null
  selectedProject.value = null

}


// ==========================
// ASIGNAR PROYECTO
// ==========================

const assignProject = async () => {

  if (!selectedProject.value) {

    Toast.fire({
      icon: "warning",
      title: "Selecciona un proyecto"
    })

    return
  }

  loading.value = true

  try {

    await api.post("/itwframe/teams/", {

      action: "assign-project",
      team_id: selectedTeam.value.id,
      project_id: selectedProject.value

    })

    Toast.fire({
      icon: "success",
      title: "Proyecto asignado"
    })

    await loadTeams()

    closeModal()

  } catch (error:any) {

    Toast.fire({
      icon: "error",
      title: error?.response?.data?.error || "No se pudo asignar"
    })

  } finally {

    loading.value = false

  }

}


// ==========================
// INIT
// ==========================

onMounted(() => {

  loadTeams()
  loadProjects()

})

</script>