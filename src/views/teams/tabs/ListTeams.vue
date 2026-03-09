<template>
  <div>
    <div class="rounded-md bg-white shadow dark:bg-[#0e1726]">

      <table class="w-full text-sm">

        <!-- HEADER -->
        <thead>
          <tr class="border-b text-left">
            <th class="p-3">Equipo</th>
            <th class="p-3 text-center">Líder</th>
            <th class="p-3 text-center">Proyecto</th>
            <th class="p-3 text-center">Acciones</th>
          </tr>
        </thead>

        <!-- BODY -->
        <tbody>

          <tr
            v-for="team in teams"
            :key="team.id"
            class="border-b hover:bg-gray-50 dark:hover:bg-[#1a233a]"
          >

            <!-- EQUIPO -->
            <td class="p-3 font-semibold">
              {{ team.nombre_team }}
            </td>

            <!-- LIDER -->
            <td class="p-3 text-center">

              <!-- ADMIN -->
              <div v-if="isAdmin">

                <select
                  class="form-select text-sm"
                  :value="team.lider_id"
                  @change="updateLeader(team, ($event.target as HTMLSelectElement).value)"
                >

                  <option :value="null">
                    Sin líder
                  </option>

                  <option
                    v-for="owner in ownersAvailableFor(team)"
                    :key="owner.id"
                    :value="owner.id"
                  >
                    {{ owner.username }}
                  </option>

                </select>

              </div>

              <!-- OTROS ROLES -->
              <div v-else>

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

              </div>

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
            <td class="p-3">
              <div class="flex items-center justify-center gap-2">

                <button
                  v-if="isAdmin"
                  class="btn btn-outline-info btn-sm"
                  :disabled="loading"
                  @click="editTeam(team)"
                >
                  Editar
                </button>

                <button
                  v-if="isAdmin"
                  class="btn btn-outline-danger btn-sm"
                  :disabled="loading"
                  @click="deleteTeam(team)"
                >
                  Eliminar
                </button>

                <span v-if="!isAdmin" class="text-xs text-gray-400">
                  —
                </span>

              </div>
            </td>

          </tr>

          <tr v-if="teams.length === 0">
            <td colspan="4" class="p-4 text-center text-gray-400">
              No hay equipos registrados
            </td>
          </tr>

        </tbody>

      </table>

    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from "vue"
import api from "@/api/axios/axios"
import Swal from "sweetalert2"

const teams = ref<any[]>([])
const users = ref<any[]>([])
const loading = ref(false)
const isAdmin = ref(false)

const loadTeams = async () => {

  try {

    const res = await api.get("/itwframe/teams/")
    teams.value = res.data.results

  } catch (error) {

    Swal.fire("Error", "No se pudieron cargar los equipos", "error")

  }

}

const loadUsers = async () => {

  try {

    const res = await api.get("/itwframe/roles/users/")
    users.value = res.data

  } catch (error) {

    console.error("Error cargando usuarios")

  }

}

const loadUserRole = async () => {

  try {

    const res = await api.get("/itwframe/auth/me/")
    const role = res.data.role

    isAdmin.value =
      role === "Administrador" ||
      role === "Superuser"

  } catch (error) {

    console.error("Error obteniendo rol")

  }

}

const ownersAvailableFor = (team:any) => {

  const owners = users.value.filter(u => u.role === "Owner")

  const leadersInUse = teams.value
    .filter(t => t.lider_id && t.id !== team.id)
    .map(t => t.lider_id)

  return owners.filter(o => !leadersInUse.includes(o.id))

}

const updateLeader = async (team:any, leaderId:any) => {

  try {

    loading.value = true

    await api.post("/itwframe/teams/", {
      action: "update-leader",
      team_id: team.id,
      user_id: leaderId || null
    })

    await loadTeams()

  } catch (error:any) {

    Swal.fire(
      "Error",
      error?.response?.data?.error || "No se pudo actualizar el líder",
      "error"
    )

  } finally {

    loading.value = false

  }

}

const editTeam = async (team:any) => {

  const { value:newName } = await Swal.fire({
    title: "Editar equipo",
    input: "text",
    inputValue: team.nombre_team,
    showCancelButton: true
  })

  if (!newName) return

  try {

    loading.value = true

    await api.put(`/itwframe/teams/${team.id}/`, {
      nombre_team:newName
    })

    await loadTeams()

  } catch (error) {

    Swal.fire("Error","No se pudo actualizar","error")

  } finally {

    loading.value = false

  }

}

const deleteTeam = async (team:any) => {

  const confirm = await Swal.fire({
    title:"¿Eliminar equipo?",
    text:team.nombre_team,
    icon:"warning",
    showCancelButton:true
  })

  if(!confirm.isConfirmed) return

  try{

    loading.value = true

    await api.delete(`/itwframe/teams/${team.id}/`)

    await loadTeams()

  }catch{

    Swal.fire("Error","No se pudo eliminar","error")

  }finally{

    loading.value = false

  }

}

onMounted(() => {

  loadUserRole()
  loadTeams()
  loadUsers()

})

</script>