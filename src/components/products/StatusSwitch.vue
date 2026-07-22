<template>
  <label class="status-switch">
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
    <span class="status-switch__slider"></span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.status-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  cursor: pointer;
}

.status-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.status-switch__slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.status-switch__slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  left: 2px;
  bottom: 2px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.status-switch input:checked + .status-switch__slider {
  background-color: #3b82f6;
}

.status-switch input:checked + .status-switch__slider::before {
  transform: translateX(16px);
}
</style>
