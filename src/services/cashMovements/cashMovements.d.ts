import type { CashMovementsResponse, CashMovementsRequest } from '../generated-api'

export const CashMovementService: {
  fetchCashMovements: () => Promise<CashMovementsResponse[]>
  createCashMovement: (cashMovementData: CashMovementsRequest) => Promise<CashMovementsResponse>
  updateCashMovement: (
    cashMovementId: number,
    cashMovementData: CashMovementsRequest,
  ) => Promise<CashMovementsResponse>
  deleteCashMovement: (cashMovementId: number) => Promise<void>
}
