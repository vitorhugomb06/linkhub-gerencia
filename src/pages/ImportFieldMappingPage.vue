<template>
  <!-- Breadcrumb -->
  <div class="app-breadcrumb">
    <div class="breadcrumb-item">
      <a href="#"><i class="pi pi-home"></i> Home</a>
    </div>
    <span class="breadcrumb-separator"><i class="pi pi-chevron-right" style="font-size:10px"></i></span>
    <div class="breadcrumb-item"><a href="/produtos">Produtos</a></div>
    <span class="breadcrumb-separator"><i class="pi pi-chevron-right" style="font-size:10px"></i></span>
    <div class="breadcrumb-item"><a href="#">Importações</a></div>
    <span class="breadcrumb-separator"><i class="pi pi-chevron-right" style="font-size:10px"></i></span>
    <span class="breadcrumb-current">De-Para de Campos</span>
  </div>

  <!-- Page content -->
  <div class="app-content">
    <!-- Page header -->
    <div class="page-header">
      <span class="page-title">
        <i class="pi pi-file-import" style="margin-right:6px"></i>
        De-Para de Campos — Importação Massiva de Produtos
      </span>
      <div class="page-actions">
        <Button
          label="Atualizar"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          size="small"
          :loading="loading"
          @click="loadFields"
        />
      </div>
    </div>

    <!-- KPI Summary Cards -->
    <div class="kpi-row">
      <div class="kpi-card" v-tooltip.bottom="'Quantidade total de campos internos disponíveis para mapeamento'">
        <div class="kpi-icon-wrap kpi-icon--blue">
          <i class="pi pi-th-large"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-value">{{ kpis.totalFields }}</span>
          <span class="kpi-label">Total de Campos</span>
        </div>
      </div>
      <div class="kpi-card" v-tooltip.bottom="'Quantidade total de aliases (nomes equivalentes) cadastrados em todos os campos'">
        <div class="kpi-icon-wrap kpi-icon--green">
          <i class="pi pi-tags"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-value kpi-value--green">{{ kpis.totalAliases }}</span>
          <span class="kpi-label">Total de Aliases</span>
        </div>
      </div>
      <div class="kpi-card" v-tooltip.bottom="'Número de categorias/grupos de campos existentes'">
        <div class="kpi-icon-wrap kpi-icon--purple">
          <i class="pi pi-folder"></i>
        </div>
        <div class="kpi-content">
          <span class="kpi-value kpi-value--purple">{{ kpis.totalGroups }}</span>
          <span class="kpi-label">Grupos Existentes</span>
        </div>
      </div>
    </div>

    <!-- Description card -->
    <div v-if="!alertDismissed" class="ifm-description-card">
      <i class="pi pi-info-circle" style="font-size:13px;color:#15803d"></i>
      <span class="ifm-description-text">
        Mapeie os aliases para reconhecimento automático de colunas durante a importação massiva de produtos via Excel/CSV.
      </span>
      <a href="#" class="ifm-description-link" @click.prevent>Saiba mais</a>
      <button class="ifm-description-close" @click="alertDismissed = true">
        <i class="pi pi-times"></i>
      </button>
    </div>

    <!-- Filters -->
    <div class="content-card ifm-filters-card">
      <div class="ifm-filters-row">
        <div class="ifm-filter-field ifm-filter-field--search">
          <label class="ifm-filter-label">Busca</label>
          <div class="ifm-search-input-wrap">
            <i class="pi pi-search" style="font-size:12px;color:var(--text-muted)"></i>
            <input
              v-model="searchTerm"
              class="ifm-search-input"
              placeholder="Campo, chave, alias ou grupo..."
              @input="onSearchChange"
            />
            <button v-if="searchTerm" class="ifm-search-input__clear" @click="clearSearch">
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
        <div class="ifm-filter-field">
          <label class="ifm-filter-label">Grupo</label>
          <Select
            v-model="selectedGroup"
            :options="groupOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Todos"
            class="ifm-filter-input"
            :showClear="true"
            @change="onFilterChange"
          />
        </div>
        <div class="ifm-filter-field">
          <label class="ifm-filter-label">Tipo</label>
          <Select
            v-model="selectedType"
            :options="typeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Todos"
            class="ifm-filter-input"
            :showClear="true"
            @change="onFilterChange"
          />
        </div>
        <div class="ifm-filter-field">
          <label class="ifm-filter-label">Obrigatoriedade</label>
          <Select
            v-model="selectedRequired"
            :options="requiredOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Todos"
            class="ifm-filter-input"
            :showClear="true"
            @change="onFilterChange"
          />
        </div>
        <div class="ifm-filter-field ifm-filter-field--btn">
          <Button label="Pesquisar" icon="pi pi-search" size="small" class="ifm-btn-pesquisar" @click="onFilterChange" />
        </div>
      </div>
    </div>

    <!-- Records indicator -->
    <div v-if="!loading && fields.length > 0" class="ifm-records-bar">
      <span class="ifm-records-count">{{ totalRecords }} campos encontrados</span>
    </div>

    <!-- Table -->
    <div class="content-card" style="overflow:visible">
      <!-- Loading state -->
      <div v-if="loading" style="padding:20px">
        <div v-for="i in 8" :key="i" style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid #f1f5f9">
          <Skeleton width="160px" height="16px" />
          <Skeleton width="80px" height="16px" />
          <Skeleton width="100px" height="16px" />
          <Skeleton width="50px" height="28px" borderRadius="14px" />
          <div style="flex:1"></div>
          <Skeleton width="80px" height="32px" borderRadius="6px" />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="fields.length === 0" class="empty-state" style="padding:64px 24px">
        <div class="empty-state-icon">
          <i :class="searchTerm ? 'pi pi-search' : 'pi pi-inbox'"></i>
        </div>
        <div class="empty-state-title">
          {{ searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum campo cadastrado' }}
        </div>
        <div class="empty-state-desc">
          <template v-if="searchTerm">
            Não encontramos campos, chaves, aliases ou grupos correspondentes a
            "<strong>{{ searchTerm }}</strong>". Tente um termo diferente.
          </template>
          <template v-else-if="selectedGroup">
            O grupo selecionado não possui campos cadastrados.
          </template>
          <template v-else>
            Não há campos de importação cadastrados no sistema.
          </template>
        </div>
        <Button
          v-if="searchTerm || selectedGroup || selectedType || selectedRequired"
          label="Limpar filtros"
          icon="pi pi-filter-slash"
          severity="secondary"
          outlined
          size="small"
          style="margin-top:12px"
          @click="clearAllFilters"
        />
      </div>

      <!-- Data table -->
      <DataTable
        v-else
        :value="fields"
        dataKey="id"
        :rows="perPage"
        :totalRecords="totalRecords"
        :loading="loading"
        :lazy="true"
        :paginator="true"
        :rowsPerPageOptions="[10, 15, 25, 50]"
        :sortField="sortField"
        :sortOrder="sortOrder"
        @page="onPage"
        @sort="onSort"
        stripedRows
        size="small"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="{first} a {last} de {totalRecords}"
        style="font-size:13px"
      >
        <Column field="name" header="Campo" :sortable="true" style="min-width:160px">
          <template #body="{ data }">
            <div class="ifm-field-cell">
              <div class="ifm-field-name-row">
                <span class="ifm-field-name">{{ data.name }}</span>
                <span v-if="data.required" class="ifm-required-badge">Obrigatório</span>
              </div>
              <span class="ifm-field-key">{{ data.key }}</span>
            </div>
          </template>
        </Column>
        <Column field="group" header="Grupo" :sortable="true" style="min-width:120px">
          <template #body="{ data }">
            <span class="ifm-group-badge" :class="`ifm-group-badge--${groupSlug(data.group)}`">
              {{ data.group }}
            </span>
          </template>
        </Column>
        <Column field="type" header="Tipo" :sortable="true" style="min-width:130px">
          <template #body="{ data }">
            <span class="ifm-type-badge" :class="`ifm-type-badge--${data.type}`">
              <i :class="typeIcon(data.type)" class="ifm-type-badge__icon"></i>
              {{ typeLabel(data.type) }}
            </span>
          </template>
        </Column>
        <Column field="aliasCount" header="Aliases" :sortable="true" style="min-width:200px">
          <template #body="{ data }">
            <div class="ifm-alias-cell">
              <span v-if="data.aliasCount > 0" class="ifm-alias-badge" v-tooltip.top="data.aliasNames.join(', ')">
                <i class="pi pi-tags" style="font-size:11px"></i>
                {{ data.aliasCount }} aliases
              </span>
              <span v-else class="ifm-alias-badge ifm-alias-badge--warning">
                <i class="pi pi-exclamation-circle" style="font-size:11px"></i>
                Sem aliases
              </span>
              <div v-if="inlineAddFieldId === data.id" class="ifm-inline-add" @click.stop>
                <input
                  ref="inlineInput"
                  v-model="inlineAddText"
                  class="ifm-inline-add__input"
                  placeholder="Novo alias + Enter"
                  @keydown.enter.prevent="submitInlineAdd(data)"
                  @keydown.escape="closeInlineAdd"
                  @blur="closeInlineAddDelayed"
                />
                <span v-if="inlineAddError" class="ifm-inline-add__error">{{ inlineAddError }}</span>
              </div>
              <button
                v-else
                class="ifm-inline-add-btn"
                v-tooltip.top="'Adicionar alias rápido'"
                @click.stop="openInlineAdd(data)"
              >
                <i class="pi pi-plus"></i>
              </button>
            </div>
          </template>
        </Column>
        <Column header="Ações" style="width:80px;text-align:center">
          <template #body="{ data }">
            <button
              class="ifm-edit-btn"
              v-tooltip.top="'Editar aliases'"
              @click.stop="openAliasDialog(data)"
            >
              <i class="pi pi-pencil"></i>
            </button>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <!-- Alias Edit Drawer -->
  <FieldAliasesDrawer
    v-model="showAliasDialog"
    :field="selectedField"
    :canGoPrev="canNavigatePrev"
    :canGoNext="canNavigateNext"
    @updated="onAliasUpdated"
    @navigate="onNavigateField"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Select from 'primevue/select'
import Tooltip from 'primevue/tooltip'

import FieldAliasesDrawer from '../components/import-fields/FieldAliasesDrawer.vue'
import { fetchImportFields, fetchImportFieldsKpis, addAlias, FIELD_TYPES, getFieldGroups, getFieldCountsByGroup } from '../mocks/importFieldsMock.js'

const vTooltip = Tooltip

const toast = useToast()

// ── State ──────────────────────────────────────────────────────────────────────
const fields = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const currentPage = ref(1)
const perPage = ref(15)
const sortField = ref('name')
const sortOrder = ref(1)
const searchTerm = ref('')
const selectedGroup = ref('')
const selectedType = ref('')
const selectedRequired = ref('')
const showAliasDialog = ref(false)
const selectedField = ref(null)
const alertDismissed = ref(false)

// Inline quick-add alias
const inlineAddFieldId = ref(null)
const inlineAddText = ref('')
const inlineAddError = ref('')
const inlineInput = ref(null)
let inlineBlurTimeout = null

// KPIs
const kpis = reactive({
  totalFields: 0,
  totalAliases: 0,
  fieldsWithoutAlias: 0,
  totalGroups: 0,
  coveragePercent: 0
})

let searchTimeout = null

// ── Group filter options ───────────────────────────────────────────────────────
const groupOptions = computed(() => {
  const groups = getFieldGroups()
  const counts = getFieldCountsByGroup()
  const totalFields = Object.values(counts).reduce((sum, n) => sum + n, 0)
  return [
    { label: `Todos (${totalFields})`, value: '' },
    ...groups.map(g => ({ label: `${g} (${counts[g] || 0})`, value: g }))
  ]
})

const typeOptions = computed(() => {
  return [
    { label: 'Todos os tipos', value: '' },
    ...Object.entries(FIELD_TYPES).map(([value, label]) => ({ label, value }))
  ]
})

const requiredOptions = [
  { label: 'Todos', value: '' },
  { label: 'Obrigatório', value: 'yes' },
  { label: 'Não obrigatório', value: 'no' }
]

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(() => {
  loadFields()
  loadKpis()
})

// ── Actions ────────────────────────────────────────────────────────────────────
async function loadKpis() {
  try {
    const data = await fetchImportFieldsKpis()
    Object.assign(kpis, data)
  } catch {
    // Silently fail — KPIs are non-critical
  }
}

async function loadFields() {
  loading.value = true
  try {
    const result = await fetchImportFields({
      search: searchTerm.value,
      group: selectedGroup.value,
      type: selectedType.value,
      required: selectedRequired.value,
      page: currentPage.value,
      perPage: perPage.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value
    })
    fields.value = result.data
    totalRecords.value = result.total
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os campos.', life: 4000 })
  } finally {
    loading.value = false
  }
}

function onPage(event) {
  currentPage.value = event.page + 1
  perPage.value = event.rows
  loadFields()
}

function onSort(event) {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
  currentPage.value = 1
  loadFields()
}

function onSearchChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadFields()
  }, 400)
}

