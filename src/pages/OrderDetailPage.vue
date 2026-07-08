<template>
  <!-- Breadcrumb -->
  <div class="app-breadcrumb">
    <div class="breadcrumb-item">
      <a href="#"><i class="pi pi-home"></i> Home</a>
    </div>
    <span class="breadcrumb-separator"><i class="pi pi-chevron-right" style="font-size:10px"></i></span>
    <div class="breadcrumb-item">
      <a href="#" @click.prevent="$router.push('/pedidos')">Pedidos</a>
    </div>
    <span class="breadcrumb-separator"><i class="pi pi-chevron-right" style="font-size:10px"></i></span>
    <span class="breadcrumb-current">Detalhe</span>
  </div>

  <!-- Page content -->
  <div class="app-content">
    <!-- Page header -->
    <div class="page-header">
      <span class="page-title">INFORMAÇÕES DO PEDIDO</span>
      <div class="page-actions">
        <Button label="Voltar" icon="pi pi-arrow-left" severity="secondary" outlined size="small" @click="$router.back()" />
        <Button icon="pi pi-code" severity="secondary" outlined size="small" v-tooltip.top="'Ver JSON do pedido'" @click="showJsonDialog = true" />
        <Button icon="pi pi-history" severity="secondary" outlined size="small" v-tooltip.top="'Histórico'" />
        <Button label="Atualizar status" icon="pi pi-pencil" severity="secondary" outlined size="small" @click="showUpdateStatus = true" />
        <Button label="Imprimir" icon="pi pi-print" size="small" @click="handlePrint" />
      </div>
    </div>

    <!-- Loading skeleton -->
    <template v-if="loading">
      <div style="background:#060e2c;border-radius:10px;padding:18px 24px;margin-bottom:16px">
        <Skeleton width="300px" height="28px" style="margin-bottom:10px" />
        <Skeleton width="200px" height="16px" />
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:16px">
        <Skeleton width="100%" height="120px" />
      </div>
    </template>

    <template v-else-if="order">
      <!-- Order header card -->
      <OrderDetailHeader :order="order" />

      <!-- Delivery selector -->
      <div class="delivery-selector">
        <i class="pi pi-truck" style="color:#3b82f6;font-size:14px"></i>
        <span class="delivery-label">Entrega</span>
        <Select
          v-model="selectedDelivery"
          :options="order.deliveries"
          optionLabel="label"
          size="small"
          style="min-width:160px"
        />
        <span class="delivery-hint">As informações abaixo referem-se à entrega selecionada.</span>
      </div>

      <!-- Status timeline — standalone, fora do Acompanhamento -->
      <OrderStatusTimeline :steps="order.timeline" />

      <!-- Acompanhamento do Pedido — só dados da transportadora unificados -->
      <OrderTimeline :shipping="order.shipping" :freight="order.freight" :tracking="order.tracking" />

      <!-- Personal info + Items side by side -->
      <div class="personal-items-row">
        <OrderPersonalInfo :shipping="order.shippingAddress" />
        <OrderItems :items="order.items" :totals="order.totals" />
      </div>

      <!-- Billing — linha completa acima dos pagamentos -->
      <OrderBilling :billing="order.billingData" />

      <!-- Payments — 3 cards lado a lado, largura total -->
      <OrderTransaction :payments="order.payments" />

      <!-- Additional data -->
      <OrderAdditionalData :fields="order.additionalFields" :viewedBy="order.viewedBy" />
    </template>

    <!-- Error state -->
    <div v-else class="content-card" style="padding:48px;text-align:center">
      <i class="pi pi-exclamation-triangle" style="font-size:48px;color:#f59e0b;margin-bottom:12px;display:block"></i>
      <div style="font-size:14px;font-weight:600;color:#1e293b;margin-bottom:4px">Pedido não encontrado</div>
      <div style="font-size:12px;color:#64748b">Não foi possível carregar os dados deste pedido.</div>
    </div>
  </div>

  <!-- Update Status Dialog -->
  <Dialog v-model:visible="showUpdateStatus" modal header="Atualizar Status" :style="{ width: '400px' }">
    <div style="display:flex;flex-direction:column;gap:12px;padding:8px 0">
      <div style="font-size:13px;color:#64748b">Selecione o novo status para o pedido <strong>#{{ order?.number }}</strong>:</div>
      <Select
        v-model="newStatus"
        :options="statusOptions"
        placeholder="Selecione um status"
        style="width:100%"
      />
    </div>
    <template #footer>
      <Button label="Cancelar" severity="secondary" outlined @click="showUpdateStatus = false" />
      <Button label="Confirmar" icon="pi pi-check" @click="confirmUpdateStatus" :disabled="!newStatus" />
    </template>
  </Dialog>

  <!-- JSON Dialog -->
  <Dialog v-model:visible="showJsonDialog" modal header="JSON do Pedido" :style="{ width: '760px', maxWidth: '95vw' }">
    <div style="background:#0f172a;border-radius:8px;padding:16px;overflow:auto;max-height:60vh">
      <pre style="font-size:11px;color:#e2e8f0;font-family:'Courier New',monospace;white-space:pre-wrap;word-break:break-all;margin:0">{{ JSON.stringify(order, null, 2) }}</pre>
    </div>
    <template #footer>
      <Button label="Fechar" severity="secondary" outlined @click="showJsonDialog = false" />
      <Button label="Copiar JSON" icon="pi pi-copy" @click="copyJson" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Dialog from 'primevue/dialog'
