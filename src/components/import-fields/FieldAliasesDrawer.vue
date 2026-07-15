<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    :style="{ width: '480px' }"
    :dismissable="true"
    :showCloseIcon="true"
  >
    <template #header>
      <div class="drawer-header">
        <div class="drawer-nav">
          <button class="drawer-nav-btn" :disabled="!canGoPrev" @click="$emit('navigate', -1)" v-tooltip.bottom="'Campo anterior'">
            <i class="pi pi-chevron-left"></i>
          </button>
          <button class="drawer-nav-btn" :disabled="!canGoNext" @click="$emit('navigate', 1)" v-tooltip.bottom="'Próximo campo'">
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
        <span class="drawer-title">Editar Aliases</span>
      </div>
    </template>

    <div v-if="field" class="drawer-content">
      <!-- Field info -->
      <div class="drawer-field-info">
        <div class="drawer-field-info__icon">
          <i class="pi pi-link" style="color:#fff;font-size:16px"></i>
        </div>
        <div class="drawer-field-info__body">
          <div class="drawer-field-info__name">{{ field.name }}</div>
          <div class="drawer-field-info__meta">
            <span class="drawer-meta-chip"><i class="pi pi-key" style="font-size:10px"></i> {{ field.key }}</span>
            <span class="drawer-meta-chip"><i class="pi pi-folder" style="font-size:10px"></i> {{ field.group }}</span>
            <span class="drawer-meta-chip"><i class="pi pi-tag" style="font-size:10px"></i> {{ fieldTypeLabel }}</span>
          </div>
        </div>
      </div>

      <!-- Add alias -->
      <div class="drawer-section-label">Adicionar alias</div>
      <div class="drawer-add-row">
        <div class="drawer-add-input-wrap">
          <i class="pi pi-plus-circle drawer-add-icon"></i>
          <input
            v-model="newAliasText"
            class="drawer-add-input"
            placeholder="Novo alias... (Enter para adicionar)"
            @keydown.enter.prevent="addNewAlias"
            :disabled="adding"
          />
        </div>
        <Button
          icon="pi pi-plus"
          size="small"
          :loading="adding"
          :disabled="!newAliasText.trim()"
          @click="addNewAlias"
        />
      </div>

      <!-- Error -->
      <div v-if="errorMessage" class="drawer-error">
        <i class="pi pi-exclamation-triangle"></i>
        {{ errorMessage }}
      </div>

      <!-- Aliases list -->
      <div class="drawer-section-label">
        Aliases cadastrados <span class="drawer-section-count">({{ aliases.length }})</span>
      </div>

      <div v-if="loadingAliases" class="drawer-loading">
        <Skeleton v-for="i in 6" :key="i" height="38px" style="border-radius:8px;margin-bottom:5px" />
      </div>

      <div v-else-if="aliases.length === 0" class="drawer-empty">
        <i class="pi pi-inbox" style="font-size:24px;color:#cbd5e1"></i>
        <span>Nenhum alias cadastrado.</span>
        <span style="font-size:11px;color:var(--text-muted)">Adicione aliases para reconhecimento automático.</span>
      </div>

      <div v-else class="drawer-alias-list">
        <div
          v-for="alias in aliases"
          :key="alias.id"
          class="drawer-alias-item"
          :class="{
            'drawer-alias-item--editing': editingId === alias.id,
            'drawer-alias-item--default': alias.isDefault
          }"
        >
          <template v-if="editingId === alias.id">
            <input
              v-model="editingText"
              class="drawer-alias-edit-input"
              @keydown.enter.prevent="saveEdit(alias)"
              @keydown.escape="cancelEdit"
            />
            <div class="drawer-alias-actions">
              <Button icon="pi pi-check" text rounded size="small" severity="success" @click="saveEdit(alias)" :loading="saving" />
              <Button icon="pi pi-times" text rounded size="small" severity="secondary" @click="cancelEdit" />
            </div>
          </template>
          <template v-else-if="alias.isDefault">
            <i class="pi pi-lock drawer-alias-lock" v-tooltip.top="'Este é o alias padrão do LinkHub e não pode ser alterado.'"></i>
            <span class="drawer-alias-text">{{ alias.alias }}</span>
            <span class="drawer-alias-default-badge">Sistema</span>
          </template>
          <template v-else>
            <span class="drawer-alias-text">{{ alias.alias }}</span>
            <span class="drawer-alias-normalized">{{ alias.normalizedAlias }}</span>
            <div class="drawer-alias-actions">
              <Button icon="pi pi-pencil" text rounded size="small" severity="secondary" @click="startEdit(alias)" />
              <Button icon="pi pi-trash" text rounded size="small" severity="danger" @click="confirmDelete(alias)" :loading="deletingId === alias.id" />
            </div>
          </template>
        </div>
      </div>

      <!-- History -->
      <div class="drawer-section-label" style="margin-top:20px">Histórico de alterações</div>
      <div class="drawer-history">
        <div v-for="entry in history" :key="entry.id" class="drawer-history-item">
          <div class="drawer-history-dot"></div>
          <div class="drawer-history-body">
            <span class="drawer-history-text">{{ entry.text }}</span>
            <span class="drawer-history-date">{{ entry.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="drawer-footer">
        <Button label="Cancelar" severity="secondary" outlined @click="visible = false" />
        <Button label="Salvar" icon="pi pi-check" @click="visible = false" />
      </div>
    </template>
  </Drawer>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Tooltip from 'primevue/tooltip'
import {
  fetchAliasesForField,
  addAlias,
  updateAlias,
  deleteAlias,
  FIELD_TYPES
} from '../../mocks/importFieldsMock.js'

const vTooltip = Tooltip

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  field: { type: Object, default: null },
  canGoPrev: { type: Boolean, default: false },
  canGoNext: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'updated', 'navigate'])

