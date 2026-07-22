<template>
  <div class="products-table-wrap">
    <table class="products-table">
      <thead class="products-table__head">
        <tr>
          <th class="products-table__th">
            <div class="products-table__th-inner">
              SKU GRUPO
              <i class="pi pi-sort-alt products-table__sort-icon"></i>
            </div>
          </th>
          <th class="products-table__th">IMAGEM</th>
          <th class="products-table__th">
            <div class="products-table__th-inner">
              TÍTULO
              <i class="pi pi-sort-alt products-table__sort-icon"></i>
            </div>
          </th>
          <th class="products-table__th">TIPO DE PRODUTO</th>
          <th class="products-table__th">CATEGORIA</th>
          <th class="products-table__th">
            <div class="products-table__th-inner">
              MARCA
              <i class="pi pi-sort-alt products-table__sort-icon"></i>
            </div>
          </th>
          <th class="products-table__th">
            <div class="products-table__th-inner">
              MODELO
              <i class="pi pi-sort-alt products-table__sort-icon"></i>
            </div>
          </th>
          <th class="products-table__th">
            <div class="products-table__th-inner">
              PREÇO PADRÃO
              <i class="pi pi-sort-alt products-table__sort-icon"></i>
            </div>
          </th>
          <th class="products-table__th">
            <div class="products-table__th-inner">
              ESTOQUE TOTAL
              <i class="pi pi-sort-alt products-table__sort-icon"></i>
            </div>
          </th>
          <th class="products-table__th">
            <div class="products-table__th-inner">
              STATUS
              <i class="pi pi-sort-alt products-table__sort-icon"></i>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <ProductRow
          v-for="product in products"
          :key="product.skuGrupo"
          :product="product"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import ProductRow from './ProductRow.vue'

defineProps({
  products: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.products-table-wrap {
  width: 100%;
  overflow-x: auto;
  background: #ffffff;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
}

.products-table__head {
  background: #f8fafc;
}

.products-table__th {
  padding: 10px 14px;
  text-align: left;
  font-size: 11.5px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
  font-family: 'Inter', sans-serif;
}

.products-table__th-inner {
  display: flex;
  align-items: center;
  gap: 4px;
}

.products-table__sort-icon {
  font-size: 10px;
  color: #9ca3af;
}
</style>
