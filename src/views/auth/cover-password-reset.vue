<template>
  <div class="p-6">

    <!-- HEADER DE SECCIÓN -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold !text-gray-900 dark:!text-white">
        Recuperación de contraseñas
      </h1>
      <p class="text-sm !text-gray-600 dark:!text-gray-400">
        Administración de accesos y contraseñas temporales
      </p>
    </div>

    <!-- TARJETA -->
    <div class="!bg-white dark:!bg-[#2B2B2B] rounded-md shadow p-5">

      <!-- TABLA DE USUARIOS -->
      <table class="w-full border-collapse">
        <thead>
          <tr class="!border-b !border-gray-200 dark:!border-[#404040] !bg-gray-100 dark:!bg-[#353535]">
            <th class="p-3 text-left !text-gray-700 dark:!text-gray-200 font-semibold">
              Empleado
            </th>
            <th class="p-3 text-left !text-gray-700 dark:!text-gray-200 font-semibold">
              Correo
            </th>
            <th class="p-3 text-left !text-gray-700 dark:!text-gray-200 font-semibold">
              Estado
            </th>
            <th class="p-3 text-left !text-gray-700 dark:!text-gray-200 font-semibold">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="!border-b !border-gray-200 dark:!border-[#404040] 
                   hover:!bg-gray-50 dark:hover:!bg-[#323232] transition-colors"
          >
            <td class="p-3 font-medium !text-gray-900 dark:!text-gray-200">
              {{ user.name }}
            </td>

            <td class="p-3 !text-gray-700 dark:!text-gray-300">
              {{ user.email }}
            </td>

            <!-- ESTADO (derivado de mustChangePassword) -->
            <td class="p-3">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="user.mustChangePassword
                  ? '!bg-yellow-100 dark:!bg-yellow-900/30 !text-yellow-700 dark:!text-yellow-400'
                  : '!bg-green-100 dark:!bg-green-900/30 !text-green-700 dark:!text-green-400'"
              >
                {{ user.mustChangePassword ? 'Contraseña temporal' : 'Activo' }}
              </span>
            </td>

            <!-- ACCIONES -->
            <td class="p-3">
              <button
                class="btn btn-sm btn-outline-primary
                       !text-primary dark:!text-blue-400
                       !border-primary dark:!border-blue-400
                       hover:!bg-primary dark:hover:!bg-blue-500"
                @click="generateTempPassword(user)"
              >
                Generar contraseña temporal
              </button>
            </td>
          </tr>

          <!-- SIN DATOS -->
          <tr v-if="users.length === 0">
            <td colspan="4" class="p-6 text-center !text-gray-400 dark:!text-gray-500">
              No hay usuarios registrados
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <!-- MODAL CONTRASEÑA TEMPORAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 !bg-black/60 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="!bg-white dark:!bg-[#2B2B2B] p-6 rounded-md w-[380px] shadow-2xl">
        <h2 class="text-lg font-bold mb-2 !text-gray-900 dark:!text-white">
          Contraseña temporal creada
        </h2>

        <p class="text-sm !text-gray-600 dark:!text-gray-400 mb-3">
          El usuario deberá cambiarla al iniciar sesión.
        </p>

        <div
          class="!bg-gray-100 dark:!bg-[#323232] 
                 !border !border-gray-300 dark:!border-[#4D4D4D]
                 p-3 rounded text-center font-mono text-lg 
                 !text-gray-900 dark:!text-gray-100"
        >
          {{ tempPassword }}
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button 
            class="btn btn-secondary
                   !text-gray-700 dark:!text-gray-300
                   !border-gray-300 dark:!border-[#4D4D4D]
                   hover:!bg-gray-100 dark:hover:!bg-[#3A3A3A]" 
            @click="closeModal"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/** ======================
 * DATA
 ======================= */

// Lista de usuarios (SIEMPRE inicializada)
const users = ref([
  {
    id: 1,
    name: 'Alexander Byron',
    email: 'alex.byron@itw.com',
    mustChangePassword: false,
  },
  {
    id: 2,
    name: 'María López',
    email: 'maria.lopez@empresa.com',
    mustChangePassword: true,
  },
])

// Modal
const showModal = ref(false)
const tempPassword = ref('')

/** ======================
 * MÉTODOS
 ======================= */

// Generar contraseña temporal
const generateTempPassword = (user: any) => {
  // contraseña simple de ejemplo
  tempPassword.value = Math.random().toString(36).slice(-8)

  // marcar usuario como temporal
  user.mustChangePassword = true

  showModal.value = true
}

// Cerrar modal
const closeModal = () => {
  showModal.value = false
  tempPassword.value = ''
}
</script>
