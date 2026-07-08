<template>
  <!-- Breadcrumb -->
  <div class="app-breadcrumb">
    <div class="breadcrumb-item"><a href="#"><i class="pi pi-home"></i> Home</a></div>
    <span class="breadcrumb-separator"><i class="pi pi-chevron-right" style="font-size:10px"></i></span>
    <div class="breadcrumb-item"><a href="#">Produtos</a></div>
    <span class="breadcrumb-separator"><i class="pi pi-chevron-right" style="font-size:10px"></i></span>
    <span class="breadcrumb-current">Editar</span>
  </div>

  <div class="app-content">
    <div class="page-header">
      <span class="page-title"><i class="pi pi-box" style="margin-right:6px"></i>Estoque Disponível por SKU e Filial</span>
      <div class="page-actions">
        <Button label="Filtros" icon="pi pi-filter" severity="secondary" outlined size="small" />
      </div>
    </div>

    <!-- Tabs -->
    <div class="ps-tabs">
      <div v-for="tab in tabs" :key="tab.key" class="ps-tab"
        :class="{ 'ps-tab--active': activeTab === tab.key }" @click="activeTab = tab.key">
        {{ tab.label }}
      </div>
    </div>

    <template v-if="activeTab === 'estoque'">
      <!-- SKU Grupo -->
      <div class="content-card ps-section">
        <div class="ps-row" v-if="!loading">
          <div class="ps-field ps-field--lg">
            <label class="ps-label">SKU Grupo</label>
            <div class="ps-input-wrap">
              <span class="ps-input-text">{{ group.skuGrupo }}</span>
              <button class="ps-copy-btn" @click="copy(group.skuGrupo)" v-tooltip.top="'Copiar'"><i class="pi pi-copy"></i></button>
            </div>
          </div>
          <div class="ps-field ps-field--lg">
            <label class="ps-label">Estoque Total Disponível SKU Grupo
              <i class="pi pi-info-circle ps-info-icon" v-tooltip.top="'Soma de todas as variações e filiais'"></i>
            </label>
            <div class="ps-input-wrap"><span class="ps-input-text ps-input-text--readonly">{{ group.estoqueTotal }}</span></div>
          </div>
          <div class="ps-field ps-field--md">
            <label class="ps-label">Estoque Mínimo SKU Grupo
              <i class="pi pi-info-circle ps-info-icon" v-tooltip.top="'Quantidade mínima desejada'"></i>
            </label>
            <div class="ps-input-wrap"><span class="ps-input-text ps-input-text--readonly">{{ group.estoqueMinimo }}</span></div>
          </div>
        </div>
        <div v-else class="ps-row">
          <Skeleton height="36px" style="flex:2;border-radius:7px" />
          <Skeleton height="36px" style="flex:2;border-radius:7px" />
          <Skeleton height="36px" style="flex:1;border-radius:7px" />
        </div>
      </div>

      <!-- Variações -->
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
        <template v-if="loading">
          <div v-for="i in 3" :key="i" class="content-card ps-section">
            <div style="display:flex;gap:12px;align-items:center">
              <Skeleton shape="square" size="64px" borderRadius="10px" />
              <div style="flex:1;display:flex;gap:12px;flex-wrap:wrap">
                <Skeleton v-for="j in 5" :key="j" height="36px" style="flex:1 1 140px;border-radius:7px" />
              </div>
            </div>
          </div>
        </template>

        <div v-for="(variacao, idx) in variacoes" :key="variacao.sku"
          class="content-card variacao-card"
          :class="{ 'variacao-card--inactive': variacao.status === 'Inativo' }">

          <!-- Header da variação -->
          <div class="variacao-header" @click="toggleVariacao(idx)">
            <div class="variacao-thumb">
              <div class="ps-thumb-box ps-thumb-box--sm">
                <img src="https://http2.mlstatic.com/D_NQ_NP_2X_778900-MLA99916519859_112025-F.webp"
                  alt="Produto" style="width:100%;height:100%;object-fit:cover;border-radius:10px" />
              </div>
              <Tag :value="variacao.status" :severity="variacao.status === 'Ativo' ? 'success' : 'secondary'"
                style="margin-top:6px;font-size:10px" />
            </div>
            <div class="variacao-fields">
              <div class="ps-field">
                <label class="ps-label">SKU</label>
                <div class="ps-input-wrap" @click.stop>
                  <span class="ps-input-text">{{ variacao.sku }}</span>
                  <button class="ps-copy-btn" @click="copy(variacao.sku)" v-tooltip.top="'Copiar'"><i class="pi pi-copy"></i></button>
                </div>
              </div>
              <div class="ps-field ps-field--lg">
                <label class="ps-label">Código de Referência</label>
                <div class="ps-input-wrap" @click.stop>
                  <span class="ps-input-text">{{ variacao.codigoReferencia }}</span>
                  <button class="ps-copy-btn" @click="copy(variacao.codigoReferencia)" v-tooltip.top="'Copiar'"><i class="pi pi-copy"></i></button>
                </div>
              </div>
              <div class="ps-field ps-field--lg">
                <label class="ps-label">Característica Principal</label>
                <div class="ps-input-wrap"><span class="ps-input-text ps-input-text--readonly">{{ variacao.caracteristicaPrincipal || '—' }}</span></div>
              </div>
              <div class="ps-field ps-field--lg">
                <label class="ps-label">Característica Secundária</label>
                <div class="ps-input-wrap"><span class="ps-input-text ps-input-text--readonly">{{ variacao.caracteristicaSecundaria || '—' }}</span></div>
              </div>
              <div class="ps-field ps-field--lg">
                <label class="ps-label">EAN</label>
                <div class="ps-input-wrap" @click.stop>
                  <span class="ps-input-text">{{ variacao.codigoBarras }}</span>
                  <button class="ps-copy-btn" @click="copy(variacao.codigoBarras)" v-tooltip.top="'Copiar'"><i class="pi pi-copy"></i></button>
                </div>
              </div>
              <div class="ps-field">
                <label class="ps-label">Total Disponível</label>
                <div class="ps-input-wrap"><span class="ps-input-text ps-input-text--readonly">{{ variacao.totalDisponivel }}</span></div>
              </div>
              <div class="ps-field">
                <label class="ps-label">Estoque Mínimo</label>
                <div class="ps-input-wrap"><span class="ps-input-text ps-input-text--readonly">{{ variacao.estoqueMinimoSku ?? '—' }}</span></div>
              </div>
            </div>
            <div class="variacao-header__right">
              <span class="variacao-filiais-badge">
                <i class="pi pi-building" style="font-size:11px"></i>
                {{ variacao.filiais.length }} filiais
              </span>
              <i class="pi variacao-chevron" :class="expandedVariacoes[idx] ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
            </div>
          </div>

          <!-- Filiais: DataTable virtualizada -->
          <Transition name="var-expand">
            <div v-if="expandedVariacoes[idx]" class="variacao-filiais">
              <Divider style="margin:0" />

              <!-- Barra de busca + filtro -->
              <div class="filiais-toolbar">
                <div class="filiais-search">
                  <i class="pi pi-search filiais-search__icon"></i>
                  <input
                    v-model="searchTerms[idx]"
                    class="filiais-search__input"
                    placeholder="Buscar filial por nome ou cidade..."
                  />
                  <button v-if="searchTerms[idx]" class="filiais-search__clear" @click="searchTerms[idx] = ''">
                    <i class="pi pi-times"></i>
                  </button>
                </div>
                <div class="filiais-filter-btns">
                  <button class="ffilter-btn" :class="{ active: statusFilters[idx] === 'todos' }"
                    @click="statusFilters[idx] = 'todos'">Todos</button>
                  <button class="ffilter-btn ffilter-btn--ativo" :class="{ active: statusFilters[idx] === 'ativo' }"
                    @click="statusFilters[idx] = 'ativo'">Ativo</button>
                  <button class="ffilter-btn ffilter-btn--inativo" :class="{ active: statusFilters[idx] === 'inativo' }"
                    @click="statusFilters[idx] = 'inativo'">Inativo</button>
                </div>
                <span class="filiais-count">
                  {{ filteredFiliais(idx, variacao.filiais).length }} de {{ variacao.filiais.length }} filiais
                </span>
              </div>

              <!-- Cabeçalho da tabela -->
              <div class="ftable-head">
                <div class="ftcol ftcol--id">#</div>
                <div class="ftcol ftcol--name">Filial</div>
                <div class="ftcol ftcol--num">Disponível</div>
                <div class="ftcol ftcol--num">Reservado</div>
                <div class="ftcol ftcol--num">Em Trânsito</div>
                <div class="ftcol ftcol--tipo">Tipo Estoque</div>
                <div class="ftcol ftcol--status">Status</div>
                <div class="ftcol ftcol--action"></div>
              </div>

              <!-- Virtual scroll container -->
              <div class="ftable-scroll" :style="{ maxHeight: '400px' }">
                <template v-for="filial in filteredFiliais(idx, variacao.filiais)" :key="filial.id">
                  <!-- Linha da filial -->
                  <div class="ftable-row"
                    :class="{
                      'ftable-row--inactive': filial.status === 'inativo',
                      'ftable-row--expanded': isFilialOpen(idx, filial.id)
                    }"
                    @click="toggleFilial(idx, filial.id)">
                    <div class="ftcol ftcol--id">{{ filial.id }}</div>
                    <div class="ftcol ftcol--name">
                      <i class="pi pi-building ftrow-icon"></i>
                      {{ filial.nome }}
                    </div>
                    <div class="ftcol ftcol--num">
                      <span :class="filial.totalDisponivel > 0 ? 'fnum--ok' : 'fnum--zero'">
                        {{ filial.totalDisponivel }}
                      </span>
                    </div>
                    <div class="ftcol ftcol--num">{{ filial.reservado }}</div>
                    <div class="ftcol ftcol--num">{{ filial.emTransito }}</div>
                    <div class="ftcol ftcol--tipo">
                      <span class="ftipo-badge">{{ labelTipo(filial.tipoEstoque) }}</span>
                    </div>
                    <div class="ftcol ftcol--status">
                      <Tag :value="filial.status === 'ativo' ? 'Ativo' : 'Inativo'"
                        :severity="filial.status === 'ativo' ? 'success' : 'secondary'"
                        style="font-size:10px" />
                    </div>
                    <div class="ftcol ftcol--action">
                      <i class="pi" :class="isFilialOpen(idx, filial.id) ? 'pi-chevron-up' : 'pi-chevron-down'"
                        style="font-size:12px;color:#94a3b8"></i>
                    </div>
                  </div>

                  <!-- Painel de edição inline -->
                  <Transition name="filial-expand">
                    <div v-if="isFilialOpen(idx, filial.id)" class="ftable-edit" @click.stop>
                      <div class="filial-edit-row">
                        <div class="ps-field ps-field--md">
                          <label class="ps-label">Estoque Disponível</label>
                          <InputNumber v-model="filial.estoqueDisponivel" :disabled="filial.status === 'inativo'"
                            :min="0" inputClass="ps-input-number" :useGrouping="false" />
                        </div>
                        <div class="ps-field ps-field--lg">
                          <label class="ps-label">Tipo de Estoque
                            <span class="ps-help-badge" v-tooltip.top="'Automático: ajusta pelo pedido. Fixo: valor fixo. Baixando: decrementa sem reposição.'">
                              <i class="pi pi-question-circle"></i> Ajuda
                            </span>
                          </label>
                          <Select v-model="filial.tipoEstoque" :options="tiposEstoque"
                            optionLabel="label" optionValue="value"
                            :disabled="filial.status === 'inativo'" class="ps-select" />
                        </div>
                        <div class="ps-field ps-field--md">
                          <label class="ps-label">Estoque de Segurança
                            <i class="pi pi-info-circle ps-info-icon" v-tooltip.top="'Reserva mínima que não será vendida'"></i>
                          </label>
                          <InputNumber v-model="filial.estoqueSguranca" :disabled="filial.status === 'inativo'"
                            :min="0" inputClass="ps-input-number" :useGrouping="false" />
                        </div>
                        <div class="ps-field ps-field--md">
                          <label class="ps-label">Tempo Adicional de Expedição
                            <i class="pi pi-info-circle ps-info-icon" v-tooltip.top="'Dias adicionais ao prazo padrão'"></i>
                          </label>
                          <div class="ps-input-suffix-wrap">
                            <InputNumber v-model="filial.tempoAdicionalDias" :disabled="filial.status === 'inativo'"
                              :min="0" inputClass="ps-input-number" :useGrouping="false" />
                            <span class="ps-input-suffix">dias</span>
                          </div>
                        </div>
                      </div>
                      <div class="filial-restricoes">
                        <label class="ps-label" style="margin-bottom:8px">
                          Restrições por Marketplace
                          <i class="pi pi-info-circle ps-info-icon" v-tooltip.top="'Quando ativo, o estoque desta filial não será considerado para o marketplace'"></i>
                        </label>
                        <div class="filial-restricoes__grid">
                          <div v-for="restricao in filial.restricoes" :key="restricao.marketplaceId"
                            class="restricao-item" :class="{ 'restricao-item--active': restricao.restrito }">
                            <span class="restricao-item__name">{{ restricao.marketplaceName }}</span>
                            <InputSwitch v-model="restricao.restrito" :disabled="filial.status === 'inativo'" />
                          </div>
                        </div>
                      </div>
                      <div class="filial-actions">
                        <Button label="Cancelar" severity="secondary" outlined size="small" @click="toggleFilial(idx, filial.id)" />
                        <Button label="Salvar" icon="pi pi-check" size="small"
                          :disabled="filial.status === 'inativo'"
                          :loading="savingFilial === `${idx}-${filial.id}`"
                          @click="saveFilial(idx, filial)" />
                      </div>
                    </div>
                  </Transition>
                </template>

                <!-- Empty filtered -->
                <div v-if="filteredFiliais(idx, variacao.filiais).length === 0" class="ftable-empty">
                  <i class="pi pi-search" style="font-size:24px;color:#cbd5e1"></i>
                  <span>Nenhuma filial encontrada para "{{ searchTerms[idx] }}"</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </template>

    <div v-else class="content-card" style="padding:48px;text-align:center;color:#94a3b8;margin-top:12px">
      <i class="pi pi-wrench" style="font-size:36px;margin-bottom:12px;display:block"></i>
      Aba <strong>{{ tabs.find(t => t.key === activeTab)?.label }}</strong> — em construção
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Select from 'primevue/select'
import { fetchProductStock, TIPOS_ESTOQUE } from '../mocks/productStockMock.js'

