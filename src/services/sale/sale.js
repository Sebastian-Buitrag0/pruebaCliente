// src/services/saleService.js
import { api as axiosInstance } from 'src/boot/axios'
import { SaleApi } from 'src/services/generated-api/api' //
import { Notify } from 'quasar'

const saleApi = new SaleApi(undefined, undefined, axiosInstance)

export const SaleService = {
  async createSale(saleRequest) {
    try {
      // El endpoint POST /api/Sale espera un SaleRequest
      // Asumimos que devuelve SaleResponse según el GET /api/Sale/{id}
      const response = await saleApi.apiSalePost(saleRequest) //

      // Similar a ProductSale, el POST /api/Sale no especifica un cuerpo de respuesta en api.d.ts.
      // Asumimos que devuelve SaleResponse.
      if (
        response &&
        (response.status === 200 || response.status === 201) &&
        response.data &&
        response.data.id
      ) {
        Notify.create({
          type: 'positive',
          message: 'Venta creada exitosamente.',
        })
        return response.data // SaleResponse
      } else if (response && (response.status === 200 || response.status === 201)) {
        Notify.create({
          type: 'warning',
          message:
            'Venta creada, pero no se recibió ID/Amount. El movimiento de caja podría fallar.',
        })
        return { id: null, amount: 0 } // Placeholder
      } else {
        throw new Error('Respuesta inesperada al crear la venta.')
      }
    } catch (error) {
      console.error('Error al crear Sale:', error)
      let errorMessage = 'Error al crear la venta.'
      if (error.response && error.response.data) {
        errorMessage = error.response.data.title || error.response.data.message || errorMessage
      } else if (error.message) {
        errorMessage = error.message
      }
      Notify.create({
        type: 'negative',
        message: errorMessage,
      })
      throw error
    }
  },
}
