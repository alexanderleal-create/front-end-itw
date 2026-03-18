<template>
  <div class="p-6">

    <!-- BREADCRUMB -->
    <nav class="mb-4 text-sm text-gray-500">
      <ol class="flex items-center gap-1">
        <li>
          <router-link to="/dashboard" class="hover:underline">
            Dashboard
          </router-link>
        </li>
        <li class="mx-1">/</li>
        <li class="text-primary font-semibold">
          Roles y Permisos
        </li>
      </ol>
    </nav>

    <!-- HEADER -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-primary uppercase">
          Roles y Permisos
        </h1>
        <p class="text-sm opacity-70">
          Administración de roles de usuarios
        </p>
      </div>

      <router-link to="/dashboard" class="text-sm text-primary hover:underline">
        Volver
      </router-link>
    </div>

    <!-- ERROR -->
    <p v-if="error" class="text-danger mb-4 font-semibold">
      {{ error }}
    </p>

    <!-- TABLA -->
    <div class="panel overflow-x-auto">
      <table class="table-auto w-full">
        <thead>
          <tr class="bg-gray-100 dark:bg-[#1a1c2d]">
            <th class="p-3 text-left">Usuario</th>
            <th class="p-3 text-left">Correo</th>
            <th class="p-3 text-left">Rol actual</th>
            <th class="p-3 text-left">Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b dark:border-gray-700"
          >
            <td class="p-3 font-semibold">{{ user.username }}</td>

            <td class="p-3 text-sm opacity-80">
              {{ user.email || '-' }}
            </td>

            <td class="p-3">
              <span
                v-if="user.role"
                class="badge"
                :class="roleBadgeClass(user.role)"
              >
                {{ user.role }}
              </span>
              <span v-else class="badge badge-outline-secondary">
                Sin rol
              </span>
            </td>

            <td class="p-3">
              <button
                class="btn btn-sm btn-outline-primary"
                @click="openRoleModal(user)"
              >
                Asignar rol
              </button>
            </td>
          </tr>

          <tr v-if="users.length === 0">
            <td colspan="4" class="text-center py-6 opacity-60">
              No hay usuarios
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div
      v-if="showModal && selectedUser"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="panel w-full max-w-md">

        <h2 class="text-lg font-semibold mb-4">
          Asignar rol
        </h2>

        <p class="text-sm mb-3">
          Usuario:
          <strong>{{ selectedUser.username }}</strong>
        </p>

        <p class="text-sm mb-4">
          Rol actual:
          <span
            v-if="selectedUser.role"
            class="badge ml-2"
            :class="roleBadgeClass(selectedUser.role)"
          >
            {{ selectedUser.role }}
          </span>
          <span
            v-else
            class="badge badge-outline-secondary ml-2"
          >
            Sin rol
          </span>
        </p>

        <!-- SELECT FILTRADO -->
        <select
          v-model="selectedRoleId"
          class="form-select w-full mb-6"
        >
          <option value="">Seleccione rol</option>
          <option
            v-for="role in filteredRoles"
            :key="role.id"
            :value="role.id"
          >
            {{ role.name }}
          </option>
        </select>

        <div class="flex justify-end gap-2">
          <button class="btn btn-outline-secondary" @click="closeModal">
            Cancelar
          </button>

          <button
            class="btn btn-primary"
            :disabled="!selectedRoleId || loading"
            @click="confirmAssign"
          >
            {{ loading ? 'Asignando...' : 'Guardar' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios/axios'
import Swal from 'sweetalert2'

interface User {
  id: number
  username: string
  email: string
  role: string | null
}

interface Role {
  id: number
  name: string
}

const users = ref<User[]>([])
const roles = ref<Role[]>([])
const error = ref('')

const showModal = ref(false)
const selectedUser = ref<User | null>(null)
const selectedRoleId = ref<number | ''>('')

const loading = ref(false)
const isSuperUser = ref(false)

/* ================= SESSION CHECK ================= */
const hasSession = () => !!sessionStorage.getItem('user')

/* ================= ROLE BADGE ================= */
const roleBadgeClass = (role: string) => {
  switch (role) {
    case 'Administrador':
      return 'badge-outline-primary'
    case 'Owner':
      return 'badge-outline-warning'
    case 'Tester':
      return 'badge-outline-success'
    default:
      return 'badge-outline-secondary'
  }
}

/* ================= FILTER ROLES ================= */
const filteredRoles = computed(() => {
  return roles.value.filter(role => {
    if (role.name === 'Superuser') return false
    if (!isSuperUser.value && role.name === 'Administrador') return false
    return true
  })
})

/* ================= FETCH USERS ================= */
const fetchUsers = async () => {
  if (!hasSession()) return  
  const res = await api.get('/itwframe/roles/users/')
  users.value = res.data
}

/* ================= FETCH ROLES ================= */
const fetchRoles = async () => {
  if (!hasSession()) return
  const res = await api.get('/itwframe/roles/')
  roles.value = res.data
}

/* ================= FETCH CURRENT USER ================= */
const fetchCurrentUser = async () => {
  if (!hasSession()) return
  const res = await api.get('/itwframe/auth/me/')
  isSuperUser.value = res.data.is_superuser
}

/* ================= MODAL ================= */
const openRoleModal = (user: User) => {
  selectedUser.value = user
  selectedRoleId.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUser.value = null
  selectedRoleId.value = ''
}

/* ================= ASSIGN ROLE ================= */
const confirmAssign = async () => {
  if (!selectedUser.value || !selectedRoleId.value) return
  if (!hasSession()) return

  loading.value = true
  error.value = ''

  try {
    await api.post('/itwframe/roles/assign/', {
      user_id: selectedUser.value.id,
      group_id: selectedRoleId.value,
    })

    Swal.fire({
      icon: 'success',
      title: 'Rol asignado',
      timer: 1400,
      showConfirmButton: false,
    })

    await fetchUsers()
    closeModal()

  } catch (e: any) {
    Swal.fire(
      'Error',
      e?.response?.data?.error || 'No se pudo asignar el rol',
      'error'
    )
  } finally {
    loading.value = false
  }
}

/* ================= INIT ================= */
onMounted(async () => {
  if (!hasSession()) return

  try {
    await Promise.all([
      fetchUsers(),
      fetchRoles(),
      fetchCurrentUser(),
    ])
  } catch {
    error.value = 'Error cargando información'
  }
})
</script>
