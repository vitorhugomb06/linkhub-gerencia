<template>
  <div class="order-section" style="margin-bottom:16px">
    <div class="section-header">
      <i class="pi pi-truck" style="color:#3b82f6"></i>
      <span class="section-title">ACOMPANHAMENTO DO PEDIDO</span>
      <div style="flex:1"></div>
      <Button
        :icon="collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'"
        text rounded size="small" severity="secondary"
        @click="collapsed = !collapsed"
      />
    </div>

    <div v-if="!collapsed" class="split-body">

      <!-- LEFT: Dados da Transportadora -->
      <div class="carrier-side">
        <div class="sub-header">
          <i class="pi pi-truck" style="color:#3b82f6;font-size:13px"></i>
          <span class="sub-title">DADOS DA TRANSPORTADORA</span>
        </div>
        <div class="carrier-grid">
          <div class="info-field">
            <span class="info-label">Empresa de Transporte</span>
            <span class="info-value">{{ shipping.company || '–' }}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Entregar até o dia</span>
            <span class="info-value">{{ shipping.deliverBy || '–' }}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Prazo de Entrega</span>
            <span class="info-value">{{ shipping.deliveryDays ? shipping.deliveryDays + ' dias' : '–' }}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Transportadora</span>
            <span class="info-value">{{ freight.carrier || '–' }}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Simulação</span>
            <span class="info-value">{{ freight.simulation || '–' }}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Tipo de Cálculo</span>
            <span class="info-value">{{ freight.calcType || '–' }}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Código de Escolha</span>
            <span class="info-value">{{ freight.choiceCode || '–' }}</span>
          </div>
          <div class="info-field">
            <span class="info-label">Protocolo</span>
            <span class="info-value">{{ freight.protocol || '–' }}</span>
          </div>
        </div>
      </div>

      <!-- Divider vertical -->
      <div class="v-sep"></div>

      <!-- RIGHT: Tracking do pedido -->
      <div class="tracking-side">
        <div class="sub-header">
          <i class="pi pi-map-marker" style="color:#3b82f6;font-size:13px"></i>
          <span class="sub-title">TRACKING DO PEDIDO</span>
        </div>

        <div v-if="tracking && tracking.length > 0" class="tracking-scroll">
          <div
            v-for="(event, idx) in tracking"
            :key="idx"
            class="tracking-event"
            :class="{ first: idx === 0 }"
          >
            <div class="tracking-dot-col">
              <div class="tracking-dot" :class="{ active: idx === 0 }"></div>
              <div v-if="idx < tracking.length - 1" class="tracking-line"></div>
            </div>
            <div class="tracking-content">
              <div class="tracking-status">{{ event.status }}</div>
              <div class="tracking-datetime">{{ event.date }} {{ event.time }}</div>
              <div v-if="event.location" class="tracking-location">
                <i class="pi pi-map-marker" style="font-size:10px;margin-right:3px"></i>{{ event.location }}
              </div>
              <div v-if="event.description" class="tracking-desc">{{ event.description }}</div>
            </div>
          </div>
        </div>

        <div v-else class="tracking-empty">
          <i class="pi pi-map-marker" style="font-size:28px;color:#e2e8f0;margin-bottom:8px"></i>
          <span>Nenhum evento de tracking disponível.</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'

defineProps({
  shipping: { type: Object, default: () => ({}) },
  freight:  { type: Object, default: () => ({}) },
  tracking: { type: Array,  default: () => [] },
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

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Split layout */
.split-body {
  display: flex;
  align-items: stretch;
  min-height: 200px;
}

.carrier-side {
  flex: 1;
  padding: 20px 24px;
  min-width: 0;
}

.v-sep {
  width: 1px;
  background: #e2e8f0;
  flex-shrink: 0;
}

.tracking-side {
  flex: 1;
  padding: 20px 24px;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* Sub headers */
.sub-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
}

.sub-title {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Carrier grid */
.carrier-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.info-value {
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
}

/* Tracking scroll — max 5 events visible, then scroll */
.tracking-scroll {
  flex: 1;
  max-height: 260px;
  overflow-y: auto;
  padding-right: 4px;
}

.tracking-scroll::-webkit-scrollbar { width: 4px; }
.tracking-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

.tracking-event {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
}

.tracking-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 14px;
}

.tracking-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cbd5e1;
  border: 2px solid #e2e8f0;
  flex-shrink: 0;
  margin-top: 2px;
}

.tracking-dot.active {
  background: #3b82f6;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}

.tracking-line {
  width: 2px;
  flex: 1;
  background: #e2e8f0;
  margin-top: 4px;
  min-height: 16px;
}

.tracking-content {
  flex: 1;
  min-width: 0;
  padding-bottom: 4px;
}

.tracking-status {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.tracking-datetime {
  font-size: 11px;
  color: #3b82f6;
  margin-top: 2px;
  font-weight: 500;
}

.tracking-location {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
  display: flex;
  align-items: center;
}

.tracking-desc {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
  line-height: 1.4;
}

.tracking-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 12px;
  min-height: 120px;
}
</style>
