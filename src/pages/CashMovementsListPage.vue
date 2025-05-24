<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Movimientos de Caja"
        :rows="cashMovements"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        bordered
      >
        <template v-slot:top-right>
          <q-btn
            color="primary"
            icon-label="refresh"
            label="Refrescar"
            @click="loadCashMovements"
            class="q-ml-sm"
          />
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              dense
              round
              flat
              color="grey"
              @click="viewDetails(props.row)"
              icon="visibility"
            ></q-btn>
            <!-- Add more actions if needed -->
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="showDetailsModal">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6">Detalles del Movimiento</div>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="selectedMovement">
          <q-list bordered separator>
            <q-item>
              <q-item-section>
                <q-item-label overline>ID</q-item-label>
                <q-item-label>{{ selectedMovement.id }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Fecha</q-item-label>
                <q-item-label>{{ formatDate(selectedMovement.date) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Monto</q-item-label>
                <q-item-label>{{ formatCurrency(selectedMovement.amount) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Tipo</q-item-label>
                <q-item-label>{{
                  selectedMovement.type === 0 ? 'Ingreso' : 'Egreso'
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="selectedMovement.saleId">
              <q-item-section>
                <q-item-label overline>ID Venta Asociada</q-item-label>
                <q-item-label>{{ selectedMovement.saleId }}</q-item-label>
              </q-item-section>
            </q-item>
            <!-- Add more details as needed from CashMovementsResponse -->
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { CashMovementService } from 'src/services/cashMovements/cashMovements'
// Assuming CashMovementsResponse is defined in your generated API types
// import type { CashMovementsResponse } from 'src/services/generated-api/api'

const $q = useQuasar()

const cashMovements = ref([]) // CashMovementsResponse[]
const loading = ref(false)
const showDetailsModal = ref(false)
const selectedMovement = ref(null) // CashMovementsResponse | null

const columns = [
  { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
  {
    name: 'date',
    align: 'left',
    label: 'Fecha',
    field: 'date',
    sortable: true,
    format: (val) => formatDate(val),
  },
  {
    name: 'amount',
    align: 'right',
    label: 'Monto',
    field: 'amount',
    sortable: true,
    format: (val) => formatCurrency(val),
  },
  {
    name: 'type',
    align: 'left',
    label: 'Tipo',
    field: 'type',
    sortable: true,
    format: (val) => (val === 0 ? 'Ingreso' : 'Egreso'),
  },
  { name: 'saleId', align: 'left', label: 'ID Venta', field: 'saleId', sortable: true },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' },
]

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

function formatCurrency(value) {
  if (typeof value !== 'number') return 'N/A'
  return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) // Adjust currency as needed
}

async function loadCashMovements() {
  loading.value = true
  try {
    // Ensure getAllCashMovements returns the array of movements directly
    const response = await CashMovementService.getAllCashMovements()
    cashMovements.value = response // Assuming response is CashMovementsResponse[]
    $q.notify({ type: 'positive', message: 'Movimientos de caja cargados.' })
  } catch (error) {
    console.error('Error al cargar movimientos de caja:', error)
    $q.notify({ type: 'negative', message: error.message || 'Error al cargar los movimientos.' })
    cashMovements.value = [] // Clear data on error
  } finally {
    loading.value = false
  }
}

function viewDetails(movement) {
  selectedMovement.value = movement
  showDetailsModal.value = true
}

onMounted(() => {
  loadCashMovements()
})
</script>

<style scoped>
.q-table__top {
  justify-content: space-between;
}
</style>
