<template>
  <div>
    <!-- FONDO -->
    <div class="absolute inset-0 bg-gray-100 dark:bg-[#060818]"></div>

    <!-- HEADER -->
    <div class="relative px-6 pt-6">
      <div class="mx-auto max-w-7xl flex items-center justify-between text-sm">
        <nav class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <router-link to="/dashboard" class="hover:text-primary transition">
            Dashboard
          </router-link>
          <span>/</span>
          <span class="text-primary font-semibold">
            Alta de Usuario
          </span>
        </nav>

        <router-link
          to="/dashboard"
          class="text-primary font-semibold hover:underline"
        >
          Volver
        </router-link>
      </div>
    </div>

    <!-- CONTENIDO -->
    <div class="relative flex min-h-screen items-start justify-center px-6 py-10">
      <div class="panel w-full max-w-[520px]">

        <!-- TÍTULO -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-extrabold uppercase text-primary">
            Alta de Usuario
          </h1>
          <p class="text-sm opacity-70">
            Registro de usuarios del sistema
          </p>
        </div>

        <!-- MENSAJES -->
        <p v-if="error" class="text-danger text-center mb-4 font-semibold">
          {{ error }}
        </p>

        <p v-if="success" class="text-success text-center mb-4 font-semibold">
          {{ success }}
        </p>

        <!-- FORM -->
        <form class="space-y-4" @submit.prevent="handleSubmit">

          <div>
            <label class="block mb-1 font-semibold">
              Nombre de Usuario
            </label>
            <input
              v-model.trim="form.username"
              class="form-input"
              placeholder="Nombre de usuario"
            />
          </div>

          <div>
            <label class="block mb-1 font-semibold">
              Nombre
            </label>
            <input
              v-model.trim="form.first_name"
              class="form-input"
              placeholder="Nombre(s)"
            />
          </div>

          <div>
            <label class="block mb-1 font-semibold">
              Apellido
            </label>
            <input
              v-model.trim="form.last_name"
              class="form-input"
              placeholder="Apellido"
            />
          </div>

          <div>
            <label class="block mb-1 font-semibold">
              Correo
            </label>
            <input
              v-model.trim="form.email"
              type="email"
              class="form-input"
              placeholder="example@itw.com"
            />
          </div>

          <div>
            <label class="block mb-1 font-semibold">
              Contraseña
            </label>
            <input
              v-model="form.password"
              type="password"
              class="form-input"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <button
            type="submit"
            class="btn btn-gradient w-full mt-4"
            :disabled="loading"
          >
            {{ loading ? 'Guardando...' : 'Crear usuario' }}
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useMeta } from '@/composables/use-meta'
import api from '@/api/axios/axios'

useMeta({ title: 'Alta de usuario' })

const loading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    if (
      !form.username ||
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.password
    ) {
      throw new Error('Todos los campos son obligatorios')
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      throw new Error('Correo electrónico no válido')
    }

    if (form.password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres')
    }

    const payload = { ...form }

    const response = await api.post('/itwframe/manage-users/', payload)

    success.value = `Usuario ${payload.username} creado correctamente`

    Object.assign(form, {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    })

    console.log('[AltaUsuario] Usuario creado:', response.data)

  } catch (e: any) {
    error.value =
      e?.response?.data?.error ||
      e?.message ||
      'Error al crear usuario'
  } finally {
    loading.value = false
  }
}
</script>
