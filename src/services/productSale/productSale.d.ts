import type { ProductSaleResponse, ProductSaleRequest } from '../generated-api'

export const ProductSaleService: {
  fetchProductSales: () => Promise<ProductSaleResponse[]>
  createProductSale: (productSaleData: ProductSaleRequest) => Promise<ProductSaleResponse>
  updateProductSale: (
    productSaleId: number,
    productSaleData: ProductSaleRequest,
  ) => Promise<ProductSaleResponse>
  deleteProductSale: (productSaleId: number) => Promise<void>
}
