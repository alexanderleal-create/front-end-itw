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
          Selecciona un proyecto para continuar con casos de prueba.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <router-link
          to="/project/create"
          class="btn btn-primary"
        >
          Nuevo proyecto
        </router-link>

        <button
          class="btn btn-outline-primary"
          @click="loadProjects"
          :disabled="loading"
        >
          {{ loading ? "Actualizando..." : "Actualizar" }}
        </button>
      </div>
    </div>

    <!-- CARD -->
    <div class="bg-white dark:bg-[#0e1726] rounded-md shadow border border-gray-100 dark:border-white/10 overflow-hidden">

      <!-- FILTROS -->
      <div class="p-4 border-b border-gray-200 dark:border-white/10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <input
            v-model="search"
            type="text"
            placeholder="Buscar proyecto..."
            class="form-input w-full md:w-[420px]"
          />

          <select
            v-model="filterIntegracion"
            class="form-select w-full md:w-[220px]"
          >
            <option value="all">Todos</option>
            <option value="sin_integracion">Sin integración</option>
            <option value="azure">Azure DevOps</option>
            <option value="xray">XRAY</option>
          </select>

          <button
            class="btn btn-outline-danger"
            @click="clearFilters"
          >
            Limpiar filtros
          </button>
        </div>

        <div class="mt-3 text-xs text-gray-500">
          Mostrando
          <strong>{{ filteredProjects.length }}</strong>
          de
          <strong>{{ projects.length }}</strong>
        </div>
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">

          <thead class="bg-gray-50 dark:bg-white/5">
            <tr>
              <th class="p-3 text-left">Nombre</th>
              <th class="p-3 text-left">Descripción</th>
              <th class="p-3 text-left">Unidad</th>
              <th class="p-3 text-left">Plataforma</th>
              <th class="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="p in filteredProjects"
              :key="p.id"
              class="border-t border-gray-100 dark:border-white/10"
            >
              <td class="p-3 font-semibold">
                {{ p.nombre }}
                <span class="text-xs text-gray-400 ml-2">
                  #{{ p.id }}
                </span>
              </td>

              <td class="p-3 text-gray-600 dark:text-gray-300">
                {{ p.descripcion_corta || "Sin descripción" }}
              </td>

              <td class="p-3">
                {{ unidadName(p.unidad_negocio_id) }}
              </td>

              <td class="p-3">
                {{ plataformaName(p.plataforma_id) }}
              </td>

              <td class="p-3">
                <div class="flex gap-2">

                  <button
                    class="btn btn-outline-primary opacity-60 cursor-not-allowed"
                    disabled
                  >
                    Ver
                  </button>

                  <button
                    class="btn btn-outline-primary"
                    @click="openEdit(p)"
                  >
                    Editar
                  </button>

                  <button
                    class="btn btn-outline-danger"
                    @click="confirmDelete(p)"
                  >
                    Eliminar
                  </button>

                </div>
              </td>
            </tr>

            <tr v-if="filteredProjects.length === 0">
              <td colspan="5" class="p-10 text-center">
                <p class="font-semibold">
                  No hay proyectos
                </p>
                <p class="text-sm text-gray-500">
                  Crea un proyecto para comenzar
                </p>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>

    <!-- MODAL EDIT -->
    <div
      v-if="editOpen"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-[#0e1726] p-6 rounded-md w-[420px]">

        <h2 class="text-lg font-bold mb-4">
          Editar Proyecto
        </h2>

        <div class="space-y-3">

          <input
            v-model="editForm.nombre"
            class="form-input w-full"
            placeholder="Nombre"
          />

          <textarea
            v-model="editForm.descripcion_corta"
            class="form-input w-full"
            placeholder="Descripción"
          ></textarea>

        </div>

        <div class="flex justify-end gap-2 mt-5">

          <button
            class="btn btn-outline-secondary"
            @click="closeEdit"
          >
            Cancelar
          </button>

          <button
            class="btn btn-primary"
            @click="saveEdit"
            :disabled="savingEdit"
          >
            Guardar
          </button>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import api from "@/api/axios/axios"
import Swal from "sweetalert2"

const loading = ref(false)

const projects = ref([])
const unidades = ref([])
const plataformas = ref([])

const search = ref("")
const filterIntegracion = ref("all")

const editOpen = ref(false)
const savingEdit = ref(false)

const editForm = ref({
  id: null,
  nombre: "",
  descripcion_corta: "",
})

function clearFilters(){
  search.value=""
  filterIntegracion.value="all"
}

function unidadName(id){
  const u = unidades.value.find(x=>x.id===id)
  return u ? u.nombre_unidad : "-"
}

function plataformaName(id){
  const p = plataformas.value.find(x=>x.id===id)
  return p ? p.nombre_plataforma : "-"
}

async function loadUnidades(){
  const res = await api.get("/itwframe/manage-unidad-negocio/")
  unidades.value = res.data?.results ?? []
}

async function loadPlataformas(){
  const res = await api.get("/itwframe/manage-plataforma/")
  plataformas.value = res.data?.results ?? []
}

async function loadProjects(){

  loading.value=true

  try{

    const res = await api.get("/itwframe/manage-project/")
    projects.value = res.data?.results ?? []

  }catch{

    Swal.fire(
      "Error",
      "No se pudieron cargar los proyectos",
      "error"
    )

  }finally{
    loading.value=false
  }

}

const filteredProjects = computed(()=>{

  const q = search.value.toLowerCase()

  return projects.value
    .filter(p=>{
      if(!q) return true
      return (
        (p.nombre||"").toLowerCase().includes(q) ||
        (p.descripcion_corta||"").toLowerCase().includes(q)
      )
    })
})

function openEdit(p){

  editForm.value={
    id:p.id,
    nombre:p.nombre,
    descripcion_corta:p.descripcion_corta
  }

  editOpen.value=true
}

function closeEdit(){
  editOpen.value=false
}

async function saveEdit(){

  savingEdit.value=true

  try{

    await api.put(`/itwframe/manage-project/${editForm.value.id}`,{
      nombre:editForm.value.nombre,
      descripcion_corta:editForm.value.descripcion_corta
    })

    Swal.fire(
      "Actualizado",
      "Proyecto actualizado correctamente",
      "success"
    )

    await loadProjects()
    closeEdit()

  }catch{

    Swal.fire(
      "Error",
      "No se pudo actualizar",
      "error"
    )

  }finally{
    savingEdit.value=false
  }

}

async function confirmDelete(p){

  const res = await Swal.fire({
    title:`Eliminar ${p.nombre}?`,
    text:"Esta acción no se puede deshacer",
    icon:"warning",
    showCancelButton:true,
    confirmButtonText:"Eliminar",
    cancelButtonText:"Cancelar"
  })

  if(!res.isConfirmed) return

  try{

    await api.delete(`/itwframe/manage-project/${p.id}/`)

    Swal.fire(
      "Eliminado",
      "Proyecto eliminado correctamente",
      "success"
    )

    await loadProjects()

  }catch{

    Swal.fire(
      "Error",
      "No se pudo eliminar",
      "error"
    )

  }

}

onMounted(async()=>{
  await Promise.all([
    loadProjects(),
    loadUnidades(),
    loadPlataformas()
  ])
})
</script>