<template>
  <div class="rounded-md bg-white p-6 shadow dark:bg-[#0e1726]">

    <!-- HEADER -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-primary">
        Gestión de equipos
      </h2>

      <p class="text-sm text-gray-500">
        Selecciona un equipo para administrarlo
      </p>
    </div>

    <!-- GRID EQUIPOS -->
    <div v-if="teams.length > 0" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

      <button
        v-for="team in teams"
        :key="team.id"
        @click="openTeamModal(team)"
        class="group rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md dark:border-[#25324a] dark:from-[#132038] dark:to-[#0f172a]"
      >
        <div class="mb-3 flex items-start justify-between gap-3">

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary"
          >
            {{ getInitials(team.nombre_team) }}
          </div>

          <span
            class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            :class="team.lider
              ? 'bg-success/10 text-success'
              : 'bg-warning/10 text-warning'"
          >
            {{ team.lider ? "Con líder" : "Sin líder" }}
          </span>

        </div>

        <div class="mb-1 text-base font-bold text-slate-800 dark:text-white">
          {{ team.nombre_team }}
        </div>

        <div class="text-xs text-slate-500 dark:text-slate-400">
          Líder:
          <span class="font-medium">
            {{ team.lider || "Sin líder asignado" }}
          </span>
        </div>

        <div class="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Gestionar equipo</span>
          <span class="font-semibold text-primary">
            Abrir →
          </span>
        </div>

      </button>

    </div>

    <!-- ESTADO VACIO -->
    <div
      v-else
      class="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-400 dark:border-[#2a3955] dark:text-slate-500"
    >
      <div class="mb-2 text-3xl">👥</div>
      <p>No hay equipos registrados</p>
    </div>


    <!-- MODAL -->
    <div
      v-if="teamModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="closeTeamModal"
    >

      <div class="w-full max-w-6xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#0e1726]">


        <!-- HEADER -->
        <div class="mb-6 flex items-start justify-between border-b border-slate-200 pb-4 dark:border-[#22304a]">

          <div class="flex items-center gap-4">

            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-base font-bold text-primary"
            >
              {{ getInitials(selectedTeam?.nombre_team || "") }}
            </div>

            <div>
              <h3 class="text-xl font-bold text-slate-800 dark:text-white">
                {{ selectedTeam?.nombre_team }}
              </h3>
            </div>

          </div>

          <button
            class="btn btn-outline-danger btn-sm"
            @click="closeTeamModal"
          >
            Cerrar
          </button>

        </div>


        <!-- RESUMEN -->
        <div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">

          <!-- EQUIPO -->
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#22304a] dark:bg-[#111b2e]">
            <div class="text-xs font-semibold uppercase text-slate-500">
              Equipo seleccionado
            </div>

            <div class="text-base font-bold text-slate-800 dark:text-white">
              {{ selectedTeam?.nombre_team }}
            </div>
          </div>


          <!-- LIDER -->
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#22304a] dark:bg-[#111b2e]">

            <div class="text-xs font-semibold uppercase text-slate-500 mb-2">
              Líder actual
            </div>

            <div v-if="selectedTeam?.lider"
              class="inline-flex rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success"
            >
              {{ selectedTeam.lider }}
            </div>

            <div
              v-else
              class="inline-flex rounded-full bg-warning/10 px-3 py-1 text-sm font-semibold text-warning"
            >
              Sin líder asignado
            </div>

            <div class="mt-3 flex gap-2">

              <button
                v-if="selectedTeam?.lider"
                class="btn btn-outline-danger btn-sm"
                @click="removeLeader"
              >
                Quitar líder
              </button>

              <button
                class="btn btn-outline-primary btn-sm"
                :disabled="availableOwners.length === 0"
                @click="changeLeader"
              >
                Cambiar líder
              </button>

            </div>

          </div>


          <!-- MIEMBROS -->
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#22304a] dark:bg-[#111b2e]">

            <div class="text-xs font-semibold uppercase text-slate-500">
              Miembros registrados
            </div>

            <div class="text-base font-bold text-slate-800 dark:text-white">
              {{ members.length }} testers
            </div>

          </div>

        </div>


        <!-- ACCIONES -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <!-- CAMBIAR LIDER -->
          <div class="rounded-xl border border-slate-200 p-5 dark:border-[#22304a]">

            <h4 class="mb-4 text-base font-bold text-slate-800 dark:text-white">
              Cambiar líder del equipo
            </h4>

            <select
              v-model="selectedLeader"
              class="form-select w-full mb-4"
            >

              <option disabled value="">
                Seleccionar nuevo líder
              </option>

              <option
                v-for="owner in availableOwners"
                :key="owner.id"
                :value="String(owner.id)"
              >
                {{ owner.username }}
              </option>

            </select>

            <div class="flex justify-end">

              <button
                class="btn btn-outline-primary"
                :disabled="availableOwners.length === 0"
                @click="changeLeader"
              >
                Cambiar líder
              </button>

            </div>

          </div>


          <!-- AGREGAR TESTER -->
          <div class="rounded-xl border border-slate-200 p-5 dark:border-[#22304a]">

            <h4 class="mb-4 text-base font-bold text-slate-800 dark:text-white">
              Agregar tester
            </h4>

            <select
              v-model="selectedTester"
              class="form-select w-full mb-4"
            >

              <option disabled value="">
                Seleccionar tester
              </option>

              <option
                v-for="user in users"
                :key="user.id"
                :value="String(user.id)"
              >
                {{ user.username }}
              </option>

            </select>

            <div class="flex justify-end">

              <button
                class="btn btn-primary"
                :disabled="users.length === 0"
                @click="addMember"
              >
                Agregar tester
              </button>

            </div>

          </div>

        </div>


        <!-- TABLA -->
        <div class="mt-6 rounded-xl border border-slate-200 dark:border-[#22304a]">

          <div class="flex justify-between border-b border-slate-200 px-5 py-4 dark:border-[#22304a]">

            <div>

              <h4 class="text-base font-bold text-slate-800 dark:text-white">
                Miembros del equipo
              </h4>

              <p class="text-sm text-slate-500 dark:text-slate-400">
                Testers asignados actualmente
              </p>

            </div>

            <span class="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {{ members.length }} testers
            </span>

          </div>


          <div class="overflow-x-auto">

            <table class="w-full text-sm">

              <thead class="bg-slate-50 dark:bg-[#111b2e]">

                <tr>
                  <th class="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    Tester
                  </th>

                  <th class="p-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    Acción
                  </th>
                </tr>

              </thead>

              <tbody>

                <tr
                  v-for="member in members"
                  :key="member.id"
                  class="border-t border-slate-200 hover:bg-slate-50 dark:border-[#22304a]"
                >

                  <td class="p-3">
                    {{ member.username }}
                  </td>

                  <td class="p-3 text-center">

                    <button
                      class="btn btn-outline-danger btn-sm"
                      @click="removeMember(member.id)"
                    >
                      Quitar
                    </button>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>


      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import api from "@/api/axios/axios"
