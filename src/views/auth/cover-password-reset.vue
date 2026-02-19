<template>
  <div class="p-6">

    <div class="mb-6">
      <h1 class="text-2xl font-bold">Administración de Seguridad</h1>
      <p class="text-sm text-gray-500">
        Gestión de contraseñas y desbloqueo de usuarios
      </p>
    </div>

    <div class="bg-white dark:bg-[#0e1726] rounded-md shadow p-5">

      <div v-if="loading" class="text-center text-gray-400 py-4">
        Cargando usuarios...
      </div>

      <table v-else class="w-full border-collapse">
        <thead>
          <tr class="border-b text-left">
            <th class="p-3">Usuario</th>
            <th class="p-3">Correo</th>
            <th class="p-3">Intentos</th>
            <th class="p-3">Estado</th>
            <th class="p-3">Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b hover:bg-gray-50 dark:hover:bg-[#1a233a]"
          >
            <td class="p-3 font-medium">{{ user.username }}</td>
            <td class="p-3">{{ user.email }}</td>

            <td class="p-3 text-sm"
                :class="user.is_blocked ? 'text-red-500 font-semibold' : 'text-gray-500'">
              {{ user.failed_attempts }}/5
            </td>

            <!-- ESTADO VISUAL -->
            <td class="p-3 text-sm">
              <span v-if="user.is_blocked" class="text-red-600 font-semibold">
                Bloqueado
              </span>

              <span v-else-if="user.forcePasswordChange" class="text-yellow-600 font-semibold">
                Temporal Activa
              </span>

              <span v-else class="text-green-600 font-semibold">
                Activo
              </span>
            </td>

            <!-- BOTÓN DINÁMICO -->
            <td class="p-3">
              <button
                class="btn btn-sm"
                :class="getButtonClass(user)"
                @click="handleSecurityAction(user)"
              >
                {{ getButtonLabel(user) }}
              </button>
            </td>

          </tr>

          <tr v-if="users.length === 0">
            <td colspan="5" class="p-6 text-center text-gray-400">
              No hay usuarios registrados
            </td>
          </tr>

        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios/axios'
import Swal from 'sweetalert2'

interface User {
  id: number
  username: string
  email: string
  forcePasswordChange: boolean
  is_blocked: boolean
  failed_attempts: number
}

const users = ref<User[]>([])
const loading = ref(false)

/* ================= FETCH USERS ================= */
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await api.get('/itwframe/roles/users/')
    users.value = response.data
  } catch (error: any) {

    if (error.response?.status === 401) return

    Swal.fire(
      'Error',
      error.response?.data?.error || 'No se pudieron cargar los usuarios',
      'error'
    )
  } finally {
    loading.value = false
  }
}

/* ================= BOTÓN DINÁMICO ================= */

const getButtonLabel = (user: User) => {
  if (user.is_blocked) return 'Desbloquear usuario'
  if (user.forcePasswordChange) return 'Cancelar temporal'
  return 'Enviar temporal'
}

const getButtonClass = (user: User) => {
  if (user.is_blocked) return 'btn-outline-danger'
  if (user.forcePasswordChange) return 'btn-outline-warning'
  return 'btn-outline-primary'
}

/* ================= ACCIÓN PRINCIPAL ================= */

const handleSecurityAction = async (user: User) => {
  try {

    const response = await api.post(
      `/itwframe/admin/users/${user.id}/force-password-change/`
    )

    const action = response.data.action

    let message = ''

    if (action === 'unlocked') {
      message = 'Usuario desbloqueado correctamente'
    }

    if (action === 'temporary_sent') {
      message = 'Contraseña temporal enviada'
    }

    if (action === 'temporary_cancelled') {
      message = 'Contraseña temporal cancelada'
    }

    await Swal.fire({
      icon: 'success',
      title: message,
      timer: 1500,
      showConfirmButton: false,
    })

    await fetchUsers()

  } catch (error: any) {

    Swal.fire(
      'Error',
      error.response?.data?.error || 'No se pudo ejecutar la acción',
      'error'
    )
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
