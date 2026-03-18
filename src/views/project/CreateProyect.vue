<template>
  <div class="p-6">

    <!-- BREADCRUMB -->
    <nav class="mb-4 text-sm text-gray-500">
      <ol class="flex items-center gap-1 flex-wrap">
        <li>
          <router-link to="/dashboard" class="hover:underline">
            Dashboard
          </router-link>
        </li>

        <li class="mx-1">/</li>

        <li class="text-primary font-semibold">
          Proyectos
        </li>
      </ol>
    </nav>

    <!-- HEADER -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

      <div>
        <h1 class="text-2xl font-extrabold text-primary uppercase">
          PROYECTOS
        </h1>

        <p class="text-sm text-gray-500">
          Administrar proyectos del sistema
        </p>
      </div>

      <div class="flex gap-2">

        <button
          v-if="canCreateProjects"
          class="btn btn-primary"
          @click="openCreate"
        >
          Nuevo proyecto
        </button>

        <button
          class="btn btn-outline-primary"
          @click="loadProjects"
          :disabled="loading"
        >
          {{ loading ? "Actualizando..." : "Actualizar" }}
        </button>

      </div>
    </div>

    <!-- CARD TABLA -->
    <div class="bg-white dark:bg-[#0e1726] rounded-md shadow border border-gray-100 dark:border-white/10 overflow-hidden">

      <!-- FILTROS -->
      <div class="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between gap-3">

        <input
          v-model="search"
          type="text"
          placeholder="Buscar proyecto..."
          class="form-input w-full md:w-[420px]"
        />

        <button
          class="btn btn-outline-danger"
          @click="clearFilters"
        >
          Limpiar filtros
        </button>

      </div>

      <!-- TABLA -->
      <div class="overflow-x-auto">

        <table class="w-full text-sm">

          <thead class="bg-gray-50 dark:bg-white/5">
            <tr>
              <th class="p-3 text-left">Nombre</th>
              <th class="p-3 text-left">Descripción</th>
              <th class="p-3 text-left">Unidad</th>
              <th class="p-3 text-left">Plataforma</th>
              <th class="p-3 text-left">Responsable</th>
              <th class="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody v-if="filteredProjects.length">

            <tr
              v-for="p in filteredProjects"
              :key="p.id"
              class="border-t border-gray-100 dark:border-white/10"
            >

              <td class="p-3 font-semibold">
                {{ p.nombre }}

                <span class="ml-2 text-xs text-gray-400">
                  #{{ p.id }}
                </span>
              </td>

              <td
                class="p-3 max-w-[350px] truncate"
                :title="p.descripcion_corta"
              >
                {{ p.descripcion_corta || "Sin descripción" }}
              </td>

              <td class="p-3">
                {{ unidadName(getUnidadId(p)) }}
              </td>

              <td class="p-3">
                {{ plataformaName(getPlataformaId(p)) }}
              </td>

              <td class="p-3 font-medium">
                {{ responsableName(p) }}
              </td>

              <td class="p-3 flex gap-2 flex-wrap">

                <button
                  class="btn btn-outline-secondary"
                  type="button"
                >
                  Ver
                </button>

                <button
                  v-if="canEditProjects"
                  class="btn btn-outline-primary"
                  @click="openEdit(p)"
                >
                  Editar
                </button>

                <button
                  v-if="canDeleteProjects"
                  class="btn btn-outline-danger"
                  @click="confirmDelete(p)"
                >
                  Eliminar
                </button>

              </td>

            </tr>

          </tbody>

          <tbody v-else>

            <tr>
              <td colspan="6" class="p-10 text-center text-gray-500">
                No hay proyectos
              </td>
            </tr>

          </tbody>

        </table>

      </div>
    </div>

    <!-- MODAL CREAR -->
    <div
      v-if="createOpen && canCreateProjects"
      class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      @click.self="closeCreate"
    >

      <div class="bg-white dark:bg-[#0e1726] rounded-xl shadow-xl w-[720px] p-6">

        <div class="flex justify-between items-center mb-6">

          <div>
            <h2 class="text-xl font-bold">
              Crear Proyecto
            </h2>

            <p class="text-sm text-gray-500">
              Captura la información del proyecto
            </p>
          </div>

          <button
            class="btn btn-outline-danger"
            @click="closeCreate"
          >
            Cerrar
          </button>

        </div>

        <form
          @submit.prevent="handleSubmit"
          class="space-y-5"
        >

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label class="text-sm font-medium">
                Nombre *
              </label>

              <input
                v-model="form.nombre"
                class="form-input w-full"
                maxlength="50"
              />

              <p class="text-xs text-gray-500 mt-1">
                Máx. 50 caracteres
              </p>

            </div>

            <div>

              <label class="text-sm font-medium">
                Descripción corta *
              </label>

              <textarea
                v-model="form.descripcion_corta"
                rows="3"
                maxlength="400"
                class="form-textarea w-full"
              ></textarea>

              <p class="mt-1 text-xs text-gray-500">
                {{ form.descripcion_corta.length }}/400 caracteres (mínimo 100)
              </p>

              <p
                v-if="form.descripcion_corta.length > 0 && form.descripcion_corta.length < 100"
                class="text-xs text-red-500"
              >
                La descripción debe tener al menos 100 caracteres
              </p>

            </div>

          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>

              <label class="text-sm font-medium">
                Unidad de negocio *
              </label>

              <select
                v-model.number="form.unidad_negocio_id"
                class="form-select w-full"
              >
                <option :value="null">
                  Selecciona unidad
                </option>

                <option
                  v-for="u in unidades"
                  :key="u.id"
                  :value="u.id"
                >
                  {{ u.nombre_unidad }}
                </option>

              </select>

            </div>

            <div>

              <label class="text-sm font-medium">
                Plataforma *
              </label>

              <select
                v-model.number="form.plataforma_id"
                class="form-select w-full"
              >
                <option :value="null">
                  Selecciona plataforma
                </option>

                <option
                  v-for="p in plataformas"
                  :key="p.id"
                  :value="p.id"
                >
                  {{ p.nombre_plataforma }}
                </option>

              </select>

            </div>

            <div>

              <label class="text-sm font-medium">
                Responsable *
              </label>

              <select
                v-model.number="form.responsable_id"
                class="form-select w-full"
                :disabled="!isAdmin"
              >
                <option :value="null">
                  Selecciona responsable
                </option>

                <option
                  v-for="o in owners"
                  :key="o.id"
                  :value="o.id"
                >
                  {{ o.username }}
                </option>

              </select>

              <p
                v-if="!isAdmin"
                class="text-xs text-gray-500 mt-1"
              >
                Como Owner solo puedes asignarte a ti mismo
              </p>

            </div>

          </div>

          <div class="flex justify-end gap-2 pt-4">

            <button
              class="btn btn-primary"
              :disabled="creating || form.descripcion_corta.length < 100"
            >
              {{ creating ? "Guardando..." : "Crear proyecto" }}
            </button>

          </div>

        </form>

      </div>
    </div>

   <!-- MODAL EDITAR -->
