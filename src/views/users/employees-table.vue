<template>
  <div class="p-6">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold !text-gray-900 dark:!text-white">
          Usuarios
        </h1>
        <p class="!text-gray-600 dark:!text-gray-400">
          Gestión de usuarios internos del sistema
        </p>
      </div>

      <button class="btn btn-primary">
        + Alta de usuarios
      </button>
    </div>

    <!-- TABLA -->
    <div class="panel !bg-white dark:!bg-[#2B2B2B] overflow-x-auto">
      <table class="table-auto w-full text-left">
        <thead>
          <tr class="!bg-gray-100 dark:!bg-[#353535] !border-b !border-gray-200 dark:!border-[#404040]">
            <th class="px-4 py-3 !text-gray-700 dark:!text-gray-200 font-semibold">Nombre</th>
            <th class="px-4 py-3 !text-gray-700 dark:!text-gray-200 font-semibold">Usuario</th>
            <th class="px-4 py-3 !text-gray-700 dark:!text-gray-200 font-semibold">Correo</th>
            <th class="px-4 py-3 !text-gray-700 dark:!text-gray-200 font-semibold">Rol</th>
            <th class="px-4 py-3 !text-gray-700 dark:!text-gray-200 font-semibold">Estado</th>
            <th class="px-4 py-3 !text-gray-700 dark:!text-gray-200 font-semibold text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr 
            v-for="u in users" 
            :key="u.id"
            class="!border-b !border-gray-200 dark:!border-[#404040] 
                   hover:!bg-gray-50 dark:hover:!bg-[#323232] transition-colors"
          >
            <td class="px-4 py-3 font-medium !text-gray-900 dark:!text-gray-200">
              {{ u.first_name }} {{ u.last_name }}
            </td>

            <td class="px-4 py-3 !text-gray-700 dark:!text-gray-300">
              {{ u.username }}
            </td>
            
            <td class="px-4 py-3 !text-gray-700 dark:!text-gray-300">
              {{ u.email }}
            </td>

            <td class="px-4 py-3 font-medium !text-gray-700 dark:!text-gray-300">
              {{ u.role }}
            </td>

            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="u.is_active
                  ? '!bg-green-100 dark:!bg-green-900/30 !text-green-700 dark:!text-green-400'
                  : '!bg-red-100 dark:!bg-red-900/30 !text-red-700 dark:!text-red-400'"
              >
                {{ u.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>

            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">
                <button
                  class="btn btn-outline-warning btn-sm 
                         !text-orange-600 dark:!text-orange-400 
                         !border-orange-600 dark:!border-orange-400
                         hover:!bg-orange-600 dark:hover:!bg-orange-500"
                  @click="openEditModal(u)"
                >
                  Editar
                </button>

                <button
                  class="btn btn-outline-danger btn-sm
                         !text-red-600 dark:!text-red-400
                         !border-red-600 dark:!border-red-400
                         hover:!bg-red-600 dark:hover:!bg-red-500"
                  @click="confirmDelete(u)"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="users.length === 0">
            <td colspan="6" class="text-center py-6 !text-gray-400 dark:!text-gray-500">
              No hay usuarios registrados
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL -->
    <div
      v-if="showModal && selectedUser"
      class="fixed inset-0 !bg-black/60 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="!bg-white dark:!bg-[#2B2B2B] rounded-lg w-full max-w-md p-6 shadow-2xl">
        <h2 class="text-lg font-bold mb-4 !text-gray-900 dark:!text-white">
          Editar usuario
        </h2>

        <form class="space-y-4">

          <div>
            <label class="block mb-1.5 text-sm font-semibold !text-gray-700 dark:!text-gray-300">
              Nombre
            </label>
            <input
              v-model="selectedUser.first_name"
              type="text"
              class="form-input w-full !bg-white dark:!bg-[#323232] 
                     !border-gray-300 dark:!border-[#4D4D4D]
                     !text-gray-900 dark:!text-gray-100"
              placeholder="Nombre"
            />
          </div>

          <div>
            <label class="block mb-1.5 text-sm font-semibold !text-gray-700 dark:!text-gray-300">
              Apellido
            </label>
            <input
              v-model="selectedUser.last_name"
              type="text"
              class="form-input w-full !bg-white dark:!bg-[#323232] 
                     !border-gray-300 dark:!border-[#4D4D4D]
                     !text-gray-900 dark:!text-gray-100"
              placeholder="Apellido"
            />
          </div>

          <div>
            <label class="block mb-1.5 text-sm font-semibold !text-gray-700 dark:!text-gray-300">
              Correo
            </label>
            <input
              v-model="selectedUser.email"
              type="email"
              class="form-input w-full !bg-white dark:!bg-[#323232] 
                     !border-gray-300 dark:!border-[#4D4D4D]
                     !text-gray-900 dark:!text-gray-100"
              placeholder="Correo"
            />
          </div>

          <div>
            <label class="block mb-1.5 text-sm font-semibold !text-gray-700 dark:!text-gray-300">
              Rol
            </label>
            <select
              v-model="selectedUser.role"
              class="form-select w-full !bg-white dark:!bg-[#323232] 
                     !border-gray-300 dark:!border-[#4D4D4D]
                     !text-gray-900 dark:!text-gray-100"
            >
              <option value="Admin">Admin</option>
              <option value="Owner">Owner</option>
              <option value="Tester">Tester</option>
            </select>
          </div>

          <label class="flex items-center gap-2 text-sm !text-gray-700 dark:!text-gray-300">
            <input 
              type="checkbox" 
              v-model="selectedUser.is_active"
              class="form-checkbox"
            />
            Usuario activo
          </label>

          <div class="flex justify-end gap-2 pt-4">
            <button
              type="button"
              class="btn btn-outline-secondary
                     !text-gray-700 dark:!text-gray-300
                     !border-gray-300 dark:!border-[#4D4D4D]
                     hover:!bg-gray-100 dark:hover:!bg-[#3A3A3A]"
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
