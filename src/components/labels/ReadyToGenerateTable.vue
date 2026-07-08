<template>
  <div class="content-card split-right" style="height:100%;display:flex;flex-direction:column;overflow:hidden">
    <!-- Panel header -->
    <div class="panel-header">
      <div style="display:flex;align-items:center;gap:8px">
        <i class="pi pi-list" style="color:#3b82f6"></i>
        <span class="panel-title">
          Pedidos Aptos
          <span v-if="carrier" style="color:#64748b;font-weight:400"> — {{ carrier.name }}</span>
        </span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span v-if="selectedOrders.length > 0" style="font-size:12px;color:#3b82f6;font-weight:500">
          {{ selectedOrders.length }} selecionado(s)
        </span>
        <Button
          label="Gerar Etiquetas"
          icon="pi pi-tag"
          size="small"
          :disabled="selectedOrders.length === 0"
          @click="$emit('generate', selectedOrders)"
        />
      </div>
    </div>

    <!-- No carrier selected -->
    <div v-if="!carrier" class="empty-state" style="flex:1">
      <div class="empty-state-icon">
        <i class="pi pi-arrow-left"></i>
      </div>
      <div class="empty-state-title">Selecione uma transportadora</div>
      <div class="empty-state-desc">Escolha uma transportadora na lista ao lado para ver os pedidos aptos.</div>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" style="flex:1;overflow:auto;padding:16px">
      <div v-for="i in 6" :key="i" style="display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9">
        <Skeleton width="20px" height="20px" borderRadius="4px" />
        <Skeleton width="80px" height="14px" />
        <Skeleton width="120px" height="14px" />
        <Skeleton width="90px" height="14px" />
        <Skeleton width="70px" height="14px" />
        <Skeleton width="60px" height="14px" />
      </div>
    </div>

    <!-- Empty orders -->
    <div v-else-if="orders.length === 0" class="empty-state" style="flex:1">
      <div class="empty-state-icon">
        <i class="pi pi-inbox"></i>
      </div>
      <div class="empty-state-title">Nenhum pedido apto</div>
      <div class="empty-state-desc">Não há pedidos aguardando geração de etiqueta para esta transportadora.</div>
    </div>

    <!-- DataTable -->
    <div v-else style="flex:1;overflow:auto">
      <DataTable
        v-model:selection="selectedOrders"
        :value="orders"
        dataKey="id"
        selectionMode="multiple"
        :metaKeySelection="false"
        scrollable
        scrollHeight="flex"
        size="small"
        stripedRows
        style="font-size:13px"
      >
        <Column selectionMode="multiple" style="width:48px;flex:none" />
        <Column field="number" header="Nº Pedido" style="min-width:110px">
          <template #body="{ data }">
            <span style="font-weight:600;color:#3b82f6">{{ data.number }}</span>
          </template>
        </Column>
        <Column field="client" header="Cliente" style="min-width:140px" />
        <Column field="date" header="Data" style="min-width:100px" />
        <Column field="value" header="Valor" style="min-width:100px">
          <template #body="{ data }">
            {{ formatCurrency(data.value) }}
          </template>
        </Column>
        <Column field="items" header="Itens" style="min-width:60px;text-align:center">
          <template #body="{ data }">
            <Badge :value="data.items" severity="secondary" />
          </template>
        </Column>
        <Column field="shippingMethod" header="Envio" style="min-width:100px" />
        <Column field="status" header="Status" style="min-width:110px">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
          </template>
        </Column>
        <Column header="Ações" style="min-width:80px;text-align:center">
          <template #body="{ data }">
            <Button icon="pi pi-eye" text rounded size="small" severity="secondary" @click="$emit('view', data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Floating action bar when items selected -->
    <div v-if="selectedOrders.length > 0" class="floating-action-bar">
      <div class="selection-info">
        <span class="selection-count">{{ selectedOrders.length }}</span>
        pedido(s) selecionado(s)
        <Button label="Limpar seleção" text size="small" @click="selectedOrders = []" style="margin-left:4px" />
      </div>
      <Button
        label="Gerar Etiquetas"
        icon="pi pi-tag"
        @click="$emit('generate', selectedOrders)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'

const props = defineProps({
  carrier: { type: Object, default: null },
  orders: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

defineEmits(['generate', 'view'])

const selectedOrders = ref([])

watch(() => props.carrier, () => { selectedOrders.value = [] })

function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function getStatusSeverity(status) {
  const map = {
    'Aguardando': 'warn',
    'Aprovado': 'success',
    'Em separação': 'info',
    'Pendente': 'secondary'
  }
  return map[status] || 'secondary'
}
</script>
