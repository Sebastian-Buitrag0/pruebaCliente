import type { SaleResponse, SaleRequest } from '../generated-api'

export const SaleService: {
  fetchSales: () => Promise<SaleResponse[]>
  createSale: (saleData: SaleRequest) => Promise<SaleResponse>
  updateSale: (saleId: number, saleData: SaleRequest) => Promise<SaleResponse>
  deleteSale: (saleId: number) => Promise<void>
}
