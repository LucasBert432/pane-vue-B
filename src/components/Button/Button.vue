<script setup lang="ts">
import { computed } from "vue";

import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Globe,
  Heart,
  Home,
  Loader2,
  Lock,
  Mail,
  Menu,
  Phone,
  Plus,
  Search,
  Settings,
  Share,
  SortAsc,
  SortDesc,
  Star,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-vue-next";

interface Props {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: "left" | "right" | "only";
  rounded?: boolean;
  minWidth?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
  variant: "primary",
  size: "md",
  loading: false,
  disabled: false,
  fullWidth: false,
  icon: "",
  iconPosition: "left",
  rounded: false,
  minWidth: 320,
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};

const iconComponents: Record<string, any> = {
  "arrow-right": ArrowRight,
  check: Check,
  home: Home,
  user: User,
  search: Search,
  plus: Plus,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  download: Download,
  upload: Upload,
  settings: Settings,
  eye: Eye,
  "eye-off": EyeOff,
  mail: Mail,
  lock: Lock,
  phone: Phone,
  globe: Globe,
  calendar: Calendar,
  "credit-card": CreditCard,
  bell: Bell,
  star: Star,
  heart: Heart,
  share: Share,
  edit: Edit,
  trash: Trash2,
  x: X,
  menu: Menu,
  filter: Filter,
  "sort-asc": SortAsc,
  "sort-desc": SortDesc,
};

const IconComponent = computed(() => {
  if (props.icon && iconComponents[props.icon]) {
    return iconComponents[props.icon];
  }
  return null;
});

const buttonClasses = computed(() => {
  const classes = ["button"];

  classes.push(`button--${props.variant}`);

  classes.push(`button--${props.size}`);

  if (props.loading) classes.push("button--loading");
  if (props.disabled) classes.push("button--disabled");
  if (props.fullWidth) classes.push("button--full-width");
  if (props.rounded) classes.push("button--rounded");
  if (props.icon) {
    classes.push("button--has-icon");
    if (props.iconPosition === "only") {
      classes.push("button--icon-only");
    } else {
      classes.push(`button--icon-${props.iconPosition}`);
    }
  }

  return classes;
});

const iconSize = computed(() => {
  switch (props.size) {
    case "sm":
      return 16;
    case "md":
      return 18;
    case "lg":
      return 20;
    case "xl":
      return 24;
    default:
      return 18;
  }
});

const buttonStyles = computed(() => {
  const styles: Record<string, string> = {};

  if (!props.fullWidth) {
    const minWidth =
      typeof props.minWidth === "number"
        ? `${props.minWidth}px`
        : props.minWidth;

    styles.minWidth = minWidth;
  }

  return styles;
});
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :style="buttonStyles"
    :disabled="disabled || loading"
    @click="handleClick"
    :title="
      iconPosition === 'only' && $slots.default
        ? ($slots.default()?.[0]?.children as string)
        : undefined
    "
  >
    <span v-if="loading" class="button__loading">
      <Loader2 :size="iconSize" class="button__spinner" />
    </span>

    <template v-else-if="IconComponent">
      <component :is="IconComponent" :size="iconSize" class="button__icon" />
    </template>

    <span v-if="iconPosition !== 'only'" class="button__content">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  position: relative;
  user-select: none;
  line-height: 1;
  box-sizing: border-box;
  max-width: 100%;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover:not(:disabled):not(.button--loading) {
    transform: translateY(-1px);
  }

  &:active:not(:disabled):not(.button--loading) {
    transform: translateY(0);
  }
}

.button--sm {
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
}

.button--md {
  height: 40px;
  padding: 0 16px;
  font-size: 14px;
}

.button--lg {
  height: 48px;
  padding: 0 20px;
  font-size: 15px;
}

.button--xl {
  height: 56px;
  padding: 0 24px;
  font-size: 16px;
}

.button--primary {
  background: #111827;
  color: white;
  border: 1px solid #111827;

  &:hover:not(:disabled) {
    background: #374151;
    border-color: #374151;
  }

  &:active:not(:disabled) {
    background: #1f2937;
    border-color: #1f2937;
  }
}

.button--secondary {
  background: white;
  color: #111827;
  border: 1px solid #d1d5db;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:active:not(:disabled) {
    background: #f3f4f6;
    border-color: #6b7280;
  }
}

.button--outline {
  background: transparent;
  color: #111827;
  border: 1px solid #111827;

  &:hover:not(:disabled) {
    background: #111827;
    color: white;
  }

  &:active:not(:disabled) {
    background: #374151;
    border-color: #374151;
  }
}

.button--ghost {
  background: transparent;
  color: #111827;
  border: 1px solid transparent;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }

  &:active:not(:disabled) {
    background: #e5e7eb;
  }
}

.button--danger {
  background: #dc2626;
  color: white;
  border: 1px solid #dc2626;

  &:hover:not(:disabled) {
    background: #b91c1c;
    border-color: #b91c1c;
  }

  &:active:not(:disabled) {
    background: #991b1b;
    border-color: #991b1b;
  }
}

.button--loading {
  cursor: wait;

  .button__content {
    opacity: 0.8;
  }
}

.button--disabled {
  cursor: not-allowed;

  &.button--primary {
    background: #9ca3af;
    border-color: #9ca3af;
  }

  &.button--secondary,
  &.button--outline,
  &.button--ghost {
    color: #9ca3af;
    border-color: #e5e7eb;
  }
}

.button--full-width {
  width: 100% !important;
  min-width: 100% !important;
}

.button--icon-only {
  padding: 0;
  width: auto;
  min-width: auto !important;
  aspect-ratio: 1/1;

  &.button--sm {
    width: 32px;
    height: 32px;
    padding: 0;
  }

  &.button--md {
    width: 40px;
    height: 40px;
    padding: 0;
  }

  &.button--lg {
    width: 48px;
    height: 48px;
    padding: 0;
  }

  &.button--xl {
    width: 56px;
    height: 56px;
    padding: 0;
  }
}

.button--has-icon:not(.button--icon-only) {
  &.button--icon-left {
    .button__content {
      order: 2;
    }
    .button__icon {
      order: 1;
    }
  }

  &.button--icon-right {
    .button__content {
      order: 1;
    }
    .button__icon {
      order: 2;
    }
  }
}

.button__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button__loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button__spinner {
  animation: button-spin 1s linear infinite;
}

@keyframes button-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

@media (max-width: 640px) {
  .button:not(.button--full-width):not(.button--icon-only) {
    min-width: 280px !important;
  }
}

@media (max-width: 480px) {
  .button:not(.button--full-width):not(.button--icon-only) {
    min-width: 240px !important;
  }
}
</style>
