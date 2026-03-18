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

      <!-- 🔴 ERROR NORMAL -->
      <p 
        v-if="error && !isBlocked && attemptsRemaining > 1"
        class="mb-4 text-sm text-red-600 text-center"
      >
        {{ error }}
        <br />
        Te quedan <strong>{{ attemptsRemaining }}</strong> intento(s).
      </p>

      <!-- 🟡 ÚLTIMO INTENTO -->
      <p 
        v-if="!isBlocked && attemptsRemaining === 1"
        class="mb-4 text-sm text-yellow-600 font-semibold text-center"
      >
        ⚠️ Último intento antes de bloquear la cuenta.
      </p>

      <form class="space-y-5" @submit.prevent="handleLogin">

        <div>
          <label class="block text-sm mb-1">Usuario</label>
          <input
            type="text"
            v-model="form.username"
            class="form-input"
            placeholder="Ingresa tu usuario"
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

  mounted() {
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
      attemptsRemaining: 5,
    }
  },

  watch: {
    'form.username'() {
      this.error = ''
      this.isBlocked = false
      this.attemptsRemaining = 5
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

        const response = await api.post('itwframe/', {
          username: this.form.username.trim(),
          password: this.form.password,
        })

        const forcePasswordChange = response.data.forcePasswordChange || false

        const userData = {
          username: this.form.username,
          exp: response.data.exp,
          forcePasswordChange
        }

        sessionStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token_exp', String(userData.exp))

        if (forcePasswordChange) {

          const uid = response.data.uid
          const token = response.data.token

          if (!uid || !token) {
            await Swal.fire(
              'Error',
              'No se pudo generar el enlace de cambio.',
              'error'
            )
            this.loading = false
            return
          }

          await Swal.fire({
            icon: 'warning',
            title: 'Cambio obligatorio de contraseña',
            text: 'Debes cambiar tu contraseña antes de continuar.',
            confirmButtonText: 'Continuar'
          })

          this.$router.push(`/auth/reset-password/${uid}/${token}/`)
          return
        }

        await Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Sesión iniciada como ${this.form.username}`,
          timer: 1500,
          showConfirmButton: false,
        })

        this.$router.push('/dashboard')

      } catch (err: any) {

        const status = err.response?.status
        const data = err.response?.data

        if (status === 403 && data?.locked) {
          this.isBlocked = true

          await Swal.fire({
            icon: 'error',
            title: 'Cuenta bloqueada',
            text: data.error || 'Cuenta bloqueada por múltiples intentos.',
          })
        }

        else if (status === 401) {

          this.attemptsRemaining = data?.attempts_remaining ?? 0
          this.error = data?.error || 'Usuario o contraseña incorrectos'

          if (this.attemptsRemaining <= 0) {
            this.isBlocked = true

            await Swal.fire({
              icon: 'error',
              title: 'Cuenta bloqueada',
              text: 'Has alcanzado el máximo de intentos.',
            })
          }
        }

        else {
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