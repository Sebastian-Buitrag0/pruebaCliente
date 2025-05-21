<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { ProductService } from 'src/services/products/products'
import { CategoryService } from 'src/services/categories/categories'
import BaseFormModal from 'src/components/forms/BaseFormModal.vue'
import type {
  ProductResponse,
  ProductRequest,
  CategoryResponse,
  CategoryRequest,
} from 'src/services/generated-api/api'
const $q = useQuasar()

// Estado reactivo
const rows = ref<ProductResponse[]>([])
const categories = ref<CategoryResponse[]>([])
const filter = ref('')
const loading = ref(false)
const selectedCategory = ref<CategoryResponse | null>(null)

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
  if (selectedCategory.value?.id) {
    result = result.filter((product) => product.categoryId === selectedCategory.value?.id)
  }

  // Filtrar por texto de búsqueda
  if (filter.value) {
    const searchText = filter.value.toLowerCase()
    result = result.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchText) ||
        product.description?.toLowerCase().includes(searchText) ||
        product.category?.name?.toLowerCase().includes(searchText),
    )
  }

  return result
})

// Estados de modales
const showProductModal = ref(false)
const showCategoryModal = ref(false)
const editMode = ref(false)

// Datos de formularios
const productData = reactive<ProductRequest & { id?: string }>({
  categoryId: '',
  name: '',
  description: '',
  price: 0,
  id: '',
})

const categoryData = reactive<CategoryRequest>({
  name: '',
  description: '',
})

// Configuración de columnas
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left' as const,
    field: (row: ProductResponse) => row.name || '',
    sortable: true,
  },
  {
    name: 'category',
    label: 'Categoría',
    align: 'left' as const,
    field: (row: ProductResponse) => row.category?.name || '',
    sortable: true,
  },
  {
    name: 'price',
    label: 'Precio',
    align: 'right' as const,
    field: (row: ProductResponse) => row.price || 0,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    align: 'center' as const,
    field: (row: ProductResponse) => row.id || '',
  },
]

// Configuración de campos de formulario
const productFields = computed(() => {
  return [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre del producto',
      rules: [(val: string) => !!val || 'El nombre es obligatorio'],
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
        (val: number) => val !== null || 'El precio es obligatorio',
        (val: number) => val >= 0 || 'El precio no puede ser negativo',
      ],
    },
    {
      name: 'categoryId',
      type: 'select',
      label: 'Categoría',
      options: categories.value.map((cat) => ({
        label: cat.name || '',
        value: cat.id || '',
      })),
      rules: [(val: string) => !!val || 'La categoría es obligatoria'],
    },
  ]
})

const categoryFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Nombre de la categoría',
    rules: [(val: string) => !!val || 'El nombre es obligatorio'],
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Descripción',
    hint: 'Describe la categoría',
  },
]

// Métodos de utilidad
function formatPrice(price: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(price)
}

function filterByCategory(category: CategoryResponse | null) {
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

function editRow(row: ProductResponse) {
  editMode.value = true
  console.log('Editando producto:', row)

  // Asignar valores al formulario usando la estructura del backend
  Object.assign(productData, {
    id: row.id || '',
    categoryId: row.categoryId || '',
    name: row.name || '',
    description: row.description || '',
    price: row.price || 0,
  })

  showProductModal.value = true
}

async function saveProduct(formData: ProductRequest) {
  try {
    loading.value = true
    console.log('Guardando producto:', { formData, editMode: editMode.value, id: productData.id })

    if (editMode.value && productData.id) {
      const success = await ProductService.updateProduct(Number(productData.id), {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        categoryId: formData.categoryId,
      })

      if (success) {
        await loadData()
        showProductModal.value = false

        $q.notify({
          color: 'positive',
          message: 'Producto actualizado correctamente',
          icon: 'check',
        })
      }
    } else {
      await ProductService.createProduct(formData)
      await loadData()
      showProductModal.value = false

      $q.notify({
        color: 'positive',
        message: 'Producto creado correctamente',
        icon: 'check',
      })
    }
  } catch (error) {
    console.error('Error en saveProduct:', error)
    handleError(error, `Error al ${editMode.value ? 'actualizar' : 'crear'} producto`)
  } finally {
    loading.value = false
  }
}

function deleteRow(row: ProductResponse) {
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
      if (row.id) {
        await ProductService.deleteProduct(Number(row.id))
        await loadData()

        $q.notify({
          color: 'positive',
          message: 'Producto eliminado correctamente',
          icon: 'check',
        })
      }
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

async function saveCategory(formData: any) {
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
function handleError(error: any, defaultMessage: string) {
  console.error(error)
  $q.notify({
    color: 'negative',
    message: error.message || defaultMessage,
    icon: 'error',
  })
}
</script>

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
          {{ formatPrice(props.row.price || 0) }}
        </q-td>
      </template>

      <template v-slot:body-cell-category="props">
        <q-td :props="props">
          <q-chip size="sm" clickable @click="filterByCategory(props.row.category || null)">
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

<style scoped>
.q-table__card {
  box-shadow: none;
}
</style>
