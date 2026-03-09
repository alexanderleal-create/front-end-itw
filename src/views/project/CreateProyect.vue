<template>
  <div class="p-6">
    <!-- BREADCRUMB -->
    <nav class="mb-4 text-sm text-gray-500">
      <ol class="flex items-center gap-1 flex-wrap">
        <li>
          <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
        </li>
        <li class="mx-1">/</li>
        <li class="text-primary font-semibold">Crear Proyecto</li>
      </ol>
    </nav>

    <!-- HEADER -->
    <div class="mb-6 flex items-start md:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-extrabold text-primary uppercase">CREAR PROYECTO</h1>
        <p class="text-sm text-gray-500">Captura los datos.</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="openProjectsPanel()"
        >
          Proyectos
        </button>
      </div>
    </div>

    <!-- MAIN CARD -->
    <div class="bg-white dark:bg-[#0e1726] rounded-md shadow p-6 border border-gray-100 dark:border-white/10">
      <!-- ALERTS -->
      <div
        v-if="error"
        class="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {{ error }}
      </div>
      <div
        v-if="success"
        class="mb-4 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700"
      >
        {{ success }}
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- ROW 1 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm mb-1">Nombre *</label>
            <input
              v-model.trim="form.nombre"
              type="text"
              class="form-input w-full"
              maxlength="50"
              :disabled="loading"
            />
            <p class="mt-1 text-xs text-gray-500">Máx. 50 caracteres</p>
          </div>

          <div>
            <label class="block text-sm mb-1">Descripción corta *</label>
            <input
              v-model.trim="form.descripcion_corta"
              type="text"
              class="form-input w-full"
              maxlength="400"
              :disabled="loading"
            />
            <p class="mt-1 text-xs text-gray-500">Máx. 400 caracteres</p>
          </div>
        </div>

        <!-- ROW 2 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          <!-- UNIDAD NEGOCIO -->
          <div>
            <label class="block text-sm mb-1">Unidad de negocio *</label>
            <select
              v-model.number="form.unidad_negocio_id"
              class="form-select w-full"
              :disabled="loading || catalogsLoading"
            >
              <option :value="null" disabled>Selecciona una unidad...</option>
              <option
                v-for="u in unidadesNegocio"
                :key="u.id"
                :value="u.id"
              >
                {{ u.nombre_unidad }}
              </option>
            </select>
          </div>

          <!-- PLATAFORMA -->
          <div>
            <label class="block text-sm mb-1">Plataforma *</label>
            <select
              v-model.number="form.plataforma_id"
              class="form-select w-full"
              :disabled="loading || catalogsLoading"
            >
              <option :value="null" disabled>Selecciona una plataforma...</option>
              <option
                v-for="p in plataformas"
                :key="p.id"
                :value="p.id"
              >
                {{ p.nombre_plataforma }}
              </option>
            </select>
          </div>

          <!-- RESPONSABLE (OWNER) -->
          <div>
            <label class="block text-sm mb-1">Responsable *</label>
            <select
              v-model.number="form.responsable_id"
              class="form-select w-full"
              :disabled="loading || ownersLoading || !isAdmin"
            >
            <option :value="null" disabled>Selecciona un responsable ...</option>
              <option
                v-for="o in owners"
                :key="o.id"
                :value="o.id"
              >
                {{ o.username }}
              </option>
            </select>

            <p v-if="!isAdmin" class="mt-1 text-xs text-gray-500">
              Como Owner, solo puedes asignarte a ti mismo.
            </p>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Crear proyecto' }}
          </button>

          <button
            type="button"
            class="btn btn-outline-danger"
            @click="resetForm"
            :disabled="loading"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>

    <div v-show="projectsDrawerOpen" class="fixed inset-0 z-[60]" aria-hidden="true">
      <div class="absolute inset-0 bg-black/30" @click="closeProjectsPanel()"></div>

      <aside
        class="absolute right-0 top-0 h-full w-[92vw] sm:w-[420px]
               bg-white dark:bg-[#0e1726]
               border-l border-gray-200 dark:border-white/10
               shadow-xl
               transform transition-transform duration-300"
        :class="projectsDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="h-full flex flex-col">
          <div class="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <div>
              <p class="font-semibold">Proyectos</p>
              <p class="text-xs text-gray-500">Lista y búsqueda</p>
            </div>

            <button type="button" class="btn btn-outline-danger" @click="closeProjectsPanel()">
              Cerrar
            </button>
          </div>

          <div class="p-4">
            <input
              v-model="projectSearch"
              type="text"
              placeholder="Buscar proyecto"
              class="w-full px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-[#1a233a]
                     border border-transparent focus:border-primary/40 focus:outline-none"
            />
          </div>

          <div class="flex-1 overflow-y-auto px-4 pb-4">
            <div v-if="projectsLoading" class="text-sm text-gray-400 py-2">
              Cargando proyectos...
            </div>

            <div v-else-if="filteredProjects.length === 0" class="text-sm text-gray-400 py-2">
              No hay proyectos creados.
            </div>

            <button
              v-for="p in filteredProjects"
              :key="p.id_proyecto || p.id"
              type="button"
              class="w-full text-left p-3 rounded-md border border-gray-100 dark:border-white/10
                     hover:bg-gray-50 dark:hover:bg-white/5 transition mb-2"
              @click="goToProject(p)"
              title="Ir al proyecto"
            >
              <p class="font-medium truncate">{{ p.nombre }}</p>
              <p class="text-xs text-gray-500 truncate">
                {{ p.descripcion_corta || 'Sin descripción' }}
              </p>
            </button>
          </div>

          <div class="p-4 border-t border-gray-200 dark:border-white/10">
            <button
              type="button"
              class="w-full btn btn-outline-primary"
              @click="refreshProjects"
              :disabled="projectsLoading"
            >
              Actualizar lista
            </button>
          </div>
        </div>
      </aside>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import api from "@/api/axios/axios"

const loading = ref(false)
const projectsLoading = ref(false)
const catalogsLoading = ref(false)
const ownersLoading = ref(false)

const error = ref("")
const success = ref("")

const unidadesNegocio = ref<any[]>([])
const plataformas = ref<any[]>([])
const owners = ref<any[]>([])
const projects = ref<any[]>([])

const projectsDrawerOpen = ref(false)
const projectSearch = ref("")

const currentUser = ref<any>(null)
const isAdmin = ref(false)

function normalizeRole(role: any) {
  return String(role || "").trim().toLowerCase()
}

async function loadMe() {

  const res = await api.get("/itwframe/auth/me/")

  currentUser.value = res.data

  const role = normalizeRole(res.data?.role)
  const superFlag = !!res.data?.is_superuser

  isAdmin.value =
    superFlag ||
    role === "administrador" ||
    role === "superuser"

}

async function loadUnidades() {

  try {

    const res = await api.get("/itwframe/manage-unidad-negocio/")
    unidadesNegocio.value = res.data?.results ?? []

  } catch (err) {

    unidadesNegocio.value = []
    error.value = "No se pudieron cargar las unidades de negocio."

  }

}

async function loadPlataformas() {

  try {

    const res = await api.get("/itwframe/manage-plataforma/")
    plataformas.value = res.data?.results ?? []

  } catch {

    plataformas.value = []
    error.value = "No se pudieron cargar las plataformas."

  }

}

async function loadOwners() {

  ownersLoading.value = true

  try {

    const res = await api.get("/itwframe/roles/users/")
    const users = res.data?.results ?? res.data ?? []

    const onlyOwners = users.filter(
      (u: any) => normalizeRole(u?.role) === "owner"
    )

    if (isAdmin.value) {

      owners.value = onlyOwners

    } else {

      owners.value = onlyOwners.filter(
        (u: any) => u.id === currentUser.value?.id
      )

      form.value.responsable_id = currentUser.value?.id ?? null

    }

  } catch {

    owners.value = []
    error.value = "No se pudieron cargar los responsables."

  } finally {

    ownersLoading.value = false

  }

}

const form = ref({

  nombre: "",
  descripcion_corta: "",
  unidad_negocio_id: null as number | null,
  plataforma_id: null as number | null,
  responsable_id: null as number | null,

})

async function loadProjects() {

  projectsLoading.value = true

  try {

    const res = await api.get("/itwframe/manage-project/")
    projects.value = res.data?.results ?? []

  } catch {

    projects.value = []

  } finally {

    projectsLoading.value = false

  }

}

const filteredProjects = computed(() => {

  const q = projectSearch.value.toLowerCase().trim()

  if (!q) return projects.value

  return projects.value.filter((p: any) =>
    String(p.nombre || "").toLowerCase().includes(q)
  )

})

function openProjectsPanel() {
  projectsDrawerOpen.value = true
}

function closeProjectsPanel() {
  projectsDrawerOpen.value = false
}

async function refreshProjects() {
  await loadProjects()
}

function goToProject(p: any) {
  projectsDrawerOpen.value = false
}


function validarFormulario() {

  const nombre = form.value.nombre?.trim()
  const descripcion = form.value.descripcion_corta?.trim()

  if (!nombre) {
    return "El nombre del proyecto es obligatorio."
  }

  if (nombre.length > 30) {
    return "El nombre no puede exceder 30 caracteres."
  }

  if (!descripcion) {
    return "La descripción es obligatoria."
  }

  if (descripcion.length > 400) {
    return "La descripción no puede exceder 400 caracteres."
  }

  if (!form.value.unidad_negocio_id) {
    return "Debes seleccionar una unidad de negocio."
  }

  if (!form.value.plataforma_id) {
    return "Debes seleccionar una plataforma."
  }

  if (!form.value.responsable_id) {
    return "Debes seleccionar un responsable."
  }

  return null

}


async function handleSubmit() {

  error.value = ""
  success.value = ""

  const validationError = validarFormulario()

  if (validationError) {

    error.value = validationError
    return

  }

  loading.value = true

  try {

   const payload = {

  nombre: form.value.nombre.trim(),
  descripcion_corta: form.value.descripcion_corta.trim(),
  unidad_negocio: form.value.unidad_negocio_id,
  plataforma: form.value.plataforma_id,
  responsable: form.value.responsable_id,

}

    await api.post("/itwframe/manage-project/", payload)

    success.value = "Proyecto creado correctamente."

    resetForm()

    await loadProjects()

  } catch (e: any) {

    const data = e?.response?.data

    console.log("ERROR BACKEND:", data)

    if (typeof data === "string") {

      error.value = data

    } else if (data?.error) {

      error.value = data.error

    } else if (data) {

      error.value = JSON.stringify(data)

    } else {

      error.value = "No se pudo crear el proyecto."

    }

  } finally {

    loading.value = false

  }

}

function resetForm() {

  form.value.nombre = ""
  form.value.descripcion_corta = ""
  form.value.unidad_negocio_id = null
  form.value.plataforma_id = null

  form.value.responsable_id =
    isAdmin.value
      ? null
      : currentUser.value?.id ?? null

}

onMounted(async () => {

  catalogsLoading.value = true

  await loadMe()

  await Promise.all([
    loadUnidades(),
    loadPlataformas(),
    loadProjects(),
  ])

  await loadOwners()

  catalogsLoading.value = false

})
</script>