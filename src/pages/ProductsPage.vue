<template>
  <div class="app-breadcrumb">
    <div class="breadcrumb-item">
      <a href="#"><i class="pi pi-home"></i> Home</a>
    </div>
    <span class="breadcrumb-separator"><i class="pi pi-chevron-right" style="font-size:10px"></i></span>
    <span class="breadcrumb-current">Produtos</span>
  </div>
  <div class="app-content">
    <div class="page-header">
      <span class="page-title">Listagem de Produtos</span>
      <div class="page-actions">
        <Button label="Gerenciar" icon="pi pi-sliders-h" severity="secondary" outlined size="small" />
        <Button label="Importação Massiva" icon="pi pi-upload" severity="secondary" outlined size="small" />
        <Button label="Add. Produto" icon="pi pi-plus" size="small" />
      </div>
    </div>
    <div class="content-card" style="padding:24px;text-align:center;color:#94a3b8">
      <i class="pi pi-box" style="font-size:48px;margin-bottom:12px;display:block"></i>
      Página de produtos — em construção
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
</script>
