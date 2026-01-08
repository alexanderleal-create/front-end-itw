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
          <label class="block text-sm mb-1">Correo electrónico</label>
          <input
            type="email"
            v-model="form.email"
            class="form-input"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Contraseña</label>
          <input
            type="password"
            v-model="form.password"
            class="form-input"
            placeholder="••••••••"
          />
        </div>

        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" v-model="form.remember" class="form-checkbox" />
          Recordar mis datos
        </label>

        <button
          type="submit"
          class="btn btn-gradient w-full uppercase"
          :disabled="loading"
        >
          {{ loading ? 'Validando...' : 'Entrar' }}
        </button>

      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMeta } from '@/composables/use-meta'
import { employeeService } from '@/services/employee.service'

useMeta({ title: 'Iniciar sesión' })

const router = useRouter()
const loading = ref(false)
const error = ref('')

const MAX_ATTEMPTS = 5

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

onMounted(() => {
  const remembered = localStorage.getItem('remember-data')
  if (remembered) {
    const data = JSON.parse(remembered)
    form.email = data.email || ''
    form.password = data.password || ''
    form.remember = true
  }
})

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  await new Promise((r) => setTimeout(r, 600))

  const email = form.email.trim().toLowerCase()
  const attemptsKey = `login-attempts:${email}`
  let attempts = Number(localStorage.getItem(attemptsKey) || 0)


  const employee = employeeService
    .getAll()
    .find(e => e.email === email)


  const passwordCorrect = form.password.length >= 1

  if (!employee || !passwordCorrect) {
    attempts++
    localStorage.setItem(attemptsKey, String(attempts))

    if (attempts >= MAX_ATTEMPTS) {
      console.warn('[Login] Redirigiendo a recuperación:', email)
      router.push('/auth/boxed-password-reset')
      return
    }

    error.value = `Credenciales incorrectas. Intento ${attempts} de ${MAX_ATTEMPTS}`
    loading.value = false
    return
  }

  localStorage.removeItem(attemptsKey)

  if (form.remember) {
    localStorage.setItem(
      'remember-data',
      JSON.stringify({
        email: form.email,
        password: form.password,
      })
    )
  } else {
    localStorage.removeItem('remember-data')
  }

  sessionStorage.setItem(
    'token',
    JSON.stringify({
      email: employee.email,
      role: employee.role,
      loginAt: new Date().toISOString(),
    })
  )

  loading.value = false
  router.push('/analytics')
}
</script>

