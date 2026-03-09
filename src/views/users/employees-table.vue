<template>

<!-- BLOQUEO PARA TESTER -->
<div v-if="isTester" class="p-6 text-center text-red-500 font-semibold">
  No tienes permisos para ver esta sección
</div>

<div v-else class="p-6">

    <!-- Breadcrumb -->
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

    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-extrabold text-primary uppercase">
        Tabla de empleados
      </h1>

      <router-link
        to="/dashboard"
        class="text-sm text-primary hover:underline"
      >
        Volver
      </router-link>
    </div>

    <!-- Toggle -->
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

    <!-- Tabla -->
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
            v-for="u in users"
            :key="u.id"
          >

            <td class="font-semibold">
              {{ u.first_name || '—' }} {{ u.last_name || '' }}
            </td>

            <td>{{ u.username }}</td>

            <td>{{ u.email || '—' }}</td>

            <!-- Estado -->
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

            <!-- ACCIONES SEGUN ROL -->
            <td class="text-center">

              <div class="flex justify-center gap-2">

                <!-- SUPERUSER -->
                <template v-if="isSuperUser">

                  <button
                    v-if="u.is_active"
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

                </template>

                <!-- ADMIN -->
                <template v-else-if="isAdmin">

                  <button
                    v-if="u.is_active"
                    class="btn btn-outline-warning btn-sm"
                    @click="openEditModal(u)"
                  >
                    Editar
                  </button>

                </template>

                <!-- OWNER -->
                <template v-else-if="isOwner">

                  <span class="badge badge-outline-info">
                    Solo lectura
                  </span>

                </template>

              </div>

            </td>

          </tr>

          <!-- Empty -->
          <tr v-if="users.length === 0">

            <td colspan="5" class="text-center py-6 opacity-60">

              {{ showInactive
                ? 'No hay usuarios inactivos'
                : 'No hay usuarios activos'
              }}

            </td>

          </tr>

        </tbody>

      </table>
    </div>

    <!-- Modal Editar -->
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

import { ref, onMounted, watch } from 'vue'
import api from '@/api/axios/axios'
import Swal from 'sweetalert2'

interface User {
  id:number
  username:string
  first_name:string
  last_name:string
  email:string
  is_active:boolean
}

const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)

const showModal = ref(false)
const showInactive = ref(false)
const role = ref("")

const isSuperUser = ref(false)
const isAdmin = ref(false)
const isOwner = ref(false)
const isTester = ref(false)

const fetchUsers = async () => {

  try {

    const status = showInactive.value ? 'inactive' : 'active'

    const res = await api.get('/itwframe/manage-users/', {
      params:{ status }
    })

    if (Array.isArray(res.data)) {
      users.value = res.data
    } else {
      users.value = res.data.results || []
    }

  } catch (error:any) {

    if (error.response?.status === 401) return

    Swal.fire('Error','No se pudieron cargar los usuarios','error')

  }

}

watch(showInactive,fetchUsers)

const openEditModal = (user:User) => {

  selectedUser.value = { ...user }
  showModal.value = true

}

const closeModal = () => {

  showModal.value = false
  selectedUser.value = null

}

const confirmUpdate = async () => {

  if (!selectedUser.value) return

  try {

    await api.put(`/itwframe/manage-users/${selectedUser.value.id}/`,{

      first_name:selectedUser.value.first_name,
      last_name:selectedUser.value.last_name,
      email:selectedUser.value.email,

    })

    Swal.fire({
      icon:'success',
      title:'Usuario actualizado',
      timer:1400,
      showConfirmButton:false,
    })

    await fetchUsers()
    closeModal()

  } catch {

    Swal.fire('Error','No se pudo actualizar el usuario','error')

  }

}

const confirmDisable = async (user:User) => {

  const result = await Swal.fire({

    icon:'warning',
    title:'Deshabilitar usuario',
    html:`<strong>${user.username}</strong><br>¿Deseas deshabilitarlo?`,
    showCancelButton:true,
    confirmButtonText:'Sí, deshabilitar',
    cancelButtonText:'Cancelar',
    confirmButtonColor:'#e7515a',

  })

  if (!result.isConfirmed) return

  try {

    await api.put(`/itwframe/manage-users/${user.id}/`,{
      is_active:false,
    })

    Swal.fire({
      icon:'success',
      title:'Usuario deshabilitado',
      timer:1200,
      showConfirmButton:false,
    })

    await fetchUsers()

  } catch {

    Swal.fire('Error','No se pudo deshabilitar','error')

  }

}

const activateUser = async (user:User) => {

  try {

    await api.put(`/itwframe/manage-users/${user.id}/`,{
      is_active:true,
    })

    Swal.fire({
      icon:'success',
      title:'Usuario activado',
      timer:1200,
      showConfirmButton:false,
    })

    await fetchUsers()

  } catch {

    Swal.fire('Error','No se pudo activar','error')

  }

}

onMounted(async () => {

  try {

    const res = await api.get("/itwframe/auth/me/")

    const data = res.data

    role.value = data.role || ""

    if (data.is_superuser) {

      isSuperUser.value = true
      isAdmin.value = true
      isOwner.value = true
      isTester.value = false

    } else {

      isSuperUser.value = false
      isAdmin.value = role.value === "Administrador"
      isOwner.value = role.value === "Owner"
      isTester.value = role.value === "Tester"

    }

    if (!isTester.value) {
      fetchUsers()
    }

  } catch (error) {

    console.error("Error obteniendo usuario", error)

  }

})

</script>