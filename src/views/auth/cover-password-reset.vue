<template>
  <div class="p-6">

    <!-- HEADER DE SECCIÓN -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Recuperación de contraseñas</h1>
      <p class="text-sm text-gray-500">
        Administración de accesos y contraseñas temporales
      </p>
    </div>

    <!-- TARJETA -->
    <div class="bg-white dark:bg-[#0e1726] rounded-md shadow p-5">

      <!-- TABLA DE USUARIOS -->
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b text-left">
            <th class="p-3">Empleado</th>
            <th class="p-3">Correo</th>
            <th class="p-3">Estado</th>
            <th class="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b hover:bg-gray-50 dark:hover:bg-[#1a233a]"
          >
            <td class="p-3 font-medium">
              {{ user.name }}
            </td>

            <td class="p-3">
              {{ user.email }}
            </td>

            <!-- ESTADO (derivado de mustChangePassword) -->
            <td class="p-3">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="user.mustChangePassword
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'"
              >
                {{ user.mustChangePassword ? 'Contraseña temporal' : 'Activo' }}
              </span>
            </td>

            <!-- ACCIONES -->
            <td class="p-3">
              <button
                class="btn btn-sm btn-outline-primary"
                @click="generateTempPassword(user)"
              >
                Generar contraseña temporal
              </button>
            </td>
          </tr>

          <!-- SIN DATOS -->
          <tr v-if="users.length === 0">
            <td colspan="4" class="p-6 text-center text-gray-400">
              No hay usuarios registrados
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <!-- MODAL CONTRASEÑA TEMPORAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-[#0e1726] p-6 rounded-md w-[380px]">
        <h2 class="text-lg font-bold mb-2">
          Contraseña temporal creada
        </h2>

        <p class="text-sm text-gray-500 mb-3">
          El usuario deberá cambiarla al iniciar sesión.
        </p>

        <div
          class="bg-gray-100 dark:bg-[#1a233a] p-3 rounded text-center font-mono text-lg"
        >
          {{ tempPassword }}
        </div>

        <div class="mt-4 text-right">
          <button class="btn btn-secondary" @click="closeModal">
            Cerrar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { employeeService } from '@/services/employee.service'
import type { Employee } from '@/services/employees.data'

// LISTA DE USUARIOS DESDE JSON (VÍA SERVICE)
const users = ref<Employee[]>(employeeService.getAll())

// MODAL
const showModal = ref(false)
const tempPassword = ref('')

// GENERAR CONTRASEÑA TEMPORAL
const generateTempPassword = (user: Employee) => {
  const confirmed = window.confirm(
    `¿Estás seguro de generar una contraseña temporal para ${user.name}?`
  )

  if (!confirmed) return

  // Password temporal simulada
  tempPassword.value = Math.random().toString(36).slice(-8)

  // ✅ MÉTODO CORRECTO + PARÁMETROS CORRECTOS
  employeeService.setTemporaryPassword(
    user.id,
    tempPassword.value
  )

  // Reflejo inmediato en UI
  user.mustChangePassword = true

  showModal.value = true
}

// CERRAR MODAL
const closeModal = () => {
  showModal.value = false
  tempPassword.value = ''
}
</script>
