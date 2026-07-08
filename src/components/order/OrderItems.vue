<template>
  <div class="order-section">
    <div class="section-header">
      <i class="pi pi-shopping-cart" style="color:#3b82f6"></i>
      <span class="section-title">ITENS DO PEDIDO</span>
    </div>

    <div class="split-body">

      <!-- LEFT: Lista de itens com scroll a partir de 5 -->
      <div class="items-side">
        <div class="sub-header">
          <i class="pi pi-box" style="color:#3b82f6;font-size:13px"></i>
          <span class="sub-title">PRODUTOS</span>
          <span class="items-count-badge">{{ items.length }} {{ items.length === 1 ? 'item' : 'itens' }}</span>
        </div>

        <!-- Table header -->
        <div class="items-table-header">
          <div class="col-product">Produto</div>
          <div class="col-qty">Qtd</div>
          <div class="col-unit">Unitário</div>
          <div class="col-total">Total</div>
        </div>

        <!-- Scrollable rows — max height = 5 items (~72px each) -->
        <div class="items-scroll" :class="{ 'has-scroll': items.length > 5 }">
          <div v-for="item in items" :key="item.id" class="items-table-row">
            <div class="col-product">
              <div class="item-product">
                <div class="item-image">
                  <img v-if="item.image" :src="item.image" :alt="item.name" />
                  <div v-else class="item-image-placeholder">
                    <i class="pi pi-image"></i>
                  </div>
                </div>
                <div class="item-info">
                  <div class="item-name">
                    {{ item.name }}
                    <i class="pi pi-external-link" style="font-size:10px;color:#94a3b8;margin-left:3px;cursor:pointer"></i>
                  </div>
                  <div class="item-meta">
                    <span>SKU: <strong>{{ item.sku }}</strong></span>
                    <span class="sep">·</span>
                    <span>Código de Referência: <strong>{{ item.refCode }}</strong></span>
                    <span class="sep">·</span>
                    <span>EAN: <strong>{{ item.ean }}</strong></span>
                    <template v-if="item.primaryFeature">
                      <span class="sep">·</span>
                      <span>Característica Primária: <strong>{{ item.primaryFeature }}</strong></span>
                    </template>
                    <template v-if="item.variant">
                      <span class="sep">·</span>
                      <span><strong>{{ item.variant }}</strong></span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-qty">{{ item.quantity }}</div>
            <div class="col-unit">{{ formatCurrency(item.unitPrice) }}</div>
            <div class="col-total"><strong>{{ formatCurrency(item.totalPrice) }}</strong></div>
          </div>
        </div>
      </div>

      <!-- Divider vertical -->
      <div class="v-sep"></div>

      <!-- RIGHT: Resumo financeiro -->
      <div class="summary-side">
        <div class="sub-header">
          <i class="pi pi-file-edit" style="color:#3b82f6;font-size:13px"></i>
          <span class="sub-title">INFORMAÇÕES DO PEDIDO</span>
        </div>

        <div class="summary-rows">
          <div class="summary-row">
            <span class="summary-label">Sub Total</span>
            <span class="summary-value">{{ formatCurrency(totals.subtotal) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Frete (+)</span>
            <span class="summary-value">{{ formatCurrency(totals.shipping) }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Desconto (-)</span>
            <span class="summary-value">{{ formatCurrency(totals.discount) }}</span>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-total-row">
          <span class="summary-total-label">Total</span>
          <span class="summary-total-value">{{ formatCurrency(totals.total) }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  items:  { type: Array,  default: () => [] },
  totals: { type: Object, default: () => ({}) }
})

function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
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

/* Split */
.split-body {
  display: flex;
  align-items: stretch;
}

.items-side {
  flex: 1;
  min-width: 0;
  padding: 20px 20px 0;
  display: flex;
  flex-direction: column;
}

.v-sep {
  width: 1px;
  background: #e2e8f0;
  flex-shrink: 0;
}

.summary-side {
  width: 240px;
  flex-shrink: 0;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
}

/* Sub headers */
.sub-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}

.sub-title {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.items-count-badge {
  margin-left: 4px;
  background: #eff6ff;
  color: #3b82f6;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 10px;
  border: 1px solid #bfdbfe;
}

/* Summary left */
.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 12px;
  color: #64748b;
}

.summary-value {
  font-size: 12px;
  color: #1e293b;
  font-weight: 500;
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 14px 0 10px;
}

.summary-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
}

.summary-total-label {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.summary-total-value {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

/* Items table */
.items-table-header {
  display: grid;
  grid-template-columns: 1fr 60px 100px 100px;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px 6px 0 0;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}

/* Scroll: height = 5 items × ~72px = 360px */
.items-scroll {
  border: 1px solid #e2e8f0;
  border-top: none;
  border-radius: 0 0 6px 6px;
  margin-bottom: 20px;
}

.items-scroll.has-scroll {
  max-height: 360px;
  overflow-y: auto;
}

.items-scroll::-webkit-scrollbar { width: 4px; }
.items-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

.items-table-row {
  display: grid;
  grid-template-columns: 1fr 60px 100px 100px;
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
}

.items-table-row:last-child {
  border-bottom: none;
}

.col-qty, .col-unit, .col-total {
  font-size: 12px;
  color: #1e293b;
}

.col-total { font-weight: 600; }

.item-product {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.item-image {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-image-placeholder {
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  font-size: 18px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.item-name {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  font-size: 10px;
  color: #64748b;
}

.sep {
  color: #cbd5e1;
}
</style>
