// Interfaces que representan la estructura del backend
export interface Category {
  id: string
  name: string
  description: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  category?: Category
}

// DTO (Data Transfer Object) para enviar al backend
export interface ProductDTO {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
}

// Funciones auxiliares para transformar datos
export function toProductDTO(product: Partial<Product>): ProductDTO {
  return {
    id: product.id || '',
    name: product.name || '',
    description: product.description || '',
    price: product.price || 0,
    categoryId: product.categoryId || '',
  }
}

export function createEmptyProduct(): Product {
  return {
    id: '',
    name: '',
    description: '',
    price: 0,
    categoryId: '',
  }
}