function clearSearch() {
  searchTerm.value = ''
  currentPage.value = 1
  loadFields()
}

function clearAllFilters() {
  searchTerm.value = ''
  selectedGroup.value = ''
  selectedType.value = ''
  selectedRequired.value = ''
  currentPage.value = 1
  loadFields()
}

function onFilterChange() {
  currentPage.value = 1
  loadFields()
}

function openAliasDialog(field) {
  selectedField.value = field
  showAliasDialog.value = true
}

// ── Field navigation in drawer ─────────────────────────────────────────────────
const canNavigatePrev = computed(() => {
  if (!selectedField.value) return false
  const idx = fields.value.findIndex(f => f.id === selectedField.value.id)
  return idx > 0
})

const canNavigateNext = computed(() => {
  if (!selectedField.value) return false
  const idx = fields.value.findIndex(f => f.id === selectedField.value.id)
  return idx < fields.value.length - 1
})

function onNavigateField(direction) {
  if (!selectedField.value) return
  const idx = fields.value.findIndex(f => f.id === selectedField.value.id)
  const newIdx = idx + direction
  if (newIdx >= 0 && newIdx < fields.value.length) {
    selectedField.value = fields.value[newIdx]
  }
}

function onAliasUpdated() {
  // Reload to update alias counts and KPIs
  loadFields()
  loadKpis()
}

