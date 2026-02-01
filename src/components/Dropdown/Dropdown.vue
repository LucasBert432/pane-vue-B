<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Field } from "vee-validate";

interface DropdownOption {
  label: string;
  value: string;
}

interface Props {
  name: string;
  label: string;
  options: DropdownOption[];
  placeholder?: string;
  searchable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Selecione uma opção",
  searchable: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isOpen = ref(false);
const searchQuery = ref("");
const dropdownRef = ref<HTMLElement | null>(null);

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options;
  }

  const query = searchQuery.value.toLowerCase();
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(query),
  );
});

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const selectOption = (value: string, field: any) => {
  field.onInput(value);
  emit("update:modelValue", value);
  isOpen.value = false;
  searchQuery.value = "";
};

const clearSelection = (field: any) => {
  field.onInput("");
  emit("update:modelValue", "");
  searchQuery.value = "";
};

const getSelectedLabel = (value: string) => {
  const option = props.options.find((opt) => opt.value === value);
  return option?.label || "";
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <Field :name="name" v-slot="{ field, meta, errorMessage }">
    <div class="dropdown-container" ref="dropdownRef">
      <label :for="name" class="dropdown-label">{{ label }}</label>

      <div class="dropdown-wrapper">
        <div
          class="dropdown-trigger"
          :class="{
            'is-open': isOpen,
            'has-error': meta.touched && errorMessage,
            'has-value': field.value,
          }"
          @click="isOpen = !isOpen"
        >
          <span class="selected-value">
            {{ field.value ? getSelectedLabel(field.value) : placeholder }}
          </span>

          <div class="dropdown-actions">
            <button
              v-if="field.value"
              type="button"
              class="clear-btn"
              @click.stop="clearSelection(field)"
              title="Limpar seleção"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <svg
              class="dropdown-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              :class="{ rotated: isOpen }"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <div v-if="isOpen" class="dropdown-menu">
          <div v-if="searchable" class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Buscar..."
              @click.stop
            />
          </div>

          <div class="options-list">
            <div
              v-for="option in filteredOptions"
              :key="option.value"
              class="dropdown-option"
              :class="{ selected: option.value === field.value }"
              @click="selectOption(option.value, field)"
            >
              {{ option.label }}
              <svg
                v-if="option.value === field.value"
                class="check-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div v-if="filteredOptions.length === 0" class="no-results">
              Nenhum resultado encontrado
            </div>
          </div>
        </div>

        <input type="hidden" v-bind="field" />
      </div>

      <div v-if="meta.touched && errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </Field>
</template>

<style scoped lang="scss">
.dropdown-container {
  position: relative;
  width: 100%;
}

.dropdown-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 6px;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-trigger {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    border-color: #9ca3af;
  }

  &:focus-within {
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
    outline: none;
  }

  &.is-open {
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
  }

  &.has-error {
    border-color: #dc2626;

    &:focus-within {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
  }

  &.has-value {
    .selected-value {
      color: #111827;
    }
  }
}

.selected-value {
  font-size: 14px;
  color: #9ca3af;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  border-radius: 4px;

  &:hover {
    color: #111827;
    background: #f3f4f6;
  }

  svg {
    display: block;
  }
}

.dropdown-icon {
  color: #6b7280;
  transition: transform 0.2s ease;

  &.rotated {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 240px;
  overflow: hidden;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-container {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #f9fafb;

  &:focus {
    outline: none;
    border-color: #111827;
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.options-list {
  max-height: 192px;
  overflow-y: auto;
}

.dropdown-option {
  padding: 10px 16px;
  font-size: 14px;
  color: #111827;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f9fafb;
  }

  &.selected {
    background-color: #f3f4f6;
    font-weight: 500;
    color: #111827;
  }
}

.check-icon {
  color: #111827;
  flex-shrink: 0;
}

.no-results {
  padding: 16px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

.error-message {
  margin-top: 4px;
  font-size: 12px;
  color: #dc2626;
  min-height: 18px;
}
</style>
