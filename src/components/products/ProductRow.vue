<template>
  <tr class="product-row">
    <!-- SKU GRUPO -->
    <td class="product-row__sku">
      <div class="product-row__sku-text">{{ product.skuGrupo }}</div>
      <div class="product-row__sku-icon">
        <i class="pi pi-copy"></i>
      </div>
    </td>

    <!-- IMAGEM -->
    <td class="product-row__image">
      <div class="product-row__image-wrap">
        <img :src="product.imagem" :alt="product.titulo" class="product-row__img" />
      </div>
    </td>

    <!-- TÍTULO -->
    <td class="product-row__title">
      <span class="product-row__title-text">{{ product.titulo }}</span>
    </td>

    <!-- TIPO DE PRODUTO -->
    <td class="product-row__type">
      <div class="product-row__type-wrap">
        <span class="product-row__type-text">{{ product.tipoProduto }}</span>
        <span class="product-row__type-icon">
          <i class="pi pi-info-circle"></i>
        </span>
      </div>
    </td>

    <!-- CATEGORIA -->
    <td class="product-row__category">
      <span class="product-row__category-text">{{ product.categoria }}</span>
    </td>

    <!-- MARCA -->
    <td class="product-row__brand">
      <span>{{ product.marca }}</span>
    </td>

    <!-- MODELO -->
    <td class="product-row__model">
      <span>{{ product.modelo }}</span>
    </td>

    <!-- PREÇO PADRÃO -->
    <td class="product-row__price">
      <span>{{ product.precopadrao }}</span>
    </td>

    <!-- ESTOQUE TOTAL -->
    <td class="product-row__stock">
      <StockIndicator :value="product.estoqueTotal" />
    </td>

    <!-- STATUS -->
    <td class="product-row__status">
      <StatusSwitch v-model="localStatus" />
    </td>
  </tr>
</template>

<script setup>
import { ref, watch } from 'vue'
import StatusSwitch from './StatusSwitch.vue'
import StockIndicator from './StockIndicator.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const localStatus = ref(props.product.status)

watch(() => props.product.status, (val) => {
  localStatus.value = val
})
</script>

<style scoped>
.product-row {
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
}

.product-row:hover {
  background: #f8fafc;
}

.product-row td {
  padding: 12px 14px;
  vertical-align: middle;
  font-size: 12.5px;
  color: #374151;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
}

.product-row__sku {
  min-width: 80px;
}

.product-row__sku-text {
  font-size: 12.5px;
  font-weight: 600;
  color: #374151;
  font-family: 'Inter', sans-serif;
}

.product-row__sku-icon {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 11px;
}

.product-row__image-wrap {
  width: 60px;
  height: 60px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.product-row__img {
  width: 56px;
  height: 56px;
  object-fit: cover;
}

.product-row__title {
  max-width: 200px;
}

.product-row__title-text {
  font-size: 12.5px;
  color: #374151;
  font-family: 'Inter', sans-serif;
}

.product-row__type-wrap {
  display: flex;
  align-items: center;
  gap: 5px;
}

.product-row__type-text {
  font-size: 12.5px;
  color: #374151;
  font-family: 'Inter', sans-serif;
}

.product-row__type-icon {
  color: #3b82f6;
  font-size: 13px;
  display: flex;
  align-items: center;
}

.product-row__category-text {
  font-size: 12.5px;
  color: #374151;
  font-family: 'Inter', sans-serif;
  white-space: normal;
  max-width: 160px;
  display: block;
  line-height: 1.4;
}
</style>