const toast = useToast()

const visible = ref(props.modelValue)
const aliases = ref([])
const loadingAliases = ref(false)
const newAliasText = ref('')
const adding = ref(false)
const errorMessage = ref('')
const editingId = ref(null)
const editingText = ref('')
const saving = ref(false)
const deletingId = ref(null)

const fieldTypeLabel = computed(() => {
  if (!props.field) return ''
  return FIELD_TYPES[props.field.type] || props.field.type
})

const history = computed(() => {
  if (!props.field) return []
  // Simulated history entries
  return [
    { id: 1, text: `Alias adicionado por Vitor Hugo`, date: '10/07/2025 14:32' },
    { id: 2, text: `3 aliases importados automaticamente`, date: '15/01/2025 10:00' },
    { id: 3, text: `Campo criado na carga inicial`, date: '15/01/2025 09:45' },
  ]
})

watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))

watch(() => props.field, async (newField) => {
  if (newField && visible.value) {
    resetState()
    await loadAliases()
  }
}, { immediate: true })

watch(visible, async (v) => {
  if (v && props.field) {
    resetState()
    await loadAliases()
  }
})

function resetState() {
  aliases.value = []
  errorMessage.value = ''
  newAliasText.value = ''
  editingId.value = null
  editingText.value = ''
}

async function loadAliases() {
  if (!props.field) return
  loadingAliases.value = true
  errorMessage.value = ''
  try {
    const data = await fetchAliasesForField(props.field.id)
    // Default alias always first
    aliases.value = data.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os aliases.', life: 4000 })
  } finally {
    loadingAliases.value = false
  }
}

async function addNewAlias() {
  if (!newAliasText.value.trim() || !props.field) return
  adding.value = true
  errorMessage.value = ''
  try {
    const newAlias = await addAlias(props.field.id, newAliasText.value)
    aliases.value.push(newAlias)
    newAliasText.value = ''
    toast.add({ severity: 'success', summary: 'Alias adicionado', detail: `"${newAlias.alias}" adicionado.`, life: 3000 })
    emit('updated')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    adding.value = false
  }
}

function startEdit(alias) {
  editingId.value = alias.id
  editingText.value = alias.alias
}

function cancelEdit() {
  editingId.value = null
  editingText.value = ''
}

