<template>
  <div class="search-bar">
    <i class="pi pi-search search-bar__icon"></i>
    <input
      class="search-bar__input"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Pesquisar...',
  },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0 12px;
  height: 34px;
  width: 220px;
}

.search-bar__icon {
  font-size: 13px;
  color: #9ca3af;
  flex-shrink: 0;
}

.search-bar__input {
  border: none;
  outline: none;
  font-size: 13px;
  color: #374151;
  font-family: 'Inter', sans-serif;
  width: 100%;
  background: transparent;
}

.search-bar__input::placeholder {
  color: #9ca3af;
  font-size: 13px;
}
</style>