<div
  v-if="editOpen && canEditProjects"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
  @click.self="closeEdit"
>
  <div class="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl dark:bg-[#0e1726]">

    <!-- HEADER -->
    <div class="mb-6 flex items-start justify-between">

      <div>
        <h2 class="text-xl font-bold">
          Editar Proyecto
        </h2>

        <p class="text-sm text-gray-500">
          Actualiza la información del proyecto
        </p>
      </div>

      <button
        class="btn btn-outline-danger"
        @click="closeEdit"
      >
        Cerrar
      </button>

    </div>

    <div class="space-y-6">

      <!-- NOMBRE + DESCRIPCION -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

        <!-- NOMBRE -->
        <div>

          <label class="mb-1 block text-sm font-medium">
            Nombre *
          </label>

          <input
            v-model="editForm.nombre"
            type="text"
            maxlength="50"
            class="form-input w-full"
          />

          <p class="mt-1 text-xs text-gray-500">
            Máx. 50 caracteres
          </p>

        </div>

        <!-- DESCRIPCION -->
        <div>

          <label class="mb-1 block text-sm font-medium">
            Descripción corta *
          </label>

          <textarea
            v-model="editForm.descripcion_corta"
            maxlength="400"
            rows="3"
            class="form-textarea w-full"
          ></textarea>

          <p class="mt-1 text-xs text-gray-500">
            {{ editForm.descripcion_corta?.length || 0 }}/400 caracteres (mínimo 100)
          </p>

          <p
            v-if="editForm.descripcion_corta && editForm.descripcion_corta.length < 100"
            class="text-xs text-red-500"
          >
            La descripción debe tener al menos 100 caracteres
          </p>

        </div>

      </div>

      <!-- SELECTS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

        <!-- UNIDAD -->
        <div>

          <label class="mb-1 block text-sm font-medium">
            Unidad de negocio *
          </label>

          <select
            v-model.number="editForm.unidad_negocio_id"
            class="form-select w-full"
          >
            <option :value="null">
              Selecciona unidad
            </option>

            <option
              v-for="u in unidades"
              :key="u.id"
              :value="u.id"
            >
              {{ u.nombre_unidad }}
            </option>

          </select>

        </div>

        <!-- PLATAFORMA -->
        <div>

          <label class="mb-1 block text-sm font-medium">
            Plataforma *
          </label>

          <select
            v-model.number="editForm.plataforma_id"
            class="form-select w-full"
          >
            <option :value="null">
              Selecciona plataforma
            </option>

            <option
              v-for="p in plataformas"
              :key="p.id"
              :value="p.id"
            >
              {{ p.nombre_plataforma }}
            </option>

          </select>

        </div>

        <!-- RESPONSABLE -->
        <div>

          <label class="mb-1 block text-sm font-medium">
            Responsable *
          </label>

          <select
            v-model.number="editForm.responsable_id"
            class="form-select w-full"
            :disabled="!isAdmin"
          >
            <option :value="null">
              Selecciona responsable
            </option>

            <option
              v-for="o in owners"
              :key="o.id"
              :value="o.id"
            >
              {{ o.username }}
            </option>

          </select>

          <p
            v-if="isOwner"
            class="mt-1 text-xs text-gray-500"
          >
            Como Owner siempre serás el responsable del proyecto
          </p>

        </div>

      </div>

      <!-- BOTONES -->
      <div class="flex justify-end gap-3 pt-4 border-t dark:border-white/10">

        <button
          class="btn btn-outline-secondary"
          @click="closeEdit"
        >
          Cancelar
        </button>

        <button
          class="btn btn-primary"
          @click="saveEdit"
          :disabled="savingEdit || editForm.descripcion_corta.length < 100"
        >
          {{ savingEdit ? "Guardando..." : "Guardar cambios" }}
        </button>

      </div>

    </div>

  </div>
