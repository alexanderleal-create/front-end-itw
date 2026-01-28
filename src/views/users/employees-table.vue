<template>
  <div class="p-6">

    <!-- HEADER -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Usuarios</h1>
      <p class="text-sm opacity-70">
        Gestión de usuarios internos del sistema
      </p>
    </div>

    <!-- TOGGLE INACTIVOS -->
    <div class="mb-4 flex items-center gap-2">
      <input
        id="showInactive"
        type="checkbox"
        class="form-checkbox"
        v-model="showInactive"
      />
      <label for="showInactive" class="text-sm cursor-pointer">
        Mostrar usuarios inactivos
      </label>
    </div>

    <!-- TABLA -->
    <div class="panel table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Correo</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="u in filteredUsers"
            :key="u.id"
          >
            <td class="font-semibold">
              {{ u.first_name || '—' }} {{ u.last_name || '' }}
            </td>

            <td>{{ u.username }}</td>

            <td>{{ u.email || '—' }}</td>

            <!-- ESTADO -->
            <td class="text-center">
              <span
                class="badge"
                :class="u.is_active
                  ? 'badge-outline-success'
                  : 'badge-outline-danger'"
              >
                {{ u.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>

            <!-- ACCIONES -->
            <td class="text-center">
              <div class="flex justify-center gap-2">

                <button
                  class="btn btn-outline-warning btn-sm"
                  @click="openEditModal(u)"
                >
                  Editar
                </button>

                <button
                  v-if="u.is_active"
                  class="btn btn-outline-danger btn-sm"
                  @click="confirmDisable(u)"
                >
                  Deshabilitar
                </button>

                <button
                  v-else
                  class="btn btn-outline-primary btn-sm"
                  @click="activateUser(u)"
                >
                  Activar
                </button>

              </div>
            </td>
          </tr>

          <!-- EMPTY -->
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="text-center py-6 opacity-60">
              No hay usuarios para mostrar
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL EDITAR -->
    <div
      v-if="showModal && selectedUser"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="panel w-full max-w-md">

        <h2 class="text-lg font-semibold mb-4">
          Editar usuario
        </h2>

        <form class="space-y-4">

          <input
            v-model="selectedUser.first_name"
            class="form-input"
            placeholder="Nombre"
          />

          <input
            v-model="selectedUser.last_name"
            class="form-input"
            placeholder="Apellido"
          />

          <input
            v-model="selectedUser.email"
            class="form-input"
            placeholder="Correo"
          />

          <div class="flex justify-end gap-2 pt-4">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="closeModal"
            >
              Cancelar
            </button>

            <button
              type="button"
              class="btn btn-primary"
              @click="confirmUpdate"
            >
              Guardar cambios
            </button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios/axios'
import Swal from 'sweetalert2'

interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  is_active: boolean
}

const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const showModal = ref(false)

/* =========================
   MOSTRAR / OCULTAR INACTIVOS
========================= */
const showInactive = ref(false)

/* =========================
   FILTRO DE USUARIOS (CLAVE)
========================= */
const filteredUsers = computed(() => {
  return showInactive.value
    ? users.value
    : users.value.filter(u => u.is_active)
})

/* =========================
   CARGAR USUARIOS
========================= */
const fetchUsers = async () => {
  try {
    const res = await api.get('/itwframe/manage-users/')
    users.value = res.data.results
    console.log('[FETCH USERS]', users.value)
  } catch (error) {
    console.error('[ERROR FETCH USERS]', error)
    Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error')
  }
}

/* =========================
   MODAL
========================= */
const openEditModal = (user: User) => {
  selectedUser.value = { ...user }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUser.value = null
}

/* =========================
   ACTUALIZAR USUARIO
========================= */
const confirmUpdate = async () => {
  if (!selectedUser.value) return

  console.log('[UPDATE USER]', selectedUser.value)

  try {
    await api.put(
      `/itwframe/manage-users/${selectedUser.value.id}/`,
      {
        first_name: selectedUser.value.first_name,
        last_name: selectedUser.value.last_name,
        email: selectedUser.value.email,
      }
    )

    Swal.fire({
      icon: 'success',
      title: 'Usuario actualizado',
      timer: 1400,
      showConfirmButton: false,
    })

    await fetchUsers()
    closeModal()
  } catch (error) {
    console.error('[ERROR UPDATE USER]', error)
    Swal.fire('Error', 'No se pudo actualizar el usuario', 'error')
  }
}

/* =========================
   DESHABILITAR (OPTIMISTIC)
========================= */
const confirmDisable = async (user: User) => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Deshabilitar usuario',
    html: `<strong>${user.username}</strong><br>¿Deseas deshabilitarlo?`,
    showCancelButton: true,
    confirmButtonText: 'Sí, deshabilitar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#e7515a',
  })

  if (!result.isConfirmed) return

  console.log('[FRONT] Deshabilitando usuario ID:', user.id)

  try {
    await api.put(`/itwframe/manage-users/${user.id}/`, {
      is_active: false,
    })

    // 🔥 OPTIMISTIC UPDATE
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].is_active = false
      console.log('[FRONT] Estado cambiado a INACTIVO')
    }

    Swal.fire({
      icon: 'success',
      title: 'Usuario deshabilitado',
      timer: 1200,
      showConfirmButton: false,
    })

  } catch (error) {
    console.error('[ERROR DESHABILITAR]', error)
    Swal.fire('Error', 'No se pudo deshabilitar el usuario', 'error')
  }
}

/* =========================
   ACTIVAR (OPTIMISTIC)
========================= */
const activateUser = async (user: User) => {
  console.log('[FRONT] Activando usuario ID:', user.id)

  try {
    await api.put(`/itwframe/manage-users/${user.id}/`, {
      is_active: true,
    })

    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].is_active = true
      console.log('[FRONT] Estado cambiado a ACTIVO')
    }

    Swal.fire({
      icon: 'success',
      title: 'Usuario activado',
      timer: 1200,
      showConfirmButton: false,
    })

  } catch (error) {
    console.error('[ERROR ACTIVAR]', error)
    Swal.fire('Error', 'No se pudo activar el usuario', 'error')
  }
}

onMounted(fetchUsers)
</script>
