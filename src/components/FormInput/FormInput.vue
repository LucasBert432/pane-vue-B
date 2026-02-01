<script setup lang="ts">
import { Field } from "vee-validate";
import { ref, computed } from "vue";

const props = defineProps<{
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  mask?: (value: string) => string;
  as?: string;
  showPasswordToggle?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const showPassword = ref(false);

const shouldShowPasswordToggle = computed(() => {
  return (
    props.type === "password" &&
    (props.showPasswordToggle === true ||
      props.showPasswordToggle === undefined)
  );
});

const inputType = computed(() => {
  if (props.type === "password" && showPassword.value) {
    return "text";
  }
  return props.type || "text";
});

const handleInput = (
  e: Event,
  field: any,
  mask?: (value: string) => string,
) => {
  const target = e.target as HTMLInputElement;
  let value = target.value;

  if (mask) {
    value = mask(value);
  }

  field.onInput(value);
  emit("update:modelValue", value);
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="form-group">
    <label :for="name" class="label">{{ label }}</label>
    <Field :name="name" v-slot="{ field, meta, errorMessage }">
      <div class="field-wrapper">
        <div class="input-container">
          <component
            :is="as || 'input'"
            v-bind="field"
            :id="name"
            :type="inputType"
            :placeholder="placeholder"
            :class="[
              'input',
              {
                'is-invalid': meta.touched && !meta.valid,
                'is-valid': meta.touched && meta.valid && !meta.pending,
                'has-toggle': shouldShowPasswordToggle,
              },
            ]"
            @input="(e) => handleInput(e, field, mask)"
            @blur="field.onBlur"
          />

          <button
            v-if="shouldShowPasswordToggle"
            type="button"
            class="password-toggle-btn"
            @click="togglePasswordVisibility"
            :title="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
            tabindex="-1"
          >
            <svg
              v-if="!showPassword"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              class="eye-icon"
            >
              <path
                d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              class="eye-slash-icon"
            >
              <path
                d="M9.9 4.24002C10.5883 4.0789 11.2931 3.99836 12 4.00003C19 4.00003 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2219 9.18488 10.8539C9.34884 10.4859 9.58525 10.1547 9.88 9.88003M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06003L17.94 17.94Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 1L23 23"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div v-if="hint && !errorMessage" class="hint">{{ hint }}</div>
        <div v-if="meta.touched && errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </Field>
  </div>
</template>

<style scoped lang="scss">
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.label {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  display: block;
  margin-bottom: 4px;
}

.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  font-size: 14px;
  font-family: inherit;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #111827;
  transition: all 0.15s ease;
  box-sizing: border-box;
  line-height: normal;

  &:focus {
    outline: none;
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
    opacity: 1;
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &.has-toggle {
    padding-right: 44px;
  }
}

.input.is-invalid {
  border-color: #dc2626;

  &:focus {
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
}

.input.is-valid {
  border-color: #10b981;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
}

.input[type="checkbox"],
.input[type="radio"] {
  width: auto;
  height: auto;
  padding-right: 0;
}

select.input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
  cursor: pointer;

  &.has-toggle {
    padding-right: 44px;
    background-position: right 44px center;
  }
}

.password-toggle-btn {
  position: absolute;
  right: 12px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  width: 24px;
  height: 24px;
  margin-top: 20px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.15s ease;
  z-index: 2;

  &:hover {
    color: #111827;
    background: #f3f4f6;
  }

  &:active {
    background: #e5e7eb;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.1);
  }

  svg {
    display: block;
    width: 20px;
    height: 20px;
  }
}

.hint {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  margin-top: 4px;
  min-height: 16px;
}

.error-message {
  font-size: 12px;
  color: #dc2626;
  line-height: 1.4;
  margin-top: 4px;
  min-height: 16px;
}
</style>
