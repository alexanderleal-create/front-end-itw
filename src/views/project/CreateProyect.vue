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
              maxlength="30"
              :disabled="loading"
            />
            <p class="mt-1 text-xs text-gray-500">Máx. 30 caracteres</p>
          </div>

          <div>
            <label class="block text-sm mb-1">Descripción corta *</label>
            <input
              v-model.trim="form.descripcion_corta"
              type="text"
              class="form-input w-full"
              maxlength="50"
              :disabled="loading"
            />
            <p class="mt-1 text-xs text-gray-500">Máx. 50 caracteres</p>
          </div>
        </div>

        <!-- ROW 2 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          <div>
            <label class="block text-sm mb-1">Unidad de negocio *</label>
            <select
              v-model.number="form.id_unidad_negocio"
              class="form-select w-full"
              :disabled="loading || catalogsLoading"
            >
              <option :value="null" disabled>Selecciona una unidad...</option>
              <option
                v-for="u in unidadesNegocio"
                :key="u.id_unidad_negocio"
                :value="u.id_unidad_negocio"
              >
                {{ u.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm mb-1">Plataforma *</label>
            <select
              v-model.number="form.id_plataforma"
              class="form-select w-full"
              :disabled="loading || catalogsLoading"
            >
              <option :value="null" disabled>Selecciona una plataforma...</option>
              <option
                v-for="p in plataformas"
                :key="p.id_plataforma"
                :value="p.id_plataforma"
              >
                {{ p.nombre_plataforma }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-3 md:justify-end">
            <input
              id="status_integracion"
              type="checkbox"
              class="form-checkbox"
              v-model="form.status_integracion"
              :disabled="loading"
            />
            <label for="status_integracion" class="text-sm">
              Integración activa
            </label>
          </div>
        </div>

        <!-- ================= TESTERS TABLE ================= -->
        <div class="border-t pt-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div>
              <h2 class="text-base font-semibold">Asignar testers</h2>
            </div>

            <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
              <input
                v-model="testerSearch"
                type="text"
                placeholder="Buscar tester (usuario)"
                class="w-full sm:w-[280px] px-3 py-2 text-sm rounded-md
                       bg-gray-100 dark:bg-[#1a233a]
                       border border-transparent focus:border-primary/40 focus:outline-none"
                :disabled="loading || testersLoading"
              />

              
            </div>
          </div>

          <div v-if="testersLoading" class="text-sm text-gray-400 py-3">
            Cargando testers...
          </div>

          <div
            v-else
            class="rounded-md border border-gray-200 dark:border-white/10 overflow-hidden"
          >
            <div class="overflow-x-auto">
              <table class="w-full min-w-[720px] text-sm">
                <thead class="bg-gray-50 dark:bg-white/5">
                  <tr class="text-left">
                    <th class="p-3 w-[60px]">
                      <input
                        type="checkbox"
                        class="form-checkbox"
                        :checked="allSelectedVisible"
                        @change="toggleAllTesters"
                        :disabled="loading || filteredTesters.length === 0"
                      />
                    </th>
                    <th class="p-3">Usuario</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="t in filteredTesters"
                    :key="t.id"
                    class="border-t border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <td class="p-3">
                      <input
                        type="checkbox"
                        class="form-checkbox"
                        :value="t.id"
                        v-model="form.tester_ids"
                        :disabled="loading"
                      />
                    </td>
                    <td class="p-3 font-medium">{{ t.username || '-' }}</td>
                  </tr>

                  <tr v-if="filteredTesters.length === 0">
                    <td class="p-4 text-gray-400" colspan="4">
                      No hay testers disponibles.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p class="mt-2 text-xs text-gray-500">
            Seleccionados: <strong>{{ form.tester_ids.length }}</strong>
          </p>
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

    <!-- ================== PANEL DERECHO DESPLEGABLE (DRAWER) ================== -->
    <div
      v-show="projectsDrawerOpen"
      class="fixed inset-0 z-[60]"
      aria-hidden="true"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/30"
        @click="closeProjectsPanel()"
      ></div>

      <!-- Drawer (abre hacia la derecha) -->
      <aside
        class="absolute right-0 top-0 h-full w-[92vw] sm:w-[420px]
               bg-white dark:bg-[#0e1726]
               border-l border-gray-200 dark:border-white/10
               shadow-xl
               transform transition-transform duration-300"
        :class="projectsDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="h-full flex flex-col">
          <!-- Drawer header -->
          <div class="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <div>
              <p class="font-semibold">Proyectos</p>
              <p class="text-xs text-gray-500">Lista y búsqueda</p>
            </div>

            <button
              type="button"
              class="btn btn-outline-danger"
              @click="closeProjectsPanel()"
            >
              Cerrar
            </button>
          </div>

          <!-- Search -->
          <div class="p-4">
            <input
              v-model="projectSearch"
              type="text"
              placeholder="Buscar proyecto"
              class="w-full px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-[#1a233a]
                     border border-transparent focus:border-primary/40 focus:outline-none"
            />
          </div>

          <!-- List -->
          <div class="flex-1 overflow-y-auto px-4 pb-4">
            <div v-if="projectsLoading" class="text-sm text-gray-400 py-2">
              Cargando proyectos...
            </div>

            <div v-else-if="filteredProjects.length === 0" class="text-sm text-gray-400 py-2">
              No hay proyectos creados.
            </div>

            <button
              v-for="p in filteredProjects"
              :key="p.id_proyecto"
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

          <!-- Footer -->
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

<script setup>
import { computed, onMounted, ref } from "vue";
import api from "@/api/axios/axios";

const loading = ref(false);
const testersLoading = ref(false);
const projectsLoading = ref(false);
const catalogsLoading = ref(false);

const error = ref("");
const success = ref("");

const unidadesNegocio = ref([]);
const projects = ref([]);
const testers = ref([]);

const projectsDrawerOpen = ref(false);

const projectSearch = ref("");
const testerSearch = ref("");

const form = ref({
  nombre: "",
  descripcion_corta: "",
  estado_integracion: true,
  unidad_negocio_id: null,
  plataforma_id: null,
  tester_ids: [],
});

/* ================================
   TESTERS 
================================ */
async function loadTesters() {
  testersLoading.value = true;
  try {
    const res = await api.get("/itwframe/roles/users/");
    const raw = res.data ?? [];

    testers.value = raw.filter(
      (u) => u.role && u.role.toLowerCase() === "tester"
    );
  } catch (e) {
    testers.value = [];
  } finally {
    testersLoading.value = false;
  }
}

const filteredTesters = computed(() => {
  const q = testerSearch.value.toLowerCase();
  if (!q) return testers.value;

  return testers.value.filter((t) =>
    t.username.toLowerCase().includes(q)
  );
});

/* ================================
   UNIDAD NEGOCIO
================================ */
async function loadUnidades() {
  catalogsLoading.value = true;
  try {
    const res = await api.get("/itwframe/manage-unidad-negocio/");
    unidadesNegocio.value = res.data.results ?? [];
  } catch (e) {
    error.value = "No se pudieron cargar las unidades.";
  } finally {
    catalogsLoading.value = false;
  }
}

/* ================================
   PROYECTOS 
================================ */
async function loadProjects() {
  projectsLoading.value = true;
  try {
    const res = await api.get("/itwframe/manage-project/");
    projects.value = res.data.results ?? [];
  } catch (e) {
    projects.value = [];
  } finally {
    projectsLoading.value = false;
  }
}

const filteredProjects = computed(() => {
  const q = projectSearch.value.toLowerCase();
  if (!q) return projects.value;

  return projects.value.filter((p) =>
    p.nombre.toLowerCase().includes(q)
  );
});

function openProjectsPanel() {
  projectsDrawerOpen.value = true;
}

function closeProjectsPanel() {
  projectsDrawerOpen.value = false;
}

/* ================================
   CREAR PROYECTO
================================ */
async function handleSubmit() {
  error.value = "";
  success.value = "";

  if (!form.value.nombre) {
    error.value = "El nombre es obligatorio.";
    return;
  }

  loading.value = true;
  try {
    const payload = {
      nombre: form.value.nombre,
      descripcion_corta: form.value.descripcion_corta,
      estado_integracion: form.value.estado_integracion,
      unidad_negocio_id: form.value.unidad_negocio_id,
      plataforma_id: form.value.plataforma_id,
    };

    const res = await api.post(
      "/itwframe/manage-project/",
      payload
    );

    success.value = "Proyecto creado correctamente.";
    form.value.nombre = "";
    form.value.descripcion_corta = "";
    form.value.tester_ids = [];

    await loadProjects();
  } catch (e) {
    error.value = "Error al crear el proyecto.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadTesters();
  loadUnidades();
  loadProjects();
});
</script>