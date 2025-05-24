<template>
  <q-page class="cashMovements-container-quasar">
    <div class="search-container q-pa-md">
      <q-input
        v-model="searchQuery"
        @update:model-value="debouncedSearchProducts"
        placeholder="Buscar producto..."
        outlined
        dense
        clearable
        class="search-input-quasar"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="cashMovements-content-quasar q-pa-md row q-col-gutter-md">
      <div class="col-12 col-md-6 product-selection-quasar">
        <q-card flat bordered class="product-details-quasar q-pa-md" v-if="selectedProduct.id">
          <div class="text-h6 q-mb-sm">{{ selectedProduct.name || '-' }}</div>
          <div class="field">
            <span class="label">ID:</span>
            <span class="value">{{ selectedProduct.id || '-' }}</span>
          </div>
          <div class="field">
            <span class="label">Categoría:</span>
            <span class="value">{{ selectedProduct.category?.name || '-' }}</span>
          </div>
          <div class="field">
            <span class="label">Precio:</span>
            <span class="value"
              >${{ selectedProduct.price ? selectedProduct.price.toFixed(2) : '-' }}</span
            >
          </div>
          <div class="description-field q-mt-sm">
            <div class="description-label text-grey-7">Descripción:</div>
            <div class="description-value">{{ selectedProduct.description || 'N/A' }}</div>
          </div>
        </q-card>
        <q-card flat bordered class="product-details-quasar q-pa-md text-grey-6" v-else>
          Selecciona un producto de la lista de búsqueda.
        </q-card>

        <q-list
          bordered
          separator
          class="products-list-quasar q-mt-md"
          v-if="filteredProducts.length > 0"
        >
          <q-item-label header>Resultados de búsqueda</q-item-label>
          <q-item
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-item-quasar"
            clickable
            v-ripple
            @click="selectProductForDetails(product)"
            :active="selectedProduct.id === product.id"
            active-class="bg-teal-1 text-grey-8"
          >
            <q-item-section>
              <q-item-label>{{ product.name }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>${{ product.price ? product.price.toFixed(2) : 'N/A' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-if="loadingProducts" class="text-center q-pa-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
        <div
          v-if="searchQuery && !loadingProducts && filteredProducts.length === 0"
          class="no-products-quasar q-pa-md text-center text-grey-7"
        >
          No se encontraron productos para "{{ searchQuery }}".
        </div>
      </div>

      <div class="col-12 col-md-6 cashMovements-details-quasar">
        <q-card flat bordered class="q-pa-md">
          <div class="text-h6 q-mb-md">Detalle del Ítem Actual</div>
          <div v-if="!selectedProduct.id" class="text-grey-7">
            Busca y selecciona un producto para agregarlo.
          </div>

          <div v-if="selectedProduct.id">
            <div class="quantity-control-quasar q-mb-md">
              <q-item-label class="q-mb-xs"
                >Cantidad para: <strong>{{ selectedProduct.name }}</strong></q-item-label
              >
              <div class="row items-center no-wrap">
                <q-btn
                  icon="remove"
                  @click="updateQuantity(-1)"
                  round
                  dense
                  flat
                  class="quantity-btn-quasar"
                  :disable="quantity <= 1"
                />
                <q-input
                  v-model.number="quantity"
                  type="number"
                  dense
                  outlined
                  class="quantity-input-quasar q-mx-sm text-center"
                  style="width: 70px"
                  min="1"
                  @update:model-value="(val) => (quantity = Math.max(1, Number(val) || 1))"
                />
                <q-btn
                  icon="add"
                  @click="updateQuantity(1)"
                  round
                  dense
                  flat
                  class="quantity-btn-quasar"
                />
              </div>
            </div>

            <div class="action-buttons-quasar q-mt-md">
              <q-btn
                @click="addItemToCart"
                label="Agregar a Caja"
                color="primary"
                icon="add_shopping_cart"
                class="add-button-quasar full-width"
                :disable="!selectedProduct.id"
              />
            </div>
          </div>
          <q-separator class="q-my-lg" v-if="selectedProduct.id" />

          <div class="totals-quasar q-mt-md">
            <div class="text-subtitle1">Resumen de Caja</div>
            <q-list dense>
              <q-item class="total-line-quasar">
                <q-item-section>Subtotal:</q-item-section>
                <q-item-section side>${{ currentCart.subtotal.toFixed(2) }}</q-item-section>
              </q-item>
              <q-item class="total-line-quasar">
                <q-item-section>Impuesto ({{ (taxRate * 100).toFixed(0) }}%):</q-item-section>
                <q-item-section side>${{ currentCart.tax.toFixed(2) }}</q-item-section>
              </q-item>
              <q-item class="total-line-quasar total-quasar text-bold">
                <q-item-section>Total:</q-item-section>
                <q-item-section side>${{ currentCart.total.toFixed(2) }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card>
      </div>
    </div>
    <div class="cart-container-quasar q-mt-lg q-pa-md">
      <q-card flat bordered>
        <q-card-section class="cart-header-quasar bg-grey-2">
          <div class="row items-center justify-between">
            <span class="text-h6">Productos en Caja</span>
            <span class="cart-total-quasar text-subtitle1 text-bold"
              >Total: ${{ currentCart.total.toFixed(2) }}</span
            >
          </div>
        </q-card-section>

        <q-list bordered separator class="cart-items-quasar" v-if="cartItems.length > 0">
          <q-item
            v-for="(item, index) in cartItems"
            :key="item.productId + '-' + index"
            class="cart-item-quasar"
          >
            <q-item-section>
              <q-item-label>{{ item.productName }}</q-item-label>
              <q-item-label caption
                >Cant: {{ item.quantity }} x ${{ item.priceAtSale.toFixed(2) }}</q-item-label
              >
            </q-item-section>
            <q-item-section side top>
              <q-item-label class="text-bold">${{ item.total.toFixed(2) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-input
                v-model.number="item.quantity"
                type="number"
                dense
                outlined
                style="max-width: 70px; margin-right: 8px"
                min="1"
                @update:model-value="updateCartItemQuantity(item, index)"
              />
            </q-item-section>
            <q-item-section side>
              <q-btn
                @click="removeItemFromCart(index)"
                icon="delete"
                flat
                dense
                round
                color="negative"
                class="remove-item-quasar"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else class="q-pa-md text-center text-grey-6">No hay productos en la caja.</div>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            @click="processPaymentAndSale"
            label="Cobrar y Registrar Venta"
            color="positive"
            icon="payment"
            class="pay-button-quasar"
            :loading="isProcessingPayment"
            :disable="cartItems.length === 0"
          />
        </q-card-actions>
      </q-card>
    </div>
    <q-inner-loading :showing="isProcessingPayment || loadingProducts">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useQuasar, debounce, Loading } from 'quasar' // Import Loading
import { useAuthStore } from 'src/stores/auth'
import { ProductService } from 'src/services/products/products'
import { ProductSaleService } from 'src/services/productSale/productSale'
import { SaleService } from 'src/services/sale/sale'
import { CashMovementService } from 'src/services/cashMovements/cashMovements'
// Asumiendo que tus tipos de API están en 'src/types/api.d.ts'
// import type { ProductResponse as APIProduct, ProductSaleRequest, SaleRequest, CashMovementsRequest, TransactionType } from 'src/types/api.d.ts'; // Ajusta la ruta si es necesario

const $q = useQuasar()
const authStore = useAuthStore()

// --- Estado para la búsqueda de productos ---
const searchQuery = ref('')
const filteredProducts = ref([]) // APIProduct[]
const loadingProducts = ref(false)
const selectedProduct = reactive({
  // APIProduct, pero inicializado vacío
  id: null,
  name: '',
  description: '',
  price: 0,
  categoryId: null,
  category: null,
})

// --- Estado para el ítem actual y cantidad ---
const quantity = ref(1)

// --- Estado para el "carrito" o ítems en caja ---
// Estructura para un ítem en el carrito del frontend
// interface CartItem {
//   productId: string;
//   productName: string;
//   priceAtSale: number;
//   quantity: number;
//   total: number;
//   // categoryId?: string; // Si lo necesitas para ProductSaleRequest (aunque usa productId)
// }
const cartItems = ref([]) // CartItem[]

// --- Estado para el objeto `cashMovements` de tu template original (adaptado) ---
// Este se calculará principalmente con `computed` properties
const taxRate = 0.19 // Ejemplo, ajústalo o hazlo configurable

const currentCart = computed(() => {
  const sub = cartItems.value.reduce((sum, item) => sum + item.priceAtSale * item.quantity, 0)
  const tax = sub * taxRate
  const tot = sub + tax
  return {
    items: cartItems.value,
    subtotal: sub,
    tax: tax,
    total: tot,
  }
})

// --- Estado para procesamiento ---
const isProcessingPayment = ref(false)

// --- Lógica de Búsqueda ---
const searchProductsAPI = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    filteredProducts.value = []
    return
  }
  loadingProducts.value = true
  console.log(`Buscando productos con query: "${searchQuery.value}"`) // Log para la query

  try {
    const allProducts = await ProductService.fetchProducts()
    console.log('Productos recibidos de la API:', JSON.parse(JSON.stringify(allProducts))) // Log para los productos crudos

    if (!Array.isArray(allProducts)) {
      console.error('ProductService.fetchProducts() no devolvió un array.')
      filteredProducts.value = []
      loadingProducts.value = false
      return
    }

    const queryLower = searchQuery.value.toLowerCase()
    filteredProducts.value = allProducts.filter((p) => {
      if (!p || typeof p.name !== 'string') {
        console.warn('Producto sin nombre o con nombre inválido:', p)
        return false
      }
      const productNameLower = p.name.toLowerCase()
      const isMatch = productNameLower.includes(queryLower)
      // console.log(`Filtrando: "${productNameLower}" incluye "${queryLower}"? ${isMatch}`) // <-- DESCOMENTA ESTA LÍNEA
      return isMatch
    })

    console.log('Productos filtrados:', JSON.parse(JSON.stringify(filteredProducts.value))) // Log para los productos filtrados
  } catch (error) {
    console.error('Error en searchProductsAPI:', error) // Log del error
    $q.notify({ type: 'negative', message: 'Error buscando productos.' })
    filteredProducts.value = []
  } finally {
    loadingProducts.value = false
  }
}
const debouncedSearchProducts = debounce(searchProductsAPI, 500)

function selectProductForDetails(product) {
  // product es APIProduct
  Object.assign(selectedProduct, product)
  quantity.value = 1 // Reset quantity for new selected product
}

// --- Lógica de Cantidad ---
function updateQuantity(amount) {
  const newQuantity = quantity.value + amount
  if (newQuantity >= 1) {
    quantity.value = newQuantity
  }
}
function updateCartItemQuantity(item, index) {
  if (item.quantity < 1) {
    item.quantity = 1
  }
  cartItems.value[index].total =
    cartItems.value[index].priceAtSale * cartItems.value[index].quantity
  // Forzar reactividad si es necesario, aunque Vue 3 debería manejarlo bien.
}

// --- Lógica para "Agregar a Caja" (cartItems) ---
function addItemToCart() {
  if (!selectedProduct.id || !selectedProduct.price) {
    $q.notify({ type: 'warning', message: 'Selecciona un producto válido primero.' })
    return
  }

  const existingCartItemIndex = cartItems.value.findIndex(
    (item) => item.productId === selectedProduct.id,
  )

  if (existingCartItemIndex > -1) {
    cartItems.value[existingCartItemIndex].quantity += quantity.value
    cartItems.value[existingCartItemIndex].total =
      cartItems.value[existingCartItemIndex].quantity *
      cartItems.value[existingCartItemIndex].priceAtSale
  } else {
    cartItems.value.push({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      priceAtSale: selectedProduct.price,
      quantity: quantity.value,
      total: selectedProduct.price * quantity.value,
      // categoryId: selectedProduct.categoryId, // si es necesario
    })
  }
  $q.notify({
    type: 'positive',
    message: `${selectedProduct.name} (x${quantity.value}) agregado a la caja.`,
  })
  // Resetear selección para facilitar la siguiente adición
  // Object.assign(selectedProduct, { id: null, name: '', price: 0, description: '', category: null, categoryId: null });
  // searchQuery.value = '';
  // filteredProducts.value = [];
  quantity.value = 1
}

// --- Lógica para "Remover Ítem" de la caja ---
function removeItemFromCart(index) {
  if (index >= 0 && index < cartItems.value.length) {
    const removedItemName = cartItems.value[index].productName
    cartItems.value.splice(index, 1)
    $q.notify({ type: 'info', message: `${removedItemName} eliminado de la caja.` })
  }
}

// --- Lógica para "Cobrar" (Finalizar Venta y Crear Movimiento) ---
async function processPaymentAndSale() {
  if (cartItems.value.length === 0) {
    $q.notify({ type: 'warning', message: 'No hay productos en la caja para procesar.' })
    return
  } // Debug más detallado del usuario
  console.log('AuthStore debug completo:', {
    user: authStore.user,
    userId: authStore.getCurrentUserId,
    username: authStore.username,
    token: authStore.token,
    isAuthenticated: authStore.isAuthenticated,
  })

  if (false) {
    $q.notify({
      type: 'negative',
      message: 'Usuario no autenticado o ID de usuario no disponible.',
    })
    return
  }
  const userId = authStore.getCurrentUserId

  isProcessingPayment.value = true
  Loading.show({ message: 'Procesando venta...' }) // Use Loading directamente

  try {
    // 1. Crear cada ProductSale (según la nueva lógica, estos son los ítems de la venta)
    const createdProductSaleIds = [] // Esto almacenará los IDs de los ProductSale creados
    for (const cartItem of cartItems.value) {
      const productSaleRequest = {
        // ProductSaleRequest
        product: cartItem.productId, // UUID del producto
        quantity: cartItem.quantity,
        priceAtSale: cartItem.priceAtSale,
      }
      // Asumiendo que ProductSaleService.createProductSale devuelve el ProductSaleResponse con su ID
      const createdProductSale = await ProductSaleService.createProductSale(productSaleRequest)
      if (createdProductSale && createdProductSale.id) {
        createdProductSaleIds.push(createdProductSale.id)
      } else {
        // Si tu API POST /api/ProductSale no devuelve el ID, necesitarás otra forma de obtenerlo
        // o ajustar el backend para que lo devuelva.
        throw new Error(
          `No se pudo obtener el ID para el ítem de venta: ${cartItem.productName}. Revisa la respuesta de la API.`,
        )
      }
    }

    if (createdProductSaleIds.length !== cartItems.value.length) {
      throw new Error('No todos los ítems de venta pudieron ser registrados con un ID.')
    }

    // 2. Crear la Venta (Sale)
    const saleRequest = {
      // SaleRequest
      user: userId, // El ID del usuario autenticado (UUID)
      productsSale: createdProductSaleIds, // Array de UUIDs de los ProductSale creados
      // saleDate: new Date().toISOString(), // Si el backend lo asigna, no es necesario enviarlo.
      // En tu api.d.ts `readonly saleDate?: string;` para SaleRequest,
      // lo que sugiere que el backend lo establece.
    }
    const saleResponse = await SaleService.createSale(saleRequest) // Debe devolver SaleResponse
    if (!saleResponse) {
      throw new Error('La respuesta de la creación de la venta fue inválida o no incluyó ID/monto.')
    }

    // 3. Crear el Movimiento de Caja (CashMovement)
    const cashMovementRequest = {
      // CashMovementsRequest
      date: new Date().toISOString(),
      amount: saleResponse.amount, // El monto total de SaleResponse
      type: 0, // Asumimos 0 para Ingreso/Venta según TransactionType (0 | 1)
      saleId: saleResponse.id, // El ID de la SaleResponse
    }
    await CashMovementService.createCashMovement(cashMovementRequest)

    $q.notify({ type: 'positive', message: 'Venta y movimiento de caja registrados con éxito!' })
    // Limpiar el carrito y la selección
    cartItems.value = []
    Object.assign(selectedProduct, {
      id: null,
      name: '',
      price: 0,
      description: '',
      category: null,
      categoryId: null,
    })
    searchQuery.value = ''
    filteredProducts.value = []
    quantity.value = 1
  } catch (error) {
    console.error('Error procesando el pago y la venta:', error)
    $q.notify({
      type: 'negative',
      message: `Error: ${error.message || 'Ocurrió un problema al procesar la venta.'}`,
      multiLine: true,
      timeout: 7000,
    })
  } finally {
    isProcessingPayment.value = false
    Loading.hide() // Use Loading directamente
  }
}

// Watchers para debug o lógica adicional si es necesario
watch(searchQuery, (newVal) => {
  if (!newVal) filteredProducts.value = []
})
</script>

<style scoped>
/* Tus estilos CSS existentes de .cashMovements-container, .search-container, etc. */
/* Aquí puedes añadir o ajustar los estilos que Quasar no cubra o que quieras personalizar. */

.cashMovements-container-quasar {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Espacio entre secciones principales */
}

.search-input-quasar {
  max-width: 500px; /* Ajusta según necesidad */
  margin: 0 auto; /* Centrar si es deseado */
}

.cashMovements-content-quasar {
  /* Contenedor para los paneles izquierdo y derecho */
  display: flex;
  flex-direction: column;
}

.product-selection-quasar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-details-quasar .field {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.9em;
}
.product-details-quasar .label {
  font-weight: 500;
  color: #555;
}
.product-details-quasar .value {
  text-align: right;
}
.product-details-quasar .description-label {
  font-size: 0.8em;
  color: #777;
}
.product-details-quasar .description-value {
  font-size: 0.9em;
  margin-top: 2px;
  white-space: pre-wrap; /* Para respetar saltos de línea en la descripción */
}

.products-list-quasar .product-item-quasar {
  cursor: pointer;
}
/* .products-list-quasar .product-item-quasar:hover {
  background-color: #f0f0f0;
} */

.cashMovements-details-quasar .quantity-label-quasar {
  font-weight: 500;
}
.quantity-input-quasar input {
  text-align: center;
}

.totals-quasar .total-line-quasar {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}
.totals-quasar .total-quasar {
  font-weight: bold;
  font-size: 1.1em;
  border-top: 1px solid #eee;
  margin-top: 8px;
  padding-top: 8px;
}

.cart-container-quasar {
  background: transparent;
}
.cart-header-quasar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
}
.cart-item-quasar {
  background: transparent;
}

.empty-cart-quasar {
  text-align: center;
  color: #777;
  padding: 20px;
}
.cart-total-quasar {
  font-weight: bold;
  font-size: 1.2em;
}
</style>
