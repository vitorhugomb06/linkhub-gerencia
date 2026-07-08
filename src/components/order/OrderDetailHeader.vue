<template>
  <div class="order-detail-header">
    <!-- Left: order number + status + channel id -->
    <div class="order-header-left">
      <div class="order-number-row">
        <span class="order-number-label">NÚMERO DO PEDIDO:</span>
        <span class="order-number-value">#{{ order.number }}</span>
        <Tag :value="order.status" :severity="getStatusSeverity(order.status)" class="order-status-tag" />
      </div>
      <div class="order-ids-row">
        <div class="order-channel-row">
          <i class="pi pi-shopping-bag" style="font-size:12px;color:rgba(255,255,255,0.5)"></i>
          <span class="order-channel-label">ID DO PEDIDO NO CANAL:</span>
          <span class="order-channel-value">{{ order.channelId }}</span>
        </div>
        <div class="order-channel-row">
          <i class="pi pi-database" style="font-size:12px;color:rgba(255,255,255,0.5)"></i>
          <span class="order-channel-label">ID DO PEDIDO ERP:</span>
          <span class="order-channel-value">{{ order.erpId }}</span>
        </div>
      </div>
    </div>

    <!-- Right: marketplace logo -->
    <div class="order-header-right">
      <div class="marketplace-badge">
        <div class="marketplace-icon">
          <i class="pi pi-building" style="font-size:18px;color:#3b82f6"></i>
        </div>
        <span class="marketplace-name">{{ order.marketplace }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  order: { type: Object, required: true }
})

function getStatusSeverity(status) {
  const map = {
    'Aguardando Aprovação': 'warn',
    'Aprovado': 'success',
    'Cancelado': 'danger',
    'Em separação': 'info',
    'Enviado': 'info',
    'Entregue': 'success',
  }
  return map[status] || 'secondary'
}
</script>

<style scoped>
.order-detail-header {
  background-color: #060e2c;
  border-radius: 10px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.order-header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-number-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.order-number-label {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-number-value {
  font-size: 22px;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.order-status-tag {
  font-size: 11px;
  font-weight: 600;
}

.order-ids-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.order-channel-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.order-channel-label {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.order-channel-value {
  font-size: 12px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}

.order-header-right {
  display: flex;
  align-items: center;
}

.marketplace-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 10px 16px;
}

.marketplace-icon {
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marketplace-name {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
}
</style>
