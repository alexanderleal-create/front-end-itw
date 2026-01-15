<template>
  <div class="p-6">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Usuarios</h1>
        <p class="text-gray-500">
          Gestión de usuarios internos del sistema
        </p>
      </div>

      <button class="btn btn-primary">
        + Alta de usuarios
      </button>
    </div>

    <!-- TABLA -->
    <div class="card overflow-x-auto">
      <table class="table-auto w-full text-left">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td class="font-medium">
              {{ u.first_name }} {{ u.last_name }}
            </td>

            <td>{{ u.username }}</td>
            <td>{{ u.email }}</td>

            <td class="font-medium">
              {{ u.role }}
            </td>

            <td>
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="u.is_active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'"
              >
                {{ u.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>

            <td class="text-center">
              <div class="flex justify-center gap-2">
                <button
                  class="btn btn-outline-warning btn-sm"
                  @click="openEditModal(u)"
                >
                  Editar
                </button>

                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="confirmDelete(u)"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="users.length === 0">
            <td colspan="6" class="text-center py-6 text-gray-400">
              No hay usuarios registrados
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div
      v-if="showModal && selectedUser"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h2 class="text-lg font-bold mb-4">
          Editar usuario
        </h2>

        <form class="space-y-4">

          <input
            v-model="selectedUser.first_name"
            type="text"
            class="form-input w-full"
            placeholder="Nombre"
          />

          <input
            v-model="selectedUser.last_name"
            type="text"
            class="form-input w-full"
            placeholder="Apellido"
          />

          <input
            v-model="selectedUser.email"
            type="email"
            class="form-input w-full"
            placeholder="Correo"
          />

          <select
            v-model="selectedUser.role"
            class="form-select w-full"
          >
            <option value="Admin">Admin</option>
            <option value="Owner">Owner</option>
            <option value="Tester">Tester</option>
          </select>

          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="selectedUser.is_active" />
            Usuario activo
          </label>

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
import { ref } from 'vue'

/* =====================
   MODELO BASE
   ===================== */
interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
  is_active: boolean
}

/* =====================
(BASE)
   ===================== */
const users = ref<User[]>([
  {
    id: 1,
    username: 'alex',
    first_name: 'Alex',
    last_name: 'Leal',
    email: 'alex@test.com',
    role: 'Admin',
    is_active: true,
  },
  {
    id: 2,
    username: 'maria',
    first_name: 'María',
    last_name: 'López',
    email: 'maria@test.com',
    role: 'Tester',
    is_active: false,
  },
])

const selectedUser = ref<User | null>(null)
const showModal = ref(false)

/* =====================
   MÉTODOS BASE
   ===================== */
const openEditModal = (user: User) => {
  selectedUser.value = { ...user }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUser.value = null
}

const confirmUpdate = () => {
  console.log('Guardar cambios:', selectedUser.value)
  closeModal()
}

const confirmDelete = (user: User) => {
  console.log('Eliminar usuario:', user)
}
</script>
