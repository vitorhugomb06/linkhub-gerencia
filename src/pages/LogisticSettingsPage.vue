<template>
  <!-- Breadcrumb -->
  <div class="app-breadcrumb">
    <div class="breadcrumb-item">
      <a href="#"><i class="pi pi-home"></i> Home</a>
    </div>
    <span class="breadcrumb-separator">
      <i class="pi pi-chevron-right" style="font-size:10px"></i>
    </span>
    <span class="breadcrumb-current">Configurações Logísticas</span>
  </div>

  <!-- Page content -->
  <div class="app-content">
    <!-- Page header -->
    <div class="page-header">
      <span class="page-title">
        <i class="pi pi-truck" style="margin-right:6px"></i>
        Configurações Logísticas
      </span>
      <div class="page-actions">
        <Button
          label="Atualizar"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          size="small"
          :loading="loadingMarketplaces"
          @click="refresh"
        />
      </div>
    </div>

    <!-- Split layout -->
    <div class="content-card" style="overflow:visible">
      <div class="split-layout" style="padding:16px">
        <MarketplaceList
          :marketplaces="marketplaces"
          :selectedMarketplace="selectedMarketplace"
          :loading="loadingMarketplaces"
          @select="onSelectMarketplace"
        />
        <LogisticPanel
          :marketplace="selectedMarketplace"
          :logistics="logistics"
          :loading="loadingLogistics"
          :savingId="savingId"
          @toggle="onToggleLogistic"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'

import MarketplaceList from '../components/logistics/MarketplaceList.vue'
import LogisticPanel from '../components/logistics/LogisticPanel.vue'

import {
  fetchMarketplaces,
  fetchLogisticsForMarketplace,
  saveLogisticEnabled
} from '../mocks/logisticsMock.js'

const toast = useToast()

// ── State ──────────────────────────────────────────────────────────────────────
const marketplaces = ref([])
const selectedMarketplace = ref(null)
const logistics = ref([])
const loadingMarketplaces = ref(false)
const loadingLogistics = ref(false)
const savingId = ref(null)

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(loadMarketplaces)

// ── Actions ────────────────────────────────────────────────────────────────────
async function loadMarketplaces() {
  loadingMarketplaces.value = true
  marketplaces.value = []
  selectedMarketplace.value = null
  logistics.value = []

  try {
    marketplaces.value = await fetchMarketplaces()
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro ao carregar',
      detail: 'Não foi possível carregar os marketplaces. Tente novamente.',
      life: 5000
    })
  } finally {
    loadingMarketplaces.value = false
  }
}

async function onSelectMarketplace(marketplace) {
  selectedMarketplace.value = marketplace
  loadingLogistics.value = true
  logistics.value = []

  try {
    logistics.value = await fetchLogisticsForMarketplace(marketplace.id)
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erro ao carregar',
      detail: `Não foi possível carregar as logísticas de ${marketplace.name}. Tente novamente.`,
      life: 5000
    })
  } finally {
    loadingLogistics.value = false
  }
}

async function onToggleLogistic({ logisticId, enabled }) {
  const logistic = logistics.value.find(l => l.id === logisticId)
  if (!logistic || logistic.status === 'Inativo') return

  const previousValue = logistic.enabled
  // Optimistic update — already applied by v-model in child, keep in sync
  logistic.enabled = enabled
  savingId.value = logisticId

  try {
    await saveLogisticEnabled(selectedMarketplace.value.id, logisticId, enabled)
    toast.add({
      severity: 'success',
      summary: 'Configuração salva',
      detail: 'Configuração salva com sucesso.',
      life: 3000
    })
  } catch (err) {
    // Rollback
    logistic.enabled = previousValue
    toast.add({
      severity: 'error',
      summary: 'Erro ao salvar',
      detail: err?.message || 'Não foi possível salvar a configuração. Tente novamente.',
      life: 5000
    })
  } finally {
    savingId.value = null
  }
}

function refresh() {
  loadMarketplaces()
}
</script>
