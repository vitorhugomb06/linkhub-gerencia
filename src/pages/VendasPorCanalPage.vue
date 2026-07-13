<template>
  <!-- Breadcrumb teleported to the dedicated bar between topbar and content -->
  <Teleport to="#breadcrumb-bar">
    <div class="page-breadcrumb">
      <a href="#"><i class="pi pi-home"></i> Home</a>
      <span>›</span>
      <a href="#" @click.prevent="$router.push('/relatorios')">Relatórios</a>
      <span>›</span>
      <span class="page-breadcrumb__current">Visualização de Relatório</span>
    </div>
  </Teleport>

  <div class="app-content">

    <!-- Page Header -->
    <div class="page-header">
      <span class="page-title">
        <i class="pi pi-chart-bar" style="margin-right:6px"></i>
        Vendas por Canal
      </span>
      <div class="page-actions">
        <Button label="Voltar" icon="pi pi-arrow-left" severity="secondary" text size="small" @click="$router.back()" />
        <Button label="Exportar Excel" icon="pi pi-file-excel" severity="secondary" outlined size="small" class="btn-export-excel" @click="exportExcel" />
      </div>
    </div>

    <!-- KPI Summary Cards -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--blue">
          <i class="pi pi-dollar"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Vendas Totais</span>
          <span class="kpi-value">{{ formatCurrency(totals.vendasTotais) }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--green">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Vendas Aprovadas</span>
          <span class="kpi-value kpi-value--green">{{ formatCurrency(totals.vendasCompletadas) }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--orange">
          <i class="pi pi-exclamation-circle"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Vendas Canceladas/Pendentes</span>
          <span class="kpi-value kpi-value--orange">{{ formatCurrency(totals.vendasNaoCompletadas) }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--purple">
          <i class="pi pi-shopping-cart"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Pedidos Totais</span>
          <span class="kpi-value kpi-value--purple">{{ totals.pedidosTotais }}</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="content-card filters-card">
      <div class="filters-row">
        <div class="filter-field">
          <label class="filter-label">Marketplace(s)</label>
          <MultiSelect
            v-model="filters.marketplaces"
            :options="marketplaceOptions"
            optionLabel="name"
            optionValue="id"
            placeholder="Todos"
            :maxSelectedLabels="2"
            class="filter-input"
            :showClear="true"
          />
        </div>
        <div class="filter-field">
          <label class="filter-label">Categoria</label>
          <Select
            v-model="filters.categoria"
            :options="categorias"
            optionLabel="label"
            optionValue="value"
            placeholder="Todas"
            class="filter-input"
            :showClear="true"
          />
        </div>
        <div class="filter-field">
          <label class="filter-label">Situação</label>
          <Select
            v-model="filters.situacao"
            :options="situacoes"
            optionLabel="label"
            optionValue="value"
            placeholder="Todas"
            class="filter-input"
            :showClear="true"
          />
        </div>
        <div class="filter-field">
          <label class="filter-label">Período</label>
          <DatePicker
            v-model="filters.periodo"
            selectionMode="range"
            dateFormat="dd/mm/yy"
            placeholder="Selecione o período"
            class="filter-input"
            :showIcon="true"
            :showButtonBar="true"
          />
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="content-card table-card">
      <div class="table-header-bar">
        <span class="table-title">Desempenho por Canal</span>
        <span class="table-subtitle">{{ filteredData.length }} canal(is) encontrado(s)</span>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="table-loading">
        <Skeleton v-for="i in 4" :key="i" height="52px" style="border-radius:8px;margin-bottom:8px" />
      </div>

      <!-- Table -->
      <div v-else class="channel-table">
        <div class="ct-header">
          <div class="ct-col ct-col--channel">Canal</div>
          <div class="ct-col ct-col--number">Pedidos</div>
          <div class="ct-col ct-col--money">Vendas Totais</div>
          <div class="ct-col ct-col--number">Ped. Aprovados</div>
          <div class="ct-col ct-col--money">Vendas Aprovadas</div>
          <div class="ct-col ct-col--number">Ped. Canc./Pend.</div>
          <div class="ct-col ct-col--money">Vendas Canceladas/Pendentes</div>
          <div class="ct-col ct-col--number">Ticket Médio</div>
          <div class="ct-col ct-col--progress">% do Total</div>
          <div class="ct-col ct-col--action"></div>
        </div>

        <div class="ct-body">
          <div
            v-for="item in filteredData"
            :key="item.id"
            class="ct-row"
          >
            <div class="ct-col ct-col--channel">
              <div class="channel-badge">
                <img v-if="item.logo" :src="item.logo" :alt="item.canal" class="channel-logo" />
                <i v-else :class="item.icon" :style="{ color: item.color }"></i>
              </div>
              <span class="channel-name">{{ item.canal }}</span>
            </div>
            <div class="ct-col ct-col--number">
              <span class="pedidos-total">{{ item.pedidosTotais }}</span>
            </div>
            <div class="ct-col ct-col--money">
              <span class="money-value">{{ formatCurrency(item.vendasTotais) }}</span>
            </div>
            <div class="ct-col ct-col--number">
              <span class="pedidos-total pedidos-total--green">{{ item.pedidosCompletados }}</span>
            </div>
            <div class="ct-col ct-col--money">
              <span class="money-value money-value--green">{{ formatCurrency(item.vendasCompletadas) }}</span>
            </div>
            <div class="ct-col ct-col--number">
              <span class="pedidos-total pedidos-total--orange">{{ item.pedidosCancelados + item.pedidosPendentes }}</span>
            </div>
            <div class="ct-col ct-col--money">
              <span class="money-value" :class="item.vendasNaoCompletadas > 0 ? 'money-value--orange' : 'money-value--muted'">
                {{ formatCurrency(item.vendasNaoCompletadas) }}
              </span>
            </div>
            <div class="ct-col ct-col--number">
              <span class="money-value">{{ formatCurrency(item.ticketMedio) }}</span>
            </div>
            <div class="ct-col ct-col--progress">
              <div class="progress-bar-wrap">
                <div class="progress-bar" :style="{ width: getPercentage(item) + '%' }"></div>
              </div>
              <span class="progress-text">{{ getPercentage(item) }}%</span>
            </div>
            <div class="ct-col ct-col--action">
              <button class="btn-view-orders" v-tooltip.top="'Ver Pedidos'" @click="goToPedidosCanal(item)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="8" y1="13" x2="12" y2="13"/>
                  <line x1="8" y1="17" x2="11" y2="17"/>
                  <circle cx="15.5" cy="17.5" r="2.5"/>
                  <line x1="17.3" y1="19.3" x2="19" y2="21"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Total row -->
        <div class="ct-footer">
          <div class="ct-col ct-col--channel">
            <span class="total-label">Total Geral</span>
          </div>
          <div class="ct-col ct-col--number">
            <span class="pedidos-total pedidos-total--bold">{{ totals.pedidosTotais }}</span>
          </div>
          <div class="ct-col ct-col--money">
            <span class="money-value money-value--bold">{{ formatCurrency(totals.vendasTotais) }}</span>
          </div>
          <div class="ct-col ct-col--number">
            <span class="pedidos-total pedidos-total--bold pedidos-total--green">{{ totals.pedidosAprovados }}</span>
          </div>
          <div class="ct-col ct-col--money">
            <span class="money-value money-value--bold money-value--green">{{ formatCurrency(totals.vendasCompletadas) }}</span>
          </div>
          <div class="ct-col ct-col--number">
            <span class="pedidos-total pedidos-total--bold pedidos-total--orange">{{ totals.pedidosCanceladosPendentes }}</span>
          </div>
          <div class="ct-col ct-col--money">
            <span class="money-value money-value--bold money-value--orange">{{ formatCurrency(totals.vendasNaoCompletadas) }}</span>
          </div>
          <div class="ct-col ct-col--number">
            <span class="money-value money-value--bold">{{ formatCurrency(totals.ticketMedio) }}</span>
          </div>
          <div class="ct-col ct-col--progress">
            <span class="progress-text progress-text--bold">100%</span>
          </div>
          <div class="ct-col ct-col--action">
            <button class="btn-view-orders" v-tooltip.top="'Ver Pedidos'" @click="goToPedidos">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="12" y2="13"/>
                <line x1="8" y1="17" x2="11" y2="17"/>
                <circle cx="15.5" cy="17.5" r="2.5"/>
                <line x1="17.3" y1="19.3" x2="19" y2="21"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import { fetchPedidos, aggregateByCanal, MARKETPLACES_CHANNELS, CATEGORIAS, SITUACOES } from '../mocks/vendasPorCanalMock.js'

const toast = useToast()
const router = useRouter()
const loading = ref(false)
const pedidos = ref([])

const marketplaceOptions = MARKETPLACES_CHANNELS
const categorias = CATEGORIAS
const situacoes = SITUACOES

const filters = reactive({
  marketplaces: [],
  categoria: null,
  situacao: null,
  periodo: null,
})

onMounted(async () => {
  loading.value = true
  try {
    pedidos.value = await fetchPedidos()
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar o relatório.', life: 4000 })
  } finally {
    loading.value = false
  }
})

// Filter individual orders, then aggregate by channel
const filteredPedidos = computed(() => {
  let result = pedidos.value

  // Filter by marketplace
  if (filters.marketplaces && filters.marketplaces.length > 0) {
    result = result.filter(p => filters.marketplaces.includes(p.canalId))
  }

  // Filter by categoria
  if (filters.categoria) {
    result = result.filter(p => p.categoria === filters.categoria)
  }

  // Filter by situação
  if (filters.situacao) {
    result = result.filter(p => p.situacao === filters.situacao)
  }

  // Filter by período (date range)
  if (filters.periodo && filters.periodo.length === 2) {
    const [start, end] = filters.periodo
    if (start && end) {
      const startDate = new Date(start)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(end)
      endDate.setHours(23, 59, 59, 999)
      result = result.filter(p => {
        const d = new Date(p.data)
        return d >= startDate && d <= endDate
      })
    }
  }

  return result
})

const filteredData = computed(() => {
  const result = aggregateByCanal(filteredPedidos.value)
  return result.sort((a, b) => b.vendasTotais - a.vendasTotais)
})

const totals = computed(() => {
  const items = filteredData.value
  const vendasTotais = items.reduce((sum, i) => sum + i.vendasTotais, 0)
  const vendasCompletadas = items.reduce((sum, i) => sum + i.vendasCompletadas, 0)
  const vendasNaoCompletadas = items.reduce((sum, i) => sum + i.vendasNaoCompletadas, 0)
  const pedidosTotais = items.reduce((sum, i) => sum + i.pedidosTotais, 0)
  const pedidosAprovados = items.reduce((sum, i) => sum + i.pedidosCompletados, 0)
  const pedidosCanceladosPendentes = items.reduce((sum, i) => sum + i.pedidosCancelados + i.pedidosPendentes, 0)
  const ticketMedio = pedidosTotais > 0 ? vendasTotais / pedidosTotais : 0
  return { vendasTotais, vendasCompletadas, vendasNaoCompletadas, pedidosTotais, pedidosAprovados, pedidosCanceladosPendentes, ticketMedio }
})

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function getPercentage(item) {
  const total = totals.value.vendasTotais
  if (total === 0) return 0
  return ((item.vendasTotais / total) * 100).toFixed(1)
}

function exportExcel() {
  toast.add({ severity: 'info', summary: 'Exportando', detail: 'Gerando relatório em Excel...', life: 3000 })
}

function goToPedidos() {
  const query = {}
  if (filters.marketplaces && filters.marketplaces.length > 0) {
    query.marketplaces = filters.marketplaces.join(',')
  }
  if (filters.categoria) {
    query.categoria = filters.categoria
  }
  if (filters.situacao) {
    query.situacao = filters.situacao
  }
  if (filters.periodo && filters.periodo.length === 2 && filters.periodo[0] && filters.periodo[1]) {
    query.de = filters.periodo[0].toISOString().split('T')[0]
    query.ate = filters.periodo[1].toISOString().split('T')[0]
  }
  router.push({ path: '/pedidos', query })
}

function goToPedidosCanal(item) {
  const query = { marketplaces: item.id }
  if (filters.categoria) {
    query.categoria = filters.categoria
  }
  if (filters.situacao) {
    query.situacao = filters.situacao
  }
  if (filters.periodo && filters.periodo.length === 2 && filters.periodo[0] && filters.periodo[1]) {
    query.de = filters.periodo[0].toISOString().split('T')[0]
    query.ate = filters.periodo[1].toISOString().split('T')[0]
  }
  router.push({ path: '/pedidos', query })
}
</script>

<style scoped>
/* ── KPI Cards ────────────────────────────────────────────────────────── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.kpi-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.kpi-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.kpi-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon-wrap i {
  font-size: 20px;
}

.kpi-icon--blue {
  background: rgba(59, 130, 246, 0.1);
}

.kpi-icon--blue i { color: #3b82f6; }

.kpi-icon--green {
  background: rgba(16, 185, 129, 0.1);
}

.kpi-icon--green i { color: #10b981; }

.kpi-icon--orange {
  background: rgba(249, 115, 22, 0.1);
}

.kpi-icon--orange i { color: #f97316; }

.kpi-icon--purple {
  background: rgba(139, 92, 246, 0.1);
}

.kpi-icon--purple i { color: #8b5cf6; }

.kpi-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.kpi-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  line-height: 1.2;
}

.kpi-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.kpi-value--green { color: #10b981; }
.kpi-value--orange { color: #f97316; }
.kpi-value--purple { color: #8b5cf6; }

/* ── Filters ──────────────────────────────────────────────────────────── */
.filters-card {
  padding: 20px 24px;
  margin-bottom: 20px;
}

.filters-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: flex-end;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.filter-input {
  width: 100%;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
}

/* ── Table Card ───────────────────────────────────────────────────────── */
.table-card {
  overflow: hidden;
}

.table-header-bar {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.table-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.table-subtitle {
  font-size: 12px;
  color: var(--text-muted);
}

.table-loading {
  padding: 24px;
}

/* ── Channel Table ────────────────────────────────────────────────────── */
.channel-table {
  width: 100%;
}

.ct-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 44px;
  background: #f8fafc;
  border-bottom: 1px solid var(--border-color);
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ct-body {
  max-height: 500px;
  overflow-y: auto;
}

.ct-row {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  border-bottom: 1px solid #cbd5e1;
  transition: background 0.12s;
}

.ct-row:hover {
  background: #eff6ff;
  cursor: pointer;
}

.ct-footer {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-top: 2px solid var(--border-color);
}

.ct-col {
  padding: 0 8px;
}

.ct-col--channel {
  flex: 1.4;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.ct-col--money {
  flex: 1;
}

.ct-col--number {
  flex: 0.7;
  text-align: center;
}

.ct-col--progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.ct-col--action {
  flex: 0 0 44px;
  display: flex;
  justify-content: center;
}

/* Channel badge */
.channel-badge {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.channel-badge i {
  font-size: 16px;
}

.channel-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.channel-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Money values */
.money-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.money-value--green { color: #10b981; }
.money-value--orange { color: #f97316; }
.money-value--muted { color: var(--text-muted); }
.money-value--bold { font-weight: 700; font-size: 13px; }

/* Pedidos info */
.pedidos-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.pedidos-total {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.pedidos-total--bold {
  font-size: 15px;
}

.pedidos-total--green { color: #10b981; }
.pedidos-total--orange { color: #f97316; }

.pedidos-detail {
  font-size: 10px;
  color: var(--text-muted);
}

.pedidos-ok { color: #10b981; font-weight: 600; }
.pedidos-sep { margin: 0 2px; }
.pedidos-cancel { color: #ef4444; font-weight: 600; }

/* Progress bar */
.progress-bar-wrap {
  flex: 1;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
  background-color: #3b82f6;
}

.progress-text {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}

.progress-text--bold {
  font-weight: 700;
  color: var(--text-primary);
}

/* Total label */
.total-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Export Excel button */
.btn-export-excel {
  color: var(--text-secondary) !important;
  border-color: var(--border-color) !important;
}

.btn-export-excel :deep(.p-button-icon) {
  color: #22a06b !important;
}

/* View orders button */
.btn-view-orders {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.btn-view-orders:hover {
  background-color: #3b82f614;
  color: #2563eb;
}

/* ── Responsive ───────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }

  .filters-row {
    grid-template-columns: 1fr;
  }

  .ct-header,
  .ct-row,
  .ct-footer {
    padding: 0 12px;
  }

  .ct-col--progress {
    display: none;
  }
}
</style>
