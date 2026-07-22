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
      <span class="page-title-products">
        <i class="pi pi-box" style="font-size:14px"></i>
        LISTAGEM DE PRODUTOS
      </span>
      <div class="page-actions-products">
        <button class="btn-gerenciar">
          <i class="pi pi-sliders-h"></i>
          <span>Gerenciar</span>
          <i class="pi pi-chevron-down btn-chevron"></i>
        </button>
        <button class="btn-importacao" @click="showMassImport = true">
          <i class="pi pi-upload"></i>
          <span>Importação Massiva</span>
        </button>
        <button class="btn-add-produto">
          <i class="pi pi-plus"></i>
          <span>Add. Produto</span>
        </button>
        <button class="btn-exportar">
          <i class="pi pi-file-excel"></i>
          <span>Exportar Excel</span>
        </button>
      </div>
    </div>

    <div class="products-card">
      <Toolbar />
      <ProductsTable :products="products" />
    </div>
  </div>

  <MassImportDialog v-model="showMassImport" />
</template>

<script setup>
import { ref } from 'vue'
import Toolbar from '../components/products/Toolbar.vue'
import ProductsTable from '../components/products/ProductsTable.vue'
import MassImportDialog from '../components/products/MassImportDialog.vue'
import { mockProducts } from '../mocks/productsMock.js'

const products = ref(mockProducts)
const showMassImport = ref(false)
</script>

<style scoped>
.page-title-products {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-actions-products {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Gerenciar button */
.btn-gerenciar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0 12px;
  height: 32px;
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-gerenciar:hover {
  background: #f9fafb;
}

.btn-gerenciar i {
  font-size: 12px;
  color: #6b7280;
}

.btn-chevron {
  font-size: 10px !important;
  color: #9ca3af !important;
}

/* Importação Massiva button */
.btn-importacao {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0 12px;
  height: 32px;
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-importacao:hover {
  background: #f9fafb;
}

.btn-importacao i {
  font-size: 12px;
  color: #6b7280;
}

/* Add. Produto button */
.btn-add-produto {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  padding: 0 14px;
  height: 32px;
  font-size: 12.5px;
  font-weight: 500;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-add-produto:hover {
  background: #2563eb;
}

.btn-add-produto i {
  font-size: 11px;
  color: #ffffff;
}

/* Exportar Excel button */
.btn-exportar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0 12px;
  height: 32px;
  font-size: 12.5px;
  font-weight: 500;
  color: #374151;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-exportar:hover {
  background: #f9fafb;
}

.btn-exportar i {
  font-size: 12px;
  color: #6b7280;
}

/* Products Card */
.products-card {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}
</style>
