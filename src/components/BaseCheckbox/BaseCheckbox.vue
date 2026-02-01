<template>
  <label :class="$style.wrapper">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span><slot></slot></span>
  </label>
</template>

<script setup>
defineProps({ modelValue: Boolean });
</script>

<style module lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-top: 16px;
}
</style>
