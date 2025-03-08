<template>
  <q-page class="q-pa-md">
    <!-- Barra superior con búsqueda y botones -->
    <div class="row items-center q-mb-md">
      <div class="col-grow">
        <q-input v-model="filter" dense outlined placeholder="Buscar productos..." class="q-mr-sm">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-auto">
        <q-btn-group flat>
          <q-btn
            color="green"
            outline
            icon="category"
            label="Nueva Categoría"
            @click="addCategory"
          />
          <q-btn color="green" icon="add" label="Nuevo Producto" @click="addProduct" />
        </q-btn-group>
      </div>
    </div>

    <!-- Tabla de productos -->
    <q-table
      :rows="filteredProducts"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 20, 50]"
      :loading="loading"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-toolbar-title>Products</q-toolbar-title>
          <q-space />
          <q-chip
            v-if="selectedCategory"
            removable
            @remove="selectedCategory = null"
            color="green"
            text-color="white"
          >
            {{ selectedCategory.name }}
          </q-chip>
        </q-toolbar>
      </template>

      <template v-slot:body-cell-price="props">
        <q-td :props="props">
          {{ formatPrice(props.row.price) }}
        </q-td>
      </template>

      <template v-slot:body-cell-category="props">
        <q-td :props="props">
          <q-chip size="sm" clickable @click="filterByCategory(props.row.category)">
            {{ props.row.category?.name || 'Sin categoría' }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td align="center">
          <q-btn
            class="q-mr-sm"
            color="yellow"
            icon="edit"
            text-color="white"
            @click="editRow(props.row)"
          />
          <q-btn color="red" icon="delete" text-color="white" @click="deleteRow(props.row)" />
        </q-td>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey-6">
          No hay productos disponibles
        </div>
      </template>
    </q-table>

    <!-- Modal para agregar/editar producto -->
    <base-form-modal
      v-model="showProductModal"
      :title="editMode ? 'Editar Producto' : 'Nuevo Producto'"
      :initial-data="productData"
      :fields="productFields"
      @submit="saveProduct"
      persistent
    />

    <!-- Modal para agregar categoría -->
    <base-form-modal
      v-model="showCategoryModal"
      title="Nueva Categoría"
      :initial-data="categoryData"
      :fields="categoryFields"
      @submit="saveCategory"
      persistent
    />
  </q-page>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { ProductService } from 'src/services/products/products.js'
import { CategoryService } from 'src/services/categories.js'
import BaseFormModal from 'src/components/forms/BaseFormModal.vue'

const $q = useQuasar()

// Estado reactivo
const rows = ref([])
const categories = ref([])
const filter = ref('')
const loading = ref(false)
const selectedCategory = ref(null)

const pagination = reactive({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

// Computed properties
const filteredProducts = computed(() => {
  let result = [...rows.value]

  // Filtrar por categoría seleccionada
  if (selectedCategory.value) {
    result = result.filter((product) => product.category?.id === selectedCategory.value.id)
  }

  // Filtrar por texto de búsqueda
  if (filter.value) {
    const searchText = filter.value.toLowerCase()
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(searchText) ||
        product.description?.toLowerCase().includes(searchText) ||
        product.category?.name.toLowerCase().includes(searchText),
    )
  }

  return result
})

// Estados de modales
const showProductModal = ref(false)
const showCategoryModal = ref(false)
const editMode = ref(false)

// Datos de formularios
const productData = reactive({
  id: '',
  name: '',
  description: '',
  price: 0.0,
  categoryId: '',
})

const categoryData = reactive({
  id: '',
  name: '',
  description: '',
})

// Configuración de columnas
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'category',
    label: 'Categoría',
    align: 'left',
    field: (row) => row.category?.name,
    sortable: true,
  },
  {
    name: 'price',
    label: 'Precio',
    align: 'right',
    field: 'price',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'center',
  },
]

