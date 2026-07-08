<template>
  <!-- Breadcrumb -->
  <div class="app-breadcrumb">
    <div class="breadcrumb-item">
      <a href="#"><i class="pi pi-home"></i> Home</a>
    </div>
    <span class="breadcrumb-separator"><i class="pi pi-chevron-right" style="font-size:10px"></i></span>
    <span class="breadcrumb-current">Gestão de Etiquetas</span>
  </div>

  <!-- Page content -->
  <div class="app-content">
    <!-- Page header -->
    <div class="page-header">
      <span class="page-title">
        <i class="pi pi-tag" style="margin-right:6px"></i>
        Gestão de Etiquetas
      </span>
      <div class="page-actions">
        <Button label="Atualizar" icon="pi pi-refresh" severity="secondary" outlined size="small" @click="refresh" />
      </div>
    </div>

    <!-- TabView -->
    <div class="content-card" style="overflow:visible">
      <TabView v-model:activeIndex="activeTab" lazy>
        <!-- Tab 1: Pedidos Aptos -->
        <TabPanel>
          <template #header>
            <div style="display:flex;align-items:center;gap:6px">
              <i class="pi pi-list-check"></i>
              <span>Pedidos Aptos para Gerar Etiquetas</span>
              <Badge
                v-if="totalAptOrders > 0"
                :value="totalAptOrders"
                severity="warn"
                style="margin-left:4px"
              />
            </div>
          </template>

          <div style="padding:16px">
            <div class="split-layout">
              <CarrierList
                :carriers="carriersForGenerate"
                :selectedCarrier="selectedCarrierGenerate"
                :loading="loadingCarriers"
                countLabel="pedidos aptos"
                @select="onSelectCarrierGenerate"
              />
              <ReadyToGenerateTable
                :carrier="selectedCarrierGenerate"
                :orders="aptOrders"
                :loading="loadingAptOrders"
                @generate="onGenerateLabels"
                @view="onViewOrder"
              />
            </div>
          </div>
        </TabPanel>

        <!-- Tab 2: Prontos para Impressão -->
        <TabPanel>
          <template #header>
            <div style="display:flex;align-items:center;gap:6px">
              <i class="pi pi-print"></i>
              <span>Prontos para Impressão da Etiqueta</span>
              <Badge
                v-if="totalPrintGroups > 0"
                :value="totalPrintGroups"
                severity="info"
                style="margin-left:4px"
              />
            </div>
          </template>

          <div style="padding:16px">
            <div class="split-layout">
              <CarrierList
                :carriers="carriersForPrint"
                :selectedCarrier="selectedCarrierPrint"
                :loading="loadingCarriers"
                countLabel="grupos"
                @select="onSelectCarrierPrint"
              />
              <ReadyToPrintGroups
                :carrier="selectedCarrierPrint"
                :groups="printGroups"
                :loading="loadingPrintGroups"
                @viewOrders="onViewGroupOrders"
                @print="onPrintGroup"
              />
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>

  <!-- Generate Labels Dialog -->
  <GenerateLabelsDialog
    v-model="showGenerateDialog"
    :count="ordersToGenerate.length"
    :carrier="selectedCarrierGenerate?.name || ''"
    @confirm="onConfirmGenerate"
  />

  <!-- Orders Group Modal -->
  <OrdersGroupModal
    v-model="showGroupModal"
    :group="selectedGroup"
    @print="onPrintGroup"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

import CarrierList from '../components/labels/CarrierList.vue'
import ReadyToGenerateTable from '../components/labels/ReadyToGenerateTable.vue'
import ReadyToPrintGroups from '../components/labels/ReadyToPrintGroups.vue'
import GenerateLabelsDialog from '../components/labels/GenerateLabelsDialog.vue'
import OrdersGroupModal from '../components/labels/OrdersGroupModal.vue'

import {
  mockCarriersForGenerate,
  mockCarriersForPrint,
  fetchOrdersForCarrier,
  fetchGroupsForCarrier
} from '../mocks/labelsMock.js'

const toast = useToast()

// Tabs
const activeTab = ref(0)

// Carriers
const loadingCarriers = ref(false)
const carriersForGenerate = ref([...mockCarriersForGenerate])
const carriersForPrint = ref([...mockCarriersForPrint])

// Tab 1 state
const selectedCarrierGenerate = ref(null)
const aptOrders = ref([])
const loadingAptOrders = ref(false)
const showGenerateDialog = ref(false)
const ordersToGenerate = ref([])

// Tab 2 state
const selectedCarrierPrint = ref(null)
const printGroups = ref([])
const loadingPrintGroups = ref(false)
const showGroupModal = ref(false)
const selectedGroup = ref(null)

// Computed
const totalAptOrders = computed(() => carriersForGenerate.value.reduce((s, c) => s + c.count, 0))
const totalPrintGroups = computed(() => carriersForPrint.value.reduce((s, c) => s + c.count, 0))

// Actions
async function onSelectCarrierGenerate(carrier) {
  selectedCarrierGenerate.value = carrier
  loadingAptOrders.value = true
  aptOrders.value = []
  try {
    aptOrders.value = await fetchOrdersForCarrier(carrier.id)
  } finally {
    loadingAptOrders.value = false
  }
}

async function onSelectCarrierPrint(carrier) {
  selectedCarrierPrint.value = carrier
  loadingPrintGroups.value = true
  printGroups.value = []
  try {
    printGroups.value = await fetchGroupsForCarrier(carrier.id)
  } finally {
    loadingPrintGroups.value = false
  }
}

function onGenerateLabels(orders) {
  ordersToGenerate.value = orders
  showGenerateDialog.value = true
}

function onConfirmGenerate() {
  const count = ordersToGenerate.value.length
  // Remove from apt list
  const ids = new Set(ordersToGenerate.value.map(o => o.id))
  aptOrders.value = aptOrders.value.filter(o => !ids.has(o.id))
  // Update carrier count
  if (selectedCarrierGenerate.value) {
    const c = carriersForGenerate.value.find(c => c.id === selectedCarrierGenerate.value.id)
    if (c) c.count = Math.max(0, c.count - count)
  }
  ordersToGenerate.value = []
  toast.add({
    severity: 'success',
    summary: 'Etiquetas geradas',
    detail: `${count} etiqueta(s) gerada(s) com sucesso.`,
    life: 4000
  })
}

function onViewOrder(order) {
  toast.add({ severity: 'info', summary: 'Pedido', detail: `Visualizando pedido ${order.number}`, life: 2000 })
}

function onViewGroupOrders(group) {
  selectedGroup.value = group
  showGroupModal.value = true
}

function onPrintGroup(group) {
  toast.add({
    severity: 'success',
    summary: 'Impressão iniciada',
    detail: `Enviando ${group.orders.length} etiqueta(s) do ${group.name} para impressão.`,
    life: 4000
  })
}

function refresh() {
  selectedCarrierGenerate.value = null
  selectedCarrierPrint.value = null
  aptOrders.value = []
  printGroups.value = []
  toast.add({ severity: 'info', summary: 'Atualizado', detail: 'Dados recarregados.', life: 2000 })
}
</script>
