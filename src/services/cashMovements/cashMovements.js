// src/services/cashMovementService.js
import { api as axiosInstance } from 'src/boot/axios'
import { CashMovementsApi } from 'src/services/generated-api/api' //
import { Notify } from 'quasar'

const cashMovementsApi = new CashMovementsApi(undefined, undefined, axiosInstance)

export const CashMovementService = {
  async createCashMovement(cashMovementRequest) {
    try {
      // El endpoint POST /api/CashMovements espera un CashMovementsRequest
      // Asumimos que devuelve CashMovementsResponse según el GET /api/CashMovements/{id}
      const response = await cashMovementsApi.apiCashMovementsPost(cashMovementRequest) //

      // Similar a los anteriores, el POST /api/CashMovements no especifica un cuerpo de respuesta.
      // Asumimos que devuelve CashMovementsResponse.
      if (response && (response.status === 200 || response.status === 201) && response.data) {
        Notify.create({
          type: 'positive',
          message: 'Movimiento de caja registrado exitosamente.',
        })
        return response.data // CashMovementsResponse
      } else if (response && (response.status === 200 || response.status === 201)) {
        Notify.create({
          type: 'positive',
          message: 'Movimiento de caja registrado (sin respuesta detallada de la API).',
        })
        return cashMovementRequest // Devuelve el request como placeholder
      } else {
        throw new Error('Respuesta inesperada al registrar el movimiento de caja.')
      }
    } catch (error) {
      console.error('Error al crear CashMovement:', error)
      let errorMessage = 'Error al registrar el movimiento de caja.'
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

  async getAllCashMovements() {
    try {
      const response = await cashMovementsApi.apiCashMovementsGet() // Assumes GET /api/CashMovements returns CashMovementsResponse[]
      if (response && response.status === 200 && response.data) {
        return response.data // CashMovementsResponse[]
      } else {
        throw new Error('Respuesta inesperada al obtener los movimientos de caja.')
      }
    } catch (error) {
      console.error('Error al obtener CashMovements:', error)
      let errorMessage = 'Error al obtener los movimientos de caja.'
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