import Swal from "sweetalert2"

// ============================
// STATE
// ============================

const teams = ref<any[]>([])
const members = ref<any[]>([])
const users = ref<any[]>([])
const owners = ref<any[]>([])

const selectedTeam = ref<any>(null)

const selectedTester = ref("")
const selectedLeader = ref("")

const teamModal = ref(false)

// ============================
// TOAST
// ============================

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  iconColor: "white",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
})

// ============================
// HELPERS
// ============================

const getInitials = (text: string) => {
  if (!text) return "EQ"

  const parts = text.trim().split(" ").filter(Boolean)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

const availableOwners = computed(() => {

  if (!selectedTeam.value) return []

  const currentLeader = selectedTeam.value.lider

  const leadersInTeams = teams.value
    .filter(t => t.id !== selectedTeam.value.id && t.lider)
    .map(t => t.lider.toLowerCase())

  return owners.value.filter((owner:any) => {

    const username = owner.username.toLowerCase()

    // permitir el líder actual
    if (currentLeader && username === currentLeader.toLowerCase()) {
      return true
    }

    // excluir owners que ya son líderes
    return !leadersInTeams.includes(username)

  })

})

// ============================
// CARGAR EQUIPOS
// ============================

const loadTeams = async () => {
  try {
    const res = await api.get("/itwframe/teams/")
    teams.value = res.data.results || []
  } catch {
    Toast.fire({
      icon: "error",
      title: "No se pudieron cargar los equipos"
    })
  }
}

// ============================
// ABRIR / CERRAR MODAL
// ============================

const openTeamModal = async (team: any) => {
  selectedTeam.value = { ...team }
  selectedTester.value = ""
  selectedLeader.value = ""

  teamModal.value = true

  await Promise.all([
    loadMembers(),
    loadUsers(),
    loadOwners()
  ])

  // Preseleccionar líder actual si existe dentro de owners disponibles
  const currentOwner = owners.value.find(
    (owner: any) =>
      String(owner.username || "").trim().toLowerCase() ===
      String(selectedTeam.value?.lider || "").trim().toLowerCase()
  )

  if (currentOwner) {
    selectedLeader.value = String(currentOwner.id)
  }
}

const closeTeamModal = () => {
  teamModal.value = false
  selectedTeam.value = null
  selectedTester.value = ""
  selectedLeader.value = ""
  members.value = []
  users.value = []
  owners.value = []
}

// ============================
// CARGAR MIEMBROS
// ============================

const loadMembers = async () => {
  if (!selectedTeam.value) return

  try {
    const res = await api.get("/itwframe/teams/", {
      params: {
        action: "members",
        team_id: selectedTeam.value.id
      }
    })

    members.value = (res.data || []).filter(
      (member: any) =>
        String(member.username || "").trim().toLowerCase() !==
        String(selectedTeam.value.lider || "").trim().toLowerCase()
    )
  } catch {
    Toast.fire({
      icon: "error",
      title: "No se pudieron cargar los miembros"
    })
  }
}

// ============================
// TESTERS DISPONIBLES
// ============================

const loadUsers = async () => {
  try {
    const res = await api.get("/itwframe/teams/", {
      params: {
        action: "available-testers"
      }
    })

    users.value = res.data || []
  } catch {
    Toast.fire({
      icon: "error",
      title: "No se pudieron cargar los testers"
    })
  }
}

// ============================
// OWNERS
// ============================

const loadOwners = async () => {

  try {

    const res = await api.get("/itwframe/roles/users/")

    // SOLO owners
    const ownersOnly = res.data.filter(
      (user:any) => user.role === "Owner"
    )

    owners.value = ownersOnly

  } catch {

    Toast.fire({
      icon: "error",
      title: "No se pudieron cargar los owners"
    })

  }

}

// ============================
// CAMBIAR LIDER
// ============================

const changeLeader = async () => {
  if (!selectedTeam.value?.id) {
    Toast.fire({
      icon: "warning",
      title: "Selecciona un equipo válido"
    })
    return
  }

  if (!selectedLeader.value) {
    Toast.fire({
      icon: "warning",
      title: "Selecciona un owner disponible"
    })
    return
  }

  const leaderExists = availableOwners.value.some(
    (owner: any) => String(owner.id) === String(selectedLeader.value)
  )

  if (!leaderExists) {
    Toast.fire({
      icon: "warning",
      title: "El owner seleccionado no está disponible"
    })
    return
  }

  try {
    await api.post("/itwframe/teams/", {
      action: "update-leader",
      team_id: selectedTeam.value.id,
      user_id: selectedLeader.value
    })

    const selectedOwner = owners.value.find(
      (owner: any) => String(owner.id) === String(selectedLeader.value)
    )

    if (selectedOwner) {
      selectedTeam.value.lider = selectedOwner.username
    }

    Toast.fire({
      icon: "success",
      title: "Líder actualizado correctamente"
    })

    await loadTeams()
    await loadMembers()
    await loadUsers()
    await loadOwners()
  } catch (error: any) {
    Toast.fire({
      icon: "error",
      title: error?.response?.data?.error || "No se pudo actualizar el líder"
    })
  }
}

// ============================
// ELIMINAR LIDER
// ============================

const removeLeader = async () => {

  if (!selectedTeam.value?.id) {
    Toast.fire({
      icon: "warning",
      title: "Selecciona un equipo válido"
    })
    return
  }

  const confirm = await Swal.fire({
    title: "¿Quitar líder?",
    text: "El equipo quedará sin líder asignado.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, quitar",
    cancelButtonText: "Cancelar"
  })

  if (!confirm.isConfirmed) return

  try {

    await api.post("/itwframe/teams/", {
      action: "update-leader",
      team_id: selectedTeam.value.id,
      user_id: null
    })

    selectedTeam.value.lider = null

    Toast.fire({
      icon: "success",
      title: "Líder eliminado correctamente"
    })

    await loadTeams()
    await loadMembers()
    await loadOwners()

  } catch (error:any) {

    Toast.fire({
      icon: "error",
      title: error?.response?.data?.error || "No se pudo quitar el líder"
    })

  }

}
// ============================
// AGREGAR MIEMBRO
// ============================

const addMember = async () => {
  if (!selectedTeam.value?.id) {
    Toast.fire({
      icon: "warning",
      title: "Selecciona un equipo válido"
    })
    return
  }

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
    await loadTeams()
  } catch (error: any) {
    Toast.fire({
      icon: "error",
      title: error?.response?.data?.error || "No se pudo agregar"
    })
  }
}

// ============================
// ELIMINAR MIEMBRO
// ============================

const removeMember = async (userId: number) => {
  if (!selectedTeam.value?.id) {
    Toast.fire({
      icon: "warning",
      title: "Selecciona un equipo válido"
    })
    return
  }

  const confirm = await Swal.fire({
    title: "¿Eliminar miembro?",
    text: "El tester será removido del equipo seleccionado.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, quitar",
    cancelButtonText: "Cancelar"
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
    await loadTeams()
  } catch (error: any) {
    Toast.fire({
      icon: "error",
      title: error?.response?.data?.error || "No se pudo eliminar"
    })
  }
}

// ============================
// INIT
// ============================

onMounted(() => {
  loadTeams()
})
</script>