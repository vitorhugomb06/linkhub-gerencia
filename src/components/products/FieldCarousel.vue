<template>
  <div class="field-carousel">
    <div class="field-carousel__header">
      <button
        class="field-carousel__arrow"
        :class="{ 'field-carousel__arrow--disabled': currentIndex === 0 }"
        :disabled="currentIndex === 0"
        @click="prev"
      >
        <i class="pi pi-chevron-left"></i>
      </button>
      <span class="field-carousel__title">{{ currentCategory.label }}</span>
      <button
        class="field-carousel__arrow"
        :class="{ 'field-carousel__arrow--disabled': currentIndex === categories.length - 1 }"
        :disabled="currentIndex === categories.length - 1"
        @click="next"
      >
        <i class="pi pi-chevron-right"></i>
      </button>
    </div>
    <div class="field-carousel__body">
      <Transition :name="transitionName" mode="out-in">
        <div class="field-carousel__chips" :key="currentIndex">
          <span class="field-carousel__chip" v-for="field in currentCategory.fields" :key="field">
            {{ field }}
          </span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    // [{ label: 'Informações Básicas', fields: ['SKU Grupo', 'Nome', ...] }]
  },
})

const currentIndex = ref(0)
const transitionName = ref('slide-right')

const currentCategory = computed(() => props.categories[currentIndex.value])

function next() {
  if (currentIndex.value < props.categories.length - 1) {
    transitionName.value = 'slide-right'
    currentIndex.value++
  }
}

function prev() {
  if (currentIndex.value > 0) {
    transitionName.value = 'slide-left'
    currentIndex.value--
  }
}
</script>

<style scoped>
.field-carousel {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  overflow: hidden;
}

.field-carousel__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 14px;
}

.field-carousel__title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  font-family: 'Poppins', sans-serif;
  min-width: 180px;
  text-align: center;
}

.field-carousel__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
}

.field-carousel__arrow:hover:not(:disabled) {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

.field-carousel__arrow--disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.field-carousel__arrow i {
  font-size: 12px;
}

.field-carousel__body {
  min-height: 60px;
  display: flex;
  align-items: flex-start;
}

.field-carousel__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
}

.field-carousel__chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
}

/* Slide transitions */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
