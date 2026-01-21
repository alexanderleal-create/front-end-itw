<template>
  <div>
    <div class="absolute inset-0 !bg-gray-100 dark:!bg-[#202020]"></div>

    <div class="relative px-6 pt-6">
      <div
        class="mx-auto max-w-7xl flex items-center justify-between text-sm"
      >
        <!-- Ruta -->
        <nav class="flex items-center gap-2 !text-gray-600 dark:!text-gray-400">
          <router-link
            to="/dashboard"
            class="hover:!text-primary dark:hover:!text-blue-400 transition"
          >
            Dashboard
          </router-link>

          <span>/</span>

          <span class="!text-primary dark:!text-blue-400 font-semibold">
            Alta de Usuario
          </span>
        </nav>

        <!-- Volver -->
        <router-link
          to="/dashboard"
          class="!text-primary dark:!text-blue-400 font-semibold hover:underline"
        >
          Volver 
        </router-link>
      </div>
    </div>

    <!-- ===================== -->
    <!-- CONTENIDO PRINCIPAL -->
    <!-- ===================== -->
    <div class="relative flex min-h-screen items-start justify-center px-6 py-10">
      <div
        class="w-full max-w-[520px] rounded-md !bg-white dark:!bg-[#2B2B2B] p-8 shadow-2xl"
      >
        <!-- TÍTULO -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-extrabold uppercase !text-primary dark:!text-blue-400">
            Alta de Usuario
          </h1>
          <p class="text-sm !text-gray-600 dark:!text-gray-400">
            Registro de usuarios del sistema
          </p>
        </div>

        <!-- MENSAJES -->
        <p
          v-if="error"
          class="!text-danger dark:!text-red-400 !bg-red-50 dark:!bg-red-900/20 text-center mb-4 font-semibold p-3 rounded-md"
        >
          {{ error }}
        </p>

        <p
          v-if="success"
          class="!text-success dark:!text-green-400 !bg-green-50 dark:!bg-green-900/20 text-center mb-4 font-semibold p-3 rounded-md"
        >
          {{ success }}
        </p>

        <!-- ===================== -->
        <!-- FORMULARIO -->
        <!-- ===================== -->
        <form class="space-y-4" @submit.prevent="handleSubmit">

          <!-- NOMBRE DE USUARIO -->
          <div>
            <label class="block mb-1.5 font-semibold !text-gray-700 dark:!text-gray-300">
              Nombre de Usuario
            </label>
            <input
              v-model.trim="form.username"
              class="form-input !bg-white dark:!bg-[#323232] 
                     !border-gray-300 dark:!border-[#4D4D4D]
                     !text-gray-900 dark:!text-gray-100
                     placeholder:!text-gray-400 dark:placeholder:!text-gray-500"
              placeholder="Nombre de usuario"
            />
          </div>

          <!-- NOMBRE -->
          <div>
            <label class="block mb-1.5 font-semibold !text-gray-700 dark:!text-gray-300">
              Nombre
            </label>
            <input
              v-model.trim="form.first_name"
              class="form-input !bg-white dark:!bg-[#323232] 
                     !border-gray-300 dark:!border-[#4D4D4D]
                     !text-gray-900 dark:!text-gray-100
                     placeholder:!text-gray-400 dark:placeholder:!text-gray-500"
              placeholder="Nombre(s)"
            />
          </div>

          <!-- APELLIDO -->
          <div>
            <label class="block mb-1.5 font-semibold !text-gray-700 dark:!text-gray-300">
              Apellido
            </label>
            <input
              v-model.trim="form.last_name"
              class="form-input !bg-white dark:!bg-[#323232] 
                     !border-gray-300 dark:!border-[#4D4D4D]
                     !text-gray-900 dark:!text-gray-100
                     placeholder:!text-gray-400 dark:placeholder:!text-gray-500"
              placeholder="Apellido"
            />
          </div>

          <!-- EMAIL -->
          <div>
            <label class="block mb-1.5 font-semibold !text-gray-700 dark:!text-gray-300">
              Correo
            </label>
            <input
              v-model.trim="form.email"
              type="email"
              class="form-input !bg-white dark:!bg-[#323232] 
                     !border-gray-300 dark:!border-[#4D4D4D]
                     !text-gray-900 dark:!text-gray-100
                     placeholder:!text-gray-400 dark:placeholder:!text-gray-500"
              placeholder="example@itw.com"
            />
          </div>

          <!-- PASSWORD -->
          <div>
            <label class="block mb-1.5 font-semibold !text-gray-700 dark:!text-gray-300">
              Contraseña
            </label>
            <input
              v-model="form.password"
              type="password"
              class="form-input !bg-white dark:!bg-[#323232] 
                     !border-gray-300 dark:!border-[#4D4D4D]
                     !text-gray-900 dark:!text-gray-100
                     placeholder:!text-gray-400 dark:placeholder:!text-gray-500"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <!-- ROL -->
          <div>
            <label class="block mb-1.5 font-semibold !text-gray-700 dark:!text-gray-300">
              Rol
            </label>
            <select 
              v-model="form.role" 
              class="form-select !bg-white dark:!bg-[#323232] 
                     !border-gray-300 dark:!border-[#4D4D4D]
                     !text-gray-900 dark:!text-gray-100"
            >
              <option disabled value="">Seleccione un rol</option>
              <option value="user">Tester</option>
              <option value="staff">Owner</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <!-- AUTORIZACIÓN SUPER ADMIN -->
          <div
            v-if="form.role === 'admin'"
            class="!border !border-danger dark:!border-red-500 rounded-md p-3 !bg-danger/10 dark:!bg-red-900/20"
          >
            <label class="font-bold !text-danger dark:!text-red-400 block mb-2">
              Autorización Super Admin
            </label>
            <input
              v-model="form.superAdminPassword"
              type="password"
              class="form-input !border-danger dark:!border-red-500 
                     !bg-white dark:!bg-[#323232]
                     !text-gray-900 dark:!text-gray-100
                     placeholder:!text-gray-400 dark:placeholder:!text-gray-500"
              placeholder="Contraseña de Super Admin"
            />
            <p class="text-xs !text-danger dark:!text-red-400 mt-2">
              Este rol requiere autorización especial
            </p>
          </div>

          <!-- BOTÓN -->
          <button
            type="submit"
            class="btn btn-gradient w-full mt-4 font-semibold uppercase"
            :disabled="loading"
            :class="{ 'opacity-50 cursor-not-allowed': loading }"
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

  try {
    // =====================
    // VALIDACIONES
    // =====================
    if (
      !form.username ||
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.password ||
      !form.role
    ) {
      throw new Error('Todos los campos son obligatorios');
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      throw new Error('Correo electrónico no válido');
    }

    if (form.password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    if (form.role === 'admin') {
      if (!form.superAdminPassword) {
        throw new Error('Se requiere autorización de Super Admin');
      }
      if (form.superAdminPassword !== SUPER_ADMIN_PASSWORD) {
        throw new Error('Contraseña de Super Admin incorrecta');
      }
    }

    // =====================
    // PAYLOAD auth_user
    // =====================
    const payload = {
      username: form.username.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      is_staff: form.role === 'staff' || form.role === 'admin',
      is_superuser: form.role === 'admin',
      is_active: true, // 🔒 activo por defecto
      date_joined: new Date().toISOString(),
      last_login: null,
    };

    console.log('[auth_user] Payload:', payload);

    // Simulación backend
    await new Promise(r => setTimeout(r, 600));

    success.value = `Usuario ${payload.username} creado correctamente`;

    // =====================
    // LIMPIAR FORMULARIO
    // =====================
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
    error.value = e?.message || 'Error al crear usuario';
  } finally {
    loading.value = false;
  }
};
</script>
