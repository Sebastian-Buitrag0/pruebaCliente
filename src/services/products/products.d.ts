import type { ProductResponse, ProductRequest } from './generated-api/api'
export const ProductService: {
  fetchProducts: () => Promise<ProductResponse[]>
  createProduct: (productData: ProductRequest) => Promise<ProductResponse>
  updateProduct: (productId: number, productData: ProductRequest) => Promise<ProductResponse>
  deleteProduct: (productId: number) => Promise<void>
}
