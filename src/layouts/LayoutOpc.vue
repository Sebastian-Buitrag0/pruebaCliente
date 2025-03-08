<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <q-input dense debounce="300" placeholder="Buscar..." outlined class="q-ml-md"
          style="width: 600px; background-color: #ffffff;">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>


    <!-- PANEL LATERAL (drawer) -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered show-if-above>
      <q-list>
        <q-item clickable>
          <q-item-section>
            Opción 1
          </q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>
            Opción 2
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

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
