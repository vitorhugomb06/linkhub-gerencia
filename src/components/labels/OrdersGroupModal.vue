<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="`Pedidos do ${group?.name || 'Grupo'}`"
    :style="{ width: '860px', maxWidth: '95vw' }"
    :closable="true"
    :draggable="false"
  >
    <div v-if="group">
      <!-- Group summary -->
      <div style="display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap">
        <div style="padding:10px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
          <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;font-weight:500">Grupo</div>
          <div style="font-size:13px;font-weight:600;color:#1e293b;margin-top:2px">{{ group.name }}</div>
        </div>
        <div style="padding:10px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
          <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;font-weight:500">Pedidos</div>
          <div style="font-size:13px;font-weight:600;color:#1e293b;margin-top:2px">{{ group.orders.length }}</div>
        </div>
        <div style="padding:10px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
          <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;font-weight:500">Gerado em</div>
          <div style="font-size:13px;font-weight:600;color:#1e293b;margin-top:2px">{{ group.generatedAt }}</div>
        </div>
        <div style="padding:10px 16px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
          <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;font-weight:500">Responsável</div>
          <div style="font-size:13px;font-weight:600;color:#1e293b;margin-top:2px">{{ group.user }}</div>
        </div>
      </div>

      <DataTable
        :value="group.orders"
        :paginator="group.orders.length > 10"
        :rows="10"
        size="small"
        stripedRows
        style="font-size:13px"
      >
        <Column field="number" header="Nº Pedido" style="min-width:120px">
          <template #body="{ data }">
            <span style="font-weight:600;color:#3b82f6">{{ data.number }}</span>
          </template>
        </Column>
        <Column field="client" header="Cliente" style="min-width:160px" />
        <Column field="value" header="Valor" style="min-width:100px">
          <template #body="{ data }">
            <span style="font-weight:500">{{ formatCurrency(data.value) }}</span>
          </template>
        </Column>
        <Column field="labelCode" header="Código Etiqueta" style="min-width:160px">
          <template #body="{ data }">
            <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:11px">{{ data.labelCode }}</code>
          </template>
        </Column>
        <Column field="labelStatus" header="Status Etiqueta" style="min-width:130px">
          <template #body="{ data }">
            <Tag :value="data.labelStatus" :severity="getLabelStatusSeverity(data.labelStatus)" />
          </template>
        </Column>
        <Column field="generatedAt" header="Data Geração" style="min-width:130px" />
      </DataTable>
    </div>

    <template #footer>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <Button label="Fechar" severity="secondary" outlined @click="visible = false" />
        <Button label="Imprimir Etiquetas" icon="pi pi-print" @click="print" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  group: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'print'])

const visible = ref(props.modelValue)

watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))

function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
}

function getLabelStatusSeverity(status) {
  const map = { 'Gerada': 'success', 'Pendente': 'warn', 'Erro': 'danger' }
  return map[status] || 'secondary'
}

function print() {
  emit('print', props.group)
  visible.value = false
}
</script>
