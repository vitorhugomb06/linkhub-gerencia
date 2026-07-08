<template>
  <div class="two-col-section" style="margin-bottom:16px">
    <!-- Dados da Transportadora -->
    <div class="order-section" style="flex:1">
      <div class="section-header">
        <i class="pi pi-truck" style="color:#3b82f6"></i>
        <span class="section-title">DADOS DA TRANSPORTADORA</span>
      </div>
      <div class="section-body">
        <div class="info-grid">
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
        </div>
      </div>
    </div>

    <!-- Dados de Retorno da Simulação de Frete -->
    <div class="order-section" style="flex:1">
      <div class="section-header">
        <i class="pi pi-calculator" style="color:#3b82f6"></i>
        <span class="section-title">DADOS DE RETORNO DA SIMULAÇÃO DE FRETE</span>
      </div>
      <div class="section-body">
        <div class="info-grid" style="grid-template-columns:1fr 1fr">
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
    </div>
  </div>
</template>

<script setup>
defineProps({
  shipping: { type: Object, default: () => ({}) },
  freight: { type: Object, default: () => ({}) }
})
</script>

<style scoped>
.two-col-section {
  display: flex;
  gap: 16px;
}

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

.section-body {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
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
</style>
