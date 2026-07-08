<template>
  <div class="content-card split-left" style="height:100%">
    <div class="panel-header">
      <span class="panel-title">
        <i class="pi pi-store" style="margin-right:6px;color:#3b82f6"></i>
        Marketplaces
      </span>
      <Badge :value="marketplaces.length" severity="secondary" />
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
      <div v-else-if="marketplaces.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <i class="pi pi-store"></i>
        </div>
        <div class="empty-state-title">Nenhum marketplace</div>
        <div class="empty-state-desc">Não há marketplaces integrados disponíveis no momento.</div>
      </div>

      <!-- Marketplace items -->
      <template v-else>
        <div
          v-for="mp in marketplaces"
          :key="mp.id"
          class="carrier-item"
          :class="{ active: selectedMarketplace?.id === mp.id }"
          @click="$emit('select', mp)"
        >
          <div class="carrier-icon" :style="{ background: mp.color }">
            <i :class="mp.logo"></i>
          </div>
          <div class="carrier-info">
            <div class="carrier-name">{{ mp.name }}</div>
            <div class="carrier-count">{{ mp.logisticsCount }} logística(s)</div>
          </div>
          <div class="carrier-badge">
            <Badge
              :value="mp.logisticsCount"
              :severity="mp.logisticsCount > 0 ? 'info' : 'secondary'"
            />
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
  marketplaces: { type: Array, default: () => [] },
  selectedMarketplace: { type: Object, default: null },
  loading: { type: Boolean, default: false }
})

defineEmits(['select'])
</script>
