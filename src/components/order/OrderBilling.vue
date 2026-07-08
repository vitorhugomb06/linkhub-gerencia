<template>
  <div class="order-section" style="margin-bottom:16px">
    <div class="section-header">
      <i class="pi pi-file" style="color:#3b82f6"></i>
      <span class="section-title">DADOS DE FATURAMENTO</span>
    </div>
    <div class="section-body">
      <div class="billing-row">

        <div class="info-field">
          <span class="info-label">Data de Faturamento</span>
          <span class="info-value">{{ billing.invoiceDate || '–' }}</span>
        </div>

        <div class="info-field">
          <span class="info-label">Filial</span>
          <span class="info-value">{{ billing.branch || '–' }}</span>
        </div>

        <div class="info-field">
          <span class="info-label">Núm. Nota Fiscal</span>
          <span class="info-value">{{ billing.invoiceNumber || '–' }}</span>
        </div>

        <div class="info-field nf-key-field">
          <span class="info-label">Chave da Nota Fiscal</span>
          <template v-if="billing.invoiceKey">
            <a
              :href="nfUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="nf-link"
              :title="'Consultar NF-e: ' + billing.invoiceKey"
            >
              <i class="pi pi-external-link" style="font-size:10px;flex-shrink:0;margin-top:1px"></i>
              <span class="key-value">{{ billing.invoiceKey }}</span>
            </a>
          </template>
          <span v-else class="info-value">–</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  billing: { type: Object, default: () => ({}) }
})

const nfUrl = computed(() => {
  const key = props.billing?.invoiceKey
  if (!key) return '#'
  return `https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=completa&tipoConteudo=XbSeqxE8pl8=&nfe=${key}`
})
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

.section-body {
  padding: 20px 24px;
}

/* Todos os campos em uma única linha horizontal */
.billing-row {
  display: grid;
  grid-template-columns: 160px 200px 160px 1fr;
  gap: 24px;
  align-items: start;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.info-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;
}

.info-value {
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
}

/* Chave NF — link clicável */
.nf-link {
  display: inline-flex;
  align-items: flex-start;
  gap: 5px;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.15s;
}

.nf-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.key-value {
  font-size: 11px;
  font-family: 'Courier New', monospace;
  word-break: break-all;
  line-height: 1.4;
  color: inherit;
}
</style>
