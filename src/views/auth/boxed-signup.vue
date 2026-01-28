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
        <p
          v-if="error"
          class="text-danger text-center mb-4 font-semibold"
        >
          {{ error }}
        </p>

        <p
          v-if="success"
          class="text-success text-center mb-4 font-semibold"
        >
          {{ success }}
        </p>

        <!-- FORM -->
        <form class="space-y-4" @submit.prevent="handleSubmit">

          <div>
            <label class="block mb-1 font-semibold text-black dark:text-white-dark">
              Nombre de Usuario
            </label>
            <input
              v-model.trim="form.username"
              class="form-input"
              placeholder="Nombre de usuario"
            />
          </div>

          <div>
            <label class="block mb-1 font-semibold text-black dark:text-white-dark">
              Nombre
            </label>
            <input
              v-model.trim="form.first_name"
              class="form-input"
              placeholder="Nombre(s)"
            />
          </div>

          <div>
            <label class="block mb-1 font-semibold text-black dark:text-white-dark">
              Apellido
            </label>
            <input
              v-model.trim="form.last_name"
              class="form-input"
              placeholder="Apellido"
            />
          </div>

          <div>
            <label class="block mb-1 font-semibold text-black dark:text-white-dark">
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
            <label class="block mb-1 font-semibold text-black dark:text-white-dark">
              Contraseña
            </label>
            <input
              v-model="form.password"
              type="password"
              class="form-input"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label class="block mb-1 font-semibold text-black dark:text-white-dark">
              Rol
            </label>
            <select v-model="form.role" class="form-select">
              <option disabled value="">Seleccione un rol</option>
              <option value="user">Tester</option>
              <option value="staff">Owner</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <!-- SUPER ADMIN -->
          <div
            v-if="form.role === 'admin'"
            class="border border-danger rounded-md p-3 bg-danger/10"
          >
            <label class="block mb-1 font-bold text-danger">
              Autorización Super Admin
            </label>
            <input
              v-model="form.superAdminPassword"
              type="password"
              class="form-input border-danger"
              placeholder="Contraseña de Super Admin"
            />
            <p class="text-xs text-danger mt-1">
              Este rol requiere autorización especial
            </p>
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
import { reactive, ref } from 'vue';
import { useMeta } from '@/composables/use-meta';
import api from '@/api/axios/axios'

useMeta({ title: 'Alta de usuario' });

const loading = ref(false);
const error = ref('');
const success = ref('');

const SUPER_ADMIN_PASSWORD = 'superadmin123';

const form = reactive({
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  role: '',
  superAdminPassword: '',
});

const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  console.log('[AltaUsuario] Submit iniciado');
  console.log('[AltaUsuario] Formulario:', { ...form });

  try {

    if (
      !form.username ||
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.password ||
      !form.role
    ) {
      console.warn('[AltaUsuario] Validación fallida: campos vacíos');
      throw new Error('Todos los campos son obligatorios');
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      console.warn('[AltaUsuario] Email inválido:', form.email);
      throw new Error('Correo electrónico no válido');
    }

    if (form.password.length < 8) {
      console.warn('[AltaUsuario] Password muy corto');
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    if (form.role === 'admin') {
      if (!form.superAdminPassword) {
        console.warn('[AltaUsuario] Falta password Super Admin');
        throw new Error('Se requiere autorización de Super Admin');
      }
      if (form.superAdminPassword !== SUPER_ADMIN_PASSWORD) {
        console.warn('[AltaUsuario] Password Super Admin incorrecto');
        throw new Error('Contraseña de Super Admin incorrecta');
      }
    }

    const payload = {
      username: form.username,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
    }


    const response = await api.post('/itwframe/manage-users/', payload);

    console.log('[AltaUsuario] Respuesta backend (SUCCESS):', response);
    console.log('[AltaUsuario] Data backend:', response.data);

    success.value = `Usuario ${payload.username} creado correctamente`;
    console.log('[AltaUsuario] Registro completado con éxito');

    Object.assign(form, {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: '',
      superAdminPassword: '',
    });

  } catch (e: any) {
    console.error('[AltaUsuario] Error en registro:', e);
    console.error('[AltaUsuario] Error response:', e?.response);

    error.value =
      e?.response?.data?.error ||
      e?.message ||
      'Error al crear usuario';
  } finally {
    loading.value = false;
    console.log('[AltaUsuario] Submit finalizado');
  }
};

</script>
