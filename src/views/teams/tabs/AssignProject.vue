<template>
  <div class="rounded-md bg-white p-6 shadow dark:bg-[#0e1726]">
    
    <h2 class="mb-4 text-lg font-bold">
      Asignar Proyecto a Equipo
    </h2>

    <!-- EQUIPOS -->
    <select
      v-model="selectedTeam"
      class="form-select mb-4"
    >
      <option disabled :value="null">
        Selecciona equipo
      </option>

      <option
        v-for="team in teams"
        :key="team.id"
        :value="team.id"
      >
        {{ team.nombre_team }}
      </option>
    </select>

    <!-- PROYECTOS -->
    <select
      v-model="selectedProject"
      class="form-select mb-4"
    >
      <option disabled :value="null">
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

    <!-- BOTON -->
    <button
      class="btn btn-primary"
      :disabled="loading"
      @click="assignProject"
    >
      {{ loading ? "Asignando..." : "Asignar Proyecto" }}
    </button>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import api from "@/api/axios/axios"

const teams = ref<any[]>([])
const projects = ref<any[]>([])

const selectedTeam = ref<number | null>(null)
const selectedProject = ref<number | null>(null)

const loading = ref(false)

const loadTeams = async () => {

  try {

    const res = await api.get("/itwframe/teams/")

    teams.value = res.data?.results ?? res.data ?? []

  } catch (error) {

    console.error("Error cargando equipos:", error)

  }

}

const loadProjects = async () => {

  try {

    const res = await api.get("/itwframe/manage-project/")

    projects.value = res.data?.results ?? []

  } catch (error) {

    console.error("Error cargando proyectos:", error)

  }

}

const assignProject = async () => {

  if (!selectedTeam.value || !selectedProject.value) {

    alert("Selecciona equipo y proyecto")
    return

  }

  loading.value = true

  try {

    await api.post("/itwframe/teams/", {

      action: "assign-project",
      team_id: selectedTeam.value,
      project_id: selectedProject.value

    })

    alert("Proyecto asignado correctamente")

    selectedTeam.value = null
    selectedProject.value = null

  } catch (error: any) {

    console.error("Error asignando proyecto:", error)

    alert(
      error?.response?.data?.error ||
      "No se pudo asignar el proyecto"
    )

  } finally {

    loading.value = false

  }

}

onMounted(() => {

  loadTeams()
  loadProjects()

})
</script>