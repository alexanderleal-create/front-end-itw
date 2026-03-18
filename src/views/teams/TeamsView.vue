<template>
  <div class="p-6">
    <!-- HEADER -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-extrabold uppercase text-primary">
          Gestión de Equipos
        </h1>
        <p class="text-sm text-gray-500">
          Administración de equipos, miembros y proyectos
        </p>
      </div>
    </div>

    <!-- TABS -->
    <div class="rounded-md bg-white shadow dark:bg-[#0e1726]">
      <div class="flex border-b">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-3 text-sm font-semibold transition',
            activeTab === tab.id
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-primary'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="p-6">

        <TeamsTab v-if="activeTab === 'teams'" />

        <ManageMembers v-if="activeTab === 'members'" />

        <AssignProject v-if="activeTab === 'project'" />

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from "vue"

import TeamsTab from "./tabs/TeamsTab.vue"
import ManageMembers from "./tabs/ManageMembers.vue"
import AssignProject from "./tabs/AssignProject.vue"

const tabs = [
  { id: "teams", label: "Equipos" },
  { id: "members", label: "Administrar Miembros" },
  { id: "project", label: "Asignar Proyecto" }
]

const activeTab = ref("teams")

</script>