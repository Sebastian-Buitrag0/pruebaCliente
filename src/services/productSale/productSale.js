// src/services/productSaleService.js
import { api as axiosInstance } from 'src/boot/axios'
import { ProductSaleApi } from 'src/services/generated-api/api' //
import { Notify } from 'quasar'

const productSaleApi = new ProductSaleApi(undefined, undefined, axiosInstance)

export const ProductSaleService = {
  async createProductSale(productSaleRequest) {
    try {
      const response = await productSaleApi.apiProductSalePost(productSaleRequest) //

      if (
        response &&
        (response.status === 200 || response.status === 201) &&
        response.data &&
        response.data.id
      ) {
        Notify.create({
          type: 'positive',
          message: 'Ítem de venta creado exitosamente.',
        })
        return response.data
      } else if (response && (response.status === 200 || response.status === 201)) {
        Notify.create({
          type: 'warning',
          message: 'Ítem de venta creado, pero no se recibió ID. La venta podría fallar.',
        })

        return { ...productSaleRequest, id: null }
      } else {
        throw new Error('Respuesta inesperada al crear el ítem de venta.')
      }
    } catch (error) {
      console.error('Error al crear ProductSale:', error)
      let errorMessage = 'Error al crear el ítem de venta.'
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

  async fetchProductSales() {
    try {
      const response = await productSaleApi.apiProductSaleGet() // Assumes this method exists for fetching all product sales
      if (response && response.status === 200 && response.data) {
        return response.data
      } else {
        throw new Error('Respuesta inesperada al obtener los ítems de venta.')
      }
    } catch (error) {
      console.error('Error al obtener ProductSales:', error)
      let errorMessage = 'Error al obtener los ítems de venta.'
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

  async updateProductSale(productSaleId, productSaleData) {
    try {
      // Assumes method name is apiProductSaleIdPut or similar, adjust if different
      const response = await productSaleApi.apiProductSaleIdPut(productSaleId, productSaleData)
      if (response && response.status === 200 && response.data) {
        Notify.create({
          type: 'positive',
          message: 'Ítem de venta actualizado exitosamente.',
        })
        return response.data
      } else {
        throw new Error('Respuesta inesperada al actualizar el ítem de venta.')
      }
    } catch (error) {
      console.error('Error al actualizar ProductSale:', error)
      let errorMessage = 'Error al actualizar el ítem de venta.'
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

  async deleteProductSale(productSaleId) {
    try {
      // Assumes method name is apiProductSaleIdDelete or similar, adjust if different
      const response = await productSaleApi.apiProductSaleIdDelete(productSaleId)
      if (response && (response.status === 200 || response.status === 204)) {
        Notify.create({
          type: 'positive',
          message: 'Ítem de venta eliminado exitosamente.',
        })
        // No content is usually returned for a delete operation
      } else {
        throw new Error('Respuesta inesperada al eliminar el ítem de venta.')
      }
    } catch (error) {
      console.error('Error al eliminar ProductSale:', error)
      let errorMessage = 'Error al eliminar el ítem de venta.'
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
