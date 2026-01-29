<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#060818] px-6">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-black">
      <h1 class="mb-4 text-2xl font-bold text-center dark:text-white">
        Nueva contraseña
      </h1>

      <p class="mb-6 text-center text-gray-500 dark:text-gray-400">
        Ingresa tu nueva contraseña
      </p>

      <form class="space-y-5" @submit.prevent="handleReset">
        <div>
          <label class="dark:text-white">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Nueva contraseña"
            :disabled="loading"
          />
        </div>

        <div>
          <label class="dark:text-white">Confirmar contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-input"
            placeholder="Confirmar contraseña"
            :disabled="loading"
          />
        </div>

        <button
          type="submit"
          class="btn btn-gradient w-full uppercase"
          :disabled="loading"
        >
          <span v-if="!loading">Cambiar contraseña</span>
          <span v-else>Procesando...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '@/api/axios/axios'

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)


const uid = computed(() => String(route.params.uid || ''))
const token = computed(() => String(route.params.token || ''))

const handleReset = async () => {
  if (!uid.value || !token.value) {
    Swal.fire('Error', 'Link inválido o incompleto', 'error')
    return
  }

  if (password.value.length < 8) {
    Swal.fire(
      'Error',
      'La contraseña debe tener al menos 8 caracteres',
      'error'
    )
    return
  }

  if (password.value !== confirmPassword.value) {
    Swal.fire('Error', 'Las contraseñas no coinciden', 'error')
    return
  }

  loading.value = true

  try {
    await api.post(`/itwframe/password-reset-confirm/${uid.value}/${token.value}/`, {
      password: password.value,
    })

    await Swal.fire(
      'Contraseña actualizada',
      'Ahora puedes iniciar sesión',
      'success' 
    )

    router.push('/auth/boxed-signin')
  } catch (error: any) {
    Swal.fire(
      'Error',
      error?.response?.data?.error || 'El enlace es inválido o ha expirado',
      'error'
    )
  } finally {
    loading.value = false
  }
}
</script>
