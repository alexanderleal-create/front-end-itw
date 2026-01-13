<template>
  <div class="p-6">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Usuarios</h1>
        <p class="text-gray-500">Gestión de usuarios internos del sistema</p>
      </div>

      <router-link to="/auth/boxed-signup" class="btn btn-primary">
        + Alta de usuarios
      </router-link>
    </div>

    <!-- TABLA -->
    <div class="card">
      <table class="table-auto w-full text-left">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="emp in employees" :key="emp.id">
            <td class="font-medium">
              {{ emp.first_name }} {{ emp.last_name }}
            </td>

            <td>{{ emp.email }}</td>

            <!-- ROL DIRECTO DESDE JSON -->
            <td class="capitalize font-medium">
              <span v-if="emp.role === 'admin'">Admin</span>
              <span v-else-if="emp.role === 'owner'">Owner</span>
              <span v-else>Tester</span>
            </td>

            <td>
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="emp.is_active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'"
              >
                {{ emp.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>

            <td class="text-center">
              <div class="flex justify-center gap-2">
                <button
                  class="btn btn-outline-warning btn-sm px-3"
                  @click="openEditModal(emp)"
                >
                  Editar
                </button>

                <button
                  class="btn btn-outline-danger btn-sm px-3"
                  @click="confirmDelete(emp)"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="employees.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-400">
              No hay usuarios registrados
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL EDITAR -->
    <div
      v-if="showModal && selectedEmployee"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h2 class="text-lg font-bold mb-4">Editar usuario</h2>

        <form class="space-y-4">

          <input
            v-model="selectedEmployee.first_name"
            type="text"
            class="form-input w-full"
            placeholder="Nombre"
          />

          <input
            v-model="selectedEmployee.last_name"
            type="text"
            class="form-input w-full"
            placeholder="Apellido"
          />

          <input
            v-model="selectedEmployee.email"
            type="email"
            class="form-input w-full"
            placeholder="Correo"
          />

          <!-- SELECT RESPETA ROLE DEL JSON -->
          <select
            v-model="selectedEmployee.role"
            class="form-select w-full"
          >
            <option value="tester">Tester</option>
            <option value="owner">Owner</option>

          </select>

          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              v-model="selectedEmployee.is_active"
            />
            Usuario activo
          </label>
        </form>

        <div class="flex justify-end space-x-2 mt-6">
          <button class="btn btn-outline-secondary" @click="closeModal">
            Cancelar
          </button>

          <button class="btn btn-primary" @click="confirmUpdate">
            Guardar cambios
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

// DATA
const employees = ref<Employee[]>(employeeService.getAll())
const selectedEmployee = ref<Employee | null>(null)
const showModal = ref(false)

// ABRIR MODAL
const openEditModal = (emp: Employee) => {
  selectedEmployee.value = { ...emp }
  showModal.value = true
}

// CERRAR MODAL
const closeModal = () => {
  showModal.value = false
  selectedEmployee.value = null
}

// GUARDAR CAMBIOS
const confirmUpdate = () => {
  if (!selectedEmployee.value) return

  const confirmed = window.confirm(
    '¿Estás seguro de guardar los cambios?'
  )
  if (!confirmed) return

  employeeService.update(
    selectedEmployee.value.id,
    selectedEmployee.value
  )

  const index = employees.value.findIndex(
    e => e.id === selectedEmployee.value!.id
  )

  if (index !== -1) {
    employees.value[index] = { ...selectedEmployee.value }
  }

  closeModal()
}

// ELIMINAR
const confirmDelete = (emp: Employee) => {
  const confirmed = window.confirm(
    `¿Seguro que deseas eliminar a ${emp.first_name} ${emp.last_name}?`
  )
  if (!confirmed) return

  employeeService.delete(emp.id)
  employees.value = employees.value.filter(e => e.id !== emp.id)
}
</script>
