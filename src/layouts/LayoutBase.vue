<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="!isLoginPage"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Prueba CRUD </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer v-if="!isLoginPage" v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header>Menú Principal</q-item-label>

        <q-item clickable v-ripple to="/products">
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section>Productos</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/other">
          <q-item-section avatar>
            <q-icon name="web" />
          </q-item-section>
          <q-item-section>Otra Página</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- PAGE CONTAINER -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- FOOTER -->
    <q-footer elevated class="text-center">
      <div class="q-pa-md">Footer del layout base</div>
    </q-footer>
  </q-layout>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'LayoutBase',
  setup() {
    const route = useRoute()
    const isLoginPage = computed(() => route.path === '/login')

    return {
      isLoginPage,
    }
  },
  data() {
    return {
      leftDrawerOpen: false,
    }
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
  },
}
</script>

<style scoped>
/* Puedes incluir aquí tus estilos personalizados */
</style>
