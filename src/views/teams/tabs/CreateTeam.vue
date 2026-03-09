<template>
  <div v-if="isAdmin" class="max-w-lg">

    <div class="rounded-md bg-white p-6 shadow dark:bg-[#0e1726]">

      <h2 class="mb-4 text-lg font-bold">
        Crear Equipo
      </h2>

      <div class="mb-4">
        <label class="mb-1 block text-sm">
          Nombre del Equipo
        </label>

        <input
          v-model="team.nombre_team"
          class="form-input w-full"
          placeholder="Equipo Automatización"
          :disabled="loading"
        />
      </div>

      <button
        class="btn btn-primary w-full"
        :disabled="loading"
        @click="createTeam"
      >
        {{ loading ? "Creando..." : "Crear Equipo" }}
      </button>

    </div>

  </div>

  <div v-else class="text-center text-gray-400">
    No tienes permisos para crear equipos
  </div>

</template>

<script setup lang="ts">

import { ref, onMounted } from "vue"
import api from "@/api/axios/axios"
import Swal from "sweetalert2"

const loading = ref(false)

const team = ref({
  nombre_team: ""
})

const isAdmin = ref(false)
const loadUserRole = async () => {

  try {

    const res = await api.get("/itwframe/auth/me/")
    const role = res.data.role
    const adminRoles = ["Administrador", "Superuser"]
    isAdmin.value = adminRoles.includes(role)
  } catch (error) {
    console.error("Error obteniendo rol:", error)

  }

}

const createTeam = async () => {

  if (!team.value.nombre_team.trim()) {

    Swal.fire({
      icon: "warning",
      title: "Campo requerido",
      text: "Debes ingresar el nombre del equipo"
    })

    return
  }

  try {

    loading.value = true

    await api.post("/itwframe/teams/", {

      action: "create",  
      nombre_team: team.value.nombre_team

    })

    Swal.fire({
      icon: "success",
      title: "Equipo creado correctamente"
    })

    team.value.nombre_team = ""

  } catch (error:any) {

    Swal.fire({
      icon: "error",
      title: "Error",
      text: error?.response?.data?.error || "No se pudo crear el equipo"
    })

  } finally {

    loading.value = false

  }

}

onMounted(() => {
  loadUserRole()

})

</script>