const toast = useToast()
const tiposEstoque = TIPOS_ESTOQUE

const tabs = [
  { key: 'dados',        label: 'Dados Gerais' },
  { key: 'variacoes',    label: 'Variações' },
  { key: 'atributos',    label: 'Atributos' },
  { key: 'precificacao', label: 'Precificação' },
  { key: 'estoque',      label: 'Estoque' },
  { key: 'restricoes',   label: 'Restrições' },
]

const activeTab = ref('estoque')
const loading = ref(false)
const group = ref({})
const variacoes = ref([])
const expandedVariacoes = reactive({})
const expandedFiliais = reactive({})
const savingFilial = ref(null)
// Per-variação search and filter state
const searchTerms = reactive({})
const statusFilters = reactive({})

onMounted(async () => {
  loading.value = true
  try {
    const data = await fetchProductStock()
    group.value = data.group
    variacoes.value = data.variacoes
    data.variacoes.forEach((_, i) => {
      searchTerms[i] = ''
      statusFilters[i] = 'todos'
    })
    if (data.variacoes.length) expandedVariacoes[0] = true
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os dados de estoque.', life: 4000 })
  } finally {
    loading.value = false
  }
})

function toggleVariacao(idx) { expandedVariacoes[idx] = !expandedVariacoes[idx] }

