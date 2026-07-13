<template>
  <!-- Breadcrumb teleported to the dedicated bar between topbar and content -->
  <Teleport to="#breadcrumb-bar">
    <div class="page-breadcrumb">
      <a href="#"><i class="pi pi-home"></i> Home</a>
      <span>›</span>
      <span class="page-breadcrumb__current">Relatórios</span>
    </div>
  </Teleport>

  <div class="app-content">

    <div class="page-header">
      <span class="page-title">
        <i class="pi pi-chart-line" style="margin-right:6px"></i>
        Relatórios
      </span>
    </div>

    <div class="reports-grid">
      <div class="report-card" @click="$router.push('/relatorios/vendas-por-canal')">
        <div class="report-card__icon report-card__icon--blue">
          <i class="pi pi-chart-bar"></i>
        </div>
        <div class="report-card__content">
          <h3 class="report-card__title">Vendas por Canal</h3>
          <p class="report-card__desc">Análise de vendas segmentada por marketplace com filtros de categoria, situação e período.</p>
        </div>
        <i class="pi pi-chevron-right report-card__arrow"></i>
      </div>

      <div class="report-card" @click="$router.push('/relatorios/produtos-mais-vendidos')">
        <div class="report-card__icon report-card__icon--green">
          <i class="pi pi-star"></i>
        </div>
        <div class="report-card__content">
          <h3 class="report-card__title">Produtos Mais Vendidos</h3>
          <p class="report-card__desc">Ranking dos produtos com maior volume de vendas por período e canal.</p>
        </div>
        <i class="pi pi-chevron-right report-card__arrow"></i>
      </div>

      <div class="report-card" @click="$router.push('/relatorios/vendas-anuais')">
        <div class="report-card__icon report-card__icon--purple">
          <i class="pi pi-calendar"></i>
        </div>
        <div class="report-card__content">
          <h3 class="report-card__title">Vendas Anuais</h3>
          <p class="report-card__desc">Visão consolidada das vendas mês a mês ao longo do ano.</p>
        </div>
        <i class="pi pi-chevron-right report-card__arrow"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.reports-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
}

.report-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  transform: translateY(-1px);
  border-color: #3b82f6;
}

.report-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.report-card__icon i {
  font-size: 22px;
}

.report-card__icon--blue {
  background: #eff6ff;
  color: #3b82f6;
}

.report-card__icon--blue i { color: #3b82f6; }

.report-card__icon--green {
  background: #ecfdf5;
  color: #10b981;
}

.report-card__icon--green i { color: #10b981; }

.report-card__icon--purple {
  background: #f5f3ff;
  color: #8b5cf6;
}

.report-card__icon--purple i { color: #8b5cf6; }

.report-card__content {
  flex: 1;
  min-width: 0;
}

.report-card__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.report-card__desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.report-card__arrow {
  font-size: 14px;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color 0.2s, transform 0.2s;
}

.report-card:hover .report-card__arrow {
  color: #3b82f6;
  transform: translateX(2px);
}
</style>
