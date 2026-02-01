<template>
  <div :class="$style.field">
    <label :class="$style.label">
      {{ label }} <span v-if="required">*</span>
    </label>

    <input
      :type="type"
      :value="modelValue"
      :class="[$style.input, error && $style.error]"
      :disabled="disabled"
      @input="onInput"
    />

    <small v-if="error" :class="$style.errorText">{{ error }}</small>
    <small v-else-if="hint" :class="$style.hint">{{ hint }}</small>
  </div>
</template>

<script setup lang="ts">
function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
defineProps<{
  label: string;
  modelValue?: string;
  type?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<style module lang="scss">
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.label {
  font-size: 14px;
  margin-bottom: 6px;
}

.input {
  padding: 12px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 14px;
}

.input:disabled {
  background: #f5f5f5;
}

.error {
  border-color: #e53935;
}

.errorText {
  color: #e53935;
  font-size: 12px;
  margin-top: 4px;
}

.hint {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>
