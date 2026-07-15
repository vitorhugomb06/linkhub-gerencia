<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Colunas não reconhecidas"
    :style="{ width: '540px' }"
    :closable="true"
    :draggable="false"
  >
    <!-- Info banner -->
    <div class="uc-info-banner">
      <i class="pi pi-exclamation-triangle" style="color:#f59e0b;font-size:18px;flex-shrink:0"></i>
      <div style="font-size:12px;color:#92400e">
        As colunas abaixo não foram reconhecidas automaticamente.
        Selecione para qual campo interno cada uma corresponde.
      </div>
    </div>

    <!-- Unresolved columns list -->
    <div class="uc-list">
      <div v-for="(col, idx) in unresolvedItems" :key="idx" class="uc-item">
        <div class="uc-item-header">
          <span class="uc-item-col-name">"{{ col.header }}"</span>
          <i class="pi pi-arrow-right" style="color:#94a3b8;font-size:12px"></i>
          <Select
            v-model="col.selectedFieldId"
            :options="fieldOptions"
            optionLabel="label"
            optionValue="value"
            optionGroupLabel="label"
            optionGroupChildren="items"
            placeholder="Selecione o campo..."
            class="uc-field-select"
            :filter="true"
            filterPlaceholder="Buscar campo..."
          />
        </div>
        <div v-if="col.selectedFieldId" class="uc-save-row">
          <Checkbox v-model="col.saveAlias" :binary="true" inputId="save-alias-check" />
          <label for="save-alias-check" class="uc-save-label">
            Salvar esse mapeamento para futuras importações?
          </label>
        </div>
      </div>
    </div>

    <template #footer>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <Button label="Ignorar colunas" severity="secondary" outlined @click="visible = false" />
        <Button
          label="Confirmar Mapeamento"
          icon="pi pi-check"
          :loading="saving"
          :disabled="!hasAllMapped"
          @click="confirmMapping"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import { fetchImportFields, addAlias } from '../../mocks/importFieldsMock.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  columns: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'resolved'])

const toast = useToast()
const visible = ref(props.modelValue)
const unresolvedItems = ref([])
const fieldOptions = ref([])
const saving = ref(false)

watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))

watch(() => props.columns, (cols) => {
  unresolvedItems.value = cols.map(header => ({
    header,
    selectedFieldId: null,
    saveAlias: true
  }))
}, { immediate: true })

watch(visible, async (v) => {
  if (v) {
    await loadFieldOptions()
  }
})

const hasAllMapped = computed(() => {
  return unresolvedItems.value.every(item => item.selectedFieldId != null)
})

async function loadFieldOptions() {
  try {
    const result = await fetchImportFields({ perPage: 100 })
    // Group by group
    const grouped = {}
    for (const field of result.data) {
      if (!grouped[field.group]) grouped[field.group] = []
      grouped[field.group].push({ label: `${field.name} (${field.key})`, value: field.id })
    }
    fieldOptions.value = Object.entries(grouped).map(([group, items]) => ({
      label: group,
      items
    }))
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os campos.', life: 4000 })
  }
}

async function confirmMapping() {
  saving.value = true
  const results = []

  try {
    for (const item of unresolvedItems.value) {
      if (item.saveAlias && item.selectedFieldId) {
        try {
          await addAlias(item.selectedFieldId, item.header)
        } catch {
          // Alias already exists or error — skip silently
        }
      }
      results.push({ header: item.header, fieldId: item.selectedFieldId })
    }

    toast.add({
      severity: 'success',
      summary: 'Mapeamento concluído',
      detail: `${results.length} coluna(s) mapeada(s) com sucesso.`,
      life: 4000
    })

    emit('resolved', results)
    visible.value = false
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao salvar os mapeamentos.', life: 4000 })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.uc-info-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  margin-bottom: 16px;
}

.uc-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 360px;
  overflow-y: auto;
}

.uc-item {
  padding: 12px;
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.uc-item-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.uc-item-col-name {
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
  white-space: nowrap;
}

.uc-field-select {
  flex: 1;
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
}

.uc-save-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
}

.uc-save-label {
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}
</style>
