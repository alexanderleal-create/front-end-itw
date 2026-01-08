<template>
  <div class="p-6">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Usuarios</h1>
        <p class="text-gray-500">Gestión de usuarios internos del sistema</p>
      </div>

      <router-link to="/auth/boxed-signup" class="btn btn-primary">
        + Alta de empleados
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
            <th class="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="emp in employees" :key="emp.id">
            <td>{{ emp.name }}</td>
            <td>{{ emp.email }}</td>
            <td class="capitalize font-medium">{{ emp.role }}</td>

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
            <td colspan="4" class="text-center py-6 text-gray-400">
              No hay empleados registrados
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
        <h2 class="text-lg font-bold mb-4">Editar empleado</h2>

        <form class="space-y-4">
          <input
            v-model="selectedEmployee.name"
            type="text"
            class="form-input w-full"
            placeholder="Nombre"
          />

          <input
            v-model="selectedEmployee.email"
            type="email"
            class="form-input w-full"
            placeholder="Correo"
          />

          <select
            v-model="selectedEmployee.role"
            class="form-select w-full"
          >
            <option value="tester">Tester</option>
            <option value="owner">Owner</option>
          </select>
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
    `¿Seguro que deseas eliminar a ${emp.name}?`
  )
  if (!confirmed) return

  employeeService.delete(emp.id)
  employees.value = employees.value.filter(e => e.id !== emp.id)
}
</script>