// ── Inline quick-add alias ─────────────────────────────────────────────────────
function openInlineAdd(field) {
  inlineAddFieldId.value = field.id
  inlineAddText.value = ''
  inlineAddError.value = ''
  nextTick(() => {
    if (inlineInput.value) {
      const el = Array.isArray(inlineInput.value) ? inlineInput.value[0] : inlineInput.value
      el?.focus()
    }
  })
}

function closeInlineAdd() {
  inlineAddFieldId.value = null
  inlineAddText.value = ''
  inlineAddError.value = ''
}

function closeInlineAddDelayed() {
  clearTimeout(inlineBlurTimeout)
  inlineBlurTimeout = setTimeout(() => {
    closeInlineAdd()
  }, 150)
}

async function submitInlineAdd(field) {
  if (!inlineAddText.value.trim()) return
  inlineAddError.value = ''
  try {
    await addAlias(field.id, inlineAddText.value)
    toast.add({ severity: 'success', summary: 'Alias adicionado', detail: `"${inlineAddText.value.trim()}" adicionado a ${field.name}.`, life: 3000 })
    inlineAddText.value = ''
    loadFields()
    loadKpis()
    // Keep input open for next alias
    nextTick(() => {
      if (inlineInput.value) {
        const el = Array.isArray(inlineInput.value) ? inlineInput.value[0] : inlineInput.value
        el?.focus()
      }
    })
  } catch (err) {
    inlineAddError.value = err.message
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function typeLabel(type) {
  return FIELD_TYPES[type] || type
}

function typeIcon(type) {
  const icons = {
    text: 'pi pi-align-left',
    text_long: 'pi pi-align-justify',
    integer: 'pi pi-hashtag',
    decimal: 'pi pi-dollar',
    url: 'pi pi-image',
    relationship: 'pi pi-sitemap',
    boolean: 'pi pi-check-square',
    list: 'pi pi-list',
    date: 'pi pi-calendar'
  }
  return icons[type] || 'pi pi-circle'
}

function groupSlug(group) {
  const map = {
    'Gerais': 'gerais',
    'Preços': 'precos',
    'Estoque': 'estoque',
    'Dimensões': 'dimensoes',
    'Embalagem': 'embalagem',
    'SEO': 'seo',
    'Categoria': 'categoria',
    'Imagens': 'imagens',
    'Variações': 'variacoes'
  }
  return map[group] || 'default'
}
</script>

<style scoped>
/* ── KPI Cards ────────────────────────────────────────────────────────── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
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
  cursor: default;
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

.kpi-icon--teal {
  background: rgba(20, 184, 166, 0.1);
}
.kpi-icon--teal i { color: #14b8a6; }

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

@media (max-width: 1200px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ── Page styles ──────────────────────────────────────────────────────── */
.ifm-description-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  margin-bottom: 16px;
}

.ifm-description-text {
  flex: 1;
  font-size: 12px;
  color: #15803d;
}

.ifm-description-link {
  font-size: 12px;
  color: #047857;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.15s;
}

.ifm-description-link:hover {
  color: #065f46;
  text-decoration: underline;
}

.ifm-description-close {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #86efac;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.ifm-description-close i {
  font-size: 11px;
}

.ifm-description-close:hover {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.ifm-filters-card {
  padding: 20px 24px;
  margin-bottom: 12px;
}

.ifm-filters-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr auto;
  gap: 16px;
  align-items: end;
}

.ifm-filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ifm-filter-field--search {
  min-width: 0;
}

.ifm-filter-field--btn {
  align-self: end;
}

.ifm-filter-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.ifm-filter-input {
  width: 100%;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
}

.ifm-search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #fff;
  padding: 0 12px;
  transition: border-color 0.15s;
}

