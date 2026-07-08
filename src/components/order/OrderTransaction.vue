<template>
  <div style="margin-bottom:16px">

    <!-- Cabeçalho da seção -->
    <div class="payments-section-header">
      <i class="pi pi-credit-card" style="color:#3b82f6"></i>
      <span class="payments-section-title">FORMAS DE PAGAMENTO</span>
      <span class="payments-count-badge">{{ payments.length }} formas de pagamento</span>
    </div>

    <!-- Lista resumida -->
    <div class="payments-list">
      <div
        v-for="(pay, idx) in payments"
        :key="idx"
        class="payment-row"
        :class="{ expanded: openDetail === idx }"
      >
        <!-- Coluna: Logo + nome + status -->
        <div class="col-brand">
          <div class="brand-logo">
            <i class="pi pi-credit-card" style="font-size:18px;color:#3b82f6"></i>
          </div>
          <div class="brand-info">
            <span class="brand-name">{{ pay.brand }} •••• {{ pay.lastDigits }}</span>
            <Tag
              :value="pay.sefaz?.status || 'Pendente'"
              :severity="pay.sefaz?.status === 'Autorizado' ? 'success' : 'warn'"
              style="font-size:10px;margin-top:3px;align-self:flex-start"
            />
          </div>
        </div>

        <!-- Coluna: Parcelas -->
        <div class="col-installments">
          <span class="col-label">Parcelas</span>
          <span class="col-value accent">
            {{ pay.installments > 1 ? pay.installments + ' parcelas' : '1 parcela' }}
          </span>
          <span class="col-sub">
            {{ pay.installments > 1 ? pay.installments + 'x de ' + formatCurrency(pay.amount / pay.installments) : 'À vista' }}
          </span>
        </div>

        <!-- Coluna: Total -->
        <div class="col-total">
          <span class="col-label">Total</span>
          <span class="col-value">{{ formatCurrency(pay.amount) }}</span>
        </div>

        <!-- Coluna: Valor por parcela -->
        <div class="col-inst-value">
          <span class="col-label">Valor por parcela</span>
          <span class="col-value">{{ formatCurrency(pay.amount / (pay.installments || 1)) }}</span>
        </div>

        <!-- Coluna: Datas -->
        <div class="col-dates">
          <div class="dates-row">
            <div class="date-cell">
              <span class="col-label">1ª parcela</span>
              <div class="date-item">
                <i class="pi pi-calendar" style="font-size:10px;color:#94a3b8"></i>
                <span class="col-value">{{ firstInstDate(pay) }}</span>
              </div>
            </div>
            <div class="date-sep"></div>
            <div class="date-cell">
              <span class="col-label">Última parcela</span>
              <div class="date-item">
                <i v-if="pay.installments > 1" class="pi pi-calendar" style="font-size:10px;color:#94a3b8"></i>
                <span class="col-value">{{ pay.installments > 1 ? lastInstDate(pay) : '–' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna: Ação -->
        <div class="col-action">
          <button class="detail-btn" @click="toggleDetail(idx)">
            <span>Ver detalhes</span>
            <i :class="openDetail === idx ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" style="font-size:10px"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Drawer lateral de detalhes -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="openDetail !== null" class="drawer-overlay" @click.self="openDetail = null">
          <div class="drawer-panel">

            <!-- Drawer header -->
            <div class="drawer-header">
              <div class="drawer-title-area">
                <div class="drawer-brand-logo">
                  <i class="pi pi-credit-card" style="font-size:20px;color:#3b82f6"></i>
                </div>
                <div>
                  <div class="drawer-brand-name">
                    {{ currentPay?.brand }} •••• {{ currentPay?.lastDigits }}
                  </div>
                  <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
                    <Tag
                      :value="currentPay?.sefaz?.status || 'Pendente'"
                      :severity="currentPay?.sefaz?.status === 'Autorizado' ? 'success' : 'warn'"
                      style="font-size:10px"
                    />
                    <Tag
                      :value="currentPay?.installments > 1 ? currentPay?.installments + ' parcelas' : '1 parcela'"
                      severity="info"
                      style="font-size:10px"
                    />
                  </div>
                </div>
              </div>
              <div class="drawer-amount-area">
                <span class="drawer-amount-label">Total</span>
                <span class="drawer-amount-value">{{ formatCurrency(currentPay?.amount) }}</span>
                <span class="drawer-amount-sub">
                  {{ currentPay?.installments > 1
                    ? currentPay?.installments + 'x de ' + formatCurrency(currentPay?.amount / currentPay?.installments)
                    : 'À vista' }}
                </span>
              </div>
              <button class="drawer-close" @click="openDetail = null">
                <i class="pi pi-times"></i>
              </button>
            </div>

            <!-- Drawer body -->
            <div class="drawer-body">

              <!-- Dados da transação -->
              <div class="drawer-section">
                <div class="drawer-section-header">
                  <i class="pi pi-receipt" style="color:#3b82f6;font-size:13px"></i>
                  <span>Dados da transação</span>
                </div>
                <div class="drawer-grid">
                  <div class="dfield">
                    <span class="dlabel">NSU</span>
                    <span class="dvalue">{{ currentPay?.nsu || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Meio de pagamento</span>
                    <span class="dvalue">{{ currentPay?.method || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Código autorização</span>
                    <span class="dvalue">{{ currentPay?.authCode || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Forma de pagamento</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.paymentForm || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Data de autorização</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.authDate || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Status</span>
                    <Tag
                      :value="currentPay?.sefaz?.status || 'Pendente'"
                      :severity="currentPay?.sefaz?.status === 'Autorizado' ? 'success' : 'warn'"
                      style="font-size:10px;align-self:flex-start;margin-top:2px"
                    />
                  </div>
                </div>
              </div>

              <!-- Dados fiscais -->
              <div class="drawer-section">
                <div class="drawer-section-header">
                  <i class="pi pi-file" style="color:#3b82f6;font-size:13px"></i>
                  <span>Dados fiscais</span>
                </div>
                <div class="drawer-grid">
                  <div class="dfield">
                    <span class="dlabel">Protocolo SEFAZ</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.protocol || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Código de retorno</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.returnCode || '–' }}</span>
                  </div>
                  <div class="dfield full">
                    <span class="dlabel">Chave de acesso NF-e</span>
                    <span class="dvalue mono">{{ currentPay?.sefaz?.accessKey || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Ambiente</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.environment || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Operação</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.operation || '–' }}</span>
                  </div>
                </div>
              </div>

              <!-- Intermediador -->
              <div class="drawer-section">
                <div class="drawer-section-header">
                  <i class="pi pi-share-alt" style="color:#3b82f6;font-size:13px"></i>
                  <span>Intermediador</span>
                </div>
                <div class="drawer-grid">
                  <div class="dfield">
                    <span class="dlabel">Marketplace</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.intermediaryId || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Instituição de pagamento</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.paymentInstitutionCnpj || '–' }}</span>
                  </div>
                  <div class="dfield full">
                    <span class="dlabel">CNPJ intermediário da transação</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.intermediaryCnpj || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Bandeira</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.brand || currentPay?.brand || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">Autorização Marketplace</span>
                    <span class="dvalue">{{ currentPay?.sefaz?.marketplaceAuth || '–' }}</span>
                  </div>
                </div>
              </div>

              <!-- Informações adicionais -->
              <div class="drawer-section">
                <div class="drawer-section-header">
                  <i class="pi pi-info-circle" style="color:#3b82f6;font-size:13px"></i>
                  <span>Informações adicionais</span>
                </div>
                <div class="drawer-grid">
                  <div class="dfield">
                    <span class="dlabel">Data de criação</span>
                    <span class="dvalue">{{ currentPay?.paidAt || '–' }}</span>
                  </div>
                  <div class="dfield">
                    <span class="dlabel">ID do pagamento</span>
                    <span class="dvalue mono">pay_{{ currentPay?.nsu?.slice(-8) || '00000000' }}</span>
                  </div>
                </div>
              </div>

              <!-- Parcelas detalhadas -->
              <div v-if="currentPay?.installmentDetails?.length" class="drawer-section">
                <div class="drawer-section-header">
                  <i class="pi pi-list" style="color:#3b82f6;font-size:13px"></i>
                  <span>Parcelas</span>
                  <span class="inst-badge">{{ currentPay.installmentDetails.length }}x</span>
                </div>
                <div class="inst-table">
                  <div class="inst-thead">
                    <span>Parcela</span>
                    <span>Vencimento</span>
                    <span>Valor</span>
                    <span>Status</span>
                  </div>
                  <div
                    v-for="inst in currentPay.installmentDetails"
                    :key="inst.number"
                    class="inst-trow"
                  >
                    <span class="inst-num">{{ inst.number }}ª</span>
                    <span>{{ inst.dueDate }}</span>
                    <span style="font-weight:600">{{ formatCurrency(inst.amount) }}</span>
                    <Tag :value="inst.status" :severity="getInstSeverity(inst.status)" style="font-size:10px" />
                  </div>
                </div>
              </div>

            </div>

            <!-- Drawer footer -->
            <div class="drawer-footer">
              <button class="drawer-close-btn" @click="openDetail = null">Fechar</button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Tag from 'primevue/tag'

const props = defineProps({
  payments: { type: Array, default: () => [] },
  billing:  { type: Object, default: () => ({}) },
  payment:  { type: Object, default: null },
})

const openDetail = ref(null)

const currentPay = computed(() =>
  openDetail.value !== null ? props.payments[openDetail.value] : null
)

function toggleDetail(idx) {
  openDetail.value = openDetail.value === idx ? null : idx
}

function firstInstDate(pay) {
  if (pay.installmentDetails?.length) return pay.installmentDetails[0].dueDate
  return pay.paidAt?.split(' ')[0] || '–'
}

function lastInstDate(pay) {
  if (pay.installmentDetails?.length > 1) {
    return pay.installmentDetails[pay.installmentDetails.length - 1].dueDate
  }
  return firstInstDate(pay)
}

function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}

function getInstSeverity(status) {
  const map = { 'Pago': 'success', 'Pendente': 'warn', 'Atrasado': 'danger', 'Cancelado': 'secondary' }
  return map[status] || 'secondary'
}
</script>

<style scoped>
/* ── Cabeçalho da seção ── */
.payments-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px 10px 0 0;
  border-bottom: none;
}

.payments-section-title {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.payments-count-badge {
  background: #eff6ff;
  color: #3b82f6;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid #bfdbfe;
}

/* ── Lista de pagamentos ── */
.payments-list {
  border: 1px solid #e2e8f0;
  border-radius: 0 0 10px 10px;
  background: #ffffff;
  overflow: hidden;
}

.payment-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1.2fr 1.5fr auto;
  align-items: center;
  padding: 14px 24px;
  border-bottom: 1px solid #f1f5f9;
  gap: 20px;
  transition: background 0.15s;
}

.payment-row:last-child { border-bottom: none; }
.payment-row:hover { background: #fafbff; }
.payment-row.expanded { background: #f0f7ff; }

/* Coluna: brand */
.col-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 40px;
  height: 28px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
}

/* Colunas genéricas */
.col-label {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: block;
  margin-bottom: 2px;
}

.col-value {
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
  display: block;
}

.col-value.accent {
  color: #3b82f6;
  font-weight: 700;
}

.col-sub {
  font-size: 11px;
  color: #64748b;
  display: block;
  margin-top: 1px;
}

.col-installments,
.col-total,
.col-inst-value,
.col-dates {
  display: flex;
  flex-direction: column;
}

/* Datas lado a lado */
.dates-row {
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.date-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.date-sep {
  width: 1px;
  background: #e2e8f0;
  margin: 2px 10px 0;
  align-self: stretch;
  flex-shrink: 0;
}

.date-item { display: flex; align-items: center; gap: 4px; }
/* Botão ver detalhes */
.col-action {
  display: flex;
  justify-content: flex-end;
}

.detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  color: #3b82f6;
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.detail-btn:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

/* ── Drawer — sem overlay, flutua sobre o conteúdo ── */
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;          /* deixa cliques passarem para o fundo */
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  pointer-events: all;           /* o painel em si captura cliques */
  width: 480px;
  max-width: 45vw;
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: -6px 0 32px rgba(0,0,0,0.14);
  border-left: 1px solid #e2e8f0;
}

/* Drawer header */
.drawer-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #060e2c;
  flex-shrink: 0;
}

.drawer-title-area {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.drawer-brand-logo {
  width: 44px;
  height: 32px;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.drawer-brand-name {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.drawer-amount-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.drawer-amount-label {
  font-size: 10px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.drawer-amount-value {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1.2;
}

.drawer-amount-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  margin-top: 2px;
}

.drawer-close {
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255,255,255,0.7);
  flex-shrink: 0;
  transition: background 0.15s;
}

.drawer-close:hover { background: rgba(255,255,255,0.2); color: #fff; }

/* Drawer body */
.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.drawer-body::-webkit-scrollbar { width: 4px; }
.drawer-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

/* Seções do drawer */
.drawer-section {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.drawer-section:last-child { border-bottom: none; }

.drawer-section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
}

.inst-badge {
  margin-left: 4px;
  background: #eff6ff;
  color: #3b82f6;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 8px;
  border: 1px solid #bfdbfe;
}

/* Grid de campos do drawer */
.drawer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.dfield {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dfield.full { grid-column: 1 / -1; }

.dlabel {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.dvalue {
  font-size: 12px;
  color: #1e293b;
  font-weight: 500;
  word-break: break-word;
}

.dvalue.mono {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #475569;
  word-break: break-all;
}

/* Tabela de parcelas no drawer */
.inst-table { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }

.inst-thead {
  display: grid;
  grid-template-columns: 52px 1fr 1fr 90px;
  padding: 7px 12px;
  background: #f8fafc;
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #e2e8f0;
}

.inst-trow {
  display: grid;
  grid-template-columns: 52px 1fr 1fr 90px;
  padding: 9px 12px;
  font-size: 12px;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
}

.inst-trow:last-child { border-bottom: none; }

.inst-num { font-weight: 700; color: #3b82f6; }

/* Drawer footer */
.drawer-footer {
  padding: 14px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  flex-shrink: 0;
}

.drawer-close-btn {
  width: 100%;
  padding: 9px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}

.drawer-close-btn:hover { background: #f1f5f9; color: #1e293b; }

/* Animação do drawer */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}

.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.25s ease;
}

.drawer-enter-from { opacity: 0; }
.drawer-enter-from .drawer-panel { transform: translateX(100%); }
.drawer-leave-to { opacity: 0; }
.drawer-leave-to .drawer-panel { transform: translateX(100%); }
</style>