async function saveEdit(alias) {
  if (!editingText.value.trim()) return
  saving.value = true
  errorMessage.value = ''
  try {
    const updated = await updateAlias(alias.id, editingText.value)
    const idx = aliases.value.findIndex(a => a.id === alias.id)
    if (idx !== -1) aliases.value[idx] = updated
    editingId.value = null
    editingText.value = ''
    toast.add({ severity: 'success', summary: 'Atualizado', detail: 'Alias salvo.', life: 3000 })
    emit('updated')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    saving.value = false
  }
}

async function confirmDelete(alias) {
  deletingId.value = alias.id
  errorMessage.value = ''
  try {
    await deleteAlias(alias.id)
    aliases.value = aliases.value.filter(a => a.id !== alias.id)
    toast.add({ severity: 'success', summary: 'Removido', detail: `"${alias.alias}" removido.`, life: 3000 })
    emit('updated')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    deletingId.value = null
  }
}
</script>

<style scoped>
/* ── Drawer Header ────────────────────────────────────────────────────── */
.drawer-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawer-nav {
  display: flex;
  gap: 4px;
}

.drawer-nav-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: #fff;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.drawer-nav-btn:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #3b82f6;
}

.drawer-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.drawer-nav-btn i {
  font-size: 12px;
}

.drawer-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

/* ── Drawer Content ───────────────────────────────────────────────────── */
.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.drawer-field-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #eff6ff;
  border-radius: 10px;
  border: 1px solid #bfdbfe;
  margin-bottom: 20px;
}

.drawer-field-info__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.drawer-field-info__body {
  flex: 1;
  min-width: 0;
}

.drawer-field-info__name {
  font-size: 15px;
  font-weight: 700;
  color: #1e40af;
}

.drawer-field-info__meta {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.drawer-meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: #fff;
  border: 1px solid #bfdbfe;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  color: #3b82f6;
}

/* ── Sections ─────────────────────────────────────────────────────────── */
.drawer-section-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 8px;
}

.drawer-section-count {
  font-weight: 500;
  color: var(--text-secondary);
}

/* ── Add alias ────────────────────────────────────────────────────────── */
.drawer-add-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}

.drawer-add-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0 12px;
  height: 38px;
  transition: border-color 0.15s;
}

.drawer-add-input-wrap:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.drawer-add-icon {
  font-size: 14px;
  color: #94a3b8;
}

.drawer-add-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: var(--text-primary);
}

/* ── Error ────────────────────────────────────────────────────────────── */
.drawer-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #dc2626;
}

/* ── Alias list ───────────────────────────────────────────────────────── */
.drawer-loading {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.drawer-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 28px;
  color: var(--text-muted);
  font-size: 13px;
}

.drawer-alias-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 280px;
  overflow-y: auto;
}

.drawer-alias-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  background: #fff;
  transition: all 0.15s;
}

.drawer-alias-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.drawer-alias-item--editing {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.drawer-alias-item--default {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.drawer-alias-lock {
  font-size: 12px;
  color: #94a3b8;
  flex-shrink: 0;
}

.drawer-alias-default-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
  margin-left: auto;
}

.drawer-alias-text {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.drawer-alias-normalized {
  font-size: 10px;
  color: var(--text-muted);
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.drawer-alias-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.drawer-alias-edit-input {
  flex: 1;
  border: 1px solid #3b82f6;
  outline: none;
  background: #fff;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: var(--text-primary);
  padding: 6px 10px;
  border-radius: 6px;
}

/* ── History ──────────────────────────────────────────────────────────── */
.drawer-history {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.drawer-history-item {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  position: relative;
}

.drawer-history-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 22px;
  bottom: -4px;
  width: 1px;
  background: #e2e8f0;
}

.drawer-history-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #e2e8f0;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #e2e8f0;
  flex-shrink: 0;
  margin-top: 3px;
}

.drawer-history-item:first-child .drawer-history-dot {
  background: #3b82f6;
  box-shadow: 0 0 0 1px #bfdbfe;
}

.drawer-history-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.drawer-history-text {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 500;
}

.drawer-history-date {
  font-size: 11px;
  color: var(--text-muted);
}

/* ── Footer ───────────────────────────────────────────────────────────── */
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
