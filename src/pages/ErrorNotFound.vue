<template>
  <q-page padding class="flex flex-center">
    <div class="text-center">
      <h1>Error 404</h1>
      <p>La página que buscas no se encontró.</p>
      <q-btn label="Volver al inicio" @click="goHome" color="primary" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'ErrorNotFund',
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 3em;
  margin-bottom: 0.5em;
}
</style>
