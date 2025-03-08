<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm row justify-end">
      <q-btn color="green" outline icon="category" @click="addCategory" />
      <q-btn color="green" icon="add" @click="addProduct" />
    </div>
    <q-table :rows="rows" :columns="columns" row-key="id" v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 20, 50]" :filter="filter">

      <template v-slot:top>
        <q-toolbar>
          <q-toolbar-title>Products</q-toolbar-title>
        </q-toolbar>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td align="center">
          <q-btn class="q-mr-sm" color="yellow" icon="edit" text-color="white" @click="editRow(props.row)" />
          <q-btn color="red" icon="delete" text-color="white" @click="deleteRow(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Modal para agregar/editar producto -->
    <base-form-modal v-model="showProductModal" :title="editMode ? 'Editar Producto' : 'Nuevo Producto'"
      :initial-data="productData" :fields="productFields" @submit="saveProduct" />

    <!-- Modal para agregar categoría -->
    <base-form-modal v-model="showCategoryModal" title="Nueva Categoría" :initial-data="categoryData"
      :fields="categoryFields" @submit="saveCategory" />
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { ProductService } from 'src/services/products/products.js'
import { CategoryService } from 'src/services/categories.js'
import BaseFormModal from 'src/components/forms/BaseFormModal.vue'

// Setup Quasar plugins
const $q = useQuasar()

// Estado reactivo
const rows = ref([])
const categories = ref([])
const filter = ref('')
const pagination = reactive({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 5,
  rowsNumber: 0
})

// Modal states
const showProductModal = ref(false)
const showCategoryModal = ref(false)
const editMode = ref(false)

const categoryData = reactive({
  id: '',
  name: '',
  description: ''
})

// Form data
const productData = reactive({
  id: '',
  name: '',
  description: '',
  price: 0.0,
  categoryId: ''
})

// Columnas de la tabla
const columns = [
  { name: 'id', required: true, label: 'ID', align: 'left', field: row => row.id, format: val => `${val}`, sortable: true },
  { name: 'name', required: true, label: 'Name', align: 'left', field: row => row.name, sortable: true },
  { name: 'categoryName', label: 'Category', align: 'left', field: row => row.category?.name, sortable: true },
  { name: 'price', label: 'Price', align: 'right', field: 'price', sortable: true },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

// Campos del formulario
const productFields = ref([
  {
    name: 'name',
    type: 'text',
    label: 'Nombre del producto',
    rules: [val => !!val || 'El nombre es obligatorio']
  },
  {
    name: 'description',
    type: 'text',
    label: 'Descripción',
    hint: 'Describe el producto'
  },
  {
    name: 'price',
    type: 'number',
    label: 'Precio',
    rules: [val => val > 0 || 'El precio debe ser mayor que 0']
  },
  {
    name: 'categoryId',
    type: 'select',
    label: 'Categoría',
    options: [],
    rules: [val => !!val || 'La categoría es obligatoria']
  }
])

const categoryFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Nombre de la categoría',
    rules: [val => !!val || 'El nombre es obligatorio']
  },
  {
    name: 'description',
    type: 'text',
    label: 'Descripción',
    hint: 'Describe la categoría'
  }
]

// Carga inicial de datos
onMounted(async () => {
  try {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      ProductService.fetchProducts(),
      CategoryService.fetchCategories()
    ])

    rows.value = fetchedProducts
    categories.value = fetchedCategories

    // Actualizar el número total de filas para la paginación
    pagination.rowsNumber = fetchedProducts.length

    updateCategoryOptions()
  } catch (error) {
    handleError(error, 'Error al cargar datos')
  }
})

// Métodos para gestionar productos
function addProduct() {
  editMode.value = false
  Object.assign(productData, {
    name: '',
    description: '',
    price: 0,
    categoryId: ''
  })
  showProductModal.value = true
}

function editRow(row) {
  editMode.value = true
  const categoryId = row.category?.id

  // Busca la opción completa en el arreglo de opciones del campo categoryId
  const categoryField = productFields.value.find(field => field.name === 'categoryId')
  const categoryOption = categoryField?.options?.find(
    option => option.value === categoryId
  ) || { label: row.category?.name, value: categoryId }

  Object.assign(productData, {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: row.price,
    categoryId: categoryOption // Usa el objeto option completo si lo encuentra
  })

  showProductModal.value = true
}

async function saveProduct(formData) {
  try {
    const dataToSend = { ...formData }

    // Si categoryId es un objeto, tomamos solo el valor
    if (dataToSend.categoryId && typeof dataToSend.categoryId === 'object') {
      dataToSend.categoryId = dataToSend.categoryId.value
    }

    if (editMode.value) {
      const productId = dataToSend.id
      // Elimina el id del objeto para evitar el error 500
      delete dataToSend.id
      await ProductService.updateProduct(productId, dataToSend)
    } else {
      await ProductService.createProduct(dataToSend)
    }

    // Actualizar tabla
    rows.value = await ProductService.fetchProducts()
    pagination.rowsNumber = rows.value.length

    $q.notify({
      color: 'positive',
      message: `Producto ${editMode.value ? 'actualizado' : 'creado'} correctamente`,
      icon: 'check'
    })
  } catch (error) {
    handleError(error, `Error al ${editMode.value ? 'actualizar' : 'crear'} producto`)
  }
}

function deleteRow(row) {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro que desea eliminar el producto "${row.name}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await ProductService.deleteProduct(row.id)
      rows.value = await ProductService.fetchProducts()
      pagination.rowsNumber = rows.value.length

      $q.notify({
        color: 'positive',
        message: 'Producto eliminado correctamente',
        icon: 'check'
      })
    } catch (error) {
      handleError(error, 'Error al eliminar producto')
    }
  })
}

// Métodos para gestionar categorías
function addCategory() {
  Object.assign(categoryData, {
    name: '',
    description: ''
  })
  showCategoryModal.value = true
}

async function saveCategory(formData) {
  try {
    await CategoryService.createCategory(formData)
    categories.value = await CategoryService.fetchCategories()
    updateCategoryOptions()

    $q.notify({
      color: 'positive',
      message: 'Categoría creada correctamente',
      icon: 'check'
    })
  } catch (error) {
    handleError(error, 'Error al crear categoría')
  }
}

// Funciones auxiliares
function updateCategoryOptions() {
  const categoryField = productFields.value.find(field => field.name === 'categoryId')
  if (categoryField) {
    categoryField.options = categories.value.map(category => ({
      label: category.name,
      value: category.id
    }))
  }
}

function handleError(error, message) {
  console.error(message, error)
  $q.notify({
    color: 'negative',
    message,
    icon: 'error'
  })
}
</script>

<style scoped>
.q-toolbar {
  background-color: #f5f5f5;
}
</style>
