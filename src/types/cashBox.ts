import type { Product } from './product'

// Representa un ítem seleccionado en la caja
export interface CashBoxItem {
  product: Product
  quantity: number
  total: number // price * quantity
}

// Representa la caja con su lista de productos seleccionados
export interface CashBox {
  id: string
  items: CashBoxItem[]
  subtotal: number
  tax: number
  total: number
  createdAt: string
  updatedAt?: string
}

// DTO para enviar al backend (ajustarlo según API)
export interface CashBoxDTO {
  id: string
  items: {
    productId: string
    quantity: number
  }[]
}

// Función auxiliar para crear un CashBox vacío
export function createEmptyCashBox(): CashBox {
  return {
    id: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    createdAt: new Date().toISOString(),
  }
}