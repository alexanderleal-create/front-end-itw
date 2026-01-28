<template>
    <div>
        <div class="absolute inset-0">
            <img src="/assets/images/auth/bg-gradient.png" alt="image" class="h-full w-full object-cover" />
        </div>

        <div
            class="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16"
        >
            <!-- decoraciones -->
            <img src="/assets/images/auth/coming-soon-object1.png" class="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
            <img src="/assets/images/auth/coming-soon-object2.png" class="absolute left-24 top-0 h-40 md:left-[30%]" />
            <img src="/assets/images/auth/coming-soon-object3.png" class="absolute right-0 top-0 h-[300px]" />
            <img src="/assets/images/auth/polygon-object.svg" class="absolute bottom-0 end-[28%]" />

            <div
                class="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]"
            >
                <div class="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">

                    <!-- language -->
                    <div class="absolute top-6 end-6">
                        <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="8">
                            <button
                                type="button"
                                class="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                            >
                                <img :src="currentFlag" class="h-5 w-5 rounded-full" />
                                <div class="text-base font-bold uppercase">{{ store.locale }}</div>
                                <icon-caret-down />
                            </button>

                            <template #content="{ close }">
                                <ul class="grid grid-cols-2 gap-2 w-[280px] font-semibold">
                                    <li v-for="item in store.languageList" :key="item.code">
                                        <button
                                            class="w-full hover:text-primary"
                                            :class="{ 'text-primary': i18n.locale === item.code }"
                                            @click="changeLanguage(item); close()"
                                        >
                                            <img class="w-5 h-5 rounded-full" :src="`/assets/images/flags/${item.code.toUpperCase()}.svg`" />
                                            <span class="ml-2">{{ item.name }}</span>
                                        </button>
                                    </li>
                                </ul>
                            </template>
                        </Popper>
                    </div>

                    <!-- form -->
                    <div class="mx-auto w-full max-w-[440px]">
                        <div class="mb-7 text-center">
                            <h1 class="mb-3 text-2xl font-bold dark:text-white">Recuperar contraseña</h1>
                            <p class="text-white-dark">
                                Ingresa tu correo y te enviaremos instrucciones
                            </p>
                        </div>

                        <form class="space-y-5" @submit.prevent="handleSubmit">
                            <div>
                                <label class="dark:text-white">Correo electrónico</label>
                                <div class="relative text-white-dark">
                                    <input
                                        v-model="email"
                                        type="email"
                                        placeholder="correo@ejemplo.com"
                                        class="form-input ps-10"
                                        :disabled="loading"
                                    />
                                    <span class="absolute start-4 top-1/2 -translate-y-1/2">
                                        <icon-mail />
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                class="btn btn-gradient w-full uppercase"
                                :disabled="loading"
                            >
                                <span v-if="!loading">Recuperar</span>
                                <span v-else>Enviando...</span>
                            </button>

                            <div class="text-center">
                                <button
                                    type="button"
                                    class="text-primary hover:underline"
                                    @click="router.push('/login')"
                                >
                                    Volver al login
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

import api from '@/api/axios/axios'
import appSetting from '@/app-setting'
import { useAppStore } from '@/stores/index'
import { useMeta } from '@/composables/use-meta'

import IconCaretDown from '@/components/icon/icon-caret-down.vue'
import IconMail from '@/components/icon/icon-mail.vue'

useMeta({ title: 'Recuperar contraseña' })

const router = useRouter()
const store = useAppStore()
const i18n = reactive(useI18n())

const email = ref('')
const loading = ref(false)

const changeLanguage = (item: any) => {
    i18n.locale = item.code
    appSetting.toggleLanguage(item)
}

const currentFlag = computed(() => `/assets/images/flags/${i18n.locale.toUpperCase()}.svg`)

const handleSubmit = async () => {
    if (!email.value) {
        Swal.fire('Error', 'Debes ingresar un correo', 'error')
        return
    }

    if (!/^\S+@\S+\.\S+$/.test(email.value)) {
        Swal.fire('Error', 'Correo no válido', 'error')
        return
    }

    loading.value = true

    try {
        await api.post('/itwframe/password-reset/', {
            email: email.value,
        })

        Swal.fire(
            'Correo enviado',
            'Si el correo existe, recibirás instrucciones',
            'success'
        )

        email.value = ''
    } catch (error) {
        Swal.fire(
            'Error',
            'No se pudo procesar la solicitud',
            'error'
        )
    } finally {
        loading.value = false
    }
}
</script>
