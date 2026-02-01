<template>
  <div :class="$style.card">
    <span :class="$style.label">{{ label }}</span>
    <strong :class="$style.value">{{ value }}</strong>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
}>();
</script>

<style module lang="scss">
.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.label {
  font-size: 14px;
  color: #666;
}

.value {
  margin-top: 8px;
  font-size: 24px;
}
</style>
