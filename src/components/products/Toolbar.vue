<template>
  <div class="products-toolbar">
    <SearchBar v-model="search" placeholder="Pesquisar produtos..." />
    <div class="products-toolbar__right">
      <FilterButton />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchBar from './SearchBar.vue'
import FilterButton from './FilterButton.vue'

const search = ref('')
</script>

<style scoped>
.products-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.products-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
