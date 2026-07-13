<template>
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
        <i class="pi pi-calendar" style="margin-right:6px"></i>
        Vendas Anuais
      </span>
      <div class="page-actions">
        <button class="btn-voltar" @click="$router.back()">
          <i class="pi pi-arrow-left"></i> Voltar
        </button>
        <button class="btn-excel" v-tooltip.top="'Exportar Excel'" @click="exportExcel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="#22a06b"/>
            <polyline points="14 2 14 8 20 8" fill="#16a34a" stroke="#fff" stroke-width="0.5"/>
            <text x="7" y="17" font-size="7" font-weight="bold" fill="#fff" font-family="Arial">X</text>
            <line x1="13" y1="12" x2="17" y2="12" stroke="#fff" stroke-width="1"/>
            <line x1="13" y1="14.5" x2="17" y2="14.5" stroke="#fff" stroke-width="1"/>
            <line x1="13" y1="17" x2="17" y2="17" stroke="#fff" stroke-width="1"/>
            <line x1="15" y1="10" x2="15" y2="19" stroke="#fff" stroke-width="0.5"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--blue"><i class="pi pi-dollar"></i></div>
        <div class="kpi-content">
          <span class="kpi-label">Valor Total em Vendas</span>
          <span class="kpi-value">{{ formatCurrency(totals.totalVendas) }}</span>
          <span v-if="comparativos.totalVendas !== null" class="kpi-badge" :class="comparativos.totalVendas >= 0 ? 'kpi-badge--up' : 'kpi-badge--down'">
            <i :class="comparativos.totalVendas >= 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-right'"></i>
            {{ comparativos.totalVendas >= 0 ? '+' : '-' }}{{ Math.abs(comparativos.totalVendas).toFixed(1) }}%
          </span>
        </div>
        <svg v-if="data.length > 1" class="kpi-sparkline" viewBox="0 0 56 24" preserveAspectRatio="none">
          <path :d="sparklinePath('totalVendas')" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--green"><i class="pi pi-check-circle"></i></div>
        <div class="kpi-content">
          <span class="kpi-label">Qtd. Pedidos Aprovados</span>
          <span class="kpi-value kpi-value--green">{{ totals.pedidosAprovados }}</span>
          <span v-if="comparativos.pedidosAprovados !== null" class="kpi-badge" :class="comparativos.pedidosAprovados >= 0 ? 'kpi-badge--up' : 'kpi-badge--down'">
            <i :class="comparativos.pedidosAprovados >= 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-right'"></i>
            {{ comparativos.pedidosAprovados >= 0 ? '+' : '-' }}{{ Math.abs(comparativos.pedidosAprovados).toFixed(1) }}%
          </span>
        </div>
        <svg v-if="data.length > 1" class="kpi-sparkline" viewBox="0 0 56 24" preserveAspectRatio="none">
          <path :d="sparklinePath('pedidosAprovados')" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--purple"><i class="pi pi-tag"></i></div>
        <div class="kpi-content">
          <span class="kpi-label">Ticket Médio</span>
          <span class="kpi-value kpi-value--purple">{{ formatCurrency(totals.ticketMedio) }}</span>
          <span v-if="comparativos.ticketMedio !== null" class="kpi-badge" :class="comparativos.ticketMedio >= 0 ? 'kpi-badge--up' : 'kpi-badge--down'">
            <i :class="comparativos.ticketMedio >= 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-right'"></i>
            {{ comparativos.ticketMedio >= 0 ? '+' : '-' }}{{ Math.abs(comparativos.ticketMedio).toFixed(1) }}%
          </span>
        </div>
        <svg v-if="data.length > 1" class="kpi-sparkline" viewBox="0 0 56 24" preserveAspectRatio="none">
          <path :d="sparklinePath('ticketMedio')" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--orange"><i class="pi pi-ban"></i></div>
        <div class="kpi-content">
          <span class="kpi-label">Valor Total Cancelado</span>
          <span class="kpi-value kpi-value--orange">{{ formatCurrency(totals.canceladosValor) }}</span>
          <span v-if="comparativos.canceladosValor !== null" class="kpi-badge" :class="comparativos.canceladosValor <= 0 ? 'kpi-badge--up' : 'kpi-badge--down'">
            <i :class="comparativos.canceladosValor <= 0 ? 'pi pi-arrow-down-right' : 'pi pi-arrow-up-right'"></i>
            {{ comparativos.canceladosValor > 0 ? '+' : '-' }}{{ Math.abs(comparativos.canceladosValor).toFixed(1) }}%
          </span>
        </div>
        <svg v-if="data.length > 1" class="kpi-sparkline" viewBox="0 0 56 24" preserveAspectRatio="none">
          <path :d="sparklinePath('canceladosValor')" fill="none" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--red"><i class="pi pi-times-circle"></i></div>
        <div class="kpi-content">
          <span class="kpi-label">Qtd. Pedidos Cancelados</span>
          <span class="kpi-value kpi-value--red">{{ totals.pedidosCancelados }}</span>
          <span v-if="comparativos.pedidosCancelados !== null" class="kpi-badge" :class="comparativos.pedidosCancelados <= 0 ? 'kpi-badge--up' : 'kpi-badge--down'">
            <i :class="comparativos.pedidosCancelados <= 0 ? 'pi pi-arrow-down-right' : 'pi pi-arrow-up-right'"></i>
            {{ comparativos.pedidosCancelados > 0 ? '+' : '-' }}{{ Math.abs(comparativos.pedidosCancelados).toFixed(1) }}%
          </span>
        </div>
        <svg v-if="data.length > 1" class="kpi-sparkline" viewBox="0 0 56 24" preserveAspectRatio="none">
          <path :d="sparklinePath('pedidosCancelados')" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="kpi-card kpi-card--highlight">
        <div class="kpi-icon-wrap kpi-icon--teal kpi-icon--highlight"><i class="pi pi-trophy"></i></div>
        <div class="kpi-content">
          <span class="kpi-label">Melhor Mês do Ano</span>
          <span class="kpi-value kpi-value--teal">{{ melhorMes.nome }}</span>
          <span class="kpi-detail kpi-detail--highlight">{{ formatCurrency(melhorMes.valor) }}</span>
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
            @change="loadData"
          />
        </div>
        <div class="filter-field">
          <label class="filter-label">Ano</label>
          <Select
            v-model="filters.ano"
            :options="anosDisponiveis"
            optionLabel="label"
            optionValue="value"
            class="filter-input"
            @change="loadData"
          />
        </div>
        <div class="filter-field filter-field--btn">
          <Button label="Pesquisar" icon="pi pi-search" size="small" class="btn-pesquisar" @click="loadData" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="content-card table-card">
      <div class="table-header-bar">
        <span class="table-title">Desempenho Mensal — {{ filters.ano }}</span>
        <span class="table-subtitle">12 meses</span>
      </div>

      <div v-if="loading" class="table-loading">
        <Skeleton v-for="i in 12" :key="i" height="56px" style="border-radius:8px;margin-bottom:8px" />
      </div>

      <div v-else class="annual-table">
        <!-- Header -->
        <div class="at-header">
          <div class="at-col at-col--mes at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'mes' }" @click="toggleSort('mes')">Mês <i :class="getSortIcon('mes')"></i></div>
          <div class="at-col at-col--money at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'totalVendas' }" @click="toggleSort('totalVendas')">Valor Total em Vendas <i :class="getSortIcon('totalVendas')"></i></div>
          <div class="at-col at-col--money at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'canceladosValor' }" @click="toggleSort('canceladosValor')">Valor em Pedidos Cancelados <i :class="getSortIcon('canceladosValor')"></i></div>
          <div class="at-col at-col--money at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'totalAnterior' }" @click="toggleSort('totalAnterior')">Valor Total Ano Anterior <i :class="getSortIcon('totalAnterior')"></i></div>
          <div class="at-col at-col--number at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'pedidosAprovados' }" @click="toggleSort('pedidosAprovados')">Qtd. de Pedidos Aprovados <i :class="getSortIcon('pedidosAprovados')"></i></div>
          <div class="at-col at-col--number at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'pedidosCancelados' }" @click="toggleSort('pedidosCancelados')">Qtd. de Pedidos Cancelados <i :class="getSortIcon('pedidosCancelados')"></i></div>
          <div class="at-col at-col--money at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'ticketMedio' }" @click="toggleSort('ticketMedio')">Ticket Médio <i :class="getSortIcon('ticketMedio')"></i></div>
          <div class="at-col at-col--money at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'meta' }" @click="toggleSort('meta')">Meta <i :class="getSortIcon('meta')"></i></div>
          <div class="at-col at-col--pct at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'vsMeta' }" @click="toggleSort('vsMeta')">% Conclusão da Meta <i :class="getSortIcon('vsMeta')"></i></div>
          <div class="at-col at-col--money at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'descontos' }" @click="toggleSort('descontos')">Descontos <i :class="getSortIcon('descontos')"></i></div>
          <div class="at-col at-col--money at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'frete' }" @click="toggleSort('frete')">Frete <i :class="getSortIcon('frete')"></i></div>
          <div class="at-col at-col--money at-col--sortable" :class="{ 'at-col--sort-active': sortField === 'mediaFatDia' }" @click="toggleSort('mediaFatDia')">Média Fat. Dia <i :class="getSortIcon('mediaFatDia')"></i></div>
        </div>

        <!-- Body -->
        <div class="at-body">
          <div v-for="row in sortedData" :key="row.mes" class="at-row" :class="{ 'at-row--future': isFutureMonth(row.mesIdx), 'at-row--current': isCurrentMonth(row.mesIdx) }">
            <div class="at-col at-col--mes">
              {{ row.mes }}
              <span v-if="isCurrentMonth(row.mesIdx)" class="at-badge-atual">Atual</span>
            </div>
            <div class="at-col at-col--money" :class="{ 'at-col--empty': row.totalVendas === 0 }">{{ displayCurrency(row.totalVendas) }}</div>
            <div class="at-col at-col--money at-col--red" :class="{ 'at-col--empty': row.canceladosValor === 0 }">{{ displayCurrency(row.canceladosValor) }}</div>
            <div class="at-col at-col--money at-col--muted" :class="{ 'at-col--empty': row.totalAnterior === 0 }">{{ displayCurrency(row.totalAnterior) }}</div>
            <div class="at-col at-col--number" :class="{ 'at-col--empty': row.pedidosAprovados === 0 }">{{ displayNumber(row.pedidosAprovados) }}</div>
            <div class="at-col at-col--number at-col--red" :class="{ 'at-col--empty': row.pedidosCancelados === 0 }">{{ displayNumber(row.pedidosCancelados) }}</div>
            <div class="at-col at-col--money at-col--blue" :class="{ 'at-col--empty': row.ticketMedio === 0 }">{{ displayCurrency(row.ticketMedio) }}</div>
            <div class="at-col at-col--money at-col--meta-input">
              <input
                type="text"
                class="meta-field"
                :value="formatCurrency(row.meta)"
                @focus="onMetaFocus($event, row)"
                @blur="onMetaBlur($event, row)"
                @keydown.enter="$event.target.blur()"
              />
            </div>
            <div class="at-col at-col--pct" :class="{ 'at-col--empty': row.vsMeta === 0 }">
              <div class="meta-progress-wrap">
                <div class="meta-progress-bar" :style="{ width: Math.min(row.vsMeta, 100) + '%' }" :class="getMetaClass(row.vsMeta)"></div>
              </div>
              <span class="meta-progress-text" :class="getMetaClass(row.vsMeta)">{{ displayPct(row.vsMeta) }}</span>
            </div>
            <div class="at-col at-col--money" :class="{ 'at-col--empty': row.descontos === 0 }">{{ displayCurrency(row.descontos) }}</div>
            <div class="at-col at-col--money" :class="{ 'at-col--empty': row.frete === 0 }">{{ displayCurrency(row.frete) }}</div>
            <div class="at-col at-col--money" :class="{ 'at-col--empty': row.mediaFatDia === 0 }">{{ displayCurrency(row.mediaFatDia) }}</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="at-footer">
          <div class="at-col at-col--mes at-col--bold">Total</div>
          <div class="at-col at-col--money at-col--bold">{{ formatCurrency(totals.totalVendas) }}</div>
          <div class="at-col at-col--money at-col--bold at-col--red">{{ formatCurrency(totals.canceladosValor) }}</div>
          <div class="at-col at-col--money at-col--bold at-col--muted">{{ formatCurrency(totals.totalAnterior) }}</div>
          <div class="at-col at-col--number at-col--bold">{{ totals.pedidosAprovados }}</div>
          <div class="at-col at-col--number at-col--bold at-col--red">{{ totals.pedidosCancelados }}</div>
          <div class="at-col at-col--money at-col--bold at-col--blue">{{ formatCurrency(totals.ticketMedio) }}</div>
          <div class="at-col at-col--money at-col--bold">{{ formatCurrency(totals.metaTotal) }}</div>
          <div class="at-col at-col--pct at-col--bold">
              <div class="meta-progress-wrap">
                <div class="meta-progress-bar" :style="{ width: Math.min(totals.vsMeta, 100) + '%' }" :class="getMetaClass(totals.vsMeta)"></div>
              </div>
              <span class="meta-progress-text" :class="getMetaClass(totals.vsMeta)">{{ totals.vsMeta.toFixed(2) }}%</span>
          </div>
          <div class="at-col at-col--money at-col--bold">{{ formatCurrency(totals.descontos) }}</div>
          <div class="at-col at-col--money at-col--bold">{{ formatCurrency(totals.frete) }}</div>
          <div class="at-col at-col--money at-col--bold">{{ formatCurrency(totals.mediaFatDia) }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import { fetchVendasAnuais, buildVendasAnuais, ANOS_DISPONIVEIS, MESES } from '../mocks/vendasAnuaisMock.js'
import { MARKETPLACES_CHANNELS } from '../mocks/vendasPorCanalMock.js'

const toast = useToast()
const loading = ref(false)
const data = ref([])
const prevData = ref([])
const marketplaceOptions = MARKETPLACES_CHANNELS
const anosDisponiveis = ANOS_DISPONIVEIS

const filters = reactive({ marketplaces: [], ano: 2026 })
const sortField = ref(null)
const sortOrder = ref(0)

function toggleSort(field) {
  if (sortField.value !== field) { sortField.value = field; sortOrder.value = -1 }
  else if (sortOrder.value === -1) { sortOrder.value = 1 }
  else { sortField.value = null; sortOrder.value = 0 }
}

function getSortIcon(field) {
  if (sortField.value !== field) return 'pi pi-sort-alt'
  return sortOrder.value === 1 ? 'pi pi-caret-up' : 'pi pi-caret-down'
}

async function loadData() {
  loading.value = true
  try {
    data.value = await fetchVendasAnuais(filters.ano, filters.marketplaces)
    prevData.value = buildVendasAnuais(filters.ano - 1, filters.marketplaces)
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar o relatório.', life: 4000 })
  } finally { loading.value = false }
}

onMounted(loadData)

const sortedData = computed(() => {
  if (!sortField.value) return data.value
  return [...data.value].sort((a, b) => {
    const aVal = a[sortField.value], bVal = b[sortField.value]
    if (typeof aVal === 'number') return (aVal - bVal) * sortOrder.value
    return String(aVal).localeCompare(String(bVal)) * sortOrder.value
  })
})

const totals = computed(() => {
  const rows = data.value
  const totalVendas = rows.reduce((s, r) => s + r.totalVendas, 0)
  const canceladosValor = rows.reduce((s, r) => s + r.canceladosValor, 0)
  const totalAnterior = rows.reduce((s, r) => s + r.totalAnterior, 0)
  const pedidosAprovados = rows.reduce((s, r) => s + r.pedidosAprovados, 0)
  const pedidosCancelados = rows.reduce((s, r) => s + r.pedidosCancelados, 0)
  const metaTotal = rows.reduce((s, r) => s + r.meta, 0)
  const descontos = rows.reduce((s, r) => s + r.descontos, 0)
  const frete = rows.reduce((s, r) => s + r.frete, 0)
  const totalPedidos = pedidosAprovados + pedidosCancelados
  const ticketMedio = totalPedidos > 0 ? totalVendas / totalPedidos : 0
  const vsMeta = metaTotal > 0 ? (totalVendas / metaTotal) * 100 : 0
  const mediaFatDia = totalVendas > 0 ? totalVendas / 365 : 0
  return { totalVendas, canceladosValor, totalAnterior, pedidosAprovados, pedidosCancelados, metaTotal, ticketMedio, vsMeta, descontos, frete, mediaFatDia }
})

const comparativos = computed(() => {
  const prev = prevData.value
  if (!prev || prev.length === 0) return { totalVendas: null, pedidosAprovados: null, ticketMedio: null, canceladosValor: null, pedidosCancelados: null }
  const prevTotalVendas = prev.reduce((s, r) => s + r.totalVendas, 0)
  const prevCancelados = prev.reduce((s, r) => s + r.canceladosValor, 0)
  const prevAprovados = prev.reduce((s, r) => s + r.pedidosAprovados, 0)
  const prevCanceladosQtd = prev.reduce((s, r) => s + r.pedidosCancelados, 0)
  const prevTotalPedidos = prevAprovados + prevCanceladosQtd
  const prevTicket = prevTotalPedidos > 0 ? prevTotalVendas / prevTotalPedidos : 0
  function pct(current, previous) {
    if (previous === 0) return current > 0 ? 100 : null
    return ((current - previous) / previous) * 100
  }
  return {
    totalVendas: pct(totals.value.totalVendas, prevTotalVendas),
    pedidosAprovados: pct(totals.value.pedidosAprovados, prevAprovados),
    ticketMedio: pct(totals.value.ticketMedio, prevTicket),
    canceladosValor: pct(totals.value.canceladosValor, prevCancelados),
    pedidosCancelados: pct(totals.value.pedidosCancelados, prevCanceladosQtd),
  }
})

const melhorMes = computed(() => {
  const rows = data.value.filter(r => r.totalVendas > 0)
  if (rows.length === 0) return { nome: '—', valor: 0 }
  const best = rows.reduce((a, b) => a.totalVendas >= b.totalVendas ? a : b)
  return { nome: best.mes, valor: best.totalVendas }
})

function sparklinePath(field) {
  const rows = data.value
  if (!rows || rows.length < 2) return ''
  const values = rows.map(r => r[field] || 0)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const w = 56
  const h = 24
  const step = w / (values.length - 1)
  return values.map((v, i) => {
    const x = (i * step).toFixed(1)
    const y = (h - ((v - min) / range) * (h - 4) - 2).toFixed(1)
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  }).join(' ')
}

const now = new Date()
function isFutureMonth(mesIdx) {
  if (filters.ano < now.getFullYear() || filters.ano > now.getFullYear()) return false
  return mesIdx > now.getMonth()
}

function isCurrentMonth(mesIdx) {
  return filters.ano === now.getFullYear() && mesIdx === now.getMonth()
}

function getMetaClass(pct) {
  if (pct >= 100) return 'at-col--meta-ok'
  if (pct >= 70) return 'at-col--meta-warn'
  return 'at-col--meta-low'
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function displayCurrency(value) {
  return value === 0 ? '—' : formatCurrency(value)
}

function displayNumber(value) {
  return value === 0 ? '—' : value
}

function displayPct(value) {
  return value === 0 ? '—' : `${value.toFixed(2)}%`
}

function exportExcel() {
  toast.add({ severity: 'info', summary: 'Exportando', detail: 'Gerando relatório em Excel...', life: 3000 })
}

function updateMeta(row, event) {
  const value = parseFloat(event.target.value) || 0
  row.meta = value
  row.vsMeta = value > 0 ? (row.totalVendas / value) * 100 : 0
}

function onMetaFocus(event, row) {
  event.target.value = row.meta > 0 ? row.meta : ''
  event.target.select()
}

function onMetaBlur(event, row) {
  const raw = event.target.value.replace(/[^\d.,]/g, '').replace(',', '.')
  const value = parseFloat(raw) || 0
  row.meta = value
  row.vsMeta = value > 0 ? (row.totalVendas / value) * 100 : 0
  event.target.value = formatCurrency(value)
}
</script>

<style scoped>
/* ── KPI Cards ───────────────────────────────────────────────────────── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.kpi-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 22px 24px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
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

.kpi-icon-wrap i { font-size: 20px; }
.kpi-icon--blue   { background: rgba(59, 130, 246, 0.1); } .kpi-icon--blue i   { color: #3b82f6; }
.kpi-icon--green  { background: rgba(16, 185, 129, 0.1); } .kpi-icon--green i  { color: #10b981; }
.kpi-icon--red    { background: rgba(239, 68, 68, 0.1); } .kpi-icon--red i    { color: #ef4444; }
.kpi-icon--purple { background: rgba(139, 92, 246, 0.1); } .kpi-icon--purple i { color: #8b5cf6; }
.kpi-icon--orange { background: rgba(249, 115, 22, 0.1); } .kpi-icon--orange i { color: #f97316; }
.kpi-icon--teal   { background: rgba(13, 148, 136, 0.1); } .kpi-icon--teal i   { color: #0d9488; }

.kpi-content { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }

.kpi-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  line-height: 1.2;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

.kpi-value--green  { color: #10b981; }
.kpi-value--red    { color: #ef4444; }
.kpi-value--purple { color: #8b5cf6; }
.kpi-value--orange { color: #f97316; }
.kpi-value--teal   { color: #0d9488; }

.kpi-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  margin-top: 6px;
  padding: 3px 10px;
  border-radius: 20px;
  width: fit-content;
}

.kpi-badge i { font-size: 10px; }
.kpi-badge--up   { background: rgba(16, 185, 129, 0.08); color: #047857; }
.kpi-badge--down { background: rgba(239, 68, 68, 0.08); color: #b91c1c; }

.kpi-sparkline {
  width: 56px;
  height: 24px;
  flex-shrink: 0;
  opacity: 0.6;
  align-self: center;
  margin-left: auto;
}

.kpi-detail {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-muted);
  margin-top: 2px;
}

/* ── Melhor Mês (highlight card) ─────────────────────────────────────── */
.kpi-card--highlight {
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(13, 148, 136, 0.04) 100%);
  border-color: rgba(13, 148, 136, 0.18);
}

.kpi-card--highlight:hover {
  border-color: rgba(13, 148, 136, 0.3);
}

.kpi-icon--highlight {
  width: 52px;
  height: 52px;
}

.kpi-icon--highlight i {
  font-size: 22px;
}

.kpi-detail--highlight {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

/* ── Filters ─────────────────────────────────────────────────────────── */
.filters-card {
  padding: 16px 24px;
  margin-bottom: 12px;
}

.filters-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-field:first-child {
  flex: 1;
  min-width: 0;
}

.filter-field:nth-child(2) {
  width: 160px;
  flex-shrink: 0;
}

.filter-field--btn {
  align-self: flex-end;
  flex-shrink: 0;
}

.filter-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.filter-input { width: 100%; font-family: 'Poppins', sans-serif; font-size: 13px; }

.btn-pesquisar {
  height: 38px !important;
  font-size: 13px !important;
  padding: 0 22px !important;
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: #fff !important;
  border-radius: 8px !important;
  white-space: nowrap;
}

.btn-pesquisar:hover {
  background: #2563eb !important;
  border-color: #2563eb !important;
}

/* ── Table ───────────────────────────────────────────────────────────── */
.table-card { overflow: hidden; }

.table-header-bar {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.table-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.table-subtitle { font-size: 12px; color: var(--text-muted); }
.table-loading { padding: 24px; }

.annual-table { width: 100%; overflow-x: auto; }

.at-header {
  display: flex;
  align-items: center;
  padding: 0 0 0 0;
  min-width: 1200px;
  height: 52px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 2px solid var(--border-color);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.85;
}

.at-body { overflow-y: auto; }

.at-row {
  display: flex;
  align-items: center;
  padding: 0;
  min-width: 1200px;
  height: 62px;
  border-bottom: 1px solid #e9edf3;
  transition: background 0.15s ease;
  font-size: 13px;
}

.at-row:nth-child(even) { background: rgba(241, 245, 249, 0.5); }
.at-row:nth-child(even) .at-col--mes { background: #f9fafb; }
.at-row:hover { background: rgba(219, 234, 254, 0.4); }
.at-row:hover .at-col--mes { background: #e8f1fd; }
.at-row--future { opacity: 0.45; }
.at-row--future:hover { background: rgba(248, 250, 252, 0.6); }

.at-row--current {
  background: rgba(59, 130, 246, 0.04);
  border-left: 3px solid #3b82f6;
}

.at-row--current .at-col--mes { background: #f0f6ff; padding-left: 21px; }

.at-row--current:hover {
  background: rgba(59, 130, 246, 0.08);
}

.at-row--current:hover .at-col--mes { background: #e5effc; }

.at-badge-atual {
  display: inline-flex;
  align-items: center;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  margin-left: 8px;
}

.at-footer {
  display: flex;
  align-items: center;
  padding: 0;
  min-width: 1200px;
  height: 62px;
  background: linear-gradient(135deg, #f1f5f9, #e9edf3);
  border-top: 2px solid var(--border-color);
  font-size: 13px;
}

.at-col {
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-variant-numeric: tabular-nums;
}

.at-col--mes    {
  flex: 0 0 140px;
  font-weight: 600;
  justify-content: flex-start;
  text-align: left;
  position: sticky;
  left: 0;
  z-index: 2;
  background: #ffffff;
  padding-left: 24px;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.03);
}
.at-header .at-col--mes {
  background: #f4f7fa;
  padding-left: 24px;
}

.at-footer .at-col--mes {
  background: #edf1f5;
  padding-left: 24px;
}

.at-col--money  { flex: 1; justify-content: flex-end; text-align: right; }
.at-col--number { flex: 0.7; justify-content: center; text-align: center; }
.at-col--pct    { flex: 1.2; display: flex; align-items: center; gap: 10px; font-weight: 600; }
.at-col--bold   { font-weight: 700; }
.at-col--red    { color: #ef4444; }
.at-col--blue   { color: #3b82f6; }
.at-col--muted  { color: var(--text-muted); }
.at-col--empty  { color: var(--text-muted); }

.at-col--meta-ok   { color: #10b981; }
.at-col--meta-warn { color: #f59e0b; }
.at-col--meta-low  { color: #ef4444; }

/* Meta editable input */
.at-col--meta-input {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
}

.meta-field {
  width: 110px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  text-align: left;
  padding: 0 12px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.meta-field:hover {
  border-color: #94a3b8;
}

.meta-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Meta progress bar */
.meta-progress-wrap {
  flex: 1;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
  min-width: 0;
}

.meta-progress-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
  background: #3b82f6;
}

.meta-progress-bar.at-col--meta-ok   { background: #10b981; }
.meta-progress-bar.at-col--meta-warn { background: #f59e0b; }
.meta-progress-bar.at-col--meta-low  { background: #3b82f6; }

.meta-progress-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 48px;
  text-align: right;
  flex-shrink: 0;
}

.at-col--sortable {
  cursor: pointer;
  user-select: none;
  transition: color 0.15s ease;
}

.at-col--sortable:hover { color: #3b82f6; }
.at-col--sortable i { font-size: 10px; opacity: 0.35; transition: opacity 0.15s ease, color 0.15s ease, transform 0.15s ease; }
.at-col--sortable:hover i { opacity: 0.7; color: #3b82f6; }

.at-col--sort-active { color: #1e293b; }
.at-col--sort-active i { font-size: 13px; opacity: 1; color: #3b82f6; }
.at-col--sort-active:hover i { opacity: 1; }

/* Page header buttons */
.btn-voltar {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px;
  border: 1px solid var(--border-color); border-radius: 8px;
  background: #fff; color: var(--text-secondary);
  font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: border-color 0.15s, background 0.15s;
}

.btn-voltar:hover { border-color: #3b82f6; background: #f8fafc; }
.btn-voltar i { font-size: 12px; }

.btn-excel {
  display: flex; align-items: center; justify-content: center;
  width: 38px; height: 38px;
  border: 1px solid var(--border-color); border-radius: 8px;
  background: #fff; cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.btn-excel:hover { border-color: #22a06b; box-shadow: 0 2px 8px rgba(34, 160, 107, 0.12); }

/* ── Responsive ──────────────────────────────────────────────────────── */
@media (max-width: 1300px) {
  .kpi-row { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 900px) {
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .filters-row { flex-wrap: wrap; }
  .filter-field:first-child { flex: 1 1 100%; }
  .filter-field:nth-child(2) { flex: 1; width: auto; }
}

@media (max-width: 600px) {
  .kpi-row { grid-template-columns: 1fr; }
  .filters-row { flex-direction: column; align-items: stretch; }
  .filter-field:nth-child(2) { width: 100%; }
  .filter-field--btn { align-self: stretch; }
  .btn-pesquisar { width: 100% !important; }
}
</style>