function toggleFilial(variacaoIdx, filialId) {
  const key = `${variacaoIdx}-${filialId}`
  expandedFiliais[key] = !expandedFiliais[key]
}

function isFilialOpen(variacaoIdx, filialId) {
  return !!expandedFiliais[`${variacaoIdx}-${filialId}`]
}

function filteredFiliais(idx, filiais) {
  const term = (searchTerms[idx] || '').toLowerCase()
  const status = statusFilters[idx] || 'todos'
  return filiais.filter(f => {
    const matchTerm = !term || f.nome.toLowerCase().includes(term)
    const matchStatus = status === 'todos' || f.status === status
    return matchTerm && matchStatus
  })
}

function labelTipo(value) {
  return TIPOS_ESTOQUE.find(t => t.value === value)?.label ?? value
}

function copy(val) {
  if (!val) return
  navigator.clipboard?.writeText(String(val))
  toast.add({ severity: 'info', summary: 'Copiado', detail: `"${val}" copiado.`, life: 2000 })
}

async function saveFilial(variacaoIdx, filial) {
  const key = `${variacaoIdx}-${filial.id}`
  savingFilial.value = key
  try {
    await new Promise(r => setTimeout(r, 700))
    if (Math.random() < 0.07) throw new Error('Falha na comunicação com o servidor.')
    expandedFiliais[key] = false
    toast.add({ severity: 'success', summary: 'Salvo', detail: `Filial ${filial.id} — ${filial.nome} atualizada.`, life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Erro ao salvar', detail: err?.message || 'Tente novamente.', life: 5000 })
  } finally {
    savingFilial.value = null
  }
}
</script>

<style scoped>
/* ── Tabs ─────────────────────────────────────────────────────────────── */
.ps-tabs { display:flex;gap:2px;background:#fff;border:1px solid var(--border-color);border-radius:10px;padding:4px;margin-bottom:16px;width:fit-content;flex-wrap:wrap; }
.ps-tab { padding:7px 18px;font-size:12px;font-weight:500;color:var(--text-secondary);border-radius:7px;cursor:pointer;transition:all .15s;white-space:nowrap;user-select:none; }
.ps-tab:hover { background:#f1f5f9;color:var(--text-primary); }
.ps-tab--active { background:#3b82f6;color:#fff;font-weight:600; }

/* ── Section / fields ────────────────────────────────────────────────── */
.ps-section { padding:20px 24px; }
.ps-row { display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap; }
.ps-field { display:flex;flex-direction:column;gap:5px;min-width:110px; }
.ps-field--md { flex:0 0 150px; }
.ps-field--lg { flex:1 1 180px; }
.ps-label { font-size:10px;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.4px;display:flex;align-items:center;gap:4px; }
.ps-info-icon { font-size:11px;color:var(--text-muted);cursor:default; }
.ps-input-wrap { display:flex;align-items:center;background:#f8fafc;border:1px solid var(--border-color);border-radius:7px;padding:7px 10px;gap:6px;min-height:36px; }
.ps-input-text { flex:1;font-size:13px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.ps-input-text--readonly { color:var(--text-secondary); }
.ps-copy-btn { flex-shrink:0;background:none;border:none;cursor:pointer;color:var(--text-muted);padding:2px 4px;border-radius:4px;display:flex;align-items:center;transition:color .15s;font-size:13px; }
.ps-copy-btn:hover { color:#3b82f6; }
.ps-thumb-box { border-radius:10px;border:1px solid var(--border-color);background:#f8fafc;display:flex;align-items:center;justify-content:center;overflow:hidden; }
.ps-thumb-box--sm { width:64px;height:64px; }
:deep(.ps-input-number) { width:100%;height:36px;font-family:'Poppins',sans-serif;font-size:13px;border-radius:7px;border:1px solid var(--border-color);background:#fff;padding:0 10px;color:var(--text-primary); }
:deep(.ps-input-number:focus) { outline:none;border-color:#3b82f6;box-shadow:0 0 0 2px #bfdbfe; }
.ps-input-suffix-wrap { display:flex;align-items:center;border:1px solid var(--border-color);border-radius:7px;overflow:hidden;background:#fff; }
.ps-input-suffix-wrap :deep(.p-inputnumber) { flex:1; }
.ps-input-suffix-wrap :deep(.ps-input-number) { border:none;border-radius:0;box-shadow:none; }
.ps-input-suffix { padding:0 10px;font-size:12px;color:var(--text-muted);background:#f8fafc;border-left:1px solid var(--border-color);height:36px;display:flex;align-items:center;white-space:nowrap; }
.ps-select { width:100%;font-family:'Poppins',sans-serif;font-size:13px; }
.ps-help-badge { display:inline-flex;align-items:center;gap:3px;background:#fff7ed;color:#ea580c;border:1px solid #fed7aa;border-radius:4px;padding:1px 6px;font-size:9px;font-weight:600;cursor:default;white-space:nowrap; }

/* ── Variação card ──────────────────────────────────────────────────── */
.variacao-card { overflow:hidden;transition:box-shadow .2s; }
.variacao-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.07); }
.variacao-card--inactive { opacity:.7; }
.variacao-header { display:flex;align-items:flex-start;gap:16px;padding:18px 20px;cursor:pointer;user-select:none; }
.variacao-thumb { flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:4px; }
.variacao-fields { flex:1;display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end; }
.variacao-header__right { flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:8px;padding-top:2px; }
.variacao-filiais-badge { display:inline-flex;align-items:center;gap:4px;background:#eff6ff;color:#3b82f6;border:1px solid #bfdbfe;border-radius:20px;padding:3px 10px;font-size:11px;font-weight:600;white-space:nowrap; }
.variacao-chevron { font-size:14px;color:#94a3b8;margin-top:2px; }
.variacao-filiais { }

/* ── Toolbar de filiais ─────────────────────────────────────────────── */
.filiais-toolbar { display:flex;align-items:center;gap:10px;padding:12px 16px;background:#f8fafc;border-bottom:1px solid var(--border-color);flex-wrap:wrap; }
.filiais-search { display:flex;align-items:center;gap:8px;flex:1;min-width:200px;background:#fff;border:1px solid var(--border-color);border-radius:8px;padding:0 12px;height:34px; }
.filiais-search__icon { font-size:12px;color:var(--text-muted); }
.filiais-search__input { flex:1;border:none;outline:none;font-family:'Poppins',sans-serif;font-size:12px;color:var(--text-primary);background:transparent; }
.filiais-search__clear { background:none;border:none;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;font-size:11px; }
.filiais-search__clear:hover { color:#ef4444; }
.filiais-filter-btns { display:flex;gap:4px; }
.ffilter-btn { padding:5px 12px;font-size:11px;font-weight:600;border-radius:6px;border:1px solid var(--border-color);background:#fff;cursor:pointer;color:var(--text-secondary);transition:all .15s; }
.ffilter-btn:hover { background:#f1f5f9; }
.ffilter-btn.active { background:#3b82f6;color:#fff;border-color:#3b82f6; }
.ffilter-btn--ativo.active { background:#10b981;border-color:#10b981; }
.ffilter-btn--inativo.active { background:#64748b;border-color:#64748b; }
.filiais-count { font-size:11px;color:var(--text-muted);white-space:nowrap;margin-left:auto; }

/* ── Tabela de filiais ──────────────────────────────────────────────── */
.ftable-head { display:flex;align-items:center;padding:0 16px;height:36px;background:#f1f5f9;border-bottom:1px solid var(--border-color);font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px;user-select:none; }
.ftable-scroll { overflow-y:auto; }
.ftable-row { display:flex;align-items:center;padding:0 16px;height:46px;border-bottom:1px solid #f1f5f9;cursor:pointer;transition:background .12s;font-size:13px;color:var(--text-primary); }
.ftable-row:hover { background:#f8fafc; }
.ftable-row--expanded { background:#eff6ff; }
.ftable-row--inactive { opacity:.55; }
.ftcol { padding:0 6px; }
.ftcol--id    { width:40px;flex-shrink:0;font-size:11px;font-weight:700;color:#3b82f6; }
.ftcol--name  { flex:1;min-width:0;display:flex;align-items:center;gap:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
.ftcol--num   { width:90px;flex-shrink:0;text-align:center;font-weight:600; }
.ftcol--tipo  { width:110px;flex-shrink:0; }
.ftcol--status{ width:80px;flex-shrink:0; }
.ftcol--action{ width:28px;flex-shrink:0;display:flex;justify-content:center; }
.ftrow-icon { font-size:12px;color:#93c5fd;flex-shrink:0; }
.fnum--ok   { color:#10b981;font-weight:700; }
.fnum--zero { color:#cbd5e1; }
.ftipo-badge { display:inline-block;background:#f1f5f9;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:600;color:var(--text-secondary); }
.ftable-empty { display:flex;flex-direction:column;align-items:center;gap:8px;padding:32px;color:var(--text-muted);font-size:13px; }

/* ── Painel de edição inline ────────────────────────────────────────── */
.ftable-edit { padding:16px 20px;background:#fafcff;border-bottom:1px solid #e2e8f0;display:flex;flex-direction:column;gap:14px; }
.filial-edit-row { display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end; }
.filial-restricoes { display:flex;flex-direction:column; }
.filial-restricoes__grid { display:flex;flex-wrap:wrap;gap:8px;margin-top:6px; }
.restricao-item { display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--border-color);border-radius:8px;padding:8px 14px;min-width:160px;transition:border-color .15s,background .15s; }
.restricao-item--active { background:#fff7ed;border-color:#fed7aa; }
.restricao-item__name { flex:1;font-size:13px;font-weight:500;color:var(--text-primary); }
.filial-actions { display:flex;justify-content:flex-end;gap:8px; }

/* ── Transições ─────────────────────────────────────────────────────── */
.var-expand-enter-active,.var-expand-leave-active { transition:opacity .2s ease,transform .2s ease; }
.var-expand-enter-from,.var-expand-leave-to { opacity:0;transform:translateY(-4px); }
.filial-expand-enter-active,.filial-expand-leave-active { transition:opacity .15s ease,transform .15s ease; }
.filial-expand-enter-from,.filial-expand-leave-to { opacity:0;transform:translateY(-3px); }
</style>
