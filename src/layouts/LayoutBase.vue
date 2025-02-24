<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Layout Base
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- PAGE CONTAINER -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- FOOTER -->
    <q-footer elevated class="text-center">
      <div class="q-pa-md">
        Footer del layout base
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "LayoutBase",
  data() {
    return {
      leftDrawerOpen: false
    };
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    }
  }
};
</script>

<style scoped>
/* Puedes incluir aquí tus estilos personalizados */
</style>
