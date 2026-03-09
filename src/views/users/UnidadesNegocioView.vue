<template>
  <div class="p-6">

    <!-- HEADER -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-extrabold text-primary uppercase">
          UNIDADES DE NEGOCIO
        </h1>
        <p class="text-sm text-gray-500">
          Vista exclusiva para SuperUser
        </p>
      </div>

      <div class="flex items-center gap-2">
        <input
          v-model.trim="search"
          class="form-input w-[220px]"
          placeholder="Buscar unidad..."
        />

        <button
          class="btn btn-primary flex items-center gap-1"
          @click="openCreate"
        >
          + Nueva
        </button>
      </div>
    </div>

    <!-- ERROR -->
    <p v-if="error" class="mb-4 text-sm text-red-600">
      {{ error }}
    </p>

    <!-- TABLA -->
    <div class="bg-white dark:bg-[#0e1726] rounded-md shadow p-5">

      <div class="overflow-x-auto">
        <table class="w-full text-sm">

          <thead>
            <tr class="border-b text-left">
              <th class="p-3">ID</th>
              <th class="p-3">Nombre</th>
              <th class="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="u in filteredUnidades"
              :key="u.id"
              class="border-b"
            >
              <td class="p-3">
                {{ u.id }}
              </td>

              <td class="p-3">
                {{ u.nombre_unidad }}
              </td>

              <td class="p-3">
                <div class="flex justify-end gap-2">

                  <button
                    class="btn btn-outline-primary btn-sm"
                    @click="openEdit(u)"
                  >
                    Editar
                  </button>

                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="confirmDelete(u)"
                  >
                    Eliminar
                  </button>

                </div>
              </td>
            </tr>

            <tr v-if="!loading && filteredUnidades.length === 0">
              <td
                colspan="3"
                class="p-6 text-center text-gray-500"
              >
                No hay unidades para mostrar
              </td>
            </tr>

          </tbody>

        </table>
      </div>

      <p
        v-if="loading"
        class="mt-4 text-sm text-gray-500 text-center"
      >
        Cargando...
      </p>

    </div>

    <!-- MODAL -->
    <div
      v-if="modal.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="closeModal"
    >
      <div
        class="bg-white dark:bg-[#0e1726] rounded-md shadow-lg p-6 w-full max-w-md"
      >
        <h2 class="text-lg font-bold mb-4">
          {{ modal.mode === 'create' ? 'Nueva Unidad' : 'Editar Unidad' }}
        </h2>

        <label class="block text-sm mb-1">
          Nombre de la unidad
        </label>

        <input
          v-model.trim="form.nombre_unidad"
          class="form-input"
          placeholder="Ej. Operaciones"
        />

        <p
          v-if="modalError"
          class="mt-2 text-sm text-red-600"
        >
          {{ modalError }}
        </p>

        <div class="mt-5 flex justify-end gap-2">
          <button
            class="btn btn-outline-secondary"
            @click="closeModal"
          >
            Cancelar
          </button>

          <button
            class="btn btn-primary"
            @click="save"
            :disabled="saving"
          >
            {{ saving ? "Guardando..." : "Guardar" }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from '@/composables/use-meta'
import api from '@/api/axios/axios'
import Swal from 'sweetalert2'

type Unidad = {
  id: number
  nombre_unidad: string
}

export default defineComponent({
  name: 'UnidadesNegocioView',

  setup() {
    useMeta({ title: 'Unidades de Negocio' })
  },

  data() {
    return {
      loading: false,
      saving: false,
      error: '',
      modalError: '',
      search: '',
      unidades: [] as Unidad[],
      modal: {
        open: false,
        mode: 'create' as 'create' | 'edit',
        id: null as number | null,
      },
      form: {
        nombre_unidad: '',
      },
    }
  },

  computed: {
    filteredUnidades(): Unidad[] {
      const q = this.search.toLowerCase().trim()
      if (!q) return this.unidades
      return this.unidades.filter((u) =>
        (u.nombre_unidad || '').toLowerCase().includes(q)
      )
    },
  },

  async mounted() {
    await this.guardSuperUser()
    await this.getUnidades()
  },

  methods: {
    async guardSuperUser() {
      try {
        const res = await api.get('itwframe/auth/me/')
        if (!res.data?.is_superuser) {
          await Swal.fire(
            'Acceso denegado',
            'Solo SuperUser puede entrar aquí.',
            'error'
          )
          this.$router.push('/dashboard')
        }
      } catch (e) {
        this.$router.push('/auth/boxed-signin')
      }
    },

    async getUnidades() {
      this.loading = true
      this.error = ''

      try {
        const res = await api.get('itwframe/manage-unidad-negocio/')
        this.unidades = res.data?.results || []
      } catch (err: any) {
        this.error =
          err?.response?.data?.error || 'Error al cargar unidades'
      } finally {
        this.loading = false
      }
    },

    openCreate() {
      this.modal.open = true
      this.modal.mode = 'create'
      this.modal.id = null
      this.form.nombre_unidad = ''
      this.modalError = ''
    },

    openEdit(u: Unidad) {
      this.modal.open = true
      this.modal.mode = 'edit'
      this.modal.id = u.id
      this.form.nombre_unidad = u.nombre_unidad
      this.modalError = ''
    },

    closeModal() {
      this.modal.open = false
      this.modalError = ''
    },

    async save() {
      this.modalError = ''

      if (!this.form.nombre_unidad) {
        this.modalError = 'El nombre es obligatorio.'
        return
      }

      this.saving = true

      try {
        if (this.modal.mode === 'create') {
          await api.post('itwframe/manage-unidad-negocio/', {
            nombre_unidad: this.form.nombre_unidad,
          })

          await Swal.fire(
            'Listo',
            'Unidad creada correctamente',
            'success'
          )
        } else {
          await api.put(
            `itwframe/manage-unidad-negocio/${this.modal.id}/`,
            {
              nombre_unidad: this.form.nombre_unidad,
            }
          )

          await Swal.fire(
            'Listo',
            'Unidad actualizada correctamente',
            'success'
          )
        }

        this.closeModal()
        await this.getUnidades()
      } catch (err: any) {
        this.modalError =
          err?.response?.data?.error || 'Error al guardar'
      } finally {
        this.saving = false
      }
    },

    async confirmDelete(u: Unidad) {
      const result = await Swal.fire({
        icon: 'warning',
        title: '¿Eliminar unidad?',
        text: `Se eliminará "${u.nombre_unidad}".`,
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      })

      if (!result.isConfirmed) return

      try {
        await api.delete(
          `itwframe/manage-unidad-negocio/${u.id}/`
        )

        await Swal.fire(
          'Eliminada',
          'Unidad eliminada correctamente',
          'success'
        )

        await this.getUnidades()
      } catch (err: any) {
        await Swal.fire(
          'Error',
          err?.response?.data?.error ||
            'No se pudo eliminar',
          'error'
        )
      }
    },
  },
})
</script>