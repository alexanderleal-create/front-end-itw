<template>
  <div class="p-6">
    <!-- BREADCRUMB -->
    <nav class="mb-4 text-sm text-gray-500">
      <ol class="flex items-center gap-1 flex-wrap">
        <li>
          <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
        </li>
        <li class="mx-1">/</li>
        <li class="text-primary font-semibold">Proyectos</li>
      </ol>
    </nav>

    <!-- HEADER -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-extrabold text-primary uppercase">PROYECTOS</h1>
        <p class="text-sm text-gray-500">
          Selecciona un proyecto para continuar con casos de prueba (próximamente).
        </p>
      </div>

      <div class="flex items-center gap-2">
        <router-link to="/project/create" class="btn btn-primary">
          Nuevo proyecto
        </router-link>

        <button
          class="btn btn-outline-primary"
          @click="loadProjects"
          :disabled="loading"
          title="Actualizar"
        >
          {{ loading ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>
    </div>

    <!-- ALERT -->
    <div
      v-if="error"
      class="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- CARD -->
    <div class="bg-white dark:bg-[#0e1726] rounded-md shadow border border-gray-100 dark:border-white/10 overflow-hidden">
      <!-- Controls -->
      <div class="p-4 border-b border-gray-200 dark:border-white/10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div class="w-full md:w-[420px]">
            <input
              v-model="search"
              type="text"
              placeholder="Buscar proyecto (nombre / descripción)"
              class="w-full px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-[#1a233a]
                     border border-transparent focus:border-primary/40 focus:outline-none"
            />
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <select v-model="filterIntegracion" class="form-select w-full sm:w-[220px]">
              <option value="all">Todos</option>
              <option value="true">Integración activa</option>
              <option value="false">Integración inactiva</option>
            </select>

            <button class="btn btn-outline-danger" @click="clearFilters" :disabled="loading">
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- Small helper line -->
        <div class="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <span>
            Mostrando <strong>{{ filteredProjects.length }}</strong> de <strong>{{ projects.length }}</strong>
          </span>
          <span v-if="search || filterIntegracion !== 'all'" class="text-gray-400">
            Filtros aplicados
          </span>
        </div>
      </div>

      <!-- ===================== MOBILE (CARDS) ===================== -->
      <div class="block md:hidden p-4">
        <!-- Skeleton -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="rounded-md border border-gray-100 dark:border-white/10 p-4 animate-pulse">
            <div class="h-4 w-2/3 bg-gray-200 dark:bg-white/10 rounded mb-2"></div>
            <div class="h-3 w-1/2 bg-gray-200 dark:bg-white/10 rounded mb-4"></div>
            <div class="flex gap-2">
              <div class="h-8 w-20 bg-gray-200 dark:bg-white/10 rounded"></div>
              <div class="h-8 w-20 bg-gray-200 dark:bg-white/10 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredProjects.length === 0" class="rounded-md border border-gray-100 dark:border-white/10 p-6 text-center">
          <p class="font-semibold">No hay proyectos</p>
          <p class="text-sm text-gray-500 mt-1">Crea tu primer proyecto o actualiza la lista.</p>
          <div class="mt-4 flex flex-col gap-2">
            <router-link to="/project/create" class="btn btn-primary">Crear proyecto</router-link>
            <button class="btn btn-outline-primary" @click="loadProjects">Actualizar</button>
          </div>
        </div>

        <!-- Cards -->
        <div v-else class="space-y-3">
          <div
            v-for="p in filteredProjects"
            :key="p.id"
            class="rounded-md border border-gray-100 dark:border-white/10 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-semibold truncate">{{ p.nombre }}</p>
                <p class="text-xs text-gray-500 truncate">
                  {{ p.descripcion_corta || 'Sin descripción' }}
                </p>
              </div>

              <span
                class="px-2 py-1 rounded-full text-xs font-semibold border flex-none"
                :class="p.estado_integracion
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-gray-100 text-gray-600'"
              >
                {{ p.estado_integracion ? 'Activa' : 'Inactiva' }}
              </span>
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <span class="text-gray-400">Unidad:</span>
                <span class="ml-1 font-medium text-gray-700 dark:text-gray-200">
                  {{ unidadName(p.unidad_negocio_id) }}
                </span>
              </div>
              <div class="text-right">
                <span class="text-gray-400">Plataforma:</span>
                <span class="ml-1 font-medium text-gray-700 dark:text-gray-200">
                  {{ p.plataforma_id ?? '-' }}
                </span>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <button class="btn btn-outline-primary opacity-60 cursor-not-allowed" disabled title="Próximamente: casos de prueba">
                Ver
              </button>
              <button class="btn btn-outline-primary" @click="openEdit(p)">Editar</button>
              <button class="btn btn-outline-danger" @click="confirmDelete(p)">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================== DESKTOP (TABLE) ===================== -->
      <div class="hidden md:block">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[980px] text-sm">
            <thead class="bg-gray-50 dark:bg-white/5 sticky top-0 z-10">
              <tr class="text-left">
                <th class="p-3">Nombre</th>
                <th class="p-3">Descripción</th>
                <th class="p-3">Integración</th>
                <th class="p-3">Unidad</th>
                <th class="p-3">Plataforma</th>
                <th class="p-3 w-[220px]">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <!-- Skeleton rows -->
              <tr v-if="loading" v-for="i in 6" :key="'sk-'+i" class="border-t border-gray-100 dark:border-white/10 animate-pulse">
                <td class="p-3">
                  <div class="h-4 w-2/3 bg-gray-200 dark:bg-white/10 rounded"></div>
                  <div class="h-3 w-1/4 bg-gray-200 dark:bg-white/10 rounded mt-2"></div>
                </td>
                <td class="p-3">
                  <div class="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded"></div>
                </td>
                <td class="p-3">
                  <div class="h-6 w-20 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                </td>
                <td class="p-3">
                  <div class="h-4 w-1/2 bg-gray-200 dark:bg-white/10 rounded"></div>
                </td>
                <td class="p-3">
                  <div class="h-4 w-1/3 bg-gray-200 dark:bg-white/10 rounded"></div>
                </td>
                <td class="p-3">
                  <div class="flex gap-2">
                    <div class="h-8 w-16 bg-gray-200 dark:bg-white/10 rounded"></div>
                    <div class="h-8 w-16 bg-gray-200 dark:bg-white/10 rounded"></div>
                    <div class="h-8 w-16 bg-gray-200 dark:bg-white/10 rounded"></div>
                  </div>
                </td>
              </tr>

              <!-- Data rows -->
              <tr
                v-else
                v-for="p in filteredProjects"
                :key="p.id"
                class="border-t border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <td class="p-3 font-semibold">
                  <div class="flex items-center gap-2">
                    <span class="truncate max-w-[320px]">{{ p.nombre }}</span>
                    <span class="text-[11px] text-gray-400">#{{ p.id }}</span>
                  </div>
                </td>

                <td class="p-3 text-gray-600 dark:text-gray-300">
                  <span class="truncate block max-w-[360px]">
                    {{ p.descripcion_corta || "Sin descripción" }}
                  </span>
                </td>

                <td class="p-3">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-semibold border"
                    :class="p.estado_integracion
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-gray-100 text-gray-600'"
                  >
                    {{ p.estado_integracion ? "Activa" : "Inactiva" }}
                  </span>
                </td>

                <td class="p-3">
                  {{ unidadName(p.unidad_negocio_id) }}
                </td>

                <td class="p-3">
                  {{ p.plataforma_id ?? "-" }}
                </td>

                <td class="p-3">
                  <div class="flex flex-wrap gap-2">
                    <button class="btn btn-outline-primary opacity-60 cursor-not-allowed" disabled title="Próximamente: casos de prueba">
                      Ver
                    </button>

                    <button class="btn btn-outline-primary" @click="openEdit(p)">
                      Editar
                    </button>

                    <button class="btn btn-outline-danger" @click="confirmDelete(p)">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty -->
              <tr v-if="!loading && filteredProjects.length === 0" class="border-t border-gray-100 dark:border-white/10">
                <td colspan="6" class="p-10">
                  <div class="text-center">
                    <p class="font-semibold">No hay proyectos con esos filtros</p>
                    <p class="text-sm text-gray-500 mt-1">
                      Prueba cambiando la búsqueda o limpia los filtros.
                    </p>
                    <div class="mt-4 flex items-center justify-center gap-2">
                      <button class="btn btn-outline-danger" @click="clearFilters">Limpiar filtros</button>
                      <button class="btn btn-outline-primary" @click="loadProjects">Actualizar</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500">
          Mostrando <strong>{{ filteredProjects.length }}</strong> de <strong>{{ projects.length }}</strong>
        </div>
      </div>
    </div>

    <!-- ===================== EDIT MODAL ===================== -->
    <div v-if="editOpen" class="fixed inset-0 z-[80]">
      <div class="absolute inset-0 bg-black/30" @click="closeEdit"></div>

      <div
        class="absolute left-1/2 top-1/2 w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2
               bg-white dark:bg-[#0e1726] rounded-md shadow border border-gray-200 dark:border-white/10 p-5"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Editar proyecto</h3>
          <button class="btn btn-outline-danger" @click="closeEdit">Cerrar</button>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm mb-1">Nombre</label>
            <input v-model="editForm.nombre" class="form-input w-full" maxlength="30" />
          </div>
          <div>
            <label class="block text-sm mb-1">Descripción corta</label>
            <input v-model="editForm.descripcion_corta" class="form-input w-full" maxlength="50" />
          </div>
          <div class="flex items-center gap-3">
            <input id="edit_integracion" type="checkbox" class="form-checkbox" v-model="editForm.estado_integracion" />
            <label for="edit_integracion" class="text-sm">Integración activa</label>
          </div>
        </div>

        <div class="mt-5 flex gap-3">
          <button class="btn btn-primary" @click="saveEdit" :disabled="savingEdit">
            {{ savingEdit ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <button class="btn btn-outline-danger" @click="closeEdit" :disabled="savingEdit">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import api from "@/api/axios/axios";

const loading = ref(false);
const error = ref("");

const projects = ref([]);
const unidades = ref([]);

const search = ref("");
const filterIntegracion = ref("all");

/* ======= Edit ======= */
const editOpen = ref(false);
const savingEdit = ref(false);
const editForm = ref({
  id: null,
  nombre: "",
  descripcion_corta: "",
  estado_integracion: true,
});

function clearFilters() {
  search.value = "";
  filterIntegracion.value = "all";
}

function unidadName(unidadId) {
  const u = unidades.value.find((x) => x.id === unidadId);
  return u ? u.nombre_unidad : (unidadId ?? "-");
}

async function loadUnidades() {
  try {
    const res = await api.get("/itwframe/manage-unidad-negocio/");
    unidades.value = res.data?.results ?? [];
  } catch (e) {
    unidades.value = [];
  }
}

async function loadProjects() {
  loading.value = true;
  error.value = "";
  try {
    const res = await api.get("/itwframe/manage-project/");
    projects.value = res.data?.results ?? [];
  } catch (e) {
    projects.value = [];
    error.value = "No se pudieron cargar los proyectos.";
  } finally {
    loading.value = false;
  }
}

const filteredProjects = computed(() => {
  const q = search.value.trim().toLowerCase();

  return projects.value
    .filter((p) => {
      if (!q) return true;
      return (
        (p.nombre || "").toLowerCase().includes(q) ||
        (p.descripcion_corta || "").toLowerCase().includes(q)
      );
    })
    .filter((p) => {
      if (filterIntegracion.value === "all") return true;
      const v = filterIntegracion.value === "true";
      return Boolean(p.estado_integracion) === v;
    });
});

/* ======= Editar ======= */
function openEdit(p) {
  editForm.value = {
    id: p.id,
    nombre: p.nombre,
    descripcion_corta: p.descripcion_corta,
    estado_integracion: !!p.estado_integracion,
  };
  editOpen.value = true;
}

function closeEdit() {
  editOpen.value = false;
}

async function saveEdit() {
  if (!editForm.value.id) return;

  savingEdit.value = true;
  try {
    await api.put(`/itwframe/manage-project/${editForm.value.id}`, {
      nombre: editForm.value.nombre,
      descripcion_corta: editForm.value.descripcion_corta,
      estado_integracion: editForm.value.estado_integracion,
    });
    await loadProjects();
    closeEdit();
  } catch (e) {
    error.value = "No se pudo actualizar el proyecto.";
  } finally {
    savingEdit.value = false;
  }
}

/* ======= Eliminar ======= */
async function confirmDelete(p) {
  const ok = confirm(`¿Eliminar el proyecto "${p.nombre}"?`);
  if (!ok) return;

  try {
    await api.delete(`/itwframe/manage-project/${p.id}`);
    await loadProjects();
  } catch (e) {
    error.value = "No se pudo eliminar el proyecto.";
  }
}

onMounted(async () => {
  await Promise.all([loadUnidades(), loadProjects()]);
});
</script>