</div>

  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from "vue"
import api from "@/api/axios/axios"
import Swal from "sweetalert2"

const loading = ref(false)
const creating = ref(false)
const savingEdit = ref(false)

const projects = ref<any[]>([])
const unidades = ref<any[]>([])
const plataformas = ref<any[]>([])
const owners = ref<any[]>([])

const search = ref("")
const createOpen = ref(false)
const editOpen = ref(false)

const currentUser = ref<any>(null)

const isAdmin = ref(false)
const isOwner = ref(false)
const isTester = ref(false)

const canCreateProjects = computed(() => isAdmin.value || isOwner.value)
const canEditProjects = computed(() => isAdmin.value || isOwner.value)
const canDeleteProjects = computed(() => isAdmin.value)

const form = ref({
  nombre: "",
  descripcion_corta: "",
  unidad_negocio_id: null as number | null,
  plataforma_id: null as number | null,
  responsable_id: null as number | null
})

const editForm = ref({
  id: null as number | null,
  nombre: "",
  descripcion_corta: "",
  unidad_negocio_id: null as number | null,
  plataforma_id: null as number | null,
  responsable_id: null as number | null
})

const filteredProjects = computed(() => {

  const q = search.value.toLowerCase().trim()

  if (!q) return projects.value

  return projects.value.filter(p =>
    (p.nombre || "").toLowerCase().includes(q) ||
    (p.descripcion_corta || "").toLowerCase().includes(q)
  )

})

function normalizeRole(role: any) {

  return String(role || "")
    .trim()
    .toLowerCase()

}

function getUnidadId(p: any) {

  return (
    p.unidad_negocio_id ??
    p.unidad_negocio ??
    p.unidad?.id ??
    null
  )

}

function getPlataformaId(p: any) {

  return (
    p.plataforma_id ??
    p.plataforma ??
    p.plataforma_rel?.id ??
    null
  )

}

function unidadName(id: number | null) {

  if (!id) return "-"

  return unidades.value.find(
    u => u.id === id
  )?.nombre_unidad || "-"

}

function plataformaName(id: number | null) {

  if (!id) return "-"

  return plataformas.value.find(
    p => p.id === id
  )?.nombre_plataforma || "-"

}

function responsableName(p: any) {

  return (
    p.responsable_nombre ||
    owners.value.find(o => o.id === p.responsable)?.username ||
    "-"
  )

}

function resetCreateForm() {

  form.value = {
    nombre: "",
    descripcion_corta: "",
    unidad_negocio_id: null,
    plataforma_id: null,
    responsable_id: isOwner.value
      ? currentUser.value?.id
      : null
  }

}

function openCreate() {

  if (!canCreateProjects.value) return

  resetCreateForm()
  createOpen.value = true

}

function closeCreate() {

  createOpen.value = false

}

function closeEdit() {

  editOpen.value = false

}

function clearFilters() {

  search.value = ""

}

