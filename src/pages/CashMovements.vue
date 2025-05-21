<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type Product, createEmptyProduct } from '../types/product'
import { type CashMovements, createEmptyCashMovements } from 'src/types/cashMovements'

// Estado reactivo para la caja
const cashMovements = ref<CashMovements>(createEmptyCashMovements())
const selectedProduct = ref<Product>(createEmptyProduct())
const quantity = ref<number>(1)
const searchQuery = ref<string>('')
const productsList = ref<Product[]>([])
const filteredProducts = ref<Product[]>([])

// Simular la carga de productos (reemplazar con llamada API real)
onMounted(async () => {
  // Aquí normalmente se obtendría la data de una API
  productsList.value = [
    {
      id: '1',
      name: 'Producto 1',
      description: 'Descripción del producto 1',
      price: 10.99,
      categoryId: '1',
      category: { id: '1', name: 'Categoría 1', description: 'Descripción categoría 1' },
    },
    {
      id: '2',
      name: 'Producto 2',
      description: 'Descripción del producto 2',
      price: 24.5,
      categoryId: '2',
      category: { id: '2', name: 'Categoría 2', description: 'Descripción categoría 2' },
    },
  ]

  filteredProducts.value = [...productsList.value]
})

// Calcular totales
const calculateTotals = () => {
  cashMovements.value.subtotal = cashMovements.value.items.reduce(
    (sum: any, item: { total: any }) => sum + item.total,
    0,
  )
  cashMovements.value.tax = cashMovements.value.subtotal * 0.0 // Ajustar según la lógica fiscal necesaria
  cashMovements.value.total = cashMovements.value.subtotal + cashMovements.value.tax
}

// Búsqueda de productos
const searchProducts = () => {
  if (!searchQuery.value.trim()) {
    filteredProducts.value = [...productsList.value]
    return
  }

  const query = searchQuery.value.toLowerCase()
  filteredProducts.value = productsList.value.filter(
    (product: { name: string; description: string; id: string }) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query),
  )
}

// Actualizar cantidad del producto seleccionado
const updateQuantity = (value: number) => {
  quantity.value = Math.max(1, quantity.value + value)
}

// Seleccionar un producto
const selectProduct = (product: Product) => {
  selectedProduct.value = product
}

// Agregar producto a la caja
const addToCart = () => {
  if (!selectedProduct.value.id) return

  const existingItemIndex = cashMovements.value.items.findIndex(
    (item: { product: { id: any } }) => item.product.id === selectedProduct.value.id,
  )

  if (existingItemIndex >= 0) {
    // Actualizar item existente
    cashMovements.value.items[existingItemIndex].quantity += quantity.value
    cashMovements.value.items[existingItemIndex].total =
      cashMovements.value.items[existingItemIndex].quantity *
      cashMovements.value.items[existingItemIndex].product.price
  } else {
    // Agregar nuevo item
    cashMovements.value.items.push({
      product: { ...selectedProduct.value },
      quantity: quantity.value,
      total: selectedProduct.value.price * quantity.value,
    })
  }

  // Resetear selección
  selectedProduct.value = createEmptyProduct()
  quantity.value = 1

  // Recalcular totales
  calculateTotals()
}

// Eliminar un item de la caja
const removeItem = (index: number) => {
  cashMovements.value.items.splice(index, 1)
  calculateTotals()
}

