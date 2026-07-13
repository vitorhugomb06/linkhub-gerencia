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
        <i class="pi pi-star" style="margin-right:6px"></i>
        Produtos Mais Vendidos
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

    <!-- KPI Summary Cards -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--blue">
          <i class="pi pi-box"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Produtos Listados</span>
          <span class="kpi-value">{{ filteredData.length }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--green">
          <i class="pi pi-shopping-cart"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Total Unid. Vendidas</span>
          <span class="kpi-value kpi-value--green">{{ totals.qtdVendido }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--purple">
          <i class="pi pi-dollar"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Receita Total</span>
          <span class="kpi-value kpi-value--purple">{{ formatCurrency(totals.totalVendido) }}</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon-wrap kpi-icon--orange">
          <i class="pi pi-tag"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-label">Ticket Médio</span>
          <span class="kpi-value kpi-value--orange">{{ formatCurrency(totals.ticketMedio) }}</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="content-card filters-card">
      <div class="filters-row">
        <div class="filter-field filter-field--search">
          <label class="filter-label">Busca por identificador</label>
          <div class="search-combo-wrap">
            <select v-model="filters.buscaTipo" class="search-tipo-select">
              <option value="grupoSku">Grupo SKU</option>
              <option value="sku">SKU</option>
              <option value="codigoRef">Cód. Ref.</option>
              <option value="ean">EAN</option>
              <option value="titulo">Título</option>
            </select>
            <input v-model="filters.busca" class="search-input-combo" placeholder="Digite o valor..." />
          </div>
        </div>
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
        <div class="filter-field filter-field--btn">
          <Button label="Pesquisar" icon="pi pi-search" size="small" class="btn-pesquisar" @click="currentPage = 1" />
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="content-card table-card">
      <div class="table-header-bar">
        <span class="table-title">Ranking de Produtos</span>
        <span class="table-subtitle">{{ filteredData.length }} produto(s) encontrado(s)</span>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="table-loading">
        <Skeleton v-for="i in 5" :key="i" height="64px" style="border-radius:8px;margin-bottom:8px" />
      </div>

      <!-- Table -->
      <div v-else class="product-table">
        <div class="pt-header">
          <div class="pt-col pt-col--img"></div>
          <div class="pt-col pt-col--sku pt-col--sortable" @click="toggleSort('grupoSku')">Grupo SKU <i :class="getSortIcon('grupoSku')"></i></div>
          <div class="pt-col pt-col--sku pt-col--sortable" @click="toggleSort('sku')">SKU <i :class="getSortIcon('sku')"></i></div>
          <div class="pt-col pt-col--ref pt-col--sortable" @click="toggleSort('codigoRef')">Cód. Ref. <i :class="getSortIcon('codigoRef')"></i></div>
          <div class="pt-col pt-col--ref pt-col--sortable" @click="toggleSort('ean')">EAN <i :class="getSortIcon('ean')"></i></div>
          <div class="pt-col pt-col--title pt-col--sortable" @click="toggleSort('titulo')">Título <i :class="getSortIcon('titulo')"></i></div>
          <div class="pt-col pt-col--cat pt-col--sortable" @click="toggleSort('categoria')">Categoria <i :class="getSortIcon('categoria')"></i></div>
          <div class="pt-col pt-col--brand pt-col--sortable" @click="toggleSort('marca')">Marca <i :class="getSortIcon('marca')"></i></div>
          <div class="pt-col pt-col--brand pt-col--sortable" @click="toggleSort('modelo')">Modelo <i :class="getSortIcon('modelo')"></i></div>
          <div class="pt-col pt-col--number pt-col--sortable" @click="toggleSort('qtdVendido')">Qtd. Vendido <i :class="getSortIcon('qtdVendido')"></i></div>
          <div class="pt-col pt-col--money pt-col--sortable" @click="toggleSort('totalVendido')">Total Vendido <i :class="getSortIcon('totalVendido')"></i></div>
          <div class="pt-col pt-col--money pt-col--sortable" @click="toggleSort('ticketMedio')">Ticket Médio <i :class="getSortIcon('ticketMedio')"></i></div>
          <div class="pt-col pt-col--number pt-col--sortable" @click="toggleSort('estoqueAtual')">Estoque Atual <i :class="getSortIcon('estoqueAtual')"></i></div>
        </div>

        <div class="pt-body">
          <div
            v-for="(item, idx) in paginatedData"
            :key="item.id"
            class="pt-row"
            :class="{ 'pt-row--top': idx < 3 && currentPage === 1 }"
          >
            <div class="pt-col pt-col--img">
              <div class="product-img-wrap">
                <img :src="item.imagem" :alt="item.titulo" class="product-img" />
              </div>
            </div>
            <div class="pt-col pt-col--sku">{{ item.grupoSku }}</div>
            <div class="pt-col pt-col--sku">{{ item.sku }}</div>
            <div class="pt-col pt-col--ref">{{ item.codigoRef }}</div>
            <div class="pt-col pt-col--ref">{{ item.ean }}</div>
            <div class="pt-col pt-col--title">{{ item.titulo }}</div>
            <div class="pt-col pt-col--cat">{{ formatCategoria(item.categoria) }}</div>
            <div class="pt-col pt-col--brand">{{ formatMarca(item.marca) }}</div>
            <div class="pt-col pt-col--brand">{{ item.modelo }}</div>
            <div class="pt-col pt-col--number">{{ item.qtdVendido }}</div>
            <div class="pt-col pt-col--money">{{ formatCurrency(item.totalVendido) }}</div>
            <div class="pt-col pt-col--money">{{ formatCurrency(item.ticketMedio) }}</div>
            <div class="pt-col pt-col--number">{{ item.estoqueAtual }}</div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!loading && paginatedData.length === 0" class="empty-state">
          <div class="empty-state-icon"><i class="pi pi-search"></i></div>
          <span class="empty-state-title">Nenhum produto encontrado</span>
          <span class="empty-state-desc">Tente ajustar os filtros para ver mais resultados.</span>
        </div>

        <!-- Pagination -->
        <div v-if="filteredData.length > 0" class="pagination-bar">
          <div class="pagination-controls">
            <button class="pag-btn" :disabled="currentPage === 1" @click="currentPage = 1">
              <i class="pi pi-angle-double-left"></i>
            </button>
            <button class="pag-btn" :disabled="currentPage === 1" @click="currentPage--">
              <i class="pi pi-angle-left"></i>
            </button>
            <template v-for="page in visiblePages" :key="page">
              <button class="pag-btn" :class="{ 'pag-btn--active': page === currentPage }" @click="currentPage = page">
                {{ page }}
              </button>
            </template>
            <button class="pag-btn" :disabled="currentPage === totalPages" @click="currentPage++">
              <i class="pi pi-angle-right"></i>
            </button>
            <button class="pag-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">
              <i class="pi pi-angle-double-right"></i>
            </button>
          </div>
          <div class="pagination-size">
            <select v-model="pageSize" class="page-size-select" @change="currentPage = 1">
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
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
import DatePicker from 'primevue/datepicker'
import { fetchProdutosMaisVendidos, CATEGORIAS_PRODUTO, MARCAS } from '../mocks/produtosMaisVendidosMock.js'
import { MARKETPLACES_CHANNELS } from '../mocks/vendasPorCanalMock.js'

const toast = useToast()
const loading = ref(false)
const data = ref([])

const marketplaceOptions = MARKETPLACES_CHANNELS
const categorias = CATEGORIAS_PRODUTO

const filters = reactive({
  busca: '',
  buscaTipo: 'grupoSku',
  marketplaces: [],
  categoria: null,
  periodo: null,
})

const sortField = ref(null)
const sortOrder = ref(0) // 0 = default, -1 = desc, 1 = asc

const currentPage = ref(1)
const pageSize = ref(50)
const pageSizeOptions = [10, 25, 50, 100]

function toggleSort(field) {
  if (sortField.value !== field) {
    sortField.value = field
    sortOrder.value = -1 // primeiro clique: maior para menor
  } else if (sortOrder.value === -1) {
    sortOrder.value = 1 // segundo clique: menor para maior
  } else {
    // terceiro clique: volta ao padrão
    sortField.value = null
    sortOrder.value = 0
  }
}

function getSortIcon(field) {
  if (sortField.value !== field) return 'pi pi-sort-alt'
  return sortOrder.value === 1 ? 'pi pi-sort-amount-up-alt' : 'pi pi-sort-amount-down'
}

onMounted(async () => {
  loading.value = true
  try {
    data.value = await fetchProdutosMaisVendidos()
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar o relatório.', life: 4000 })
  } finally {
    loading.value = false
  }
})

const filteredData = computed(() => {
  let result = data.value

  // Search filter
  if (filters.busca) {
    const term = filters.busca.toLowerCase()
    const field = filters.buscaTipo
    result = result.filter(p => {
      const val = p[field]
      return val && String(val).toLowerCase().includes(term)
    })
  }

  // Marketplace filter
  if (filters.marketplaces && filters.marketplaces.length > 0) {
    result = result.filter(p => filters.marketplaces.includes(p.canalId))
  }

  // Category filter
  if (filters.categoria) {
    result = result.filter(p => p.categoria === filters.categoria)
  }

  // Period filter
  if (filters.periodo && filters.periodo.length === 2) {
    const [start, end] = filters.periodo
    if (start && end) {
      const startDate = new Date(start)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(end)
      endDate.setHours(23, 59, 59, 999)
      result = result.filter(p => {
        const d = new Date(p.dataUltimaVenda)
        return d >= startDate && d <= endDate
      })
    }
  }

  // Sort dynamically
  if (!sortField.value) return [...result]

  return [...result].sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]
    if (typeof aVal === 'number') {
      return (aVal - bVal) * sortOrder.value
    }
    return String(aVal).localeCompare(String(bVal)) * sortOrder.value
  })
})

