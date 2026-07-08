<template>
  <div
    class="logistic-item"
    :class="{ 'logistic-item--inactive': isInactive }"
  >
    <!-- ── Linha superior: chevron · nome+ID · status · switch ─────────── -->
    <div class="logistic-item__top" @click="toggleExpand">
      <div class="logistic-item__chevron">
        <i
          class="pi"
          :class="expanded ? 'pi-chevron-up' : 'pi-chevron-down'"
        ></i>
      </div>

      <div class="logistic-item__info">
        <span class="logistic-item__name">{{ logistic.name }}</span>
        <span class="logistic-item__id">ID: {{ logistic.id }}</span>
      </div>

      <Tag
        :value="logistic.status"
        :severity="logistic.status === 'Ativo' ? 'success' : 'secondary'"
        class="logistic-item__tag"
      />

      <div
        class="logistic-item__switch-wrap"
        v-tooltip.top="isInactive ? tooltipText : undefined"
        @click.stop
      >
        <InputSwitch
          v-model="localEnabled"
          :disabled="isInactive || saving"
          @update:modelValue="onToggle"
        />
      </div>
    </div>

    <!-- ── Grade de campos (sempre visível) ────────────────────────────── -->
    <div class="logistic-item__fields">
      <div class="logistic-field">
        <span class="logistic-field__label">Altura</span>
        <span class="logistic-field__value">{{ formatCm(logistic.height) }}</span>
      </div>
      <div class="logistic-field">
        <span class="logistic-field__label">Largura</span>
        <span class="logistic-field__value">{{ formatCm(logistic.width) }}</span>
      </div>
      <div class="logistic-field">
        <span class="logistic-field__label">Profundidade</span>
        <span class="logistic-field__value">{{ formatCm(logistic.depth) }}</span>
      </div>
      <div class="logistic-field">
        <span class="logistic-field__label">Cubagem Máx.</span>
        <span class="logistic-field__value">{{ formatCm(logistic.maxCubicVolume) }}</span>
      </div>
      <div class="logistic-field">
        <span class="logistic-field__label">Peso Mín.</span>
        <span class="logistic-field__value">{{ formatWeight(logistic.minWeight) }}</span>
      </div>
      <div class="logistic-field">
        <span class="logistic-field__label">Peso Máx.</span>
        <span class="logistic-field__value">{{ formatWeight(logistic.maxWeight) }}</span>
      </div>
      <div class="logistic-field">
        <span class="logistic-field__label">Vol. Mín.</span>
        <span class="logistic-field__value">{{ formatPlain(logistic.minVolume) }}</span>
      </div>
      <div class="logistic-field">
        <span class="logistic-field__label">Vol. Máx.</span>
        <span class="logistic-field__value">{{ formatPlain(logistic.maxVolume) }}</span>
      </div>
    </div>

    <!-- ── Expandido: somente Descrição ────────────────────────────────── -->
    <Transition name="logistic-expand">
      <div v-if="expanded" class="logistic-item__detail">
        <Divider style="margin:0 0 10px 0" />
        <div class="logistic-field logistic-field--desc">
          <span class="logistic-field__label">Descrição</span>
          <span class="logistic-field__value logistic-field__value--desc">
            {{ logistic.description || '—' }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Tag from 'primevue/tag'
import InputSwitch from 'primevue/inputswitch'
import Divider from 'primevue/divider'

const props = defineProps({
  logistic: { type: Object, required: true },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle'])

const expanded = ref(false)
const localEnabled = ref(props.logistic.enabled)

const isInactive = computed(() => props.logistic.status === 'Inativo')
const tooltipText = 'Esta logística está inativa no marketplace e não pode ser configurada.'

watch(() => props.logistic.enabled, val => { localEnabled.value = val })

function toggleExpand() { expanded.value = !expanded.value }

function onToggle(val) {
  if (isInactive.value) return
  emit('toggle', { logisticId: props.logistic.id, enabled: val })
}

// mm → cm
function formatCm(val) {
  if (val === null || val === undefined || val === 0) return '—'
  return `${parseFloat((val / 10).toFixed(2))} cm`
}

function formatWeight(val) {
  if (val === null || val === undefined) return '—'
  return `${val} kg`
}

function formatPlain(val) {
  if (val === null || val === undefined) return '—'
  return `${val}`
}
</script>

<style scoped>
/* ── Card ───────────────────────────────────────────────────────────────── */
.logistic-item {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  margin-bottom: 10px;
  transition: box-shadow 0.2s;
  overflow: hidden;
}

.logistic-item:hover {
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
}

.logistic-item--inactive {
  opacity: 0.55;
}

/* ── Linha superior ─────────────────────────────────────────────────────── */
.logistic-item__top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px 10px;
  cursor: pointer;
  user-select: none;
}

.logistic-item__chevron {
  flex-shrink: 0;
  width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
}

.logistic-item__info {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.logistic-item__name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logistic-item__id {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.logistic-item__tag {
  flex-shrink: 0;
}

.logistic-item__switch-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-left: 4px;
}

/* ── Grade de campos ────────────────────────────────────────────────────── */
.logistic-item__fields {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0;
  padding: 0 18px 14px;
  border-top: 1px solid #f1f5f9;
  margin-top: 2px;
}

.logistic-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px 10px 0;
}

.logistic-field + .logistic-field {
  padding-left: 12px;
  border-left: 1px solid #f1f5f9;
}

.logistic-field__label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.logistic-field__value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

/* ── Expandido: descrição ────────────────────────────────────────────────── */
.logistic-item__detail {
  padding: 0 18px 16px;
}

.logistic-field--desc {
  padding: 0;
  border-left: none;
}

.logistic-field__value--desc {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);
  white-space: pre-wrap;
  line-height: 1.6;
}

/* ── Responsivo ─────────────────────────────────────────────────────────── */
@media (max-width: 1100px) {
  .logistic-item__fields {
    grid-template-columns: repeat(4, 1fr);
  }
  .logistic-field:nth-child(4n+1) {
    border-left: none;
    padding-left: 0;
  }
}

@media (max-width: 700px) {
  .logistic-item__fields {
    grid-template-columns: repeat(2, 1fr);
  }
  .logistic-field:nth-child(2n+1) {
    border-left: none;
    padding-left: 0;
  }
}

/* ── Transição expand ───────────────────────────────────────────────────── */
.logistic-expand-enter-active,
.logistic-expand-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.logistic-expand-enter-from,
.logistic-expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