// Procesar el pago
const processPayment = () => {
  // Aquí iría la lógica para enviar la transacción al backend
  console.log('Procesando pago:', cashMovements.value)

  // Crear DTO para enviar
  const cashMovementsDTO = {
    id: cashMovements.value.id,
    items: cashMovements.value.items.map((item: { product: { id: any }; quantity: any }) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
  }

  console.log('DTO para enviar:', cashMovementsDTO)

  // Luego de procesar, resetear la caja
  cashMovements.value = createEmptyCashMovements()
}

// Agregar a la caja sin procesar aún
const addToCashMovements = () => {
  if (selectedProduct.value.id && quantity.value > 0) {
    addToCart()
  }
}
</script>

<template>
  <div class="cashMovements-container">
    <!-- Sección de búsqueda -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        @input="searchProducts"
        placeholder="Buscar producto..."
        class="search-input"
      />
      <button class="search-button">
        <i class="fa fa-search"></i>
      </button>
    </div>

    <div class="cashMovements-content">
      <!-- Panel izquierdo: selección de producto -->
      <div class="product-selection">
        <div class="product-details">
          <div class="field">
            <span class="label">ID</span>
            <span class="value">{{ selectedProduct.id || '-' }}</span>
          </div>

          <div class="field">
            <span class="label">Name</span>
            <span class="value">{{ selectedProduct.name || '-' }}</span>
          </div>

          <div class="field">
            <span class="label">Category</span>
            <span class="value">{{ selectedProduct.category?.name || '-' }}</span>
          </div>

          <div class="field">
            <span class="label">Price</span>
            <span class="value">${{ selectedProduct.price.toFixed(2) || '-' }}</span>
          </div>

          <div class="product-image">
            <!-- Aquí iría la imagen del producto si existe -->
          </div>

          <div class="description-field">
            <div class="description-label">Descripción...</div>
            <div class="description-value">{{ selectedProduct.description }}</div>
          </div>
        </div>

        <!-- Lista de productos filtrados -->
        <div class="products-list" v-if="filteredProducts.length > 0">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-item"
            @click="selectProduct(product)"
          >
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">${{ product.price.toFixed(2) }}</div>
          </div>
        </div>
        <div v-else class="no-products">No se encontraron productos.</div>
      </div>

      <!-- Panel derecho: detalles de la caja -->
      <div class="cashMovements-details">
        <div class="quantity-control">
          <span class="quantity-label">Quantity</span>
          <div class="quantity-buttons">
            <button @click="updateQuantity(-1)" class="quantity-btn decrease">-</button>
            <input type="text" v-model="quantity" class="quantity-input" />
            <button @click="updateQuantity(1)" class="quantity-btn increase">+</button>
          </div>
        </div>

        <div class="totals">
          <div class="total-line">
            <span>Subtotal:</span>
            <span>${{ cashMovements.subtotal.toFixed(2) }}</span>
          </div>
          <div class="total-line">
            <span>Tax:</span>
            <span>${{ cashMovements.tax.toFixed(2) }}</span>
          </div>
          <div class="total-line total">
            <span>Total:</span>
            <span>${{ cashMovements.total.toFixed(2) }}</span>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="addToCashMovements" class="add-button">
            <i class="fa fa-cart-plus"></i> AGREGAR A CAJA
          </button>
          <button @click="processPayment" class="pay-button">
            <i class="fa fa-money-bill"></i> COBRAR
          </button>
        </div>
      </div>
    </div>

    <!-- Sección de productos en caja -->
    <div class="cart-container">
      <div class="cart-header">
        <h3>Productos en caja</h3>
        <span class="cart-total">Precio Total: ${{ cashMovements.total.toFixed(2) }}</span>
      </div>

      <div class="cart-items">
        <div v-if="cashMovements.items.length === 0" class="empty-cart">
          No hay productos en la caja.
        </div>
        <div v-else class="cart-item-list">
          <div
            v-for="(item, index) in cashMovements.items"
            :key="`item-${index}`"
            class="cart-item"
          >
            <div class="item-info">
              <div class="item-name">{{ item.product.name }}</div>
              <div class="item-quantity">x{{ item.quantity }}</div>
              <div class="item-price">${{ item.total.toFixed(2) }}</div>
            </div>
            <button @click="removeItem(index)" class="remove-item">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cashMovements-container {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.search-container {
  display: flex;
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

.search-button {
  padding: 0.75rem 1rem;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
}

.cashMovements-content {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-selection {
  flex: 3;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
}

.product-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.product-image {
  grid-column: 2;
  grid-row: 1 / span 4;
  background-color: #f0f0f0;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.description-field {
  grid-column: 1 / span 2;
  margin-top: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem;
}

.products-list {
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.product-item {
  padding: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.product-item:hover {
  background-color: #f5f5f5;
}

.cashMovements-details {
  flex: 2;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.quantity-control {
  margin-bottom: 2rem;
}

.quantity-buttons {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: none;
  background-color: #e0e0e0;
  cursor: pointer;
}

.decrease {
  border-radius: 4px 0 0 4px;
  background-color: #ff5252;
  color: white;
}

.increase {
  border-radius: 0 4px 4px 0;
  background-color: #4caf50;
  color: white;
}

.quantity-input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 0;
}

.totals {
  margin-bottom: 2rem;
}

.total-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.total {
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
  padding-top: 0.5rem;
}

.action-buttons {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-button,
.pay-button {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.add-button {
  background-color: #2196f3;
  color: white;
}

.pay-button {
  background-color: #4caf50;
  color: white;
}

.cart-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.cart-header h3 {
  margin: 0;
}

.cart-items {
  padding: 1rem;
}

.empty-cart {
  text-align: center;
  color: #757575;
  font-style: italic;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.item-info {
  display: flex;
  gap: 1rem;
}

.remove-item {
  border: none;
  background: none;
  color: #ff5252;
  cursor: pointer;
}

/* Estilos responsivos */
@media screen and (max-width: 768px) {
  .cashMovements-content {
    flex-direction: column;
  }
}
</style>
