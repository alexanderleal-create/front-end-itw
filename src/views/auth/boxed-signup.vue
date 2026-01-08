<template>
  <div>
    <!-- Fondo -->
    <div class="absolute inset-0 bg-gray-100 dark:bg-[#060818]"></div>

    <div class="relative flex min-h-screen items-center justify-center px-6 py-10 sm:px-16">
      <div
        class="relative w-full max-w-[520px] rounded-md bg-white/80 backdrop-blur-lg dark:bg-black/60 p-8 shadow-lg"
      >
        <!-- TÍTULO -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-extrabold uppercase text-primary">
            Alta de Empleados
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Registro interno de usuarios del sistema
          </p>
        </div>

        <!-- MENSAJES -->
        <p v-if="error" class="mb-4 text-sm text-danger text-center font-semibold">
          {{ error }}
        </p>

        <p v-if="success" class="mb-4 text-sm text-success text-center font-semibold">
          {{ success }}
        </p>

        <!-- FORMULARIO -->
        <form class="space-y-5" @submit.prevent="handleRegister">
          <!-- NOMBRE -->
          <div>
            <label class="block mb-1 font-semibold">Nombre completo</label>
            <input
              v-model.trim="form.name"
              type="text"
              class="form-input"
              placeholder="Nombre del empleado"
            />
          </div>

          <!-- EMAIL -->
          <div>
            <label class="block mb-1 font-semibold">Correo corporativo</label>
            <input
              v-model.trim="form.email"
              type="email"
              class="form-input"
              placeholder="correo@empresa.com"
            />
          </div>

          <!-- PASSWORD -->
          <div>
            <label class="block mb-1 font-semibold">Contraseña</label>
            <input
              v-model="form.password"
              type="password"
              class="form-input"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <!-- CONFIRM PASSWORD -->
          <div>
            <label class="block mb-1 font-semibold">Confirmar contraseña</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              class="form-input"
              placeholder="Confirma la contraseña"
            />
          </div>

          <!-- ROL -->
          <div>
            <label class="block mb-1 font-semibold">Rol del empleado</label>
            <select v-model="form.role" class="form-select">
              <option disabled value="">Seleccione un rol</option>
              <option value="tester">Tester</option>
              <option value="leader">Líder</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <!-- AUTORIZACIÓN ADMIN -->
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

          <!-- BOTÓN -->
          <button
            type="submit"
            class="btn btn-gradient w-full uppercase"
            :disabled="loading"
          >
            {{ loading ? 'Registrando...' : 'Registrar empleado' }}
          </button>
        </form>

        <!-- FOOTER -->
        <div class="mt-6 text-center text-sm">
          <router-link
            to="/users/employees"
            class="text-primary underline hover:text-black dark:hover:text-white"
          >
            Ir a tabla de empleados
          </router-link>

          <span class="mx-2 text-gray-400">|</span>

          <router-link
            to="/analytics"
            class="text-primary underline hover:text-black dark:hover:text-white"
          >
            Volver al panel principal
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useMeta } from '@/composables/use-meta';
import { employeeService } from '@/services/employee.service';

useMeta({ title: 'Alta de empleados' });

const loading = ref(false);
const error = ref('');
const success = ref('');

const SUPER_ADMIN_PASSWORD = 'superadmin123';

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  superAdminPassword: '',
});

const handleRegister = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  console.log('[AltaEmpleado] Submit formulario:', {
    name: form.name,
    email: form.email,
    role: form.role,
  });

  try {
    // =========================
    // VALIDACIONES
    // =========================
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
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

    if (form.password !== form.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    // =========================
    // VALIDAR ADMIN
    // =========================
    if (form.role === 'admin') {
      if (!form.superAdminPassword) {
        throw new Error('Se requiere autorización de Super Admin');
      }
      if (form.superAdminPassword !== SUPER_ADMIN_PASSWORD) {
        throw new Error('Contraseña de Super Admin incorrecta');
      }
    }

    // =========================
    // VALIDAR CORREO DUPLICADO
    // =========================
    const emailNormalized = form.email.trim().toLowerCase();
    const exists = employeeService
      .getAll()
      .some(emp => emp.email === emailNormalized);

    if (exists) {
      throw new Error('Ya existe un empleado con ese correo');
    }

    console.log('[AltaEmpleado] Validaciones OK. Guardando empleado...');

    // =========================
    // SIMULACIÓN BACKEND
    // =========================
    await new Promise((r) => setTimeout(r, 600));

    // =========================
    // GUARDAR EN JSON (localStorage)
    // =========================
    employeeService.add({
      name: form.name.trim(),
      email: emailNormalized,
      role: form.role as any,
      status: form.role === 'admin' ? 'temporal' : 'activo',
    });

    console.log(
      '[AltaEmpleado] Guardado exitoso. Lista actual:',
      employeeService.getAll()
    );

    success.value = `Empleado ${form.name} registrado correctamente`;

    // =========================
    // LIMPIAR FORMULARIO
    // =========================
    Object.assign(form, {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      superAdminPassword: '',
    });

    console.log('[AltaEmpleado] Formulario limpiado');
  } catch (e: any) {
    error.value = e?.message || 'Error al registrar empleado';
    console.error('[AltaEmpleado] Error:', error.value);
  } finally {
    loading.value = false;
  }
};
</script>
