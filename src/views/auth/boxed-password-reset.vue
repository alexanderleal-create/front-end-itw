<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#060818] px-6">
    <div class="w-full max-w-[440px] rounded-md bg-white/80 dark:bg-black/50 backdrop-blur-lg p-8">

      <!-- HEADER -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-extrabold uppercase text-primary">
          Recuperar contraseña
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Ingresa tu correo para recibir instrucciones
        </p>
      </div>

      <!--  ÉXITO -->
      <div
        v-if="emailSent"
        class="mb-6 rounded-md bg-green-50 border border-green-200 p-4 text-center dark:bg-green-900/20 dark:border-green-700"
      >
        <p class="text-green-700 dark:text-green-400 font-semibold text-sm">
           Correo enviado exitosamente.
        </p>
        <p class="text-green-600 dark:text-green-500 text-xs mt-1">
          Revisa tu bandeja de entrada y sigue las instrucciones.
        </p>
      </div>

      <!--  ERROR -->
      <p
        v-if="error"
        class="mb-4 text-sm text-red-600 text-center"
      >
        {{ error }}
      </p>

      <!-- FORMULARIO -->
      <form v-if="!emailSent" class="space-y-5" @submit.prevent="handleReset">

        <div>
          <label class="block text-sm mb-1">Correo electrónico</label>
          <input
            type="email"
            v-model="form.email"
            class="form-input"
            placeholder="correo@ejemplo.com"
            :disabled="loading"
          />
        </div>

        <button
          type="submit"
          class="btn btn-gradient w-full uppercase"
          :disabled="loading"
        >
          {{ loading ? 'Enviando...' : 'Enviar instrucciones' }}
        </button>

      </form>

      <!-- VOLVER AL LOGIN -->
      <div class="mt-6 text-center text-sm">
        <button
          type="button"
          class="text-primary hover:underline"
          @click="$router.push('/auth/boxed-signin')"
        >
           Volver al inicio de sesión
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from '@/composables/use-meta'
import api from '@/api/axios/axios'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'PasswordReset',

  setup() {
    useMeta({ title: 'Recuperar contraseña' })
  },

  data() {
    return {
      form: {
        email: '',
      },
      error: '',
      loading: false,
      emailSent: false,
    }
  },

  methods: {
    async handleReset() {
      this.error = ''

      if (!this.form.email) {
        this.error = 'Debes ingresar tu correo electrónico.'
        return
      }

      this.loading = true

      try {
       await api.post('itwframe/password-reset/', {
          email: this.form.email.trim(),
        })

        this.emailSent = true

        await Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Revisa tu bandeja de entrada para continuar.',
          timer: 3000,
          showConfirmButton: false,
        })

      } catch (err: any) {
        const status = err.response?.status
        const data = err.response?.data

        if (status === 404) {
          this.error = data?.error || 'No existe una cuenta con ese correo.'
        } else if (status === 403) {
          await Swal.fire({
            icon: 'error',
            title: 'Cuenta bloqueada',
            text: data?.error || 'No puedes recuperar la contraseña de una cuenta bloqueada.',
          })
        } else {
          this.error = 'Error al conectar con el servidor. Intenta más tarde.'
        }

      } finally {
        this.loading = false
      }
    },
  },
})
</script>
