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

            <td class="p-3">
              <button
                class="btn btn-sm"
                :class="getButtonClass(user)"
                :disabled="actionLoading === user.id"
                @click="handleSecurityAction(user)"
              >
                <span v-if="actionLoading === user.id">Procesando...</span>
                <span v-else>{{ getButtonLabel(user) }}</span>
              </button>
            </td>
          </tr>

          <tr v-if="users.length === 0">
            <td colspan="4" class="p-6 text-center text-gray-400">
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

/* ================= INTERFACE ================= */
interface User {
  id: number
  username: string
  email: string
  forcePasswordChange: boolean
  is_blocked: boolean
}

/* ================= STATE ================= */
const users = ref<User[]>([])
const loading = ref(false)
const actionLoading = ref<number | null>(null)

/* ================= FETCH USERS ================= */
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await api.get('itwframe/roles/users/')
    users.value = response.data
  } catch (error: any) {
    if (error.response?.status === 401) return
    Swal.fire('Error', error.response?.data?.error || 'No se pudieron cargar los usuarios', 'error')
  } finally {
    loading.value = false
  }
}

/* ================= BOTÓN DINÁMICO ================= */
const getButtonLabel = (user: User) => {
  if (user.is_blocked) return 'Desbloquear'
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
    actionLoading.value = user.id

    // ✅ response guardado + endpoint correcto
    const response = await api.post(
      `itwframe/admin/users/${user.id}/force-password-change/`
    )

    const action: string = response.data.action

    const messages: Record<string, { title: string; text: string; icon: 'success' | 'info' }> = {
      unlocked: {
        title: 'Cuenta reactivada',
        text: 'El usuario fue desbloqueado y puede iniciar sesión nuevamente.',
        icon: 'success',
      },
      temporary_cancelled: {
        title: 'Contraseña temporal cancelada',
        text: 'El usuario ya no está obligado a cambiar su contraseña.',
        icon: 'info',
      },
      temporary_sent: {
        title: 'Contraseña temporal enviada',
        text: 'Se generó una contraseña temporal y fue enviada al correo del usuario.',
        icon: 'success',
      },
    }

    const msg = messages[action] ?? {
      title: 'Acción completada',
      text: response.data.message || '',
      icon: 'success' as const,
    }

    await Swal.fire({ ...msg, confirmButtonColor: '#3085d6' })
    await fetchUsers()

  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error de seguridad',
      text: error.response?.data?.error || error.response?.data?.detail || 'Ocurrió un problema.',
      confirmButtonColor: '#d33',
    })
  } finally {
    actionLoading.value = null
  }
}

/* ================= INIT ================= */
onMounted(() => {
  fetchUsers()
})
</script>