const totals = computed(() => {
  const items = filteredData.value
  const qtdVendido = items.reduce((sum, i) => sum + i.qtdVendido, 0)
  const totalVendido = items.reduce((sum, i) => sum + i.totalVendido, 0)
  const ticketMedio = qtdVendido > 0 ? totalVendido / qtdVendido : 0
  return { qtdVendido, totalVendido, ticketMedio }
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / pageSize.value)))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function globalIndex(localIdx) {
  return (currentPage.value - 1) * pageSize.value + localIdx
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatCategoria(value) {
  const cat = CATEGORIAS_PRODUTO.find(c => c.value === value)
  return cat ? cat.label : value
}

function formatMarca(value) {
  const marca = MARCAS.find(m => m.value === value)
  return marca ? marca.label : value
}

function exportExcel() {
  toast.add({ severity: 'info', summary: 'Exportando', detail: 'Gerando relatório em Excel...', life: 3000 })
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

.kpi-icon-wrap i { font-size: 20px; }
.kpi-icon--blue { background: rgba(59, 130, 246, 0.1); }
.kpi-icon--blue i { color: #3b82f6; }
.kpi-icon--green { background: rgba(16, 185, 129, 0.1); }
.kpi-icon--green i { color: #10b981; }
.kpi-icon--orange { background: rgba(249, 115, 22, 0.1); }
.kpi-icon--orange i { color: #f97316; }
.kpi-icon--purple { background: rgba(139, 92, 246, 0.1); }
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
  grid-template-columns: 1.5fr 1fr 1fr 1fr auto;
  gap: 16px;
  align-items: end;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-field--btn {
  align-self: end;
}

.btn-pesquisar {
  height: 38px !important;
  font-size: 13px !important;
  padding: 0 18px !important;
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: #fff !important;
}

.btn-pesquisar:hover {
  background: #2563eb !important;
  border-color: #2563eb !important;
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

/* Search combo input */
.search-combo-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
}

.search-tipo-select {
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #fff;
  padding: 0 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  outline: none;
  min-width: 120px;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
}

.search-tipo-select:focus {
  border-color: #3b82f6;
}

.search-input-combo {
  flex: 1;
  height: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: var(--text-primary);
  background: #fff;
  padding: 0 14px;
}

.search-input-combo:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.search-input-combo::placeholder {
  color: var(--text-muted);
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

/* ── Product Table ────────────────────────────────────────────────────── */
.product-table {
  width: 100%;
  overflow-x: auto;
}

.pt-header {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 42px;
  background: #f8fafc;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.pt-body {
  max-height: 520px;
  overflow-y: auto;
}

.pt-row {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 56px;
  border-bottom: 1px solid #cbd5e1;
  transition: background 0.12s;
  font-size: 14px;
  color: var(--text-primary);
}

.pt-row:hover {
  background: #eff6ff;
  cursor: pointer;
}

.pt-col {
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.pt-col--img { flex: 0 0 46px; }
.pt-col--rank { flex: 0 0 36px; }
.pt-col--sku { flex: 1; }
.pt-col--ref { flex: 1.5; }
.pt-col--title { flex: 3; white-space: normal; line-height: 1.3; }
.pt-col--cat { flex: 1.2; }
.pt-col--brand { flex: 1; }
.pt-col--number { flex: 1; }
.pt-col--money { flex: 1.3; }

.pt-col--sortable {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.pt-col--sortable:hover {
  color: #3b82f6;
}

.pt-col--sortable i {
  font-size: 11px;
  opacity: 0.5;
}

.pt-col--sortable:hover i {
  opacity: 1;
  color: #3b82f6;
}

/* Rank */
.rank-medal {
  font-size: 16px;
}

.rank-number {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.pt-row--top {
  background: #fafcff;
}

/* ── Pagination ───────────────────────────────────────────────────────── */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pag-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.pag-btn:hover:not(:disabled) {
  background: #f1f5f9;
  color: var(--text-primary);
}

.pag-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pag-btn--active {
  background: #3b82f6;
  color: #fff;
}

.pag-btn--active:hover {
  background: #2563eb;
  color: #fff;
}

.pag-btn i {
  font-size: 12px;
}

.pagination-size {
  display: flex;
  align-items: center;
}

.page-size-select {
  padding: 5px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: var(--text-primary);
  background: #fff;
  cursor: pointer;
  outline: none;
}

.page-size-select:focus {
  border-color: #3b82f6;
}

/* Product image */
.product-img-wrap {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  background: #f8fafc;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Export button */
.btn-voltar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #fff;
  color: var(--text-secondary);
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.btn-voltar:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.btn-voltar i {
  font-size: 12px;
}

.btn-excel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.btn-excel:hover {
  border-color: #22a06b;
  box-shadow: 0 2px 8px rgba(34, 160, 107, 0.12);
}

.btn-export-icon {
  width: 34px;
  height: 34px;
}

.btn-export-excel {
  color: var(--text-secondary) !important;
  border-color: var(--border-color) !important;
}

.btn-export-excel :deep(.p-button-icon) {
  color: #22a06b !important;
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
}
</style>
