<template>
  <div class="bg-white dark:bg-[#0e1726] rounded-md shadow p-6">

    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6">

      <div>
        <h2 class="text-xl font-bold text-primary">
          Administrar Miembros de Equipo
        </h2>

        <p class="text-sm text-gray-500">
          Gestiona los testers asignados a cada equipo
        </p>
      </div>

    </div>

    <!-- SELECT TEAM -->
    <div class="mb-6">

      <label class="text-sm font-semibold mb-1 block">
        Seleccionar equipo
      </label>

      <select
        v-model="selectedTeam"
        class="form-select w-full"
        @change="loadMembers"
      >
        <option disabled value="">
          Selecciona equipo
        </option>

        <option
          v-for="team in teams"
          :key="team.id"
          :value="team"
        >
          {{ team.nombre_team }}
        </option>

      </select>

    </div>

    <!-- TEAM INFO -->
    <div
      v-if="selectedTeam"
      class="mb-6 bg-gray-50 dark:bg-[#1a233a] rounded-md p-4 flex items-center justify-between"
    >

      <div>

        <div class="text-xs text-gray-500">
          Equipo
        </div>

        <div class="font-semibold text-lg">
          {{ selectedTeam.nombre_team }}
        </div>

      </div>

      <div class="text-right">

        <div class="text-xs text-gray-500">
          Líder del equipo
        </div>

        <div
          v-if="selectedTeam.lider"
          class="badge badge-outline-success"
        >
          {{ selectedTeam.lider }}
        </div>

        <div
          v-else
          class="badge badge-outline-warning"
        >
          Sin líder asignado
        </div>

      </div>

    </div>

    <!-- MEMBERS -->
    <div v-if="selectedTeam">

      <div class="flex items-center justify-between mb-3">

        <h3 class="font-semibold">
          Testers asignados
        </h3>

        <span class="badge badge-outline-primary">
          {{ members.length }} testers
        </span>

      </div>

      <div class="overflow-x-auto">

        <table class="w-full text-sm">

          <thead>

            <tr class="border-b text-left">

              <th class="p-3">
                Tester
              </th>

              <th class="p-3 text-center">
                Acción
              </th>

            </tr>

          </thead>

          <tbody>

            <tr
              v-for="member in members"
              :key="member.id"
              class="border-b hover:bg-gray-50 dark:hover:bg-[#1a233a]"
            >

              <td class="p-3 font-semibold">
                {{ member.username }}
              </td>

              <td class="p-3 text-center">

                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="removeMember(member.id)"
                >
                  Eliminar
                </button>

              </td>

            </tr>

            <tr v-if="members.length === 0">

              <td
                colspan="2"
                class="p-4 text-center text-gray-400"
              >
                No hay testers asignados
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      <!-- ADD MEMBER -->
      <div class="mt-6 flex gap-3">

        <select
          v-model="selectedTester"
          class="form-select w-full"
        >

          <option disabled value="">
            Seleccionar tester disponible
          </option>

          <option
            v-for="user in users"
            :key="user.id"
            :value="user.id"
          >
            {{ user.username }}
          </option>

        </select>

        <button
          class="btn btn-primary"
          @click="addMember"
        >
          Agregar Tester
        </button>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from "vue"
import api from "@/api/axios/axios"
import Swal from "sweetalert2"

const teams = ref<any[]>([])
const members = ref<any[]>([])
const users = ref<any[]>([])

const selectedTeam = ref<any>(null)
const selectedTester = ref("")

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  iconColor: "white",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
})

const loadTeams = async () => {

  try {

    const res = await api.get("/itwframe/teams/")
    teams.value = res.data.results

  } catch {

    Toast.fire({
      icon: "error",
      title: "No se pudieron cargar los equipos"
    })

  }

}

const loadUsers = async () => {

  try {

    const res = await api.get("/itwframe/teams/", {
      params: {
        action: "available-testers"
      }
    })

    users.value = res.data

  } catch {

    Toast.fire({
      icon: "error",
      title: "No se pudieron cargar los testers"
    })

  }

}

const loadMembers = async () => {

  if (!selectedTeam.value) return

  try {

    const res = await api.get("/itwframe/teams/", {
      params: {
        action: "members",
        team_id: selectedTeam.value.id
      }
    })

    members.value = res.data.filter(
      (member:any) =>
        member.username !== selectedTeam.value.lider
    )

  } catch {

    Toast.fire({
      icon: "error",
      title: "No se pudieron cargar los miembros"
    })

  }

}

const addMember = async () => {

  if (!selectedTester.value) {

    Toast.fire({
      icon: "warning",
      title: "Selecciona un tester"
    })

    return
  }

  try {

    await api.post("/itwframe/teams/", {
      action: "add-member",
      team_id: selectedTeam.value.id,
      user_id: selectedTester.value
    })

    Toast.fire({
      icon: "success",
      title: "Tester agregado"
    })

    selectedTester.value = ""

    await loadMembers()
    await loadUsers()

  } catch (error:any) {

    Toast.fire({
      icon: "error",
      title: error?.response?.data?.error || "No se pudo agregar"
    })

  }

}

const removeMember = async (userId:number) => {

  const confirm = await Swal.fire({
    title: "¿Eliminar miembro?",
    icon: "warning",
    showCancelButton: true
  })

  if (!confirm.isConfirmed) return

  try {

    await api.post("/itwframe/teams/", {
      action: "remove-member",
      team_id: selectedTeam.value.id,
      user_id: userId
    })

    Toast.fire({
      icon: "success",
      title: "Miembro eliminado"
    })

    await loadMembers()
    await loadUsers()

  } catch {

    Toast.fire({
      icon: "error",
      title: "No se pudo eliminar"
    })

  }

}

onMounted(() => {

  loadTeams()
  loadUsers()

})

</script>