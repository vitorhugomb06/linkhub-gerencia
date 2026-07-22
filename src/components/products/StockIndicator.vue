<template>
  <div class="stock-indicator">
    <span class="stock-indicator__value" :class="value > 0 ? 'stock-indicator__value--positive' : 'stock-indicator__value--zero'">
      {{ value }}
    </span>
    <span class="stock-indicator__icon" :class="value > 0 ? 'stock-indicator__icon--positive' : 'stock-indicator__icon--zero'">
      <i :class="value > 0 ? 'pi pi-box' : 'pi pi-exclamation-triangle'"></i>
    </span>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Number,
    default: 0,
  },
})
</script>

<style scoped>
.stock-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stock-indicator__value {
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.stock-indicator__value--positive {
  color: #3b82f6;
}

.stock-indicator__value--zero {
  color: #ef4444;
}

.stock-indicator__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.stock-indicator__icon--positive {
  color: #22c55e;
}

.stock-indicator__icon--zero {
  color: #ef4444;
}
</style>