.ifm-search-input-wrap:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.ifm-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: var(--text-primary);
}

.ifm-search-input::placeholder {
  color: var(--text-muted);
}

.ifm-search-input__clear {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  font-size: 11px;
  padding: 2px;
}

.ifm-search-input__clear:hover {
  color: #ef4444;
}

.ifm-btn-pesquisar {
  height: 38px !important;
  font-size: 13px !important;
  padding: 0 18px !important;
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: #fff !important;
}

.ifm-btn-pesquisar:hover {
  background: #2563eb !important;
  border-color: #2563eb !important;
}

@media (max-width: 1100px) {
  .ifm-filters-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .ifm-filters-row {
    grid-template-columns: 1fr;
  }
}

.ifm-records-bar {
  padding: 0 4px;
  margin-bottom: 8px;
}

.ifm-records-count {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
}

.ifm-field-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ifm-field-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ifm-field-name {
  font-weight: 600;
  color: var(--text-primary);
}

.ifm-required-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
  white-space: nowrap;
}

.ifm-field-key {
  font-size: 11px;
  color: var(--text-muted);
  font-family: monospace;
}

/* ── Group Badges ─────────────────────────────────────────────────────── */
.ifm-group-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.ifm-group-badge--gerais {
  background: #f1f5f9;
  color: #475569;
}

