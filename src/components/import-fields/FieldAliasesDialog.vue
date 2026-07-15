<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="`Aliases — ${field?.name || ''}`"
    :style="{ width: '560px' }"
    :closable="true"
    :draggable="false"
  >
    <!-- Field info banner -->
    <div class="alias-dialog-info">
      <div class="alias-dialog-info__icon">
        <i class="pi pi-link" style="color:#fff;font-size:18px"></i>
      </div>
      <div>
        <div class="alias-dialog-info__title">{{ field?.name }}</div>
        <div class="alias-dialog-info__meta">
          <span>Campo interno: <strong>{{ field?.key }}</strong></span>
          <span>•</span>
          <span>Tipo: <strong>{{ fieldTypeLabel }}</strong></span>
          <span>•</span>
          <span>Grupo: <strong>{{ field?.group }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Add alias -->
    <div class="alias-add-row">
      <div class="alias-add-input-wrap">
        <i class="pi pi-plus-circle alias-add-icon"></i>
        <input
          v-model="newAliasText"
          class="alias-add-input"
          placeholder="Digite um novo alias e pressione Enter..."
          @keydown.enter.prevent="addNewAlias"
          :disabled="adding"
        />
      </div>
      <Button
        label="Adicionar"
        icon="pi pi-plus"
        size="small"
        :loading="adding"
        :disabled="!newAliasText.trim()"
        @click="addNewAlias"
      />
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="alias-error">
      <i class="pi pi-exclamation-triangle"></i>
      {{ errorMessage }}
    </div>

    <!-- Aliases list -->
    <div class="alias-list-header">
      <span>Aliases cadastrados ({{ aliases.length }})</span>
    </div>

    <div v-if="loadingAliases" class="alias-loading">
      <Skeleton v-for="i in 5" :key="i" height="40px" style="border-radius:8px;margin-bottom:6px" />
    </div>

    <div v-else-if="aliases.length === 0" class="alias-empty">
      <i class="pi pi-info-circle" style="font-size:20px;color:#93c5fd"></i>
      <span>Nenhum alias cadastrado para este campo.</span>
    </div>

    <div v-else class="alias-list">
      <div
        v-for="alias in aliases"
        :key="alias.id"
        class="alias-item"
        :class="{ 'alias-item--editing': editingId === alias.id }"
      >
        <template v-if="editingId === alias.id">
          <input
            v-model="editingText"
            class="alias-edit-input"
            @keydown.enter.prevent="saveEdit(alias)"
            @keydown.escape="cancelEdit"
            ref="editInput"
          />
          <div class="alias-item-actions">
            <Button icon="pi pi-check" text rounded size="small" severity="success" @click="saveEdit(alias)" :loading="saving" />
            <Button icon="pi pi-times" text rounded size="small" severity="secondary" @click="cancelEdit" />
          </div>
        </template>
        <template v-else>
          <span class="alias-item-text">{{ alias.alias }}</span>
          <span class="alias-item-normalized" v-tooltip.top="'Valor normalizado para comparação'">{{ alias.normalizedAlias }}</span>
          <div class="alias-item-actions">
            <Button icon="pi pi-pencil" text rounded size="small" severity="secondary" @click="startEdit(alias)" />
            <Button icon="pi pi-trash" text rounded size="small" severity="danger" @click="confirmDelete(alias)" :loading="deletingId === alias.id" />
          </div>
        </template>
      </div>
    </div>

    <template #footer>
      <div style="display:flex;justify-content:flex-end">
        <Button label="Fechar" severity="secondary" outlined @click="visible = false" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
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
  field: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'updated'])

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

watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))

watch(() => props.field, async (newField) => {
  if (newField && visible.value) {
    await loadAliases()
  }
}, { immediate: true })

watch(visible, async (v) => {
  if (v && props.field) {
    await loadAliases()
  } else {
    aliases.value = []
    errorMessage.value = ''
    newAliasText.value = ''
    editingId.value = null
  }
})

async function loadAliases() {
  if (!props.field) return
  loadingAliases.value = true
  errorMessage.value = ''
  try {
    aliases.value = await fetchAliasesForField(props.field.id)
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
    toast.add({ severity: 'success', summary: 'Alias adicionado', detail: `"${newAlias.alias}" adicionado com sucesso.`, life: 3000 })
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
  nextTick(() => {
    // Focus the edit input
  })
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
    toast.add({ severity: 'success', summary: 'Alias atualizado', detail: 'Alias salvo com sucesso.', life: 3000 })
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
    toast.add({ severity: 'success', summary: 'Removido', detail: `Alias "${alias.alias}" removido.`, life: 3000 })
    emit('updated')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    deletingId.value = null
  }
}
</script>

<style scoped>
.alias-dialog-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #eff6ff;
  border-radius: 10px;
  border: 1px solid #bfdbfe;
  margin-bottom: 16px;
}

.alias-dialog-info__icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alias-dialog-info__title {
  font-size: 14px;
  font-weight: 600;
  color: #1e40af;
}

.alias-dialog-info__meta {
  font-size: 11px;
  color: #3b82f6;
  margin-top: 3px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.alias-add-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.alias-add-input-wrap {
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

.alias-add-input-wrap:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px #bfdbfe;
}

.alias-add-icon {
  font-size: 14px;
  color: #94a3b8;
}

.alias-add-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  color: var(--text-primary);
}

.alias-error {
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

.alias-list-header {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 8px;
  padding: 0 4px;
}

.alias-loading {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alias-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px;
  color: var(--text-muted);
  font-size: 13px;
}

.alias-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 320px;
  overflow-y: auto;
}

.alias-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  background: #fff;
  transition: all 0.15s;
}

.alias-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.alias-item--editing {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.alias-item-text {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.alias-item-normalized {
  font-size: 10px;
  color: var(--text-muted);
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.alias-item-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.alias-edit-input {
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
</style>
