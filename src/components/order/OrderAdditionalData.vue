<template>
  <div class="order-section" style="margin-bottom:16px">
    <!-- Header clicável para expandir/fechar -->
    <div class="section-header clickable" @click="collapsed = !collapsed">
      <i class="pi pi-info-circle" style="color:#3b82f6"></i>
      <span class="section-title">DADOS ADICIONAIS</span>
      <div style="flex:1"></div>
      <i
        :class="collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'"
        style="font-size:12px;color:#94a3b8;transition:transform 0.2s"
      ></i>
    </div>

    <div v-if="!collapsed">
      <div class="section-body">
        <div v-if="fields && fields.length > 0" class="additional-list">
          <div v-for="field in fields" :key="field.key" class="additional-row">
            <span class="field-key">{{ field.key }}</span>
            <span class="field-eq">=</span>
            <span class="field-value">{{ field.value }}</span>
          </div>
        </div>
        <div v-else class="empty-state-small">
          <span>Nenhum dado adicional disponível.</span>
        </div>
      </div>

      <!-- Footer: Impresso em -->
      <div v-if="viewedBy" class="printed-footer">
        <i class="pi pi-print" style="font-size:11px;margin-right:5px;color:#94a3b8"></i>
        Impresso em <strong>{{ viewedBy.date }}</strong> por <strong>{{ viewedBy.user }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  fields:   { type: Array,  default: () => [] },
  viewedBy: { type: Object, default: null }
})

const collapsed = ref(false)
</script>

<style scoped>
.order-section {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.section-header.clickable {
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.section-header.clickable:hover {
  background: #f1f5f9;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-body {
  padding: 16px 24px;
}

/* Um campo por linha: key = value */
.additional-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.additional-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;
  font-size: 12px;
  line-height: 1.5;
}

.additional-row:last-child {
  border-bottom: none;
}

.field-key {
  color: #475569;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 220px;
}

.field-eq {
  color: #94a3b8;
  font-weight: 400;
  flex-shrink: 0;
}

.field-value {
  color: #1e293b;
  word-break: break-word;
  flex: 1;
}

.empty-state-small {
  padding: 8px 0;
  font-size: 12px;
  color: #94a3b8;
}

/* Footer */
.printed-footer {
  padding: 11px 24px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
  font-size: 12px;
  color: #64748b;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
