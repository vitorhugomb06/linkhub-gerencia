<template>
  <div class="order-section">
    <div class="section-header">
      <i class="pi pi-user" style="color:#3b82f6"></i>
      <span class="section-title">INFORMAÇÕES PESSOAIS</span>
    </div>
    <div class="section-body">
      <div class="address-col-header">
        <i class="pi pi-map-marker" style="color:#3b82f6;font-size:14px"></i>
        <span class="address-col-title">ENDEREÇO DE ENTREGA</span>
        <!-- Tags PF/PJ e CPF/CNPJ válido -->
        <div class="header-tags">
          <Tag
            :value="personType"
            :severity="personType === 'PF' ? 'info' : 'secondary'"
            style="font-size:10px;font-weight:700"
          />
          <Tag
            :value="docValidLabel"
            :severity="docValid ? 'success' : 'danger'"
            style="font-size:10px;font-weight:700"
          />
        </div>
      </div>

      <div class="address-fields">

        <!-- 1. Documento -->
        <div class="info-field">
          <span class="info-label">{{ personType === 'PJ' ? 'CNPJ' : 'CPF' }}</span>
          <span class="info-value">{{ formatDoc(shipping.document) || '–' }}</span>
        </div>

        <!-- 2. Nome completo — ocupa 2 colunas -->
        <div class="info-field full-width">
          <span class="info-label">Nome Completo</span>
          <span class="info-value">{{ fullName || '–' }}</span>
        </div>

        <!-- 3. E-mail — ocupa 2 colunas -->
        <div class="info-field full-width">
          <span class="info-label">E-mail</span>
          <span class="info-value">{{ shipping.email || '–' }}</span>
        </div>

        <!-- 4 e 5. Telefones -->
        <div class="info-field">
          <span class="info-label">Telefone 1</span>
          <span class="info-value">{{ shipping.phone || '–' }}</span>
        </div>
        <div class="info-field">
          <span class="info-label">Telefone 2</span>
          <span class="info-value">{{ shipping.phone2 || '–' }}</span>
        </div>

        <!-- 6. CEP -->
        <div class="info-field">
          <span class="info-label">CEP</span>
          <span class="info-value">{{ shipping.zipCode || '–' }}</span>
        </div>

        <!-- 7. Endereço + número -->
        <div class="info-field">
          <span class="info-label">Endereço</span>
          <span class="info-value">{{ streetWithNumber || '–' }}</span>
        </div>

        <!-- 8. Cidade - Estado -->
        <div class="info-field">
          <span class="info-label">Cidade / Estado</span>
          <span class="info-value">{{ cityState || '–' }}</span>
        </div>

        <!-- 9. Bairro -->
        <div class="info-field">
          <span class="info-label">Bairro</span>
          <span class="info-value">{{ shipping.neighborhood || '–' }}</span>
        </div>

        <!-- 10. Complemento -->
        <div class="info-field">
          <span class="info-label">Complemento</span>
          <span class="info-value">{{ shipping.complement || '–' }}</span>
        </div>

        <!-- 11. Responsável pelo recebimento — ocupa 2 colunas -->
        <div class="info-field full-width">
          <span class="info-label">Responsável pelo Recebimento</span>
          <span class="info-value">{{ shipping.receiver || '–' }}</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Tag from 'primevue/tag'

const props = defineProps({
  shipping: { type: Object, default: () => ({}) }
})

// Nome completo
const fullName = computed(() => {
  const parts = [props.shipping.firstName, props.shipping.lastName].filter(Boolean)
  return parts.join(' ') || null
})

// Endereço + número concatenado
const streetWithNumber = computed(() => {
  const parts = [props.shipping.street, props.shipping.number].filter(Boolean)
  return parts.join(', ') || null
})

// Cidade - Estado
const cityState = computed(() => {
  const city  = props.shipping.city
  const state = props.shipping.state
  if (city && state) return `${city} - ${state}`
  return city || state || null
})

// PF ou PJ baseado no tamanho do documento (CPF=11, CNPJ=14)
const personType = computed(() => {
  const doc = (props.shipping.document || '').replace(/\D/g, '')
  return doc.length === 14 ? 'PJ' : 'PF'
})

// Validação CPF
function validateCPF(cpf) {
  cpf = cpf.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i)
  let r = (sum * 10) % 11
  if (r === 10 || r === 11) r = 0
  if (r !== parseInt(cpf[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i)
  r = (sum * 10) % 11
  if (r === 10 || r === 11) r = 0
  return r === parseInt(cpf[10])
}

// Validação CNPJ
function validateCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, '')
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false
  const calc = (c, l) => {
    let s = 0, p = l - 7
    for (let i = l; i >= 1; i--) {
      s += parseInt(c[l - i]) * p--
      if (p < 2) p = 9
    }
    return s % 11 < 2 ? 0 : 11 - (s % 11)
  }
  return calc(cnpj, 12) === parseInt(cnpj[12]) && calc(cnpj, 13) === parseInt(cnpj[13])
}

const docValid = computed(() => {
  const doc = (props.shipping.document || '').replace(/\D/g, '')
  if (!doc) return false
  return doc.length === 14 ? validateCNPJ(doc) : validateCPF(doc)
})

const docValidLabel = computed(() => {
  if (!props.shipping.document) return 'Sem documento'
  return docValid.value
    ? (personType.value === 'PJ' ? 'CNPJ Válido' : 'CPF Válido')
    : (personType.value === 'PJ' ? 'CNPJ Inválido' : 'CPF Inválido')
})

// Formatar documento
function formatDoc(doc) {
  if (!doc) return null
  const d = doc.replace(/\D/g, '')
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  return doc
}
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
  padding: 16px 20px;
}

.address-col-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.address-col-title {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-tags {
  display: flex;
  gap: 6px;
  margin-left: 4px;
}

.address-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
  max-width: 100%;
}

.address-row {
  display: contents; /* os filhos entram direto no grid pai */
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* campos que devem ocupar as 2 colunas */
.info-field.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.info-value {
  font-size: 12px;
  color: #1e293b;
  font-weight: 500;
  word-break: break-word;
  line-height: 1.4;
}
</style>