.ifm-group-badge--precos {
  background: #ecfdf5;
  color: #047857;
}

.ifm-group-badge--estoque {
  background: #fef3c7;
  color: #92400e;
}

.ifm-group-badge--dimensoes {
  background: #f5f3ff;
  color: #6d28d9;
}

.ifm-group-badge--embalagem {
  background: #fff7ed;
  color: #c2410c;
}

.ifm-group-badge--seo {
  background: #ecfeff;
  color: #0e7490;
}

.ifm-group-badge--categoria {
  background: #eff6ff;
  color: #1d4ed8;
}

.ifm-group-badge--imagens {
  background: #fdf2f8;
  color: #be185d;
}

.ifm-group-badge--variacoes {
  background: #f0fdf4;
  color: #15803d;
}

.ifm-group-badge--default {
  background: #f8fafc;
  color: var(--text-secondary);
}

.ifm-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  background: #f1f5f9;
  color: var(--text-secondary);
}

.ifm-type-badge__icon {
  font-size: 12px;
}

.ifm-type-badge--text {
  background: #f1f5f9;
  color: #475569;
}
.ifm-type-badge--text .ifm-type-badge__icon { color: #64748b; }

.ifm-type-badge--text_long {
  background: #f0f9ff;
  color: #0369a1;
}
.ifm-type-badge--text_long .ifm-type-badge__icon { color: #0ea5e9; }

.ifm-type-badge--integer {
  background: #fef3c7;
  color: #92400e;
}
.ifm-type-badge--integer .ifm-type-badge__icon { color: #d97706; }

.ifm-type-badge--decimal {
  background: #ecfdf5;
  color: #047857;
}
.ifm-type-badge--decimal .ifm-type-badge__icon { color: #10b981; }

.ifm-type-badge--url {
  background: #fdf2f8;
  color: #9d174d;
}
.ifm-type-badge--url .ifm-type-badge__icon { color: #ec4899; }

.ifm-type-badge--relationship {
  background: #f5f3ff;
  color: #5b21b6;
}
.ifm-type-badge--relationship .ifm-type-badge__icon { color: #8b5cf6; }

.ifm-type-badge--boolean {
  background: #ecfeff;
  color: #0e7490;
}
.ifm-type-badge--boolean .ifm-type-badge__icon { color: #06b6d4; }

.ifm-type-badge--list {
  background: #fff7ed;
  color: #c2410c;
}
.ifm-type-badge--list .ifm-type-badge__icon { color: #f97316; }

.ifm-type-badge--date {
  background: #eff6ff;
  color: #1d4ed8;
}
.ifm-type-badge--date .ifm-type-badge__icon { color: #3b82f6; }

/* ── Edit Button ──────────────────────────────────────────────────────── */
.ifm-edit-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.ifm-edit-btn i {
  font-size: 14px;
}

.ifm-edit-btn:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #3b82f6;
}

.ifm-edit-btn:active {
  background: #dbeafe;
  transform: scale(0.93);
}

/* ── Alias Badge ──────────────────────────────────────────────────────── */
.ifm-alias-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
  white-space: nowrap;
  cursor: default;
  transition: all 0.15s;
}

.ifm-alias-badge:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

.ifm-alias-badge--warning {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* ── Inline quick-add ─────────────────────────────────────────────────── */
.ifm-alias-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ifm-inline-add-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px dashed #cbd5e1;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}

.ifm-inline-add-btn i {
  font-size: 11px;
}

.ifm-inline-add-btn:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.ifm-inline-add {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ifm-inline-add__input {
  width: 140px;
  height: 28px;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  padding: 0 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  color: var(--text-primary);
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.ifm-inline-add__input::placeholder {
  color: var(--text-muted);
  font-size: 11px;
}

.ifm-inline-add__error {
  font-size: 10px;
  color: #dc2626;
  max-width: 140px;
  line-height: 1.2;
}

/* ── Row Expansion (removed) ─── */

/* ── DataTable Sort Indicators ────────────────────────────────────────── */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  transition: background 0.15s, color 0.15s;
}

:deep(.p-datatable .p-datatable-thead > tr > th.p-datatable-column-sorted) {
  background: #eff6ff;
  color: #1d4ed8;
}

:deep(.p-datatable .p-sortable-column-icon) {
  font-size: 14px;
  color: #cbd5e1;
  margin-left: 6px;
  transition: color 0.15s, transform 0.15s;
}

:deep(.p-datatable .p-datatable-column-sorted .p-sortable-column-icon) {
  color: #3b82f6;
  font-size: 14px;
}

:deep(.p-datatable .p-datatable-thead > tr > th.p-datatable-column-sorted .p-column-header-content) {
  color: #1d4ed8;
  font-weight: 700;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  cursor: pointer;
  transition: background 0.12s ease, box-shadow 0.12s ease;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: #f0f7ff !important;
  box-shadow: inset 3px 0 0 0 #3b82f6;
}

:deep(.p-datatable .p-datatable-tbody > tr:active) {
  background: #e0efff !important;
}
</style>
