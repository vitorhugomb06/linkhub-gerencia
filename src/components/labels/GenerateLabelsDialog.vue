<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="'Gerar Etiquetas'"
    :style="{ width: '480px' }"
    :closable="true"
    :draggable="false"
  >
    <div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;align-items:center;gap:12px;padding:16px;background:#eff6ff;border-radius:10px;border:1px solid #bfdbfe">
        <div style="width:48px;height:48px;border-radius:50%;background:#3b82f6;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i class="pi pi-tag" style="color:#fff;font-size:20px"></i>
        </div>
        <div>
          <div style="font-size:14px;font-weight:600;color:#1e40af">Confirmar Geração de Etiquetas</div>
          <div style="font-size:12px;color:#3b82f6;margin-top:2px">
            Esta ação irá gerar etiquetas para os pedidos selecionados.
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="padding:12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:#3b82f6">{{ count }}</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px">Pedidos Selecionados</div>
        </div>
        <div style="padding:12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;text-align:center">
          <div style="font-size:24px;font-weight:700;color:#10b981">{{ carrier }}</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px">Transportadora</div>
        </div>
      </div>

      <div style="padding:12px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;display:flex;gap:8px;align-items:flex-start">
        <i class="pi pi-exclamation-triangle" style="color:#f59e0b;margin-top:1px;flex-shrink:0"></i>
        <div style="font-size:12px;color:#92400e">
          Após a geração, os pedidos serão movidos para a aba <strong>"Prontos para Impressão"</strong> e não poderão ser desfeitos.
        </div>
      </div>
    </div>

    <template #footer>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <Button label="Cancelar" severity="secondary" outlined @click="visible = false" />
        <Button
          label="Gerar Etiquetas"
          icon="pi pi-tag"
          :loading="generating"
          @click="confirm"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  count: { type: Number, default: 0 },
  carrier: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)
const generating = ref(false)

watch(() => props.modelValue, v => { visible.value = v })
watch(visible, v => emit('update:modelValue', v))

async function confirm() {
  generating.value = true
  await new Promise(r => setTimeout(r, 1500))
  generating.value = false
  visible.value = false
  emit('confirm')
}
</script>
