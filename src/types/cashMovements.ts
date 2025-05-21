import type { Product } from './product'

// Representa un ítem seleccionado en la caja
export interface CashMovementsItem {
  product: Product
  quantity: number
  total: number // price * quantity
}

// Representa la caja con su lista de productos seleccionados
export interface CashMovements {
  id: string
  items: CashMovementsItem[]
  subtotal: number
  tax: number
  total: number
  createdAt: string
  updatedAt?: string
}

// DTO para enviar al backend (ajustarlo según API)
export interface CashMovementsDTO {
  id: string
  items: {
    productId: string
    quantity: number
  }[]
}

// Función auxiliar para crear un CashBox vacío
export function createEmptyCashMovements(): CashMovements {
  return {
    id: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    createdAt: new Date().toISOString(),
  }
}
