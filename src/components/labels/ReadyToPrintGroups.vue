<template>
  <div class="content-card split-right" style="height:100%;display:flex;flex-direction:column;overflow:hidden">
    <div class="panel-header">
      <div style="display:flex;align-items:center;gap:8px">
        <i class="pi pi-print" style="color:#3b82f6"></i>
        <span class="panel-title">
          Grupos de Etiquetas
          <span v-if="carrier" style="color:#64748b;font-weight:400"> — {{ carrier.name }}</span>
        </span>
      </div>
      <Badge v-if="groups.length > 0" :value="groups.length + ' grupos'" severity="info" />
    </div>

    <!-- No carrier selected -->
    <div v-if="!carrier" class="empty-state" style="flex:1">
      <div class="empty-state-icon">
        <i class="pi pi-arrow-left"></i>
      </div>
      <div class="empty-state-title">Selecione uma transportadora</div>
      <div class="empty-state-desc">Escolha uma transportadora para ver os grupos de etiquetas prontos para impressão.</div>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" style="flex:1;overflow:auto;padding:16px">
      <div v-for="i in 4" :key="i" style="margin-bottom:12px">
        <div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:12px">
            <Skeleton width="120px" height="16px" />
            <Skeleton width="70px" height="22px" borderRadius="12px" />
          </div>
          <div style="display:flex;gap:16px;margin-bottom:12px">
            <Skeleton width="80px" height="36px" borderRadius="8px" />
            <Skeleton width="80px" height="36px" borderRadius="8px" />
            <Skeleton width="80px" height="36px" borderRadius="8px" />
          </div>
          <div style="display:flex;justify-content:flex-end;gap:8px">
            <Skeleton width="130px" height="32px" borderRadius="6px" />
            <Skeleton width="130px" height="32px" borderRadius="6px" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty groups -->
    <div v-else-if="groups.length === 0" class="empty-state" style="flex:1">
      <div class="empty-state-icon">
        <i class="pi pi-folder-open"></i>
      </div>
      <div class="empty-state-title">Nenhum grupo disponível</div>
      <div class="empty-state-desc">Não há grupos de etiquetas gerados para esta transportadora.</div>
    </div>

    <!-- Groups list -->
    <div v-else style="flex:1;overflow-y:auto;padding:16px">
      <div
        v-for="group in groups"
        :key="group.id"
        class="group-card"
      >
        <div class="group-card-header">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="width:32px;height:32px;border-radius:8px;background:#eff6ff;display:flex;align-items:center;justify-content:center">
              <i class="pi pi-folder" style="color:#3b82f6;font-size:14px"></i>
            </div>
            <div>
              <div class="group-card-title">{{ group.name }}</div>
              <div style="font-size:11px;color:#94a3b8">ID: {{ group.id }}</div>
            </div>
          </div>
          <Tag :value="group.status" :severity="getGroupStatusSeverity(group.status)" />
        </div>

        <div class="group-card-meta">
          <div class="group-meta-item">
            <span class="group-meta-label">Pedidos</span>
            <span class="group-meta-value">
              <Badge :value="group.orders.length" severity="info" />
            </span>
          </div>
          <div class="group-meta-item">
            <span class="group-meta-label">Gerado em</span>
            <span class="group-meta-value">{{ group.generatedAt }}</span>
          </div>
          <div class="group-meta-item">
            <span class="group-meta-label">Responsável</span>
            <span class="group-meta-value">{{ group.user }}</span>
          </div>
        </div>

        <Divider style="margin:8px 0" />

        <div class="group-card-actions">
          <Button
            label="Visualizar Pedidos"
            icon="pi pi-eye"
            size="small"
            severity="secondary"
            outlined
            @click="$emit('viewOrders', group)"
          />
          <Button
            label="Imprimir Etiquetas"
            icon="pi pi-print"
            size="small"
            @click="$emit('print', group)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'
import Divider from 'primevue/divider'

defineProps({
  carrier: { type: Object, default: null },
  groups: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

defineEmits(['viewOrders', 'print'])

function getGroupStatusSeverity(status) {
  const map = { 'Pronto': 'success', 'Impresso': 'secondary', 'Pendente': 'warn' }
  return map[status] || 'secondary'
}
</script>