// Configuración de campos de formulario
const productFields = computed(() => [
  {
    name: 'name',
    type: 'text',
    label: 'Nombre del producto',
    rules: [(val) => !!val || 'El nombre es obligatorio'],
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Descripción',
    hint: 'Describe el producto',
  },
  {
    name: 'price',
    type: 'number',
    label: 'Precio',
    rules: [
      (val) => val !== null || 'El precio es obligatorio',
      (val) => val >= 0 || 'El precio no puede ser negativo',
    ],
  },
  {
    name: 'categoryId',
    type: 'select',
    label: 'Categoría',
    options: categories.value.map((cat) => ({
      label: cat.name,
      value: cat.id,
    })),
    rules: [(val) => !!val || 'La categoría es obligatoria'],
  },
])

const categoryFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Nombre de la categoría',
    rules: [(val) => !!val || 'El nombre es obligatorio'],
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Descripción',
    hint: 'Describe la categoría',
  },
]

// Métodos de utilidad
function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(price)
}

function filterByCategory(category) {
  selectedCategory.value = category
}

// Carga inicial de datos
onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      ProductService.fetchProducts(),
      CategoryService.fetchCategories(),
    ])

    rows.value = fetchedProducts
    categories.value = fetchedCategories
    pagination.rowsNumber = fetchedProducts.length
  } catch (error) {
    handleError(error, 'Error al cargar datos')
  } finally {
    loading.value = false
  }
}

// Gestión de productos
function addProduct() {
  editMode.value = false
  Object.assign(productData, {
    id: '',
    name: '',
    description: '',
    price: 0,
    categoryId: '',
  })
  showProductModal.value = true
}

function editRow(row) {
  editMode.value = true
  Object.assign(productData, {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: row.price,
    categoryId: row.category?.id || null,
  })

  // Nos aseguramos que la categoría exista en las opciones
  const categoryExists = categories.value.some((cat) => cat.id === row.category?.id)

  if (!categoryExists && row.category) {
    // Si la categoría no existe en la lista pero el producto tiene una, la agregamos temporalmente
    categories.value = [...categories.value, row.category]
  }

  showProductModal.value = true
}

async function saveProduct(formData) {
  try {
    loading.value = true
    const dataToSend = { ...formData }

    if (editMode.value) {
      await ProductService.updateProduct(dataToSend.id, dataToSend)
    } else {
      await ProductService.createProduct(dataToSend)
    }

    await loadData()
    showProductModal.value = false

    $q.notify({
      color: 'positive',
      message: `Producto ${editMode.value ? 'actualizado' : 'creado'} correctamente`,
      icon: 'check',
    })
  } catch (error) {
    handleError(error, `Error al ${editMode.value ? 'actualizar' : 'crear'} producto`)
  } finally {
    loading.value = false
  }
}

function deleteRow(row) {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro que desea eliminar el producto "${row.name}"?`,
    cancel: {
      label: 'Cancelar',
      flat: true,
    },
    ok: {
      label: 'Eliminar',
      color: 'negative',
    },
    persistent: true,
  }).onOk(async () => {
    try {
      loading.value = true
      await ProductService.deleteProduct(row.id)
      await loadData()

      $q.notify({
        color: 'positive',
        message: 'Producto eliminado correctamente',
        icon: 'check',
      })
    } catch (error) {
      handleError(error, 'Error al eliminar producto')
    } finally {
      loading.value = false
    }
  })
}

// Gestión de categorías
function addCategory() {
  Object.assign(categoryData, {
    id: '',
    name: '',
    description: '',
  })
  showCategoryModal.value = true
}

async function saveCategory(formData) {
  try {
    loading.value = true
    await CategoryService.createCategory(formData)
    await loadData()
    showCategoryModal.value = false

    $q.notify({
      color: 'positive',
      message: 'Categoría creada correctamente',
      icon: 'check',
    })
  } catch (error) {
    handleError(error, 'Error al crear categoría')
  } finally {
    loading.value = false
  }
}

// Manejo de errores
function handleError(error, defaultMessage) {
  console.error(error)
  $q.notify({
    color: 'negative',
    message: error.message || defaultMessage,
    icon: 'error',
  })
}
</script>

<style scoped>
.q-table__card {
  box-shadow: none;
}
</style>
