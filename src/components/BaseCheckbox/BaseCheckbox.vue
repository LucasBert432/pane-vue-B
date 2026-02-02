<script setup lang="ts">
import { Field } from "vee-validate";

interface Props {
  name: string;
  label?: string;
  disabled?: boolean;
  value?: any;
  hint?: string;
  indeterminate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  disabled: false,
  value: true,
  indeterminate: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
}>();

const handleChange = (field: any, event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    const isChecked = target.checked;

    field.onChange(isChecked);

    emit("update:modelValue", isChecked);
    emit("change", isChecked);
  }
};
</script>

<template>
  <Field :name="name" v-slot="{ field, meta, errorMessage }">
    <div class="form-checkbox">
      <label
        :class="[
          'checkbox-label',
          { disabled: disabled, error: meta.touched && errorMessage },
        ]"
      >
        <input
          type="checkbox"
          :id="`checkbox-${name}`"
          v-bind="field"
          :checked="field.value"
          :disabled="disabled"
          :indeterminate="indeterminate"
          :value="value"
          @change="handleChange(field, $event)"
          class="checkbox-input"
        />

        <span class="checkbox-custom">
          <svg
            v-if="field.value"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            class="checkbox-check"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else-if="indeterminate"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            class="checkbox-indeterminate"
          >
            <path
              d="M3 6H9"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </span>

        <span v-if="label" class="checkbox-text">
          {{ label }}
        </span>
      </label>

      <div v-if="hint && !errorMessage" class="checkbox-hint">
        {{ hint }}
      </div>

      <div v-if="meta.touched && errorMessage" class="checkbox-error">
        {{ errorMessage }}
      </div>
    </div>
  </Field>
</template>

<style scoped lang="scss">
.form-checkbox {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checkbox-label {
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  position: relative;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &.error {
    .checkbox-custom {
      border-color: #dc2626;
    }
  }
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;

  &:focus + .checkbox-custom {
    outline: 2px solid #111827;
    outline-offset: 2px;
  }

  &:checked + .checkbox-custom {
    background-color: #111827;
    border-color: #111827;

    .checkbox-check {
      display: block;
    }
  }

  &:indeterminate + .checkbox-custom {
    background-color: #111827;
    border-color: #111827;

    .checkbox-indeterminate {
      display: block;
    }
  }

  &:disabled + .checkbox-custom {
    background-color: #f3f4f6;
    border-color: #d1d5db;
    cursor: not-allowed;

    .checkbox-check,
    .checkbox-indeterminate {
      stroke: #9ca3af;
    }
  }

  &:disabled:checked + .checkbox-custom {
    background-color: #d1d5db;
    border-color: #d1d5db;
  }
}

.checkbox-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  transition: all 0.15s ease;
  flex-shrink: 0;
  margin-top: 2px;

  &:hover {
    border-color: #9ca3af;
  }
}

.checkbox-check,
.checkbox-indeterminate {
  display: none;
}

.checkbox-text {
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
  font-weight: 400;
  margin-top: 1px;

  .disabled & {
    color: #6b7280;
  }
}

.checkbox-hint {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  margin-left: 28px;
  margin-top: 2px;
}

.checkbox-error {
  font-size: 12px;
  color: #dc2626;
  line-height: 1.4;
  margin-left: 28px;
  margin-top: 2px;
}
</style>
