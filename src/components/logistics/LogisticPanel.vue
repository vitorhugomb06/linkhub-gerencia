<template>
  <div class="content-card split-right" style="height:100%;display:flex;flex-direction:column;overflow:hidden">

    <!-- Panel header -->
    <div class="panel-header">
      <div style="display:flex;align-items:center;gap:8px">
        <i class="pi pi-truck" style="color:#3b82f6"></i>
        <span class="panel-title">
          Logísticas
          <span v-if="marketplace" style="color:#64748b;font-weight:400">
            — {{ marketplace.name }}
          </span>
        </span>
      </div>
      <Badge
        v-if="logistics.length > 0"
        :value="logistics.length + ' modalidade(s)'"
        severity="info"
      />
    </div>

    <!-- No marketplace selected -->
    <div v-if="!marketplace && !loading" class="empty-state" style="flex:1">
      <div class="empty-state-icon">
        <i class="pi pi-arrow-left"></i>
      </div>
      <div class="empty-state-title">Selecione um marketplace</div>
      <div class="empty-state-desc">
        Escolha um marketplace na lista ao lado para visualizar e configurar suas logísticas.
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-else-if="loading" style="flex:1;overflow:auto;padding:16px">
      <div
        v-for="i in 4"
        :key="i"
        style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin-bottom:8px"
      >
        <div style="display:flex;align-items:center;gap:12px">
          <Skeleton width="20px" height="20px" borderRadius="4px" />
          <div style="flex:1">
            <Skeleton width="55%" height="14px" style="margin-bottom:6px" />
            <Skeleton width="30%" height="11px" />
          </div>
          <Skeleton width="60px" height="22px" borderRadius="10px" />
          <Skeleton width="36px" height="20px" borderRadius="10px" />
        </div>
      </div>
    </div>

    <!-- Empty logistics for this marketplace -->
    <div v-else-if="logistics.length === 0" class="empty-state" style="flex:1">
      <div class="empty-state-icon">
        <i class="pi pi-inbox"></i>
      </div>
      <div class="empty-state-title">Nenhuma logística disponível</div>
      <div class="empty-state-desc">
        Não há modalidades logísticas configuradas para {{ marketplace?.name }}.
      </div>
    </div>

    <!-- Logistics list -->
    <div v-else style="flex:1;overflow-y:auto;padding:16px">
      <LogisticItem
        v-for="logistic in logistics"
        :key="logistic.id"
        :logistic="logistic"
        :saving="savingId === logistic.id"
        @toggle="$emit('toggle', $event)"
      />
    </div>

  </div>
</template>

<script setup>
import Badge from 'primevue/badge'
import Skeleton from 'primevue/skeleton'
import LogisticItem from './LogisticItem.vue'

defineProps({
  marketplace: { type: Object, default: null },
  logistics: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  savingId: { type: String, default: null }
})

defineEmits(['toggle'])
</script>
