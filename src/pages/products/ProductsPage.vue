<template>
  <q-page>
    <q-table :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 20, 50]">
      <template v-slot:top>
        <q-toolbar>
          <q-toolbar-title>Products</q-toolbar-title>
        </q-toolbar>
      </template>
    </q-table>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { name: 'id', required: true, label: 'ID', align: 'left', field: row => row.id, format: val => `${val}`, sortable: true },
        { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
        { name: 'price', align: 'right', label: 'Price', field: 'price', sortable: true }
      ],
      rows: [
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        { id: 3, name: 'Product 3', price: 300 },
        { id: 4, name: 'Product 4', price: 400 },
        { id: 5, name: 'Product 5', price: 500 },
        { id: 6, name: 'Product 6', price: 600 },
        { id: 7, name: 'Product 7', price: 700 },
        { id: 8, name: 'Product 8', price: 800 },
        { id: 9, name: 'Product 9', price: 900 },
        { id: 10, name: 'Product 10', price: 1000 }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 5
      }
    };
  }
};
</script>

<style scoped>
.q-toolbar {
  background-color: #f5f5f5;
}
</style>
