import type { components } from './api'

// Exportar los tipos que necesitamos del Swagger
export type ProductResponse = components['schemas']['ProductResponse']
export type ProductRequest = components['schemas']['ProductRequest']
export type CategoryResponse = components['schemas']['CategoryResponse']
export type CategoryRequest = components['schemas']['CategoryRequest']
export type CashBoxResponse = components['schemas']['CashBoxResponse']
export type CashBoxRequest = components['schemas']['CashBoxRequest']