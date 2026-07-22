<template>
  <button class="filter-btn">
    <i class="pi pi-sliders-h filter-btn__icon"></i>
    <span class="filter-btn__label">Filtros</span>
  </button>
</template>

<script setup>
</script>

<style scoped>
.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0 14px;
  height: 34px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}

.filter-btn:hover {
  background: #f9fafb;
}

.filter-btn__icon {
  font-size: 13px;
  color: #6b7280;
}

.filter-btn__label {
  font-size: 13px;
  color: #374151;
  font-family: 'Inter', sans-serif;
}
</style>
