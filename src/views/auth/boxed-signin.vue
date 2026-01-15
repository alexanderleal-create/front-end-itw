<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#060818] px-6">
    <div class="w-full max-w-[440px] rounded-md bg-white/80 dark:bg-black/50 backdrop-blur-lg p-8">

      <div class="mb-8 text-center">
        <h1 class="text-3xl font-extrabold uppercase text-primary">
          Iniciar sesión
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <p v-if="error" class="mb-4 text-sm text-red-600 text-center">
        {{ error }}
      </p>

      <form class="space-y-5" @submit.prevent="handleLogin">

        <div>
          <label class="block text-sm mb-1">Usuario</label>
          <input
            type="text"
            v-model="form.username"
            class="form-input"
            placeholder="usuario123"
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Contraseña</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              class="form-input pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
        </div>

        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" v-model="rememberMe" class="form-checkbox" />
          Recordar sesión
        </label>

        <div class="text-right text-sm">
          <button
            type="button"
            class="text-primary hover:underline"
            @click="handlePasswordReset"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          class="btn btn-gradient w-full uppercase"
          :disabled="loading || isBlocked"
        >
          {{ isBlocked ? 'Usuario bloqueado' : loading ? 'Validando...' : 'Entrar' }}
        </button>

      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from '@/composables/use-meta'
import api from '@/api/axios/axios'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'Login',

  setup() {
    useMeta({ title: 'Iniciar sesión' })
  },

  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rememberMe: false,
      error: '',
      showPassword: false,
      isBlocked: false,
      loading: false,
    }
  },

  watch: {
    'form.username'(value: string) {
      this.error = ''
      this.isBlocked = false
    },
  },

  methods: {
    
     async handleLogin() {
      if (this.loading || this.isBlocked) return

      this.error = ''
      this.loading = true

      if (!this.form.username || !this.form.password) {
        this.error = 'Debes ingresar usuario y contraseña.'
        this.loading = false
        return
      }

      try {
        //  El backend configura las cookies automáticamente
        const response = await api.post('itwframe/', {
          username: this.form.username.trim(),
          password: this.form.password,
        })

        // Guardar solo info del usuario (opcional, para mostrar en UI)
        const userData = {
          username: this.form.username,
          exp: response.data.exp
        }
        sessionStorage.setItem('user', JSON.stringify(userData))

        // ✅ Guardar expiración local (para validaciones del frontend)
        const currentDate = new Date()
        const expirationMinutes = 30 // Debe coincidir con ACCESS_TOKEN_LIFETIME (30 min)
        const expirationDate = new Date(currentDate.getTime() + expirationMinutes * 60 * 1000)
        localStorage.setItem('token_exp', expirationDate.toISOString())

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Sesión iniciada como ${this.form.username}`,
          timer: 1500,
          showConfirmButton: false,
        })

        setTimeout(() => {
          this.$router.push('/dashboard')
        }, 1500)

      } catch (err: any) {
        if (err.response?.status === 401) {
          this.error = 'Usuario o contraseña incorrectos'
        } else if (err.response?.status === 403) {
          this.isBlocked = true
          Swal.fire({
            icon: 'error',
            title: 'Usuario bloqueado',
            text: 'Tu cuenta está bloqueada. Contacta al administrador.',
          })
        } else {
          this.error = 'Error al conectar con el servidor'
        }
      } finally {
        this.loading = false
      }
    },

    handlePasswordReset() {
      if (this.isBlocked) {
        Swal.fire({
          icon: 'error',
          title: 'Usuario bloqueado',
          text: 'No puedes recuperar la contraseña.',
        })
        return
      }

      this.$router.push('/auth/boxed-password-reset')
    },
  },
}) 
</script>