async function loadProjects() {

  loading.value = true

  try {

    const res = await api.get(
      "/itwframe/manage-project/"
    )

    projects.value = res.data?.results ?? []

  } catch {

    Swal.fire(
      "Error",
      "No se pudieron cargar los proyectos",
      "error"
    )

  } finally {

    loading.value = false

  }

}

async function loadCatalogs() {

  try {

    const [u, p] = await Promise.all([

      api.get("/itwframe/manage-unidad-negocio/"),

      api.get("/itwframe/manage-plataforma/")

    ])

    unidades.value = u.data?.results ?? []
    plataformas.value = p.data?.results ?? []

  } catch {

    unidades.value = []
    plataformas.value = []

  }

}

async function loadMe() {

  try {

    const res = await api.get(
      "/itwframe/auth/me/"
    )

    currentUser.value = res.data

    const role = normalizeRole(res.data?.role)

    const superFlag = !!res.data?.is_superuser

    isAdmin.value =
      superFlag ||
      role === "administrador" ||
      role === "superuser"

    isOwner.value = role === "owner"
    isTester.value = role === "tester"

  } catch {

    isAdmin.value = false
    isOwner.value = false
    isTester.value = false

  }

}

async function loadOwners() {

  try {

    const res = await api.get(
      "/itwframe/roles/users/"
    )

    const users =
      res.data?.results ?? res.data ?? []

    const onlyOwners = users.filter(
      (u: any) =>
        normalizeRole(u?.role) === "owner"
    )

    if (isAdmin.value) {

      owners.value = onlyOwners

    } else {

      owners.value = onlyOwners.filter(
        (u: any) =>
          u.id === currentUser.value?.id
      )

      form.value.responsable_id =
        currentUser.value?.id ?? null

    }

  } catch {

    owners.value = []

  }

}

async function handleSubmit() {

  if (!canCreateProjects.value) return

  creating.value = true

  try {

    const responsable = isOwner.value
      ? currentUser.value.id
      : form.value.responsable_id

    await api.post(
      "/itwframe/manage-project/",
      {
        nombre: form.value.nombre,
        descripcion_corta:
          form.value.descripcion_corta,
        unidad_negocio:
          form.value.unidad_negocio_id,
        plataforma:
          form.value.plataforma_id,
        responsable
      }
    )

    Swal.fire(
      "Proyecto creado",
      "Proyecto creado correctamente",
      "success"
    )

    createOpen.value = false

    resetCreateForm()

    await loadProjects()

  } catch (err: any) {

    Swal.fire(
      "Error",
      err?.response?.data?.error ||
        "No se pudo crear",
      "error"
    )

  } finally {

    creating.value = false

  }

}

function openEdit(p: any) {

  if (!canEditProjects.value) return

  editForm.value = {

    id: p.id,
    nombre: p.nombre,
    descripcion_corta:
      p.descripcion_corta,
    unidad_negocio_id:
      getUnidadId(p),
    plataforma_id:
      getPlataformaId(p),

    responsable_id: isOwner.value
      ? currentUser.value.id
      : (p.responsable ?? null)

  }

  editOpen.value = true

}

async function saveEdit() {

  if (!canEditProjects.value) return

  savingEdit.value = true

  try {

    const responsable = isOwner.value
      ? currentUser.value.id
      : editForm.value.responsable_id

    await api.put(

      `/itwframe/manage-project/${editForm.value.id}/`,

      {
        nombre: editForm.value.nombre,
        descripcion_corta:
          editForm.value.descripcion_corta,
        unidad_negocio:
          editForm.value.unidad_negocio_id,
        plataforma:
          editForm.value.plataforma_id,
        responsable
      }

    )

    Swal.fire(
      "Actualizado",
      "Proyecto actualizado",
      "success"
    )

    editOpen.value = false

    await loadProjects()

  } catch {

    Swal.fire(
      "Error",
      "No se pudo actualizar",
      "error"
    )

  } finally {

    savingEdit.value = false

  }

}

async function confirmDelete(p: any) {

  if (!canDeleteProjects.value) return

  const res = await Swal.fire({

    title: `Eliminar ${p.nombre}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar"

  })

  if (!res.isConfirmed) return

  try {

    await api.delete(
      `/itwframe/manage-project/${p.id}/`
    )

    Swal.fire(
      "Eliminado",
      "Proyecto eliminado",
      "success"
    )

    await loadProjects()

  } catch {

    Swal.fire(
      "Error",
      "No se pudo eliminar",
      "error"
    )

  }

}

onMounted(async () => {

  await loadMe()

  await Promise.all([
    loadProjects(),
    loadCatalogs()
  ])

  await loadOwners()

  resetCreateForm()

})

</script>