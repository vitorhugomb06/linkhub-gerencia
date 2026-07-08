<template>
  <div class="content-card split-left" style="height:100%">
    <div class="panel-header">
      <span class="panel-title">
        <i class="pi pi-truck" style="margin-right:6px;color:#3b82f6"></i>
        Transportadoras
      </span>
      <Badge :value="carriers.length" severity="secondary" />
    </div>

    <div class="panel-body" style="padding:8px">
      <!-- Skeleton loading -->
      <template v-if="loading">
        <div v-for="i in 5" :key="i" style="padding:8px;margin-bottom:4px">
          <div style="display:flex;align-items:center;gap:10px">
            <Skeleton shape="square" size="40px" borderRadius="8px" />
            <div style="flex:1">
              <Skeleton width="70%" height="14px" style="margin-bottom:6px" />
              <Skeleton width="40%" height="11px" />
            </div>
          </div>
        </div>
      </template>

      <!-- Empty state -->
      <div v-else-if="carriers.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <i class="pi pi-truck"></i>
        </div>
        <div class="empty-state-title">Nenhuma transportadora</div>
        <div class="empty-state-desc">Não há transportadoras disponíveis no momento.</div>
      </div>

      <!-- Carrier items -->
      <template v-else>
        <div
          v-for="carrier in carriers"
          :key="carrier.id"
          class="carrier-item"
          :class="{ active: selectedCarrier?.id === carrier.id }"
          @click="$emit('select', carrier)"
        >
          <div class="carrier-icon" :style="{ background: carrier.color }">
            <i :class="carrier.icon"></i>
          </div>
          <div class="carrier-info">
            <div class="carrier-name">{{ carrier.name }}</div>
            <div class="carrier-count">{{ carrier.count }} {{ countLabel }}</div>
          </div>
          <div class="carrier-badge">
            <Badge :value="carrier.count" :severity="carrier.count > 0 ? 'info' : 'secondary'" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import Badge from 'primevue/badge'
import Skeleton from 'primevue/skeleton'

defineProps({
  carriers: { type: Array, default: () => [] },
  selectedCarrier: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  countLabel: { type: String, default: 'pedidos' }
})

defineEmits(['select'])
</script>