import Skeleton from 'primevue/skeleton'

import OrderDetailHeader from '../components/order/OrderDetailHeader.vue'
import OrderStatusTimeline from '../components/order/OrderStatusTimeline.vue'
import OrderTimeline from '../components/order/OrderTimeline.vue'
import OrderPersonalInfo from '../components/order/OrderPersonalInfo.vue'
import OrderItems from '../components/order/OrderItems.vue'
import OrderBilling from '../components/order/OrderBilling.vue'
import OrderTransaction from '../components/order/OrderTransaction.vue'
import OrderAdditionalData from '../components/order/OrderAdditionalData.vue'

import { fetchOrderDetail } from '../mocks/orderDetailMock.js'

const route = useRoute()
const toast = useToast()

const loading = ref(true)
const order = ref(null)
const selectedDelivery = ref(null)
const showUpdateStatus = ref(false)
const newStatus = ref(null)
const showJsonDialog = ref(false)

const statusOptions = [
  'Aguardando Aprovação',
  'Aprovado',
  'Em separação',
  'Enviado',
  'Entregue',
  'Cancelado',
]

onMounted(async () => {
  try {
    const id = route.params.id || '3'
    order.value = await fetchOrderDetail(id)
    selectedDelivery.value = order.value.deliveries?.[0] || null
  } finally {
    loading.value = false
  }
})

function handlePrint() {
  toast.add({ severity: 'info', summary: 'Impressão', detail: 'Preparando documento para impressão...', life: 3000 })
  setTimeout(() => window.print(), 500)
}

function confirmUpdateStatus() {
  if (order.value) order.value.status = newStatus.value
  showUpdateStatus.value = false
  newStatus.value = null
  toast.add({ severity: 'success', summary: 'Status atualizado', detail: 'O status do pedido foi atualizado com sucesso.', life: 3000 })
}

function copyJson() {
  navigator.clipboard.writeText(JSON.stringify(order.value, null, 2))
  toast.add({ severity: 'success', summary: 'Copiado', detail: 'JSON copiado para a área de transferência.', life: 2000 })
}
</script>

<style scoped>
.delivery-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 20px;
  margin-bottom: 16px;
}

.delivery-label {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.delivery-hint {
  font-size: 12px;
  color: #94a3b8;
  margin-left: 4px;
}

/* Personal + Items side by side */
.personal-items-row {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 16px;
  margin-bottom: 16px;
  align-items: start;
}
</style>
