<template>
  <div class="status-timeline-card">
    <!-- Status card top right -->
    <div class="timeline-status-card">
      <div class="timeline-status-title">{{ currentStep.label }}</div>
      <div v-if="currentStep.description" class="timeline-status-desc">{{ currentStep.description }}</div>
      <div v-if="currentStep.date" class="timeline-status-date">{{ currentStep.date }}</div>
    </div>

    <!-- Horizontal track -->
    <div class="timeline-track">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="timeline-step"
        :class="{
          completed: step.completed,
          active: step.active,
          pending: !step.completed && !step.active
        }"
      >
        <div v-if="index > 0" class="timeline-connector" :class="{ filled: steps[index - 1].completed }"></div>
        <div class="timeline-circle">
          <i :class="step.icon"></i>
        </div>
        <div class="timeline-step-info">
          <div class="timeline-step-label">{{ step.label }}</div>
          <div v-if="step.date" class="timeline-step-date">{{ step.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  steps: { type: Array, default: () => [] }
})

const currentStep = computed(() =>
  props.steps.find(s => s.active) || props.steps[props.steps.length - 1] || {}
)
</script>

<style scoped>
.status-timeline-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 24px 32px 20px;
  margin-bottom: 16px;
  position: relative;
  min-height: 140px;
}

.timeline-status-card {
  position: absolute;
  top: 16px;
  right: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.timeline-status-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.timeline-status-desc {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 6px;
}

.timeline-status-date {
  font-size: 11px;
  color: #94a3b8;
}

.timeline-track {
  display: flex;
  align-items: flex-start;
  padding: 16px 0 8px;
  gap: 0;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.timeline-connector {
  position: absolute;
  top: 20px;
  right: 50%;
  left: -50%;
  height: 2px;
  background: #e2e8f0;
  z-index: 0;
}

.timeline-connector.filled {
  background: #3b82f6;
}

.timeline-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e2e8f0;
  background: #ffffff;
  position: relative;
  z-index: 1;
  transition: all 0.2s;
}

.timeline-circle i {
  font-size: 16px;
  color: #cbd5e1;
}

.timeline-step.completed .timeline-circle {
  border-color: #3b82f6;
  background: #eff6ff;
}
.timeline-step.completed .timeline-circle i { color: #3b82f6; }

.timeline-step.active .timeline-circle {
  border-color: #3b82f6;
  background: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59,130,246,0.15);
}
.timeline-step.active .timeline-circle i { color: #ffffff; }

.timeline-step-info {
  margin-top: 10px;
  text-align: center;
  max-width: 120px;
}

.timeline-step-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  line-height: 1.3;
}

.timeline-step.active .timeline-step-label,
.timeline-step.completed .timeline-step-label { color: #1e293b; }

.timeline-step-date {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 3px;
}
</style>
